const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MONTH_ABBRS: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

function bloomMonths(season: string | null): Set<number> {
  if (!season) return new Set();
  const lower = season.toLowerCase();
  if (lower.includes('year') || lower.includes('all year')) {
    return new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  }
  const parts = season.split(/[–—\-]/);
  if (parts.length !== 2) return new Set();
  const start = MONTH_ABBRS[parts[0].trim()];
  const end = MONTH_ABBRS[parts[1].trim()];
  if (!start || !end) return new Set();
  const months = new Set<number>();
  if (start <= end) {
    for (let m = start; m <= end; m++) months.add(m);
  } else {
    for (let m = start; m <= 12; m++) months.add(m);
    for (let m = 1; m <= end; m++) months.add(m);
  }
  return months;
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
    <div className="bg-white rounded-2xl border border-stone-200 p-6">
      <h2 className="font-heading text-lg font-bold text-stone-900 mb-5">Bloom calendar</h2>

      {/* Month header strip */}
      <div className="flex items-center gap-1 mb-4 pl-40">
        {MONTH_LABELS.map((label, i) => {
          const month = i + 1;
          return (
            <div
              key={label}
              className={`flex-1 text-center font-heading text-xs font-semibold rounded-md py-1 ${
                month === currentMonth
                  ? 'bg-terra text-white'
                  : 'text-stone-400'
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
                    <span
                      className={`w-3 h-3 rounded-full ${
                        blooms
                          ? isCurrent
                            ? 'bg-terra'
                            : 'bg-gold'
                          : 'bg-stone-100'
                      }`}
                    />
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
  );
}
