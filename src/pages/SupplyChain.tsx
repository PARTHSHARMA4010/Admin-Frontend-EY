import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Factory, Plus, BarChart2 } from 'lucide-react';

const SupplyChain = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [showRegister, setShowRegister] = useState(false);
  const [vendorForm, setVendorForm] = useState({ vendor_id: '', name: '', category: '', contact: '' });
  
  const [analyticsId, setAnalyticsId] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchVendors(); }, []);

  const fetchVendors = async () => {
    try { const res = await api.getAllVendors(); setVendors(res.data); } catch (err) {}
  };

  const handleRegister = async () => {
    try { await api.registerVendor(vendorForm); setShowRegister(false); fetchVendors(); } catch { alert("Error"); }
  };

  const runScan = async (id: string) => {
    setLoading(true);
    setAnalyticsId(id);
    try {
      const res = await api.getVendorAnalytics(id);
      setTimeout(() => { setStats(res.data); setLoading(false); }, 500);
    } catch { alert("Vendor Not Found"); setLoading(false); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] gap-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-app-700 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Supply Chain Network</h1>
          <p className="text-app-500 text-sm mt-1">Global vendor directory and real-time durability tracking.</p>
        </div>
        <button 
          onClick={() => setShowRegister(!showRegister)}
          className="btn-primary flex items-center gap-2"
        >
          {showRegister ? 'Cancel' : <><Plus size={16}/> Add Vendor</>}
        </button>
      </div>

      {/* Registration Panel (Collapsible) */}
      {showRegister && (
        <div className="obsidian-card p-6 animate-in slide-in-from-top-2">
          <h3 className="text-xs font-mono text-app-500 uppercase mb-4">New Vendor Registration</h3>
          <div className="grid grid-cols-4 gap-4">
            <input placeholder="Vendor ID (e.g. V-DENSO-09)" onChange={e => setVendorForm({...vendorForm, vendor_id: e.target.value})} />
            <input placeholder="Company Name" onChange={e => setVendorForm({...vendorForm, name: e.target.value})} />
            <input placeholder="Category" onChange={e => setVendorForm({...vendorForm, category: e.target.value})} />
            <input placeholder="Contact Email" onChange={e => setVendorForm({...vendorForm, contact: e.target.value})} />
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={handleRegister} className="btn-secondary text-xs uppercase tracking-wider">
              Confirm Entry
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
        
        {/* LEFT: Vendor Directory */}
        <div className="col-span-8 overflow-y-auto pr-2 space-y-2">
          <div className="text-xs font-mono text-app-500 uppercase mb-2 px-1">Registered Partners ({vendors.length})</div>
          {vendors.map((v) => (
            <div 
              key={v.vendor_id}
              onClick={() => runScan(v.vendor_id)}
              className={`p-4 rounded-md border cursor-pointer transition-all flex justify-between items-center group
                ${analyticsId === v.vendor_id 
                  ? 'bg-app-800 border-app-500 shadow-md' 
                  : 'bg-app-950 border-app-700 hover:bg-app-900 hover:border-app-500'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-app-900 flex items-center justify-center border border-app-700 text-app-500">
                  <Factory size={14} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">{v.name}</h3>
                  <div className="text-xs text-app-500 font-mono">{v.vendor_id}</div>
                </div>
              </div>
              <div className="text-xs text-app-500 group-hover:text-white transition-colors font-mono">
                {v.category}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Analytics Panel (The "Black Box") */}
        <div className="col-span-4 h-full flex flex-col">
          <div className="obsidian-card h-full p-6 flex flex-col bg-app-900">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <BarChart2 size={16} className="text-app-500"/> Diagnostics
            </h2>

            {/* Manual Search */}
            <div className="flex gap-2 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-app-500" size={14} />
                <input 
                  value={analyticsId}
                  onChange={(e) => setAnalyticsId(e.target.value)}
                  placeholder="Search ID..." 
                  className="pl-9 w-full bg-app-950"
                />
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 flex flex-col justify-center items-center">
              {loading ? (
                 <div className="flex flex-col items-center gap-3">
                   <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   <div className="text-xs text-app-500 font-mono uppercase">Processing Metrics...</div>
                 </div>
              ) : stats ? (
                <div className="w-full space-y-8 animate-in fade-in duration-500">
                  
                  {/* Score */}
                  <div className="text-center relative">
                    <div className="text-7xl font-mono font-light text-white tracking-tighter">
                      {Math.floor(stats.calculated_durability_score)}
                      <span className="text-2xl text-app-500">%</span>
                    </div>
                    <div className="text-xs text-app-500 uppercase tracking-widest mt-2">Durability Index</div>
                  </div>

                  {/* Data Grid */}
                  <div className="grid grid-cols-2 gap-px bg-app-700 rounded-lg overflow-hidden border border-app-700">
                    <div className="bg-app-900 p-4 text-center">
                      <div className="text-xs text-app-500 uppercase mb-1">Supplied</div>
                      <div className="text-lg font-mono text-white">{stats.total_parts_supplied}</div>
                    </div>
                    <div className="bg-app-900 p-4 text-center">
                      <div className="text-xs text-app-500 uppercase mb-1">Failures</div>
                      <div className={`text-lg font-mono ${stats.total_failures_detected > 0 ? 'text-status-error' : 'text-white'}`}>
                        {stats.total_failures_detected}
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border
                      ${stats.calculated_durability_score > 98 
                        ? 'bg-emerald-950/30 border-emerald-900 text-emerald-500' 
                        : 'bg-red-950/30 border-red-900 text-red-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${stats.calculated_durability_score > 98 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                      {stats.calculated_durability_score > 98 ? 'OPTIMAL PERFORMANCE' : 'AUDIT REQUIRED'}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center text-app-500 text-xs font-mono uppercase">
                  No Data Loaded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChain;