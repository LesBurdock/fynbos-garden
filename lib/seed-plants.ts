// plants-seed.ts
// Seed data for the `plants` table in Supabase.
// Fields match the database schema exactly.
// Run once after your Supabase tables are created in Phase 2.
//
// Usage:
//   const { error } = await supabase.from('plants').insert(PLANTS_SEED);

import { SeasonalTask } from './types';

export type PlantSeed = {
  name: string;
  latin_name: string;
  slug: string;
  water_needs: 'Low' | 'Moderate' | 'High';
  sun_tolerance: 'Full sun' | 'Part shade' | 'Full shade';
  wind_hardiness: 'High' | 'Moderate' | 'Low';
  bloom_season: string;
  fynbos_region: string;
  description: string;
  image_url: string;
  seasonal_tasks: SeasonalTask[];
  roof_proven: boolean;
  reference_urls: string[];
};

export const PLANTS_SEED: PlantSeed[] = [
  {
    name: "Savannah Bristle Grass",
    latin_name: "Melinis nerviglumis 'Savannah'",
    slug: "melinis-nerviglumis-savannah",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Spring–Summer",
    fynbos_region: "Western Cape, Karoo, Succulent Karoo, Bushveld, Highveld, Subtropical East Coast, Thicket",
    description: "A compact ornamental grass reaching 50cm with red-purple flowers in spring and summer. Thrives in disturbed and sandy soils with no fertiliser required — ideal for lightweight roof substrates. Excellent for topsoil stabilisation on exposed surfaces. Suited to full sun and windy positions. Prefers no fertiliser at any time of year.",
    image_url: "https://static.wixstatic.com/media/5a78c0_afdfcbda92184dadbb65d7e04ecd9c2d~mv2.jpg/v1/fill/w_761,h_1014,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/5a78c0_afdfcbda92184dadbb65d7e04ecd9c2d~mv2.jpg",
    seasonal_tasks: [
      {
        month_start: 7,
        month_end: 8,
        task: "Cut back hard to base after flowering — do not fertilise"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://mygardenlife.com/plant-library/melinis-savannah-melinis-nerviglumis",
      "https://www.theplantlibrary.co.za/plants/melinis-species",
    ],
  },

  {
    name: "Red Grass",
    latin_name: "Themeda triandra",
    slug: "themeda-triandra",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Spring–Autumn",
    fynbos_region: "Western Cape, Karoo, Thicket, Bushveld Savanna, Subtropical East Coast",
    description: "A tough iconic South African grass known as Rooigras, growing 40cm–1.2m depending on conditions. Cream flowers from October through July. Handles full sun, wind exposure, rocky and sandy soils, and dry conditions — well suited to roof zones with high wind and minimal substrate depth. Good for grassland meadow and rockery situations. Attracts birds.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Themeda_triandra_-_kangaroo_grass.jpg/1920px-Themeda_triandra_-_kangaroo_grass.jpg",
    seasonal_tasks: [
      {
        month_start: 6,
        month_end: 7,
        task: "Cut back to 10cm in winter to encourage fresh growth in spring"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://www.theplantlibrary.co.za/plants/andropogon-eucomus",
    ],
  },

  {
    name: "Tortoise Berry",
    latin_name: "Muraltia spinosa",
    slug: "muraltia-spinosa",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "Moderate",
    bloom_season: "Autumn–Spring",
    fynbos_region: "Western Cape, Karoo, Thicket",
    description: "A small spiny fynbos shrub reaching 1m x 1m with pink-purple flowers from April to October. Frost tender — needs shelter from cold in exposed positions. Suited to hot dry conditions in full sun. Winter rainfall adapted. Good for rockery and shrubbery situations. Attracts birds and tortoises.",
    image_url: "https://www.theplantlibrary.co.za/plants/muraltia-spinosa",
    seasonal_tasks: [
      {
        month_start: 10,
        month_end: 11,
        task: "Light tip prune after main flowering flush to maintain compact shape"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://www.theplantlibrary.co.za/plants/muraltia-spinosa",
    ],
  },

  {
    name: "Spike Spurflower",
    latin_name: "Plectranthus spicatus",
    slug: "plectranthus-spicatus",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "Moderate",
    bloom_season: "Autumn–Winter",
    fynbos_region: "Thicket, Bushveld Savanna, Subtropical East Coast, Highveld",
    description: "Also known as Lavender Plectranthus. A succulent perennial with 70cm lavender blue-mauve flower spikes from March to June — filling the autumn-winter gap when many other plants are dormant. Hardy and low water. Explicitly listed as suitable for roof gardens, walls and rocky slopes. Attracts butterflies, bees and insects. Summer rainfall adapted.",
    image_url: "https://www.theplantlibrary.co.za/plants/plectranthus-spicatus",
    seasonal_tasks: [
      {
        month_start: 6,
        month_end: 8,
        task: "Prune hard after winter flowering to encourage healthy growth and flowers the following season"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://www.theplantlibrary.co.za/plants/plectranthus-spicatus",
    ],
  },

  {
    name: "Cape Scabious",
    latin_name: "Scabiosa africana / incisa / columbaria hybrids",
    slug: "scabiosa-cape-scabious",
    water_needs: "Moderate",
    sun_tolerance: "Full sun",
    wind_hardiness: "Moderate",
    bloom_season: "Spring–Summer",
    fynbos_region: "Western Cape, Highveld, Thicket, Subtropical East Coast",
    description: "Also called Pincushion — not to be confused with Leucospermum. A perennial reaching 60cm with mauve, pink, purple or white flowers from September to December. Explicitly listed as suitable for containers and roof gardens. Hardy and winter-rainfall adapted. Tolerates clay soils. Attracts insects and butterflies.",
    image_url: "https://www.theplantlibrary.co.za/plants/scabiosa-africana-incisa-columbaria-hybrids",
    seasonal_tasks: [
      {
        month_start: 1,
        month_end: 2,
        task: "Deadhead spent flowers after summer flush to encourage repeat blooming"
      },
      {
        month_start: 6,
        month_end: 7,
        task: "Light trim in winter dormancy to tidy shape — do not cut back hard"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://mygardenlife.com/plant-library/pincushion-flower-small-scabious-dove-pincushions-scabiosa-columbaria",
      "https://www.theplantlibrary.co.za/plants/scabiosa-africana-incisa-columbaria-hybrids",
    ],
  },

  {
    name: "Blue Marguerite",
    latin_name: "Felicia amelloides",
    slug: "felicia-amelloides",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Spring–Autumn",
    fynbos_region: "Western Cape, Thicket",
    description: "A low-growing groundcover reaching 60cm x 60cm with blue or white daisy flowers from September through March. One of the most roof-garden-friendly plants in the list — explicitly cited for roof gardens, containers, walls, sandy soils, paving and narrow spaces. Hardy and low water. Tolerates clay soils. Attracts bees, butterflies and insects.",
    image_url: "https://www.theplantlibrary.co.za/plants/felicia-amelloides-",
    seasonal_tasks: [
      {
        month_start: 4,
        month_end: 5,
        task: "Cut back by one third after main flowering flush to maintain compact shape and encourage fresh growth"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://www.theplantlibrary.co.za/plants/felicia-amelloides-",
      "https://mygardenlife.com/plant-library/blue-marguerite-felicia-amelloides",
    ],
  },

  {
    name: "Wild Cineraria",
    latin_name: "Cineraria saxifraga",
    slug: "cineraria-saxifraga",
    water_needs: "Low",
    sun_tolerance: "Part shade",
    wind_hardiness: "Moderate",
    bloom_season: "Spring–Summer",
    fynbos_region: "Thicket, Coastal Eastern Cape, Coastal KZN",
    description: "A compact perennial growing 15–40cm with yellow flowers in spring and summer. One of the few plants in this list that tolerates semi-shade — ideal for part-shade roof zones. Explicitly listed for roof gardens, green walls, containers, dry shade and narrow spaces. Grows naturally on rocky cliff faces. Summer rainfall adapted.",
    image_url: "https://www.theplantlibrary.co.za/plants/cineraria-saxifraga",
    seasonal_tasks: [
      {
        month_start: 1,
        month_end: 2,
        task: "Remove spent flower stems after summer flowering to keep tidy"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://www.theplantlibrary.co.za/plants/cineraria-saxifraga",
    ],
  },

  {
    name: "Trailing Mauve Daisy",
    latin_name: "Dimorphotheca jucunda",
    slug: "dimorphotheca-jucunda",
    water_needs: "Moderate",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Autumn–Spring",
    fynbos_region: "Thicket, Highveld, Bushveld Savanna, Subtropical East Coast",
    description: "A trailing groundcover perennial, 25–35cm tall and 60cm wide with mauve daisy flowers from March to September — covering the autumn-winter-spring gap when many fynbos plants rest. Explicitly listed for roof gardens, hanging baskets, walls and containers. Handles sandy, dry and clay soils. Summer rainfall adapted. Attracts butterflies and insects.",
    image_url: "https://www.theplantlibrary.co.za/plants/dimorphotheca-jucunda",
    seasonal_tasks: [
      {
        month_start: 10,
        month_end: 11,
        task: "Trim back after spring flush — this groundcover can sprawl; cut before summer to keep compact"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://mygardenlife.com/plant-library/osteospermum-african-daisy-cape-daisy-osteospermum-hybrid",
      "https://www.theplantlibrary.co.za/plants/dimorphotheca-jucunda",
    ],
  },

  {
    name: "Carpet Geranium",
    latin_name: "Geranium incanum",
    slug: "geranium-incanum",
    water_needs: "Moderate",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Spring–Autumn",
    fynbos_region: "Western Cape, Thicket, Coastal Eastern Cape, Coastal KZN",
    description: "Also known as Bergtee or Cranebill. A spreading groundcover perennial, 35cm x 50cm with mauve flowers from September through May. Explicitly listed for roof gardens, containers, walls, green walls and paving. Handles windy exposed positions well — one of the stronger groundcovers for full-sun exposed roof zones. Winter and summer rainfall adapted. Attracts bees, butterflies and insects.",
    image_url: "https://www.theplantlibrary.co.za/plants/geranium-incanum",
    seasonal_tasks: [
      {
        month_start: 6,
        month_end: 7,
        task: "Cut back by half in winter after flowering ends — encourages dense regrowth for the spring flush"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://www.theplantlibrary.co.za/plants/geranium-incanum",
    ],
  },
];

// ─── SEEDING NOTES ───────────────────────────────────────────────────────────
//
// 1. image_url — Red Grass and Savannah Bristle Grass are missing image URLs.
//    Upload your own photos to Supabase Storage and replace the empty strings.
//    Avoid hotlinking from theplantlibrary.co.za as those URLs may break.
//
// 2. Slugs are the URL identifier for each plant. Confirm latin name spelling
//    before inserting — typos will affect the find-replacement matching logic.
//
// 3. wind_hardiness logic:
//    "High"     = explicitly listed as handling windy/exposed positions
//    "Moderate" = general sun plant, no specific wind note
//    "Low"      = noted as tender or needing shelter
//
// 4. reference_urls is a jsonb column in Supabase — the string[] type here
//    maps correctly to a Postgres jsonb array on insert.
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
  const { error } = await supabase.from('plants').insert(PLANTS_SEED);
  if (error) console.error(error);
  else console.log(`Seeded ${PLANTS_SEED.length} plants`);
}

seed();
