// scripts/seed-plants.ts
// Upserts all plants from lib/seed-plants.ts into Supabase.
// Run with: npx tsx scripts/seed-plants.ts

import { createClient } from '@supabase/supabase-js';
import { PLANTS_SEED } from '../lib/seed-plants';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log(`Seeding ${PLANTS_SEED.length} plants...`);

  const { data, error } = await supabase
    .from('plants')
    .upsert(PLANTS_SEED, { onConflict: 'slug' })
    .select('slug');

  if (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }

  console.log(`Done. Upserted ${data.length} plants:`);
  data.forEach((p) => console.log(' -', p.slug));
}

seed();
