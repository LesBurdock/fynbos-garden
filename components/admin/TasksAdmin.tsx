'use client';

import { useState } from 'react';
import { GardenTask, Zone } from '@/lib/types';
import { createTask, completeTask } from '@/app/admin/tasks/actions';

type Props = {
  tasks: GardenTask[];
  zones: Zone[];
};

const TASK_TYPE_OPTIONS: { value: GardenTask['task_type']; label: string }[] = [
  { value: 'weeding', label: 'Weeding' },
  { value: 'mulching', label: 'Mulching' },
  { value: 'other', label: 'Other' },
];

const TASK_TYPE_COLOURS: Record<GardenTask['task_type'], string> = {
  weeding: 'bg-orange-100 text-orange-700',
  mulching: 'bg-yellow-100 text-yellow-700',
  other: 'bg-stone-100 text-stone-600',
};

const today = () => new Date().toISOString().split('T')[0];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isOverdue(dateStr: string) {
  return dateStr < today();
}

export default function TasksAdmin({ tasks, zones }: Props) {
  const [title, setTitle] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [dueDate, setDueDate] = useState(today());
  const [taskType, setTaskType] = useState<GardenTask['task_type']>('other');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const result = await createTask({
      title,
      zone_id: zoneId || null,
      due_date: dueDate,
      task_type: taskType,
    });

    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setTitle('');
      setZoneId('');
      setDueDate(today());
      setTaskType('other');
    }
  }

  async function handleComplete(id: string) {
    setCompleting(id);
    await completeTask(id);
    setCompleting(null);
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-xl font-semibold text-stone-800">Tasks</h1>

        {/* Task list */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {tasks.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-12">No pending tasks.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {tasks.map(task => {
                const zone = zones.find(z => z.id === task.zone_id);
                const overdue = isOverdue(task.due_date);
                return (
                  <li key={task.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TASK_TYPE_COLOURS[task.task_type]}`}>
                          {task.task_type}
                        </span>
                        {zone && (
                          <span className="text-xs text-stone-400">{zone.name}</span>
                        )}
                        <span className={`text-xs ${overdue ? 'text-red-500 font-medium' : 'text-stone-400'}`}>
                          {overdue ? 'Overdue · ' : ''}{formatDate(task.due_date)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleComplete(task.id)}
                      disabled={completing === task.id}
                      className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 transition-colors"
                    >
                      {completing === task.id ? 'Saving…' : 'Mark done'}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Add task form */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="text-base font-semibold text-stone-700 mb-5">Add task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                placeholder="e.g. Weed Zone A beds"
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Task type</label>
                <select
                  value={taskType}
                  onChange={e => setTaskType(e.target.value as GardenTask['task_type'])}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  {TASK_TYPE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Zone <span className="text-stone-400 font-normal">(optional)</span></label>
                <select
                  value={zoneId}
                  onChange={e => setZoneId(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">All zones</option>
                  {zones.map(zone => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Due date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  required
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Add task'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
