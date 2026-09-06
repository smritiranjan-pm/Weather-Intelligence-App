import { WeatherCodeInfo } from '../types/weather';

/**
 * WMO Weather interpretation codes (WW)
 * https://open-meteo.com/en/docs
 */
const WMO_CODES: Record<number, WeatherCodeInfo> = {
  0: { code: 0, description: 'Clear sky', icon: 'Sun', category: 'clear' },
  1: { code: 1, description: 'Mainly clear', icon: 'SunDim', category: 'clear' },
  2: { code: 2, description: 'Partly cloudy', icon: 'CloudSun', category: 'cloudy' },
  3: { code: 3, description: 'Overcast', icon: 'Cloud', category: 'cloudy' },
  45: { code: 45, description: 'Fog', icon: 'CloudFog', category: 'fog' },
  48: { code: 48, description: 'Depositing rime fog', icon: 'CloudFog', category: 'fog' },
  51: { code: 51, description: 'Light drizzle', icon: 'CloudDrizzle', category: 'drizzle' },
  53: { code: 53, description: 'Moderate drizzle', icon: 'CloudDrizzle', category: 'drizzle' },
  55: { code: 55, description: 'Dense drizzle', icon: 'CloudDrizzle', category: 'drizzle' },
  56: { code: 56, description: 'Light freezing drizzle', icon: 'CloudSnow', category: 'drizzle' },
  57: { code: 57, description: 'Dense freezing drizzle', icon: 'CloudSnow', category: 'drizzle' },
  61: { code: 61, description: 'Slight rain', icon: 'CloudRain', category: 'rain' },
  63: { code: 63, description: 'Moderate rain', icon: 'CloudRain', category: 'rain' },
  65: { code: 65, description: 'Heavy rain', icon: 'CloudRainWind', category: 'rain' },
  66: { code: 66, description: 'Light freezing rain', icon: 'CloudHail', category: 'rain' },
  67: { code: 67, description: 'Heavy freezing rain', icon: 'CloudHail', category: 'rain' },
  71: { code: 71, description: 'Slight snow fall', icon: 'CloudSnow', category: 'snow' },
  73: { code: 73, description: 'Moderate snow fall', icon: 'CloudSnow', category: 'snow' },
  75: { code: 75, description: 'Heavy snow fall', icon: 'CloudSnow', category: 'snow' },
  77: { code: 77, description: 'Snow grains', icon: 'Snowflake', category: 'snow' },
  80: { code: 80, description: 'Slight rain showers', icon: 'CloudSunRain', category: 'rain' },
  81: { code: 81, description: 'Moderate rain showers', icon: 'CloudRain', category: 'rain' },
  82: { code: 82, description: 'Violent rain showers', icon: 'CloudRainWind', category: 'rain' },
  85: { code: 85, description: 'Slight snow showers', icon: 'CloudSnow', category: 'snow' },
  86: { code: 86, description: 'Heavy snow showers', icon: 'CloudSnow', category: 'snow' },
  95: { code: 95, description: 'Thunderstorm', icon: 'CloudLightning', category: 'thunderstorm' },
  96: { code: 96, description: 'Thunderstorm with slight hail', icon: 'CloudLightning', category: 'thunderstorm' },
  99: { code: 99, description: 'Thunderstorm with heavy hail', icon: 'CloudLightning', category: 'thunderstorm' },
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  if (WMO_CODES[code]) {
    return WMO_CODES[code];
  }
  // Fallback for unexpected or custom codes
  return {
    code,
    description: `Weather Code ${code}`,
    icon: 'Cloud',
    category: 'cloudy',
  };
}

export function formatDayLabel(dateString: string, isToday = false): { dayName: string; shortDate: string; fullDate: string } {
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);

      const dayName = isToday
        ? 'Today'
        : date.toLocaleDateString('en-US', { weekday: 'short' });

      const shortDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const fullDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });

      return { dayName, shortDate, fullDate };
    }
  } catch {
    // Fallback if parsing fails
  }

  return { dayName: dateString, shortDate: dateString, fullDate: dateString };
}

export function formatWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index] || `${degrees}°`;
}
