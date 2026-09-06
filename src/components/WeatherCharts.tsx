import React, { useState } from 'react';
import {
  TrendingUp,
  CloudRain,
  Sun,
  Sunrise,
  Sunset,
  Clock,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { DailyWeatherData, TemperatureUnit, PrecipitationUnit } from '../types/weather';
import { formatDayLabel } from '../utils/weatherCodes';

interface WeatherChartsProps {
  daily: DailyWeatherData;
  temperatureUnit: TemperatureUnit;
  precipitationUnit: PrecipitationUnit;
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({
  daily,
  temperatureUnit,
  precipitationUnit,
}) => {
  const [hoveredTempIndex, setHoveredTempIndex] = useState<number | null>(null);
  const [hoveredPrecipIndex, setHoveredPrecipIndex] = useState<number | null>(null);
  const [hoveredUvIndex, setHoveredUvIndex] = useState<number | null>(null);

  const dates = (daily.time || []).slice(0, 7);
  const maxTemps = (daily.temperature_2m_max || []).slice(0, 7);
  const minTemps = (daily.temperature_2m_min || []).slice(0, 7);
  const precipProbs = (daily.precipitation_probability_max || []).slice(0, 7);
  const precipSums = (daily.precipitation_sum || []).slice(0, 7);
  const uvIndexes = (daily.uv_index_max || []).slice(0, 7);
  const sunrises = (daily.sunrise || []).slice(0, 7);
  const sunsets = (daily.sunset || []).slice(0, 7);

  const tempSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';
  const precipSymbol = precipitationUnit === 'mm' ? 'mm' : 'in';

  if (dates.length === 0) {
    return null;
  }

  // --- Temperature Chart Scales ---
  const allTemps = [...maxTemps, ...minTemps].filter((t) => t !== undefined);
  const rawMin = Math.min(...allTemps, 0);
  const rawMax = Math.max(...allTemps, 30);
  const tempPadding = Math.max((rawMax - rawMin) * 0.18, 3);
  const yMin = Math.floor(rawMin - tempPadding);
  const yMax = Math.ceil(rawMax + tempPadding);
  const yRange = yMax - yMin || 1;

  // Chart SVG standard dimensions
  const svgWidth = 600;
  const svgHeight = 230;
  const padding = { top: 32, right: 35, bottom: 42, left: 45 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const getX = (index: number) => {
    if (dates.length <= 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (dates.length - 1)) * chartWidth;
  };

  const getYTemp = (temp: number) => {
    const clamped = Math.max(yMin, Math.min(yMax, temp));
    const normalized = (clamped - yMin) / yRange;
    return padding.top + chartHeight - normalized * chartHeight;
  };

  // Generate smooth cubic bezier SVG curve paths
  const createSmoothCurve = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const maxPointsArr = maxTemps.map((temp, i) => ({ x: getX(i), y: getYTemp(temp) }));
  const minPointsArr = minTemps.map((temp, i) => ({ x: getX(i), y: getYTemp(temp) }));

  const maxSmoothPath = createSmoothCurve(maxPointsArr);
  const minSmoothPath = createSmoothCurve(minPointsArr);

  const reversedMinPoints = [...minPointsArr].reverse();
  const areaSmoothPath = `${maxSmoothPath} L ${reversedMinPoints[0].x} ${reversedMinPoints[0].y} ${createSmoothCurve(reversedMinPoints).replace('M', 'L')} Z`;

  // --- Precipitation Chart Scales ---
  const getYPrecipProb = (prob: number) => {
    const normalized = Math.min(100, Math.max(0, prob)) / 100;
    return padding.top + chartHeight - normalized * chartHeight;
  };

  // --- UV Index Scale (0 - 12) ---
  const maxUvVal = Math.max(...uvIndexes, 10);
  const uvMaxScale = Math.max(12, Math.ceil(maxUvVal + 1));
  const getYUv = (uv: number) => {
    const normalized = Math.min(uvMaxScale, Math.max(0, uv)) / uvMaxScale;
    return padding.top + chartHeight - normalized * chartHeight;
  };

  const getUvColor = (uv: number) => {
    if (uv <= 2) return { text: 'text-emerald-500 dark:text-emerald-400', fill: '#10b981', label: 'Low' };
    if (uv <= 5) return { text: 'text-amber-500 dark:text-amber-400', fill: '#f59e0b', label: 'Moderate' };
    if (uv <= 7) return { text: 'text-orange-500 dark:text-orange-400', fill: '#ea580c', label: 'High' };
    if (uv <= 10) return { text: 'text-rose-500 dark:text-rose-400', fill: '#e11d48', label: 'Very High' };
    return { text: 'text-purple-500 dark:text-purple-400', fill: '#a855f7', label: 'Extreme' };
  };

  const uvPointsArr = uvIndexes.map((uv, i) => ({ x: getX(i), y: getYUv(uv) }));
  const uvSmoothPath = createSmoothCurve(uvPointsArr);

  // Helper to calculate daylight duration in hours & minutes
  const calculateDayLength = (sunriseStr?: string, sunsetStr?: string) => {
    if (!sunriseStr || !sunsetStr) return 'N/A';
    try {
      const rise = new Date(sunriseStr);
      const set = new Date(sunsetStr);
      const diffMs = set.getTime() - rise.getTime();
      if (diffMs > 0) {
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
      }
    } catch {
      // fallback
    }
    return 'N/A';
  };

  const formatClockTime = (isoString?: string) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString.split('T')[1] || isoString;
    }
  };

  return (
    <section
      id="weather-trends-section"
      className="w-full glass-panel rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl relative overflow-hidden"
    >
      {/* Background ambient lighting aura */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/80 gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Atmospheric Trends & Analytics
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            7-day high-resolution projections for temperature curves, precipitation likelihood, UV radiation, and solar ephemeris
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/20 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Temperature
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold border border-blue-500/20 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Precipitation
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold border border-purple-500/20 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            UV Index
          </span>
        </div>
      </div>

      {/* Row 1: Temperature Trend & Precipitation Outlook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* CHART 1: 7-Day Temperature Trend */}
        <div className="p-5 glass-card rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                7-Day Temperature Range ({tempSymbol})
              </h4>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
              Min: {yMin}° / Max: {yMax}°
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[340px]"
              aria-label="7-Day Temperature Trend Chart"
            >
              <defs>
                {/* Gradient for area fill */}
                <linearGradient id="tempAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                </linearGradient>

                <linearGradient id="maxLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>

                <linearGradient id="minLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = padding.top + chartHeight * (1 - ratio);
                const val = Math.round(yMin + ratio * yRange);
                return (
                  <g key={ratio}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke="currentColor"
                      strokeDasharray="4 4"
                      className="text-slate-200/80 dark:text-slate-700/60"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      className="fill-slate-400 font-mono font-medium"
                    >
                      {val}°
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area between Max & Min Curves */}
              <path d={areaSmoothPath} fill="url(#tempAreaGrad)" />

              {/* Max Temp Smooth Curve */}
              <path
                d={maxSmoothPath}
                fill="none"
                stroke="url(#maxLineGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Min Temp Smooth Curve */}
              <path
                d={minSmoothPath}
                fill="none"
                stroke="url(#minLineGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Points and Labels */}
              {dates.map((dateStr, i) => {
                const { dayName } = formatDayLabel(dateStr, i === 0);
                const x = getX(i);
                const yMaxPos = getYTemp(maxTemps[i]);
                const yMinPos = getYTemp(minTemps[i]);
                const isHovered = hoveredTempIndex === i;

                return (
                  <g
                    key={dateStr}
                    onMouseEnter={() => setHoveredTempIndex(i)}
                    onMouseLeave={() => setHoveredTempIndex(null)}
                    className="cursor-pointer transition-all"
                  >
                    {isHovered && (
                      <line
                        x1={x}
                        y1={padding.top}
                        x2={x}
                        y2={padding.top + chartHeight}
                        stroke="#60a5fa"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Max Point */}
                    <circle
                      cx={x}
                      cy={yMaxPos}
                      r={isHovered ? 7 : 4.5}
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-transform duration-150"
                    />
                    <text
                      x={x}
                      y={yMaxPos - 9}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      className="fill-amber-600 dark:fill-amber-400"
                    >
                      {Math.round(maxTemps[i])}°
                    </text>

                    {/* Min Point */}
                    <circle
                      cx={x}
                      cy={yMinPos}
                      r={isHovered ? 7 : 4.5}
                      fill="#3b82f6"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-transform duration-150"
                    />
                    <text
                      x={x}
                      y={yMinPos + 18}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      className="fill-blue-600 dark:fill-blue-400"
                    >
                      {Math.round(minTemps[i])}°
                    </text>

                    {/* X-axis Day Label */}
                    <text
                      x={x}
                      y={padding.top + chartHeight + 24}
                      textAnchor="middle"
                      fontSize="11"
                      className={`font-semibold transition-colors ${
                        isHovered
                          ? 'fill-blue-600 dark:fill-blue-400'
                          : 'fill-slate-600 dark:fill-slate-400'
                      }`}
                    >
                      {dayName}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> High Temp
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Low Temp
            </span>
          </div>
        </div>

        {/* CHART 2: Precipitation Outlook */}
        <div className="p-5 glass-card rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 rounded-lg">
                <CloudRain className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Precipitation Probability & Amount
              </h4>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
              0% - 100% / {precipSymbol}
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[340px]"
              aria-label="Precipitation Probability Outlook Chart"
            >
              <defs>
                <linearGradient id="precipBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>

                <linearGradient id="precipBarHover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>

              {[0, 25, 50, 75, 100].map((val) => {
                const y = getYPrecipProb(val);
                return (
                  <g key={val}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke="currentColor"
                      strokeDasharray="4 4"
                      className="text-slate-200/80 dark:text-slate-700/60"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      className="fill-slate-400 font-mono font-medium"
                    >
                      {val}%
                    </text>
                  </g>
                );
              })}

              {dates.map((dateStr, i) => {
                const { dayName } = formatDayLabel(dateStr, i === 0);
                const x = getX(i);
                const prob = precipProbs[i] ?? 0;
                const sum = precipSums[i] ?? 0;
                const barY = getYPrecipProb(prob);
                const barHeight = Math.max(0, padding.top + chartHeight - barY);
                const barWidth = 26;
                const isHovered = hoveredPrecipIndex === i;

                return (
                  <g
                    key={dateStr}
                    onMouseEnter={() => setHoveredPrecipIndex(i)}
                    onMouseLeave={() => setHoveredPrecipIndex(null)}
                    className="cursor-pointer transition-all"
                  >
                    <rect
                      x={x - barWidth / 2}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      rx="6"
                      fill={
                        prob === 0
                          ? 'rgba(148, 163, 184, 0.2)'
                          : isHovered
                          ? 'url(#precipBarHover)'
                          : 'url(#precipBarGrad)'
                      }
                      className="transition-all duration-200"
                    />

                    <text
                      x={x}
                      y={Math.max(barY - 7, padding.top - 2)}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      className="fill-blue-600 dark:fill-blue-400 font-mono"
                    >
                      {prob}%
                    </text>

                    {sum > 0 && (
                      <text
                        x={x}
                        y={Math.max(barY + 14, padding.top + 16)}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#ffffff"
                        className="font-mono"
                      >
                        {sum}
                      </text>
                    )}

                    <text
                      x={x}
                      y={padding.top + chartHeight + 24}
                      textAnchor="middle"
                      fontSize="11"
                      className={`font-semibold transition-colors ${
                        isHovered
                          ? 'fill-cyan-600 dark:fill-cyan-400'
                          : 'fill-slate-600 dark:fill-slate-400'
                      }`}
                    >
                      {dayName}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Height: Probability %</span>
            <span>Numbers on bar: Volume ({precipSymbol})</span>
          </div>
        </div>
      </div>

      {/* Row 2: UV Index Trend Chart & Sunrise/Sunset Solar Ephemeris */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10 pt-2">
        {/* CHART 3: UV Index Trend Chart */}
        <div className="p-5 glass-card rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-lg">
                <Sun className="w-4 h-4 text-purple-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                7-Day Peak UV Index Curve
              </h4>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
              WHO Scale 0 - 11+
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[340px]"
              aria-label="7-Day Max UV Index Trend Chart"
            >
              <defs>
                <linearGradient id="uvGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>

                <linearGradient id="uvAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* UV Threshold guide lines */}
              {[0, 3, 6, 8, 11].map((val) => {
                const y = getYUv(val);
                return (
                  <g key={val}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke="currentColor"
                      strokeDasharray="4 4"
                      className="text-slate-200/80 dark:text-slate-700/60"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      className="fill-slate-400 font-mono font-medium"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* UV Area Fill below curve */}
              {(() => {
                if (uvPointsArr.length === 0) return null;
                const areaPath = `${uvSmoothPath} L ${uvPointsArr[uvPointsArr.length - 1].x} ${padding.top + chartHeight} L ${uvPointsArr[0].x} ${padding.top + chartHeight} Z`;
                return <path d={areaPath} fill="url(#uvAreaGrad)" />;
              })()}

              {/* UV Smooth Curve Line */}
              <path
                d={uvSmoothPath}
                fill="none"
                stroke="url(#uvGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* UV data points & labels */}
              {dates.map((dateStr, i) => {
                const { dayName } = formatDayLabel(dateStr, i === 0);
                const x = getX(i);
                const uvVal = uvIndexes[i] ?? 0;
                const yPos = getYUv(uvVal);
                const isHovered = hoveredUvIndex === i;
                const colorInfo = getUvColor(uvVal);

                return (
                  <g
                    key={dateStr}
                    onMouseEnter={() => setHoveredUvIndex(i)}
                    onMouseLeave={() => setHoveredUvIndex(null)}
                    className="cursor-pointer transition-all"
                  >
                    {isHovered && (
                      <line
                        x1={x}
                        y1={padding.top}
                        x2={x}
                        y2={padding.top + chartHeight}
                        stroke="#c084fc"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    )}

                    <circle
                      cx={x}
                      cy={yPos}
                      r={isHovered ? 7 : 4.5}
                      fill={colorInfo.fill}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />

                    <text
                      x={x}
                      y={yPos - 9}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill={colorInfo.fill}
                      className="font-mono"
                    >
                      {uvVal}
                    </text>

                    <text
                      x={x}
                      y={padding.top + chartHeight + 24}
                      textAnchor="middle"
                      fontSize="11"
                      className={`font-semibold transition-colors ${
                        isHovered
                          ? 'fill-purple-600 dark:fill-purple-400'
                          : 'fill-slate-600 dark:fill-slate-400'
                      }`}
                    >
                      {dayName}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 flex-wrap gap-1">
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
              UV Scale:
            </span>
            <span className="text-emerald-500 font-medium">0-2 Low</span>
            <span className="text-amber-500 font-medium">3-5 Mod</span>
            <span className="text-orange-500 font-medium">6-7 High</span>
            <span className="text-rose-500 font-medium">8-10 V.High</span>
            <span className="text-purple-500 font-medium">11+ Extreme</span>
          </div>
        </div>

        {/* CHART 4: Sunrise & Sunset Solar Timetable */}
        <div className="p-5 glass-card rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-500/15 text-orange-600 dark:text-orange-400 rounded-lg">
                <Sunrise className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Sunrise, Sunset & Solar Ephemeris
              </h4>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-500" />
              Local Dawn / Dusk
            </span>
          </div>

          {/* 7-Day Solar Table / Cards */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {dates.map((dateStr, index) => {
              const isToday = index === 0;
              const { dayName, shortDate } = formatDayLabel(dateStr, isToday);
              const sunrise = sunrises[index];
              const sunset = sunsets[index];
              const dayLength = calculateDayLength(sunrise, sunset);

              return (
                <div
                  key={dateStr}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                    isToday
                      ? 'bg-orange-500/10 border-orange-400/40 dark:border-orange-500/30 ring-1 ring-orange-500/20'
                      : 'bg-white/50 dark:bg-slate-800/50 border-white/60 dark:border-slate-700/50'
                  }`}
                >
                  <div className="min-w-[72px]">
                    <span className="font-bold text-slate-800 dark:text-slate-100">{dayName}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5 font-medium">{shortDate}</span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 font-mono">
                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-semibold" title="Sunrise">
                      <Sunrise className="w-3.5 h-3.5" />
                      <span>{formatClockTime(sunrise)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold" title="Sunset">
                      <Sunset className="w-3.5 h-3.5" />
                      <span>{formatClockTime(sunset)}</span>
                    </div>
                  </div>

                  <div className="px-2.5 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-medium text-[11px] flex items-center gap-1 flex-shrink-0" title="Total Daylight Duration">
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span className="font-mono">{dayLength}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Astronomical calculations synced to geographic longitude</span>
          </div>
        </div>
      </div>
    </section>
  );
};
