import React from 'react';
import { MapPin, Globe, Clock, Mountain, Sparkles } from 'lucide-react';
import { GeoLocation, ForecastResponse } from '../types/weather';

interface ResolvedLocationProps {
  location: GeoLocation;
  forecast?: ForecastResponse | null;
}

export const ResolvedLocation: React.FC<ResolvedLocationProps> = ({ location, forecast }) => {
  const regionParts = [location.admin1, location.admin2, location.country].filter(Boolean);
  const locationSubtitle = regionParts.join(', ') || 'Global Municipality';

  // Format local time from forecast if available
  let localTimeString = 'N/A';
  if (forecast?.current?.time) {
    try {
      const date = new Date(forecast.current.time);
      localTimeString = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      localTimeString = forecast.current.time;
    }
  }

  return (
    <section
      id="resolved-location-section"
      className="w-full glass-panel rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden transition-all duration-300"
    >
      {/* Background ambient color wash */}
      <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-blue-500/10 via-indigo-500/5 to-transparent pointer-events-none rounded-3xl" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase bg-blue-500/15 text-blue-700 dark:text-blue-300 rounded-full border border-blue-400/30">
              <Sparkles className="w-3 h-3 text-blue-500" />
              Active Target
            </span>
            {location.country_code && (
              <span className="px-2 py-0.5 text-[11px] font-bold uppercase bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-300 dark:border-slate-700">
                {location.country_code}
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-400/20">
              <MapPin className="w-6 h-6 text-blue-500 flex-shrink-0" />
            </div>
            <span>{location.name}</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium pl-1">
            {locationSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
          <div className="p-3 glass-card rounded-2xl flex items-center gap-2.5 shadow-xs">
            <div className="p-1.5 bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-xl">
              <Globe className="w-4 h-4 flex-shrink-0" />
            </div>
            <div>
              <div className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">Coordinates</div>
              <div className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
              </div>
            </div>
          </div>

          <div className="p-3 glass-card rounded-2xl flex items-center gap-2.5 shadow-xs">
            <div className="p-1.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl">
              <Clock className="w-4 h-4 flex-shrink-0" />
            </div>
            <div>
              <div className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">Local Time / Zone</div>
              <div className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px] text-[11px]" title={location.timezone || forecast?.timezone || 'Auto'}>
                {localTimeString} ({forecast?.timezone_abbreviation || location.timezone?.split('/').pop() || 'UTC'})
              </div>
            </div>
          </div>

          <div className="p-3 glass-card rounded-2xl col-span-2 sm:col-span-1 flex items-center gap-2.5 shadow-xs">
            <div className="p-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Mountain className="w-4 h-4 flex-shrink-0" />
            </div>
            <div>
              <div className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">Terrain Elevation</div>
              <div className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                {location.elevation !== undefined
                  ? `${location.elevation} m`
                  : forecast?.elevation !== undefined
                  ? `${forecast.elevation} m`
                  : 'Sea Level'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
