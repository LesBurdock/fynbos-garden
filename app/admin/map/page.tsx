import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Zone, PlantPosition, Plant } from '@/lib/types';
import MapAdmin from '@/components/admin/MapAdmin';

export default async function AdminMapPage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: zonesData }, { data: positionsData }, { data: plantsData }] = await Promise.all([
    supabase.from('zones').select('*').order('name'),
    supabase.from('plant_positions').select('*, plants(*), zones(*)').is('removed_at', null),
    supabase.from('plants').select('*').order('name'),
  ]);

  const zones = (zonesData ?? []) as Zone[];
  const positions = (positionsData ?? []) as PlantPosition[];
  const plants = (plantsData ?? []) as Plant[];

  return <MapAdmin zones={zones} positions={positions} plants={plants} />;
}
