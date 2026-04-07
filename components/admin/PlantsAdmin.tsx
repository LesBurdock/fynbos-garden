'use client';

import { useState } from 'react';
import { Plant } from '@/lib/types';
import PlantForm from './PlantForm';

type Props = {
  plants: Plant[];
};

type HoverImage = { src: string; top: number; left: number } | null;

export default function PlantsAdmin({ plants }: Props) {
  const [selected, setSelected] = useState<Plant | null | 'new'>(null);
  const [hoverImage, setHoverImage] = useState<HoverImage>(null);

  const panelOpen = selected !== null;

  function handleThumbnailEnter(e: React.MouseEvent<HTMLImageElement>, src: string) {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverImage({ src, top: rect.top, left: rect.right + 12 });
  }

  function handleThumbnailLeave() {
    setHoverImage(null);
  }

  return (
    <div className="flex h-full">
      {/* Table */}
      <div className={`flex flex-col flex-1 min-w-0 transition-all ${panelOpen ? 'mr-[420px]' : ''}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h1 className="text-lg font-semibold text-stone-800">Plant library</h1>
          <button
            onClick={() => setSelected('new')}
            className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add plant
          </button>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50">
                <th className="px-3 py-3 w-12"></th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Latin name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Water</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Sun</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Wind</th>
                <th className="px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Roof proven</th>
              </tr>
            </thead>
            <tbody>
              {plants.map(plant => (
                <tr
                  key={plant.id}
                  onClick={() => setSelected(plant)}
                  className={`border-b border-stone-100 cursor-pointer hover:bg-stone-50 transition-colors ${
                    selected !== 'new' && (selected as Plant)?.id === plant.id ? 'bg-green-50' : ''
                  }`}
                >
                  <td className="px-3 py-2">
                    {plant.image_url ? (
                      <img
                        src={plant.image_url}
                        alt={plant.name}
                        className="w-9 h-9 rounded-md object-cover bg-stone-100"
                        onMouseEnter={e => handleThumbnailEnter(e, plant.image_url)}
                        onMouseLeave={handleThumbnailLeave}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-md bg-stone-100" />
                    )}
                  </td>
                  <td className="px-6 py-3 font-medium text-stone-800">{plant.name}</td>
                  <td className="px-6 py-3 text-stone-500 italic">{plant.latin_name}</td>
                  <td className="px-6 py-3">
                    <WaterBadge value={plant.water_needs} />
                  </td>
                  <td className="px-6 py-3 text-stone-600">{plant.sun_tolerance}</td>
                  <td className="px-6 py-3">
                    <WindBadge value={plant.wind_hardiness} />
                  </td>
                  <td className="px-6 py-3 text-center">
                    {plant.roof_proven ? (
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500" title="Roof proven" />
                    ) : (
                      <span className="inline-block w-2 h-2 rounded-full bg-stone-300" title="Not yet proven" />
                    )}
                  </td>
                </tr>
              ))}
              {plants.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-stone-400">No plants yet — add one above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hover image popup — fixed so it escapes overflow-auto */}
      {hoverImage && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ top: hoverImage.top, left: hoverImage.left }}
        >
          <img
            src={hoverImage.src}
            alt=""
            className="w-48 h-48 rounded-xl object-cover shadow-2xl border border-stone-200"
          />
        </div>
      )}

      {/* Side panel */}
      {panelOpen && (
        <div className="fixed top-0 right-0 w-[420px] h-full bg-white border-l border-stone-200 shadow-xl z-10 overflow-hidden flex flex-col">
          <PlantForm
            plant={selected === 'new' ? null : selected}
            onClose={() => setSelected(null)}
          />
        </div>
      )}
    </div>
  );
}

function WaterBadge({ value }: { value: string }) {
  const colours: Record<string, string> = {
    Low: 'bg-amber-100 text-amber-700',
    Moderate: 'bg-blue-100 text-blue-700',
    High: 'bg-cyan-100 text-cyan-700',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colours[value] ?? 'bg-stone-100 text-stone-600'}`}>
      {value}
    </span>
  );
}

function WindBadge({ value }: { value: string }) {
  const colours: Record<string, string> = {
    High: 'bg-green-100 text-green-700',
    Moderate: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colours[value] ?? 'bg-stone-100 text-stone-600'}`}>
      {value}
    </span>
  );
}
