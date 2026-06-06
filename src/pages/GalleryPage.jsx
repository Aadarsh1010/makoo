import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, GripVertical, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { getData, setData } from '../utils/storage';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';

const DEFAULT_GALLERY = [
  { id: 1, url: "/images/wedding-cake-hero.jpg", title: "Classic Three-Tier Wedding Cake", category: "Wedding Cakes" },
  { id: 2, url: "/images/red-velvet.jpg", title: "Red Velvet Celebration Cake", category: "Birthday Cakes" },
  { id: 3, url: "/images/chocolate-cake.jpg", title: "Signature Chocolate Snap Cake", category: "Birthday Cakes" },
  { id: 4, url: "/images/cream-pastries.jpg", title: "Fresh Cream Eclairs & Pastries", category: "Pastries" },
  { id: 5, url: "/images/croissant.jpg", title: "Golden Butter Croissants", category: "Pastries" },
  { id: 6, url: "/images/sourdough.jpg", title: "Artisan Sourdough Loaf", category: "Breads" },
  { id: 7, url: "/images/cookies.jpg", title: "Assorted Semolina & Butter Cookies", category: "Pastries" },
  { id: 8, url: "/images/bakery-interior.jpg", title: "Our Flagship Bakery Interior", category: "Breads" },
  { id: 9, url: "/images/wedding-cake-hero.jpg", title: "Elaborate Floral Wedding Cake", category: "Wedding Cakes" },
  { id: 10, url: "/images/chocolate-cake.jpg", title: "Rich Chocolate Layer Cake", category: "Birthday Cakes" },
  { id: 11, url: "/images/cream-pastries.jpg", title: "Assorted Fruit Danishes", category: "Pastries" },
  { id: 12, url: "/images/sourdough.jpg", title: "Freshly Baked Whole Loaves", category: "Breads" },
  { id: 13, url: "/images/red-velvet.jpg", title: "Custom Birthday Floral Cake", category: "Birthday Cakes" },
  { id: 14, url: "/images/croissant.jpg", title: "Flaky Chicken Puffs", category: "Savory" },
];

const CATEGORIES = ["All", "Wedding Cakes", "Birthday Cakes", "Pastries", "Breads", "Savory"];

function SortableGalleryItem({ item, index, total, onMoveLeft, onMoveRight, onDelete, isAdmin, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="break-inside-avoid relative group cursor-pointer overflow-hidden bg-navy/5"
      onClick={() => onClick(item, index)}
    >
      <img
        src={item.url}
        alt={item.title}
        className="w-full h-auto object-cover block transition duration-500 group-hover:scale-[1.015]"
        onError={(e) => { e.target.src = '/images/croissant.jpg'; }}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-1 group-hover:translate-y-0 transition">
        <div className="text-cream text-sm font-medium tracking-tight">{item.title}</div>
        <div className="text-gold text-xs">{item.category}</div>
      </div>

      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="bg-white bg-opacity-90 text-navy p-1.5 rounded cursor-grab active:cursor-grabbing hover:bg-gold hover:text-white transition-colors"
            title="Drag to reorder"
          >
            <GripVertical size={14} />
          </button>
          {index > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); onMoveLeft(index); }}
              className="bg-white bg-opacity-90 text-navy p-1.5 rounded hover:bg-gold hover:text-white transition-colors"
              title="Move left"
            >
              <ChevronLeft size={14} />
            </button>
          )}
          {index < total - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); onMoveRight(index); }}
              className="bg-white bg-opacity-90 text-navy p-1.5 rounded hover:bg-gold hover:text-white transition-colors"
              title="Move right"
            >
              <ChevronRight size={14} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            className="bg-white bg-opacity-90 text-red-500 p-1.5 rounded hover:bg-red-500 hover:text-white transition-colors"
            title="Delete image"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const isAdmin = (() => {
    try {
      const auth = JSON.parse(localStorage.getItem('makoo_admin_auth') || '{}');
      if (!auth.token || !auth.loginTime) return false;
      const elapsed = Date.now() - auth.loginTime;
      return elapsed < 45 * 60 * 1000;
    } catch { return false; }
  })();

  useEffect(() => {
    (async () => {
      const stored = await getData('makoo_gallery');
      if (stored && stored.length > 0) {
        setGalleryItems(stored);
      } else {
        setGalleryItems(DEFAULT_GALLERY);
        await setData('makoo_gallery', DEFAULT_GALLERY);
      }
    })();
  }, []);

  const saveGallery = async (items) => {
    setGalleryItems(items);
    await setData('makoo_gallery', items);
  };

  const filtered = activeFilter === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  const openLightbox = (item, index) => {
    const filteredIndex = filtered.findIndex(f => f.id === item.id);
    setLightbox({ item, index: filteredIndex });
  };

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const goToPrev = useCallback(() => {
    if (!lightbox) return;
    const newIndex = (lightbox.index - 1 + filtered.length) % filtered.length;
    setLightbox({ item: filtered[newIndex], index: newIndex });
  }, [lightbox, filtered]);

  const goToNext = useCallback(() => {
    if (!lightbox) return;
    const newIndex = (lightbox.index + 1) % filtered.length;
    setLightbox({ item: filtered[newIndex], index: newIndex });
  }, [lightbox, filtered]);

  React.useEffect(() => {
    const handleKey = (e) => {
      if (!lightbox) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, closeLightbox, goToPrev, goToNext]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (active.id !== over?.id) {
      const oldIndex = galleryItems.findIndex(i => i.id === active.id);
      const newIndex = galleryItems.findIndex(i => i.id === over.id);
      const reordered = arrayMove(galleryItems, oldIndex, newIndex);
      saveGallery(reordered);
    }
  };

  const handleMoveLeft = (index) => {
    if (index === 0) return;
    const realIndex = galleryItems.findIndex(i => i.id === filtered[index].id);
    const reordered = [...galleryItems];
    [reordered[realIndex - 1], reordered[realIndex]] = [reordered[realIndex], reordered[realIndex - 1]];
    saveGallery(reordered);
  };

  const handleMoveRight = (index) => {
    if (index === galleryItems.length - 1) return;
    const realIndex = galleryItems.findIndex(i => i.id === filtered[index].id);
    const reordered = [...galleryItems];
    [reordered[realIndex], reordered[realIndex + 1]] = [reordered[realIndex + 1], reordered[realIndex]];
    saveGallery(reordered);
  };

  const handleDeleteGalleryItem = (id) => {
    const updated = galleryItems.filter(item => item.id !== id);
    saveGallery(updated);
    toast.success('Image removed from gallery');
  };

  return (
    <div>
      <div className="bg-navy-dark py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="font-display text-[72px] text-cream tracking-[-1.5px] leading-none">Our Gallery</h1>
          <div className="text-gold text-xs tracking-[0.15em] mt-3">HOME / GALLERY</div>
        </div>
      </div>

      <div className="border-b border-navy/10 bg-cream sticky top-[80px] z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-x-2 gap-y-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-1.5 text-xs uppercase tracking-[0.1em] transition ${activeFilter === cat ? 'bg-navy text-cream' : 'text-navy hover:bg-navy/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isAdmin && galleryItems.length > 0 && (
          <div className="mb-4 px-4 py-2 bg-navy/10 border border-navy/20 text-navy text-sm flex items-center gap-2">
            <GripVertical size={16} className="text-gold" />
            <span>Admin mode: Drag images to reorder, or use the arrow buttons on hover. Changes save automatically.</span>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(e) => setActiveId(e.active.id)}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={galleryItems.map(i => i.id)} strategy={rectSortingStrategy}>
            <div className="columns-1 sm:columns-2 md:columns-3 gap-3 space-y-3">
              {filtered.map((item, idx) => (
                <SortableGalleryItem
                  key={item.id}
                  item={item}
                  index={idx}
                  total={filtered.length}
                  onMoveLeft={handleMoveLeft}
                  onMoveRight={handleMoveRight}
                  onDelete={handleDeleteGalleryItem}
                  isAdmin={isAdmin}
                  onClick={openLightbox}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <div className="opacity-80 shadow-2xl border-2 border-gold">
                <img
                  src={galleryItems.find(i => i.id === activeId)?.url}
                  alt="Dragging"
                  className="w-full h-64 object-cover"
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {filtered.length === 0 && (
          <p className="text-center py-12 text-navy/50">No images in this category yet.</p>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" onClick={closeLightbox}>
            <div className="relative max-w-[94vw] max-h-[92vh] w-full" onClick={e => e.stopPropagation()}>
              <button
                onClick={closeLightbox}
                className="absolute -top-3 -right-3 z-10 bg-navy text-cream p-2 rounded-full"
              >
                <X size={20} />
              </button>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <img
                  src={lightbox.item.url}
                  alt={lightbox.item.title}
                  className="max-h-[82vh] w-auto mx-auto object-contain rounded-sm shadow-2xl"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-6 text-cream">
                  <div className="text-xl font-display tracking-tight">{lightbox.item.title}</div>
                  <div className="text-gold text-sm">{lightbox.item.category}</div>
                </div>
              </motion.div>

              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition"
              >
                <ChevronRight size={22} />
              </button>

              <div className="absolute top-4 left-4 text-xs text-cream/70 tracking-widest">
                {lightbox.index + 1} / {filtered.length}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
