'use client';

import { useState } from 'react';
import { Zone } from '@/lib/types';
import { createWateringLog } from '@/app/admin/log/actions';

type Props = {
  zones: Zone[];
};

const today = () => new Date().toISOString().split('T')[0];

export default function WateringLogForm({ zones }: Props) {
  const [zoneId, setZoneId] = useState('');
  const [wateredAt, setWateredAt] = useState(today());
  const [amountLitres, setAmountLitres] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!zoneId || !amountLitres) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await createWateringLog({
      zone_id: zoneId,
      watered_at: wateredAt,
      amount_litres: parseFloat(amountLitres),
      notes,
    });

    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setZoneId('');
      setAmountLitres('');
      setNotes('');
      setWateredAt(today());
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Zone */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Zone</label>
        <select
          value={zoneId}
          onChange={e => setZoneId(e.target.value)}
          required
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Select a zone…</option>
          {zones.map(zone => (
            <option key={zone.id} value={zone.id}>{zone.name}</option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Date</label>
        <input
          type="date"
          value={wateredAt}
          onChange={e => setWateredAt(e.target.value)}
          required
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Amount (litres)</label>
        <input
          type="number"
          value={amountLitres}
          onChange={e => setAmountLitres(e.target.value)}
          required
          min="0"
          step="0.5"
          placeholder="e.g. 10"
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="Optional notes…"
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-blue-600">Watering log entry saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving…' : 'Save watering log'}
      </button>
    </form>
  );
}
