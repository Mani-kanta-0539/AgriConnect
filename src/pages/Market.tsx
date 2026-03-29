import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TrendingUp, TrendingDown, MapPin, Calendar, Navigation, ShoppingCart, Tag } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'motion/react';

// 3D Basket Visual Anchor
const Basket3D = () => {
  return (
    <div className="absolute top-8 right-8 w-32 h-32 hidden md:flex items-center justify-center pointer-events-none z-0" style={{ perspective: '800px' }}>
      <motion.div
        animate={{
          rotateY: [0, 15, 0, -15, 0],
          rotateX: [10, 15, 10, 5, 10],
          y: [0, -8, 0, 8, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-24 h-20"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(10deg)' }}
      >
        {/* Basket Bottom */}
        <div className="absolute bottom-0 left-2 right-2 h-16 bg-orange-700 dark:bg-orange-900 rounded-b-xl shadow-xl border-b-4 border-orange-800 dark:border-orange-950" style={{ transform: 'translateZ(0px)' }}>
          {/* Weave pattern */}
          <div className="w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz4KPC9zdmc+')]"></div>
        </div>
        {/* Basket Rim */}
        <div className="absolute top-2 left-0 right-0 h-4 bg-orange-600 dark:bg-orange-800 rounded-full border-2 border-orange-500 dark:border-orange-700 shadow-md" style={{ transform: 'translateZ(10px)' }} />
        
        {/* Produce inside */}
        <div className="absolute top-0 left-4 w-6 h-6 bg-rose-500 rounded-full shadow-inner" style={{ transform: 'translateZ(5px)' }} />
        <div className="absolute -top-2 left-10 w-8 h-8 bg-emerald-500 rounded-full shadow-inner" style={{ transform: 'translateZ(8px)' }} />
        <div className="absolute top-1 right-4 w-7 h-7 bg-yellow-400 rounded-full shadow-inner" style={{ transform: 'translateZ(2px)' }} />
        
        {/* Basket Handle */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 border-4 border-orange-800 dark:border-orange-950 rounded-t-full border-b-0" style={{ transform: 'translateZ(5px)' }} />
      </motion.div>
    </div>
  );
};

interface MarketInfo {
  name: string;
  lat: number;
  lng: number;
}

export function Market() {
  const { t } = useLanguage();
  const [selectedMarket, setSelectedMarket] = useState('Guntur');
  const [isLocating, setIsLocating] = useState(false);

  const markets: MarketInfo[] = [
    { name: 'Guntur (AP)', lat: 16.3067, lng: 80.4365 },
    { name: 'Kurnool (AP)', lat: 15.8281, lng: 78.0373 },
    { name: 'Warangal (TS)', lat: 17.9689, lng: 79.5941 },
    { name: 'Nellore (AP)', lat: 14.4426, lng: 79.9865 },
    { name: 'Vijayawada (AP)', lat: 16.5062, lng: 80.6480 },
    { name: 'Hyderabad (TS)', lat: 17.3850, lng: 78.4867 },
    { name: 'Nizamabad (TS)', lat: 18.6725, lng: 78.0941 },
    { name: 'Khammam (TS)', lat: 17.2473, lng: 80.1514 },
    { name: 'Anantapur (AP)', lat: 14.6819, lng: 77.6006 },
    { name: 'Visakhapatnam (AP)', lat: 17.6868, lng: 83.2185 },
    { name: 'Karimnagar (TS)', lat: 18.4386, lng: 79.1288 },
    { name: 'Rajahmundry (AP)', lat: 17.0005, lng: 81.7729 },
  ];

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleDetectNearestMarket = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        let nearest = markets[0];
        let minDistance = calculateDistance(latitude, longitude, nearest.lat, nearest.lng);

        markets.forEach((market) => {
          const distance = calculateDistance(latitude, longitude, market.lat, market.lng);
          if (distance < minDistance) {
            minDistance = distance;
            nearest = market;
          }
        });

        setSelectedMarket(nearest.name);
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please ensure location permissions are granted.');
        setIsLocating(false);
      }
    );
  };

  // Mock price data generator based on market
  const getMarketPrices = (market: string) => {
    const basePrices: Record<string, number> = {
      'Paddy (Basmati)': 3400,
      'Cotton': 7100,
      'Turmeric': 12500,
      'Maize': 2000,
      'Chilli (Dry)': 18000
    };

    const offset = market.length * 10;
    
    return [
      { crop: 'Paddy (Basmati)', price: `₹${basePrices['Paddy (Basmati)'] + offset}`, unit: 'per Quintal', trend: 'up', change: '+₹50', image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=400' },
      { crop: 'Cotton', price: `₹${basePrices['Cotton'] - offset}`, unit: 'per Quintal', trend: 'down', change: '-₹120', image: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cb?auto=format&fit=crop&q=80&w=400' },
      { crop: 'Turmeric', price: `₹${basePrices['Turmeric'] + offset * 2}`, unit: 'per Quintal', trend: 'up', change: '+₹400', image: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&q=80&w=400' },
      { crop: 'Maize', price: `₹${basePrices['Maize'] + offset / 2}`, unit: 'per Quintal', trend: 'stable', change: '₹0', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400' },
      { crop: 'Chilli (Dry)', price: `₹${basePrices['Chilli (Dry)'] + offset * 5}`, unit: 'per Quintal', trend: 'up', change: '+₹1,200', image: 'https://images.unsplash.com/photo-1588167056760-70f907101e49?auto=format&fit=crop&q=80&w=400' },
    ];
  };

  const prices = getMarketPrices(selectedMarket);

  const chartData = [
    { name: 'Jan', price: 3100 },
    { name: 'Feb', price: 3250 },
    { name: 'Mar', price: 3450 },
    { name: 'Apr', price: 3300 },
    { name: 'May', price: 3450 + (selectedMarket.length * 5) },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto relative">
      <Basket3D />
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#00332C] dark:text-[#86EFAC] tracking-tight">
            Smart Marketplace
          </h1>
          <p className="text-stone-500 dark:text-stone-400 font-sans mt-3 flex items-center gap-3 text-lg">
            <span className="flex items-center gap-1 bg-white/60 dark:bg-black/20 px-3 py-1 rounded-full border border-stone-200 dark:border-[#86EFAC]/20 backdrop-blur-sm">
              <MapPin className="w-4 h-4 text-[#00332C] dark:text-[#86EFAC]" /> {selectedMarket}
            </span>
            <span className="flex items-center gap-1 bg-white/60 dark:bg-black/20 px-3 py-1 rounded-full border border-stone-200 dark:border-[#86EFAC]/20 backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-[#00332C] dark:text-[#86EFAC]" /> Today, 10:30 AM
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleDetectNearestMarket}
            disabled={isLocating}
            className="flex items-center gap-2 bg-[#00332C] dark:bg-[#86EFAC] text-white dark:text-[#00332C] px-5 py-3 rounded-xl font-sans font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-[#00332C]/20 dark:shadow-[#86EFAC]/20"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-pulse' : ''}`} />
            {isLocating ? 'Detecting...' : 'Nearest Market'}
          </button>
          <div className="relative">
            <select 
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="appearance-none pl-5 pr-10 py-3 rounded-xl border border-stone-200 dark:border-[#86EFAC]/30 bg-white/80 dark:bg-[#00332C]/60 text-[#00332C] dark:text-white font-sans font-bold outline-none focus:ring-2 focus:ring-[#86EFAC] cursor-pointer backdrop-blur-md shadow-sm"
            >
              {markets.map(market => (
                <option key={market.name} value={market.name} className="bg-white dark:bg-[#00332C]">{market.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 dark:text-[#86EFAC]">
              ▼
            </div>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* High-Res Product Cards */}
        <section className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
          {prices.map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="group relative bg-white/60 dark:bg-[#00332C]/40 backdrop-blur-[12px] rounded-[24px] border border-white/20 dark:border-[#86EFAC]/10 shadow-xl overflow-hidden"
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img 
                  src={item.image} 
                  alt={item.crop} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">{item.crop}</h3>
                  <p className="text-white/80 font-sans text-sm flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {item.unit}
                  </p>
                </div>
              </div>
              
              <div className="p-6 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1 font-sans">Current Price</p>
                  <p className="text-3xl font-bold text-[#00332C] dark:text-[#86EFAC]">{item.price}</p>
                </div>
                <div className={`flex flex-col items-end gap-1 text-sm font-bold font-sans ${
                  item.trend === 'up' ? 'text-emerald-600 dark:text-[#86EFAC]' : item.trend === 'down' ? 'text-rose-600 dark:text-rose-400' : 'text-stone-400'
                }`}>
                  <div className="flex items-center gap-1 bg-white/50 dark:bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                    {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : item.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
                    {item.change}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Trend Chart */}
        <section className="space-y-6">
          <div className="bg-white/60 dark:bg-[#00332C]/40 backdrop-blur-[12px] rounded-[24px] p-8 border border-white/20 dark:border-[#86EFAC]/10 shadow-xl h-fit sticky top-24">
            <h3 className="text-xl font-bold mb-6 text-[#00332C] dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#86EFAC]" />
              Paddy Price Trend
            </h3>
            <div className="h-[300px] w-full font-sans">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(134,239,172,0.1)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{
                      borderRadius: '16px', 
                      border: '1px solid rgba(134,239,172,0.2)', 
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                      backgroundColor: 'rgba(0,51,44,0.9)',
                      color: '#fff',
                      backdropFilter: 'blur(8px)'
                    }}
                    itemStyle={{ color: '#86EFAC' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#86EFAC" 
                    strokeWidth={4} 
                    dot={{r: 6, fill: '#00332C', strokeWidth: 2, stroke: '#86EFAC'}}
                    activeDot={{r: 8, fill: '#86EFAC', stroke: '#fff'}}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-6 text-center font-sans bg-white/30 dark:bg-black/20 py-2 rounded-lg">
              Data based on last 5 months average in {selectedMarket}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
