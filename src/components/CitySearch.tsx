import React, { useState, FormEvent } from 'react';
import { Search, Loader2, X, MapPin, Check, AlertCircle, Compass } from 'lucide-react';
import { GeoLocation } from '../types/weather';

interface CitySearchProps {
  onSearch: (city: string) => void;
  onSelectLocation: (location: GeoLocation) => void;
  candidateLocations: GeoLocation[];
  selectedLocation: GeoLocation | null;
  isLoading: boolean;
  validationError: string | null;
  onClearError: () => void;
}

const PRESET_CITIES = ['Vancouver', 'London', 'Tokyo', 'New York', 'Sydney', 'Paris'];

export const CitySearch: React.FC<CitySearchProps> = ({
  onSearch,
  onSelectLocation,
  candidateLocations,
  selectedLocation,
  isLoading,
  validationError,
  onClearError,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onClearError();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onClearError();
  };

  const handlePresetClick = (city: string) => {
    setSearchTerm(city);
    onClearError();
    onSearch(city);
  };

  return (
    <section
      id="city-search-section"
      className="w-full glass-panel rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden transition-all duration-300"
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-blue-500" />
            <label
              htmlFor="city-search-input"
              className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              Search Atmospheric Location
            </label>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Enter any global municipality or territory to retrieve live telemetry and 7-day meteorological forecasts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              id="city-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (validationError) onClearError();
              }}
              placeholder="e.g. Vancouver, London, Tokyo, Mumbai..."
              className="w-full pl-11 pr-10 py-3 text-sm sm:text-base glass-input text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-inner"
              disabled={isLoading}
              autoComplete="off"
            />
            {searchTerm && !isLoading && (
              <button
                type="button"
                id="clear-search-input-btn"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Clear search input"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            id="search-city-submit-btn"
            type="submit"
            disabled={isLoading}
            className="px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[130px] cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </form>

        {/* Validation or Error message */}
        {validationError && (
          <div
            id="search-validation-error"
            role="alert"
            className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-300 text-sm animate-fadeIn"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
            <div className="flex-1 font-semibold leading-relaxed">{validationError}</div>
          </div>
        )}

        {/* Quick Suggestion Presets */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span className="font-semibold text-slate-600 dark:text-slate-300 mr-1">Popular searches:</span>
          {PRESET_CITIES.map((city) => (
            <button
              key={city}
              id={`preset-city-${city.toLowerCase().replace(/\s+/g, '-')}`}
              type="button"
              onClick={() => handlePresetClick(city)}
              disabled={isLoading}
              className="px-3 py-1.5 glass-card hover:bg-blue-500/10 hover:border-blue-400/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all font-medium cursor-pointer shadow-2xs"
            >
              {city}
            </button>
          ))}
        </div>

        {/* Multiple Locations Disambiguation Selector (Option A) */}
        {candidateLocations.length > 1 && (
          <div id="location-disambiguation-selector" className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Matching locations ({candidateLocations.length} found):
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {candidateLocations.map((loc) => {
                const isSelected = selectedLocation?.id === loc.id;
                const region = [loc.admin1, loc.country].filter(Boolean).join(', ');
                return (
                  <button
                    key={loc.id}
                    id={`candidate-loc-${loc.id}`}
                    type="button"
                    onClick={() => onSelectLocation(loc)}
                    className={`p-3 text-left rounded-2xl border transition-all flex items-start justify-between gap-2.5 cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-blue-500/15 border-blue-500 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/40 shadow-sm'
                        : 'glass-card hover:border-blue-400/50 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 overflow-hidden">
                      <MapPin className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} />
                      <div className="truncate">
                        <div className="text-sm font-bold truncate">{loc.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{region || 'Unknown region'}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
