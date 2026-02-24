import { useState, useEffect } from 'react';
import { 
  Search, Factory, Plus, BarChart2, Star, Clock, 
  Activity, MessageSquare, Mail, ShieldCheck, AlertOctagon, 
  CheckCircle2, TrendingUp, Cpu, Send
} from 'lucide-react';

const SupplyChain = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [showRegister, setShowRegister] = useState(false);
  const [vendorForm, setVendorForm] = useState({ vendor_id: '', name: '', category: '', contact: '' });
  
  const [analyticsId, setAnalyticsId] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Feedback State
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, review: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. DYNAMIC FETCH: Get all vendors
  useEffect(() => { fetchVendors(); }, []);

  const fetchVendors = async () => {
    try { 
      const res = await fetch('https://eyvendornew.onrender.com/api/vendors');
      const jsonResponse = await res.json();
      const vendorArray = jsonResponse.data || [];
      setVendors(vendorArray); 
    } catch (err) {
      console.error("Failed to fetch vendors", err);
    }
  };

  // 2. DYNAMIC POST: Register new vendor
  const handleRegister = async () => {
    try { 
      const payload = {
        vendor_id: vendorForm.vendor_id,
        name: vendorForm.name,
        category: vendorForm.category,
        contact: { email: vendorForm.contact },
        local_metrics: {
          total_jobs: 0,
          failed_jobs: 0,
          durability_score: 100,
          company_local_rating: 0,
          avg_response_time: 0,
          company_reviews: [],
          avg_rating: 0
        }
      };

      const res = await fetch('https://eyvendornew.onrender.com/api/vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowRegister(false); 
        setVendorForm({ vendor_id: '', name: '', category: '', contact: '' });
        fetchVendors(); 
      } else {
        alert("Failed to register vendor. Please check the inputs.");
      }
    } catch { 
      alert("Error connecting to the server."); 
    }
  };

  // 3. REAL-TIME SCAN LOGIC
  const runScan = (id: string) => {
    setLoading(true);
    setAnalyticsId(id);
    setStats(null); 
    setFeedbackForm({ rating: 5, review: '' }); // Reset feedback form on new scan

    setTimeout(() => {
      const foundVendor = vendors.find(v => 
        v.vendor_id === id || 
        (v._id && v._id.$oid === id) || 
        v._id === id
      );
      setStats(foundVendor);
      setLoading(false);
    }, 500); 
  };

  // 4. SUBMIT FEEDBACK LOGIC
  const submitFeedback = () => {
    if (!feedbackForm.review.trim()) return;
    setIsSubmitting(true);

    // Simulate API delay for UX
    setTimeout(() => {
      // Optimistic UI Update: push the new review to the top of the array
      const updatedStats = { ...stats };
      if (!updatedStats.local_metrics.company_reviews) {
        updatedStats.local_metrics.company_reviews = [];
      }
      updatedStats.local_metrics.company_reviews.unshift(feedbackForm.review);
      
      // Update local rating visually
      updatedStats.local_metrics.company_local_rating = 
        ((updatedStats.local_metrics.company_local_rating + feedbackForm.rating) / 2).toFixed(1);

      setStats(updatedStats);
      setFeedbackForm({ rating: 5, review: '' }); // clear form
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full gap-6 text-zinc-100 font-sans bg-[#050505]">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-zinc-800 pb-5 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Supply Chain Intelligence
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Cross-referencing vendor durability with real-time operations.</p>
        </div>
        <button 
          onClick={() => setShowRegister(!showRegister)}
          className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded font-bold text-sm flex items-center gap-2 transition-all"
        >
          {showRegister ? 'Cancel' : <><Plus size={16}/> Add Vendor</>}
        </button>
      </div>

      {/* Registration Panel */}
      {showRegister && (
        <div className="bg-[#0a0a0a] p-6 rounded-xl border border-zinc-800 shadow-xl animate-in slide-in-from-top-2 shrink-0">
          <h3 className="text-xs font-mono text-zinc-400 uppercase mb-5 flex items-center gap-2 font-bold tracking-widest">
            <Factory size={14}/> Initialize New Partner
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input placeholder="Vendor ID (e.g. V-Grapes-09)" value={vendorForm.vendor_id} onChange={e => setVendorForm({...vendorForm, vendor_id: e.target.value})} className="bg-[#050505] border border-zinc-800 p-3 rounded-lg text-sm text-white focus:border-zinc-500 transition-colors outline-none"/>
            <input placeholder="Company Name" value={vendorForm.name} onChange={e => setVendorForm({...vendorForm, name: e.target.value})} className="bg-[#050505] border border-zinc-800 p-3 rounded-lg text-sm text-white focus:border-zinc-500 transition-colors outline-none"/>
            <input placeholder="Category" value={vendorForm.category} onChange={e => setVendorForm({...vendorForm, category: e.target.value})} className="bg-[#050505] border border-zinc-800 p-3 rounded-lg text-sm text-white focus:border-zinc-500 transition-colors outline-none"/>
            <input placeholder="Contact Email" value={vendorForm.contact} onChange={e => setVendorForm({...vendorForm, contact: e.target.value})} className="bg-[#050505] border border-zinc-800 p-3 rounded-lg text-sm text-white focus:border-zinc-500 transition-colors outline-none"/>
          </div>
          <div className="mt-5 flex justify-end">
            <button onClick={handleRegister} className="bg-white text-black px-6 py-2 rounded font-bold text-sm hover:bg-zinc-200 transition-colors">
              Deploy to Network
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
        
        {/* LEFT: Vendor Directory List */}
        <div className="col-span-12 lg:col-span-5 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          <div className="flex justify-between items-center mb-3 px-1">
             <div className="text-xs font-mono text-zinc-500 uppercase font-bold tracking-wider">Registered Partners ({vendors.length})</div>
             <div className="text-[10px] text-zinc-400 font-mono tracking-widest flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> LIVE
             </div>
          </div>
          
          {vendors.map((v) => {
            const displayId = v.vendor_id || (v._id && v._id.$oid) || v._id || 'UNKNOWN';
            const isSelected = analyticsId === displayId;

            return (
              <div 
                key={displayId}
                onClick={() => runScan(displayId)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center group
                  ${isSelected 
                    ? 'bg-[#111111] border-zinc-500' 
                    : 'bg-[#0a0a0a] border-zinc-800 hover:bg-[#111111]'}`}
              >
                <div className="flex items-center gap-4 pl-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors
                    ${isSelected ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-[#050505] border-zinc-800 text-zinc-500'}`}>
                    <Cpu size={18} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold tracking-tight ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                      {v.name || 'Unnamed Vendor'}
                    </h3>
                    <div className="text-xs text-zinc-500 font-mono flex items-center gap-2 mt-0.5">
                      {displayId}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border
                    ${isSelected ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-[#050505] border-zinc-800 text-zinc-600'}`}>
                    {v.category || 'General'}
                  </span>
                  {isSelected && <TrendingUp size={14} className="text-zinc-400 mt-1" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Advanced Analytics "Terminal" */}
        <div className="col-span-12 lg:col-span-7 h-full flex flex-col">
          <div className="h-full rounded-2xl flex flex-col bg-[#0a0a0a] border border-zinc-800 overflow-hidden">
            
            {/* Header / Search Area */}
            <div className="p-6 border-b border-zinc-800 bg-[#0a0a0a] z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Activity size={16} className="text-zinc-400"/> Diagnostic Terminal
                </h2>
                {stats && stats.local_metrics && (
                   <span className={`text-[10px] px-3 py-1 rounded border uppercase tracking-wider font-bold flex items-center gap-1.5
                     ${(stats.local_metrics.durability_score || 0) >= 90 
                       ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/20' 
                       : 'text-amber-400 border-amber-900/50 bg-amber-950/20'}`}>
                     <ShieldCheck size={12} />
                     {(stats.local_metrics.durability_score || 0) >= 90 ? 'VERIFIED VENDOR' : 'UNDER REVIEW'}
                   </span>
                )}
              </div>
              
              <div className="relative group">
                <Search className="absolute left-3 top-3.5 text-zinc-500" size={16} />
                <input 
                  value={analyticsId}
                  onChange={(e) => setAnalyticsId(e.target.value)}
                  placeholder="Select or scan vendor ID..." 
                  className="pl-10 w-full bg-[#050505] border border-zinc-800 focus:border-zinc-500 transition-all font-mono text-sm py-3 rounded-lg text-white placeholder-zinc-600 outline-none"
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-[#050505]">
              {loading ? (
                 <div className="h-full flex flex-col items-center justify-center gap-6">
                   <div className="w-10 h-10 border-2 border-zinc-800 border-t-white rounded-full animate-spin"></div>
                   <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Decrypting Telemetry...</div>
                 </div>
              ) : stats && stats.local_metrics ? (
                <div className="space-y-8 animate-in fade-in duration-500">
                  
                  {/* 1. Main Score Card (Durability) */}
                  <div className="rounded-2xl bg-[#0a0a0a] border border-zinc-800 p-8 text-center flex flex-col items-center justify-center">
                     <div className="text-6xl font-mono font-light text-white tracking-tighter flex items-baseline gap-1">
                      {stats.local_metrics.durability_score}<span className="text-xl text-zinc-500 font-sans">%</span>
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-[0.2em] mt-3 font-bold">Overall Durability Index</div>
                  </div>

                  {/* 2. Key Metrics Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#0a0a0a] p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
                      <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1.5 mb-3 font-bold tracking-widest">
                        <Activity size={12} /> Total Jobs
                      </div>
                      <div className="text-2xl font-mono text-white">
                        {stats.local_metrics.total_jobs}
                      </div>
                    </div>

                    <div className="bg-[#0a0a0a] p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
                      <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1.5 mb-3 font-bold tracking-widest">
                        <AlertOctagon size={12} /> Failures
                      </div>
                      <div className={`text-2xl font-mono ${stats.local_metrics.failed_jobs > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {stats.local_metrics.failed_jobs}
                      </div>
                    </div>
                    
                    <div className="bg-[#0a0a0a] p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
                      <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1.5 mb-3 font-bold tracking-widest">
                        <Clock size={12} /> Response
                      </div>
                      <div className="text-2xl font-mono text-white flex items-baseline gap-1">
                        {stats.local_metrics.avg_response_time} <span className="text-[10px] text-zinc-600">hrs</span>
                      </div>
                    </div>

                    <div className="bg-[#0a0a0a] p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
                      <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1.5 mb-3 font-bold tracking-widest">
                        <CheckCircle2 size={12} /> Success Rate
                      </div>
                      <div className="text-2xl font-mono text-white flex items-baseline gap-1">
                        {stats.local_metrics.total_jobs > 0 
                          ? (((stats.local_metrics.total_jobs - stats.local_metrics.failed_jobs) / stats.local_metrics.total_jobs) * 100).toFixed(1) 
                          : "100.0"}<span className="text-[10px] text-zinc-600">%</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Ratings & Feedback Intelligence Section */}
                  <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800 p-6">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Star size={14} className="text-zinc-400"/> Rating & Sentiment Intelligence
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      {/* Local Rating Bar */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs text-zinc-500 font-mono">Company Rating</span>
                          <span className="text-lg font-bold text-white font-mono">{stats.local_metrics.company_local_rating} <span className="text-xs text-zinc-600">/ 5.0</span></span>
                        </div>
                        <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden">
                          <div className="h-full bg-white" style={{ width: `${(stats.local_metrics.company_local_rating / 5) * 100}%` }}></div>
                        </div>
                      </div>

                      {/* Global/Avg Rating Bar */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs text-zinc-500 font-mono">Global Avg Score</span>
                          <span className="text-lg font-bold text-white font-mono">{stats.local_metrics.avg_rating} <span className="text-xs text-zinc-600">/ 100</span></span>
                        </div>
                        <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden">
                          <div className={`h-full ${stats.local_metrics.avg_rating >= 70 ? 'bg-white' : 'bg-zinc-500'}`} style={{ width: `${stats.local_metrics.avg_rating}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Submit New Feedback Form */}
                    <div className="bg-[#111] border border-zinc-800 rounded-xl p-4 mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Submit Internal Report</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={16} 
                              onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                              className={`cursor-pointer transition-colors ${feedbackForm.rating >= star ? 'text-white fill-white' : 'text-zinc-700'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <input 
                          value={feedbackForm.review}
                          onChange={(e) => setFeedbackForm({...feedbackForm, review: e.target.value})}
                          placeholder="Log vendor performance details..."
                          className="flex-1 bg-[#050505] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-zinc-500 outline-none font-mono"
                          onKeyDown={(e) => e.key === 'Enter' && submitFeedback()}
                        />
                        <button 
                          onClick={submitFeedback}
                          disabled={isSubmitting || !feedbackForm.review.trim()}
                          className="bg-white text-black px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50 hover:bg-zinc-200 transition-colors"
                        >
                          {isSubmitting ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <Send size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Review Terminal Logs */}
                    <div className="space-y-3">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-3">Historical Logs</div>
                      {stats.local_metrics.company_reviews && stats.local_metrics.company_reviews.length > 0 ? (
                        stats.local_metrics.company_reviews.map((review: string, i: number) => (
                          <div key={i} className="flex gap-4 text-sm bg-[#050505] p-4 rounded-lg border border-zinc-800">
                            <MessageSquare size={16} className="text-zinc-600 shrink-0 mt-0.5" />
                            <span className="text-zinc-300 leading-relaxed font-mono text-xs">"{review}"</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-zinc-600 italic border border-dashed border-zinc-800 p-6 rounded-lg text-center bg-[#050505]">
                          No sentiment data logged for this entity.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4. Contact Footer */}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] flex items-center justify-center text-zinc-400 border border-zinc-800">
                        <Mail size={16} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Secure Contact Channel</span>
                         <span className="text-sm text-white font-mono">{stats.contact?.email || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                  <div className="w-20 h-20 rounded-full bg-[#0a0a0a] border border-zinc-800 flex items-center justify-center">
                     <ShieldCheck size={32} className="opacity-50" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Terminal Ready</div>
                    <div className="text-xs mt-2 font-mono">Select a vendor to decrypt telemetry data</div>
                  </div>
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