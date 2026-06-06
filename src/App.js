import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { CartProvider } from './contexts/CartContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CakesPage from './pages/CakesPage';
import OrderPage from './pages/OrderPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenuManager from './pages/admin/AdminMenuManager';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCakeRequests from './pages/admin/AdminCakeRequests';
import AdminGallery from './pages/admin/AdminGallery';
import AdminSettings from './pages/admin/AdminSettings';

// 404
const NotFound = () => (
  <div className="min-h-[70vh] flex items-center justify-center bg-cream">
    <div className="text-center">
      <div className="opacity-40 mb-4">
        <svg width="120" height="120" viewBox="0 0 100 100" className="mx-auto" fill="#1B2A5E">
          {/* Simple logo like for 404 */}
          <circle cx="50" cy="50" r="46" stroke="#1B2A5E" strokeWidth="2" fill="none" />
          <text x="50" y="58" textAnchor="middle" className="font-display text-[42px] fill-navy">404</text>
        </svg>
      </div>
      <h1 className="font-display text-[120px] leading-none font-light text-gold tracking-[-4px]">404</h1>
      <p className="text-2xl text-navy -mt-4 mb-8 tracking-tight">Page Not Found</p>
      <a href="/" className="inline-block px-8 py-3 bg-navy text-cream text-sm font-medium uppercase tracking-[0.08em] hover:bg-navy-dark transition-colors">
        RETURN TO HOMEPAGE
      </a>
    </div>
  </div>
);

function App() {
  // Seed initial demo data on first load (client side)
  React.useEffect(() => {
    // Seed some sample orders if empty
    if (!localStorage.getItem('makoo_orders')) {
      const sampleOrders = [
        {
          id: "MKB-982341",
          customerName: "Aarav Sharma",
          email: "aarav@example.com",
          phone: "9841555123",
          address: "House 45, Patan Dhoka",
          city: "Lalitpur",
          notes: "Please deliver before 5pm",
          items: [{id:1, name:"Butter Croissant", qty:4, price:120, category:"Pastries"}],
          subtotal: 480,
          delivery: 150,
          discount: 0,
          total: 630,
          paymentMethod: "COD",
          status: "Processing",
          createdAt: new Date(Date.now() - 1000*3600*2).toISOString()
        },
        {
          id: "MKB-982299",
          customerName: "Priya Thapa",
          email: "priya.t@example.com",
          phone: "9801122334",
          address: "Sanepa, Lalitpur",
          city: "Lalitpur",
          notes: "",
          items: [{id:2, name:"Chocolate Snap Cake", qty:1, price:850, category:"Cakes"}, {id:9, name:"Artisan Sourdough Bread", qty:1, price:280, category:"Breads"}],
          subtotal: 1130,
          delivery: 150,
          discount: 0,
          total: 1280,
          paymentMethod: "COD",
          status: "Confirmed",
          createdAt: new Date(Date.now() - 1000*3600*26).toISOString()
        }
      ];
      localStorage.setItem('makoo_orders', JSON.stringify(sampleOrders));
    }

    // Seed cake requests
    if (!localStorage.getItem('makoo_cake_orders')) {
      const sampleCakes = [
        { id: "CAKE-441122", name: "Sanjay KC", phone: "9841777888", email: "sanjay@family.com", occasion: "Wedding", flavor: "Vanilla", size: "2 Pounds", date: "2026-06-20", design: "Three tier with roses and gold accents", notes: "Delivery to hotel", status: "Pending", createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: "CAKE-441089", name: "Meera Rai", phone: "9803344556", email: "", occasion: "Birthday", flavor: "Chocolate", size: "1 Pound", date: "2026-06-12", design: "Simple with name on top", notes: "", status: "Confirmed", createdAt: new Date(Date.now() - 172800000).toISOString() }
      ];
      localStorage.setItem('makoo_cake_orders', JSON.stringify(sampleCakes));
    }
  }, []);

  return (
    <Router>
      <CartProvider>
        <AdminAuthProvider>
          <div className="min-h-screen flex flex-col bg-cream font-sans">
            <Navbar />
            
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cakes" element={<CakesPage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/gallery" element={<GalleryPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AdminLayout><AdminDashboard /></AdminLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/menu" 
                  element={
                    <ProtectedRoute>
                      <AdminLayout><AdminMenuManager /></AdminLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/orders" 
                  element={
                    <ProtectedRoute>
                      <AdminLayout><AdminOrders /></AdminLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/cake-requests" 
                  element={
                    <ProtectedRoute>
                      <AdminLayout><AdminCakeRequests /></AdminLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/gallery" 
                  element={
                    <ProtectedRoute>
                      <AdminLayout><AdminGallery /></AdminLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <ProtectedRoute>
                      <AdminLayout><AdminSettings /></AdminLayout>
                    </ProtectedRoute>
                  } 
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
          </div>

          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#FEFCF8',
                color: '#1B2A5E',
                border: '1px solid #E8DFD0',
                borderRadius: 0,
                fontFamily: 'Jost, sans-serif',
                fontSize: '14px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#2D7A4F',
                  secondary: '#FEFCF8',
                },
              },
            }}
          />
        </AdminAuthProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
