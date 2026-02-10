import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Box, Plus, Trash2, Cpu, Save } from 'lucide-react';

const Inventory = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [batchForm, setBatchForm] = useState({ batch_id: '', company_name: 'TOYOTA', vendor_id: '' });
  const [currentPart, setCurrentPart] = useState({ sku: '', name: '', qty: 1000 });
  const [partsList, setPartsList] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => { try { const res = await api.getAllVendors(); setVendors(res.data); } catch(e){} };
    load();
  }, []);

  const handleAddPart = () => {
    if(!currentPart.sku || !currentPart.name) return;
    setPartsList([...partsList, { ...currentPart }]);
    setCurrentPart({ sku: '', name: '', qty: 1000 }); 
  };

  const handleSubmitBatch = async () => {
    if(!batchForm.vendor_id || partsList.length === 0) return alert("Incomplete Manifest");
    const selectedVendor = vendors.find(v => v.vendor_id === batchForm.vendor_id);

    const payload = {
      batch_allocation_id: batchForm.batch_id,
      company_name: batchForm.company_name,
      vendor_details: {
        vendor_id: selectedVendor.vendor_id,
        name: selectedVendor.name,
        category: selectedVendor.category,
        contact: selectedVendor.contact
      },
      batch_info: {
        batch_number: batchForm.batch_id,
        batch_month: new Date().toISOString().slice(0, 7),
        duration_window: {
          start: new Date().toISOString().slice(0, 10),
          end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10)
        }
      },
      parts_manifest: partsList.map(p => ({
        part_sku: p.sku, part_name: p.name, quantity: parseInt(p.qty as any), failures_logged: 0
      }))
    };

    try { await api.addBatch(payload); alert("Batch Ingested Successfully"); setPartsList([]); setBatchForm({...batchForm, batch_id: ''}); } 
    catch { alert("Error: ID likely exists"); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-white flex items-center gap-3">
        <Box className="text-yellow-500" size={40} /> 
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">Inventory Ingestion</span>
      </h1>

      <div className="glass-panel p-8 rounded-xl border-t-4 border-yellow-500 relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 p-40 bg-yellow-500/5 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Supplier Selection</label>
            <select 
              className="w-full p-4 bg-space-900 border border-white/10 rounded-lg text-white focus:border-yellow-500 outline-none transition-all"
              onChange={e => setBatchForm({...batchForm, vendor_id: e.target.value})}
            >
              <option value="">Select Authorized Vendor...</option>
              {vendors.map(v => <option key={v.vendor_id} value={v.vendor_id}>{v.name} ({v.vendor_id})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Batch Reference ID</label>
            <input 
              placeholder="e.g. 2026-FEB-BATCH-01" 
              className="w-full p-4 bg-space-900 border border-white/10 rounded-lg text-white focus:border-yellow-500 outline-none transition-all" 
              value={batchForm.batch_id} onChange={e => setBatchForm({...batchForm, batch_id: e.target.value})} 
            />
          </div>
        </div>

        {/* Manifest Builder */}
        <div className="bg-space-900/50 p-6 rounded-xl border border-white/5 mb-6">
          <div className="flex items-end gap-3 mb-4">
             <div className="flex-1">
               <label className="text-xs text-gray-500 mb-1 block">Part SKU</label>
               <input className="w-full p-3 bg-space-800 border border-white/10 rounded text-white" value={currentPart.sku} onChange={e => setCurrentPart({...currentPart, sku: e.target.value})} placeholder="X-99" />
             </div>
             <div className="flex-[2]">
               <label className="text-xs text-gray-500 mb-1 block">Component Name</label>
               <input className="w-full p-3 bg-space-800 border border-white/10 rounded text-white" value={currentPart.name} onChange={e => setCurrentPart({...currentPart, name: e.target.value})} placeholder="Brake Pad Ceramic" />
             </div>
             <div className="w-32">
               <label className="text-xs text-gray-500 mb-1 block">Quantity</label>
               <input type="number" className="w-full p-3 bg-space-800 border border-white/10 rounded text-white" value={currentPart.qty} onChange={e => setCurrentPart({...currentPart, qty: parseInt(e.target.value)})} />
             </div>
             <button onClick={handleAddPart} className="p-3 bg-yellow-500 text-black rounded font-bold hover:bg-yellow-400 transition-colors"><Plus /></button>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {partsList.map((part, idx) => (
              <div key={idx} className="flex justify-between items-center bg-space-800 p-3 rounded border-l-2 border-yellow-500/50 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded text-yellow-500"><Cpu size={16}/></div>
                  <div>
                    <div className="text-sm font-bold text-white">{part.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{part.sku}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-mono text-yellow-500">{part.qty}</span>
                  <button onClick={() => setPartsList(partsList.filter((_, i) => i !== idx))} className="text-white/20 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
            {partsList.length === 0 && <div className="text-center text-gray-600 py-4 border-2 border-dashed border-white/5 rounded">Manifest is empty. Add parts above.</div>}
          </div>
        </div>

        <button onClick={handleSubmitBatch} className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold text-lg rounded-lg hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all flex justify-center items-center gap-2">
          <Save size={20} /> CONFIRM UPLOAD TO BLOCKCHAIN
        </button>
      </div>
    </div>
  );
};

export default Inventory;