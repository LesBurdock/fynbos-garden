'use client';

import { useState } from 'react';
import { Plant, PlantPosition, Zone, HealthStatus } from '@/lib/types';
import {
  createPosition,
  updatePosition,
  removePosition,
  PositionFormData,
} from '@/app/admin/map/actions';

type Props = {
  position: PlantPosition | null;
  pendingCoords: { x: number; y: number } | null;
  plants: Plant[];
  zones: Zone[];
  onClose: () => void;
};

const HEALTH_OPTIONS: { value: HealthStatus; label: string; color: string }[] = [
  { value: 'healthy', label: 'Healthy', color: 'bg-green-600 text-white' },
  { value: 'struggling', label: 'Struggling', color: 'bg-amber-500 text-white' },
  { value: 'dead', label: 'Dead', color: 'bg-red-600 text-white' },
];

export default function PositionForm({ position, pendingCoords, plants, zones, onClose }: Props) {
  const [plantId, setPlantId] = useState(position?.plant_id ?? '');
  const [zoneId, setZoneId] = useState(position?.zone_id ?? '');
  const [healthStatus, setHealthStatus] = useState<HealthStatus>(position?.health_status ?? 'healthy');
  const [plantedAt, setPlantedAt] = useState(position?.planted_at ?? new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(position?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [error, setError] = useState('');

  const isNew = position === null;
  const coords = pendingCoords ?? position?.svg_xy ?? { x: 0, y: 0 };

  async function handleSave() {
    if (!plantId || !zoneId) {
      setError('Plant and zone are required.');
      return;
    }
    setSaving(true);
    setError('');

    const data: PositionFormData = {
      zone_id: zoneId,
      plant_id: plantId,
      svg_xy: coords,
      health_status: healthStatus,
      planted_at: plantedAt,
      notes,
    };

    const result = isNew
      ? await createPosition(data)
      : await updatePosition(position.id, { zone_id: zoneId, plant_id: plantId, health_status: healthStatus, planted_at: plantedAt, notes });

    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  }

  async function handleRemove() {
    if (!position) return;
    setRemoving(true);
    const result = await removePosition(position.id);
    setRemoving(false);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
        <h2 className="text-base font-semibold text-stone-800">
          {isNew ? 'Place plant' : 'Edit position'}
        </h2>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none">×</button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

        {/* Coordinates (read-only) */}
        <div className="flex gap-3 text-xs text-stone-400 bg-stone-50 rounded-lg px-3 py-2">
          <span>x: {coords.x}</span>
          <span>y: {coords.y}</span>
        </div>

        {/* Plant */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Plant *</label>
          <select
            className={input}
            value={plantId}
            onChange={e => setPlantId(e.target.value)}
          >
            <option value="">Select a plant…</option>
            {plants.map(p => (
              <option key={p.id} value={p.id}>{p.name} — {p.latin_name}</option>
            ))}
          </select>
        </div>

        {/* Zone */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Zone *</label>
          <select
            className={input}
            value={zoneId}
            onChange={e => setZoneId(e.target.value)}
          >
            <option value="">Select a zone…</option>
            {zones.map(z => (
              <option key={z.id} value={z.id}>{z.name} — {z.sun_exposure}, {z.wind_exposure} wind</option>
            ))}
          </select>
        </div>

        {/* Health status */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Health status</label>
          <div className="flex gap-2">
            {HEALTH_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setHealthStatus(opt.value)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                  healthStatus === opt.value
                    ? opt.color
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Planted at */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Planted</label>
          <input
            type="date"
            className={input}
            value={plantedAt}
            onChange={e => setPlantedAt(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Notes</label>
          <textarea
            className={`${input} resize-none`}
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-stone-200 flex flex-col gap-2">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2 transition-colors"
          >
            {saving ? 'Saving…' : isNew ? 'Place' : 'Save'}
          </button>
          {!isNew && !confirmRemove && (
            <button
              onClick={() => setConfirmRemove(true)}
              className="px-4 text-sm text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 rounded-lg transition-colors"
            >
              Remove
            </button>
          )}
          {!isNew && confirmRemove && (
            <button
              onClick={handleRemove}
              disabled={removing}
              className="px-4 text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {removing ? 'Removing…' : 'Confirm'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const input = 'border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white w-full';
