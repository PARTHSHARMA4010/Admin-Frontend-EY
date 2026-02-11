import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview'; // <--- Import the new Visual Page
import ServiceCenters from './pages/ServiceCenters';
import SupplyChain from './pages/SupplyChain';
import Inventory from './pages/Inventory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} /> {/* <--- USE OVERVIEW HERE */}
          <Route path="centers" element={<ServiceCenters />} />
          <Route path="supply" element={<SupplyChain />} />
          <Route path="inventory" element={<Inventory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;