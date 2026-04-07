type Props = {
  healthy: number;
  struggling: number;
  dead: number;
  strugglingList: string[];
  deadList: string[];
};

export default function HealthSnapshot({ healthy, struggling, dead, strugglingList, deadList }: Props) {
  const total = healthy + struggling + dead;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col gap-4">
      <h2 className="font-heading text-lg font-bold text-stone-900">Plant health</h2>

      <div className="grid grid-cols-3 gap-3">
        <CountBadge value={healthy} label="Healthy" colour="bg-green-100 text-green-800" />
        <CountBadge value={struggling} label="Struggling" colour="bg-amber-100 text-amber-800" />
        <CountBadge value={dead} label="Dead" colour="bg-red-100 text-red-800" />
      </div>

      {total > 0 && (
        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden flex">
          {healthy > 0 && <div className="bg-green-400 h-full" style={{ width: `${(healthy / total) * 100}%` }} />}
          {struggling > 0 && <div className="bg-amber-400 h-full" style={{ width: `${(struggling / total) * 100}%` }} />}
          {dead > 0 && <div className="bg-red-400 h-full" style={{ width: `${(dead / total) * 100}%` }} />}
        </div>
      )}

      {(strugglingList.length > 0 || deadList.length > 0) && (
        <div className="space-y-2">
          {strugglingList.map(name => (
            <PlantRow key={name} name={name} status="struggling" />
          ))}
          {deadList.map(name => (
            <PlantRow key={name} name={name} status="dead" />
          ))}
        </div>
      )}
    </div>
  );
}

function CountBadge({ value, label, colour }: { value: number; label: string; colour: string }) {
  return (
    <div className={`rounded-xl px-3 py-3 text-center ${colour}`}>
      <p className="font-heading text-2xl font-bold">{value}</p>
      <p className="font-heading text-xs font-medium mt-0.5">{label}</p>
    </div>
  );
}

function PlantRow({ name, status }: { name: string; status: 'struggling' | 'dead' }) {
  const dot = status === 'dead' ? 'bg-red-400' : 'bg-amber-400';
  return (
    <div className="flex items-center gap-2">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <span className="text-sm text-stone-600 truncate">{name}</span>
    </div>
  );
}
