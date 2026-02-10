import { useState } from 'react';
import { api } from '../services/api';
import { ShieldCheck, Box, BarChart3 } from 'lucide-react';

const SupplyChain = () => {
  // Simple state for Vendor Form
  const [vendorForm, setVendorForm] = useState({ vendor_id: '', name: '', category: '', contact: '' });
  // State for Batch Form (Simplified for demo, usually you'd paste JSON)
  const [batchJson, setBatchJson] = useState('');
  
  // Analytics State
  const [analyticsId, setAnalyticsId] = useState('');
  const [stats, setStats] = useState<any>(null);

  const handleRegisterVendor = async () => {
    try { await api.registerVendor(vendorForm); alert("Vendor Onboarded"); } 
    catch { alert("Error"); }
  };

  const handleAddBatch = async () => {
    try { 
      const parsed = JSON.parse(batchJson);
      await api.addBatch(parsed); 
      alert("Batch Supply Logged"); 
    } catch { alert("Invalid JSON or Error"); }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.getVendorAnalytics(analyticsId);
      setStats(res.data);
    } catch { alert("Vendor Not Found"); }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-pink-500">Supply Chain Grid</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: ACTIONS */}
        <div className="space-y-8">
          {/* Vendor Registration */}
          <div className="glass-panel p-6 rounded-xl border-t-4 border-neon-purple">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ShieldCheck className="text-neon-purple"/> Register Vendor</h2>
            <div className="space-y-3">
              <input placeholder="Vendor ID (e.g. V-DENSO-09)" className="w-full p-3 bg-space-900 border border-white/10 rounded text-white" onChange={e => setVendorForm({...vendorForm, vendor_id: e.target.value})} />
              <input placeholder="Company Name" className="w-full p-3 bg-space-900 border border-white/10 rounded text-white" onChange={e => setVendorForm({...vendorForm, name: e.target.value})} />
              <button onClick={handleRegisterVendor} className="w-full bg-neon-purple/20 text-neon-purple border border-neon-purple hover:bg-neon-purple hover:text-white font-bold p-3 rounded transition-all">
                AUTHORIZE VENDOR
              </button>
            </div>
          </div>

          {/* Batch Import */}
          <div className="glass-panel p-6 rounded-xl border-t-4 border-yellow-500">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Box className="text-yellow-500"/> Import Batch (JSON)</h2>
            <textarea 
              rows={6}
              placeholder="Paste Batch JSON here..." 
              className="w-full p-3 bg-space-900 border border-white/10 rounded text-white font-mono text-xs"
              onChange={e => setBatchJson(e.target.value)}
            />
            <button onClick={handleAddBatch} className="w-full mt-3 bg-yellow-500/20 text-yellow-500 border border-yellow-500 hover:bg-yellow-500 hover:text-black font-bold p-3 rounded transition-all">
              INGEST DATA
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: ANALYTICS */}
        <div className="glass-panel p-8 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-neon-blue/5 blur-3xl rounded-full pointer-events-none"></div>
          
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><BarChart3 className="text-neon-blue"/> Durability Intelligence</h2>
          
          <div className="flex gap-2 mb-8">
            <input placeholder="Enter Vendor ID to Scan" className="flex-1 p-3 bg-space-900 border border-white/10 rounded text-white" onChange={e => setAnalyticsId(e.target.value)} />
            <button onClick={fetchAnalytics} className="bg-neon-blue text-black font-bold px-6 rounded">SCAN</button>
          </div>

          {stats && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">DURABILITY SCORE</div>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-neon-blue to-white">
                  {stats.calculated_durability_score}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                  <div className="text-xs text-gray-500">TOTAL PARTS</div>
                  <div className="text-2xl font-bold">{stats.total_parts_supplied.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="text-xs text-red-400">FAILURES DETECTED</div>
                  <div className="text-2xl font-bold text-red-500">{stats.total_failures_detected}</div>
                </div>
              </div>
              
              <div className="text-xs text-center text-gray-500 font-mono">
                VENDOR: {stats.vendor_name} | BATCHES: {stats.batches_analyzed}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplyChain;