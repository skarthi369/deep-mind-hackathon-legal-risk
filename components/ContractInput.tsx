import React, { useState, useRef } from 'react';

interface ContractInputProps {
  onContractReady: (text: string) => void;
  isLoading: boolean;
}

const ContractInput: React.FC<ContractInputProps> = ({ onContractReady, isLoading }) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setFileName(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    
    // Simple text reader for demo. 
    // In production, this would use pdf.js or mammoth for .docx
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = () => {
    if (text.trim().length < 50) {
      alert("Please enter enough contract text to analyze.");
      return;
    }
    onContractReady(text);
  };

  return (
    <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">2</span>
        Upload Contract
      </h2>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-4">
           <div 
             onClick={() => fileInputRef.current?.click()}
             className={`
               border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
               ${fileName ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
             `}
           >
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept=".txt,.md" 
               onChange={handleFileChange}
             />
             <div className="text-4xl mb-2 text-slate-400">
               {fileName ? '📄' : '☁️'}
             </div>
             {fileName ? (
                <div className="text-green-700 font-medium">
                  {fileName} loaded successfully
                  <div className="text-xs text-green-600 mt-1">Text extracted</div>
                </div>
             ) : (
                <>
                  <p className="font-medium text-slate-700">Click to upload text file</p>
                  <p className="text-xs text-slate-500 mt-1">Supported: .txt, .md (Copy/Paste below for PDF/Word)</p>
                </>
             )}
           </div>
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Or paste your contract text here..."
            className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-mono text-slate-700 resize-none"
          ></textarea>
          <div className="absolute bottom-2 right-2 text-xs text-slate-400 bg-white/80 px-2 rounded">
            {text.length} chars
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading || text.length < 20}
          className={`
            w-full mt-6 py-4 rounded-lg font-bold text-white shadow-lg transition-all
            flex items-center justify-center gap-2
            ${isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.01]'}
          `}
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Analyzing Laws...
            </>
          ) : (
            <>
              Run Legal Risk Radar <i className="fas fa-bolt"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ContractInput;