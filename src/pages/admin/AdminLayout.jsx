import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, UtensilsCrossed, ShoppingBag, Cake, 
  Image as ImageIcon, Settings, LogOut, Menu, X 
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import MakooLogo from '../../components/MakooLogo';

const SERVER_URL = 'http://localhost:3001';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/health`);
        setServerOnline(res.ok);
      } catch {
        setServerOnline(false);
      }
    };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/menu', label: 'Menu Manager', icon: UtensilsCrossed },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/cake-requests', label: 'Cake Requests', icon: Cake },
    { path: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-cream">
      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-navy-dark text-cream transform transition-transform md:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-cream/10 flex items-center gap-3">
          <MakooLogo size={36} color="#C9A84C" />
          <div>
            <div className="font-display text-lg font-semibold tracking-tight">MAKOO BAKERY</div>
            <div className="text-[10px] text-gold tracking-[1.5px] -mt-0.5">ADMIN PANEL</div>
          </div>
        </div>

        <div className="p-2 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-5 py-[13px] text-sm transition-all mb-0.5 rounded-sm ${isActive(item.path) 
                  ? 'bg-navy/30 text-gold border-l-4 border-gold pl-[17px]' 
                  : 'hover:bg-navy/20 text-cream/90 hover:text-cream'}`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="my-4 border-t border-cream/10 mx-4" />

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-navy/20 transition-all"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>

          <div className="px-5 py-3 border-t border-cream/10 mt-2">
            <div className="flex items-center gap-2 text-xs">
              <span className={`inline-block w-2 h-2 rounded-full ${serverOnline ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-cream/60">Data server: {serverOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-navy/10 flex items-center justify-between px-6 md:pl-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="md:hidden text-navy"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="font-display text-2xl text-navy tracking-tight">
              {navItems.find(i => i.path === location.pathname)?.label || 'Admin'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-navy text-cream text-[11px] px-3 py-1 tracking-widest font-medium">ADMIN</div>
            <button onClick={handleLogout} className="text-xs text-navy flex items-center gap-1.5 hover:text-red-600">
              <LogOut size={15} /> LOGOUT
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
};

export default AdminLayout;
