import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import { getData, setData } from '../utils/storage';

const HomePage = () => {
  const { addToCart } = useCart();
  const [homepageConfig, setHomepageConfig] = useState(null);
  const [tickerText, setTickerText] = useState("FREE DELIVERY ON FIRST ORDER | CUSTOM WEDDING CAKES ON REQUEST | CALL 01-5424285 TO ORDER | FRESH BAKES DAILY | CELEBRATING 35+ YEARS");

  // Load homepage config from shared storage or defaults
  useEffect(() => {
    (async () => {
      const stored = await getData('makoo_homepage_config');
      if (stored) {
        setHomepageConfig(stored);
      } else {
        const defaults = {
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
        };
        await setData('makoo_homepage_config', defaults);
        setHomepageConfig(defaults);
      }
    })();
  }, []);

  // Default featured products (will be overridden by admin menu if changed)
  const [featuredProducts, setFeaturedProducts] = useState([
    {
      id: 1,
      name: "Signature Croissant",
      category: "Pastries",
      price: 120,
      desc: "Flaky, buttery layers baked fresh each morning",
      image: "/images/croissant.jpg",
      unit: ""
    },
    {
      id: 2,
      name: "Chocolate Snap Cake",
      category: "Cakes",
      price: 850,
      desc: "Our most beloved creation since 1988",
      image: "/images/chocolate-cake.jpg",
      unit: "/lb"
    },
    {
      id: 3,
      name: "Red Velvet Cake",
      category: "Cakes",
      price: 900,
      desc: "Velvety texture with classic cream cheese frosting",
      image: "/images/red-velvet.jpg",
      unit: "/lb"
    },
    {
      id: 4,
      name: "Artisan Sourdough",
      category: "Breads",
      price: 280,
      desc: "Stone-baked with a perfectly crunchy crust",
      image: "/images/sourdough.jpg",
      unit: ""
    },
    {
      id: 12,
      name: "Chicken Puff",
      category: "Snacks",
      price: 80,
      desc: "Crispy pastry with spiced chicken filling",
      image: "/images/cream-pastries.jpg", // reuse for now
      unit: ""
    },
    {
      id: 14,
      name: "Mini Pizza",
      category: "Savory",
      price: 200,
      desc: "Freshly topped with mushrooms and vegetables",
      image: "/images/croissant.jpg", // placeholder
      unit: ""
    },
    {
      id: 6,
      name: "Cheesecake Slice",
      category: "Desserts",
      price: 350,
      desc: "New York-style, baked fresh daily",
      image: "/images/red-velvet.jpg", // placeholder
      unit: ""
    },
    {
      id: 7,
      name: "Fresh Cream Pastry",
      category: "Pastries",
      price: 150,
      desc: "Light choux pastry with whipped fresh cream",
      image: "/images/cream-pastries.jpg",
      unit: ""
    },
  ]);

  // Load menu items to sync featured if admin changed
  useEffect(() => {
    (async () => {
      const storedMenu = await getData('makoo_menu_items');
      if (storedMenu && storedMenu.length > 0) {
        const featured = storedMenu.filter(item => item.featured).slice(0, 8);
        if (featured.length > 0) {
          setFeaturedProducts(featured.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            desc: item.desc,
            image: item.image || '/images/croissant.jpg',
            unit: item.unit || ''
          })));
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const tk = await getData('makoo_ticker');
      if (tk) setTickerText(tk);
    })();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`, {
      icon: '🛒',
    });
  };

  // Reviews
  const reviews = [
    {
      text: "Perfect as always! Been ordering birthday cakes from them for the past 10 years. Perfect every time.",
      name: "Lalitpur Customer",
    },
    {
      text: "Mako bakery is only place I'll get my cake from! Not only are they beautiful but delicious too. Amazing service.",
      name: "BiheBazaar Review",
    },
    {
      text: "Always a best place for breads and bakery items. Veg and chicken puff, brownie, semolina cookies — all highly recommended.",
      name: "Foursquare Review",
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  if (!homepageConfig) return null;

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[100dvh] flex items-center bg-navy-dark overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${homepageConfig.heroImage || '/images/hero-bg.jpg'})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/90 via-navy-dark/70 to-navy-dark/95" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-block mb-6">
                <span className="text-gold text-xs font-medium tracking-[0.15em] uppercase px-4 py-1.5 border border-gold/50">
                  {homepageConfig.badge}
                </span>
              </div>

              <h1 className="font-display text-[clamp(48px,7vw,82px)] leading-[0.95] text-cream tracking-[-1.5px] mb-6">
                {homepageConfig.heading1}<br />
                <span className="italic">{homepageConfig.heading2}</span>
              </h1>

              <p className="text-lg text-cream/70 max-w-md mb-8 font-light tracking-[-0.2px]">
                {homepageConfig.subtext}
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  to="/cakes"
                  className="px-9 py-3.5 bg-gold text-navy text-sm font-medium uppercase tracking-[0.08em] hover:bg-gold-light transition-all active:scale-[0.985]"
                >
                  ORDER A CAKE
                </Link>
                <Link
                  to="/menu"
                  className="px-9 py-3.5 border border-cream/70 text-cream text-sm font-medium uppercase tracking-[0.08em] hover:bg-white/5 transition-all active:scale-[0.985]"
                >
                  VIEW FULL MENU
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
                {homepageConfig.stats.map((stat, index) => (
                  <div key={index} className="flex items-baseline gap-2">
                    <span className="text-gold font-semibold tracking-tight text-xl">{stat.value}</span>
                    <span className="text-cream/60 text-xs tracking-[0.5px]">{stat.label}</span>
                    {index < homepageConfig.stats.length - 1 && (
                      <span className="text-gold/50 mx-1">•</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Wedding Cake Image */}
          <div className="hidden md:block relative">
            <div className="relative">
              <img 
                src={homepageConfig.heroImage || '/images/wedding-cake-hero.jpg'} 
                alt="Elegant Wedding Cake" 
                className="w-full max-w-[420px] ml-auto rounded-sm border border-gold/30 shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-gold/40" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="flex flex-col items-center text-gold/60 text-[10px] tracking-[2px]">
            SCROLL TO EXPLORE
            <div className="h-px w-6 bg-gold/30 mt-1.5" />
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENT TICKER */}
      <div className="bg-gold py-2.5 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee text-navy text-xs font-semibold tracking-[0.15em] flex items-center gap-8">
          {tickerText.split('|').map((t, i) => (
              <React.Fragment key={i}>
                <span>{t.trim()}</span>
                {i < tickerText.split('|').length - 1 && <span>•</span>}
              </React.Fragment>
            ))}
        </div>
      </div>

      {/* SIGNATURE PRODUCTS */}
      <section className="bg-navy-dark py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-gold text-xs tracking-[0.2em] font-medium uppercase mb-2">OUR SPECIALTIES</div>
            <h2 className="font-display text-5xl md:text-[64px] text-cream leading-none tracking-[-1px]">Freshly Baked, Every Day</h2>
            <div className="h-px w-20 bg-gold mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="group bg-navy-card border-t border-transparent hover:border-gold transition-all duration-300 flex flex-col"
              >
                <div className="relative overflow-hidden h-56">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-gold text-[10px] tracking-[0.15em] uppercase font-medium mb-1.5">{product.category}</div>
                  <h3 className="font-display text-[21px] text-cream tracking-tight leading-tight mb-2">{product.name}</h3>
                  <p className="text-cream/60 text-sm leading-snug mb-auto line-clamp-2">{product.desc}</p>
                  
                  <div className="flex items-center justify-between mt-5">
                    <div className="text-gold font-semibold text-lg tracking-tight">
                      Rs. {product.price}{product.unit}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="text-xs border border-cream/30 px-5 py-2 text-cream hover:bg-gold hover:text-navy hover:border-gold transition-all uppercase tracking-wider font-medium"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/menu" className="inline-block text-gold hover:text-gold-light text-sm tracking-[0.1em] font-medium uppercase border-b border-gold/40 pb-0.5 hover:border-gold transition-colors">
              VIEW COMPLETE MENU →
            </Link>
          </div>
        </div>
      </section>

      {/* WEDDING CAKES FEATURE */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src="/images/wedding-cake-hero.jpg" 
              alt="Custom Wedding Cake" 
              className="w-full border border-navy/10 shadow-xl"
            />
            <div className="absolute -left-4 -bottom-4 w-3/4 h-3/4 border border-navy/10 -z-10" />
          </div>

          <div>
            <div className="text-gold text-xs tracking-[0.2em] font-medium uppercase mb-3">WEDDING CAKE SPECIALISTS</div>
            <h2 className="font-display text-[52px] leading-[0.95] text-navy tracking-[-1.2px] mb-6">
              Your Perfect Cake,<br />Crafted for Your Perfect Day
            </h2>
            <p className="text-navy/70 text-[15px] leading-relaxed mb-8">
              Since 1988, Makoo Bakery has been Lalitpur's most trusted wedding cake destination. 
              From simple naked cakes to elaborate multi-tier floral designs, every cake is handcrafted 
              to match your vision and delight your guests.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Fully custom designs — share your vision, we bring it to life",
                "All flavor combinations — vanilla, chocolate, strawberry, fruit, and more",
                "Pre-order required — call 01-5424285 or message on Viber 9841224345"
              ].map((text, i) => (
                <div key={i} className="flex gap-3 text-sm text-navy/80">
                  <span className="text-gold mt-1">—</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <Link 
              to="/cakes" 
              className="inline-block px-8 py-3 bg-navy text-cream text-sm font-medium uppercase tracking-[0.08em] hover:bg-navy-dark transition-colors"
            >
              REQUEST A CUSTOM CAKE
            </Link>
          </div>
        </div>
      </section>

      {/* BESTSELLERS CAROUSEL */}
      <section className="py-16 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-gold text-xs tracking-[0.2em] font-medium uppercase mb-1">MOST LOVED</div>
            <h3 className="font-display text-[52px] italic text-navy tracking-tight">Customer Favorites</h3>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-2 px-2">
            {[
              { id: 2, name: "Chocolate Snap", price: 850, image: "/images/chocolate-cake.jpg" },
              { id: 1, name: "Butter Croissant", price: 120, image: "/images/croissant.jpg" },
              { id: 3, name: "Red Velvet Cake", price: 900, image: "/images/red-velvet.jpg" },
              { id: 12, name: "Chicken Puff", price: 80, image: "/images/cream-pastries.jpg" },
              { id: 4, name: "Sourdough Bread", price: 280, image: "/images/sourdough.jpg" },
              { id: 14, name: "Mini Pizza", price: 200, image: "/images/croissant.jpg" },
            ].map((item, idx) => (
              <div key={idx} className="min-w-[210px] snap-start group">
                <div className="relative mx-auto w-36 h-36 rounded-full overflow-hidden border-[6px] border-gold/20 group-hover:border-gold transition-colors mb-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <div className="font-display text-xl text-navy tracking-tight mb-1">{item.name}</div>
                  <div className="text-gold font-medium text-sm mb-1.5">Rs. {item.price}</div>
                  <div className="flex justify-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-gold fill-gold" />)}
                  </div>
                  <Link to="/menu" className="text-xs text-gold tracking-[0.08em] hover:underline">ORDER →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-2">
            <img 
              src="/images/bakery-interior.jpg" 
              alt="Our Bakery" 
              className="w-full border border-cream/20"
            />
          </div>
          <div className="md:col-span-3">
            <div className="text-gold text-xs tracking-[0.2em] font-medium uppercase mb-3">OUR STORY</div>
            <h3 className="font-display text-[48px] leading-[0.95] text-cream tracking-[-1px] mb-6">A Family Legacy Since 1988</h3>
            <p className="text-cream/70 text-[15px] leading-relaxed max-w-prose mb-6">
              What started as a small neighborhood bakery in Jawalakhel has grown into Lalitpur's most beloved baking destination. 
              Three decades of daily dedication to fresh ingredients, honest recipes, and the smiles of our community.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-gold text-sm uppercase tracking-[0.1em] font-medium group">
              READ OUR STORY 
              <span className="group-hover:translate-x-0.5 transition">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* GOOGLE REVIEWS */}
      <section className="py-16 bg-cream">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="font-display text-center text-[40px] text-navy italic mb-10 tracking-tight">What Our Customers Say</h3>
          
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map((review, i) => (
              <div key={i} className="bg-navy p-7 text-cream">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={15} className="text-gold fill-gold" />)}
                </div>
                <p className="italic text-sm leading-relaxed mb-6">“{review.text}”</p>
                <div>
                  <div className="text-gold text-sm font-medium">{review.name}</div>
                  <div className="text-xs text-cream/50 mt-0.5">via Google Reviews</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="bg-navy-dark py-16 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-[64px] leading-none text-cream tracking-[-1.5px] mb-4">Ready to Order?</h2>
          <p className="text-cream/70 text-lg max-w-md mx-auto mb-8">
            Place a custom cake order, pre-order for special occasions, or simply drop by for your daily bakes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/order" className="px-10 py-3.5 bg-gold text-navy text-sm font-medium uppercase tracking-[0.08em] hover:bg-gold-light transition-colors">
              ORDER ONLINE
            </Link>
            <a href="tel:015424285" className="px-10 py-3.5 border border-cream/40 text-cream text-sm font-medium uppercase tracking-[0.08em] hover:bg-white/5 transition-colors">
              CALL 01-5424285
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
