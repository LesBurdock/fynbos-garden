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


const DOT_COLORS: Record<string, string> = {
  healthy: '#16a34a',
  struggling: '#d97706',
  dead: '#dc2626',
};

// Botanical icon path from file.svg (viewBox 0 0 1024 1024)
const PLANT_ICON_PATH = "M462.813477,491.993744 C460.119049,476.078125 454.924805,461.303741 450.146729,446.414124 C444.334564,428.301880 439.205811,410.074280 439.666382,390.769836 C439.983429,377.481079 443.452332,364.800049 446.967377,352.139008 C451.818878,334.664185 456.935516,317.260437 460.124146,299.373993 C460.677856,296.267853 461.161530,293.148285 461.620148,290.026489 C461.908539,288.063293 461.751984,285.616272 464.197876,285.163757 C466.498169,284.738190 467.609314,286.951935 468.729034,288.537842 C475.526978,298.165924 480.401794,308.723419 483.235626,320.146454 C490.288879,348.577637 488.580078,376.905182 481.900330,405.139008 C477.917969,421.971741 472.443604,438.461456 469.966034,455.634247 C469.045929,462.011749 468.855347,468.494507 468.846008,475.030090 C470.526337,468.980652 472.179169,462.923370 473.891846,456.883087 C480.764282,432.645508 489.116821,408.875732 500.000763,386.202087 C506.617218,372.418671 506.659760,358.913757 502.868958,344.994904 C499.153137,331.351471 494.532104,317.955872 490.372162,304.431824 C483.642456,282.553436 483.599304,260.476685 489.103119,238.410538 C491.879608,227.278870 495.433350,216.340820 498.651367,205.319809 C499.077026,203.861938 499.597290,202.219894 501.374084,202.142822 C503.432983,202.053543 504.129150,203.712860 504.464447,205.438721 C508.761993,227.560959 517.319031,248.484619 522.837219,270.225586 C528.882874,294.045166 525.977356,317.802216 518.768860,341.096985 C518.345032,342.466553 517.346741,343.712189 517.779541,345.832825 C529.999084,318.897949 542.654602,292.688782 551.729309,264.946106 C552.957275,261.191956 551.443787,258.834290 549.389282,256.424591 C543.140747,249.095581 538.889587,240.778549 535.603821,231.718613 C532.512146,223.193985 533.351685,214.621811 535.680237,206.695618 C537.999084,198.802261 546.145386,195.811935 553.596863,193.864838 C562.759766,191.470551 572.138550,192.216904 581.286865,194.497864 C591.414368,197.022980 594.782104,202.558182 592.816833,212.672867 C592.662964,213.464844 592.524353,214.364212 592.741211,215.107925 C595.439819,224.362228 591.241516,231.780319 586.079041,238.668716 C579.925537,246.879379 571.964050,253.231750 563.411011,258.841003 C561.198059,260.292297 559.029602,261.627289 558.174500,264.547028 C548.830200,296.453613 535.016296,326.604248 521.716675,356.956085 C520.343445,360.090118 519.078857,363.271790 518.124268,366.719574 C530.372559,345.053802 549.131287,330.829742 570.664185,319.684204 C574.505859,317.695740 578.154724,315.333832 581.886169,313.133453 C598.109619,303.566742 613.914001,293.335632 629.655579,283.004700 C630.769470,282.273651 631.877380,281.519775 633.053406,280.900696 C634.349548,280.218414 635.757568,279.219513 637.124817,280.686462 C638.286377,281.932678 637.473877,283.217224 636.838684,284.362732 C626.975342,302.150543 616.688965,319.627106 603.524841,335.296692 C584.413452,358.045471 561.086182,374.550385 533.015259,384.326294 C532.387390,384.544952 531.774231,384.813446 531.171387,385.095490 C498.697174,400.288208 503.894623,397.241943 493.025177,426.232147 C482.605377,454.023163 475.466278,482.731171 470.543427,512.020081 C475.188934,500.296387 480.349365,488.827484 486.681213,477.925598 C498.062775,458.329315 514.523315,443.612122 532.667725,430.609222 C551.489624,417.120819 570.833679,404.332214 587.897827,388.539337 C589.399109,387.149933 591.121582,385.739349 593.199585,387.156219 C595.079956,388.438324 594.424255,390.501221 593.812500,392.194336 C582.934021,422.301422 569.418274,450.917694 547.789246,475.098206 C531.031921,493.832336 512.015198,509.906464 491.652100,524.537659 C482.579163,531.056763 474.129028,538.361145 467.501862,547.543091 C465.671204,550.079529 464.631714,552.803955 464.399170,555.834595 C461.922394,588.108521 461.933777,620.315857 466.008881,652.511658 C467.911072,667.540100 470.835205,682.360046 473.454803,697.248230 C473.617462,698.172913 473.982788,699.061829 474.511780,699.929260 C473.351044,691.581055 475.040649,683.288879 474.639069,674.981384 C472.913147,639.277100 483.560242,607.453796 504.315735,578.589050 C523.979553,551.242493 542.518005,523.164978 557.245483,492.746277 C558.382507,490.397919 559.416321,486.503571 562.891235,487.470062 C566.528381,488.481720 564.492554,492.215698 564.156677,494.462769 C560.055542,521.900696 558.625305,549.803955 550.759827,576.597229 C541.692749,607.483643 528.007141,636.281616 510.717957,663.423096 C499.410248,681.174561 489.485382,699.591980 483.798859,720.082947 C481.892426,726.952637 481.860352,733.458862 483.827545,740.192383 C492.650360,770.391968 501.126740,800.709778 515.311340,829.009216 C515.876648,830.137085 516.853333,831.304443 515.596924,832.919067 C511.852112,831.336853 510.029602,827.891479 508.118469,824.711792 C499.133911,809.763489 493.494995,793.357117 487.658936,777.047119 C475.007996,741.691589 466.495850,705.276794 459.957642,668.363281 C459.262451,664.438293 458.622925,660.482727 458.314392,656.513611 C457.009674,639.730896 445.839294,628.126831 436.561188,615.719177 C423.286133,597.966431 409.273773,580.778992 400.424225,560.158020 C393.586060,544.223938 389.965881,527.779541 389.431213,510.315125 C388.916840,493.514038 389.578461,476.665131 387.918152,459.889557 C387.659668,457.277618 386.283234,453.357361 389.468719,452.214478 C393.083710,450.917450 394.121552,455.176483 395.786835,457.426758 C400.642120,463.987640 404.979767,470.952362 410.090790,477.299408 C425.760803,496.758759 432.380157,519.863403 437.280365,543.657654 C441.337036,563.355713 442.754272,583.508728 447.246918,603.138855 C448.946838,610.566406 451.528473,617.719238 454.643433,626.265137 C454.675323,617.519775 454.216095,610.277832 454.151733,603.040039 C453.867126,571.032410 456.424072,539.233032 462.174774,507.711914 C463.093536,502.675995 464.553070,497.603210 462.813477,491.993744 z";

const ICON_SIZE = 30; // size in SVG map units
const ICON_SCALE = ICON_SIZE / 1024;

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
        {/* Arrowhead for wind indicator */}
        <marker id="wind-arrow" markerWidth="5" markerHeight="5" refX="2.5" refY="5" orient="auto">
          <polygon points="0,0 5,0 2.5,5" fill="#94a3b8" />
        </marker>
        {/* Clip paths for plant image circles */}
        {positions.map(pos => {
          const cx = pos.svg_xy.x + OFFSET;
          const cy = pos.svg_xy.y + OFFSET;
          const r = pos.id === selectedPositionId ? 16 : 13;
          return (
            <clipPath key={pos.id} id={`clip-${pos.id}`}>
              <circle cx={cx} cy={cy} r={r} />
            </clipPath>
          );
        })}
      </defs>

      {/* Roof background */}
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="#f5f5f4" />

      {/* Parapet outline */}
      <rect
        x={OFFSET - 10} y={OFFSET - 10}
        width={580 + 20} height={424 + 20}
        fill="none"
        stroke="#a8a29e"
        strokeWidth="2"
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
              fill="#ffffff"
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
              fill="#BF6836"
              className="select-none pointer-events-none"
            >
              {zone.sun_exposure} · {zone.wind_exposure} wind
            </text>
          </g>
        );
      })}

      {/* Stairs — dashed rectangle from top-left down to mid-left (Zone D) */}
      <rect
        x={OFFSET} y={OFFSET}
        width={50} height={212}
        fill="#e7e5e4"
        fillOpacity={0.5}
        stroke="#a8a29e"
        strokeWidth={1}
        strokeDasharray="4 3"
        rx={2}
      />
      <text x={OFFSET + 25} y={OFFSET + 102} textAnchor="middle" fontSize={9} fill="#78716c" className="select-none pointer-events-none"
        transform={`rotate(-90, ${OFFSET + 25}, ${OFFSET + 102})`}>
        Stairs
      </text>

      {/* Seating area — bottom-left corner, inside Zone A */}
      <rect
        x={OFFSET} y={OFFSET + 334}
        width={120} height={90}
        fill="#e7e5e4"
        fillOpacity={0.5}
        stroke="#a8a29e"
        strokeWidth={1}
        strokeDasharray="4 3"
        rx={2}
      />
      <text x={OFFSET + 60} y={OFFSET + 334 + 42} textAnchor="middle" fontSize={9} fill="#78716c" className="select-none pointer-events-none">Seating</text>
      <text x={OFFSET + 60} y={OFFSET + 334 + 54} textAnchor="middle" fontSize={9} fill="#78716c" className="select-none pointer-events-none">area</text>

      {/* Seating area — top-right corner */}
      <rect
        x={460 + OFFSET} y={OFFSET}
        width={120} height={90}
        fill="#e7e5e4"
        fillOpacity={0.5}
        stroke="#a8a29e"
        strokeWidth={1}
        strokeDasharray="4 3"
        rx={2}
      />
      <text x={520 + OFFSET} y={OFFSET + 42} textAnchor="middle" fontSize={9} fill="#78716c" className="select-none pointer-events-none">Seating</text>
      <text x={520 + OFFSET} y={OFFSET + 54} textAnchor="middle" fontSize={9} fill="#78716c" className="select-none pointer-events-none">area</text>

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
        const r = isSelected ? 16 : 13;
        const imageUrl = pos.plants?.image_url;
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
            {/* Invisible hit area */}
            <circle cx={cx} cy={cy} r={r + 6} fill="transparent" />
            {/* Health-status ring */}
            <circle cx={cx} cy={cy} r={r + 2.5} fill={color} />
            {/* White gap */}
            <circle cx={cx} cy={cy} r={r + 1} fill="white" />
            {/* Plant image or fallback dot */}
            {imageUrl ? (
              <image
                href={imageUrl}
                x={cx - r} y={cy - r}
                width={r * 2} height={r * 2}
                clipPath={`url(#clip-${pos.id})`}
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.35} />
            )}
            {/* Selected pulse ring */}
            {isSelected && (
              <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="3 2" />
            )}
          </g>
        );
      })}

      {/* Pending dot preview (add mode) */}
      {pendingDot && (
        <g
          opacity={0.5}
          transform={`translate(${pendingDot.x + OFFSET}, ${pendingDot.y + OFFSET}) scale(${ICON_SCALE}) translate(-512, -512)`}
        >
          <path d={PLANT_ICON_PATH} fill="#0F6E56" />
        </g>
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
      <image href="/wind_icon.png" x={x - 20} y={y - 20} width={40} height={40} />
      <text x={x - 15} y={y + 28} textAnchor="middle" fontSize={10} fill="#94a3b8">South Easterly wind</text>
    </g>
  );
}
