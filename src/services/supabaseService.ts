import { supabase } from '@/lib/supabaseClient';
import type { Sensor, Farm, Alert, UserPreferences } from '@/types/database';
import { dbReadingToLegacy } from '@/types/sensor';
import type { SensorReading as LegacyReading } from '@/types/sensor';

// ============================================
// SENSOR READINGS
// ============================================

/**
 * Fetch latest sensor readings for a farm
 */
export async function fetchSensorReadings(
  farmId?: string,
  limit: number = 100
): Promise<LegacyReading[]> {
  try {
    let query = supabase
      .from('sensor_readings')
      .select(`
        *,
        sensor:sensors(sensor_id)
      `)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (farmId) {
      query = query.eq('farm_id', farmId);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data) return [];

    return data.map((reading) => 
      dbReadingToLegacy(reading, reading.sensor?.sensor_id || 'UNKNOWN')
    );
  } catch (error) {
    console.error('Error fetching sensor readings:', error);
    return [];
  }
}

/**
 * Fetch latest reading for a specific sensor
 */
export async function fetchLatestReading(sensorId?: string): Promise<LegacyReading | null> {
  try {
    let query = supabase
      .from('sensor_readings')
      .select(`
        *,
        sensor:sensors(sensor_id)
      `)
      .order('timestamp', { ascending: false })
      .limit(1);

    if (sensorId) {
      // Find sensor by sensor_id (external ID)
      const { data: sensor } = await supabase
        .from('sensors')
        .select('id')
        .eq('sensor_id', sensorId)
        .single();

      if (sensor) {
        query = query.eq('sensor_id', sensor.id);
      }
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data || data.length === 0) return null;

    const reading = data[0];
    return dbReadingToLegacy(reading, reading.sensor?.sensor_id || 'UNKNOWN');
  } catch (error) {
    console.error('Error fetching latest reading:', error);
    return null;
  }
}

/**
 * Fetch historical data with date range
 */
export async function fetchHistoricalData(
  startDate: string,
  endDate: string,
  farmId?: string,
  sensorId?: string
): Promise<LegacyReading[]> {
  try {
    let query = supabase
      .from('sensor_readings')
      .select(`
        *,
        sensor:sensors(sensor_id)
      `)
      .gte('timestamp', startDate)
      .lte('timestamp', endDate)
      .order('timestamp', { ascending: false });

    if (farmId) {
      query = query.eq('farm_id', farmId);
    }

    if (sensorId) {
      const { data: sensor } = await supabase
        .from('sensors')
        .select('id')
        .eq('sensor_id', sensorId)
        .single();

      if (sensor) {
        query = query.eq('sensor_id', sensor.id);
      }
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data) return [];

    return data.map((reading) => 
      dbReadingToLegacy(reading, reading.sensor?.sensor_id || 'UNKNOWN')
    );
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
}

// ============================================
// FARMS
// ============================================

/**
 * Fetch all farms for current user
 */
export async function fetchFarms(): Promise<Farm[]> {
  try {
    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching farms:', error);
    return [];
  }
}

/**
 * Fetch single farm by ID
 */
export async function fetchFarm(farmId: string): Promise<Farm | null> {
  try {
    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .eq('id', farmId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching farm:', error);
    return null;
  }
}

/**
 * Create a new farm
 */
export async function createFarm(farm: Omit<Farm, 'id' | 'created_at' | 'updated_at'>): Promise<Farm | null> {
  try {
    const { data, error } = await supabase
      .from('farms')
      .insert(farm)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating farm:', error);
    return null;
  }
}

// ============================================
// SENSORS
// ============================================

/**
 * Fetch sensors for a farm
 */
export async function fetchSensors(farmId?: string): Promise<Sensor[]> {
  try {
    let query = supabase
      .from('sensors')
      .select('*')
      .order('created_at', { ascending: false });

    if (farmId) {
      query = query.eq('farm_id', farmId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching sensors:', error);
    return [];
  }
}

/**
 * Fetch single sensor by ID
 */
export async function fetchSensor(sensorId: string): Promise<Sensor | null> {
  try {
    const { data, error } = await supabase
      .from('sensors')
      .select('*')
      .eq('id', sensorId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching sensor:', error);
    return null;
  }
}

/**
 * Create a new sensor
 */
export async function createSensor(sensor: Omit<Sensor, 'id' | 'created_at' | 'updated_at'>): Promise<Sensor | null> {
  try {
    const { data, error } = await supabase
      .from('sensors')
      .insert(sensor)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating sensor:', error);
    return null;
  }
}

/**
 * Update sensor
 */
export async function updateSensor(
  sensorId: string,
  updates: Partial<Omit<Sensor, 'id' | 'created_at' | 'updated_at'>>
): Promise<Sensor | null> {
  try {
    const { data, error } = await supabase
      .from('sensors')
      .update(updates)
      .eq('id', sensorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating sensor:', error);
    return null;
  }
}

// ============================================
// ALERTS
// ============================================

/**
 * Fetch active alerts
 */
export async function fetchAlerts(farmId?: string, status: 'active' | 'acknowledged' | 'resolved' = 'active'): Promise<Alert[]> {
  try {
    let query = supabase
      .from('alerts')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (farmId) {
      query = query.eq('farm_id', farmId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(alertId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('alerts')
      .update({
        status: 'acknowledged',
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: user.id,
      })
      .eq('id', alertId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    return false;
  }
}

// ============================================
// USER PREFERENCES
// ============================================

/**
 * Fetch user preferences
 */
export async function fetchUserPreferences(): Promise<UserPreferences | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  preferences: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<UserPreferences | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_preferences')
      .update(preferences)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return null;
  }
}

// ============================================
// REALTIME SUBSCRIPTIONS
// ============================================

/**
 * Subscribe to sensor readings for a farm
 */
export function subscribeToSensorReadings(
  farmId: string,
  callback: (reading: LegacyReading) => void
) {
  const channel = supabase
    .channel(`sensor_readings:${farmId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'sensor_readings',
        filter: `farm_id=eq.${farmId}`,
      },
      async (payload) => {
        // Fetch full reading with sensor info
        const { data } = await supabase
          .from('sensor_readings')
          .select(`
            *,
            sensor:sensors(sensor_id)
          `)
          .eq('id', payload.new.id)
          .single();

        if (data) {
          callback(dbReadingToLegacy(data, data.sensor?.sensor_id || 'UNKNOWN'));
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribe to alerts for a farm
 */
export function subscribeToAlerts(
  farmId: string,
  callback: (alert: Alert) => void
) {
  const channel = supabase
    .channel(`alerts:${farmId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'alerts',
        filter: `farm_id=eq.${farmId}`,
      },
      (payload) => {
        callback(payload.new as Alert);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

