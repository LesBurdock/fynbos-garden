import { WeatherData, windDirectionLabel, wateringHint } from '@/lib/weather';

type Props = {
  weather: WeatherData | null;
};

export default function WeatherWidget({ weather }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col gap-4">
      <h2 className="font-heading text-lg font-bold text-stone-900">Today&apos;s conditions</h2>

      {!weather ? (
        <p className="text-sm text-stone-400">Weather unavailable.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Temperature" value={`${weather.temperature}°C`} />
            <Stat label="Wind" value={`${weather.wind_speed} km/h ${windDirectionLabel(weather.wind_direction)}`} />
            <Stat label="Rainfall" value={`${weather.precipitation} mm`} />
            <Stat label="UV index" value={`${weather.uv_index} — ${uvLabel(weather.uv_index)}`} />
          </div>

          <div className="mt-1 rounded-xl bg-stone-50 border border-stone-200 px-4 py-3">
            <p className="text-sm text-stone-600 font-body">{wateringHint(weather)}</p>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-heading text-xs text-stone-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-stone-800">{value}</p>
    </div>
  );
}

function uvLabel(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very high';
  return 'Extreme';
}
