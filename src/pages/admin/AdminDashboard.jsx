import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ShoppingBag, Cake, UtensilsCrossed, TrendingUp } from 'lucide-react';
import { getData } from '../../utils/storage';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [cakeOrders, setCakeOrders] = useState([]);
  const [menuCount, setMenuCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    (async () => {
      const storedOrders = await getData('makoo_orders') || [];
      setOrders(storedOrders);

      const storedCakes = await getData('makoo_cake_orders') || [];
      setCakeOrders(storedCakes);

      const menu = await getData('makoo_menu_items') || [];
      setMenuCount(menu.length);

      const totalRev = storedOrders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0);
      setRevenue(totalRev);
    })();
  }, []);

  const pendingCakes = cakeOrders.filter(c => c.status === 'Pending').length;

  // Generate last 7 days data for charts
  const getLast7DaysData = () => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(dateStr));
      const dayRevenue = dayOrders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0);

      data.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        orders: dayOrders.length,
        revenue: dayRevenue,
      });
    }
    return data;
  };

  const chartData = getLast7DaysData();

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentCakes = [...cakeOrders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const statusColor = (status) => {
    if (status === 'Processing') return 'bg-blue-600 text-white';
    if (status === 'Confirmed') return 'bg-gold text-navy';
    if (status === 'Delivered') return 'bg-green-700 text-white';
    if (status === 'Cancelled') return 'bg-red-600 text-white';
    return 'bg-navy/70 text-cream';
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 border-l-4 border-gold shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs tracking-widest text-navy/60">TOTAL ORDERS</div>
              <div className="text-4xl font-semibold text-navy mt-1 tabular-nums">{orders.length}</div>
            </div>
            <ShoppingBag className="text-navy/70" size={28} />
          </div>
        </div>

        <div className="bg-white p-6 border-l-4 border-gold shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs tracking-widest text-navy/60">PENDING CAKE REQUESTS</div>
              <div className="text-4xl font-semibold text-navy mt-1 tabular-nums">{pendingCakes}</div>
            </div>
            <Cake className="text-gold" size={28} />
          </div>
        </div>

        <div className="bg-white p-6 border-l-4 border-gold shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs tracking-widest text-navy/60">MENU ITEMS</div>
              <div className="text-4xl font-semibold text-navy mt-1 tabular-nums">{menuCount}</div>
            </div>
            <UtensilsCrossed className="text-navy/70" size={28} />
          </div>
        </div>

        <div className="bg-white p-6 border-l-4 border-green-600 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs tracking-widest text-navy/60">TOTAL REVENUE</div>
              <div className="text-4xl font-semibold text-navy mt-1 tabular-nums">Rs. {revenue.toLocaleString()}</div>
            </div>
            <TrendingUp className="text-green-700" size={28} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders Bar Chart */}
        <div className="bg-white p-6 shadow-sm">
          <div className="font-medium text-navy mb-4 text-sm tracking-widest">ORDERS THIS WEEK</div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="orders" fill="#1B2A5E" radius={1} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Line Chart */}
        <div className="bg-white p-6 shadow-sm">
          <div className="font-medium text-navy mb-4 text-sm tracking-widest">REVENUE TREND (LAST 7 DAYS)</div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2.5} dot={{ fill: '#C9A84C', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b flex justify-between items-center">
            <div className="font-medium text-sm tracking-widest text-navy">RECENT ORDERS</div>
            <Link to="/admin/orders" className="text-xs text-gold hover:underline">VIEW ALL →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-navy/60 bg-navy/5">
                <tr>
                  <th className="text-left px-6 py-2.5 font-normal">ORDER ID</th>
                  <th className="text-left px-3 py-2.5 font-normal">CUSTOMER</th>
                  <th className="text-right px-3 py-2.5 font-normal">TOTAL</th>
                  <th className="text-left px-3 py-2.5 font-normal">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {recentOrders.length > 0 ? recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-navy/5">
                    <td className="px-6 py-3 font-medium text-navy">{order.id}</td>
                    <td className="px-3 py-3 text-navy/80">{order.customerName}</td>
                    <td className="px-3 py-3 text-right font-medium">Rs. {order.total?.toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 text-[10px] rounded-sm ${statusColor(order.status)}`}>{order.status}</span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-navy/50 text-xs">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Cake Requests */}
        <div className="bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b flex justify-between items-center">
            <div className="font-medium text-sm tracking-widest text-navy">RECENT CAKE REQUESTS</div>
            <Link to="/admin/cake-requests" className="text-xs text-gold hover:underline">VIEW ALL →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-navy/60 bg-navy/5">
                <tr>
                  <th className="text-left px-6 py-2.5 font-normal">NAME</th>
                  <th className="text-left px-3 py-2.5 font-normal">OCCASION</th>
                  <th className="text-left px-3 py-2.5 font-normal">SIZE</th>
                  <th className="text-left px-3 py-2.5 font-normal">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {recentCakes.length > 0 ? recentCakes.map(cake => (
                  <tr key={cake.id} className="hover:bg-navy/5">
                    <td className="px-6 py-3 font-medium text-navy">{cake.name}</td>
                    <td className="px-3 py-3 text-navy/80">{cake.occasion}</td>
                    <td className="px-3 py-3">{cake.size}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 text-[10px] rounded-sm ${statusColor(cake.status)}`}>{cake.status}</span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-navy/50 text-xs">No cake requests yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
