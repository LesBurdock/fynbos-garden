import { createServerSupabaseClient } from '@/lib/supabase-server';
import { GardenTask, Zone } from '@/lib/types';
import TasksAdmin from '@/components/admin/TasksAdmin';

export default async function AdminTasksPage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: tasksData }, { data: zonesData }] = await Promise.all([
    supabase
      .from('garden_tasks')
      .select('*')
      .is('completed_at', null)
      .order('due_date', { ascending: true }),
    supabase.from('zones').select('*').order('name'),
  ]);

  const tasks = (tasksData ?? []) as GardenTask[];
  const zones = (zonesData ?? []) as Zone[];

  return <TasksAdmin tasks={tasks} zones={zones} />;
}
