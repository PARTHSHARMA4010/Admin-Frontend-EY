import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MapPin, Phone, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceCenters = () => {
  const [centers, setCenters] = useState<any[]>([]);
  const [form, setForm] = useState({ centerId: '', name: '', location: '', phone: '', capacity: 10 });

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const res = await api.getAllCenters();
      setCenters(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.registerCenter(form);
      fetchCenters(); // Refresh list
      alert("Center Deployed Successfully");
    } catch (err) { alert("Deployment Failed"); }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Service Hubs</h1>

      {/* Registration Form */}
      <div className="glass-panel p-6 rounded-xl border-l-4 border-neon-blue">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Server className="text-neon-blue" /> Deploy New Node
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input placeholder="Center ID (e.g., DEL-01)" className="p-3 bg-space-900 border border-white/10 rounded text-white focus:border-neon-blue outline-none transition-colors" onChange={e => setForm({...form, centerId: e.target.value})} />
          <input placeholder="Center Name" className="p-3 bg-space-900 border border-white/10 rounded text-white focus:border-neon-blue outline-none transition-colors" onChange={e => setForm({...form, name: e.target.value})} />
          <input placeholder="Location" className="p-3 bg-space-900 border border-white/10 rounded text-white focus:border-neon-blue outline-none transition-colors" onChange={e => setForm({...form, location: e.target.value})} />
          <input placeholder="Phone" className="p-3 bg-space-900 border border-white/10 rounded text-white focus:border-neon-blue outline-none transition-colors" onChange={e => setForm({...form, phone: e.target.value})} />
          <button type="submit" className="col-span-2 bg-neon-blue text-black font-bold p-3 rounded hover:shadow-neon-blue transition-all">
            INITIALIZE CENTER
          </button>
        </form>
      </div>

      {/* List View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {centers.map((center, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={center._id} 
            className="glass-panel p-5 rounded-xl hover:border-neon-blue/50 transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-xl text-white group-hover:text-neon-blue transition-colors">{center.name}</h3>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">ONLINE</span>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-center gap-2"><MapPin size={14}/> {center.location}</p>
              <p className="flex items-center gap-2"><Phone size={14}/> {center.phone}</p>
              <p className="text-white mt-2 pt-2 border-t border-white/10">Capacity: <span className="text-neon-blue">{center.capacity} Units</span></p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCenters;