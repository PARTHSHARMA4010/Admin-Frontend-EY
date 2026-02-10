import { LayoutDashboard, Store, Truck, Box, Activity, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Service Nodes', icon: Store, path: '/centers' },
    { name: 'Supply Chain', icon: Truck, path: '/supply' },
    { name: 'Inventory', icon: Box, path: '/inventory' },
  ];

  return (
    <div className="w-64 h-screen bg-zinc-950 border-r border-white/10 fixed left-0 top-0 flex flex-col z-50">
      {/* Brand Header */}
      <div className="p-6 pb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold font-mono text-lg">
            A
          </div>
          <span className="font-bold text-white tracking-tight text-lg">AUTO.AI</span>
        </div>
        <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest pl-1">
          Enterprise Admin
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2 mt-2">
          Platform
        </div>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-zinc-900 text-white border border-white/5 shadow-inner" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
              )
            }
          >
            <div className="flex items-center gap-3">
              <link.icon size={18} className="opacity-80 group-hover:opacity-100" />
              <span>{link.name}</span>
            </div>
            {/* Active Indicator Dot */}
            <div className={clsx("w-1.5 h-1.5 rounded-full bg-white transition-opacity", 
              ({ isActive }: { isActive: boolean }) => isActive ? "opacity-100" : "opacity-0")} 
            />
          </NavLink>
        ))}
      </nav>
      
      {/* Footer Status */}
      <div className="p-4 border-t border-white/5 bg-zinc-900/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full absolute top-0 animate-ping opacity-75"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-white">System Operational</span>
            <span className="text-[10px] text-zinc-500 font-mono">v2.4.0 (Stable)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;