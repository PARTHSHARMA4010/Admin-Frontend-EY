import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ServiceCenters from './pages/ServiceCenters';
import SupplyChain from './pages/SupplyChain';
import Inventory from './pages/Inventory'; // Import the new page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div className="text-white p-10">Dashboard Overview (Coming Soon)</div>} />
          <Route path="centers" element={<ServiceCenters />} />
          <Route path="supply" element={<SupplyChain />} />
          <Route path="inventory" element={<Inventory />} /> {/* NEW ROUTE */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;   