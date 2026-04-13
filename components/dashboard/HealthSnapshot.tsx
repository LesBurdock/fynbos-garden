type Props = {
  healthy: number;
  struggling: number;
  dead: number;
  strugglingList: string[];
  deadList: string[];
};

export default function HealthSnapshot({ healthy, struggling, dead }: Props) {
  const total = healthy + struggling + dead;
  const proportion = total > 0 ? healthy / total : 0;

  const radius = 54;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - proportion);
  const size = (radius + strokeWidth) * 2 + 4;
  const centre = size / 2;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center justify-start gap-4">
      <h2 className="font-heading text-lg font-bold text-plum self-start">Plant health</h2>

      {/* Ring */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={centre} cy={centre} r={radius}
          fill="none"
          stroke="#e7e5e4"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        {total > 0 && (
          <circle
            cx={centre} cy={centre} r={radius}
            fill="none"
            stroke="#BF6836"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${centre} ${centre})`}
          />
        )}
        {/* Centre count */}
        <text
          x={centre} y={centre - 6}
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-heading"
          style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, fill: '#40141F' }}
        >
          {total}
        </text>
        <text
          x={centre} y={centre + 18}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fill: '#a8a29e' }}
        >
          plants
        </text>
      </svg>

      {/* Status breakdown */}
      <div className="text-center space-y-0.5">
        <p className="font-heading text-xs text-stone-500">
          <span className="text-green-700 font-semibold">{healthy}</span> healthy
          {' · '}
          <span className="text-amber-600 font-semibold">{struggling}</span> struggling
          {' · '}
          <span className="text-red-600 font-semibold">{dead}</span> dead
        </p>
      </div>
    </div>
  );
}
