import { Zone } from '@/lib/types';

type WateringAlert = { zone: Zone; daysSince: number | null };
type SeasonalAlert = { plantName: string; task: string };
type TaskAlert = { id: string; title: string; zoneName: string | null; due_date: string; task_type: string };

type Props = {
  wateringDue: WateringAlert[];
  seasonalAlerts: SeasonalAlert[];
  upcomingTasks: TaskAlert[];
};

export default function AttentionPanel({ wateringDue, seasonalAlerts, upcomingTasks }: Props) {
  const total = wateringDue.length + seasonalAlerts.length + upcomingTasks.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-heading text-lg font-bold text-plum">What needs attention</h2>
        {total === 0 && (
          <span className="font-heading text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">All good</span>
        )}
      </div>

      {total === 0 ? (
        <p className="text-sm text-stone-400">Nothing urgent right now.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {wateringDue.map(({ zone, daysSince }) => (
            <AlertRow
              key={zone.id}
              colour="blue"
              label="Watering due"
              message={`${zone.name} — ${daysSince === null ? 'never watered' : `last watered ${daysSince} day${daysSince === 1 ? '' : 's'} ago`}`}
            />
          ))}
          {seasonalAlerts.map((a, i) => (
            <AlertRow
              key={i}
              colour="amber"
              label="Seasonal"
              message={`${a.plantName} — ${a.task}`}
            />
          ))}
          {upcomingTasks.map(t => (
            <AlertRow
              key={t.id}
              colour="teal"
              label={t.task_type}
              message={`${t.title}${t.zoneName ? ` · ${t.zoneName}` : ''} — due ${formatDate(t.due_date)}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const COLOURS = {
  blue:  { dot: 'bg-blue-500',  badge: 'bg-blue-50 text-blue-700',  row: 'border-blue-100 bg-blue-50/40' },
  amber: { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700', row: 'border-amber-100 bg-amber-50/40' },
  teal:  { dot: 'bg-teal-500',  badge: 'bg-teal-50 text-teal-700',  row: 'border-teal-100 bg-teal-50/40' },
};

function AlertRow({ colour, label, message }: { colour: keyof typeof COLOURS; label: string; message: string }) {
  const c = COLOURS[colour];
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${c.row}`}>
      <span className={`mt-1 shrink-0 w-2 h-2 rounded-full ${c.dot}`} />
      <div className="min-w-0">
        <span className={`font-heading text-xs font-semibold px-2 py-0.5 rounded-full mr-2 ${c.badge}`}>{label}</span>
        <span className="text-sm text-stone-700">{message}</span>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}
