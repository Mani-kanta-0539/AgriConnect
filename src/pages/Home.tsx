import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  CloudSun, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  FileText,
  ArrowRight,
  Cpu,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

// 3D Farm Placeholder (CSS Art)
const IsometricFarm = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center" style={{ perspective: '1000px' }}>
      <motion.div 
        animate={{ 
          rotateY: [0, 5, 0, -5, 0],
          rotateX: [60, 62, 60, 58, 60],
          y: [0, -15, 0, 15, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-64 h-64 md:w-96 md:h-96"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(-45deg)' }}
      >
        {/* Base Island */}
        <div className="absolute inset-0 bg-[#86EFAC]/20 dark:bg-[#00332C]/80 rounded-3xl shadow-[20px_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[20px_20px_60px_rgba(0,0,0,0.5)] border border-[#86EFAC]/50 dark:border-[#86EFAC]/20 backdrop-blur-sm" style={{ transform: 'translateZ(0px)' }} />
        
        {/* Soil Layers */}
        <div className="absolute inset-4 bg-[#8d6e63]/90 dark:bg-[#2d1b15]/90 rounded-2xl" style={{ transform: 'translateZ(10px)' }} />
        <div className="absolute inset-6 bg-[#5d4037] dark:bg-[#3e2723] rounded-xl grid grid-cols-4 grid-rows-4 gap-2 p-2" style={{ transform: 'translateZ(20px)' }}>
          {/* Crops */}
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.5, z: 40 }}
              className="bg-[#86EFAC] rounded-full w-full h-full shadow-[0_0_15px_#86EFAC] cursor-pointer transition-all duration-300"
              style={{ transform: `translateZ(${10 + Math.random() * 10}px)` }}
            />
          ))}
        </div>

        {/* Glass Greenhouse */}
        <div className="absolute top-4 right-4 w-32 h-24 bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-[#86EFAC]/20 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] dark:shadow-[0_0_30px_rgba(134,239,172,0.1)]" style={{ transform: 'translateZ(40px)' }}>
          <div className="w-full h-full border-t border-l border-white/50 dark:border-[#86EFAC]/30 rounded-xl" />
        </div>

        {/* Holographic Sensor Nodes */}
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-8 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_#22d3ee]"
          style={{ transform: 'translateZ(60px)' }}
        />
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_20px_#c084fc]"
          style={{ transform: 'translateZ(80px)' }}
        />

        {/* Weather Cloud */}
        <motion.div 
          animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 left-10 w-24 h-12 bg-white/80 dark:bg-white/10 backdrop-blur-xl rounded-full shadow-[0_0_30px_rgba(255,255,255,0.5)] dark:shadow-[0_0_30px_rgba(134,239,172,0.1)] flex items-center justify-center border border-white/20 dark:border-[#86EFAC]/10"
          style={{ transform: 'translateZ(120px)' }}
        >
          <motion.div 
            animate={{ opacity: [0, 1, 0], y: [0, 20] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -bottom-4 w-1 h-4 bg-[#86EFAC] rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export function Home() {
  const { t } = useLanguage();

  const features = [
    { title: t('cropGuide'), icon: Sprout, path: '/crops', color: 'from-[#00332C] to-emerald-800 dark:from-[#86EFAC] dark:to-emerald-400', textColor: 'text-white dark:text-[#00332C]' },
    { title: t('weatherForecast'), icon: CloudSun, path: '/weather', color: 'from-blue-400 to-blue-600', textColor: 'text-white' },
    { title: t('marketRates'), icon: TrendingUp, path: '/market', color: 'from-orange-400 to-orange-600', textColor: 'text-white' },
    { title: t('communityForum'), icon: Users, path: '/community', color: 'from-purple-400 to-purple-600', textColor: 'text-white' },
    { title: t('marketplace'), icon: ShoppingBag, path: '/marketplace', color: 'from-rose-400 to-rose-600', textColor: 'text-white' },
    { title: 'IoT Dashboard', icon: Cpu, path: '/iot-dashboard', color: 'from-cyan-400 to-cyan-600', textColor: 'text-white' },
  ];

  return (
    <div className="w-full bg-[#f5f5f0] dark:bg-[#00332C] min-h-screen text-stone-900 dark:text-stone-100 font-sans overflow-hidden selection:bg-[#86EFAC]/30 transition-colors duration-300">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#86EFAC]/20 dark:bg-[#86EFAC]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Glassmorphism Nav/Header */}
        <nav className="flex items-center justify-between bg-white/50 dark:bg-[#00332C]/40 backdrop-blur-[12px] border border-stone-200 dark:border-[#86EFAC]/10 rounded-full px-6 py-4 mb-16 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00332C] to-emerald-800 dark:from-[#86EFAC] dark:to-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(134,239,172,0.3)] dark:shadow-[0_0_15px_rgba(134,239,172,0.5)]">
              <Sprout className="w-5 h-5 text-white dark:text-[#00332C]" />
            </div>
            <span className="text-xl font-serif font-bold tracking-wide text-[#00332C] dark:text-[#86EFAC]">AgriConnect</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 dark:text-stone-300">
            <Link to="/crops" className="hover:text-[#00332C] dark:hover:text-[#86EFAC] transition-colors">Platform</Link>
            <Link to="/iot-dashboard" className="hover:text-[#00332C] dark:hover:text-[#86EFAC] transition-colors">IoT Solutions</Link>
            <Link to="/market" className="hover:text-[#00332C] dark:hover:text-[#86EFAC] transition-colors">Markets</Link>
          </div>
          <Link to="/iot-dashboard" className="bg-[#00332C] hover:bg-emerald-800 dark:bg-[#86EFAC] dark:hover:bg-emerald-400 text-white dark:text-[#00332C] px-5 py-2 rounded-full font-bold text-sm transition-all shadow-[0_0_20px_rgba(0,51,44,0.3)] dark:shadow-[0_0_20px_rgba(134,239,172,0.3)] hover:shadow-[0_0_30px_rgba(0,51,44,0.5)] dark:hover:shadow-[0_0_30px_rgba(134,239,172,0.5)]">
            Launch App
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] text-[#00332C] dark:text-white">
                The Future of <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00332C] to-emerald-600 dark:from-[#86EFAC] dark:to-emerald-400 filter drop-shadow-[0_0_10px_rgba(134,239,172,0.2)] dark:drop-shadow-[0_0_10px_rgba(134,239,172,0.3)]">
                  Smart Farming
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-lg leading-relaxed font-sans"
            >
              Experience ultra-modern, tech-organic agriculture. Monitor your crops in real-time with high-fidelity 3D IoT sensors and AI-driven insights.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-wrap gap-4"
            >
              <Link 
                to="/iot-dashboard" 
                className="group relative inline-flex items-center gap-3 bg-white/50 dark:bg-[#00332C]/40 hover:bg-white/80 dark:hover:bg-[#00332C]/60 backdrop-blur-[12px] border border-stone-200 dark:border-[#86EFAC]/20 text-[#00332C] dark:text-white px-8 py-4 rounded-full font-bold transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#86EFAC]/10 to-cyan-500/10 dark:from-[#86EFAC]/20 dark:to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Explore Dashboard</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform text-[#86EFAC]" />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative"
          >
            <IsometricFarm />
          </motion.div>
        </div>

        {/* Floating 3D Tiles Grid */}
        <div className="mb-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-serif font-bold text-[#00332C] dark:text-white">Platform Modules</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-stone-200 dark:from-[#86EFAC]/20 to-transparent ml-8" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Link 
                  to={feature.path}
                  className="group block relative p-8 bg-white/50 dark:bg-[#00332C]/40 hover:bg-white/80 dark:hover:bg-[#00332C]/60 backdrop-blur-[12px] border border-stone-200 dark:border-[#86EFAC]/10 rounded-3xl transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(134,239,172,0.1)] overflow-hidden"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Micro-3D Icon */}
                  <div className="relative w-16 h-16 mb-6" style={{ perspective: '1000px' }}>
                    <motion.div 
                      className={`w-full h-full rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.3)]`}
                      whileHover={{ rotateX: 15, rotateY: 15, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <feature.icon className={`w-8 h-8 ${feature.textColor} filter drop-shadow-md`} />
                    </motion.div>
                  </div>

                  <h3 className="text-2xl font-bold text-[#00332C] dark:text-white mb-2 relative z-10">{feature.title}</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm relative z-10 font-sans">Access real-time data and advanced tools for optimal farming.</p>
                  
                  <div className="absolute bottom-8 right-8 w-8 h-8 rounded-full bg-stone-200/50 dark:bg-[#86EFAC]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-[#00332C] dark:text-[#86EFAC]" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* IoT Dashboard Preview */}
        <div className="relative rounded-[2.5rem] bg-white/60 dark:bg-[#00332C]/40 backdrop-blur-[12px] border border-stone-200 dark:border-[#86EFAC]/10 p-8 md:p-12 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#86EFAC]/20 border border-[#86EFAC]/30 text-[#00332C] dark:text-[#86EFAC] text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#00332C] dark:bg-[#86EFAC] animate-pulse" />
                Live Sensor Data
              </div>
              <h2 className="text-4xl font-serif font-bold text-[#00332C] dark:text-white">Projected Analytics</h2>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                Experience your farm's telemetry through neon-glow line charts projected in 3D space. Monitor soil moisture, temperature, and nutrient levels with unprecedented clarity.
              </p>
              <Link to="/iot-dashboard" className="inline-flex items-center gap-2 text-[#00332C] dark:text-[#86EFAC] font-bold hover:opacity-80 transition-opacity">
                View Full Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Neon Glow Chart Preview */}
            <div className="relative h-64" style={{ perspective: '1000px' }}>
              <motion.div 
                animate={{ rotateX: [10, 15, 10], rotateY: [-10, -5, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full bg-white/50 dark:bg-black/20 backdrop-blur-md border border-stone-200 dark:border-[#86EFAC]/20 rounded-2xl p-6 flex items-end gap-2 shadow-[0_0_50px_rgba(134,239,172,0.05)] dark:shadow-[0_0_50px_rgba(134,239,172,0.1)]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-10 dark:opacity-20 pointer-events-none">
                  {[1,2,3,4].map(i => <div key={i} className="w-full h-[1px] bg-[#86EFAC]" />)}
                </div>

                {/* Bars */}
                {[40, 70, 45, 90, 65, 80, 55].map((height, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-[#86EFAC]/30 to-[#86EFAC] dark:from-[#86EFAC]/50 dark:to-emerald-400 rounded-t-lg relative group"
                    style={{ transform: `translateZ(${i * 5}px)` }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-full h-4 bg-[#86EFAC] dark:bg-emerald-300 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
