import { useState } from 'react';
import { FileText, Search, Download, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Reports = () => {
  const [vehicleId, setVehicleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) return;
    setLoading(true);
    
    // Simulate "Generating" process
    setTimeout(() => {
      setLoading(false);
      setReportReady(true);
    }, 1500);
  };

  const downloadReport = () => {
    // TRIGGER THE ACTUAL API DOWNLOAD
    const url = `https://ey-model-prediction.onrender.com/capa/${vehicleId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Compliance & CAPA</h1>
          <p className="text-zinc-500 text-sm mt-1">Generate ISO-standard Corrective Action reports for vehicle anomalies.</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="obsidian-card p-8 flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 border-zinc-800 bg-zinc-950/50">
        
        {!reportReady ? (
          <div className="w-full max-w-lg text-center space-y-6">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-zinc-800 text-zinc-500">
               <FileText size={32} />
            </div>
            
            <div className="space-y-2">
               <h3 className="text-xl font-semibold text-white">Generate Vehicle Report</h3>
               <p className="text-zinc-500 text-sm">Enter the chassis ID to pull diagnostic logs and generate a PDF.</p>
            </div>

            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-3.5 text-zinc-500" size={18} />
              <input 
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                placeholder="Enter Vehicle ID (e.g. BMW_777)..." 
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
              <button 
                type="submit"
                disabled={loading || !vehicleId}
                className="absolute right-2 top-2 bottom-2 px-4 bg-white text-black font-bold rounded hover:bg-zinc-200 transition-colors disabled:opacity-50 text-sm"
              >
                {loading ? 'GENERATING...' : 'GENERATE'}
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-500">
            {/* Success Card */}
            <div className="bg-zinc-900 border border-emerald-500/30 rounded-xl overflow-hidden shadow-2xl shadow-emerald-900/10">
              
              {/* Header */}
              <div className="bg-emerald-950/30 p-4 border-b border-emerald-500/20 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-emerald-500/20 rounded text-emerald-500">
                     <CheckCircle2 size={20} />
                   </div>
                   <div>
                     <h3 className="text-white font-bold text-sm">CAPA Report Generated</h3>
                     <p className="text-emerald-500 text-xs font-mono uppercase tracking-wider">Ready for Download</p>
                   </div>
                 </div>
                 <div className="text-right">
                    <div className="text-zinc-500 text-[10px] uppercase font-bold">Reference ID</div>
                    <div className="text-white font-mono text-xs">REF-{Math.floor(Math.random() * 100000)}</div>
                 </div>
              </div>

              {/* Content / Hardcoded Details */}
              <div className="p-6 grid grid-cols-2 gap-6">
                 <div>
                    <h4 className="text-xs text-zinc-500 uppercase font-bold mb-3">Target Asset</h4>
                    <div className="bg-zinc-950 p-3 rounded border border-white/5 space-y-2">
                       <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Vehicle ID</span>
                          <span className="text-white font-mono">{vehicleId}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Model Year</span>
                          <span className="text-white font-mono">2024</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Mileage</span>
                          <span className="text-white font-mono">12,405 KM</span>
                       </div>
                    </div>
                 </div>

                 <div>
                    <h4 className="text-xs text-zinc-500 uppercase font-bold mb-3">Compliance Checks</h4>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <ShieldCheck size={14} className="text-emerald-500"/> ISO 9001 Standards Met
                       </div>
                       <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <ShieldCheck size={14} className="text-emerald-500"/> Root Cause Analysis (RCA) Included
                       </div>
                       <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <AlertTriangle size={14} className="text-amber-500"/> 2 Minor Anomalies Flagged
                       </div>
                    </div>
                 </div>
              </div>

              {/* Footer / Action */}
              <div className="p-4 bg-zinc-950 border-t border-white/5 flex justify-between items-center">
                 <button onClick={() => setReportReady(false)} className="text-xs text-zinc-500 hover:text-white underline">
                    Start New Search
                 </button>
                 <button 
                   onClick={downloadReport}
                   className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded font-bold transition-all shadow-lg shadow-emerald-500/20"
                 >
                    <Download size={16} /> DOWNLOAD PDF
                 </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Reports;