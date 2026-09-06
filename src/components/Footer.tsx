import React from 'react';
import { ExternalLink, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="app-footer" className="w-full glass-panel border-t border-slate-200/60 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 font-semibold"
          >
            <span>Open-Meteo Geocoding & Forecast APIs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span>•</span>
          <span className="flex items-center gap-1 font-semibold">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero API Keys / Cloudflare Pages Ready</span>
          </span>
        </div>

        <p className="max-w-2xl mx-auto text-[11px] leading-relaxed text-slate-400 dark:text-slate-500 font-medium">
          Powered by live Open-Meteo atmospheric datasets. High-speed cached telemetry with sub-second lookups and zero external runtime dependencies.
        </p>
      </div>
    </footer>
  );
};
