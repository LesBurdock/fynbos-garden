const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Southern Hemisphere season → start month, end month
const SEASON_START: Record<string, number> = {
  spring: 9, summer: 12, autumn: 3, winter: 6,
};
const SEASON_END: Record<string, number> = {
  spring: 11, summer: 2, autumn: 5, winter: 8,
};
const MONTH_ABBRS: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

function monthRange(start: number, end: number): Set<number> {
  const months = new Set<number>();
  if (start <= end) {
    for (let m = start; m <= end; m++) months.add(m);
  } else {
    for (let m = start; m <= 12; m++) months.add(m);
    for (let m = 1; m <= end; m++) months.add(m);
  }
  return months;
}

function bloomMonths(season: string | null): Set<number> {
  if (!season) return new Set();
  const lower = season.toLowerCase();
  if (lower.includes('year') || lower.includes('all year')) {
    return new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  }

  const parts = season.split(/[–—\-]/).map(p => p.trim());

  // Single token — season or month
  if (parts.length === 1) {
    const s = SEASON_START[lower];
    const e = SEASON_END[lower];
    if (s && e) return monthRange(s, e);
    const m = MONTH_ABBRS[parts[0]];
    return m ? new Set([m]) : new Set();
  }

  const [rawStart, rawEnd] = parts;

  // Season names
  const ss = SEASON_START[rawStart.toLowerCase()];
  const se = SEASON_END[rawEnd.toLowerCase()];
  if (ss !== undefined && se !== undefined) return monthRange(ss, se);

  // Month abbreviations
  const ms = MONTH_ABBRS[rawStart];
  const me = MONTH_ABBRS[rawEnd];
  if (ms && me) return monthRange(ms, me);

  return new Set();
}

type BloomPlant = { name: string; bloomSeason: string };

type Props = {
  plants: BloomPlant[];
};

export default function BloomCalendar({ plants }: Props) {
  const currentMonth = new Date().getMonth() + 1;

  const withMonths = plants
    .map(p => ({ ...p, months: bloomMonths(p.bloomSeason) }))
    .filter(p => p.months.size > 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="font-heading text-lg font-bold text-plum mb-5">Bloom calendar</h2>

      {/* Mobile: simple list */}
      <div className="md:hidden">
        {withMonths.length === 0 ? (
          <p className="text-sm text-stone-400">No bloom data available.</p>
        ) : (
          <div className="space-y-2">
            {withMonths.map(plant => {
              const bloomingNow = plant.months.has(currentMonth);
              return (
                <div key={plant.name} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                  <span className="text-sm font-medium text-stone-700">{plant.name}</span>
                  <div className="flex items-center gap-2">
                    {bloomingNow && (
                      <span className="font-heading text-xs font-semibold px-2 py-0.5 rounded-full bg-terra text-white">Now</span>
                    )}
                    <span className="text-xs text-stone-400">{plant.bloomSeason}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop: full dot grid */}
      <div className="hidden md:block">
        <div className="flex items-center gap-1 mb-4 pl-40">
          {MONTH_LABELS.map((label, i) => {
            const month = i + 1;
            return (
              <div
                key={label}
                className={`flex-1 text-center font-heading text-xs font-semibold rounded-md py-1 ${
                  month === currentMonth ? 'bg-terra text-white' : 'text-stone-400'
                }`}
              >
                {label}
              </div>
            );
          })}
        </div>

        {withMonths.length === 0 ? (
          <p className="text-sm text-stone-400">No bloom data available.</p>
        ) : (
          <div className="space-y-2">
            {withMonths.map(plant => (
              <div key={plant.name} className="flex items-center gap-1">
                <span className="w-40 shrink-0 text-xs font-medium text-stone-700 truncate pr-2">{plant.name}</span>
                {MONTH_LABELS.map((_, i) => {
                  const month = i + 1;
                  const blooms = plant.months.has(month);
                  const isCurrent = month === currentMonth;
                  return (
                    <div key={month} className="flex-1 flex justify-center">
                      <span className={`w-3 h-3 rounded-full ${blooms ? isCurrent ? 'bg-terra' : 'bg-gold' : 'bg-stone-100'}`} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs text-stone-400 font-heading">
          <span className="inline-block w-2 h-2 rounded-full bg-terra mr-1 align-middle" />current month &nbsp;
          <span className="inline-block w-2 h-2 rounded-full bg-gold mr-1 align-middle" />blooming
        </p>
      </div>
    </div>
  );
}
