'use client';

type BloomingPlant = {
  name: string;
  latinName: string;
  imageUrl: string | null;
};

type Props = {
  plants: BloomingPlant[];
  monthName: string;
};

export default function ThisMonthBloom({ plants, monthName }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="font-heading text-lg font-bold text-plum mb-4">{monthName}&apos;s bloom</h2>

      {plants.length === 0 ? (
        <p className="text-sm text-stone-400 italic">No plants blooming this month.</p>
      ) : (
        <div className="space-y-3">
          {plants.map(p => (
            <div key={p.name} className="flex items-center gap-3">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-100"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-stone-100 shrink-0" />
              )}
              <div>
                <p className="font-heading text-sm font-semibold text-plum">{p.name}</p>
                <p className="text-xs italic text-sand">{p.latinName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
