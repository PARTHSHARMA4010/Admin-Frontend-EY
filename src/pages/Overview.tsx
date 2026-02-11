import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Activity, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

const Overview = () => {
  const [metrics, setMetrics] = useState({ total_batches: 0, total_parts: 0, critical_failures: 0 });
  const [vendorData, setVendorData] = useState<any[]>([]);
  const [partTrends, setPartTrends] = useState<any[]>([]);

  // Mock data for visual demonstration (since we might not have enough real data yet)
  // In a real scenario, you'd calculate these from api.getAllVendors() & api.getAllBatches()
  useEffect(() => {
    const loadData = async () => {
      try {
        const vendors = await api.getAllVendors();
        
        // 1. Calculate Vendor Performance (Mock logic for demo visuals)
        const vData = vendors.data.map((v: any) => ({
          name: v.name.split(' ')[0], // Short name
          defects: Math.floor(Math.random() * 50) + 5, // Simulated defects
          supplied: Math.floor(Math.random() * 5000) + 1000
        })).sort((a: any, b: any) => b.defects - a.defects).slice(0, 5); // Top 5 worst
        setVendorData(vData);

        // 2. Simulate "Parts Affected vs Vehicles" (Time based)
        const trendData = [
          { month: 'Jan', vehicles: 120, parts: 45 },
          { month: 'Feb', vehicles: 135, parts: 52 },
          { month: 'Mar', vehicles: 160, parts: 38 },
          { month: 'Apr', vehicles: 98, parts: 25 },
          { month: 'May', vehicles: 210, parts: 85 }, // Spike!
          { month: 'Jun', vehicles: 180, parts: 60 },
        ];
        setPartTrends(trendData);

        setMetrics({
          total_batches: 142,
          total_parts: 85000,
          critical_failures: 324
        });

      } catch (e) { console.error(e); }
    };
    loadData();
  }, []);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Intelligence</h1>
          <p className="text-zinc-500 text-sm mt-1">Cross-referencing vehicle diagnostics with supply chain origins.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-zinc-400 font-mono">LIVE ANALYSIS</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="obsidian-card p-6 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">System Health</p>
              <h3 className="text-3xl font-mono text-white mt-1">98.4%</h3>
            </div>
            <div className="p-2 bg-zinc-950 rounded text-emerald-500"><CheckCircle2 size={20}/></div>
          </div>
          <div className="mt-4 text-xs text-zinc-500">Operational efficiency optimal</div>
        </div>

        <div className="obsidian-card p-6 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Total Throughput</p>
              <h3 className="text-3xl font-mono text-white mt-1">{metrics.total_parts.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-zinc-950 rounded text-amber-500"><Activity size={20}/></div>
          </div>
          <div className="mt-4 text-xs text-zinc-500">Components tracked in ledger</div>
        </div>

        <div className="obsidian-card p-6 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Critical Defects</p>
              <h3 className="text-3xl font-mono text-white mt-1">{metrics.critical_failures}</h3>
            </div>
            <div className="p-2 bg-red-500/10 rounded text-red-500"><AlertTriangle size={20}/></div>
          </div>
          <div className="mt-4 text-xs text-zinc-500">Requires immediate attention</div>
        </div>
      </div>

      {/* MAIN GRAPHS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRAPH 1: Defect Trends */}
        <div className="obsidian-card p-6 min-h-[400px]">
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-500"/> Failure Correlation
            <span className="text-xs font-normal text-zinc-500 ml-auto font-mono">6 MONTH ROLLING</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={partTrends}>
                <defs>
                  <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorParts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="vehicles" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVehicles)" name="Vehicles Impacted" />
                <Area type="monotone" dataKey="parts" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorParts)" name="Defective Parts" />
                <Legend iconType="circle" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 2: Vendor Risk Analysis */}
        <div className="obsidian-card p-6 min-h-[400px]">
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500"/> Vendor Risk Profile
            <span className="text-xs font-normal text-zinc-500 ml-auto font-mono">TOP OFFENDERS</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#e4e4e7" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{fill: '#27272a'}}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                />
                <Bar dataKey="defects" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} name="Total Defects" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* GRAPH 3: Component Breakdown (Bottom Row) */}
      <div className="obsidian-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-white mb-2">Failure Distribution</h3>
            <p className="text-sm text-zinc-400 mb-6">Breakdown of reported anomalies by vehicle subsystem.</p>
            <div className="space-y-3">
              {[
                { label: "Braking System", val: "45%", color: "bg-red-500" },
                { label: "Electrical / ECU", val: "30%", color: "bg-blue-500" },
                { label: "Powertrain", val: "15%", color: "bg-amber-500" },
                { label: "Suspension", val: "10%", color: "bg-emerald-500" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-zinc-300">{item.label}</span>
                  </div>
                  <span className="font-mono text-white">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
          {/* ... previous code above ... */}

          <div className="col-span-2 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Braking', value: 450 },
                    { name: 'Electrical', value: 300 },
                    { name: 'Powertrain', value: 150 },
                    { name: 'Suspension', value: 100 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vendorData.map((entry, index) => (
                    // Note: using fixed COLORS array here instead of vendorData length to ensure colors render
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                {/* ✅ FIX: Added color: '#fff' to make text visible */}
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    borderColor: '#3f3f46', 
                    borderRadius: '8px', 
                    color: '#fff' // <--- THIS LINE WAS ADDED
                  }} 
                  itemStyle={{ color: '#fff' }}
                 />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Overview;