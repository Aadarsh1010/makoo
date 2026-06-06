import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getData, setData } from '../../utils/storage';

const AdminSettings = () => {
  const [homepageConfig, setHomepageConfig] = useState({
    badge: "ESTABLISHED 1988 | JAWALAKHEL, LALITPUR",
    heading1: "Baked With Love,",
    heading2: "Crafted With Heritage.",
    subtext: "Family-run since 1988, Makoo Bakery brings you Nepal's finest custom wedding cakes, fresh-baked pastries, and handcrafted breads every single day.",
    heroImage: "/images/wedding-cake-hero.jpg",
    stats: [
      { value: "35+", label: "Years Of Heritage" },
      { value: "18K+", label: "Happy Customers" },
      { value: "2", label: "Locations" }
    ]
  });

  const [contactConfig, setContactConfig] = useState({
    phone1: "01-5424285",
    phone2: "01-5422997",
    viber: "9841224345",
    email: "makoobakery@gmail.com",
    address1: "Makoo Road, Jawalakhel, Lalitpur 44600",
    address2: "Talchikhel Branch, Lalitpur",
    hours: "Open Daily 8:00 AM – 8:00 PM",
  });

  const [tickerText, setTickerText] = useState("FREE DELIVERY ON FIRST ORDER | CUSTOM WEDDING CAKES ON REQUEST | CALL 01-5424285 TO ORDER | FRESH BAKES DAILY | CELEBRATING 35+ YEARS");

  // Load from shared storage
  useEffect(() => {
    (async () => {
      const hp = await getData('makoo_homepage_config');
      if (hp) setHomepageConfig(hp);

      const cc = await getData('makoo_contact_config');
      if (cc) setContactConfig(cc);

      const tk = await getData('makoo_ticker');
      if (tk) setTickerText(tk);
    })();
  }, []);

  const saveHomepage = async () => {
    await setData('makoo_homepage_config', homepageConfig);
    toast.success('Homepage settings saved', { icon: '✓' });
  };

  const saveContact = async () => {
    await setData('makoo_contact_config', contactConfig);
    toast.success('Contact info saved', { icon: '✓' });
  };

  const saveTicker = async () => {
    await setData('makoo_ticker', tickerText);
    toast.success('Announcement ticker saved', { icon: '✓' });
  };

  const updateStat = (index, key, value) => {
    const newStats = [...homepageConfig.stats];
    newStats[index][key] = value;
    setHomepageConfig({ ...homepageConfig, stats: newStats });
  };

  return (
    <div className="max-w-4xl space-y-10">
      {/* Hero Editor */}
      <div className="bg-white p-8 shadow-sm">
        <div className="font-medium text-lg tracking-tight mb-1 text-navy">Hero Content Editor</div>
        <p className="text-xs text-navy/50 mb-6">Updates the homepage hero section in real time</p>

        <div className="space-y-5">
          <div>
            <label className="text-xs tracking-widest text-navy font-medium block mb-1">BADGE TEXT</label>
            <input value={homepageConfig.badge} onChange={e => setHomepageConfig({...homepageConfig, badge: e.target.value})} className="w-full border p-3 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs tracking-widest text-navy font-medium block mb-1">HEADING LINE 1</label>
              <input value={homepageConfig.heading1} onChange={e => setHomepageConfig({...homepageConfig, heading1: e.target.value})} className="w-full border p-3 text-sm" />
            </div>
            <div>
              <label className="text-xs tracking-widest text-navy font-medium block mb-1">HEADING LINE 2 (ITALIC)</label>
              <input value={homepageConfig.heading2} onChange={e => setHomepageConfig({...homepageConfig, heading2: e.target.value})} className="w-full border p-3 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-xs tracking-widest text-navy font-medium block mb-1">SUBTEXT</label>
            <textarea value={homepageConfig.subtext} onChange={e => setHomepageConfig({...homepageConfig, subtext: e.target.value})} rows="3" className="w-full border p-3 text-sm" />
          </div>

          <div>
            <label className="text-xs tracking-widest text-navy font-medium block mb-1">HERO IMAGE URL</label>
            <input value={homepageConfig.heroImage} onChange={e => setHomepageConfig({...homepageConfig, heroImage: e.target.value})} className="w-full border p-3 text-sm" />
            {homepageConfig.heroImage && <img src={homepageConfig.heroImage} alt="Hero preview" className="mt-2 h-32 object-cover border" />}
          </div>

          <div>
            <label className="text-xs tracking-widest text-navy font-medium block mb-2">STATS (3)</label>
            <div className="grid grid-cols-3 gap-3">
              {homepageConfig.stats.map((stat, i) => (
                <div key={i} className="border p-3">
                  <input value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} className="font-semibold w-full text-lg" />
                  <input value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} className="text-xs w-full mt-1 text-navy/60" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button onClick={saveHomepage} className="mt-6 px-8 py-2 bg-navy text-cream text-xs uppercase tracking-[0.08em]">SAVE HOMEPAGE CHANGES</button>
      </div>

      {/* Contact Editor */}
      <div className="bg-white p-8 shadow-sm">
        <div className="font-medium text-lg tracking-tight mb-1 text-navy">Contact Info Editor</div>
        <p className="text-xs text-navy/50 mb-6">Updates the contact page and footer</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 text-sm">
          <div>
            <label className="text-xs tracking-widest block mb-1 text-navy font-medium">PHONE 1</label>
            <input value={contactConfig.phone1} onChange={e=>setContactConfig({...contactConfig, phone1: e.target.value})} className="border p-2.5 w-full" />
          </div>
          <div>
            <label className="text-xs tracking-widest block mb-1 text-navy font-medium">PHONE 2</label>
            <input value={contactConfig.phone2} onChange={e=>setContactConfig({...contactConfig, phone2: e.target.value})} className="border p-2.5 w-full" />
          </div>
          <div>
            <label className="text-xs tracking-widest block mb-1 text-navy font-medium">VIBER / WHATSAPP</label>
            <input value={contactConfig.viber} onChange={e=>setContactConfig({...contactConfig, viber: e.target.value})} className="border p-2.5 w-full" />
          </div>
          <div>
            <label className="text-xs tracking-widest block mb-1 text-navy font-medium">EMAIL</label>
            <input value={contactConfig.email} onChange={e=>setContactConfig({...contactConfig, email: e.target.value})} className="border p-2.5 w-full" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs tracking-widest block mb-1 text-navy font-medium">MAIN ADDRESS</label>
            <input value={contactConfig.address1} onChange={e=>setContactConfig({...contactConfig, address1: e.target.value})} className="border p-2.5 w-full" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs tracking-widest block mb-1 text-navy font-medium">SECOND BRANCH</label>
            <input value={contactConfig.address2} onChange={e=>setContactConfig({...contactConfig, address2: e.target.value})} className="border p-2.5 w-full" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs tracking-widest block mb-1 text-navy font-medium">HOURS</label>
            <input value={contactConfig.hours} onChange={e=>setContactConfig({...contactConfig, hours: e.target.value})} className="border p-2.5 w-full" />
          </div>
        </div>

        <button onClick={saveContact} className="mt-6 px-8 py-2 bg-navy text-cream text-xs uppercase tracking-[0.08em]">SAVE CONTACT INFO</button>
      </div>

      {/* Ticker */}
      <div className="bg-white p-8 shadow-sm">
        <div className="font-medium text-lg tracking-tight mb-1 text-navy">Announcement Ticker</div>
        <p className="text-xs text-navy/50 mb-4">Scrolling text on homepage</p>

        <textarea 
          value={tickerText} 
          onChange={e => setTickerText(e.target.value)} 
          rows="2" 
          className="w-full border p-3 text-sm font-medium tracking-wider" 
        />

        <button onClick={saveTicker} className="mt-4 px-8 py-2 bg-navy text-cream text-xs uppercase tracking-[0.08em]">SAVE TICKER TEXT</button>
      </div>
    </div>
  );
};

export default AdminSettings;
