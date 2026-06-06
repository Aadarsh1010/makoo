import React, { useState, useEffect } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getData, setData } from '../../utils/storage';

const AdminCakeRequests = () => {
  const [cakeOrders, setCakeOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    (async () => {
      const stored = await getData('makoo_cake_orders') || [];
      setCakeOrders(stored);
    })();
  }, []);

  const filtered = statusFilter === 'All' ? cakeOrders : cakeOrders.filter(c => c.status === statusFilter);
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const updateStatus = async (id, newStatus) => {
    const updated = cakeOrders.map(c => c.id === id ? { ...c, status: newStatus } : c);
    await setData('makoo_cake_orders', updated);
    setCakeOrders(updated);
    toast.success('Status updated');
  };

  const exportCSV = () => {
    if (cakeOrders.length === 0) return toast.error('No requests');
    const headers = ['ID','Name','Phone','Email','Occasion','Flavor','Size','Date','Status'];
    const rows = cakeOrders.map(c => [
      c.id, c.name, c.phone, c.email || '', c.occasion, c.flavor, c.size, c.date, c.status
    ]);
    const csv = [headers, ...rows].map(r => r.map(f => `"${f}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], {type:'text/csv'}));
    const a = document.createElement('a'); a.href=url; a.download='makoo_cake_requests.csv'; a.click();
  };

  const handleDelete = (id) => setDeleteConfirm(id);

  const confirmDelete = async () => {
    const updated = cakeOrders.filter(c => c.id !== deleteConfirm);
    await setData('makoo_cake_orders', updated);
    setCakeOrders(updated);
    setDeleteConfirm(null);
    if (selected && selected.id === deleteConfirm) setSelected(null);
    toast.success('Request deleted');
  };

  const statusOptions = ['Pending', 'Confirmed', 'In Progress', 'Ready', 'Cancelled'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="font-display text-3xl text-navy tracking-tight">Cake Requests</div>
        <div className="flex gap-3">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="border px-3 py-1.5 text-sm">
            <option>All</option>
            {statusOptions.map(s=><option key={s}>{s}</option>)}
          </select>
          <button onClick={exportCSV} className="px-4 py-1.5 border text-xs uppercase tracking-wider">EXPORT CSV</button>
        </div>
      </div>

      <div className="bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[1000px]">
          <thead className="bg-navy/5 text-xs text-navy/70">
            <tr>
              <th className="px-5 py-3 text-left font-normal">ID</th>
              <th className="px-4 py-3 text-left font-normal">NAME</th>
              <th className="px-4 py-3 text-left font-normal">PHONE</th>
              <th className="px-4 py-3 text-left font-normal">OCCASION</th>
              <th className="px-4 py-3 text-left font-normal">FLAVOR</th>
              <th className="px-4 py-3 text-left font-normal">SIZE</th>
              <th className="px-4 py-3 text-left font-normal">DATE</th>
              <th className="px-4 py-3 text-left font-normal">STATUS</th>
              <th className="px-4 py-3 w-20 text-right font-normal">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sorted.length > 0 ? sorted.map(req => (
              <tr key={req.id} className="hover:bg-navy/5">
                <td className="px-5 py-3 font-medium text-navy">{req.id}</td>
                <td className="px-4 py-3">{req.name}</td>
                <td className="px-4 py-3 text-navy/70">{req.phone}</td>
                <td className="px-4 py-3">{req.occasion}</td>
                <td className="px-4 py-3">{req.flavor}</td>
                <td className="px-4 py-3">{req.size}</td>
                <td className="px-4 py-3 text-xs">{req.date}</td>
                <td className="px-4 py-3">
                  <select value={req.status} onChange={e => updateStatus(req.id, e.target.value)} className="text-xs border px-2 py-0.5 bg-white">
                    {statusOptions.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setSelected(req)} className="p-1 text-navy hover:text-gold"><Eye size={15}/></button>
                  <button onClick={() => handleDelete(req.id)} className="p-1 ml-1 text-red-600"><Trash2 size={15}/></button>
                </td>
              </tr>
            )) : <tr><td colSpan="9" className="py-16 text-center text-navy/50">No cake requests yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {deleteConfirm && (
        <div className="mt-4 bg-red-50 p-4 flex gap-3 text-sm border border-red-200 items-center">
          Delete this cake request permanently? 
          <button onClick={confirmDelete} className="px-4 py-1 bg-red-600 text-white text-xs">DELETE</button>
          <button onClick={() => setDeleteConfirm(null)}>CANCEL</button>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-lg p-8" onClick={e=>e.stopPropagation()}>
            <h3 className="font-display text-2xl mb-1">{selected.name}</h3>
            <div className="text-sm text-navy/60 mb-5">{selected.id} • {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ''}</div>

            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div><span className="text-xs text-navy/50 block">PHONE</span>{selected.phone}</div>
              <div><span className="text-xs text-navy/50 block">EMAIL</span>{selected.email || '-'}</div>
              <div><span className="text-xs text-navy/50 block">OCCASION</span>{selected.occasion}</div>
              <div><span className="text-xs text-navy/50 block">FLAVOR</span>{selected.flavor}</div>
              <div><span className="text-xs text-navy/50 block">SIZE</span>{selected.size}</div>
              <div><span className="text-xs text-navy/50 block">PICKUP DATE</span>{selected.date}</div>
            </div>

            {selected.design && <div className="mt-4"><span className="text-xs text-navy/50 block">DESIGN REFERENCE</span><div className="text-sm bg-navy/5 p-3 mt-1">{selected.design}</div></div>}
            {selected.notes && <div className="mt-3"><span className="text-xs text-navy/50 block">NOTES</span>{selected.notes}</div>}

            <div className="mt-6 pt-4 border-t flex items-center gap-3">
              <span className="text-xs text-navy/50">STATUS:</span>
              <select value={selected.status} onChange={e => { updateStatus(selected.id, e.target.value); setSelected({...selected, status: e.target.value}); }} className="border px-3 py-1 text-sm">
                {statusOptions.map(s => <option key={s}>{s}</option>)}
              </select>
              <button onClick={() => setSelected(null)} className="ml-auto text-xs px-4 py-1 border">CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCakeRequests;
