import React from 'react';
import {
  Droplets,
  Wind,
  Compass,
  Gauge,
  CloudRain,
  Sun,
  Sunrise,
  Sunset,
  Activity,
} from 'lucide-react';
import { ForecastResponse, TemperatureUnit, WindSpeedUnit, PrecipitationUnit } from '../types/weather';
import { getWeatherInfo, formatWindDirection } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  forecast: ForecastResponse;
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  precipitationUnit: PrecipitationUnit;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  forecast,
  temperatureUnit,
  windSpeedUnit,
  precipitationUnit,
}) => {
  const current = forecast.current;
  const daily = forecast.daily;
  const weatherInfo = getWeatherInfo(current.weather_code);

  const tempSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';
  const windUnitText = windSpeedUnit === 'kmh' ? 'km/h' : 'mph';
  const precipUnitText = precipitationUnit === 'mm' ? 'mm' : 'in';

  const todayMax = daily.temperature_2m_max?.[0];
  const todayMin = daily.temperature_2m_min?.[0];
  const todayPrecipProb = daily.precipitation_probability_max?.[0];
  const todayUV = daily.uv_index_max?.[0];

  const sunriseTime = daily.sunrise?.[0] ? daily.sunrise[0].split('T')[1] : null;
  const sunsetTime = daily.sunset?.[0] ? daily.sunset[0].split('T')[1] : null;

  return (
    <section
      id="current-weather-section"
      className="w-full glass-panel rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden transition-all duration-300"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/80 mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Current Observations
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Live atmospheric telemetry and ground sensor observations
          </p>
        </div>
        <span className="px-3.5 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-full border border-blue-400/30 flex items-center gap-2 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Live Feed
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Main Temperature & Primary Condition Display */}
        <div className="lg:col-span-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="p-5 glass-card rounded-3xl border border-blue-400/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <WeatherIcon name={weatherInfo.icon} className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" />
          </div>

          <div className="text-center sm:text-left space-y-1.5">
            <div className="flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white">
                {Math.round(current.temperature_2m)}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400">
                {tempSymbol}
              </span>
            </div>

            <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
              {weatherInfo.description}
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 text-sm text-slate-600 dark:text-slate-400 pt-1">
              <span>Feels like <strong className="text-slate-800 dark:text-slate-200">{Math.round(current.apparent_temperature)}{tempSymbol}</strong></span>
              {todayMax !== undefined && todayMin !== undefined && (
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  H: {Math.round(todayMax)}° / L: {Math.round(todayMin)}°
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Humidity */}
          <div className="p-3.5 glass-card rounded-2xl flex items-center gap-3 shadow-xs hover:border-blue-400/40 transition-colors">
            <div className="p-2 bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-xl">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Humidity</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                {current.relative_humidity_2m}%
              </div>
            </div>
          </div>

          {/* Wind */}
          <div className="p-3.5 glass-card rounded-2xl flex items-center gap-3 shadow-xs hover:border-cyan-400/40 transition-colors">
            <div className="p-2 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 rounded-xl">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Wind Speed</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                {current.wind_speed_10m} {windUnitText}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                <Compass className="w-3 h-3" />
                {formatWindDirection(current.wind_direction_10m)} ({current.wind_direction_10m}°)
              </div>
            </div>
          </div>

          {/* Precipitation / Rain */}
          <div className="p-3.5 glass-card rounded-2xl flex items-center gap-3 shadow-xs hover:border-indigo-400/40 transition-colors">
            <div className="p-2 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Precipitation</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                {current.precipitation} {precipUnitText}
              </div>
              {todayPrecipProb !== undefined && (
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {todayPrecipProb}% chance
                </div>
              )}
            </div>
          </div>

          {/* Pressure */}
          <div className="p-3.5 glass-card rounded-2xl flex items-center gap-3 shadow-xs hover:border-purple-400/40 transition-colors">
            <div className="p-2 bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-xl">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Surface Pressure</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                {Math.round(current.surface_pressure)} hPa
              </div>
            </div>
          </div>

          {/* UV Index (from daily peak) */}
          <div className="p-3.5 glass-card rounded-2xl flex items-center gap-3 shadow-xs hover:border-amber-400/40 transition-colors">
            <div className="p-2 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Peak UV Index</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                {todayUV !== undefined ? todayUV : 'N/A'}
              </div>
            </div>
          </div>

          {/* Sun Cycle */}
          <div className="p-3.5 glass-card rounded-2xl flex items-center gap-3 shadow-xs hover:border-orange-400/40 transition-colors">
            <div className="p-2 bg-orange-500/15 text-orange-600 dark:text-orange-400 rounded-xl">
              <Sunrise className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Solar Dawn / Dusk</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                ↑ {sunriseTime || 'N/A'}
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                ↓ {sunsetTime || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
