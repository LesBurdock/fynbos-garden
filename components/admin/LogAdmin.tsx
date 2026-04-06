'use client';

import { useState } from 'react';
import { PlantPosition, Zone } from '@/lib/types';
import CareLogForm from '@/components/admin/CareLogForm';
import WateringLogForm from '@/components/admin/WateringLogForm';

type Tab = 'care' | 'watering';

type Props = {
  positions: PlantPosition[];
  zones: Zone[];
};

export default function LogAdmin({ positions, zones }: Props) {
  const [tab, setTab] = useState<Tab>('care');

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold text-stone-800 mb-8">Log entry</h1>

        {/* ── Desktop: side by side ── */}
        <div className="hidden md:grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="text-base font-semibold text-stone-700 mb-5">Care log</h2>
            <CareLogForm positions={positions} />
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="text-base font-semibold text-stone-700 mb-5">Watering log</h2>
            <WateringLogForm zones={zones} />
          </div>
        </div>

        {/* ── Mobile: tabs ── */}
        <div className="md:hidden">
          <div className="flex bg-stone-100 rounded-lg p-0.5 gap-0.5 mb-6">
            {(['care', 'watering'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                  tab === t
                    ? 'bg-white text-stone-800 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {t === 'care' ? 'Care log' : 'Watering log'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-6">
            {tab === 'care' ? (
              <>
                <h2 className="text-base font-semibold text-stone-700 mb-5">Care log</h2>
                <CareLogForm positions={positions} />
              </>
            ) : (
              <>
                <h2 className="text-base font-semibold text-stone-700 mb-5">Watering log</h2>
                <WateringLogForm zones={zones} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
