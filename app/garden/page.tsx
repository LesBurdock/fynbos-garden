import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Zone, PlantPosition, Plant, CareLog } from '@/lib/types';
import GardenMap from '@/components/garden/GardenMap';

export default async function GardenPage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: zonesData }, { data: positionsData }, { data: plantsData }] = await Promise.all([
    supabase.from('zones').select('*').order('name'),
    supabase.from('plant_positions').select('*, plants(*), zones(*)').is('removed_at', null),
    supabase.from('plants').select('*').order('name'),
  ]);

  const zones = (zonesData ?? []) as Zone[];
  const positions = (positionsData ?? []) as PlantPosition[];
  const plants = (plantsData ?? []) as Plant[];

  let careLogs: CareLog[] = [];
  const positionIds = positions.map(p => p.id);
  if (positionIds.length > 0) {
    const { data } = await supabase
      .from('care_log')
      .select('*')
      .in('position_id', positionIds)
      .order('logged_at', { ascending: false });
    careLogs = (data ?? []) as CareLog[];
  }

  return (
    <div className="h-screen flex flex-col bg-mist">
      <GardenMap zones={zones} positions={positions} plants={plants} careLogs={careLogs} />
    </div>
  );
}
