'use client';

import { useRef } from 'react';
import { Zone, PlantPosition } from '@/lib/types';

// Coordinate system:
// - Zone svg_coordinates and position svg_xy use "inner" coords (origin at parapet inner edge)
// - Canvas = inner + OFFSET on each side
// - SVG viewBox: 0 0 630 474

const OFFSET = 25;
const VIEW_W = 630;
const VIEW_H = 474;

const ZONE_COLORS: Record<string, string> = {
  'Zone A': '#fef9c3',
  'Zone B': '#dcfce7',
  'Zone C': '#dbeafe',
  'Zone D': '#f0fdf4',
};

const DOT_COLORS: Record<string, string> = {
  healthy: '#16a34a',
  struggling: '#d97706',
  dead: '#dc2626',
};

type Props = {
  zones: Zone[];
  positions: PlantPosition[];
  mode?: 'view' | 'add';
  selectedPositionId?: string | null;
  selectedZoneId?: string | null;
  pendingDot?: { x: number; y: number } | null;
  onPositionClick?: (position: PlantPosition) => void;
  onZoneClick?: (zone: Zone) => void;
  onMapClick?: (innerX: number, innerY: number) => void;
};

export default function RoofMap({
  zones,
  positions,
  mode = 'view',
  selectedPositionId,
  selectedZoneId,
  pendingDot,
  onPositionClick,
  onZoneClick,
  onMapClick,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  function handleSvgClick(e: React.MouseEvent<SVGSVGElement>) {
    if (mode !== 'add' || !onMapClick) return;
    // Ignore clicks on dots
    if ((e.target as SVGElement).closest('.position-dot')) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = VIEW_W / rect.width;
    const scaleY = VIEW_H / rect.height;
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;
    const innerX = Math.round(canvasX - OFFSET);
    const innerY = Math.round(canvasY - OFFSET);
    onMapClick(innerX, innerY);
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={`w-full h-full ${mode === 'add' ? 'cursor-crosshair' : ''}`}
      onClick={handleSvgClick}
    >
      <defs>
        {/* Arrowhead for entry path */}
        <marker id="entry-arrow" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto">
          <polygon points="0,0 6,0 3,6" fill="#0F6E56" />
        </marker>
        {/* Arrowhead for wind indicator */}
        <marker id="wind-arrow" markerWidth="5" markerHeight="5" refX="2.5" refY="5" orient="auto">
          <polygon points="0,0 5,0 2.5,5" fill="#94a3b8" />
        </marker>
      </defs>

      {/* Roof background */}
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="#f5f5f4" />

      {/* Parapet outline */}
      <rect
        x={OFFSET - 10} y={OFFSET - 10}
        width={580 + 20} height={424 + 20}
        fill="none"
        stroke="#a8a29e"
        strokeWidth="10"
        rx={2}
      />

      {/* Zones */}
      {zones.map(zone => {
        const { x, y, width, height } = zone.svg_coordinates;
        const cx = x + OFFSET + width / 2;
        const cy = y + OFFSET + height / 2;
        const isSelectedZone = zone.id === selectedZoneId;
        return (
          <g
            key={zone.id}
            onClick={e => {
              if (mode === 'add') return;
              e.stopPropagation();
              onZoneClick?.(zone);
            }}
            style={onZoneClick && mode !== 'add' ? { cursor: 'pointer' } : undefined}
          >
            <rect
              x={x + OFFSET}
              y={y + OFFSET}
              width={width}
              height={height}
              fill={ZONE_COLORS[zone.name] ?? '#f0fdf4'}
              stroke={isSelectedZone ? '#40141F' : '#d6d3d1'}
              strokeWidth={isSelectedZone ? 2 : 1}
            />
            <text
              x={cx}
              y={cy - 6}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill="#78716c"
              className="select-none pointer-events-none"
            >
              {zone.name}
            </text>
            <text
              x={cx}
              y={cy + 8}
              textAnchor="middle"
              fontSize={9}
              fill="#a8a29e"
              className="select-none pointer-events-none"
            >
              {zone.sun_exposure} · {zone.wind_exposure} wind
            </text>
          </g>
        );
      })}

      {/* Entry path — dashed green line from hatch (NW Zone B) south along west wall */}
      <path
        d={`M ${50 + OFFSET} ${72 + OFFSET} L ${50 + OFFSET} ${260 + OFFSET}`}
        stroke="#0F6E56"
        strokeWidth={1.2}
        strokeDasharray="4 3"
        markerEnd="url(#entry-arrow)"
        fill="none"
      />
      {/* Hatch marker */}
      <rect
        x={30 + OFFSET} y={10 + OFFSET}
        width={30} height={20}
        fill="#e7e5e4"
        stroke="#a8a29e"
        strokeWidth={1}
        rx={2}
      />
      <text x={45 + OFFSET} y={24 + OFFSET} textAnchor="middle" fontSize={7} fill="#78716c" className="select-none pointer-events-none">
        stairs
      </text>

      {/* North arrow — top right of Zone C */}
      <NorthArrow cx={580 + OFFSET - 20} cy={25 + OFFSET + 20} />

      {/* Wind indicator — bottom-right outside parapet */}
      <WindIndicator x={570} y={415} />

      {/* Plant position dots */}
      {positions.map(pos => {
        const cx = pos.svg_xy.x + OFFSET;
        const cy = pos.svg_xy.y + OFFSET;
        const isSelected = pos.id === selectedPositionId;
        const color = DOT_COLORS[pos.health_status] ?? '#78716c';
        return (
          <g
            key={pos.id}
            className="position-dot"
            onClick={e => {
              e.stopPropagation();
              onPositionClick?.(pos);
            }}
            style={{ cursor: 'pointer' }}
            aria-label={pos.plants ? `${pos.plants.name} - ${pos.health_status}` : undefined}
          >
            {isSelected && (
              <circle cx={cx} cy={cy} r={12} fill="white" stroke={color} strokeWidth={2} />
            )}
            <circle
              cx={cx} cy={cy}
              r={isSelected ? 7 : 6}
              fill={color}
              stroke="white"
              strokeWidth={1.5}
            />
          </g>
        );
      })}

      {/* Pending dot preview (add mode) */}
      {pendingDot && (
        <circle
          cx={pendingDot.x + OFFSET}
          cy={pendingDot.y + OFFSET}
          r={6}
          fill="#0F6E56"
          stroke="white"
          strokeWidth={1.5}
          opacity={0.6}
          strokeDasharray="3 2"
        />
      )}
    </svg>
  );
}

function NorthArrow({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g className="select-none pointer-events-none">
      <line x1={cx} y1={cy + 10} x2={cx} y2={cy - 10} stroke="#78716c" strokeWidth={1.5} />
      <polygon points={`${cx},${cy - 12} ${cx - 4},${cy - 4} ${cx + 4},${cy - 4}`} fill="#78716c" />
      <text x={cx} y={cy + 22} textAnchor="middle" fontSize={9} fontWeight={600} fill="#78716c">N</text>
    </g>
  );
}

function WindIndicator({ x, y }: { x: number; y: number }) {
  return (
    <g className="select-none pointer-events-none">
      <text x={x} y={y} textAnchor="middle" fontSize={8} fill="#94a3b8">SE wind</text>
      {[0, 8, 16].map(offset => (
        <line
          key={offset}
          x1={x - 8 + offset} y1={y + 6}
          x2={x - 4 + offset} y2={y + 14}
          stroke="#94a3b8"
          strokeWidth={1}
          markerEnd="url(#wind-arrow)"
        />
      ))}
    </g>
  );
}
