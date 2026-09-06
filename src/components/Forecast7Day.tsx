import React from 'react';
import { CloudRain, Wind, Calendar } from 'lucide-react';
import { DailyWeatherData, TemperatureUnit, PrecipitationUnit, WindSpeedUnit } from '../types/weather';
import { getWeatherInfo, formatDayLabel } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface Forecast7DayProps {
  daily: DailyWeatherData;
  temperatureUnit: TemperatureUnit;
  precipitationUnit: PrecipitationUnit;
  windSpeedUnit: WindSpeedUnit;
}

export const Forecast7Day: React.FC<Forecast7DayProps> = ({
  daily,
  temperatureUnit,
  precipitationUnit,
  windSpeedUnit,
}) => {
  const dates = daily.time || [];
  const forecastDays = dates.slice(0, 7);

  const tempSymbol = temperatureUnit === 'celsius' ? '°' : '°';
  const precipSymbol = precipitationUnit === 'mm' ? 'mm' : 'in';
  const windSymbol = windSpeedUnit === 'kmh' ? 'km/h' : 'mph';

  return (
    <section
      id="seven-day-forecast-section"
      className="w-full glass-panel rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden transition-all duration-300"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/80 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              7-Day Meteorological Outlook
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Chronological daily meteorological projections
          </p>
        </div>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 glass-card px-3 py-1 rounded-full shadow-xs">
          {forecastDays.length} Days Outlook
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {forecastDays.map((dateStr, index) => {
          const isToday = index === 0;
          const { dayName, shortDate } = formatDayLabel(dateStr, isToday);
          const weatherCode = daily.weather_code[index] ?? 0;
          const info = getWeatherInfo(weatherCode);

          const maxTemp = daily.temperature_2m_max[index];
          const minTemp = daily.temperature_2m_min[index];
          const precipProb = daily.precipitation_probability_max[index] ?? 0;
          const precipSum = daily.precipitation_sum[index] ?? 0;
          const maxWind = daily.wind_speed_10m_max[index];

          return (
            <div
              key={dateStr}
              id={`forecast-card-${index}`}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                isToday
                  ? 'bg-blue-500/15 dark:bg-blue-500/10 border-blue-400/50 dark:border-blue-500/30 ring-2 ring-blue-500/30 shadow-md'
                  : 'glass-card hover:border-blue-400/40'
              }`}
            >
              {/* Day & Date Header */}
              <div className="text-center pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                  <span>{dayName}</span>
                  {isToday && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-blue-600 text-white rounded-full">
                      Today
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{shortDate}</div>
              </div>

              {/* Weather Icon & Condition */}
              <div className="py-3 flex flex-col items-center justify-center text-center">
                <div className="p-3 rounded-2xl glass-card text-blue-600 dark:text-blue-400 mb-2 shadow-xs">
                  <WeatherIcon name={info.icon} className="w-8 h-8 drop-shadow-xs" />
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 min-h-[32px] flex items-center justify-center">
                  {info.description}
                </div>
              </div>

              {/* Temperature High / Low */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm font-mono">
                    {maxTemp !== undefined ? `${Math.round(maxTemp)}${tempSymbol}` : 'N/A'}
                  </span>
                  <span className="font-semibold text-slate-500 dark:text-slate-400 text-xs font-mono">
                    {minTemp !== undefined ? `${Math.round(minTemp)}${tempSymbol}` : 'N/A'}
                  </span>
                </div>

                {/* Precipitation Probability */}
                <div className="flex items-center justify-between text-[11px] glass-card px-2 py-1 rounded-xl shadow-2xs">
                  <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold font-mono">
                    <CloudRain className="w-3 h-3" />
                    <span>{precipProb}%</span>
                  </span>
                  {precipSum > 0 && (
                    <span className="text-[10px] text-slate-400 font-mono font-medium">
                      {precipSum}{precipSymbol}
                    </span>
                  )}
                </div>

                {/* Wind max */}
                {maxWind !== undefined && (
                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Wind className="w-2.5 h-2.5" />
                      <span>Wind</span>
                    </span>
                    <span>{Math.round(maxWind)} {windSymbol}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
