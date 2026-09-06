import { CurrentWeatherData, DailyWeatherData, Recommendation, TemperatureUnit } from '../types/weather';

export function generateRecommendations(
  current: CurrentWeatherData,
  daily: DailyWeatherData,
  tempUnit: TemperatureUnit = 'celsius'
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Convert current temp to celsius for threshold checks
  const currentTempC = tempUnit === 'celsius' 
    ? current.temperature_2m 
    : ((current.temperature_2m - 32) * 5) / 9;

  // Max temp today and next 2 days (in Celsius)
  const maxTemps = daily.temperature_2m_max || [];
  const minTemps = daily.temperature_2m_min || [];
  const precipProbabilities = daily.precipitation_probability_max || [];
  const precipSums = daily.precipitation_sum || [];
  const windSpeeds = daily.wind_speed_10m_max || [];
  const uvIndexes = daily.uv_index_max || [];

  const todayMaxTempC = maxTemps[0] !== undefined 
    ? (tempUnit === 'celsius' ? maxTemps[0] : ((maxTemps[0] - 32) * 5) / 9)
    : currentTempC;

  const todayMinTempC = minTemps[0] !== undefined 
    ? (tempUnit === 'celsius' ? minTemps[0] : ((minTemps[0] - 32) * 5) / 9)
    : currentTempC;

  const todayPrecipProb = precipProbabilities[0] ?? 0;
  const todayPrecipSum = precipSums[0] ?? 0;
  const currentRain = current.precipitation > 0 || current.rain > 0;
  const maxPrecipUpcoming = Math.max(...precipProbabilities.slice(0, 3), 0);

  const todayMaxWind = windSpeeds[0] ?? current.wind_speed_10m;
  const todayUV = uvIndexes[0] ?? 0;

  // 1. Rain / Precipitation Check
  if (currentRain || todayPrecipSum > 2 || todayPrecipProb >= 60) {
    recommendations.push({
      id: 'rain-alert',
      type: 'rain',
      severity: 'caution',
      title: 'Rain Expected',
      description: 'Rain is likely today. Consider carrying an umbrella and planning indoor alternatives.',
      iconName: 'Umbrella',
    });
  } else if (maxPrecipUpcoming >= 50) {
    recommendations.push({
      id: 'precip-prob',
      type: 'rain',
      severity: 'info',
      title: 'Elevated Rain Probability',
      description: 'Outdoor plans may be affected by rain over the coming days. Keep an eye on evolving radar.',
      iconName: 'CloudRain',
    });
  }

  // 2. Temperature Check (Warm / Cold)
  if (todayMaxTempC >= 28 || currentTempC >= 28) {
    recommendations.push({
      id: 'warm-conditions',
      type: 'temp-hot',
      severity: 'info',
      title: 'Warm Conditions',
      description: 'Warm conditions are expected. Hydration and sun protection may be useful when outdoors.',
      iconName: 'Sun',
    });
  } else if (todayMinTempC <= 5 || currentTempC <= 5) {
    recommendations.push({
      id: 'cold-conditions',
      type: 'temp-cold',
      severity: 'info',
      title: 'Cold Weather',
      description: 'Cold conditions are expected. Consider an extra layer or warm outerwear.',
      iconName: 'ThermometerSnowflake',
    });
  }

  // 3. Wind Check
  if (todayMaxWind >= 35 || current.wind_speed_10m >= 30) {
    recommendations.push({
      id: 'windy-alert',
      type: 'wind',
      severity: 'caution',
      title: 'Gusty Winds',
      description: 'Windy conditions are expected. Secure loose outdoor items and anticipate breezy conditions.',
      iconName: 'Wind',
    });
  }

  // 4. UV Protection Check
  if (todayUV >= 6 && recommendations.length < 4) {
    recommendations.push({
      id: 'uv-alert',
      type: 'uv',
      severity: 'info',
      title: 'High UV Index',
      description: `Peak UV index is around ${todayUV}. Apply sunscreen and wear sunglasses during peak daylight hours.`,
      iconName: 'ShieldAlert',
    });
  }

  // 5. Mild / Favorable conditions (if few/no adverse conditions)
  const isComfortable = 
    todayMaxTempC >= 16 && 
    todayMaxTempC <= 26 && 
    todayPrecipProb < 35 && 
    todayMaxWind < 25;

  if (isComfortable && recommendations.length < 3) {
    recommendations.push({
      id: 'mild-weather',
      type: 'mild',
      severity: 'ideal',
      title: 'Pleasant Outdoor Weather',
      description: 'Conditions look relatively comfortable for outdoor activities, walking, or recreational sports.',
      iconName: 'Smile',
    });
  }

  // Ensure 2-4 items returned
  if (recommendations.length < 2) {
    recommendations.push({
      id: 'general-comfort',
      type: 'mild',
      severity: 'ideal',
      title: 'Stable Atmospheric Outlook',
      description: 'Standard seasonal conditions prevailing. Routine daily planning is suitable.',
      iconName: 'Compass',
    });
  }

  return recommendations.slice(0, 4);
}
