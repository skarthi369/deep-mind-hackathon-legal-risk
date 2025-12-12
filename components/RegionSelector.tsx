import React from 'react';
import { REGIONS } from '../constants';
import { RegionCode, RegionConfig } from '../types';

interface RegionSelectorProps {
  selectedRegion: RegionCode | null;
  onSelect: (code: RegionCode) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ selectedRegion, onSelect }) => {
  return (
    <div className="space-y-4 animate-fade-in-up">
      <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">1</span>
        Select Jurisdiction
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.values(REGIONS).map((region: RegionConfig) => (
          <button
            key={region.code}
            onClick={() => onSelect(region.code)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3
              hover:shadow-md hover:-translate-y-1
              ${selectedRegion === region.code 
                ? 'border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600' 
                : 'border-slate-200 bg-white hover:border-blue-300'}
            `}
          >
            <span className="text-4xl filter drop-shadow-sm">{region.flag}</span>
            <div className="text-center">
              <div className="font-bold text-slate-700">{region.name}</div>
              <div className="text-xs text-slate-500 mt-1">{region.laws.length} Laws Integrated</div>
            </div>
            {selectedRegion === region.code && (
              <div className="absolute top-2 right-2 text-blue-600">
                <i className="fas fa-check-circle"></i>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {selectedRegion && (
        <div className="mt-4 p-4 bg-slate-100 rounded-lg border border-slate-200 text-sm text-slate-600 flex items-start gap-3">
            <i className="fas fa-info-circle mt-1 text-blue-500"></i>
            <div>
                <strong>Active Frameworks for {REGIONS[selectedRegion].name}:</strong>
                <p className="mt-1">{REGIONS[selectedRegion].laws.join(', ')}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default RegionSelector;