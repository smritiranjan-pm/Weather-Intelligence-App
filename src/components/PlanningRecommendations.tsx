import React from 'react';
import { Compass, Info, CheckCircle2 } from 'lucide-react';
import { Recommendation } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface PlanningRecommendationsProps {
  recommendations: Recommendation[];
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  recommendations,
}) => {
  return (
    <section
      id="planning-recommendations-section"
      className="w-full glass-panel rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/80 mb-6 gap-2">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            <Compass className="w-5 h-5 text-blue-500" />
            <span>Deterministic Planning Intelligence</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Rules-based lifestyle and activity recommendations calculated directly from real-time meteorological conditions
          </p>
        </div>
        <span className="px-3 py-1 text-xs font-bold glass-card text-slate-700 dark:text-slate-300 rounded-full self-start sm:self-auto flex items-center gap-1.5 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Deterministic Rules Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {recommendations.map((rec) => {
          let badgeBorder = 'border-blue-500/20 bg-blue-500/10 text-blue-900 dark:text-blue-100';
          let iconBg = 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
          let tagBg = 'bg-blue-600 text-white';

          if (rec.severity === 'caution') {
            badgeBorder = 'border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100';
            iconBg = 'bg-amber-500/20 text-amber-600 dark:text-amber-400';
            tagBg = 'bg-amber-600 text-white';
          } else if (rec.severity === 'ideal') {
            badgeBorder = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100';
            iconBg = 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
            tagBg = 'bg-emerald-600 text-white';
          }

          return (
            <div
              key={rec.id}
              id={`recommendation-${rec.id}`}
              className={`p-4 rounded-2xl border backdrop-blur-md flex items-start gap-3.5 transition-all shadow-xs hover:shadow-md ${badgeBorder}`}
            >
              <div className={`p-2.5 rounded-2xl ${iconBg} flex-shrink-0 mt-0.5 shadow-2xs`}>
                <WeatherIcon name={rec.iconName} className="w-5 h-5" />
              </div>

              <div className="space-y-1 flex-1">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{rec.title}</span>
                  <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${tagBg}`}>
                    {rec.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {rec.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Disclaimer note */}
      <div className="mt-4 pt-3.5 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Info className="w-4 h-4 flex-shrink-0 text-slate-400" />
        <span>
          Planning guidance is deterministically derived from atmospheric weather patterns and is intended for general daily activity planning rather than professional safety advice.
        </span>
      </div>
    </section>
  );
};
