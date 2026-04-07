'use client';

import { Zone, PlantPosition } from '@/lib/types';

type Props = {
  zone: Zone;
  positions: PlantPosition[];
  onClose: () => void;
};

const HEALTH_BADGE: Record<string, string> = {
  healthy: 'bg-green-100 text-green-800',
  struggling: 'bg-amber-100 text-amber-800',
  dead: 'bg-red-100 text-red-800',
};

export default function ZonePanel({ zone, positions, onClose }: Props) {
  const zonePlants = positions.filter(p => p.zone_id === zone.id);

  return (
    <div className="flex flex-col h-full bg-mist">
      {/* Header */}
      <div className="flex items-start justify-between px-6 py-5 border-b border-stone-200 bg-white shrink-0">
        <div>
          <h2 className="font-heading text-xl font-bold text-stone-900">{zone.name}</h2>
          <p className="text-sm text-stone-500 mt-0.5">{zone.sun_exposure} · {zone.wind_exposure} wind</p>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-plum text-2xl leading-none ml-4 mt-0.5"
        >
          &times;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {/* Zone specs */}
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="font-heading text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Setup</p>
          <div className="space-y-2">
            {zone.container_type && <Row label="Container" value={zone.container_type} />}
            {zone.substrate_type && <Row label="Substrate" value={zone.substrate_type} />}
            {zone.drainage_layer && <Row label="Drainage" value={zone.drainage_layer} />}
            {zone.area_m2 != null && <Row label="Area" value={`${zone.area_m2} m²`} />}
            {zone.weight_kg_per_m2 != null && <Row label="Weight" value={`${zone.weight_kg_per_m2} kg/m²`} />}
          </div>
        </div>

        {/* Current plants */}
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="font-heading text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
            Current plants ({zonePlants.length})
          </p>
          {zonePlants.length === 0 ? (
            <p className="text-sm text-stone-400 italic">No plants in this zone yet.</p>
          ) : (
            <div className="space-y-2">
              {zonePlants.map(pos => (
                <div key={pos.id} className="flex items-center justify-between gap-3 py-2 border-b border-stone-100 last:border-0">
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-semibold text-stone-800 truncate">
                      {pos.plants?.name ?? 'Unknown'}
                    </p>
                    <p className="text-xs italic text-stone-400 truncate">{pos.plants?.latin_name}</p>
                  </div>
                  <span className={`shrink-0 font-heading text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${HEALTH_BADGE[pos.health_status] ?? 'bg-stone-100 text-stone-600'}`}>
                    {pos.health_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        {zone.notes && (
          <div className="bg-white rounded-xl p-4 border border-stone-200">
            <p className="font-heading text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Notes</p>
            <p className="text-sm text-stone-700 font-body leading-relaxed">{zone.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="font-heading text-xs text-stone-400 shrink-0">{label}</span>
      <span className="text-sm font-medium text-stone-800 text-right">{value}</span>
    </div>
  );
}
