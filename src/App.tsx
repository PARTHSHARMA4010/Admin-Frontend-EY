import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard'; // <--- IMPORT THE NEW DASHBOARD
import ServiceCenters from './pages/ServiceCenters';
import SupplyChain from './pages/SupplyChain';
import Inventory from './pages/Inventory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* CONNECT THE DASHBOARD HERE */}
          <Route index element={<Dashboard />} /> 
          
          <Route path="centers" element={<ServiceCenters />} />
          <Route path="supply" element={<SupplyChain />} />
          <Route path="inventory" element={<Inventory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;