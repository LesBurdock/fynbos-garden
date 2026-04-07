'use client';

import { useState } from 'react';
import { PlantPosition, Plant, CareLog } from '@/lib/types';

type Props = {
  position: PlantPosition;
  lastCareLog: CareLog | null;
  allPlants: Plant[];
  onClose: () => void;
};

const HEALTH_BADGE: Record<string, string> = {
  healthy: 'bg-green-100 text-green-800',
  struggling: 'bg-amber-100 text-amber-800',
  dead: 'bg-red-100 text-red-800',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function PlantPanel({ position, lastCareLog, allPlants, onClose }: Props) {
  const [showReplacements, setShowReplacements] = useState(false);

  const plant = position.plants;
  const zone = position.zones;

  if (!plant || !zone) return null;

  const replacements = allPlants.filter(
    p => p.id !== plant.id && p.sun_tolerance === zone.sun_exposure
  );

  return (
    <div className="flex flex-col h-full bg-mist">
      {/* Hero image */}
      {plant.image_url && (
        <ImageHero src={plant.image_url} alt={plant.name} />
      )}

      {/* Header */}
      <div className="flex items-start justify-between px-6 py-5 border-b border-stone-200 bg-white shrink-0">
        <div>
          <h2 className="font-heading text-xl font-bold text-stone-900 leading-tight">{plant.name}</h2>
          <p className="text-sm italic text-stone-500 mt-0.5">{plant.latin_name}</p>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-plum text-2xl leading-none ml-4 mt-0.5"
        >
          &times;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {/* Zone + health */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-heading text-xs font-semibold px-2.5 py-1 rounded-full bg-plum text-white">
            {zone.name}
          </span>
          <span className={`font-heading text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${HEALTH_BADGE[position.health_status] ?? 'bg-stone-100 text-stone-600'}`}>
            {position.health_status}
          </span>
        </div>

        {/* Last care log */}
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="font-heading text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Last care</p>
          {lastCareLog ? (
            <>
              <p className="text-sm font-semibold text-stone-800">{lastCareLog.action}</p>
              {lastCareLog.notes && (
                <p className="text-sm text-stone-600 mt-1">{lastCareLog.notes}</p>
              )}
              <p className="text-xs text-stone-400 mt-1.5">{formatDate(lastCareLog.logged_at)}</p>
            </>
          ) : (
            <p className="text-sm text-stone-400 italic">No care logged yet</p>
          )}
        </div>

        {/* Plant characteristics */}
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="font-heading text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Characteristics</p>
          <div className="space-y-2">
            <Row label="Water needs" value={plant.water_needs} />
            <Row label="Sun" value={plant.sun_tolerance} />
            <Row label="Wind" value={plant.wind_hardiness} />
            {plant.bloom_season && <Row label="Blooms" value={plant.bloom_season} />}
            {plant.fynbos_region && <Row label="Region" value={plant.fynbos_region} />}
          </div>
        </div>

        {/* Description */}
        {plant.description && (
          <div className="bg-white rounded-xl p-4 border border-stone-200">
            <p className="font-heading text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">About</p>
            <p className="text-sm text-stone-700 leading-relaxed font-body">{plant.description}</p>
          </div>
        )}

        {/* Planted date */}
        {position.planted_at && (
          <p className="text-xs text-stone-400 px-1">Planted {formatDate(position.planted_at)}</p>
        )}

        {/* Find replacement */}
        {position.health_status === 'dead' && (
          <div>
            <button
              onClick={() => setShowReplacements(v => !v)}
              className="w-full bg-terra text-white font-heading text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              {showReplacements ? 'Hide replacements' : 'Find replacement'}
            </button>

            {showReplacements && (
              <div className="mt-3 space-y-2">
                <p className="font-heading text-xs font-semibold text-stone-400 uppercase tracking-wide px-1">
                  Suited to {zone.sun_exposure} · {zone.wind_exposure} wind
                </p>
                {replacements.length === 0 ? (
                  <p className="text-sm text-stone-400 italic px-1">No matches found in the library.</p>
                ) : (
                  replacements.map(p => (
                    <div key={p.id} className="bg-white rounded-xl p-3 border border-stone-200">
                      <p className="font-heading text-sm font-semibold text-plum">{p.name}</p>
                      <p className="text-xs italic text-stone-500">{p.latin_name}</p>
                      <div className="flex gap-3 mt-1.5 flex-wrap">
                        <span className="text-xs text-stone-500">Water: {p.water_needs}</span>
                        <span className="text-xs text-stone-500">Wind: {p.wind_hardiness}</span>
                        {p.bloom_season && <span className="text-xs text-stone-500">Blooms: {p.bloom_season}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ImageHero({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <div className="shrink-0 h-48 bg-stone-100 overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
      />
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
