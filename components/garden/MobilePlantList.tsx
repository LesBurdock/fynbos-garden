'use client';

import { useState } from 'react';
import { Zone, PlantPosition, Plant, CareLog } from '@/lib/types';

type Props = {
  zones: Zone[];
  positions: PlantPosition[];
  allPlants: Plant[];
  careLogs: CareLog[];
};

const HEALTH_BADGE: Record<string, string> = {
  healthy: 'bg-green-100 text-green-800',
  struggling: 'bg-amber-100 text-amber-800',
  dead: 'bg-red-100 text-red-800',
};

function latestCareLog(positionId: string, careLogs: CareLog[]): CareLog | null {
  return careLogs.find(l => l.position_id === positionId) ?? null;
}

export default function MobilePlantList({ zones, positions, allPlants, careLogs }: Props) {
  const [expandedReplacements, setExpandedReplacements] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
      {zones.map(zone => {
        const zonePlants = positions.filter(p => p.zone_id === zone.id);
        if (zonePlants.length === 0) return null;

        return (
          <div key={zone.id}>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-heading text-sm font-bold text-plum">{zone.name}</span>
              <span className="text-xs text-sand">{zone.sun_exposure} · {zone.wind_exposure} wind</span>
            </div>

            <div className="space-y-2">
              {zonePlants.map(pos => {
                const plant = pos.plants;
                if (!plant) return null;
                const lastLog = latestCareLog(pos.id, careLogs);
                const isExpanded = expandedReplacements === pos.id;
                const replacements = allPlants.filter(
                  p => p.id !== plant.id && p.sun_tolerance === zone.sun_exposure
                );

                return (
                  <div key={pos.id} className="bg-white rounded-2xl border border-sand/20 p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-heading text-sm font-semibold text-plum">{plant.name}</p>
                        <p className="text-xs italic text-sand">{plant.latin_name}</p>
                      </div>
                      <span className={`shrink-0 font-heading text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${HEALTH_BADGE[pos.health_status] ?? 'bg-stone-100 text-stone-600'}`}>
                        {pos.health_status}
                      </span>
                    </div>

                    {lastLog && (
                      <p className="text-xs text-plum/60">
                        Last: {lastLog.action}
                        {lastLog.logged_at && ` · ${new Date(lastLog.logged_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}`}
                      </p>
                    )}

                    {pos.health_status === 'dead' && (
                      <div>
                        <button
                          onClick={() => setExpandedReplacements(isExpanded ? null : pos.id)}
                          className="mt-1 text-xs font-heading font-semibold text-terra underline underline-offset-2"
                        >
                          {isExpanded ? 'Hide replacements' : 'Find replacement'}
                        </button>

                        {isExpanded && (
                          <div className="mt-3 space-y-2">
                            {replacements.length === 0 ? (
                              <p className="text-xs text-plum/50 italic">No matches in the library.</p>
                            ) : (
                              replacements.map(p => (
                                <div key={p.id} className="bg-mist rounded-xl p-3">
                                  <p className="font-heading text-xs font-semibold text-plum">{p.name}</p>
                                  <p className="text-xs italic text-sand">{p.latin_name}</p>
                                  <p className="text-xs text-plum/60 mt-0.5">Water: {p.water_needs} · Wind: {p.wind_hardiness}</p>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
