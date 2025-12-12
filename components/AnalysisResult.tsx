import React, { useState } from 'react';
import { AnalysisResult as AnalysisResultType, RiskLevel, RedFlag } from '../types';

// Helper component for individual red flag accordion
const RedFlagItem: React.FC<{ flag: RedFlag; getSeverityBadge: (level: string) => string }> = ({ flag, getSeverityBadge }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${isOpen ? 'ring-2 ring-blue-100 shadow-md' : 'hover:shadow-md'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors text-left group cursor-pointer select-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-50 text-blue-600 border-blue-200' : ''}`}>
                <i className="fas fa-chevron-down text-xs"></i>
            </div>
            <h4 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors pr-4">{flag.issue}</h4>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full border uppercase font-bold tracking-wide whitespace-nowrap ${getSeverityBadge(flag.severity)}`}>
          {flag.severity}
        </span>
      </button>
      
      {isOpen && (
        <div className="p-5 border-t border-slate-100 bg-white space-y-5">
          <div className="grid md:grid-cols-1 gap-4">
             <div className="text-sm">
                <span className="font-bold text-slate-400 uppercase text-[10px] tracking-widest block mb-1.5">Legal Basis</span>
                <p className="text-slate-800 font-semibold bg-slate-50 p-2.5 rounded-lg border border-slate-100 inline-block">
                    <i className="fas fa-gavel text-slate-400 mr-2"></i>
                    {flag.law_violated}
                </p>
             </div>
             <div className="text-sm">
                <span className="font-bold text-slate-400 uppercase text-[10px] tracking-widest block mb-1.5">Risk Analysis</span>
                <p className="text-slate-600 leading-relaxed">{flag.explanation}</p>
             </div>
          </div>
          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 relative overflow-hidden">
            <div className="flex gap-3">
                <div className="mt-0.5 text-indigo-500">
                    <i className="fas fa-magic"></i>
                </div>
                <div>
                    <span className="font-bold text-indigo-700 text-xs uppercase tracking-wide block mb-1">
                      Recommended Action
                    </span>
                    <p className="text-indigo-900 text-sm font-medium leading-relaxed italic">"{flag.suggested_fix}"</p>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface Props {
  result: AnalysisResultType;
  onReset: () => void;
}

const AnalysisResult: React.FC<Props> = ({ result, onReset }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskBg = (score: number) => {
    if (score < 30) return 'bg-green-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case RiskLevel.CRITICAL: return 'bg-red-100 text-red-800 border-red-200';
      case RiskLevel.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
      case RiskLevel.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      // In a real production environment, this would hit a backend endpoint
      // capable of generating a PDF from the analysis data.
      // Since this is a demo, we simulate the network request.
      
      const response = await fetch('/api/v1/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          risk_score: result.risk_score,
          summary: result.summary,
          red_flags: result.red_flags,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        // Fallback for demo environment where backend doesn't exist
        console.warn('Backend PDF generation endpoint not found. Falling back to print.');
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing delay
        window.print();
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Legal_Risk_Report_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Download failed:', error);
      // Fallback on error
      window.print(); 
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Score Header */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Analysis Complete</h2>
            <p className="text-slate-400 text-sm">Processed against {result.applicable_laws_identified?.length || 0} local statutes</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Risk Score</div>
              <div className={`text-4xl font-black ${getRiskColor(result.risk_score)}`}>{result.risk_score}/100</div>
            </div>
            <div className={`w-32 h-32 rounded-full border-8 border-slate-700 flex items-center justify-center relative`}>
              <div className={`text-xl font-bold ${getRiskColor(result.risk_score)}`}>{result.risk_rating}</div>
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
                <circle 
                  cx="50" cy="50" r="46" 
                  fill="transparent" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  className={getRiskColor(result.risk_score)}
                  strokeDasharray={`${result.risk_score * 2.89} 289`}
                />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="prose max-w-none mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Executive Summary</h3>
            <p className="text-slate-600 leading-relaxed">{result.summary}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <i className="fas fa-check-circle text-green-500"></i> Compliant Points
               </h3>
               <ul className="space-y-3">
                 {result.compliant_points.map((point, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-green-50 p-3 rounded-lg border border-green-100">
                     <i className="fas fa-check text-green-500 mt-1"></i>
                     {point}
                   </li>
                 ))}
               </ul>
            </div>
            
            <div>
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <i className="fas fa-exclamation-triangle text-red-500"></i> Critical Risks
               </h3>
               {result.red_flags.length === 0 ? (
                  <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center">No critical red flags found!</div>
               ) : (
                  <div className="space-y-3">
                    {result.red_flags.slice(0, 3).map((flag, i) => (
                      <div key={i} className="flex items-center justify-between text-sm text-slate-700 bg-red-50 p-3 rounded-lg border border-red-100">
                        <span>{flag.issue}</span>
                        <span className={`text-xs px-2 py-1 rounded font-bold ${getSeverityBadge(flag.severity)}`}>
                          {flag.severity}
                        </span>
                      </div>
                    ))}
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Red Flags with Accordions */}
      {result.red_flags.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            Detailed Findings 
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {result.red_flags.length}
            </span>
          </h3>
          <div className="space-y-4">
            {result.red_flags.map((flag, idx) => (
              <RedFlagItem 
                key={idx} 
                flag={flag} 
                getSeverityBadge={getSeverityBadge} 
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center pt-6 gap-4 print:hidden">
        <button 
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="px-8 py-3 bg-green-600 text-white rounded-full font-bold shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
        >
          {isDownloading ? (
            <><i className="fas fa-circle-notch fa-spin"></i> Generating PDF...</>
          ) : (
            <><i className="fas fa-file-pdf"></i> Download PDF Report</>
          )}
        </button>

        <button 
          onClick={onReset}
          className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold shadow-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <i className="fas fa-redo"></i> Analyze Another Contract
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;