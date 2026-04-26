import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Zone, PlantPosition, Plant } from '@/lib/types';
import SiteNav from '@/components/ui/SiteNav';
import PlantCollage from '@/components/zones/PlantCollage';

type PositionWithPlant = PlantPosition & { plants: Plant | null };

type ZoneWithPositions = Zone & {
  positions: PositionWithPlant[];
};

export default async function ZonesPage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: zonesData }, { data: positionsData }] = await Promise.all([
    supabase.from('zones').select('*').order('name'),
    supabase
      .from('plant_positions')
      .select('*, plants(*)')
      .is('removed_at', null),
  ]);

  const zones = (zonesData ?? []) as Zone[];
  const positions = (positionsData ?? []) as PositionWithPlant[];

  const zonesWithPlants: ZoneWithPositions[] = zones.map(zone => ({
    ...zone,
    positions: positions.filter(p => p.zone_id === zone.id),
  }));

  return (
    <div className="min-h-screen bg-mist text-plum">
      <SiteNav variant="dark" solidBg />

      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24">

        {/* Header */}
        <div className="mb-16">
          <p className="font-heading text-xs uppercase tracking-widest text-terra mb-3">The garden</p>
          <h1 className="font-heading text-4xl md:text-5xl text-plum mb-4">Zones</h1>
          <p className="font-body text-lg text-plum/60 italic max-w-xl">
            Each zone has its own microclimate, substrate, and plant community. Here&apos;s what&apos;s growing where.
          </p>
        </div>

        {/* Zone sections */}
        <div className="space-y-24">
          {zonesWithPlants.map(zone => (
            <section key={zone.id}>

              {/* Zone header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-5 border-b border-sand/30">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl text-plum mb-2">{zone.name}</h2>
                  <div className="flex flex-wrap gap-4 font-heading text-xs uppercase tracking-widest text-plum/50">
                    {zone.sun_exposure   && <span>{zone.sun_exposure}</span>}
                    {zone.wind_exposure  && <span>· {zone.wind_exposure} wind</span>}
                    {zone.area_m2        && <span>· {zone.area_m2} m²</span>}
                  </div>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <p className="font-heading text-2xl text-plum">{zone.positions.length}</p>
                    <p className="font-heading text-xs uppercase tracking-widest text-plum/40">Plants</p>
                  </div>
                  <div>
                    <p className="font-heading text-2xl text-green-600">
                      {zone.positions.filter(p => p.health_status === 'healthy').length}
                    </p>
                    <p className="font-heading text-xs uppercase tracking-widest text-plum/40">Healthy</p>
                  </div>
                </div>
              </div>

              {/* Two-col: collage left, details right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                {/* Collage */}
                <PlantCollage positions={zone.positions} />

                {/* Zone details + plant list */}
                <div className="space-y-8">

                  {/* Substrate / container */}
                  {(zone.substrate_type || zone.container_type || zone.drainage_layer) && (
                    <div className="space-y-3">
                      <p className="font-heading text-xs uppercase tracking-widest text-terra">Growing medium</p>
                      <dl className="space-y-1.5">
                        {zone.substrate_type  && <div className="flex gap-3"><dt className="font-heading text-xs text-plum/40 w-24 shrink-0">Substrate</dt><dd className="font-body text-sm text-plum/80">{zone.substrate_type}</dd></div>}
                        {zone.container_type  && <div className="flex gap-3"><dt className="font-heading text-xs text-plum/40 w-24 shrink-0">Container</dt><dd className="font-body text-sm text-plum/80">{zone.container_type}</dd></div>}
                        {zone.drainage_layer  && <div className="flex gap-3"><dt className="font-heading text-xs text-plum/40 w-24 shrink-0">Drainage</dt><dd className="font-body text-sm text-plum/80">{zone.drainage_layer}</dd></div>}
                      </dl>
                    </div>
                  )}

                  {/* Plant list */}
                  {zone.positions.length > 0 && (
                    <div className="space-y-3">
                      <p className="font-heading text-xs uppercase tracking-widest text-terra">Plants</p>
                      <ul className="space-y-2">
                        {zone.positions.map(pos => (
                          <li key={pos.id} className="flex items-center justify-between gap-3">
                            <div>
                              <span className="font-heading text-sm text-plum">{pos.plants?.name ?? 'Unknown'}</span>
                              {pos.plants?.latin_name && (
                                <span className="font-body text-xs italic text-plum/40 ml-2">{pos.plants.latin_name}</span>
                              )}
                            </div>
                            <span className={`font-heading text-xs px-2 py-0.5 rounded-full shrink-0 ${
                              pos.health_status === 'healthy'    ? 'bg-green-100 text-green-700' :
                              pos.health_status === 'struggling' ? 'bg-amber-100 text-amber-700' :
                                                                   'bg-red-100 text-red-700'
                            }`}>
                              {pos.health_status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {zone.positions.length === 0 && (
                    <p className="font-body text-sm italic text-plum/40">No plants currently in this zone.</p>
                  )}

                  {/* Notes */}
                  {zone.notes && (
                    <p className="font-body text-sm italic text-plum/60 border-l-2 border-sand/40 pl-4">{zone.notes}</p>
                  )}
                </div>

              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
