import supabase from '../lib/supabaseClient';

export async function fetchFarmsByUser(userId: string) {
  const { data, error } = await supabase
    .from('farms')
    .select('id, name, region, address')
    .eq('owner_id', userId);
  if (error) throw error;
  return data ?? [];
}
