# Fynbos Rooftop Garden — Project Brief for Claude Code

This file is the source of truth for this project. Read it fully before writing any code.
Update it as decisions change during the build.

---

## Build status

### Done
- [x] Next.js 16.2.2 project scaffolded (TypeScript, Tailwind 4, App Router, ESLint)
- [x] Dependencies installed: `@supabase/supabase-js`, `@supabase/ssr`, `next-mdx-remote`, `recharts`
- [x] Supabase project created, all 7 tables created, RLS policies set, admin user created
- [x] `.env.local` configured with Supabase URL, anon key, service role key
- [x] `lib/types.ts` — all TypeScript types
- [x] `lib/supabase.ts` — browser client (`createClient`)
- [x] `lib/supabase-server.ts` — server client (`createServerSupabaseClient`) — **note: split into separate file from browser client to avoid `next/headers` bundling into client components**
- [x] `middleware.ts` — protects all `/admin/*` routes, redirects to `/admin/login`
- [x] `app/admin/login/page.tsx` — working email/password login form
- [x] Placeholder pages: `/admin/map`, `/admin/plants`, `/admin/log`, `/admin/tasks`, `/admin/journal`
- [x] Auth flow tested and confirmed working

### In progress
- [ ] Plant seed data — owner researching fynbos species, will populate `lib/seed-plants.ts`

### Up next (follow this order)
- [ ] Run seed data: `npx tsx lib/seed-plants.ts` (requires `npm install -D tsx`)
- [ ] `/admin/plants` — plant library CRUD UI
- [ ] `/admin/map` — zone + plant position editor with SVG map
- [ ] `/admin/log` — care log + watering log forms
- [ ] `/admin/tasks` — task list + add task form
- [ ] `/admin/journal` — journal post management
- [ ] `/garden` — public SVG map with slide-in panel
- [ ] `/dashboard` — widgets (weather, attention panel, health snapshot, bloom calendar, watering chart)
- [ ] `/` — homepage
- [ ] `/journal` — public journal list
- [ ] Mobile responsive pass
- [ ] Polish: loading states, error states, OG tags, Lighthouse audit

---

## What this project is

A full-stack Next.js web application that documents the design, planting and ongoing
maintenance of a native South African fynbos garden on a Cape Town rooftop.

It serves two purposes:
- A living garden journal and data dashboard for the owner
- A frontend portfolio piece demonstrating React, Next.js, Supabase, SVG interaction,
  and data visualisation

The site is public-facing. Only one person (the owner) can log in and manage data.

---

## Tech stack — use exactly these, no substitutions

- **Framework**: Next.js 14 with App Router (not Pages Router)
- **Language**: TypeScript throughout
- **Database + Auth**: Supabase (Postgres + Supabase Auth)
- **Styling**: Tailwind CSS — utility classes only, no custom CSS files unless absolutely necessary
- **Charts**: Recharts
- **Weather**: Open-Meteo API (free, no API key required)
- **Markdown**: next-mdx-remote for rendering journal post content
- **Deployment**: Vercel
- **Package manager**: npm

---

## Project structure conventions

```
/app
  /admin              ← all admin routes (protected by middleware)
    /login
    /map
    /plants
    /log
    /tasks
    /journal
  /garden             ← public SVG map page
  /dashboard          ← public living dashboard
  /journal            ← public journal list
  page.tsx            ← homepage
  layout.tsx

/components
  /admin              ← admin-only components
  /garden             ← map and plant panel components
  /dashboard          ← dashboard widget components
  /ui                 ← shared UI primitives (Card, Badge, Button etc.)

/lib
  supabase.ts         ← browser client only (createClient)
  supabase-server.ts  ← server client only (createServerSupabaseClient) — imports next/headers
  types.ts            ← all TypeScript types matching DB schema exactly
  weather.ts          ← Open-Meteo API fetch helper

/middleware.ts         ← protects all /admin routes
```

---

## Database schema — Supabase (Postgres)

All tables use `uuid` primary keys with `gen_random_uuid()` default.
Use `snake_case` for all table and column names.

### `zones`
```sql
id            uuid PK
name          text
sun_exposure  text          -- e.g. "Full sun", "Part shade"
wind_exposure text          -- e.g. "High", "Moderate", "Sheltered"
svg_coordinates jsonb       -- { x, y, width, height } for SVG rendering
substrate_type  text        -- e.g. "60% perlite / 40% fynbos mix"
container_type  text        -- e.g. "Fibreglass trough"
drainage_layer  text        -- e.g. "50mm leca balls"
weight_kg_per_m2 numeric
area_m2          numeric
notes            text
```

### `plants` (species reference library — no position, no health)
```sql
id              uuid PK
name            text          -- common name
latin_name      text
slug            text UNIQUE   -- for URLs
water_needs     text          -- "Low" | "Moderate" | "High"
sun_tolerance   text          -- "Full sun" | "Part shade" | "Full shade"
wind_hardiness  text          -- "High" | "Moderate" | "Low"
bloom_season    text          -- e.g. "Dec–Apr"
fynbos_region   text          -- e.g. "Overberg", "Cape Peninsula"
description     text
image_url       text
seasonal_tasks  jsonb         -- [{ month_start: 6, month_end: 8, task: "Prune hard" }]
roof_proven     boolean       DEFAULT false
```

### `plant_positions` (the living record — what is actually in the ground)
```sql
id              uuid PK
zone_id         uuid FK → zones.id
plant_id        uuid FK → plants.id
svg_xy          jsonb         -- { x: number, y: number }
planted_at      date
removed_at      date          -- null = still in ground
health_status   text          -- ENUM: "healthy" | "struggling" | "dead"
removal_reason  text
notes           text
```

### `care_log`
```sql
id              uuid PK
position_id     uuid FK → plant_positions.id
logged_at       date
action          text          -- e.g. "Pruned", "Fertilised", "Health check"
notes           text
health_status   text          -- ENUM: "healthy" | "struggling" | "dead"
```

### `watering_log`
```sql
id              uuid PK
zone_id         uuid FK → zones.id
watered_at      date
amount_litres   numeric
notes           text
```

### `journal_posts`
```sql
id              uuid PK
title           text
slug            text UNIQUE
content_md      text
category        text          -- "design" | "materials" | "planting" | "build log"
published_at    timestamptz
```

### `garden_tasks`
```sql
id              uuid PK
title           text
zone_id         uuid FK → zones.id  -- nullable
due_date        date
task_type       text          -- "weeding" | "mulching" | "other"
completed_at    timestamptz   -- null = not yet done
```

---

## Auth — single user, simple

- One Supabase user created directly in the Supabase dashboard (the owner)
- No signup page — ever
- `/admin/login` is the only public admin page: email + password form using `supabase.auth.signInWithPassword()`
- `middleware.ts` protects all routes under `/admin` — check for valid Supabase session, redirect to `/admin/login` if missing
- Use `@supabase/ssr` package for server-side session handling in Next.js App Router

---

## Key data relationships

```
zones ──< plant_positions >── plants
zones ──< watering_log
plant_positions ──< care_log
```

- `plants` is the species library. It never has position or health data.
- `plant_positions` is the living record. One zone can have many positions over time.
  When a plant dies: set `removed_at` = today, set `removal_reason`. Do NOT delete the row.
  Create a new `plant_positions` row for the replacement plant. History is preserved.
- `care_log` links to `plant_positions` (not `plants`) — tied to a specific plant in a specific spot.

---

## Public pages — what they show

### `/` — Homepage
- Hero with garden name, tagline, and live plant health counts (healthy / struggling / dead)
  pulled from `plant_positions` where `removed_at IS NULL`
- Mini stat strip: today's weather (Open-Meteo), tasks due count, plants blooming this month
- "Why I built this" — static copy section (3 short paragraphs, personal tone)
- Two nav cards: "Explore the garden map" → /garden, "View the dashboard" → /dashboard
- Latest 3 journal posts from `journal_posts` ordered by `published_at DESC`
- Tech stack pills at the bottom (static)

### `/garden` — Garden map
- SVG roof map rendered from `zones` table (coordinates from `svg_coordinates` field)
- Plant position dots rendered from `plant_positions` WHERE `removed_at IS NULL`
- Dot colour: green = healthy, amber = struggling, red = dead (from `health_status`)
- Click a dot → slide-in panel from the right showing:
  - Plant name, latin name, zone badge
  - Health status badge + last care log entry
  - Characteristics: water needs, sun tolerance, wind hardiness, bloom season
  - "Find replacement" button (only shown if health_status = "dead") — filters `plants`
    table by matching zone's sun_exposure and wind_exposure
- Click a zone → zone detail panel showing substrate, container, weight, list of current plants
- **Mobile view**: No SVG map. Show card list of `plant_positions` grouped by zone.
  Each card: plant name, zone, health badge, last care action, "Find replacement" if dead.

### `/dashboard` — Living dashboard
Grid layout with these widgets:

1. **What needs attention** (spans full width at top)
   - Watering due: zones where latest `watering_log.watered_at` > 5 days ago
   - Seasonal reminders: active `plant_positions` where today's month falls within
     any `plants.seasonal_tasks` month window
   - Manual tasks: `garden_tasks` where `completed_at IS NULL` and `due_date <= today + 2`
   - Colour coded: blue = watering, amber = seasonal, teal = manual

2. **Today's conditions** — Open-Meteo API: temperature, wind speed/direction, rainfall, UV index
   Smart hint below: e.g. "Good watering day — low wind, no rain forecast"

3. **Plant health snapshot** — counts of healthy / struggling / dead from active positions
   List of struggling and dead plants below counts

4. **Bloom calendar** — current month highlighted in month strip
   List of active plants with their bloom windows shown as coloured month dots

5. **Watering log** — horizontal bar chart per zone, total litres last 7 days
   Below: recent care_log entries as a simple activity feed

### `/journal` — Journal list
- List of all `journal_posts` ordered by `published_at DESC`
- Each post: title, date, category badge, first 100 chars of content as excerpt
- Click → renders full markdown content inline (no separate route needed initially)

---

## Admin pages — what they do

### `/admin/login`
Simple form: email input, password input, sign in button.
On success → redirect to `/admin/map`.
On error → show inline error message.

### `/admin/plants`
- Table of all plants with name, latin name, water needs, roof_proven badge
- "Add plant" button → form with all fields including seasonal_tasks as a dynamic
  list of { month_start, month_end, task } rows (add/remove rows with buttons)
- Click a plant → edit form pre-filled
- Delete button with confirmation

### `/admin/map`
- SVG roof map (same base as public /garden)
- Two modes toggled by pills: "View" and "Add dot"
- View mode: click any dot → right panel opens with edit form:
  - Plant dropdown (select from `plants` library)
  - Zone dropdown
  - Health status: 3-button selector (Healthy / Struggling / Dead)
  - Planted date picker
  - Notes field
  - Save button, Remove button (sets removed_at, does not delete)
- Add mode: cursor changes to crosshair, click on SVG → captures x/y coordinates,
  right panel opens with new position form, "Place" button creates the record

### `/admin/log`
Two forms side by side (or tabbed on mobile):
- **Care log**: select active plant position (searchable dropdown), action text,
  health status selector, notes, date
- **Watering log**: select zone, date, amount in litres, notes

### `/admin/tasks`
- List of incomplete `garden_tasks` with title, zone, due date, task type badge
- "Mark done" button sets `completed_at`
- "Add task" form: title, zone (optional), due date, task type dropdown

### `/admin/journal`
- List of journal posts with title, category, published date
- "New post" button → form with title, category dropdown, markdown textarea (large),
  publish date
- Click a post → edit form pre-filled

---

## Dashboard logic details

### Watering due calculation
```typescript
// For each zone, find the most recent watering_log entry
// If watered_at < today - 5 days → flag as watering due
const WATERING_THRESHOLD_DAYS = 5;
```

### Seasonal task auto-generation
```typescript
// For each active plant_position, join to plants
// Check if today's month falls within any seasonal_tasks window
// month_start and month_end are 1-12
const currentMonth = new Date().getMonth() + 1;
const dueSeasonalTasks = activePlants.filter(p =>
  p.plants.seasonal_tasks?.some(t =>
    currentMonth >= t.month_start && currentMonth <= t.month_end
  )
);
```

### Open-Meteo weather fetch
```typescript
// Cape Town coordinates
const LAT = -33.9249;
const LON = 18.4241;
const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation,uv_index&timezone=Africa/Johannesburg`;
```

---

## TypeScript types — define these in `/lib/types.ts`

```typescript
export type HealthStatus = 'healthy' | 'struggling' | 'dead';

export type Zone = {
  id: string;
  name: string;
  sun_exposure: string;
  wind_exposure: string;
  svg_coordinates: { x: number; y: number; width: number; height: number };
  substrate_type: string;
  container_type: string;
  drainage_layer: string;
  weight_kg_per_m2: number;
  area_m2: number;
  notes: string;
};

export type Plant = {
  id: string;
  name: string;
  latin_name: string;
  slug: string;
  water_needs: string;
  sun_tolerance: string;
  wind_hardiness: string;
  bloom_season: string;
  fynbos_region: string;
  description: string;
  image_url: string;
  seasonal_tasks: SeasonalTask[];
  roof_proven: boolean;
};

export type SeasonalTask = {
  month_start: number;
  month_end: number;
  task: string;
};

export type PlantPosition = {
  id: string;
  zone_id: string;
  plant_id: string;
  svg_xy: { x: number; y: number };
  planted_at: string;
  removed_at: string | null;
  health_status: HealthStatus;
  removal_reason: string;
  notes: string;
  // joined
  plants?: Plant;
  zones?: Zone;
};

export type CareLog = {
  id: string;
  position_id: string;
  logged_at: string;
  action: string;
  notes: string;
  health_status: HealthStatus;
};

export type WateringLog = {
  id: string;
  zone_id: string;
  watered_at: string;
  amount_litres: number;
  notes: string;
};

export type JournalPost = {
  id: string;
  title: string;
  slug: string;
  content_md: string;
  category: string;
  published_at: string;
};

export type GardenTask = {
  id: string;
  title: string;
  zone_id: string | null;
  due_date: string;
  task_type: 'weeding' | 'mulching' | 'other';
  completed_at: string | null;
};
```

---

## Code style rules — follow these exactly

- Use TypeScript strict mode
- Server components by default — only add `'use client'` when you need interactivity
  (event handlers, useState, useEffect)
- Fetch data in server components using the Supabase server client
- Use `async/await`, never `.then()` chains
- Never use `any` — type everything properly using `/lib/types.ts`
- Tailwind only for styling — no inline style objects, no CSS modules
- Component files: PascalCase (`PlantPanel.tsx`)
- Utility files: camelCase (`supabase.ts`)
- One component per file
- No barrel exports (`index.ts`) — import directly from the file

---

## What NOT to build

- No user registration or signup flow
- No public commenting or user interaction
- No separate page per plant (use the slide-in panel)
- No CMS — journal posts are managed through the admin panel
- No complex state management library (Zustand, Redux) — React state is sufficient
- No CSS files or styled-components — Tailwind only

---

## Environment variables needed

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     ← server-side only, never expose to client
```

---

## Build order (follow this sequence)

1. Project scaffolding: `npx create-next-app@latest` with TypeScript + Tailwind + App Router
2. Supabase setup: create tables, set up auth, configure RLS policies
3. `/lib/supabase.ts` and `/lib/types.ts`
4. `middleware.ts` for admin route protection
5. `/admin/login` page
6. `/admin/plants` — build the plant library first, enter seed data
7. `/admin/map` — zone and plant position editor
8. `/admin/log` and `/admin/tasks`
9. `/garden` — public SVG map with slide-in panel
10. `/dashboard` — widgets one at a time, start with weather + attention panel
11. `/` — homepage (needs real data from steps above to look good)
12. `/journal` and `/admin/journal`
13. Mobile responsive pass
14. Polish: loading states, error states, OG tags, Lighthouse audit

---

## Starting prompt for first Claude Code session

Use this to kick off the build:

```
Read CLAUDE.md in full before doing anything.

We are starting Phase 1 of the build. Do the following in order:

1. Scaffold a new Next.js 14 project with TypeScript, Tailwind CSS, App Router,
   and ESLint. Use `npx create-next-app@latest fynbos-garden`.

2. Install dependencies: `@supabase/supabase-js @supabase/ssr next-mdx-remote recharts`

3. Create `/lib/types.ts` with all TypeScript types exactly as defined in CLAUDE.md.

4. Create `/lib/supabase.ts` with both a browser client and a server client
   using `@supabase/ssr`.

5. Create `middleware.ts` that protects all /admin routes — redirect to /admin/login
   if no valid Supabase session is found.

6. Create the `/admin/login` page — email and password form, calls
   supabase.auth.signInWithPassword(), redirects to /admin/map on success,
   shows inline error on failure.

7. Create a placeholder page at `/admin/map`, `/admin/plants`, `/admin/log`,
   `/admin/tasks`, `/admin/journal` that just renders the route name so we can
   confirm auth middleware is working.

Do not build anything else yet. Check in when done.
```
