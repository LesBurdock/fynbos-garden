import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Plant } from '@/lib/types';
import PlantsAdmin from '@/components/admin/PlantsAdmin';

export default async function AdminPlantsPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('plants')
    .select('*')
    .order('name');

  const plants = (data ?? []) as Plant[];

  return (
    <div className="h-screen flex flex-col bg-white">
      <PlantsAdmin plants={plants} />
    </div>
  );
}
