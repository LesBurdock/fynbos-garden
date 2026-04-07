'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type ChartEntry = { name: string; litres: number };
type ActivityEntry = { action: string; logged_at: string; plantName: string };

type Props = {
  chartData: ChartEntry[];
  recentActivity: ActivityEntry[];
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

export default function WateringChart({ chartData, recentActivity }: Props) {
  const hasData = chartData.some(d => d.litres > 0);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6">
      <h2 className="font-heading text-lg font-bold text-stone-900 mb-5">Watering log</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar chart */}
        <div>
          <p className="font-heading text-xs text-stone-400 uppercase tracking-wide mb-3">Litres — last 7 days</p>
          {!hasData ? (
            <p className="text-sm text-stone-400 italic">No watering logged in the last 7 days.</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#a8a29e' }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#57534e' }} tickLine={false} axisLine={false} width={60} />
                <Tooltip
                  formatter={(v) => [`${Number(v)} L`, 'Watered']}
                  contentStyle={{ fontSize: 12, border: '1px solid #e7e5e4', borderRadius: 8 }}
                />
                <Bar dataKey="litres" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="#BF6836" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Activity feed */}
        <div>
          <p className="font-heading text-xs text-stone-400 uppercase tracking-wide mb-3">Recent care activity</p>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-stone-400 italic">No care logged yet.</p>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-stone-100 last:border-0">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-stone-700">
                      <span className="font-medium">{entry.plantName}</span> — {entry.action}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">{formatDate(entry.logged_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
