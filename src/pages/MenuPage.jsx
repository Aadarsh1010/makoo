import React, { useState, useEffect } from 'react';
import { Search, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import { getData, setData } from '../utils/storage';

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

const CATEGORIES = ["All", "Cakes", "Pastries", "Breads", "Snacks", "Savory", "Desserts", "Beverages"];

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();

  // Load menu from shared storage or defaults
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

  // Sync wishlist (session only)
  useEffect(() => {
    const saved = sessionStorage.getItem('makoo_wishlist');
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  const toggleWishlist = (id) => {
    let newWishlist;
    if (wishlist.includes(id)) {
      newWishlist = wishlist.filter(w => w !== id);
    } else {
      newWishlist = [...wishlist, id];
    }
    setWishlist(newWishlist);
    sessionStorage.setItem('makoo_wishlist', JSON.stringify(newWishlist));
  };

  const filteredItems = menuItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image,
    });
    toast.success(`Added ${item.name} to cart`);
  };

  return (
    <div>
      {/* Page Hero */}
      <div className="bg-navy-dark py-16 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40" 
          style={{ backgroundImage: `url('/images/hero-bg.jpg')` }}
        />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="text-gold text-xs tracking-[0.2em] uppercase mb-2">JAWALAKHEL • LALITPUR</div>
          <h1 className="font-display text-[72px] leading-none text-cream tracking-[-1.5px]">Our Full Menu</h1>
          <div className="text-gold text-xs tracking-[0.15em] mt-3">HOME / MENU</div>
        </div>
      </div>

      {/* Filter Bar - Sticky */}
      <div className="sticky top-[80px] z-40 bg-cream border-b border-navy/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-3.5 text-navy/40" size={18} />
            <input
              type="text"
              placeholder="Search for a product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-navy/20 pl-11 pr-4 py-3 text-sm font-light focus:outline-none focus:border-navy placeholder:text-navy/40"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-xs uppercase tracking-[0.1em] transition-all border ${
                  activeCategory === cat 
                    ? 'bg-navy text-cream border-navy' 
                    : 'bg-transparent text-navy border-navy/30 hover:border-navy'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-navy/60">No items found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isWishlisted = wishlist.includes(item.id);
              return (
                <div key={item.id} className="group bg-white border border-navy/5 overflow-hidden flex flex-col">
                  <div className="relative h-52 overflow-hidden">
                    <img 
                      src={item.image || '/images/croissant.jpg'} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                      onError={(e) => { e.target.src = '/images/croissant.jpg'; }}
                    />
                    
                    {/* Wishlist Heart */}
                    <button 
                      onClick={() => toggleWishlist(item.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart 
                        size={16} 
                        className={isWishlisted ? "fill-gold text-gold" : "text-navy/70"} 
                      />
                    </button>

                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] px-2.5 py-px bg-gold text-navy font-medium tracking-widest uppercase">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display text-[22px] text-navy tracking-tight mb-1.5">{item.name}</h3>
                    <p className="text-sm text-muted line-clamp-2 mb-4 flex-1">{item.desc}</p>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-navy/10">
                      <div>
                        <span className="font-semibold text-navy text-lg tracking-tight">Rs. {item.price}</span>
                        {item.unit && <span className="text-xs text-muted ml-1">/ {item.unit}</span>}
                      </div>
                      <div className="flex items-center gap-1 text-gold text-sm">
                        <span>★</span>
                        <span className="font-light text-navy/80">{item.rating}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="mt-4 w-full py-2.5 text-xs uppercase tracking-[0.08em] border border-navy text-navy hover:bg-navy hover:text-cream transition-all font-medium"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center text-xs text-muted tracking-widest">
          ALL PRICES IN NEPALESE RUPEES (NPR) • FRESH DAILY
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
