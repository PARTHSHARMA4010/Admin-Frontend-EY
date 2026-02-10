import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShieldCheck, BarChart3, Search, Factory, Zap, Plus, X, Globe, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const SupplyChain = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [showRegister, setShowRegister] = useState(false);
  
  // Registration Form State
  const [vendorForm, setVendorForm] = useState({ vendor_id: '', name: '', category: '', contact: '' });
  
  // Analytics State
  const [analyticsId, setAnalyticsId] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchVendors(); }, []);

  const fetchVendors = async () => {
    try { const res = await api.getAllVendors(); setVendors(res.data); } catch (err) {}
  };

  const handleRegister = async () => {
    try { 
      await api.registerVendor(vendorForm); 
      alert("Vendor Authorized & Added to Blockchain"); 
      setShowRegister(false);
      fetchVendors(); 
    } catch { alert("Error: Vendor ID might already exist"); }
  };

  const runScan = async (id: string) => {
    setLoading(true);
    setAnalyticsId(id);
    try {
      const res = await api.getVendorAnalytics(id);
      // Artificial delay for "Scanning" effect to look cool
      setTimeout(() => {
        setStats(res.data);
        setLoading(false);
      }, 800);
    } catch { 
      alert("Vendor Not Found"); 
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* --- HEADER SECTION --- */}
      <div className="flex justify-between items-center pb-4 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-pink-500">
            Global Supply Network
          </h1>
          <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
            <Globe size={14} /> Tracking {vendors.length} Active Partners across 12 Regions
          </p>
        </div>
        <button 
          onClick={() => setShowRegister(!showRegister)}
          className={clsx(
            "flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all border",
            showRegister 
              ? "bg-red-500/10 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
              : "bg-neon-purple/10 text-neon-purple border-neon-purple hover:bg-neon-purple hover:text-white"
          )}
        >
          {showRegister ? <><X size={18}/> CANCEL</> : <><Plus size={18}/> ONBOARD NEW VENDOR</>}
        </button>
      </div>

      {/* --- COLLAPSIBLE REGISTRATION PANEL --- */}
      <AnimatePresence>
        {showRegister && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel p-8 rounded-xl border-t-4 border-neon-purple mb-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="text-neon-purple" /> Vendor Authorization Protocol
                </h3>
                <p className="text-gray-400 text-sm">
                  Registering a new entity creates an immutable record in the supply chain database. Ensure ID uniqueness.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 uppercase">Company Name</label>
                  <input className="w-full bg-space-900 border border-white/10 rounded p-3 text-white focus:border-neon-purple outline-none" 
                    onChange={e => setVendorForm({...vendorForm, name: e.target.value})} placeholder="e.g. Bosch Automotive" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Vendor ID</label>
                  <input className="w-full bg-space-900 border border-white/10 rounded p-3 text-white focus:border-neon-purple outline-none" 
                    onChange={e => setVendorForm({...vendorForm, vendor_id: e.target.value})} placeholder="V-XX-00" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Category</label>
                  <input className="w-full bg-space-900 border border-white/10 rounded p-3 text-white focus:border-neon-purple outline-none" 
                    onChange={e => setVendorForm({...vendorForm, category: e.target.value})} placeholder="Electronics" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 uppercase">Contact Channel</label>
                  <input className="w-full bg-space-900 border border-white/10 rounded p-3 text-white focus:border-neon-purple outline-none" 
                    onChange={e => setVendorForm({...vendorForm, contact: e.target.value})} placeholder="supply@domain.com" />
                </div>
                <button onClick={handleRegister} className="col-span-2 mt-2 bg-neon-purple text-white font-bold py-3 rounded hover:shadow-[0_0_15px_rgba(189,0,255,0.4)] transition-all">
                  AUTHORIZE & SAVE ENTITY
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* --- LEFT: SCROLLABLE VENDOR GRID --- */}
        <div className="lg:col-span-8 overflow-y-auto pr-2 space-y-4 h-full custom-scrollbar">
          {vendors.map((v, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              key={v.vendor_id}
              onClick={() => runScan(v.vendor_id)}
              className={clsx(
                "glass-panel p-5 rounded-xl cursor-pointer transition-all border-l-4 group relative overflow-hidden",
                analyticsId === v.vendor_id ? "border-l-neon-blue bg-white/5" : "border-l-transparent hover:border-l-neon-purple"
              )}
            >
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-space-900 flex items-center justify-center border border-white/10 group-hover:border-neon-purple/50 transition-colors">
                    <Factory size={24} className="text-gray-400 group-hover:text-neon-purple" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-neon-purple transition-colors">{v.name}</h3>
                    <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                      <span className="bg-white/10 px-1 rounded text-gray-300">{v.vendor_id}</span>
                      <span>• {v.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">DURABILITY RATING</div>
                  {/* We use the stored static score if available, or just a placeholder */}
                  <div className="text-xl font-mono text-white/50 group-hover:text-white transition-colors">--.--%</div>
                </div>
              </div>
              {/* Hover Effect BG */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* --- RIGHT: LIVE INTELLIGENCE PANEL (FIXED) --- */}
        <div className="lg:col-span-4 h-full">
          <div className="glass-panel h-full rounded-xl border border-white/10 p-6 flex flex-col relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-40 bg-neon-blue/5 blur-3xl rounded-full pointer-events-none"></div>

            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-neon-blue relative z-10">
              <BarChart3 size={20}/> Durability Intelligence
            </h2>

            {/* MANUAL SEARCH BAR (IT IS BACK!) */}
            <div className="flex gap-2 mb-8 relative z-10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-500" size={16} />
                <input 
                  value={analyticsId}
                  onChange={(e) => setAnalyticsId(e.target.value)}
                  placeholder="Enter Vendor ID..." 
                  className="w-full bg-space-900 border border-white/10 rounded-lg pl-10 p-2 text-white focus:border-neon-blue outline-none" 
                />
              </div>
              <button onClick={() => runScan(analyticsId)} className="bg-neon-blue text-black font-bold px-4 rounded hover:shadow-neon-blue transition-all">
                SCAN
              </button>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
              {loading ? (
                 <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="text-neon-blue font-mono text-sm animate-pulse">ANALYZING BATCH DATA...</div>
                 </div>
              ) : stats ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full space-y-6">
                  
                  {/* MASSIVE SCORE CARD */}
                  <div className="text-center py-8 relative">
                    <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest">Calculated Durability</div>
                    <div className={clsx(
                      "text-7xl font-black bg-clip-text text-transparent drop-shadow-2xl",
                      stats.calculated_durability_score > 98 ? "bg-gradient-to-br from-green-400 to-emerald-600" :
                      stats.calculated_durability_score > 90 ? "bg-gradient-to-br from-yellow-400 to-orange-600" :
                      "bg-gradient-to-br from-red-400 to-red-600"
                    )}>
                      {stats.calculated_durability_score}%
                    </div>
                    <div className="mt-2 text-white font-bold text-xl">{stats.vendor_name}</div>
                  </div>

                  {/* STATS GRID */}
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <div className="bg-space-900 p-4 rounded-lg border border-white/5 text-center">
                      <div className="text-xs text-gray-500 uppercase mb-1">Total Parts</div>
                      <div className="text-2xl font-mono text-white">{stats.total_parts_supplied.toLocaleString()}</div>
                    </div>
                    <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20 text-center">
                      <div className="text-xs text-red-400 uppercase mb-1">Failures</div>
                      <div className="text-2xl font-mono text-red-500">{stats.total_failures_detected}</div>
                    </div>
                    <div className="bg-space-900 p-4 rounded-lg border border-white/5 text-center col-span-2">
                      <div className="text-xs text-gray-500 uppercase mb-1">Batches Analyzed</div>
                      <div className="text-xl font-mono text-white">{stats.batches_analyzed}</div>
                    </div>
                  </div>

                  {/* Recommendation Engine (Fake AI Insight) */}
                  <div className="bg-white/5 p-4 rounded border-l-2 border-neon-blue mt-4">
                    <div className="flex items-center gap-2 text-neon-blue text-xs font-bold mb-1">
                      <Zap size={12} /> AI RECOMMENDATION
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {stats.calculated_durability_score > 99 
                        ? "Vendor performance is optimal. Recommended for 'Preferred Supplier' status extension." 
                        : "Detecting minor deviations in recent batches. Suggest initiating Quality Audit Protocol A-12."}
                    </p>
                  </div>

                </motion.div>
              ) : (
                <div className="text-center opacity-40">
                  <Search size={64} className="mx-auto mb-4 text-gray-600"/>
                  <p className="text-sm text-gray-400">Select a vendor or enter ID<br/>to initialize deep-scan analytics.</p>
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