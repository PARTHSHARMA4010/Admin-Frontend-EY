import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Box, Plus, Trash2, Save, Terminal } from 'lucide-react';

const Inventory = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [batchForm, setBatchForm] = useState({ batch_id: '', company_name: 'TOYOTA', vendor_id: '' });
  const [currentPart, setCurrentPart] = useState({ sku: '', name: '', qty: 1000 });
  const [partsList, setPartsList] = useState<any[]>([]);

  useEffect(() => { const load = async () => { try { const res = await api.getAllVendors(); setVendors(res.data); } catch(e){} }; load(); }, []);

  const handleAddPart = () => {
    if(!currentPart.sku || !currentPart.name) return;
    setPartsList([...partsList, { ...currentPart }]);
    setCurrentPart({ sku: '', name: '', qty: 1000 }); 
  };

  const handleSubmit = async () => {
    if(!batchForm.vendor_id || partsList.length === 0) return alert("Incomplete Manifest");
    const selectedVendor = vendors.find(v => v.vendor_id === batchForm.vendor_id);
    const payload = {
      batch_allocation_id: batchForm.batch_id,
      company_name: batchForm.company_name,
      vendor_details: { vendor_id: selectedVendor.vendor_id, name: selectedVendor.name, category: selectedVendor.category, contact: selectedVendor.contact },
      batch_info: { batch_number: batchForm.batch_id, batch_month: new Date().toISOString().slice(0, 7), duration_window: { start: new Date().toISOString().slice(0, 10), end: "2027-01-01" } },
      parts_manifest: partsList.map(p => ({ part_sku: p.sku, part_name: p.name, quantity: parseInt(p.qty as any), failures_logged: 0 }))
    };
    try { await api.addBatch(payload); alert("Success"); setPartsList([]); setBatchForm({...batchForm, batch_id: ''}); } catch { alert("Error"); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-6">
      <div className="flex items-center gap-3 border-b border-app-700 pb-4">
        <div className="p-2 bg-white rounded text-black"><Box size={20} /></div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Inventory Ingestion</h1>
          <p className="text-xs text-app-500 font-mono uppercase">Secure Blockchain Ledger Entry</p>
        </div>
      </div>

      <div className="obsidian-card p-8">
        {/* Header Inputs */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <label className="text-xs text-app-500 font-mono uppercase mb-2 block">Authorized Supplier</label>
            <select className="w-full font-mono text-sm" onChange={e => setBatchForm({...batchForm, vendor_id: e.target.value})}>
              <option value="">-- Select Vendor --</option>
              {vendors.map(v => <option key={v.vendor_id} value={v.vendor_id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-app-500 font-mono uppercase mb-2 block">Batch Reference ID</label>
            <input className="w-full font-mono text-sm" placeholder="BATCH-ID-2026" value={batchForm.batch_id} onChange={e => setBatchForm({...batchForm, batch_id: e.target.value})} />
          </div>
        </div>

        {/* Manifest Builder */}
        <div className="bg-app-950 rounded border border-app-700 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4 text-xs text-white font-mono uppercase tracking-wider">
            <Terminal size={14} /> Part Manifest
          </div>
          
          <div className="flex items-end gap-3 mb-4">
             <input className="flex-1 bg-app-900 border-app-700" placeholder="SKU (e.g. 99-A)" value={currentPart.sku} onChange={e => setCurrentPart({...currentPart, sku: e.target.value})} />
             <input className="flex-[2] bg-app-900 border-app-700" placeholder="Component Name" value={currentPart.name} onChange={e => setCurrentPart({...currentPart, name: e.target.value})} />
             <input className="w-32 bg-app-900 border-app-700" type="number" placeholder="Qty" value={currentPart.qty} onChange={e => setCurrentPart({...currentPart, qty: parseInt(e.target.value)})} />
             <button onClick={handleAddPart} className="bg-white text-black p-2.5 rounded hover:bg-zinc-200 transition-colors"><Plus size={18}/></button>
          </div>

          <div className="space-y-1">
            {partsList.map((part, idx) => (
              <div key={idx} className="flex justify-between items-center bg-app-900 p-2 px-4 rounded border border-app-800 text-sm group hover:border-app-500 transition-all">
                <span className="text-white font-medium">{part.name} <span className="text-app-500 ml-2 font-mono text-xs">{part.sku}</span></span>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-white bg-app-800 px-2 py-0.5 rounded text-xs">{part.qty}</span>
                  <button onClick={() => setPartsList(partsList.filter((_, i) => i !== idx))} className="text-app-500 hover:text-white"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
            {partsList.length === 0 && <div className="text-center text-app-700 py-4 text-xs font-mono uppercase">Manifest Empty</div>}
          </div>
        </div>

        <button onClick={handleSubmit} className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-bold rounded flex justify-center items-center gap-2 transition-all">
          <Save size={18} /> COMMIT TO DATABASE
        </button>
      </div>
    </div>
  );
};

export default Inventory;