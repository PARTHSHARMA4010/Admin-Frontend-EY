import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MapPin, Phone, Server, Plus, X, Search, Battery, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ServiceCenters = () => {
  const [centers, setCenters] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // ✅ ADDED: company_name to state
  const [form, setForm] = useState({ 
    centerId: '', 
    name: '', 
    company_name: '', 
    location: '', 
    phone: '', 
    capacity: 10 
  });
  
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchCenters(); }, []);

  const fetchCenters = async () => {
    try { const res = await api.getAllCenters(); setCenters(res.data); } catch (err) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { 
      await api.registerCenter(form); 
      fetchCenters(); 
      setShowForm(false); 
      // Reset form
      setForm({ centerId: '', name: '', company_name: '', location: '', phone: '', capacity: 10 });
    } catch (err) { alert("Error: ID likely exists"); }
  };

  const filteredCenters = centers.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase()) || 
    c.centerId.toLowerCase().includes(filter.toLowerCase()) ||
    (c.company_name && c.company_name.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 h-full relative">
      
      {/* Page Header */}
      <div className="flex justify-between items-end pb-4 border-b border-white/5 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Service Nodes</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage physical service capacity and regional hubs.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`btn-primary ${showForm ? '!bg-zinc-800 !text-white hover:!bg-zinc-700' : ''}`}
        >
          {showForm ? <><X size={16}/> Cancel</> : <><Plus size={16}/> Deploy Node</>}
        </button>
      </div>

      {/* Registration Form (Drawer) */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden shrink-0"
          >
            <div className="obsidian-card p-6 mb-6 bg-zinc-900 border border-zinc-800/50 shadow-2xl">
              <h3 className="text-xs font-mono text-zinc-500 uppercase mb-4 flex items-center gap-2">
                <Server size={12}/> New Node Configuration
              </h3>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Row 1 */}
                <input placeholder="Node ID (e.g. DEL-01)" required value={form.centerId} onChange={e => setForm({...form, centerId: e.target.value})} />
                <input placeholder="Center Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                {/* ✅ NEW INPUT FOR COMPANY NAME */}
                <input placeholder="Company (e.g. Maruti)" required value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} />
                
                {/* Row 2 */}
                <input placeholder="Location" required value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                <input placeholder="Phone" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                
                <button type="submit" className="bg-white hover:bg-zinc-200 text-black font-semibold rounded-md transition-colors text-sm h-[42px]">
                  Initialize Node
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="relative max-w-md shrink-0">
        <Search className="absolute left-3 top-2.5 text-zinc-500" size={14} />
        <input 
          placeholder="Search by Node ID, Name, or Company..." 
          className="pl-9 w-full bg-zinc-950 border-zinc-800 focus:border-zinc-600 transition-colors" 
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      {/* Grid of Cards - Added pb-20 to fix cutting off issue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20 overflow-y-auto custom-scrollbar">
        {filteredCenters.map((center) => (
          <div key={center._id} className="obsidian-card p-5 group flex flex-col justify-between min-h-[180px] hover:border-zinc-600/50 transition-all">
            
            {/* Card Top */}
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:text-white transition-colors">
                    <Server size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm group-hover:text-zinc-200 transition-colors">{center.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">{center.centerId}</span>
                      {/* Company Name Badge */}
                      {center.company_name && (
                        <span className="text-[10px] font-medium text-emerald-400/80 flex items-center gap-1">
                           <Building2 size={8}/> {center.company_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
              </div>

              <div className="space-y-2 mt-3 pl-1">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <MapPin size={12} className="shrink-0"/> <span className="truncate">{center.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Phone size={12} className="shrink-0"/> {center.phone}
                </div>
              </div>
            </div>

            {/* Card Bottom: Capacity */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-1">
                  <Battery size={10} /> Load Capacity
                </span>
                <span className="text-xs font-mono text-white">{center.capacity} Units</span>
              </div>
              <div className="flex gap-0.5 h-1">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-sm transition-all duration-500 ${i < 4 ? 'bg-white shadow-[0_0_5px_rgba(255,255,255,0.3)]' : 'bg-zinc-800'}`} 
                  />
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCenters;