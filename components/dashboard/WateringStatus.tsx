import { Zone } from '@/lib/types';

export type ZoneWaterStatus = {
  zone: Zone;
  daysSince: number | null;
  lastWateredDate: string | null;
};

type Props = {
  zones: ZoneWaterStatus[];
};

type StatusKey = 'urgent' | 'due-soon' | 'all-good' | 'not-applicable';

function getStatus(daysSince: number | null): StatusKey {
  if (daysSince === null) return 'not-applicable';
  if (daysSince >= 7) return 'urgent';
  if (daysSince >= 5) return 'due-soon';
  return 'all-good';
}

const STATUS: Record<StatusKey, { bar: string; daysText: string; dot: string; label: string }> = {
  'urgent':          { bar: 'bg-plum',      daysText: 'text-plum',      dot: 'bg-plum',      label: 'urgent / overdue' },
  'due-soon':        { bar: 'bg-terra',     daysText: 'text-terra',     dot: 'bg-terra',     label: 'due soon' },
  'all-good':        { bar: 'bg-gold',      daysText: 'text-stone-700', dot: 'bg-gold',      label: 'all good' },
  'not-applicable':  { bar: 'bg-stone-200', daysText: 'text-stone-400', dot: 'bg-stone-300', label: 'not applicable' },
};

export default function WateringStatus({ zones }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="font-heading text-lg font-bold text-plum mb-5">Watering status by zone</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {zones.map(({ zone, daysSince, lastWateredDate }) => {
          const status = getStatus(daysSince);
          const s = STATUS[status];
          return (
            <div key={zone.id} className="border border-stone-100 rounded-xl p-4 space-y-3">
              <div>
                <p className="font-heading text-sm font-bold text-plum">{zone.name}</p>
                <p className="font-heading text-xs text-stone-400 mt-0.5 leading-snug">
                  {zone.sun_exposure} · {zone.wind_exposure}
                </p>
              </div>

              {/* Status bar */}
              <div className={`h-1 w-full rounded-full ${s.bar}`} />

              {/* Last watered */}
              <div>
                <p className="font-heading text-xs text-stone-400 mb-1">last watered</p>
                {daysSince === null ? (
                  <p className="font-heading text-xs text-stone-400">never</p>
                ) : (
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className={`font-heading text-sm font-semibold ${s.daysText}`}>
                      {daysSince}d ago
                    </span>
                    {lastWateredDate && (
                      <span className="font-heading text-xs text-stone-400">· {lastWateredDate}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 border-t border-stone-100">
        {(Object.entries(STATUS) as [StatusKey, (typeof STATUS)[StatusKey]][]).map(([key, s]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
            <span className="font-heading text-xs text-stone-500">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
