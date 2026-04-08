'use client';

import { useState } from 'react';
import { Zone, PlantPosition, Plant, CareLog } from '@/lib/types';
import RoofMap from '@/components/garden/RoofMap';
import PlantPanel from '@/components/garden/PlantPanel';
import ZonePanel from '@/components/garden/ZonePanel';
import MobilePlantList from '@/components/garden/MobilePlantList';

type Props = {
  zones: Zone[];
  positions: PlantPosition[];
  plants: Plant[];
  careLogs: CareLog[];
};

type PanelState =
  | { type: 'plant'; position: PlantPosition }
  | { type: 'zone'; zone: Zone }
  | null;

function latestCareLog(positionId: string, careLogs: CareLog[]): CareLog | null {
  return careLogs.find(l => l.position_id === positionId) ?? null;
}

export default function GardenMap({ zones, positions, plants, careLogs }: Props) {
  const [panel, setPanel] = useState<PanelState>(null);

  function handlePositionClick(position: PlantPosition) {
    setPanel({ type: 'plant', position });
  }

  function handleZoneClick(zone: Zone) {
    setPanel({ type: 'zone', zone });
  }

  function close() {
    setPanel(null);
  }

  const selectedPositionId = panel?.type === 'plant' ? panel.position.id : null;
  const selectedZoneId = panel?.type === 'zone' ? panel.zone.id : null;
  const panelOpen = panel !== null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-sand/20 bg-white flex items-center justify-between">
        <div>
          <h1 className="font-heading text-lg font-bold text-plum">Fynbos Rooftop Garden</h1>
          <p className="text-xs text-sand mt-0.5 font-body">Cape Town · click a plant or zone to explore</p>
        </div>
        <div className="hidden md:flex items-center gap-3 text-xs font-heading font-medium text-plum/60">
          <LegendDot color="bg-green-500" label="Healthy" />
          <LegendDot color="bg-amber-500" label="Struggling" />
          <LegendDot color="bg-red-500" label="Dead" />
        </div>
      </div>

      {/* Desktop map */}
      <div className="hidden md:flex flex-1 min-h-0">
        <div className={`flex-1 flex items-center justify-center p-6 min-w-0 transition-all duration-200 ${panelOpen ? 'mr-[400px]' : ''}`}>
          <div className="w-full max-w-3xl aspect-[630/474]">
            <RoofMap
              zones={zones}
              positions={positions}
              selectedPositionId={selectedPositionId}
              selectedZoneId={selectedZoneId}
              onPositionClick={handlePositionClick}
              onZoneClick={handleZoneClick}
            />
          </div>
        </div>

        {/* Side panel */}
        {panelOpen && (
          <div className="fixed top-0 right-0 w-[400px] h-full bg-white border-l border-sand/20 shadow-2xl z-10 flex flex-col">
            {panel.type === 'plant' && (
              <PlantPanel
                position={panel.position}
                lastCareLog={latestCareLog(panel.position.id, careLogs)}
                allPlants={plants}
                onClose={close}
              />
            )}
            {panel.type === 'zone' && (
              <ZonePanel
                zone={panel.zone}
                positions={positions}
                onClose={close}
              />
            )}
          </div>
        )}
      </div>

      {/* Mobile plant list */}
      <div className="md:hidden flex flex-col flex-1 min-h-0">
        <div className="shrink-0 px-4 py-3 bg-mist border-b border-sand/20 flex gap-3 text-xs font-heading font-medium text-plum/60">
          <LegendDot color="bg-green-500" label="Healthy" />
          <LegendDot color="bg-amber-500" label="Struggling" />
          <LegendDot color="bg-red-500" label="Dead" />
        </div>
        <MobilePlantList
          zones={zones}
          positions={positions}
          allPlants={plants}
          careLogs={careLogs}
        />
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}
