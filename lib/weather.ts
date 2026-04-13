const LAT = -34.4090;;
const LON = 19.2979;

export type WeatherData = {
  temperature: number;
  wind_speed: number;
  wind_direction: number;
  precipitation: number;
  uv_index: number;
};

export async function fetchWeather(): Promise<WeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation,uv_index&timezone=Africa%2FJohannesburg`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const json = await res.json();
    const c = json.current;
    return {
      temperature: c.temperature_2m,
      wind_speed: c.wind_speed_10m,
      wind_direction: c.wind_direction_10m,
      precipitation: c.precipitation,
      uv_index: c.uv_index,
    };
  } catch {
    return null;
  }
}

export function windDirectionLabel(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
}

export function wateringHint(w: WeatherData): string {
  if (w.precipitation > 0) return 'Rain today — skip watering';
  if (w.wind_speed > 30) return 'High winds — watering may be ineffective';
  if (w.uv_index >= 8) return 'High UV — water in the evening to avoid leaf burn';
  return 'Good watering conditions today';
}
