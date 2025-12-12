import React from 'react';
import { INITIAL_SCRAPER_STATUS } from '../constants';

const SystemStatus: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white py-2 px-4 text-xs flex items-center justify-between overflow-x-auto whitespace-nowrap border-b border-slate-700">
      <div className="flex items-center space-x-4">
        <span className="font-bold text-emerald-400 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          LIVE LEGAL DB
        </span>
        {INITIAL_SCRAPER_STATUS.map((status, idx) => (
          <div key={idx} className="flex items-center space-x-1 opacity-75 hover:opacity-100 transition-opacity">
            <span className="text-slate-400">{status.region}:</span>
            <span className={status.status === 'active' ? 'text-green-400' : 'text-yellow-400'}>
              {status.status === 'active' ? '●' : '⟳'}
            </span>
            <span className="hidden sm:inline text-slate-500">({status.docsCount} docs)</span>
          </div>
        ))}
      </div>
      <div className="hidden md:block text-slate-500">
        System Operational • Latency: 45ms
      </div>
    </div>
  );
};

export default SystemStatus;