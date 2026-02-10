import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MapPin, Phone, Server, Plus, X, Search, Battery } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ServiceCenters = () => {
  const [centers, setCenters] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ centerId: '', name: '', location: '', phone: '', capacity: 10 });
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchCenters(); }, []);

  const fetchCenters = async () => {
    try { const res = await api.getAllCenters(); setCenters(res.data); } catch (err) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.registerCenter(form); fetchCenters(); setShowForm(false); } catch (err) { alert("ID Exists"); }
  };

  // Simple filter logic
  const filteredCenters = centers.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase()) || 
    c.centerId.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-7xl mx-auto w-full gap-6">
      
      {/* Header Actions */}
      <div className="flex justify-between items-end border-b border-app-700 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Service Nodes</h1>
          <p className="text-app-500 text-sm mt-1">Manage physical service centers and maintenance capacity.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${showForm ? 'bg-app-800 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
        >
          {showForm ? <><X size={16}/> Cancel</> : <><Plus size={16}/> Deploy Node</>}
        </button>
      </div>

      {/* Collapsible Registration Drawer */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="obsidian-card p-6 mb-6 bg-app-900">
              <h3 className="text-xs font-mono text-app-500 uppercase mb-4">Node Configuration</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <input placeholder="Node ID (e.g. DEL-01)" required onChange={e => setForm({...form, centerId: e.target.value})} />
                <input placeholder="Center Name" required onChange={e => setForm({...form, name: e.target.value})} />
                <input placeholder="Location" required onChange={e => setForm({...form, location: e.target.value})} />
                <input placeholder="Phone" required onChange={e => setForm({...form, phone: e.target.value})} />
                <button type="submit" className="bg-brand-500 hover:bg-brand-600 text-black font-semibold rounded transition-colors text-sm">
                  Initialize
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Grid */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-app-500" size={14} />
        <input 
          placeholder="Search nodes..." 
          className="pl-9 w-full md:w-64 mb-6 bg-app-950" 
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4 custom-scrollbar">
        {filteredCenters.map((center) => (
          <div key={center._id} className="obsidian-card p-5 group hover:border-white/20 transition-all flex flex-col justify-between h-48">
            
            {/* Top Section */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-app-800 text-zinc-400">
                    <Server size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-brand-500 transition-colors">{center.name}</h3>
                    <span className="text-[10px] font-mono text-app-500 bg-app-950 px-1.5 py-0.5 rounded">{center.centerId}</span>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              </div>

              <div className="space-y-1 mt-3">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <MapPin size={12} /> {center.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Phone size={12} /> {center.phone}
                </div>
              </div>
            </div>

            {/* Bottom Section: Capacity Viz */}
            <div className="mt-4 pt-4 border-t border-app-800/50">
              <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] uppercase text-app-500 font-bold flex items-center gap-1">
                  <Battery size={10} /> Load Capacity
                </span>
                <span className="text-xs font-mono text-white">{center.capacity} Units</span>
              </div>
              {/* Visual Progress Bar */}
              <div className="flex gap-0.5 h-1.5">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-sm ${i < 3 ? 'bg-zinc-600' : 'bg-app-800'}`} 
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