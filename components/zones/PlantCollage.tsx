'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PlantPosition, HealthStatus } from '@/lib/types';

const HEALTH_RING: Record<HealthStatus, string> = {
  healthy:    'ring-green-500',
  struggling: 'ring-amber-400',
  dead:       'ring-red-500',
};

// Spiral-ish offsets so circles fan out from center and overlap naturally
function getOffset(index: number, total: number): { x: number; y: number } {
  if (total === 1) return { x: 0, y: 0 };
  const cols = Math.ceil(Math.sqrt(total * 1.6));
  const col = index % cols;
  const row = Math.floor(index / cols);
  // Stagger odd rows
  const xNudge = row % 2 === 1 ? 44 : 0;
  return {
    x: col * 72 + xNudge,
    y: row * 64,
  };
}

type Props = {
  positions: PlantPosition[];
};

export default function PlantCollage({ positions }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const withImages = positions.filter(p => p.plants?.image_url);
  const noImages   = positions.filter(p => !p.plants?.image_url);

  if (withImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 border border-dashed border-sand/40 rounded-2xl">
        <p className="font-body text-sm italic text-plum/40">No plant images uploaded yet</p>
      </div>
    );
  }

  // Work out container size
  const total = withImages.length;
  const offsets = withImages.map((_, i) => getOffset(i, total));
  const maxX = Math.max(...offsets.map(o => o.x)) + 112;
  const maxY = Math.max(...offsets.map(o => o.y)) + 112;

  return (
    <div className="space-y-4">
      {/* Collage */}
      <div className="relative overflow-visible" style={{ height: maxY, width: maxX }}>
        {withImages.map((pos, i) => {
          const { x, y } = offsets[i];
          const name = pos.plants!.name;
          const isHovered = hovered === pos.id;
          return (
            <div
              key={pos.id}
              className="absolute"
              style={{ left: x, top: y, zIndex: isHovered ? 20 : i }}
              onMouseEnter={() => setHovered(pos.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={`relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-mist transition-transform duration-200 ${HEALTH_RING[pos.health_status]} ${isHovered ? 'scale-110' : ''}`}>
                <Image
                  src={pos.plants!.image_url}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-plum text-white font-heading text-xs px-3 py-1 rounded-full pointer-events-none z-30">
                  {name}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Plants without images listed as text */}
      {noImages.length > 0 && (
        <p className="font-heading text-xs text-plum/40 pt-2">
          + {noImages.map(p => p.plants?.name ?? 'Unknown').join(', ')}
        </p>
      )}
    </div>
  );
}
