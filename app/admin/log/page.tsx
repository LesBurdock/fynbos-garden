import { createServerSupabaseClient } from '@/lib/supabase-server';
import { PlantPosition, Zone } from '@/lib/types';
import LogAdmin from '@/components/admin/LogAdmin';

export default async function AdminLogPage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: positionsData }, { data: zonesData }] = await Promise.all([
    supabase
      .from('plant_positions')
      .select('*, plants(name, latin_name), zones(name)')
      .is('removed_at', null)
      .order('planted_at', { ascending: false }),
    supabase.from('zones').select('*').order('name'),
  ]);

  const positions = (positionsData ?? []) as PlantPosition[];
  const zones = (zonesData ?? []) as Zone[];

  return <LogAdmin positions={positions} zones={zones} />;
}
