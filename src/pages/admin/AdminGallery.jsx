import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getData, setData } from '../../utils/storage';

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState({ url: '', title: '', category: 'Wedding Cakes' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imageError, setImageError] = useState(false);

  const categories = ["Wedding Cakes", "Birthday Cakes", "Pastries", "Breads", "Savory"];

  useEffect(() => {
    (async () => {
      const stored = await getData('makoo_gallery');
      if (stored && stored.length > 0) {
        setGallery(stored);
      } else {
        const defaults = [
          { id: 1, url: "/images/wedding-cake-hero.jpg", title: "Classic Three-Tier Wedding Cake", category: "Wedding Cakes", createdAt: new Date().toISOString() },
          { id: 2, url: "/images/red-velvet.jpg", title: "Red Velvet Celebration Cake", category: "Birthday Cakes", createdAt: new Date().toISOString() },
          { id: 3, url: "/images/chocolate-cake.jpg", title: "Signature Chocolate Snap Cake", category: "Birthday Cakes", createdAt: new Date().toISOString() },
          { id: 4, url: "/images/cream-pastries.jpg", title: "Fresh Cream Eclairs & Pastries", category: "Pastries", createdAt: new Date().toISOString() },
          { id: 5, url: "/images/croissant.jpg", title: "Golden Butter Croissants", category: "Pastries", createdAt: new Date().toISOString() },
          { id: 6, url: "/images/sourdough.jpg", title: "Artisan Sourdough Loaf", category: "Breads", createdAt: new Date().toISOString() },
        ];
        await setData('makoo_gallery', defaults);
        setGallery(defaults);
      }
    })();
  }, []);

  const addImage = async () => {
    if (!newImage.url.trim() || !newImage.title.trim()) {
      toast.error('URL and Title are required');
      return;
    }
    const item = {
      id: Date.now(),
      ...newImage,
      createdAt: new Date().toISOString(),
    };
    const updated = [item, ...gallery];
    await setData('makoo_gallery', updated);
    setGallery(updated);
    setNewImage({ url: '', title: '', category: 'Wedding Cakes' });
    setShowModal(false);
    setImageError(false);
    toast.success('Image added to gallery');
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    const updated = gallery.filter(g => g.id !== deleteConfirm);
    await setData('makoo_gallery', updated);
    setGallery(updated);
    setDeleteConfirm(null);
    toast.success('Image removed');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="font-display text-3xl text-navy tracking-tight">Gallery Manager</div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2 bg-navy text-cream text-xs uppercase tracking-wider">
          <Plus size={16} /> ADD IMAGE
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map(item => (
          <div key={item.id} className="group relative bg-white border border-navy/10 overflow-hidden">
            <img 
              src={item.url} 
              alt={item.title} 
              className="w-full h-48 object-cover" 
              onError={(e) => { e.target.src = '/images/croissant.jpg'; }}
            />
            <div className="p-4">
              <div className="text-sm font-medium tracking-tight text-navy">{item.title}</div>
              <div className="text-xs text-gold mt-0.5">{item.category}</div>
            </div>
            <button 
              onClick={() => handleDelete(item.id)} 
              className="absolute top-2 right-2 bg-white/90 p-1.5 opacity-0 group-hover:opacity-100 transition text-red-600"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {gallery.length === 0 && <div className="col-span-full text-center py-12 text-navy/50">No gallery images yet.</div>}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white max-w-md w-full p-8" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h3 className="font-display text-2xl text-navy">Add Gallery Image</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-navy tracking-widest block mb-1">IMAGE URL</label>
                <input value={newImage.url} onChange={e => { setNewImage({...newImage, url: e.target.value}); setImageError(false); }} className="w-full border p-3 text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs text-navy tracking-widest block mb-1">TITLE</label>
                <input value={newImage.title} onChange={e => setNewImage({...newImage, title: e.target.value})} className="w-full border p-3 text-sm" />
              </div>
              <div>
                <label className="text-xs text-navy tracking-widest block mb-1">CATEGORY</label>
                <select value={newImage.category} onChange={e => setNewImage({...newImage, category: e.target.value})} className="w-full border p-3 text-sm">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {newImage.url && (
                <img src={newImage.url} alt="preview" className="w-full h-40 object-cover border" onError={() => setImageError(true)} />
              )}
              {imageError && <p className="text-xs text-red-500">Image load error</p>}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setImageError(false); }} className="flex-1 py-2.5 border text-xs uppercase">CANCEL</button>
              <button onClick={addImage} className="flex-1 py-2.5 bg-navy text-cream text-xs uppercase">ADD TO GALLERY</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="mt-4 bg-red-50 p-4 flex gap-3 text-sm border border-red-200">
          Remove this image from gallery?
          <button onClick={confirmDelete} className="px-5 bg-red-600 text-white text-xs">YES, REMOVE</button>
          <button onClick={() => setDeleteConfirm(null)}>CANCEL</button>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
