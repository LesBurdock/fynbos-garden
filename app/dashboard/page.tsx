import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Zone, PlantPosition, WateringLog, GardenTask, Plant, SeasonalTask } from '@/lib/types';
import { fetchWeather } from '@/lib/weather';
import AttentionPanel from '@/components/dashboard/AttentionPanel';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import HealthSnapshot from '@/components/dashboard/HealthSnapshot';
import BloomCalendar from '@/components/dashboard/BloomCalendar';
import WateringChart from '@/components/dashboard/WateringChart';

// ── joined types from Supabase ────────────────────────────────────────────────
type PositionWithPlant = PlantPosition & { plants: Plant | null };

type TaskWithZone = GardenTask & { zones: { name: string } | null };

type RawCareLog = {
  id: string;
  logged_at: string;
  action: string;
  plant_positions: { plants: { name: string } | null } | null;
};

// ── helpers ───────────────────────────────────────────────────────────────────
function daysBetween(a: Date, b: Date) {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function isInSeasonalWindow(task: SeasonalTask, month: number): boolean {
  if (task.month_start <= task.month_end) {
    return month >= task.month_start && month <= task.month_end;
  }
  return month >= task.month_start || month <= task.month_end;
}

// ─────────────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonth = today.getMonth() + 1;

  const twoDaysFromNow = new Date(today);
  twoDaysFromNow.setDate(today.getDate() + 2);
  const twoDaysStr = twoDaysFromNow.toISOString().split('T')[0];

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

  const [
    { data: zonesData },
    { data: positionsData },
    { data: wateringData },
    { data: tasksData },
    { data: careData },
    weather,
  ] = await Promise.all([
    supabase.from('zones').select('*').order('name'),
    supabase.from('plant_positions').select('*, plants(*)').is('removed_at', null),
    supabase.from('watering_log').select('*').order('watered_at', { ascending: false }),
    supabase.from('garden_tasks').select('*, zones(name)').is('completed_at', null).order('due_date'),
    supabase.from('care_log').select('id, logged_at, action, plant_positions(plants(name))').order('logged_at', { ascending: false }).limit(8),
    fetchWeather(),
  ]);

  const zones = (zonesData ?? []) as Zone[];
  const positions = (positionsData ?? []) as PositionWithPlant[];
  const wateringLogs = (wateringData ?? []) as WateringLog[];
  const tasks = (tasksData ?? []) as TaskWithZone[];
  const careLogs = (careData ?? []) as unknown as RawCareLog[];

  // ── Watering due ─────────────────────────────────────────────────────────
  const latestWateringByZone = new Map<string, Date>();
  for (const log of wateringLogs) {
    const existing = latestWateringByZone.get(log.zone_id);
    const logDate = new Date(log.watered_at);
    if (!existing || logDate > existing) latestWateringByZone.set(log.zone_id, logDate);
  }

  const wateringDue = zones
    .map(zone => {
      const last = latestWateringByZone.get(zone.id);
      const daysSince = last ? daysBetween(last, today) : null;
      return { zone, daysSince };
    })
    .filter(({ daysSince }) => daysSince === null || daysSince >= 5);

  // ── Seasonal alerts ───────────────────────────────────────────────────────
  const seasonalAlerts: { plantName: string; task: string }[] = [];
  const seenPlantTasks = new Set<string>();

  for (const pos of positions) {
    const plant = pos.plants;
    if (!plant?.seasonal_tasks) continue;
    for (const t of plant.seasonal_tasks) {
      if (!isInSeasonalWindow(t, currentMonth)) continue;
      const key = `${plant.name}|${t.task}`;
      if (seenPlantTasks.has(key)) continue;
      seenPlantTasks.add(key);
      seasonalAlerts.push({ plantName: plant.name, task: t.task });
    }
  }

  // ── Upcoming tasks ────────────────────────────────────────────────────────
  const upcomingTasks = tasks
    .filter(t => t.due_date <= twoDaysStr)
    .map(t => ({
      id: t.id,
      title: t.title,
      zoneName: t.zones?.name ?? null,
      due_date: t.due_date,
      task_type: t.task_type,
    }));

  // ── Health snapshot ───────────────────────────────────────────────────────
  const healthy = positions.filter(p => p.health_status === 'healthy').length;
  const struggling = positions.filter(p => p.health_status === 'struggling').length;
  const dead = positions.filter(p => p.health_status === 'dead').length;
  const strugglingList = positions.filter(p => p.health_status === 'struggling').map(p => p.plants?.name ?? 'Unknown');
  const deadList = positions.filter(p => p.health_status === 'dead').map(p => p.plants?.name ?? 'Unknown');

  // ── Bloom calendar ────────────────────────────────────────────────────────
  const seen = new Set<string>();
  const bloomPlants = positions
    .filter(p => p.plants?.bloom_season)
    .map(p => ({ name: p.plants!.name, bloomSeason: p.plants!.bloom_season }))
    .filter(p => { if (seen.has(p.name)) return false; seen.add(p.name); return true; })
    .sort((a, b) => a.name.localeCompare(b.name));

  // ── Watering chart data ───────────────────────────────────────────────────
  const chartData = zones.map(zone => ({
    name: zone.name,
    litres: wateringLogs
      .filter(w => w.zone_id === zone.id && w.watered_at >= sevenDaysAgoStr)
      .reduce((sum, w) => sum + Number(w.amount_litres), 0),
  }));

  // ── Recent care activity ──────────────────────────────────────────────────
  const recentActivity = careLogs.map(log => ({
    action: log.action,
    logged_at: log.logged_at,
    plantName: log.plant_positions?.plants?.name ?? 'Unknown plant',
  }));

  return (
    <div className="min-h-screen bg-mist">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-stone-900">Dashboard</h1>
          <p className="text-sm text-stone-500 mt-1 font-body">Fynbos Rooftop Garden · Cape Town</p>
        </div>

        <AttentionPanel
          wateringDue={wateringDue}
          seasonalAlerts={seasonalAlerts}
          upcomingTasks={upcomingTasks}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeatherWidget weather={weather} />
          <HealthSnapshot
            healthy={healthy}
            struggling={struggling}
            dead={dead}
            strugglingList={strugglingList}
            deadList={deadList}
          />
        </div>

        <BloomCalendar plants={bloomPlants} />

        <WateringChart chartData={chartData} recentActivity={recentActivity} />
      </div>
    </div>
  );
}
