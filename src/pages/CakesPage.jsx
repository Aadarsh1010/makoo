import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getData, setData } from '../utils/storage';

const CakesPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    occasion: 'Wedding',
    flavor: 'Chocolate',
    size: '1 Pound',
    date: '',
    design: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const cakeGallery = [
    { id: 1, name: "Classic White Wedding", image: "/images/wedding-cake-hero.jpg", category: "Wedding" },
    { id: 2, name: "Floral Three-Tier", image: "/images/wedding-cake-hero.jpg", category: "Wedding" },
    { id: 3, name: "Blush Birthday Cake", image: "/images/red-velvet.jpg", category: "Birthday" },
    { id: 4, name: "Fruit Celebration", image: "/images/cream-pastries.jpg", category: "Birthday" },
    { id: 5, name: "Anniversary Elegance", image: "/images/chocolate-cake.jpg", category: "Anniversary" },
    { id: 6, name: "Custom Floral Design", image: "/images/wedding-cake-hero.jpg", category: "Wedding" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.date) newErrors.date = 'Pickup date is required';
    
    // Check date is at least 3 days in future
    if (formData.date) {
      const selected = new Date(formData.date);
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 3);
      if (selected < minDate) {
        newErrors.date = 'Cakes require at least 3 days advance notice';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newOrder = {
      id: 'CAKE-' + Date.now().toString().slice(-6),
      ...formData,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const existing = await getData('makoo_cake_orders') || [];
    await setData('makoo_cake_orders', [...existing, newOrder]);

    setSubmitted(true);
    toast.success("Your cake request has been received!");

    // Reset form after success message shown for a bit
    setTimeout(() => {
      setFormData({
        name: '', phone: '', email: '', occasion: 'Wedding', flavor: 'Chocolate',
        size: '1 Pound', date: '', design: '', notes: ''
      });
      setSubmitted(false);
      setErrors({});
    }, 4500);
  };

  // Get min date for input (3 days from now)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-navy-dark py-16 relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url('/images/wedding-cake-hero.jpg')` }} />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h1 className="font-display text-[72px] leading-none text-cream tracking-[-1.5px]">Custom Cakes &amp; Wedding Cakes</h1>
          <div className="text-gold text-xs tracking-[0.15em] mt-4">HOME / CAKES</div>
        </div>
      </div>

      {/* Intro Section */}
      <section className="bg-cream py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-x-16 gap-y-10 items-center">
          <div>
            <img src="/images/wedding-cake-hero.jpg" alt="Wedding Cake" className="border border-navy/10 w-full" />
          </div>
          <div>
            <div className="text-gold tracking-[0.15em] text-xs font-medium mb-3">WEDDING CAKE SPECIALISTS</div>
            <h2 className="font-display text-[42px] leading-tight text-navy mb-6 tracking-[-0.5px]">Lalitpur's Most Trusted<br />Cake Destination Since 1988</h2>
            
            <p className="text-navy/70 mb-8">Every cake is handcrafted to match your vision. From intimate celebrations to grand weddings, we bring your dream to life.</p>

            <div className="space-y-3 mb-8 text-sm">
              <div className="flex gap-3"><span className="text-gold font-bold">1.</span> <span>Choose your design — browse our gallery or share your own reference</span></div>
              <div className="flex gap-3"><span className="text-gold font-bold">2.</span> <span>Contact us — call 01-5424285 or Viber 9841224345</span></div>
              <div className="flex gap-3"><span className="text-gold font-bold">3.</span> <span>Confirm your order — size, flavor, design, delivery date</span></div>
              <div className="flex gap-3"><span className="text-gold font-bold">4.</span> <span>Pickup or delivery — collect from Jawalakhel or arrange delivery</span></div>
            </div>

            <Link to="#request-form" className="inline-block bg-navy text-cream px-8 py-3 text-sm uppercase tracking-[0.08em]">REQUEST A CUSTOM CAKE</Link>
          </div>
        </div>
      </section>

      {/* Cake Gallery */}
      <section className="py-14 bg-warm-white border-y border-navy/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="text-gold text-xs tracking-widest">GALLERY</div>
              <h3 className="font-display text-4xl text-navy tracking-tight">Signature Cake Designs</h3>
            </div>
            <Link to="/gallery" className="text-sm text-gold">VIEW FULL GALLERY →</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {cakeGallery.map((cake) => (
              <div key={cake.id} className="group relative aspect-square overflow-hidden bg-navy/5">
                <img src={cake.image} alt={cake.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70 flex items-end p-4 opacity-0 group-hover:opacity-100 transition">
                  <div>
                    <div className="text-cream text-sm font-medium tracking-tight">{cake.name}</div>
                    <div className="text-gold text-xs">{cake.category}</div>
                  </div>
                </div>
                <Link to="/contact" className="absolute bottom-4 right-4 text-xs bg-gold text-navy px-3 py-1 opacity-0 group-hover:opacity-100 transition">ENQUIRE</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Size & Price Guide */}
      <section className="py-16 bg-navy-dark">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="font-display text-4xl text-center text-cream mb-8 tracking-tight">Cake Size &amp; Price Guide</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-cream">
              <thead>
                <tr className="border-b border-cream/30 text-left text-gold text-xs tracking-widest">
                  <th className="pb-3 pr-4">SIZE</th>
                  <th className="pb-3 pr-4">APPROX. WEIGHT</th>
                  <th className="pb-3">STARTING PRICE</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-cream/10">
                <tr><td className="py-3 pr-4">Quarter Pound</td><td className="py-3 pr-4">~100g</td><td className="py-3">Rs. 400</td></tr>
                <tr><td className="py-3 pr-4">Half Pound</td><td className="py-3 pr-4">~225g</td><td className="py-3">Rs. 700</td></tr>
                <tr><td className="py-3 pr-4">1 Pound</td><td className="py-3 pr-4">~450g</td><td className="py-3">Rs. 850 – 1,000</td></tr>
                <tr><td className="py-3 pr-4">2 Pounds</td><td className="py-3 pr-4">~900g</td><td className="py-3">Rs. 1,600 – 2,000</td></tr>
                <tr><td className="py-3 pr-4 font-medium">Custom / Wedding</td><td className="py-3 pr-4">On Request</td><td className="py-3 text-gold">Contact Us</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-cream/60 text-xs italic mt-5">Prices may vary based on design complexity, flavors, and decoration. Contact us for an exact quote.</p>
        </div>
      </section>

      {/* Ordering Form */}
      <section id="request-form" className="py-16 bg-cream">
        <div className="max-w-xl mx-auto px-6">
          <div className="bg-white shadow-xl p-8 md:p-10">
            <h3 className="font-display text-3xl text-navy tracking-tight mb-1 text-center">Request a Custom Cake</h3>
            <p className="text-center text-sm text-navy/60 mb-8">We will contact you within 24 hours to confirm</p>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="mx-auto text-gold mb-4" size={56} />
                <h4 className="text-2xl text-navy tracking-tight mb-2">Request Received!</h4>
                <p className="text-navy/70">Thank you. We will contact you within 24 hours to confirm your order.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-navy font-medium tracking-widest mb-1.5">FULL NAME *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full border p-3 text-sm ${errors.name ? 'border-red-500' : 'border-navy/20'}`} required />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-navy font-medium tracking-widest mb-1.5">PHONE NUMBER *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full border p-3 text-sm ${errors.phone ? 'border-red-500' : 'border-navy/20'}`} required />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-navy font-medium tracking-widest mb-1.5">EMAIL ADDRESS</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-navy/20 p-3 text-sm" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-navy font-medium tracking-widest mb-1.5">OCCASION</label>
                    <select name="occasion" value={formData.occasion} onChange={handleChange} className="w-full border border-navy/20 p-3 text-sm bg-white">
                      <option>Wedding</option>
                      <option>Birthday</option>
                      <option>Anniversary</option>
                      <option>Baby Shower</option>
                      <option>Corporate Event</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-navy font-medium tracking-widest mb-1.5">CAKE FLAVOR</label>
                    <select name="flavor" value={formData.flavor} onChange={handleChange} className="w-full border border-navy/20 p-3 text-sm bg-white">
                      <option>Chocolate</option>
                      <option>Vanilla</option>
                      <option>Strawberry</option>
                      <option>Red Velvet</option>
                      <option>Fruit</option>
                      <option>White Forest</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-navy font-medium tracking-widest mb-1.5">APPROXIMATE SIZE</label>
                    <select name="size" value={formData.size} onChange={handleChange} className="w-full border border-navy/20 p-3 text-sm bg-white">
                      <option>Half Pound</option>
                      <option>1 Pound</option>
                      <option>2 Pounds</option>
                      <option>3+ Pounds / Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-navy font-medium tracking-widest mb-1.5">PICKUP / DELIVERY DATE *</label>
                    <input 
                      type="date" 
                      name="date" 
                      value={formData.date} 
                      onChange={handleChange} 
                      min={getMinDate()}
                      className={`w-full border p-3 text-sm ${errors.date ? 'border-red-500' : 'border-navy/20'}`} 
                      required 
                    />
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-navy font-medium tracking-widest mb-1.5">DESIGN REFERENCE</label>
                  <textarea 
                    name="design" 
                    value={formData.design} 
                    onChange={handleChange} 
                    rows="3" 
                    placeholder="Describe your vision or paste image reference URL..." 
                    className="w-full border border-navy/20 p-3 text-sm resize-y" 
                  />
                </div>

                <div>
                  <label className="block text-xs text-navy font-medium tracking-widest mb-1.5">SPECIAL INSTRUCTIONS (OPTIONAL)</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" className="w-full border border-navy/20 p-3 text-sm" />
                </div>

                <button 
                  type="submit" 
                  className="w-full mt-2 py-3.5 bg-navy text-cream text-sm uppercase tracking-[0.08em] font-medium hover:bg-navy-dark transition"
                >
                  SUBMIT REQUEST
                </button>
                <p className="text-center text-[10px] text-navy/50 mt-1">We respond within 24 hours • Pre-orders required for custom cakes</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CakesPage;
