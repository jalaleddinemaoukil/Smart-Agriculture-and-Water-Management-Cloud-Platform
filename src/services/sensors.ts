import supabase from '../lib/supabaseClient';

export async function fetchSensorsByFarm(farmId: string) {
  const { data, error } = await supabase
    .from('sensors')
    .select('id, sensor_id, name, type, status, battery_level, last_seen')
    .eq('farm_id', farmId);
  if (error) throw error;
  return data ?? [];
}
