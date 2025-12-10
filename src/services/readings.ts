// src/services/readings.ts
import { supabase } from '../lib/supabaseClient';
import type { SensorReading } from '../types/database';

export async function fetchLatestReadings(farmId?: string, limit = 100): Promise<SensorReading[]> {
  let query = supabase
    .from('sensor_readings')
    .select('id, sensor_id, farm_id, timestamp, temperature, humidity, soil_moisture, water_used')
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (farmId) query = query.eq('farm_id', farmId);

  try {
    const { data, error } = await query;
    if (error) {
      // Log error for debugging (no secrets)
      const errorObj = error as { message: string; status?: number; details?: unknown };
      console.error('fetchLatestReadings error', { message: errorObj.message, status: errorObj.status, details: errorObj.details });
      try {
        const { useDebugStore } = await import('@/stores/debugStore');
        useDebugStore.getState().setError({
          source: 'fetchLatestReadings',
          message: errorObj.message,
          status: errorObj.status ?? null,
          details: errorObj.details ?? null,
        });
      } catch {
        // Ignore debugStore import errors
      }
      throw error;
    }
    return (data as SensorReading[]) ?? [];
  } catch (err) {
    console.error('fetchLatestReadings exception', err);
    throw err;
  }
}
