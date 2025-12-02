import mqtt from 'mqtt';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// ============================================
// Configuration
// ============================================

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtts://broker.hivemq.com:8883';
const MQTT_USERNAME = process.env.MQTT_USERNAME || '';
const MQTT_PASSWORD = process.env.MQTT_PASSWORD || '';
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'swamp/sensors/+/data';
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗');
  process.exit(1);
}

// ============================================
// Message Schema Validation
// ============================================

const SensorDataSchema = z.object({
  sensorId: z.string().min(1, 'Sensor ID is required'),
  farmId: z.string().uuid('Farm ID must be a valid UUID').optional(),
  timestamp: z.string().datetime().optional(),
  soilMoisture: z.number().min(0).max(100).optional(),
  temperature: z.number().optional(),
  humidity: z.number().min(0).max(100).optional(),
  waterUsed: z.number().min(0).optional(),
});

type SensorData = z.infer<typeof SensorDataSchema>;

// ============================================
// Supabase Client
// ============================================

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ============================================
// MQTT Client
// ============================================

const mqttOptions: mqtt.IClientOptions = {
  clean: true,
  reconnectPeriod: 5000,
  connectTimeout: 30000,
  ...(MQTT_USERNAME && MQTT_PASSWORD && {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
  }),
};

console.log('🔌 Connecting to MQTT broker:', MQTT_BROKER_URL.replace(/\/\/.*@/, '//***@'));
const client = mqtt.connect(MQTT_BROKER_URL, mqttOptions);

// ============================================
// Helper Functions
// ============================================

async function findSensorBySensorId(sensorId: string): Promise<{ id: string; farm_id: string } | null> {
  const { data, error } = await supabase
    .from('sensors')
    .select('id, farm_id')
    .eq('sensor_id', sensorId)
    .single();

  if (error) {
    console.error(`❌ Error finding sensor ${sensorId}:`, error.message);
    return null;
  }

  return data;
}

async function insertSensorReading(data: SensorData, sensorDbId: string, farmId: string): Promise<void> {
  const reading = {
    sensor_id: sensorDbId,
    farm_id: farmId,
    timestamp: data.timestamp || new Date().toISOString(),
    soil_moisture: data.soilMoisture ?? null,
    temperature: data.temperature ?? null,
    humidity: data.humidity ?? null,
    water_used: data.waterUsed ?? 0,
  };

  const { error } = await supabase
    .from('sensor_readings')
    .insert(reading);

  if (error) {
    console.error('❌ Error inserting reading:', error.message);
    throw error;
  }

  console.log(`✅ Inserted reading for sensor ${data.sensorId}`);
}

async function checkAndCreateAlerts(
  sensorDbId: string,
  farmId: string,
  reading: SensorData
): Promise<void> {
  // Get user preferences for this farm
  const { data: farm } = await supabase
    .from('farms')
    .select('owner_id')
    .eq('id', farmId)
    .single();

  if (!farm) return;

  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', farm.owner_id)
    .single();

  if (!preferences) return;

  const alerts: Array<{ type: 'critical' | 'warning' | 'info'; message: string }> = [];

  // Check soil moisture threshold
  if (reading.soilMoisture !== undefined && reading.soilMoisture < preferences.moisture_threshold) {
    alerts.push({
      type: reading.soilMoisture < preferences.moisture_threshold * 0.7 ? 'critical' : 'warning',
      message: `Soil moisture is ${reading.soilMoisture.toFixed(1)}% (below threshold of ${preferences.moisture_threshold}%). Consider irrigation.`,
    });
  }

  // Check temperature threshold
  if (reading.temperature !== undefined && reading.temperature > preferences.temp_threshold) {
    alerts.push({
      type: reading.temperature > preferences.temp_threshold * 1.2 ? 'critical' : 'warning',
      message: `Temperature is ${reading.temperature.toFixed(1)}°C (above threshold of ${preferences.temp_threshold}°C).`,
    });
  }

  // Create alerts
  for (const alert of alerts) {
    // Check if similar alert already exists
    const { data: existing } = await supabase
      .from('alerts')
      .select('id')
      .eq('sensor_id', sensorDbId)
      .eq('status', 'active')
      .eq('type', alert.type)
      .gte('created_at', new Date(Date.now() - 3600000).toISOString()) // Last hour
      .limit(1)
      .single();

    if (!existing) {
      await supabase.from('alerts').insert({
        sensor_id: sensorDbId,
        farm_id: farmId,
        user_id: farm.owner_id,
        type: alert.type,
        message: alert.message,
        status: 'active',
      });
    }
  }
}

// ============================================
// MQTT Event Handlers
// ============================================

client.on('connect', () => {
  console.log('✅ Connected to MQTT broker');
  console.log(`📡 Subscribing to topic: ${MQTT_TOPIC}`);
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error('❌ Subscription error:', err);
    } else {
      console.log('✅ Subscribed successfully');
    }
  });
});

client.on('error', (error) => {
  console.error('❌ MQTT error:', error);
});

client.on('reconnect', () => {
  console.log('🔄 Reconnecting to MQTT broker...');
});

client.on('close', () => {
  console.log('⚠️  MQTT connection closed');
});

client.on('message', async (topic, message) => {
  try {
    const messageStr = message.toString();
    console.log(`📨 Received message on ${topic}:`, messageStr);

    // Parse JSON
    let data: unknown;
    try {
      data = JSON.parse(messageStr);
    } catch (parseError) {
      console.error('❌ Invalid JSON:', parseError);
      return;
    }

    // Validate schema
    const validationResult = SensorDataSchema.safeParse(data);
    if (!validationResult.success) {
      console.error('❌ Validation error:', validationResult.error.errors);
      return;
    }

    const sensorData = validationResult.data;

    // Find sensor in database
    const sensor = await findSensorBySensorId(sensorData.sensorId);
    if (!sensor) {
      console.error(`❌ Sensor ${sensorData.sensorId} not found in database`);
      return;
    }

    // Insert reading
    await insertSensorReading(sensorData, sensor.id, sensor.farm_id);

    // Check and create alerts
    await checkAndCreateAlerts(sensor.id, sensor.farm_id, sensorData);

    console.log(`✅ Successfully processed message for sensor ${sensorData.sensorId}`);
  } catch (error) {
    console.error('❌ Error processing message:', error);
  }
});

// ============================================
// Graceful Shutdown
// ============================================

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  client.end();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down...');
  client.end();
  process.exit(0);
});

console.log('🚀 SWAMP MQTT Bridge starting...');

