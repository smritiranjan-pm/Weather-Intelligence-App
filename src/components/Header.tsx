import React from 'react';
import { CloudSun, RefreshCw, Sun, Moon } from 'lucide-react';
import { TemperatureUnit } from '../types/weather';

interface HeaderProps {
  temperatureUnit: TemperatureUnit;
  onToggleUnit: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  temperatureUnit,
  onToggleUnit,
  onRefresh,
  isLoading = false,
  theme,
  onToggleTheme,
}) => {
  return (
    <header
      id="app-header"
      className="w-full glass-panel sticky top-0 z-30 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-500/15 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-400/30 dark:border-blue-400/20 shadow-inner flex items-center justify-center">
            <CloudSun className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Weather Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Search a city. Understand the week. Plan with confidence.
            </p>
          </div>
        </div>

        <div className="flex items-center self-end sm:self-auto space-x-2.5">
          {/* Theme Switcher Button */}
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme mode"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              id="refresh-weather-btn"
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh weather data"
              aria-label="Refresh current weather data"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all disabled:opacity-50 shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-500' : ''}`} />
            </button>
          )}

          {/* Unit Switcher */}
          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100/80 dark:bg-slate-800/80 p-0.5 shadow-sm">
            <button
              id="unit-celsius-btn"
              type="button"
              onClick={() => temperatureUnit !== 'celsius' && onToggleUnit()}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                temperatureUnit === 'celsius'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              id="unit-fahrenheit-btn"
              type="button"
              onClick={() => temperatureUnit !== 'fahrenheit' && onToggleUnit()}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                temperatureUnit === 'fahrenheit'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

