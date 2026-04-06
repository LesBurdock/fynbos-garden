'use client';

import { useState } from 'react';
import { PlantPosition, HealthStatus } from '@/lib/types';
import { createCareLog } from '@/app/admin/log/actions';

type Props = {
  positions: PlantPosition[];
};

const HEALTH_OPTIONS: { value: HealthStatus; label: string; colour: string }[] = [
  { value: 'healthy', label: 'Healthy', colour: 'bg-green-600 text-white' },
  { value: 'struggling', label: 'Struggling', colour: 'bg-amber-500 text-white' },
  { value: 'dead', label: 'Dead', colour: 'bg-red-600 text-white' },
];

const today = () => new Date().toISOString().split('T')[0];

export default function CareLogForm({ positions }: Props) {
  const [positionId, setPositionId] = useState('');
  const [action, setAction] = useState('');
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('healthy');
  const [notes, setNotes] = useState('');
  const [loggedAt, setLoggedAt] = useState(today());
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!positionId || !action) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await createCareLog({ position_id: positionId, logged_at: loggedAt, action, health_status: healthStatus, notes });

    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setPositionId('');
      setAction('');
      setNotes('');
      setLoggedAt(today());
      setHealthStatus('healthy');
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Plant position */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Plant position</label>
        <select
          value={positionId}
          onChange={e => setPositionId(e.target.value)}
          required
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="">Select a plant…</option>
          {positions.map(pos => (
            <option key={pos.id} value={pos.id}>
              {pos.plants?.name ?? 'Unknown'} — {pos.zones?.name ?? '—'}
            </option>
          ))}
        </select>
      </div>

      {/* Action */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Action</label>
        <input
          type="text"
          value={action}
          onChange={e => setAction(e.target.value)}
          required
          placeholder="e.g. Pruned, Fertilised, Health check"
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      {/* Health status */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Health status</label>
        <div className="flex gap-2">
          {HEALTH_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setHealthStatus(opt.value)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                healthStatus === opt.value ? opt.colour : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Date</label>
        <input
          type="date"
          value={loggedAt}
          onChange={e => setLoggedAt(e.target.value)}
          required
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-600"
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
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Care log entry saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-green-700 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving…' : 'Save care log'}
      </button>
    </form>
  );
}
