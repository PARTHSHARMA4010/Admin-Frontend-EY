import { LayoutDashboard, Store, Truck, Activity } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { name: 'Overview', icon: LayoutDashboard, path: '/' },
    { name: 'Service Hubs', icon: Store, path: '/centers' },
    { name: 'Supply Chain', icon: Truck, path: '/supply' },
  ];

  return (
    <div className="w-64 h-screen glass-panel fixed left-0 top-0 border-r border-white/10 flex flex-col p-6 z-50">
      <div className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple mb-10">
        AUTO.AI <span className="text-xs text-white/50 block font-normal">ADMIN TERMINAL</span>
      </div>
      
      <nav className="space-y-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                isActive 
                ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30 shadow-[0_0_15px_rgba(0,242,255,0.2)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <link.icon size={20} />
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-auto p-4 rounded-lg bg-gradient-to-br from-neon-purple/20 to-transparent border border-neon-purple/20">
        <div className="flex items-center gap-2 text-neon-purple mb-1">
          <Activity size={16} />
          <span className="text-xs font-bold">SYSTEM ONLINE</span>
        </div>
        <div className="text-xs text-gray-400">v2.4.0 Stable</div>
      </div>
    </div>
  );
};

export default Sidebar;