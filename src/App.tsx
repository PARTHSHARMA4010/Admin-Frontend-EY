import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ServiceCenters from './pages/ServiceCenters';
import SupplyChain from './pages/SupplyChain';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div className="text-white">Dashboard Placeholder</div>} />
          <Route path="centers" element={<ServiceCenters />} />
          <Route path="supply" element={<SupplyChain />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;