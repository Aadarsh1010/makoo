import React, { useState, useEffect } from 'react';
import { Eye, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getData, setData } from '../../utils/storage';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const stored = await getData('makoo_orders') || [];
    setOrders(stored);
  };

  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter(o => o.status === statusFilter);

  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const updateStatus = async (orderId, newStatus) => {
    const updated = orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    await setData('makoo_orders', updated);
    setOrders(updated);
    toast.success('Order status updated');
  };

  const exportCSV = () => {
    if (orders.length === 0) {
      toast.error('No orders to export');
      return;
    }
    const headers = ['Order ID', 'Customer', 'Phone', 'Items', 'Total', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.id,
      o.customerName,
      o.phone,
      o.items ? o.items.map(i => `${i.name} x${i.qty}`).join('; ') : '',
      o.total,
      o.status,
      o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(field => `"${field}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `makoo_orders_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  const handleDelete = (orderId) => {
    setDeleteConfirm(orderId);
  };

  const confirmDeleteOrder = async () => {
    if (!deleteConfirm) return;
    const updated = orders.filter(o => o.id !== deleteConfirm);
    await setData('makoo_orders', updated);
    setOrders(updated);
    setDeleteConfirm(null);
    if (selectedOrder && selectedOrder.id === deleteConfirm) setSelectedOrder(null);
    toast.success('Order deleted');
  };

  const statusOptions = ['Processing', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="font-display text-3xl text-navy tracking-tight">Orders</div>
        <div className="flex gap-3">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border px-3 py-1.5 text-sm">
            <option value="All">All Statuses</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={exportCSV} className="px-4 py-1.5 border text-xs uppercase tracking-wider hover:bg-navy hover:text-cream">EXPORT CSV</button>
        </div>
      </div>

      <div className="bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-navy/5 text-xs text-navy/70">
            <tr>
              <th className="text-left px-6 py-3 font-normal">ORDER ID</th>
              <th className="text-left px-4 py-3 font-normal">CUSTOMER</th>
              <th className="text-left px-4 py-3 font-normal">PHONE</th>
              <th className="text-right px-4 py-3 font-normal">ITEMS</th>
              <th className="text-right px-4 py-3 font-normal">TOTAL</th>
              <th className="text-left px-4 py-3 font-normal">STATUS</th>
              <th className="text-left px-4 py-3 font-normal">DATE</th>
              <th className="px-4 py-3 w-32 font-normal text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedOrders.length > 0 ? sortedOrders.map(order => (
              <tr key={order.id} className="hover:bg-navy/5">
                <td className="px-6 py-3 font-semibold text-navy">{order.id}</td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3 text-navy/70">{order.phone}</td>
                <td className="px-4 py-3 text-right">{order.items ? order.items.length : 0}</td>
                <td className="px-4 py-3 text-right font-medium">Rs. {order.total?.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-xs border bg-white px-2 py-1"
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-xs text-navy/70">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                      className="text-navy hover:text-gold transition-colors p-1"
                      title="View order details"
                    >
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleDelete(order.id)} className="p-1 text-red-600 hover:text-red-700" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={8} className="text-center py-16 text-navy/50">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirm && (
        <div className="mt-4 bg-red-50 p-4 text-sm flex gap-4 items-center border border-red-200">
          Delete order <strong>{deleteConfirm}</strong> permanently?
          <button onClick={confirmDeleteOrder} className="px-5 py-1 bg-red-600 text-white text-xs">YES, DELETE</button>
          <button onClick={() => setDeleteConfirm(null)} className="text-xs">CANCEL</button>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-cream max-w-2xl w-full mx-4 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="bg-navy px-8 py-5 flex items-center justify-between">
              <div>
                <p className="font-sans text-gold uppercase tracking-widest text-xs font-medium">Order Details</p>
                <h3 className="font-display italic text-cream text-2xl mt-0.5">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-cream/60 hover:text-cream transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-sans uppercase text-xs tracking-widest text-navy/50">Status</span>
                <span className={`px-3 py-1 text-xs font-sans font-semibold uppercase tracking-wider rounded-full ${
                  selectedOrder.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                  selectedOrder.status === 'Confirmed' ? 'bg-gold/20 text-gold' :
                  selectedOrder.status === 'Out for Delivery' ? 'bg-orange-100 text-orange-600' :
                  selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-600'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="w-full h-px bg-navy/10" />

              <div>
                <h4 className="font-sans font-semibold text-navy uppercase tracking-wider text-xs mb-3 text-gold">
                  Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-sans text-xs text-navy/40 uppercase tracking-wider mb-1">Full Name</p>
                    <p className="font-sans text-navy text-sm font-medium">{selectedOrder.customerName || '—'}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-navy/40 uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="font-sans text-navy text-sm font-medium">{selectedOrder.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-navy/40 uppercase tracking-wider mb-1">Email Address</p>
                    <p className="font-sans text-navy text-sm font-medium">{selectedOrder.email || '—'}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-navy/40 uppercase tracking-wider mb-1">Order Date</p>
                    <p className="font-sans text-navy text-sm font-medium">
                      {selectedOrder.createdAt
                        ? new Date(selectedOrder.createdAt).toLocaleString('en-NP', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-navy/10" />

              <div>
                <h4 className="font-sans font-semibold text-navy uppercase tracking-wider text-xs mb-3 text-gold">
                  Delivery Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="font-sans text-xs text-navy/40 uppercase tracking-wider mb-1">Delivery Address</p>
                    <p className="font-sans text-navy text-sm">{selectedOrder.address || '—'}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-navy/40 uppercase tracking-wider mb-1">City</p>
                    <p className="font-sans text-navy text-sm">{selectedOrder.city || '—'}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-navy/40 uppercase tracking-wider mb-1">Payment Method</p>
                    <p className="font-sans text-navy text-sm">{selectedOrder.paymentMethod || 'Cash on Delivery'}</p>
                  </div>
                  {selectedOrder.notes && (
                    <div className="col-span-2">
                      <p className="font-sans text-xs text-navy/40 uppercase tracking-wider mb-1">Order Notes</p>
                      <p className="font-sans text-navy text-sm italic">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full h-px bg-navy/10" />

              <div>
                <h4 className="font-sans font-semibold text-navy uppercase tracking-wider text-xs mb-3 text-gold">
                  Session Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-sans text-xs text-navy/40 uppercase tracking-wider mb-1">Browser</p>
                    <p className="font-sans text-navy text-sm">{selectedOrder.browser || 'Not recorded'}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-navy/40 uppercase tracking-wider mb-1">Device</p>
                    <p className="font-sans text-navy text-sm">{selectedOrder.device || 'Not recorded'}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-navy/40 uppercase tracking-wider mb-1">IP Address</p>
                    <p className="font-sans text-navy text-sm font-mono">{selectedOrder.ipAddress || 'Not recorded'}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-navy/40 uppercase tracking-wider mb-1">User Agent</p>
                    <p className="font-sans text-navy text-xs break-all">{selectedOrder.userAgent || 'Not recorded'}</p>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-navy/10" />

              <div>
                <h4 className="font-sans font-semibold text-navy uppercase tracking-wider text-xs mb-3 text-gold">
                  Items Ordered
                </h4>
                <div className="space-y-3">
                  {(selectedOrder.items || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-navy/10 last:border-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover flex-shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-sans font-medium text-navy text-sm">{item.name}</p>
                        <p className="font-sans text-xs text-navy/50">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-sans text-xs text-navy/40">x{item.qty}</p>
                        <p className="font-sans font-semibold text-navy text-sm">
                          Rs. {(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-navy/5 p-4 space-y-2">
                <div className="flex justify-between font-sans text-sm text-navy/70">
                  <span>Subtotal</span>
                  <span>Rs. {(selectedOrder.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-sans text-sm text-navy/70">
                  <span>Delivery Fee</span>
                  <span className={selectedOrder.delivery === 0 ? 'text-green-600 font-medium' : ''}>
                    {selectedOrder.delivery === 0 ? 'FREE' : `Rs. ${(selectedOrder.delivery || 150).toLocaleString()}`}
                  </span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between font-sans text-sm text-green-600">
                    <span>Discount Applied</span>
                    <span>- Rs. {selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="h-px bg-navy/20 my-2" />
                <div className="flex justify-between font-display italic text-navy text-xl">
                  <span>Grand Total</span>
                  <span>Rs. {(selectedOrder.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
