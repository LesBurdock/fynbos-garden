import Image from 'next/image';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { fetchWeather } from '@/lib/weather';
import { PlantPosition, Plant, JournalPost, GardenTask } from '@/lib/types';

type PositionWithPlant = PlantPosition & { plants: Plant | null };

const SEASON_START: Record<string, number> = { spring: 9, summer: 12, autumn: 3, winter: 6 };
const SEASON_END: Record<string, number>   = { spring: 11, summer: 2,  autumn: 5, winter: 8  };
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

const TECH_STACK = ['Next.js', 'Supabase', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Vercel'];

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const todayStr = today.toISOString().split('T')[0];
  const twoDaysOut = new Date(today.getTime() + 2 * 864e5).toISOString().split('T')[0];

  const [
    { data: positionsData },
    { data: tasksData },
    { data: journalData },
    weather,
  ] = await Promise.all([
    supabase.from('plant_positions').select('*, plants(*)').is('removed_at', null),
    supabase.from('garden_tasks').select('*').is('completed_at', null).lte('due_date', twoDaysOut),
    supabase.from('journal_posts').select('id, title, slug, category, published_at, content_md').order('published_at', { ascending: false }).limit(3),
    fetchWeather(),
  ]);

  const positions  = (positionsData ?? []) as PositionWithPlant[];
  const tasks      = (tasksData    ?? []) as GardenTask[];
  const posts      = (journalData  ?? []) as JournalPost[];

  const healthy    = positions.filter(p => p.health_status === 'healthy').length;
  const struggling = positions.filter(p => p.health_status === 'struggling').length;
  const dead       = positions.filter(p => p.health_status === 'dead').length;

  const bloomingCount = new Set(
    positions
      .filter(p => p.plants?.bloom_season && isBloomingThisMonth(p.plants!.bloom_season, currentMonth))
      .map(p => p.plants!.name)
  ).size;

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const currentMonthName = MONTH_NAMES[today.getMonth()];

  return (
    <div className="min-h-screen bg-mist text-plum">

      {/* ── Nav ── */}
      <nav className="absolute top-0 left-0 right-0 z-20 py-8">
        <div className="max-w-7xl px-16 flex items-center justify-between">
          <span className="font-heading text-base font-semibold tracking-widest uppercase text-plum/80">
            Fynbos Garden
          </span>
          <div className="flex gap-6 font-heading text-base font-medium text-plum/70">
            <Link href="/garden" className="hover:text-plum transition-colors">Map</Link>
            <Link href="/dashboard" className="hover:text-plum transition-colors">Dashboard</Link>
            <Link href="/journal" className="hover:text-plum transition-colors">Journal</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative h-[85vh] min-h-[560px] bg-mist overflow-hidden">

        {/* Circle image — right side */}
        <div className="absolute right-16 top-20 bottom-0 aspect-square rounded-full overflow-hidden">
          <Image
            src="/large_hero_circle.jpeg"
            alt="Fynbos rooftop garden in Cape Town"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Text — bottom left */}
        <div className="absolute bottom-0 left-0 z-10 px-20 pb-36 max-w-2xl">
          <p className="font-body text-plum/60 text-sm tracking-widest uppercase mb-3">
            Cape Town · Rooftop · Native Fynbos
          </p>
          <h1 className="font-heading text-5xl md:text-6xl text-plum leading-tight mb-4">
            A garden in the sky.
          </h1>
          <p className="font-body text-plum/70 text-xl md:text-2xl italic leading-relaxed mb-10">
            Thirty-one species of South African fynbos, planted above the city and watched closely.
          </p>

          {/* Health counts */}
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 bg-plum/10 border border-plum/20 text-plum text-sm font-heading font-medium px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              {healthy} healthy
            </span>
            <span className="inline-flex items-center gap-2 bg-plum/10 border border-plum/20 text-plum text-sm font-heading font-medium px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              {struggling} struggling
            </span>
            <span className="inline-flex items-center gap-2 bg-plum/10 border border-plum/20 text-plum text-sm font-heading font-medium px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              {dead} dead
            </span>
          </div>
        </div>

        {/* Stat strip — overlays bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-mist">
          <div className="w-[90%] mx-auto border-t-2 border-sand/40" />
          <div className="max-w-6xl mx-auto px-16 py-6 grid grid-cols-3 divide-x divide-sand/20">
            <div className="pr-8">
              <p className="font-heading text-xs md:text-sm uppercase tracking-widest text-sand mb-1">Today</p>
              {weather ? (
                <p className="font-heading text-2xl text-plum">
                  {Math.round(weather.temperature)}°C
                  <span className="text-sm font-normal text-plum/50 ml-2">
                    {weather.wind_speed} km/h wind
                  </span>
                </p>
              ) : (
                <p className="font-heading text-lg text-plum/40">—</p>
              )}
            </div>
            <div className="px-8">
              <p className="font-heading text-xs md:text-sm uppercase tracking-widest text-sand mb-1">Tasks due</p>
              <p className="font-heading text-2xl text-plum">
                {tasks.length}
                <span className="text-sm font-normal text-plum/50 ml-2">in the next 2 days</span>
              </p>
            </div>
            <div className="pl-8">
              <p className="font-heading text-xs md:text-sm uppercase tracking-widest text-sand mb-1">Blooming in {currentMonthName}</p>
              <p className="font-heading text-2xl text-plum">
                {bloomingCount}
                <span className="text-sm font-normal text-plum/50 ml-2">
                  {bloomingCount === 1 ? 'species' : 'species'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why I built this ── */}
      <section className="max-w-3xl mx-auto px-8 py-20">
        <p className="font-heading text-xs md:text-sm uppercase tracking-widest text-terra mb-6">About this project</p>
        <h2 className="font-heading text-3xl md:text-4xl text-plum mb-10 leading-snug">
          Why grow fynbos on a rooftop?
        </h2>
        <div className="space-y-6 font-body text-lg leading-relaxed text-plum/80 border-l-2 border-terra/30 pl-8">
          <p>
            I&apos;ve always been drawn to the Cape Floral Kingdom — the fynbos biome is one of the most
            biodiverse places on earth, and yet most of it grows in thin, nutrient-poor soils on windswept
            hillsides. It seemed perverse, and then perfectly logical, to try to recreate that on top of a
            Cape Town building.
          </p>
          <p>
            The practical challenge is real: weight limits, ferocious south-easterly winds, full exposure to
            the summer sun, and the unforgiving drainage that fynbos needs but rooftop containers struggle to
            provide. Every plant here has been chosen because it can handle all of that — or because I wanted
            to find out if it could.
          </p>
          <p>
            This site is both a tool and a record. I built it to track what&apos;s thriving, what&apos;s struggling,
            and what I&apos;ve learned — and to practise building something with real data and a reason to exist.
            The garden and the code grow together.
          </p>
        </div>
      </section>

      {/* ── Nav cards ── */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <p className="font-heading text-xs md:text-sm uppercase tracking-widest text-terra mb-10">Explore</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Garden map card */}
          <Link href="/garden" className="group relative block w-full aspect-square overflow-visible">
            <Image
              src="/final_hero_circle.png"
              alt="Garden map"
              width={800}
              height={800}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-125 p-6"
            />
            <div className="absolute inset-y-0 left-0 flex flex-col justify-start pt-10 pl-2 text-left">
              <p className="font-heading text-xs md:text-sm uppercase tracking-widest text-sand mb-1">Interactive map</p>
              <h3 className="font-heading text-2xl text-plum mb-1">Explore the garden</h3>
              <p className="font-body text-plum/60 text-sm italic">Click any plant to learn more</p>
            </div>
          </Link>

          {/* Dashboard card */}
          <Link href="/dashboard" className="group relative block w-full aspect-square overflow-visible">
            <Image
              src="/final_hero_circle_2.png"
              alt="Garden dashboard"
              width={800}
              height={800}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-125 p-6"
            />
            <div className="absolute inset-y-0 right-0 flex flex-col justify-start pt-10 pr-2 text-right">
              <p className="font-heading text-xs md:text-sm uppercase tracking-widest text-sand mb-1">Live data</p>
              <h3 className="font-heading text-2xl text-plum mb-1">View the dashboard</h3>
              <p className="font-body text-plum/60 text-sm italic">Weather, health, bloom calendar</p>
            </div>
          </Link>

        </div>
      </section>

      {/* ── Journal posts ── */}
      <section className="bg-white border-t border-sand/20">
        <div className="max-w-4xl mx-auto px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-heading text-xs md:text-sm uppercase tracking-widest text-terra mb-2">From the journal</p>
              <h2 className="font-heading text-3xl text-plum">Latest writing</h2>
            </div>
            {posts.length > 0 && (
              <Link href="/journal" className="font-heading text-sm font-medium text-terra hover:underline">
                View all →
              </Link>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="border border-dashed border-sand/50 rounded-2xl p-12 text-center">
              <p className="font-body text-plum/40 text-lg italic">
                No posts yet — the journal is just getting started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map(post => (
                <article key={post.id} className="group cursor-pointer">
                  <div className="mb-3">
                    <span className="inline-block font-heading text-xs md:text-sm uppercase tracking-widest text-terra bg-terra/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg text-plum group-hover:text-terra transition-colors leading-snug mb-2">
                    {post.title}
                  </h3>
                  <p className="font-body text-plum/60 text-sm leading-relaxed line-clamp-3">
                    {post.content_md?.slice(0, 120)}…
                  </p>
                  <p className="font-heading text-xs text-sand mt-3">
                    {new Date(post.published_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Tech stack ── */}
      <footer className="border-t border-sand/20 bg-mist">
        <div className="max-w-4xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-heading text-xs md:text-sm uppercase tracking-widest text-plum/40">Built with</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {TECH_STACK.map(tech => (
              <span
                key={tech}
                className="font-heading text-xs font-medium text-plum/60 bg-sand/20 border border-sand/30 px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="font-body text-xs italic text-plum/30">Cape Town, {new Date().getFullYear()}</p>
        </div>
      </footer>

    </div>
  );
}
