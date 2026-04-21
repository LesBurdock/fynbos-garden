import Image from 'next/image';
import Link from 'next/link';
import SiteNav from '@/components/ui/SiteNav';
import ScrollReveal from '@/components/ui/ScrollReveal';
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
      <SiteNav variant="light" />

      {/* ── Hero ── */}
      <section className="relative h-[75vh] xl:h-[75vh] 2xl:h-[67vh] min-h-[480px] overflow-hidden bg-[#BF6836]">

        {/* Circle image — half off-screen right, vertically centered */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 h-[50vh] w-[50vh] rounded-full overflow-hidden">
          <Image
            src="/michala-li-hgqlXvW87Fo-unsplash.jpg"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Inner container — constrains content to max-w-6xl */}
        <div className="relative max-w-6xl mx-auto h-full min-h-[480px]">

          {/* Text — anchored bottom-left */}
          <ScrollReveal className="absolute bottom-12 md:bottom-16 left-8 right-8 md:right-auto z-10 md:max-w-xl">
            <p className="font-body text-white/60 text-sm tracking-widest uppercase mb-3">
              Cape Town · Voëlklip · Native fynbos
            </p>
            <h1 className="font-heading text-5xl md:text-6xl text-white leading-tight mb-4">
              A garden in the sky.
            </h1>
            <p className="font-body text-white/75 text-xl md:text-2xl italic leading-relaxed mb-8">
              Thirty-five species of South African fynbos, planted above the city and watched closely.
            </p>

            {/* Nav links */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/garden"
                className="font-heading text-sm font-medium text-white border border-white/40 hover:bg-white hover:text-plum transition-colors px-5 py-2.5 rounded-full"
              >
                Explore the map →
              </Link>
              <Link
                href="/dashboard"
                className="font-heading text-sm font-medium text-white border border-white/40 hover:bg-white hover:text-plum transition-colors px-5 py-2.5 rounded-full"
              >
                View the dashboard →
              </Link>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── Why I built this ── */}
      <section className="grid grid-cols-1 md:grid-cols-2">

        {/* Left — full-bleed image */}
        <ScrollReveal direction="left" className="relative min-h-[500px] md:min-h-0">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/grace-brauteseth-Gc64ErEtDis-unsplash (1).jpg"
              alt="Fynbos in bloom"
              fill
              className="object-cover"
            />
            </div>
          {/* Vertical decorative line — escapes section downward */}
          <div className="hidden md:block absolute top-full right-0 w-[2px] bg-terra h-[580px] z-0" />
        </ScrollReveal>

        {/* Right — text */}
        <ScrollReveal direction="right" delay={0.15} className="relative flex flex-col justify-center px-12 md:px-16 py-20">
          <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-terra/30" />
          <p className="font-heading text-xs md:text-sm uppercase tracking-widest text-terra mb-6">About this project</p>
          <h2 className="font-heading text-3xl md:text-4xl text-plum mb-10 leading-snug">
            Why grow fynbos on a rooftop?
          </h2>
          <div className="space-y-6 font-body text-lg leading-relaxed text-plum/80">
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
        </ScrollReveal>

      </section>
      <div className="h-[2px] bg-plum w-full" />

      {/* ── Stat strip ── */}
      <ScrollReveal>
      <div className="relative z-10 bg-terra mt-8">
        <div className="max-w-6xl mx-auto px-4 md:px-16 py-3 md:py-6 grid grid-cols-4 divide-x divide-white/20 text-center md:text-left">
          <div className="pr-3 md:pr-8">
            <p className="font-heading text-xs uppercase tracking-widest text-white/50 mb-0.5">Today</p>
            {weather ? (
              <p className="font-heading text-lg md:text-2xl text-white">
                {Math.round(weather.temperature)}°C
                <span className="hidden md:inline text-sm font-normal text-white/50 ml-2">
                  {weather.wind_speed} km/h wind
                </span>
              </p>
            ) : (
              <p className="font-heading text-lg text-white/40">—</p>
            )}
          </div>
          <div className="px-3 md:px-8">
            <p className="font-heading text-xs uppercase tracking-widest text-white/50 mb-0.5">Tasks due</p>
            <p className="font-heading text-lg md:text-2xl text-white">
              {tasks.length}
              <span className="hidden md:inline text-sm font-normal text-white/50 ml-2">in the next 2 days</span>
            </p>
          </div>
          <div className="px-3 md:px-8">
            <p className="font-heading text-xs uppercase tracking-widest text-white/50 mb-0.5">
              <span className="md:hidden">Blooming</span>
              <span className="hidden md:inline">Blooming in {currentMonthName}</span>
            </p>
            <p className="font-heading text-lg md:text-2xl text-white">
              {bloomingCount}
              <span className="hidden md:inline text-sm font-normal text-white/50 ml-2">species</span>
            </p>
          </div>
          <div className="pl-3 md:pl-8">
            <p className="font-heading text-xs uppercase tracking-widest text-white/50 mb-0.5">Plants thriving</p>
            <p className="font-heading text-lg md:text-2xl text-white">
              {healthy}
              <span className="hidden md:inline text-sm font-normal text-white/50 ml-2">of {positions.length}</span>
            </p>
          </div>
        </div>
      </div>
      </ScrollReveal>

      {/* ── Nav cards ── */}
      <section className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1.5rem_1fr_1fr] h-[448px] bg-mist items-start">

        {/* Col 1 — image: starts at top (touches stat strip), 400px tall */}
        <div className="relative overflow-hidden self-start h-[400px]">
          <Image
            src="/grace-brauteseth-qJrs-9jpCtU-unsplash (1).jpg"
            alt="Fynbos garden"
            fill
            className="object-cover"
          />
        </div>

        {/* Col 2 — explore the garden: sits at bottom (touches terra line), 400px tall */}
        <Link href="/garden" className="group flex flex-col justify-center px-8 md:px-10 bg-plum hover:bg-plum/80 transition-colors self-end h-[400px]">
          <p className="font-heading text-xs uppercase tracking-widest text-terra mb-3">Interactive map</p>
          <h3 className="font-heading text-2xl md:text-3xl text-white leading-snug mb-2">
            Explore the garden
          </h3>
          <p className="font-body text-sm italic text-white/50">Click any plant to learn more →</p>
        </Link>

        {/* Mist gap */}
        <div className="hidden md:block bg-mist self-start h-[400px]" />

        {/* Col 3 — view the dashboard: sits at bottom (touches terra line), 400px tall */}
        <Link href="/dashboard" className="group flex flex-col justify-center px-8 md:px-10 bg-plum hover:bg-plum/80 transition-colors self-start h-[400px]">
          <p className="font-heading text-xs uppercase tracking-widest text-terra mb-3">Live data</p>
          <h3 className="font-heading text-2xl md:text-3xl text-white leading-snug mb-2">
            View the dashboard
          </h3>
          <p className="font-body text-sm italic text-white/50">Weather, health, bloom calendar →</p>
        </Link>

        {/* Col 4 — image: sits at bottom (touches terra line), 400px tall */}
        <div className="relative overflow-hidden self-end h-[400px]">
          <Image
            src="/janine-joles-K1_OIPf9F0I-unsplash.jpg"
            alt="Garden dashboard"
            fill
            className="object-cover"
          />
        </div>

      </section>
      <div className="h-[2px] bg-terra w-full" />


      {/* ── Journal posts ── */}
      <section className="bg-white border-t border-sand/20">
        <div className="max-w-6xl mx-auto px-8 py-20">
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
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 0.12}>
                <article className="group cursor-pointer">
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
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Tech stack ── */}
      <footer className="bg-mist border-t border-sand/20">
        <div className="max-w-6xl mx-auto px-4 md:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-heading text-xs md:text-sm uppercase tracking-widest text-sand">Built with</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {TECH_STACK.map(tech => (
              <span
                key={tech}
                className="font-heading text-xs font-medium text-plum/70 bg-plum/5 border border-plum/10 px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="font-body text-xs italic text-plum/40">Cape Town, {new Date().getFullYear()}</p>
        </div>
      </footer>

    </div>
  );
}
