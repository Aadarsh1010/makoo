import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { getData, setData } from '../utils/storage';

const OrderPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQty, 
    clearCart, 
    cartTotal 
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [checkoutData, setCheckoutData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lalitpur',
    notes: '',
    paymentMethod: 'COD',
  });
  const [checkoutErrors, setCheckoutErrors] = useState({});

  const deliveryFee = cartTotal >= 1500 ? 0 : 150;
  const discount = cartItems.length >= 3 ? Math.round(cartTotal * 0.05) : 0;
  const grandTotal = cartTotal + deliveryFee - discount;

  const handleQtyChange = (id, newQty) => {
    updateQty(id, newQty);
  };

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;
    setShowCheckout(true);
  };

  const handleCheckoutChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({ ...prev, [name]: value }));
    if (checkoutErrors[name]) {
      setCheckoutErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateCheckout = () => {
    const errs = {};
    if (!checkoutData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!checkoutData.email.trim()) errs.email = 'Email is required';
    if (!checkoutData.phone.trim()) errs.phone = 'Phone number is required';
    if (!checkoutData.address.trim()) errs.address = 'Delivery address is required';
    if (!checkoutData.city.trim()) errs.city = 'City is required';
    setCheckoutErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateCheckout()) return;

    const newOrderId = 'MKB-' + Date.now().toString().slice(-6);

    let ipAddress = 'Unknown';
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        ipAddress = ipData.ip;
      }
    } catch {}

    const order = {
      id: newOrderId,
      customerName: checkoutData.fullName,
      email: checkoutData.email,
      phone: checkoutData.phone,
      address: checkoutData.address,
      city: checkoutData.city,
      notes: checkoutData.notes,
      items: [...cartItems],
      subtotal: cartTotal,
      delivery: deliveryFee,
      discount: discount,
      total: grandTotal,
      paymentMethod: 'COD',
      status: 'Processing',
      createdAt: new Date().toISOString(),
      browser: navigator.userAgent.match(/(Edg|Chrome|Firefox|Safari)\/\d+/)?.[0] || navigator.userAgent,
      device: /Mobile|Android|iPad|iPhone/.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      ipAddress,
      userAgent: navigator.userAgent,
    };

    const existingOrders = await getData('makoo_orders') || [];
    await setData('makoo_orders', [order, ...existingOrders]);

    setOrderId(newOrderId);
    setCustomerPhone(checkoutData.phone);
    setOrderPlaced(true);
    clearCart();
    setShowCheckout(false);

    toast.success('Order placed successfully!');
  };

  // Empty state
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center bg-cream">
        <div className="text-center max-w-xs">
          <div className="mx-auto opacity-30 mb-6">
            {/* Use small logo */}
            <svg width="80" height="80" viewBox="0 0 100 100" className="mx-auto text-navy" fill="currentColor">
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <h2 className="font-display text-4xl text-navy tracking-tight mb-3">Your cart is empty</h2>
          <p className="text-navy/60 mb-8">Start adding fresh bakes from our menu.</p>
          <Link to="/menu" className="inline-block px-8 py-3 bg-navy text-cream text-sm uppercase tracking-[0.08em]">BROWSE MENU</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-[52px] text-navy tracking-[-1px] mb-8">Order Online</h1>

      {orderPlaced ? (
        // Confirmation
        <div className="max-w-lg mx-auto text-center py-10">
          <CheckCircle2 className="mx-auto text-gold mb-5" size={68} />
          <h2 className="font-display text-4xl text-navy tracking-tight mb-2">Order Confirmed!</h2>
          <div className="text-navy/70 mb-6">Thank you for choosing Makoo Bakery.</div>

          <div className="bg-white border border-navy/10 p-6 text-left mb-8">
            <div className="text-xs text-navy/50 tracking-widest mb-1">ORDER ID</div>
            <div className="font-semibold text-2xl text-navy tracking-tight mb-4">{orderId}</div>
            
            <div className="text-sm space-y-1">
              <div>Estimated delivery: <span className="font-medium">2-3 business days</span></div>
              <div>We will contact you at <span className="font-medium">{customerPhone}</span> to confirm.</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link to="/menu" className="px-7 py-2.5 text-sm border border-navy text-navy hover:bg-navy hover:text-cream transition">CONTINUE SHOPPING</Link>
            <Link to="/" className="px-7 py-2.5 text-sm bg-navy text-cream">BACK TO HOME</Link>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-3xl text-navy tracking-tight">Your Cart</h2>
              <div className="text-xs bg-gold text-navy px-3 py-1 font-medium tracking-widest">{cartItems.length} ITEMS</div>
            </div>

            <div className="bg-white border border-navy/10 divide-y">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-5 items-start">
                  <img 
                    src={item.image || '/images/croissant.jpg'} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover flex-shrink-0" 
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div>
                        <span className="text-[10px] text-gold tracking-widest uppercase">{item.category}</span>
                        <div className="font-medium text-navy text-[15px] tracking-tight">{item.name}</div>
                        <div className="text-xs text-muted">Rs. {item.price} each</div>
                      </div>
                      <div className="font-semibold text-navy text-right">Rs. {(item.price * (item.qty || 1)).toLocaleString()}</div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty Stepper */}
                      <div className="flex items-center border border-navy/30 text-sm">
                        <button 
                          onClick={() => handleQtyChange(item.id, (item.qty || 1) - 1)} 
                          className="px-2.5 py-1 hover:bg-navy/5 active:bg-navy/10 text-navy"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 font-medium tabular-nums">{item.qty || 1}</span>
                        <button 
                          onClick={() => handleQtyChange(item.id, (item.qty || 1) + 1)} 
                          className="px-2.5 py-1 hover:bg-navy/5 active:bg-navy/10 text-navy"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-red-600/70 hover:text-red-600 flex items-center gap-1 text-xs uppercase tracking-wider"
                      >
                        <Trash2 size={14} /> REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={clearCart} 
              className="mt-3 text-xs text-red-600 hover:underline tracking-wider"
            >
              CLEAR CART
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-navy/10 p-6 sticky top-24">
              <h3 className="font-semibold uppercase tracking-widest text-sm text-navy mb-5">Order Summary</h3>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-navy/70">Subtotal</span>
                  <span className="font-medium">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy/70">Delivery</span>
                  <span className={deliveryFee === 0 ? "text-green-700 font-medium" : ""}>
                    {deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>5% Multi-item Discount</span>
                    <span>- Rs. {discount}</span>
                  </div>
                )}
                <div className="h-px bg-navy/10 my-1" />
                <div className="flex justify-between text-lg font-semibold text-navy">
                  <span>Total</span>
                  <span className="font-display tracking-tight">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {!showCheckout && (
                <button 
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 bg-navy text-cream text-sm uppercase tracking-[0.08em] font-medium hover:bg-navy-dark"
                >
                  PROCEED TO CHECKOUT
                </button>
              )}

              {/* Inline Checkout Form */}
              <AnimatePresence>
                {showCheckout && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-navy/10 pt-6 mt-4">
                      <h4 className="font-medium text-navy mb-4 text-sm tracking-widest">CHECKOUT DETAILS</h4>
                      
                      <form onSubmit={handlePlaceOrder} className="space-y-4 text-sm">
                        <div>
                          <input name="fullName" value={checkoutData.fullName} onChange={handleCheckoutChange} placeholder="Full Name *" className={`w-full border p-3 ${checkoutErrors.fullName ? 'border-red-400' : 'border-navy/20'}`} />
                          {checkoutErrors.fullName && <p className="text-red-500 text-xs mt-1">{checkoutErrors.fullName}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <input name="email" value={checkoutData.email} onChange={handleCheckoutChange} placeholder="Email *" className={`w-full border p-3 ${checkoutErrors.email ? 'border-red-400' : 'border-navy/20'}`} />
                            {checkoutErrors.email && <p className="text-red-500 text-xs mt-1">{checkoutErrors.email}</p>}
                          </div>
                          <div>
                            <input name="phone" value={checkoutData.phone} onChange={handleCheckoutChange} placeholder="Phone *" className={`w-full border p-3 ${checkoutErrors.phone ? 'border-red-400' : 'border-navy/20'}`} />
                            {checkoutErrors.phone && <p className="text-red-500 text-xs mt-1">{checkoutErrors.phone}</p>}
                          </div>
                        </div>
                        <div>
                          <input name="address" value={checkoutData.address} onChange={handleCheckoutChange} placeholder="Delivery Address *" className={`w-full border p-3 ${checkoutErrors.address ? 'border-red-400' : 'border-navy/20'}`} />
                          {checkoutErrors.address && <p className="text-red-500 text-xs mt-1">{checkoutErrors.address}</p>}
                        </div>
                        <div>
                          <input name="city" value={checkoutData.city} onChange={handleCheckoutChange} placeholder="City *" className={`w-full border p-3 ${checkoutErrors.city ? 'border-red-400' : 'border-navy/20'}`} />
                          {checkoutErrors.city && <p className="text-red-500 text-xs mt-1">{checkoutErrors.city}</p>}
                        </div>
                        <div>
                          <textarea name="notes" value={checkoutData.notes} onChange={handleCheckoutChange} placeholder="Order notes (optional)" rows="2" className="w-full border border-navy/20 p-3 text-sm" />
                        </div>

                        <div className="pt-1">
                          <div className="flex items-center gap-2 text-xs mb-2 text-navy/70">
                            <input type="radio" checked readOnly className="accent-navy" /> 
                            Cash on Delivery (COD) only
                          </div>
                          <button 
                            type="submit" 
                            className="w-full py-3 bg-gold text-navy font-medium uppercase tracking-[0.08em] text-sm hover:bg-gold-light transition"
                          >
                            PLACE ORDER — Rs. {grandTotal.toLocaleString()}
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-xs text-navy/50 mt-4 px-1">
              Free delivery on orders over Rs. 1,500. 5% discount on 3+ items.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
