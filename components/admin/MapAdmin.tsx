'use client';

import { useState } from 'react';
import { Zone, PlantPosition, Plant } from '@/lib/types';
import RoofMap from '@/components/garden/RoofMap';
import PositionForm from '@/components/admin/PositionForm';

type Mode = 'view' | 'add';

type Props = {
  zones: Zone[];
  positions: PlantPosition[];
  plants: Plant[];
};

export default function MapAdmin({ zones, positions, plants }: Props) {
  const [mode, setMode] = useState<Mode>('view');
  const [selectedPosition, setSelectedPosition] = useState<PlantPosition | null>(null);
  const [pendingCoords, setPendingCoords] = useState<{ x: number; y: number } | null>(null);
  const panelOpen = selectedPosition !== null || pendingCoords !== null;

  function handleMapClick(x: number, y: number) {
    setSelectedPosition(null);
    setPendingCoords({ x, y });
  }

  function handlePositionClick(position: PlantPosition) {
    if (mode !== 'view') return;
    setPendingCoords(null);
    setSelectedPosition(position);
  }

  function handleClose() {
    setSelectedPosition(null);
    setPendingCoords(null);
  }

  function switchMode(next: Mode) {
    setMode(next);
    handleClose();
  }

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      {/* Toolbar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-stone-200 bg-white">
        <h1 className="text-base font-semibold text-stone-800 mr-2">Roof garden map</h1>
        <div className="flex bg-stone-100 rounded-lg p-0.5 gap-0.5">
          {(['view', 'add'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                mode === m
                  ? 'bg-white text-stone-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {m === 'add' ? '+ Add dot' : 'View'}
            </button>
          ))}
        </div>
        {mode === 'add' && (
          <span className="text-xs text-stone-400">Click anywhere on the map to place a plant</span>
        )}
      </div>

      {/* Map + panel */}
      <div className="flex flex-1 min-h-0">
        {/* Map area */}
        <div className={`flex-1 flex items-center justify-center p-6 min-w-0 transition-all ${panelOpen ? 'mr-[400px]' : ''}`}>
          <div className="w-full max-w-3xl aspect-[630/474]">
            <RoofMap
              zones={zones}
              positions={positions}
              mode={mode}
              selectedPositionId={selectedPosition?.id}
              pendingDot={pendingCoords}
              onPositionClick={handlePositionClick}
              onMapClick={handleMapClick}
            />
          </div>
        </div>

        {/* Side panel */}
        {panelOpen && (
          <div className="fixed top-0 right-0 w-[400px] h-full bg-white border-l border-stone-200 shadow-xl z-10 flex flex-col">
            <PositionForm
              position={selectedPosition}
              pendingCoords={pendingCoords}
              plants={plants}
              zones={zones}
              onClose={handleClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}
