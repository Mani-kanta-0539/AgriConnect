import { useLanguage } from '../context/LanguageContext';
import { ShoppingBag, Truck, Tag, Star, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

// 3D Basket Visual Anchor
const Basket3D = () => {
  return (
    <div className="absolute top-8 right-8 w-32 h-32 hidden md:flex items-center justify-center pointer-events-none z-0" style={{ perspective: '800px' }}>
      <motion.div
        animate={{
          rotateY: [0, 15, 0, -15, 0],
          rotateX: [10, 15, 10, 5, 10],
          y: [0, -10, 0, 10, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-20 h-20"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(10deg)' }}
      >
        {/* Basket Body */}
        <div className="absolute inset-0 bg-[#00332C] rounded-b-3xl rounded-t-lg shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.5),0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center border-t-4 border-[#86EFAC]" style={{ transform: 'translateZ(0px)' }}>
          <ShoppingBag className="w-8 h-8 text-[#86EFAC] opacity-80" />
        </div>
        
        {/* Handles */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-8 border-4 border-[#86EFAC] rounded-t-full" style={{ transform: 'translateZ(-5px)' }} />
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-8 border-4 border-[#00332C] rounded-t-full" style={{ transform: 'translateZ(5px)' }} />
        
        {/* Glowing Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#86EFAC] rounded-full blur-2xl opacity-20" style={{ transform: 'translateZ(-20px)' }} />
      </motion.div>
    </div>
  );
};

export function Marketplace() {
  const { t } = useLanguage();
  const [category, setCategory] = useState('All');

  const products = [
    { id: 1, name: 'Hybrid Paddy Seeds', price: '₹850', category: 'Seeds', rating: 4.8, url: 'https://www.tradeindia.com/products/hybrid-paddy-seed-for-90-100cm-5635022.html', image: 'https://picsum.photos/seed/seeds/400/300' },
    { id: 2, name: 'Organic Fertilizer', price: '₹1,200', category: 'Fertilizers', rating: 4.5, url: 'https://utkarshagro.com/products/utkarsh-huminoz-98-900-gm-biologically-activated-humic-acid-98-for-plant-pgr-based-natural-fertilizers', image: 'https://picsum.photos/seed/fertilizer/400/300' },
    { id: 3, name: 'Handheld Sprayer', price: '₹2,400', category: 'Tools', rating: 4.2, url: 'https://utkarshagro.com/products/utkarsh-huminoz-98-900-gm-biologically-activated-humic-acid-98-for-plant-pgr-based-natural-fertilizers', image: 'https://picsum.photos/seed/sprayer/400/300' },
    { id: 4, name: 'Neem Oil (Pest Control)', price: '₹450', category: 'Pest Control', rating: 4.9, image: 'https://picsum.photos/seed/neem/400/300' },
    { id: 5, name: 'Tractor Rental (Daily)', price: '₹3,500', category: 'Rentals', rating: 4.7, image: 'https://picsum.photos/seed/tractor/400/300' },
    { id: 6, name: 'Soil Testing Kit', price: '₹950', category: 'Tools', rating: 4.4, image: 'https://picsum.photos/seed/soilkit/400/300' },
  ];

  const categories = ['All', 'Seeds', 'Fertilizers', 'Tools', 'Pest Control', 'Rentals'];

  const filteredProducts = category === 'All' ? products : products.filter(p => p.category === category);

  return (
    <div className="space-y-8 pb-24 relative">
      <Basket3D />
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#00332C] dark:text-[#86EFAC] tracking-tight font-serif mb-2">
            {t('marketplace') || 'Smart Marketplace'}
          </h1>
          <p className="text-stone-500 font-sans text-sm md:text-base max-w-xl">
            High-quality agricultural products, tools, and rentals verified by AgriConnect.
          </p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-stone-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search seeds, tools, rentals..."
            className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-[#86EFAC] focus:border-[#00332C] outline-none font-sans transition-all"
          />
          <button className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <Filter className="h-5 w-5 text-[#00332C] hover:text-[#86EFAC] transition-colors" />
          </button>
        </div>
      </header>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              category === cat
                ? 'bg-[#00332C] text-[#86EFAC] shadow-lg shadow-[#00332C]/20 scale-105'
                : 'bg-white/60 backdrop-blur-md text-stone-600 border border-white/40 hover:bg-white hover:shadow-md'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            key={product.id} 
            className="group relative bg-white/60 backdrop-blur-xl rounded-[24px] border border-white/40 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(0,51,44,0.1)] transition-all duration-500 flex flex-col"
          >
            {/* Product Image Area */}
            <div className="relative h-48 overflow-hidden bg-stone-100">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#00332C] shadow-sm">
                  {product.category}
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold font-sans text-stone-700">{product.rating}</span>
                </div>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-serif font-semibold text-xl text-[#00332C] line-clamp-2 mb-4 flex-grow">
                {product.name}
              </h3>
              
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold mb-1">Price</p>
                  <span className="text-2xl font-bold text-[#FF6B6B] font-sans tracking-tight">
                    {product.price}
                  </span>
                </div>
                
                {/* 3D Quick-Buy Button */}
                <button 
                  onClick={() => product.url && window.open(product.url, '_blank')}
                  className="relative group/btn"
                >
                  <div className="absolute inset-0 bg-[#00221d] rounded-2xl translate-y-1 transition-transform group-active/btn:translate-y-0"></div>
                  <div className="relative bg-[#00332C] text-[#86EFAC] p-3.5 rounded-2xl flex items-center justify-center transition-transform group-active/btn:translate-y-1 group-hover/btn:bg-[#00443b]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delivery Info - Glassmorphism Card */}
      <section className="relative overflow-hidden rounded-[32px] p-8 md:p-10 mt-12 bg-[#00332C]">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#86EFAC]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF6B6B]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
              <Truck className="w-7 h-7 text-[#86EFAC]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xl text-white mb-1">Fast Delivery</h4>
              <p className="text-sm text-[#86EFAC]/70 font-sans leading-relaxed">Direct to your farm within 48 hours of order confirmation.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
              <Tag className="w-7 h-7 text-[#86EFAC]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xl text-white mb-1">Best Prices</h4>
              <p className="text-sm text-[#86EFAC]/70 font-sans leading-relaxed">Wholesale rates directly from verified manufacturers.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
              <Star className="w-7 h-7 text-[#86EFAC]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xl text-white mb-1">Quality Assured</h4>
              <p className="text-sm text-[#86EFAC]/70 font-sans leading-relaxed">100% genuine products verified by AgriConnect experts.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
