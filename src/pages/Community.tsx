import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, Heart, Share2, User, Users, Phone, MapPin, CheckCircle, Send, Image as ImageIcon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// 3D Globe Visual Anchor
const Globe3D = () => {
  return (
    <div className="absolute top-8 right-8 w-32 h-32 hidden md:flex items-center justify-center pointer-events-none z-0" style={{ perspective: '800px' }}>
      <motion.div
        animate={{
          rotateY: [0, 360],
          rotateX: [10, 20, 10],
          y: [0, -10, 0]
        }}
        transition={{ 
          rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
          rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative w-20 h-20"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(15deg)' }}
      >
        {/* Globe Sphere */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-700 dark:from-blue-600 dark:to-cyan-900 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.3)] border border-blue-400/30" style={{ transform: 'translateZ(0px)' }}>
          {/* Continents (Abstract) */}
          <div className="absolute top-2 left-2 w-8 h-6 bg-emerald-500/60 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-[1px]" />
          <div className="absolute bottom-4 right-2 w-10 h-8 bg-emerald-500/60 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-[1px]" />
          <div className="absolute top-8 right-6 w-5 h-5 bg-emerald-500/60 rounded-[50%_50%_50%_50%/50%_50%_50%_50%] blur-[1px]" />
        </div>
        
        {/* Orbit Ring */}
        <div className="absolute -inset-4 rounded-full border border-[#86EFAC]/30" style={{ transform: 'rotateX(70deg) translateZ(0px)' }} />
        
        {/* Orbiting Node */}
        <motion.div 
          animate={{ rotateZ: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 rounded-full"
          style={{ transform: 'rotateX(70deg) translateZ(0px)' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#86EFAC] rounded-full shadow-[0_0_10px_#86EFAC]" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export function Community() {
  const { t } = useLanguage();
  const [filterLocation, setFilterLocation] = useState('All');

  const locations = [
    'All', 
    'Guntur', 
    'Kurnool', 
    'Warangal', 
    'Nellore', 
    'Vijayawada', 
    'Hyderabad', 
    'Nizamabad', 
    'Khammam', 
    'Anantapur', 
    'Visakhapatnam', 
    'Karimnagar'
  ];

  const posts = [
    {
      id: 1,
      author: 'Ramesh Kumar',
      verified: true,
      location: 'Nellore',
      content: 'Successfully implemented drip irrigation for my chilli farm. Water usage reduced by 40% and yield is looking great!',
      likes: 124,
      comments: 18,
      time: '2 hours ago',
      avatar: 'https://picsum.photos/seed/ramesh/100/100'
    },
    {
      id: 2,
      author: 'Sita Devi',
      verified: false,
      location: 'Warangal',
      content: 'Anyone having issues with whiteflies in cotton this season? Looking for organic control methods.',
      likes: 45,
      comments: 32,
      time: '5 hours ago',
      avatar: 'https://picsum.photos/seed/sita/100/100'
    },
    {
      id: 3,
      author: 'Mallesh G.',
      verified: true,
      location: 'Guntur',
      content: 'The new organic fertilizer from the co-op is working wonders for my paddy field. Highly recommend it!',
      likes: 89,
      comments: 12,
      time: '1 day ago',
      avatar: 'https://picsum.photos/seed/mallesh/100/100'
    },
    {
      id: 4,
      author: 'Anjali P.',
      verified: true,
      location: 'Vijayawada',
      content: 'Looking for a tractor rental for next week. Any recommendations in the Vijayawada area?',
      likes: 12,
      comments: 5,
      time: '3 hours ago',
      avatar: 'https://picsum.photos/seed/anjali/100/100'
    }
  ];

  const filteredPosts = filterLocation === 'All' 
    ? posts 
    : posts.filter(post => post.location === filterLocation);

  const cooperatives = [
    { name: 'Guntur Farmer Co-op', location: 'Guntur', contact: '+91 98765 43210' },
    { name: 'Rythu Seva Samithi', location: 'Vijayawada', contact: '+91 98765 43211' },
    { name: 'Organic Growers Union', location: 'Kurnool', contact: '+91 98765 43212' },
    { name: 'Nellore Agri Society', location: 'Nellore', contact: '+91 98765 43213' },
    { name: 'Telangana Rythu Sangham', location: 'Hyderabad', contact: '+91 98765 43214' },
    { name: 'Warangal Cotton Growers', location: 'Warangal', contact: '+91 98765 43215' },
    { name: 'Nizamabad Turmeric Board', location: 'Nizamabad', contact: '+91 98765 43216' },
  ];

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto relative">
      <Globe3D />
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#00332C] dark:text-[#86EFAC] tracking-tight font-serif mb-2">
            Global Village
          </h1>
          <p className="text-stone-500 dark:text-stone-400 font-sans text-sm md:text-base max-w-xl">
            Connect with verified farmers, share knowledge, and grow together.
          </p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <div className="flex items-center gap-3 bg-white/60 dark:bg-[#00332C]/40 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/40 dark:border-[#86EFAC]/20 shadow-xl">
            <MapPin className="w-5 h-5 text-[#00332C] dark:text-[#86EFAC]" />
            <span className="text-sm font-semibold text-stone-500 dark:text-stone-400 font-sans">Locality:</span>
            <select 
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="bg-transparent border-none outline-none font-sans font-bold text-[#00332C] dark:text-white cursor-pointer focus:ring-0"
            >
              {locations.map(loc => (
                <option key={loc} value={loc} className="bg-white dark:bg-[#00332C]">{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Pane: 3D Globe & Cooperatives */}
        <section className="lg:col-span-4 space-y-6">
          {/* 3D Globe Visualization */}
          <div className="bg-[#00332C] rounded-[32px] p-8 shadow-xl relative overflow-hidden h-[400px] flex flex-col items-center justify-center border border-[#86EFAC]/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#86EFAC]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
            
            <h3 className="text-xl font-bold text-white mb-8 relative z-10 self-start flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#86EFAC]" /> Active Users
            </h3>
            
            {/* CSS 3D Globe Representation */}
            <div className="relative z-10 w-48 h-48 perspective-1000">
              <motion.div 
                animate={{ rotateY: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="w-full h-full rounded-full border-2 border-[#86EFAC]/30 shadow-[0_0_30px_rgba(134,239,172,0.2),inset_0_0_30px_rgba(134,239,172,0.2)] relative transform-style-3d bg-gradient-to-br from-[#00332C] to-[#001a16]"
              >
                {/* Longitude lines */}
                <div className="absolute inset-0 rounded-full border border-[#86EFAC]/20 rotate-y-45"></div>
                <div className="absolute inset-0 rounded-full border border-[#86EFAC]/20 rotate-y-90"></div>
                <div className="absolute inset-0 rounded-full border border-[#86EFAC]/20 rotate-y-135"></div>
                {/* Latitude lines */}
                <div className="absolute top-1/4 bottom-1/4 left-0 right-0 rounded-full border border-[#86EFAC]/20 rotate-x-90"></div>
                <div className="absolute top-1/2 bottom-1/2 left-0 right-0 rounded-full border border-[#86EFAC]/20 rotate-x-90"></div>
                
                {/* Active User Nodes */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-[#86EFAC] rounded-full shadow-[0_0_10px_#86EFAC]"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                      transform: `translateZ(${Math.random() * 20 + 20}px)`
                    }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 + Math.random() * 2, delay: Math.random() * 2 }}
                  />
                ))}
              </motion.div>
            </div>
            
            <div className="mt-8 text-center relative z-10">
              <p className="text-3xl font-bold text-[#86EFAC]">1,248</p>
              <p className="text-xs text-stone-400 font-sans uppercase tracking-widest mt-1">Farmers Online</p>
            </div>
          </div>

          {/* Cooperatives Card */}
          <div className="bg-white/60 dark:bg-[#00332C]/40 backdrop-blur-[12px] p-8 rounded-[32px] shadow-xl border border-white/20 dark:border-[#86EFAC]/10">
            <h3 className="text-xl font-bold mb-6 text-[#00332C] dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#86EFAC]" /> Local Cooperatives
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cooperatives.map((coop, idx) => (
                <div key={idx} className="p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-stone-200 dark:border-[#86EFAC]/10 hover:bg-stone-50 dark:hover:bg-[#86EFAC]/5 transition-colors group">
                  <h4 className="font-bold text-sm text-[#00332C] dark:text-[#86EFAC] mb-1">{coop.name}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {coop.location}
                  </p>
                  <a href={`tel:${coop.contact}`} className="inline-flex items-center gap-2 bg-stone-100 dark:bg-[#00332C] px-3 py-1.5 rounded-lg text-[#00332C] dark:text-white text-xs font-bold font-sans hover:bg-stone-200 dark:hover:bg-[#00443b] transition-colors">
                    <Phone className="w-3 h-3" /> {coop.contact}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Pane: Forum Posts - Chat Style */}
        <section className="lg:col-span-8 space-y-6">
          {/* Create Post Input */}
          <div className="bg-white/60 dark:bg-[#00332C]/40 backdrop-blur-[12px] p-6 rounded-[32px] border border-white/20 dark:border-[#86EFAC]/10 shadow-xl">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden shrink-0 border-2 border-white dark:border-[#00332C] shadow-sm">
                <img src="https://picsum.photos/seed/currentuser/100/100" alt="You" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-grow">
                <textarea 
                  placeholder="Share your success story or ask a question..."
                  className="w-full p-4 rounded-[24px] bg-white/50 dark:bg-black/20 border border-stone-200 dark:border-[#86EFAC]/20 text-[#00332C] dark:text-white focus:bg-white dark:focus:bg-black/40 focus:ring-2 focus:ring-[#86EFAC] outline-none font-sans resize-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-4">
                  <button className="p-2 text-stone-400 hover:text-[#00332C] dark:hover:text-[#86EFAC] hover:bg-white/50 dark:hover:bg-white/10 rounded-full transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button className="bg-[#00332C] dark:bg-[#86EFAC] text-white dark:text-[#00332C] px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[#00332C]/20 dark:shadow-[#86EFAC]/20 flex items-center gap-2">
                    <span>Post</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <motion.div 
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/60 dark:bg-[#00332C]/40 backdrop-blur-[12px] p-6 md:p-8 rounded-[32px] border border-white/20 dark:border-[#86EFAC]/10 shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-[#00332C] shadow-sm">
                        <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      {post.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#00332C] rounded-full p-0.5 shadow-sm">
                          <CheckCircle className="w-4 h-4 text-[#00332C] dark:text-[#86EFAC] fill-[#86EFAC] dark:fill-transparent" />
                          {/* Pulsing effect for verified badge */}
                          <div className="absolute inset-0 rounded-full bg-[#86EFAC] animate-ping opacity-40"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-lg text-[#00332C] dark:text-white flex items-center gap-2">
                          {post.author}
                          {post.verified && <span className="text-[10px] bg-[#86EFAC]/20 text-[#00332C] dark:text-[#86EFAC] px-2 py-0.5 rounded-full font-sans font-bold tracking-wider uppercase">Verified Farmer</span>}
                        </h4>
                        <span className="text-xs text-stone-400 font-sans">{post.time}</span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-sans flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {post.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pl-16">
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-sans text-sm md:text-base">{post.content}</p>
                    
                    <div className="flex items-center gap-6 mt-6 pt-4 border-t border-stone-200/50 dark:border-stone-700/50 text-stone-500 dark:text-stone-400 font-sans text-sm">
                      <button className="flex items-center gap-2 hover:text-rose-500 transition-colors group">
                        <div className="p-2 rounded-full group-hover:bg-rose-500/10 transition-colors">
                          <Heart className="w-5 h-5 group-hover:fill-rose-500" />
                        </div>
                        <span className="font-bold">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-[#00332C] dark:hover:text-[#86EFAC] transition-colors group">
                        <div className="p-2 rounded-full group-hover:bg-[#00332C]/10 dark:group-hover:bg-[#86EFAC]/10 transition-colors">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <span className="font-bold">{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-[#00332C] dark:hover:text-[#86EFAC] transition-colors group ml-auto">
                        <div className="p-2 rounded-full group-hover:bg-[#00332C]/10 dark:group-hover:bg-[#86EFAC]/10 transition-colors">
                          <Share2 className="w-5 h-5" />
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-16 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-[32px] border border-dashed border-stone-300 dark:border-stone-700">
                <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-stone-300 dark:text-stone-600" />
                </div>
                <p className="text-stone-500 dark:text-stone-400 font-sans text-lg">No posts found for {filterLocation}.</p>
                <button 
                  onClick={() => setFilterLocation('All')}
                  className="mt-4 text-[#00332C] dark:text-[#86EFAC] font-bold hover:underline"
                >
                  View all locations
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
