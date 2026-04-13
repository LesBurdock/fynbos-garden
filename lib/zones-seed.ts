// zones-seed.ts
// Seed data for the `zones` table in Supabase.
// SVG coordinate system explained below — read before editing coordinates.
//
// Real-world roof dimensions: 9m (west–east) x 11.6m (north–south)
// SVG canvas: 580w x 424h (inside the parapet walls)
// Scale: 1m = ~50px east–west, ~36px north–south
//
// Orientation (matches the roof plan):
//   x=0   → west wall (inside parapet)
//   x=580 → east wall (inside parapet)
//   y=0   → north wall (inside parapet)
//   y=424 → south wall (inside parapet)
//
// Zone layout:
//
//   ┌─────────────────────────────────┬──────────────┐
//   │         Zone B (north)          │              │
//   │   [seating NE, hatch NW]        │   Zone C     │
//   ├─────────────────────────────────│  (east wall) │
//   │                                 │              │
//   │         Zone D (centre)         │              │
//   │                                 │              │
//   ├─────────────────────────────────│              │
//   │  [seat SW]   Zone A (south)     │              │
//   └─────────────────────────────────┴──────────────┘
//
// Seating areas are not zones — they are noted in zone.notes.
// They are non-planting areas within the zone boundary.

export type ZoneCoordinates = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ZoneSeed = {
  name: string;
  sun_exposure: string;
  wind_exposure: string;
  svg_coordinates: ZoneCoordinates;
  substrate_type: string;
  container_type: string;
  drainage_layer: string;
  weight_kg_per_m2: number;
  area_m2: number;
  notes: string;
};

export const ZONES_SEED: ZoneSeed[] = [
  {
    name: "Zone A",
    sun_exposure: "Full sun",
    wind_exposure: "High",
    svg_coordinates: {
      x: 0,
      y: 310,
      width: 415,
      height: 114,
    },
    // Real world: ~8.3m wide x ~3m tall — south strip, full width minus Zone C
    substrate_type: "",
    container_type: "",
    drainage_layer: "",
    weight_kg_per_m2: 0,
    area_m2: 27,
    notes: "South-facing strip. Receives the full SE wind over the south parapet — hardiest plants only. The ~1.2m strip immediately against the south parapet wall has some wind relief. SW corner contains a small secondary seating area (~1.5m x 2m) for winter sun — protected by both south and west parapets.",
  },

  {
    name: "Zone B",
    sun_exposure: "Full sun",
    wind_exposure: "Low",
    svg_coordinates: {
      x: 0,
      y: 0,
      width: 415,
      height: 114,
    },
    // Real world: ~8.3m wide x ~3m tall — north strip, full width minus Zone C
    substrate_type: "",
    container_type: "",
    drainage_layer: "",
    weight_kg_per_m2: 0,
    area_m2: 24,
    notes: "North-facing strip, lee side of the SE wind — most sheltered planting zone. Stairwell hatch is in the NW corner. Entry path runs south along the west wall. NE corner contains the main seating area (~3m x 2.5m) which overlaps with the top of Zone C — morning shade, afternoon sun, sheltered by both north and east parapets.",
  },

  {
    name: "Zone C",
    sun_exposure: "Part shade",
    wind_exposure: "Low",
    svg_coordinates: {
      x: 415,
      y: 0,
      width: 165,
      height: 424,
    },
    // Real world: ~2.5m wide x full 11.6m length — east wall strip
    substrate_type: "",
    container_type: "",
    drainage_layer: "",
    weight_kg_per_m2: 0,
    area_m2: 23,
    notes: "East wall strip running the full length of the roof (~2.5m wide). Shaded by the east parapet wall until approximately noon — receives full afternoon sun from midday onwards. Sheltered from the SE wind by the east parapet. Coolest zone in summer. Top section (NE corner) is the main seating area shared with Zone B.",
  },

  {
    name: "Zone D",
    sun_exposure: "Full sun",
    wind_exposure: "Moderate",
    svg_coordinates: {
      x: 0,
      y: 114,
      width: 415,
      height: 196,
    },
    // Real world: ~8.3m wide x ~5m tall — central band between Zone B and Zone A
    substrate_type: "",
    container_type: "",
    drainage_layer: "",
    weight_kg_per_m2: 0,
    area_m2: 35,
    notes: "Central zone — the largest and calmest on the roof. All four parapets provide averaged wind shelter with no single direction dominating. Full sun all day. This is the feature zone — focal point when looking south from the main seating area. Best spot for showier specimen plants.",
  },
];

// ─── NOTES FOR SEEDING ───────────────────────────────────────────────────────
//
// Fields left blank (substrate_type, container_type, drainage_layer,
// weight_kg_per_m2) are to be filled in once you have finalised your
// materials research. These drive the zone detail panel on the public
// /garden page and are important for the roof load calculation.
//
// SVG coordinate system uses the parapet inner edge as the boundary.
// The outer SVG canvas should add ~25px padding on all sides for the
// parapet wall stroke. So the full SVG viewBox should be:
//   viewBox="0 0 630 474"
// with zones offset by 25px:
//   actual x on canvas = svg_coordinates.x + 25
//   actual y on canvas = svg_coordinates.y + 25
//
// Zone areas are approximate based on the design layout.
// Zones A + B + C + D = 109m² — slightly over 92m² because the zones
// overlap at the seating corners. Treat area_m2 as the planting area
// (excluding seating) rather than the total zone footprint.
//
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  const { error } = await supabase.from('zones').insert(ZONES_SEED);
  if (error) console.error(error);
  else console.log(`Seeded ${ZONES_SEED.length} zones`);
}

seed();
