// components/weather/utils.ts
export function formatTime(unixSeconds?: number) {
  if (!unixSeconds) return "-";
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
export function mapWeatherIcon(icon?: string) {
  if (!icon) return "https://openweathermap.org/img/wn/01d@2x.png";
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
