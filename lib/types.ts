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
  reference_urls: string[];
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
