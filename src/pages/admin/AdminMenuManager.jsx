import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X, CheckCircle2, XCircle, Image as ImageIcon, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';
import { getData, setData } from '../../utils/storage';

const DEFAULT_MENU_ITEMS = [
  { id: 1, name: "Butter Croissant", category: "Pastries", desc: "Flaky golden croissant made with pure French butter, baked fresh every morning", price: 120, rating: 4.8, featured: true, image: "/images/croissant.jpg" },
  { id: 2, name: "Chocolate Snap Cake", category: "Cakes", desc: "Makoo's signature cake since 1988 — rich chocolate with a satisfying snap layer", price: 850, unit: "per lb", rating: 4.9, featured: true, image: "/images/chocolate-cake.jpg" },
  { id: 3, name: "Red Velvet Cake", category: "Cakes", desc: "Deep red velvet layers with tangy cream cheese frosting", price: 900, unit: "per lb", rating: 4.8, featured: true, image: "/images/red-velvet.jpg" },
  { id: 4, name: "White Forest Cake", category: "Cakes", desc: "Light vanilla sponge with whipped cream and cherries", price: 850, unit: "per lb", rating: 4.7, featured: false, image: "/images/cream-pastries.jpg" },
  { id: 5, name: "Fruit Cake", category: "Cakes", desc: "Traditional fruit cake loaded with cherries and mixed dried fruits", price: 950, unit: "per lb", rating: 4.6, featured: false, image: "/images/cookies.jpg" },
  { id: 6, name: "Cheesecake", category: "Desserts", desc: "New York-style baked cheesecake with a buttery graham cracker base", price: 350, unit: "per slice", rating: 4.8, featured: true, image: "/images/red-velvet.jpg" },
  { id: 7, name: "Fresh Cream Pastry", category: "Pastries", desc: "Choux pastry filled with fresh whipped cream", price: 150, rating: 4.7, featured: false, image: "/images/cream-pastries.jpg" },
  { id: 8, name: "Fruit Danish", category: "Pastries", desc: "Glazed danish pastry topped with fresh seasonal fruit", price: 180, rating: 4.6, featured: false, image: "/images/croissant.jpg" },
  { id: 9, name: "Artisan Sourdough Bread", category: "Breads", desc: "Stone-baked sourdough with perfect crust and chewy interior", price: 280, unit: "per loaf", rating: 4.7, featured: true, image: "/images/sourdough.jpg" },
  { id: 10, name: "Brown Bread Loaf", category: "Breads", desc: "Wholesome brown bread baked with whole wheat flour", price: 200, unit: "per loaf", rating: 4.6, featured: false, image: "/images/sourdough.jpg" },
  { id: 11, name: "Semolina Cookies", category: "Pastries", desc: "Classic semolina butter cookies — a Makoo signature snack", price: 80, unit: "per piece", rating: 4.8, featured: true, image: "/images/cookies.jpg" },
  { id: 12, name: "Chicken Puff", category: "Snacks", desc: "Crispy puff pastry with spiced shredded chicken filling", price: 80, rating: 4.7, featured: true, image: "/images/cream-pastries.jpg" },
  { id: 13, name: "Veg Puff", category: "Snacks", desc: "Crispy puff pastry with spiced mixed vegetable filling", price: 60, rating: 4.6, featured: false, image: "/images/cream-pastries.jpg" },
  { id: 14, name: "Mini Pizza", category: "Savory", desc: "Fresh mini pizza with mushroom or vegetable toppings", price: 200, rating: 4.5, featured: true, image: "/images/croissant.jpg" },
  { id: 15, name: "Special Sandwich", category: "Savory", desc: "Grilled sandwich with fresh vegetables and cheese", price: 180, rating: 4.5, featured: false, image: "/images/cookies.jpg" },
  { id: 16, name: "Momo (Veg)", category: "Savory", desc: "Steamed Nepali dumplings with fresh vegetable filling", price: 150, rating: 4.4, featured: false, image: "/images/cream-pastries.jpg" },
  { id: 17, name: "Chowmein", category: "Savory", desc: "Stir-fried noodles with vegetables in savory sauce", price: 180, rating: 4.3, featured: false, image: "/images/cookies.jpg" },
  { id: 18, name: "Brownie", category: "Desserts", desc: "Dense fudgy chocolate brownie with walnut pieces", price: 200, rating: 4.7, featured: false, image: "/images/chocolate-cake.jpg" },
  { id: 19, name: "Brewed Coffee", category: "Beverages", desc: "Freshly brewed Nepali coffee, served hot or iced", price: 180, rating: 4.6, featured: false, image: "/images/croissant.jpg" },
  { id: 20, name: "Milk Tea", category: "Beverages", desc: "Classic Nepali chiya with cardamom", price: 80, rating: 4.5, featured: false, image: "/images/cookies.jpg" },
];

const CATEGORIES = ["Cakes", "Pastries", "Breads", "Snacks", "Savory", "Desserts", "Beverages"];

const EMPTY_FORM = {
  name: '', category: 'Pastries', desc: '', price: '', unit: '', rating: 4.5, image: '', featured: false
};

const AdminMenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageError, setImageError] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      const stored = await getData('makoo_menu_items');
      if (stored && stored.length > 0) {
        setMenuItems(stored);
      } else {
        setMenuItems(DEFAULT_MENU_ITEMS);
        await setData('makoo_menu_items', DEFAULT_MENU_ITEMS);
      }
    })();
  }, []);

  const filteredItems = menuItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.desc || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => b.id - a.id);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ ...EMPTY_FORM, rating: 4.5 });
    setImageError(false);
    setErrors({});
    setShowModal(true);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'Pastries',
      desc: item.desc || '',
      price: item.price || '',
      unit: item.unit || '',
      rating: item.rating || 4.5,
      image: item.image || '',
      featured: !!item.featured,
    });
    setImageError(false);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setImageError(false);
    setErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'price' || name === 'rating') {
      newValue = parseFloat(value) || (name === 'rating' ? 4.5 : 0);
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (name === 'image') setImageError(false);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSaveItem = async () => {
    const newErrors = {};
    if (!formData.name || !formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let currentFeaturedCount = menuItems.filter(i => i.featured).length;
    if (formData.featured && !editingItem?.featured) {
      if (currentFeaturedCount >= 8) {
        setErrors({ featured: 'Maximum 8 items can be featured on the homepage. Unfeature another item first.' });
        return;
      }
    }

    let updatedItems;
    if (editingItem) {
      updatedItems = menuItems.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData, id: editingItem.id, price: Number(formData.price), rating: Number(formData.rating) }
          : item
      );
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
        price: Number(formData.price),
        rating: Number(formData.rating),
      };
      updatedItems = [...menuItems, newItem];
    }

    setMenuItems(updatedItems);
    await setData('makoo_menu_items', updatedItems);

    toast.success(editingItem ? 'Item updated successfully' : 'New item added to menu');
    closeModal();
  };

  const handleDeleteClick = (item) => {
    setDeleteConfirm({ id: item.id, name: item.name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const updatedItems = menuItems.filter(item => item.id !== deleteConfirm.id);
    await setData('makoo_menu_items', updatedItems);
    setMenuItems(updatedItems);
    setDeleteConfirm(null);
    toast.success(`"${deleteConfirm.name}" removed from menu`);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const toggleFeatured = async (item) => {
    const featuredCount = menuItems.filter(i => i.featured).length;
    if (!item.featured && featuredCount >= 8) {
      toast.error('Maximum 8 featured items allowed. Please unfeature another first.');
      return;
    }

    const updated = menuItems.map(i =>
      i.id === item.id ? { ...i, featured: !i.featured } : i
    );
    await setData('makoo_menu_items', updated);
    setMenuItems(updated);
    toast.success(item.featured ? 'Removed from homepage featured' : 'Added to homepage featured');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-3xl text-navy tracking-tight">Menu Manager</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-navy text-cream text-xs uppercase tracking-[0.08em] hover:bg-navy-dark"
        >
          <Plus size={16} /> ADD NEW ITEM
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-3 text-navy/40" size={17} />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-navy/20 pl-10 py-2.5 text-sm focus:outline-none focus:border-navy"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-navy/20 px-4 py-2.5 text-sm bg-white min-w-[160px]"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white shadow-sm border border-navy/5 overflow-x-auto">
        <table className="w-full text-sm min-w-[980px]">
          <thead>
            <tr className="border-b text-left text-xs text-navy/70 bg-navy/5">
              <th className="px-5 py-3 w-16 font-normal">IMAGE</th>
              <th className="px-4 py-3 font-normal">NAME</th>
              <th className="px-4 py-3 font-normal">CATEGORY</th>
              <th className="px-4 py-3 font-normal">PRICE</th>
              <th className="px-4 py-3 font-normal">RATING</th>
              <th className="px-4 py-3 font-normal">FEATURED</th>
              <th className="px-4 py-3 w-28 font-normal text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-navy/5 group">
                  <td className="px-5 py-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-12 object-cover border"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-navy/10 flex items-center justify-center">
                        <ImageIcon size={18} className="text-navy/40" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-navy">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] bg-navy/10 text-navy px-2 py-px tracking-wider uppercase">{item.category}</span>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    Rs. {item.price} {item.unit && <span className="text-xs text-navy/50">/ {item.unit}</span>}
                  </td>
                  <td className="px-4 py-3 text-gold">★ {item.rating || 4.5}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(item)} className="flex items-center gap-1 text-xs">
                      {item.featured ? (
                        <CheckCircle2 size={16} className="text-green-700" />
                      ) : (
                        <XCircle size={16} className="text-navy/30" />
                      )}
                      <span className="text-navy/60">{item.featured ? 'Yes' : 'No'}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
                        className="text-navy hover:text-gold transition-colors p-1"
                        title="Edit item"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(item); }}
                        className="text-navy hover:text-red-500 transition-colors p-1"
                        title="Delete item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center">
                    <UtensilsCrossed size={64} className="text-gold/40 mb-3" />
                    <div className="font-display text-2xl text-navy">No menu items found</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={cancelDelete}
          />
          <div className="relative bg-white p-8 max-w-sm w-full mx-4 shadow-2xl z-10">
            <h3 className="font-display italic text-2xl text-navy mb-2">
              Remove Item?
            </h3>
            <div className="w-12 h-px bg-gold mb-4" />
            <p className="font-sans text-sm text-navy/70 mb-6">
              Are you sure you want to remove{' '}
              <span className="font-sans font-semibold text-navy">"{deleteConfirm.name}"</span>{' '}
              from the menu? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 border border-navy text-navy font-sans font-medium uppercase tracking-wider text-sm py-2.5 hover:bg-navy/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white font-sans font-medium uppercase tracking-wider text-sm py-2.5 hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div
            className="bg-white w-full max-w-[560px] max-h-[92vh] overflow-auto p-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-display text-[28px] tracking-tight text-navy">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
              <button onClick={closeModal} className="text-navy"><X size={22} /></button>
            </div>
            <div className="h-px bg-gold/40 my-5" />

            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-navy font-medium block mb-1">ITEM NAME *</label>
                <input name="name" value={formData.name} onChange={handleFormChange} className={`w-full border p-3 text-sm ${errors.name ? 'border-red-500' : 'border-navy/20'}`} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-navy font-medium block mb-1">CATEGORY *</label>
                <select name="category" value={formData.category} onChange={handleFormChange} className="w-full border border-navy/20 p-3 text-sm bg-white">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-navy font-medium block mb-1">DESCRIPTION</label>
                <textarea name="desc" value={formData.desc} onChange={handleFormChange} rows={3} className="w-full border border-navy/20 p-3 text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-navy font-medium block mb-1">PRICE (Rs.) *</label>
                  <input type="number" step="0.01" name="price" value={formData.price} onChange={handleFormChange} className={`w-full border p-3 text-sm ${errors.price ? 'border-red-500' : 'border-navy/20'}`} />
                  {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-navy font-medium block mb-1">UNIT (optional)</label>
                  <input name="unit" value={formData.unit} onChange={handleFormChange} placeholder="per lb, per slice..." className="w-full border border-navy/20 p-3 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-navy font-medium block mb-1">RATING</label>
                  <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleFormChange} className="w-full border border-navy/20 p-3 text-sm" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-navy font-medium block mb-1">FEATURED ON HOMEPAGE</label>
                  <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleFormChange}
                      className="w-4 h-4 accent-navy"
                    />
                    <span className="text-sm">Show on homepage specialties</span>
                  </label>
                  {errors.featured && <p className="text-xs text-red-500 mt-1">{errors.featured}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-navy font-medium block mb-1">IMAGE URL</label>
                <input
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  placeholder="Paste image URL (.jpg, .png, unsplash, etc)"
                  className="w-full border border-navy/20 p-3 text-sm"
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-navy/50">Supports direct image links, Unsplash, CDN</p>
                  <a href="https://unsplash.com/s/photos/bakery-food" target="_blank" rel="noreferrer" className="text-xs text-gold underline">Browse Unsplash</a>
                </div>

                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-40 object-cover border border-navy/10"
                      onError={() => setImageError(true)}
                      onLoad={() => setImageError(false)}
                    />
                    {imageError && (
                      <div className="text-xs text-red-500 mt-1">Image not found — check URL</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={closeModal} className="flex-1 py-3 border border-navy text-navy text-xs uppercase tracking-wider">CANCEL</button>
              <button onClick={handleSaveItem} className="flex-1 py-3 bg-navy text-cream text-xs uppercase tracking-wider">SAVE ITEM</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenuManager;
