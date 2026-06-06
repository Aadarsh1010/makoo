import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { getData, setData } from '../utils/storage';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: 'General Enquiry', message: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newMessage = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    const existing = await getData('makoo_messages') || [];
    await setData('makoo_messages', [...existing, newMessage]);

    toast.success("Message sent successfully! We will reply within 24 hours.");

    setFormData({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' });
    setErrors({});
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-navy-dark py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="font-display text-[72px] text-cream tracking-[-1.5px]">Get in Touch</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12">
        {/* Left: Contact Info */}
        <div className="bg-navy-dark p-9 text-cream">
          <h2 className="font-display text-3xl tracking-tight mb-8">We Love to Hear From You</h2>

          <div className="space-y-7 text-sm">
            <div className="flex gap-4">
              <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-gold text-[10px] tracking-widest mb-0.5">MAIN STORE</div>
                <div>Makoo Road, Jawalakhel, Lalitpur 44600, Nepal</div>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-gold text-[10px] tracking-widest mb-0.5">TALCHIKHEL BRANCH</div>
                <div>M85C+J6W, Talchikhel, Lalitpur</div>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-gold text-[10px] tracking-widest mb-0.5">PHONE</div>
                <a href="tel:015424285" className="hover:text-gold">01-5424285</a> | <a href="tel:015422997" className="hover:text-gold">01-5422997</a>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-gold text-[10px] tracking-widest mb-0.5">VIBER / WHATSAPP</div>
                <a href="https://wa.me/9779841224345" className="hover:text-gold">9841224345</a>
              </div>
            </div>

            <div className="flex gap-4">
              <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-gold text-[10px] tracking-widest mb-0.5">EMAIL</div>
                <a href="mailto:makoobakery@gmail.com" className="hover:text-gold">makoobakery@gmail.com</a>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-gold text-[10px] tracking-widest mb-0.5">HOURS</div>
                Monday to Sunday, 8:00 AM – 8:00 PM
              </div>
            </div>
          </div>

          <div className="mt-9 pt-8 border-t border-cream/20 text-xs space-y-1 text-cream/70">
            <div>Facebook: <a href="https://facebook.com/MakooBakery" className="text-gold hover:underline">facebook.com/MakooBakery</a> (18.7K followers)</div>
            <div>Instagram: <a href="https://instagram.com/makoobakery" className="text-gold hover:underline">@makoobakery</a> (1.6K followers)</div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-white shadow p-8">
          <h3 className="font-display text-[32px] text-navy tracking-tight mb-6">Send Us a Message</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-navy font-medium tracking-widest block mb-1">FULL NAME</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full p-3 border text-sm ${errors.name ? 'border-red-500' : 'border-navy/20'}`} />
                {errors.name && <div className="text-xs text-red-500 mt-0.5">{errors.name}</div>}
              </div>
              <div>
                <label className="text-xs text-navy font-medium tracking-widest block mb-1">EMAIL</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full p-3 border text-sm ${errors.email ? 'border-red-500' : 'border-navy/20'}`} />
                {errors.email && <div className="text-xs text-red-500 mt-0.5">{errors.email}</div>}
              </div>
            </div>

            <div>
              <label className="text-xs text-navy font-medium tracking-widest block mb-1">PHONE NUMBER</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full p-3 border text-sm ${errors.phone ? 'border-red-500' : 'border-navy/20'}`} />
              {errors.phone && <div className="text-xs text-red-500 mt-0.5">{errors.phone}</div>}
            </div>

            <div>
              <label className="text-xs text-navy font-medium tracking-widest block mb-1">SUBJECT</label>
              <select name="subject" value={formData.subject} onChange={handleChange} className="w-full p-3 border border-navy/20 text-sm bg-white">
                <option>General Enquiry</option>
                <option>Cake Order</option>
                <option>Wedding Cake</option>
                <option>Feedback</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-navy font-medium tracking-widest block mb-1">MESSAGE</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows="5" className={`w-full p-3 border text-sm ${errors.message ? 'border-red-500' : 'border-navy/20'}`} required />
              {errors.message && <div className="text-xs text-red-500 mt-0.5">{errors.message}</div>}
            </div>

            <button type="submit" className="w-full py-3 bg-navy text-cream uppercase text-sm tracking-[0.08em] font-medium hover:bg-navy-dark">SEND MESSAGE</button>
          </form>
        </div>
      </div>

      {/* Map */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="border border-navy/10 p-2">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.5!2d85.32!3d27.67!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQwJzEyLjAiTiA4NcKwMTknMTIuMCJF!5e0!3m2!1sen!2snp!4v1620000000000" 
            width="100%" 
            height="380" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            title="Makoo Bakery Location - Jawalakhel, Lalitpur"
          />
        </div>
        <p className="text-xs text-center text-navy/50 mt-2">Makoo Road, Jawalakhel, Lalitpur, Nepal</p>
      </div>
    </div>
  );
};

export default ContactPage;
