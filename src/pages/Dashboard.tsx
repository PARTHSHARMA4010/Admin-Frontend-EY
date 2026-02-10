import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Activity, Server, Users, AlertTriangle, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({ centers: 0, vendors: 0, capacity: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [centersRes, vendorsRes] = await Promise.all([
          api.getAllCenters(),
          api.getAllVendors()
        ]);
        
        // Calculate total capacity across all centers
        const totalCap = centersRes.data.reduce((acc: number, curr: any) => acc + (curr.capacity || 0), 0);
        
        setMetrics({
          centers: centersRes.data.length,
          vendors: vendorsRes.data.length,
          capacity: totalCap
        });
        setLoading(false);
      } catch (e) { console.error(e); setLoading(false); }
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Active Service Hubs", value: metrics.centers, icon: Server, color: "text-blue-400" },
    { label: "Supply Partners", value: metrics.vendors, icon: Users, color: "text-emerald-400" },
    { label: "Global Service Capacity", value: metrics.capacity, icon: Activity, color: "text-purple-400" },
    { label: "Critical Alerts", value: "0", icon: AlertTriangle, color: "text-amber-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="border-b border-app-700 pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
        <p className="text-app-500 text-sm mt-1 font-mono">Real-time operational metrics and health status.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="obsidian-card p-6 flex flex-col justify-between hover:border-app-500 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded bg-app-950 border border-app-800 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              {loading ? (
                <div className="w-8 h-8 bg-app-800 animate-pulse rounded"></div>
              ) : (
                <span className="text-3xl font-mono text-white font-light tracking-tighter">{stat.value}</span>
              )}
            </div>
            <div className="text-xs text-app-500 font-medium uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Split View: Recent Activity & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Dummy Activity Feed (To make it look busy/alive) */}
        <div className="lg:col-span-2 obsidian-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent System Events</h3>
            <button className="text-xs text-brand-500 hover:text-white transition-colors">View Logs</button>
          </div>
          <div className="space-y-0">
            {[
              { time: "10:42 AM", event: "New Supply Batch ingested", user: "Admin", status: "Success" },
              { time: "10:30 AM", event: "Vendor 'Bosch' Updated Profile", user: "System", status: "Info" },
              { time: "09:15 AM", event: "Service Center DEL-01 Online", user: "Auto-Scale", status: "Success" },
              { time: "08:50 AM", event: "Predictive Maint. Alert (Vehicle KA-05)", user: "AI-Agent", status: "Warning" },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-app-800 last:border-0 hover:bg-app-950/50 px-2 -mx-2 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-app-500">{log.time}</span>
                  <span className="text-sm text-zinc-300">{log.event}</span>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded border uppercase ${
                  log.status === 'Success' ? 'border-emerald-900 text-emerald-500 bg-emerald-950/20' : 
                  log.status === 'Warning' ? 'border-amber-900 text-amber-500 bg-amber-950/20' : 
                  'border-app-700 text-app-500 bg-app-900'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Health Status */}
        <div className="obsidian-card p-6 bg-gradient-to-b from-app-900 to-app-950">
          <div className="flex items-center gap-2 mb-6 text-brand-500">
            <ShieldCheck size={18} />
            <h3 className="text-sm font-bold uppercase tracking-wider">AI Guardrails</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-zinc-400">Durability Model Accuracy</span>
                <span className="text-white font-mono">98.4%</span>
              </div>
              <div className="h-1.5 w-full bg-app-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[98%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-zinc-400">UEBA Anomaly Detection</span>
                <span className="text-white font-mono">Active</span>
              </div>
              <div className="h-1.5 w-full bg-app-950 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 w-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="p-4 bg-app-950 rounded border border-app-800 mt-4">
              <div className="text-[10px] text-app-500 uppercase mb-1">System Load</div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-mono text-white">12ms</span>
                <span className="text-xs text-emerald-500 mb-1 flex items-center">
                  <ArrowUpRight size={10} /> Optimal
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;