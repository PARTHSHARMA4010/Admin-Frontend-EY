import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 overflow-y-auto">
        {/* Maximum width container for large screens */}
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;