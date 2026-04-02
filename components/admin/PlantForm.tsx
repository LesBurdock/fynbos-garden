'use client';

import { useState } from 'react';
import { Plant, SeasonalTask } from '@/lib/types';
import { createPlant, updatePlant, deletePlant, PlantFormData } from '@/app/admin/plants/actions';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const EMPTY_FORM: PlantFormData = {
  name: '',
  latin_name: '',
  slug: '',
  water_needs: 'Low',
  sun_tolerance: 'Full sun',
  wind_hardiness: 'High',
  bloom_season: '',
  fynbos_region: '',
  description: '',
  image_url: '',
  reference_urls: [],
  seasonal_tasks: [],
  roof_proven: false,
};

function plantToForm(plant: Plant): PlantFormData {
  return {
    name: plant.name,
    latin_name: plant.latin_name,
    slug: plant.slug,
    water_needs: plant.water_needs,
    sun_tolerance: plant.sun_tolerance,
    wind_hardiness: plant.wind_hardiness,
    bloom_season: plant.bloom_season,
    fynbos_region: plant.fynbos_region,
    description: plant.description,
    image_url: plant.image_url,
    reference_urls: plant.reference_urls ?? [],
    seasonal_tasks: plant.seasonal_tasks ?? [],
    roof_proven: plant.roof_proven,
  };
}

type Props = {
  plant: Plant | null;
  onClose: () => void;
};

export default function PlantForm({ plant, onClose }: Props) {
  const [form, setForm] = useState<PlantFormData>(plant ? plantToForm(plant) : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  function setField<K extends keyof PlantFormData>(key: K, value: PlantFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function addSeasonalTask() {
    setField('seasonal_tasks', [...form.seasonal_tasks, { month_start: 1, month_end: 12, task: '' }]);
  }

  function updateSeasonalTask(index: number, patch: Partial<SeasonalTask>) {
    setField('seasonal_tasks', form.seasonal_tasks.map((t, i) => i === index ? { ...t, ...patch } : t));
  }

  function removeSeasonalTask(index: number) {
    setField('seasonal_tasks', form.seasonal_tasks.filter((_, i) => i !== index));
  }

  function addReferenceUrl() {
    setField('reference_urls', [...form.reference_urls, '']);
  }

  function updateReferenceUrl(index: number, value: string) {
    setField('reference_urls', form.reference_urls.map((url, i) => i === index ? value : url));
  }

  function removeReferenceUrl(index: number) {
    setField('reference_urls', form.reference_urls.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!form.name || !form.latin_name) {
      setError('Name and latin name are required.');
      return;
    }
    setSaving(true);
    setError('');
    const cleanedUrls = form.reference_urls.filter(u => u.trim() !== '');
    const data = { ...form, reference_urls: cleanedUrls };
    const result = plant
      ? await updatePlant(plant.id, data)
      : await createPlant(data);
    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  }

  async function handleDelete() {
    if (!plant) return;
    setDeleting(true);
    const result = await deletePlant(plant.id);
    setDeleting(false);
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
          {plant ? 'Edit plant' : 'Add plant'}
        </h2>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none">×</button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

        {/* Core fields */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Common name *">
            <input className={input} value={form.name} onChange={e => setField('name', e.target.value)} />
          </Field>
          <Field label="Latin name *">
            <input className={input} value={form.latin_name} onChange={e => setField('latin_name', e.target.value)} />
          </Field>
        </div>

        <Field label="Slug (auto-generated if blank)">
          <input className={input} value={form.slug} onChange={e => setField('slug', e.target.value)} placeholder="e.g. felicia-amelloides" />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Water needs">
            <select className={input} value={form.water_needs} onChange={e => setField('water_needs', e.target.value)}>
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
          </Field>
          <Field label="Sun tolerance">
            <select className={input} value={form.sun_tolerance} onChange={e => setField('sun_tolerance', e.target.value)}>
              <option>Full sun</option>
              <option>Part shade</option>
              <option>Full shade</option>
            </select>
          </Field>
          <Field label="Wind hardiness">
            <select className={input} value={form.wind_hardiness} onChange={e => setField('wind_hardiness', e.target.value)}>
              <option>High</option>
              <option>Moderate</option>
              <option>Low</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Bloom season">
            <input className={input} value={form.bloom_season} onChange={e => setField('bloom_season', e.target.value)} placeholder="e.g. Spring–Summer" />
          </Field>
          <Field label="Fynbos region">
            <input className={input} value={form.fynbos_region} onChange={e => setField('fynbos_region', e.target.value)} placeholder="e.g. Western Cape" />
          </Field>
        </div>

        <Field label="Description">
          <textarea className={`${input} resize-none`} rows={4} value={form.description} onChange={e => setField('description', e.target.value)} />
        </Field>

        <Field label="Image URL">
          <input className={input} value={form.image_url} onChange={e => setField('image_url', e.target.value)} />
        </Field>

        <div className="flex items-center gap-2">
          <input
            id="roof_proven"
            type="checkbox"
            checked={form.roof_proven}
            onChange={e => setField('roof_proven', e.target.checked)}
            className="rounded border-stone-300 text-green-700 focus:ring-green-600"
          />
          <label htmlFor="roof_proven" className="text-sm text-stone-700">Roof proven</label>
        </div>

        {/* Seasonal tasks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone-700">Seasonal tasks</span>
            <button onClick={addSeasonalTask} className={addBtn}>+ Add task</button>
          </div>
          <div className="flex flex-col gap-3">
            {form.seasonal_tasks.map((task, i) => (
              <div key={i} className="flex gap-2 items-start bg-stone-50 rounded-lg p-3">
                <div className="flex flex-col gap-1 w-24 shrink-0">
                  <label className="text-xs text-stone-500">From</label>
                  <select className={inputSm} value={task.month_start} onChange={e => updateSeasonalTask(i, { month_start: Number(e.target.value) })}>
                    {MONTHS.map((m, idx) => <option key={idx} value={idx + 1}>{m}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1 w-24 shrink-0">
                  <label className="text-xs text-stone-500">To</label>
                  <select className={inputSm} value={task.month_end} onChange={e => updateSeasonalTask(i, { month_end: Number(e.target.value) })}>
                    {MONTHS.map((m, idx) => <option key={idx} value={idx + 1}>{m}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-stone-500">Task</label>
                  <input className={inputSm} value={task.task} onChange={e => updateSeasonalTask(i, { task: e.target.value })} placeholder="e.g. Prune hard to base" />
                </div>
                <button onClick={() => removeSeasonalTask(i)} className="mt-5 text-stone-400 hover:text-red-500 text-lg leading-none shrink-0">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Reference URLs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone-700">Reference URLs</span>
            <button onClick={addReferenceUrl} className={addBtn}>+ Add URL</button>
          </div>
          <div className="flex flex-col gap-2">
            {form.reference_urls.map((url, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input className={`${input} flex-1`} value={url} onChange={e => updateReferenceUrl(i, e.target.value)} placeholder="https://…" />
                <button onClick={() => removeReferenceUrl(i)} className="text-stone-400 hover:text-red-500 text-lg leading-none">×</button>
              </div>
            ))}
          </div>
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
            {saving ? 'Saving…' : 'Save'}
          </button>
          {plant && !confirmDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 text-sm text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
          {plant && confirmDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {deleting ? 'Deleting…' : 'Confirm delete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const input = 'border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white w-full';
const inputSm = 'border border-stone-300 rounded-md px-2 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white w-full';
const addBtn = 'text-xs text-green-700 hover:text-green-900 font-medium';
