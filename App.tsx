import React, { useState } from 'react';
import SystemStatus from './components/SystemStatus';
import RegionSelector from './components/RegionSelector';
import ContractInput from './components/ContractInput';
import AnalysisResult from './components/AnalysisResult';
import { REGIONS } from './constants';
import { RegionCode, AnalysisResult as AnalysisResultType } from './types';
import { analyzeContractWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResultType | null>(null);

  const handleRegionSelect = (code: RegionCode) => {
    setSelectedRegion(code);
    setResult(null); // Reset result if region changes
  };

  const handleAnalyze = async (text: string) => {
    if (!selectedRegion) return;
    
    setIsAnalyzing(true);
    try {
      const regionConfig = REGIONS[selectedRegion];
      const analysisData = await analyzeContractWithGemini(text, regionConfig);
      setResult(analysisData);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze contract. Please ensure your API key is configured correctly.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSelectedRegion(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      <SystemStatus />
      
      {/* Hero Header */}
      <header className="bg-gradient-to-br from-indigo-700 via-blue-700 to-sky-600 text-white pb-24 pt-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-block p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <i className="fas fa-balance-scale text-4xl text-sky-200"></i>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
            Legal Risk Radar
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            AI-powered contract intelligence for cross-border operations. 
            Instant compliance checks against local laws in <span className="font-bold text-white">India, Singapore, UAE,</span> and more.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto max-w-4xl px-4 -mt-16 relative z-20 pb-20">
        
        {!result ? (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <RegionSelector 
                selectedRegion={selectedRegion} 
                onSelect={handleRegionSelect} 
              />
            </div>

            {selectedRegion && (
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-t-4 border-blue-500">
                <ContractInput 
                  onContractReady={handleAnalyze} 
                  isLoading={isAnalyzing} 
                />
              </div>
            )}
            
            {/* Features Grid (Only show when no result) */}
            {!selectedRegion && (
              <div className="grid md:grid-cols-3 gap-6 pt-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-4 text-xl">
                    <i className="fas fa-globe-asia"></i>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Multi-Region Logic</h3>
                  <p className="text-sm text-slate-500">Adapts analysis based on specific acts like PDPA (SG) or Contract Act 1872 (IN).</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mx-auto mb-4 text-xl">
                    <i className="fas fa-robot"></i>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Gemini 2.5 Flash</h3>
                  <p className="text-sm text-slate-500">High-speed reasoning to identify subtle risks and unfair clauses in seconds.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mx-auto mb-4 text-xl">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Privacy First</h3>
                  <p className="text-sm text-slate-500">Contracts are processed securely via enterprise-grade API endpoints.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <AnalysisResult result={result} onReset={handleReset} />
        )}

      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">&copy; 2025 Legal Risk Radar. Powered by Google Gemini.</p>
          <div className="text-sm text-slate-600 max-w-2xl mx-auto">
            Disclaimer: This tool provides automated analysis for informational purposes only and does not constitute legal advice. 
            Always consult a qualified attorney for final contract review.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;