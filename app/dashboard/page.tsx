import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Zone, PlantPosition, WateringLog, GardenTask, Plant, SeasonalTask } from '@/lib/types';
import { fetchWeather } from '@/lib/weather';
import DashboardNav from '@/components/dashboard/DashboardNav';
import AttentionPanel from '@/components/dashboard/AttentionPanel';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import HealthSnapshot from '@/components/dashboard/HealthSnapshot';
import BloomCalendar from '@/components/dashboard/BloomCalendar';
import WateringChart from '@/components/dashboard/WateringChart';
import HeroCircle from '@/components/dashboard/HeroCircle';
import ThisMonthBloom from '@/components/dashboard/ThisMonthBloom';

type PositionWithPlant = PlantPosition & { plants: Plant | null };
type TaskWithZone = GardenTask & { zones: { name: string } | null };
type RawCareLog = {
  id: string;
  logged_at: string;
  action: string;
  plant_positions: { plants: { name: string } | null } | null;
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SEASON_START: Record<string, number> = { spring: 9, summer: 12, autumn: 3, winter: 6 };
const SEASON_END: Record<string, number>   = { spring: 11, summer: 2, autumn: 5, winter: 8 };
const MONTH_ABBRS: Record<string, number>  = { Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12 };

function isBloomingThisMonth(bloomSeason: string | null, month: number): boolean {
  if (!bloomSeason) return false;
  const lower = bloomSeason.toLowerCase();
  if (lower.includes('year')) return true;
  const parts = bloomSeason.split(/[–—\-]/).map(s => s.trim());
  let start: number, end: number;
  if (parts.length === 1) {
    start = SEASON_START[lower] ?? 0;
    end   = SEASON_END[lower]   ?? 0;
    if (!start || !end) return false;
  } else {
    const ss = SEASON_START[parts[0].toLowerCase()];
    const se = SEASON_END[parts[1].toLowerCase()];
    if (ss !== undefined && se !== undefined) { start = ss; end = se; }
    else {
      start = MONTH_ABBRS[parts[0]] ?? 0;
      end   = MONTH_ABBRS[parts[1]] ?? 0;
      if (!start || !end) return false;
    }
  }
  return start <= end ? month >= start && month <= end : month >= start || month <= end;
}

function isInSeasonalWindow(task: SeasonalTask, month: number): boolean {
  if (task.month_start <= task.month_end) return month >= task.month_start && month <= task.month_end;
  return month >= task.month_start || month <= task.month_end;
}

function daysBetween(a: Date, b: Date) {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonth = today.getMonth() + 1;
  const monthName = MONTH_NAMES[today.getMonth()];

  const twoDaysFromNow = new Date(today);
  twoDaysFromNow.setDate(today.getDate() + 2);
  const twoDaysStr = twoDaysFromNow.toISOString().split('T')[0];

  const sevenDaysAgoStr = new Date(today.getTime() - 7 * 864e5).toISOString().split('T')[0];

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

  const zones      = (zonesData      ?? []) as Zone[];
  const positions  = (positionsData  ?? []) as PositionWithPlant[];
  const wateringLogs = (wateringData ?? []) as WateringLog[];
  const tasks      = (tasksData      ?? []) as TaskWithZone[];
  const careLogs   = (careData       ?? []) as unknown as RawCareLog[];

  // Watering due
  const latestWatering = new Map<string, Date>();
  for (const log of wateringLogs) {
    const d = new Date(log.watered_at);
    const ex = latestWatering.get(log.zone_id);
    if (!ex || d > ex) latestWatering.set(log.zone_id, d);
  }
  const wateringDue = zones
    .map(zone => ({ zone, daysSince: latestWatering.has(zone.id) ? daysBetween(latestWatering.get(zone.id)!, today) : null }))
    .filter(({ daysSince }) => daysSince === null || daysSince >= 5);

  // Seasonal alerts
  const seasonalAlerts: { plantName: string; task: string }[] = [];
  const seenTasks = new Set<string>();
  for (const pos of positions) {
    const plant = pos.plants;
    if (!plant?.seasonal_tasks) continue;
    for (const t of plant.seasonal_tasks) {
      if (!isInSeasonalWindow(t, currentMonth)) continue;
      const key = `${plant.name}|${t.task}`;
      if (seenTasks.has(key)) continue;
      seenTasks.add(key);
      seasonalAlerts.push({ plantName: plant.name, task: t.task });
    }
  }

  // Upcoming tasks
  const upcomingTasks = tasks
    .filter(t => t.due_date <= twoDaysStr)
    .map(t => ({ id: t.id, title: t.title, zoneName: t.zones?.name ?? null, due_date: t.due_date, task_type: t.task_type }));

  // Health
  const healthy       = positions.filter(p => p.health_status === 'healthy').length;
  const struggling    = positions.filter(p => p.health_status === 'struggling').length;
  const dead          = positions.filter(p => p.health_status === 'dead').length;
  const strugglingList = positions.filter(p => p.health_status === 'struggling').map(p => p.plants?.name ?? 'Unknown');
  const deadList       = positions.filter(p => p.health_status === 'dead').map(p => p.plants?.name ?? 'Unknown');

  // Bloom calendar
  const seenBloom = new Set<string>();
  const bloomPlants = positions
    .filter(p => p.plants?.bloom_season)
    .map(p => ({ name: p.plants!.name, bloomSeason: p.plants!.bloom_season }))
    .filter(p => { if (seenBloom.has(p.name)) return false; seenBloom.add(p.name); return true; })
    .sort((a, b) => a.name.localeCompare(b.name));

  // This month's bloom
  const seenBlooming = new Set<string>();
  const bloomingNow = positions
    .filter(p => p.plants?.bloom_season && isBloomingThisMonth(p.plants!.bloom_season, currentMonth))
    .map(p => ({ name: p.plants!.name, latinName: p.plants!.latin_name, imageUrl: p.plants!.image_url ?? null }))
    .filter(p => { if (seenBlooming.has(p.name)) return false; seenBlooming.add(p.name); return true; })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Hero image — first blooming plant with image, fallback to any active plant with image
  const heroImageUrl =
    bloomingNow.find(p => p.imageUrl)?.imageUrl ??
    positions.find(p => p.plants?.image_url)?.plants?.image_url ??
    null;

  // Watering chart
  const chartData = zones.map(z => ({
    name: z.name,
    litres: wateringLogs
      .filter(w => w.zone_id === z.id && w.watered_at >= sevenDaysAgoStr)
      .reduce((sum, w) => sum + Number(w.amount_litres), 0),
  }));

  const recentActivity = careLogs.map(log => ({
    action: log.action,
    logged_at: log.logged_at,
    plantName: log.plant_positions?.plants?.name ?? 'Unknown plant',
  }));

  return (
    <div className="min-h-screen bg-mist">
      <DashboardNav />

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-12 space-y-5">

        {/* Top row: hero+health | weather | attention */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Left: hero circle + health */}
          <div className="space-y-4">
            <HeroCircle imageUrl={heroImageUrl} />
            <HealthSnapshot
              healthy={healthy}
              struggling={struggling}
              dead={dead}
              strugglingList={strugglingList}
              deadList={deadList}
            />
          </div>

          {/* Centre: weather */}
          <WeatherWidget weather={weather} />

          {/* Right: attention */}
          <AttentionPanel
            wateringDue={wateringDue}
            seasonalAlerts={seasonalAlerts}
            upcomingTasks={upcomingTasks}
          />
        </div>

        {/* Bloom calendar */}
        <BloomCalendar plants={bloomPlants} />

        {/* Bottom row: this month's bloom + watering chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ThisMonthBloom plants={bloomingNow} monthName={monthName} />
          <WateringChart chartData={chartData} recentActivity={recentActivity} />
        </div>

      </main>
    </div>
  );
}
