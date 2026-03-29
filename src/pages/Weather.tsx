import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Cloud, CloudRain, Sun, Wind, Thermometer, Droplets, MapPin, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// 3D Cloud Visual Anchor
const Cloud3D = () => {
  return (
    <div className="absolute top-8 right-8 w-32 h-32 hidden md:flex items-center justify-center pointer-events-none z-0" style={{ perspective: '800px' }}>
      <motion.div
        animate={{
          rotateY: [0, 15, 0, -15, 0],
          rotateX: [10, 15, 10, 5, 10],
          y: [0, -15, 0, 15, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-24 h-24"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(10deg)' }}
      >
        {/* Cloud Body */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(0px)' }}>
          <div className="w-20 h-10 bg-white dark:bg-stone-200 rounded-full shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.1),0_20px_40px_rgba(0,0,0,0.2)] relative">
            <div className="absolute -top-6 left-2 w-10 h-10 bg-white dark:bg-stone-200 rounded-full shadow-[inset_-2px_-2px_10px_rgba(0,0,0,0.05)]" />
            <div className="absolute -top-8 right-3 w-12 h-12 bg-white dark:bg-stone-200 rounded-full shadow-[inset_-2px_-2px_10px_rgba(0,0,0,0.05)]" />
          </div>
        </div>
        
        {/* Raindrops */}
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          className="absolute bottom-[-10px] left-6 w-1 h-3 bg-blue-400 rounded-full" 
          style={{ transform: 'translateZ(10px)' }} 
        />
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-[-15px] left-12 w-1 h-3 bg-blue-400 rounded-full" 
          style={{ transform: 'translateZ(5px)' }} 
        />
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[-5px] right-6 w-1 h-3 bg-blue-400 rounded-full" 
          style={{ transform: 'translateZ(15px)' }} 
        />
        
        {/* Glowing Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-20" style={{ transform: 'translateZ(-20px)' }} />
      </motion.div>
    </div>
  );
};

export function Weather() {
  const { t } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState('Guntur, Andhra Pradesh');
  const [isLocating, setIsLocating] = useState(false);

  const locations = [
    'Guntur, Andhra Pradesh',
    'Kurnool, Andhra Pradesh',
    'Warangal, Telangana',
    'Nellore, Andhra Pradesh',
    'Vijayawada, Andhra Pradesh',
    'Hyderabad, Telangana',
    'Nizamabad, Telangana',
    'Khammam, Telangana',
    'Anantapur, Andhra Pradesh',
    'Visakhapatnam, Andhra Pradesh',
    'Karimnagar, Telangana',
    'Rajahmundry, Andhra Pradesh',
    'Tirupati, Andhra Pradesh',
    'Mahbubnagar, Telangana',
    'Nalgonda, Telangana'
  ];

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLocation(`My Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please ensure location permissions are granted.');
        setIsLocating(false);
      }
    );
  };

  const getWeatherData = (loc: string) => {
    let hash = 0;
    for (let i = 0; i < loc.length; i++) {
      hash = ((hash << 5) - hash) + loc.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);
    
    return {
      temp: 26 + (absHash % 10),
      condition: absHash % 4 === 0 ? 'Sunny' : absHash % 4 === 1 ? 'Cloudy' : absHash % 4 === 2 ? 'Partly Cloudy' : 'Light Rain',
      humidity: 35 + (absHash % 30),
      wind: 8 + (absHash % 12),
      location: loc
    };
  };

  const current = getWeatherData(selectedLocation);

  const forecast = [
    { day: 'Mon', temp: current.temp + 1, icon: Sun },
    { day: 'Tue', temp: current.temp - 1, icon: Cloud },
    { day: 'Wed', temp: current.temp - 3, icon: CloudRain },
    { day: 'Thu', temp: current.temp - 2, icon: Cloud },
    { day: 'Fri', temp: current.temp + 2, icon: Sun },
  ];

  return (
    <div className="space-y-8 relative">
      <Cloud3D />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <h1 className="text-4xl font-bold text-[#00332C] dark:text-[#86EFAC]">{t('weatherForecast')}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="flex items-center gap-2 bg-[#86EFAC]/20 text-[#00332C] dark:text-[#86EFAC] px-4 py-2 rounded-2xl border border-[#86EFAC]/30 font-sans font-bold hover:bg-[#86EFAC]/30 transition-colors disabled:opacity-50 backdrop-blur-md"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-pulse' : ''}`} />
            {isLocating ? 'Locating...' : 'Use My Location'}
          </button>
          <div className="flex items-center gap-2 bg-white/10 dark:bg-[#00332C]/40 px-4 py-2 rounded-2xl border border-white/20 dark:border-[#86EFAC]/20 shadow-sm backdrop-blur-md">
            <MapPin className="w-4 h-4 text-[#00332C] dark:text-[#86EFAC]" />
            <select 
              value={locations.includes(selectedLocation) ? selectedLocation : ''}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-transparent border-none outline-none font-sans font-bold text-[#00332C] dark:text-white cursor-pointer appearance-none"
            >
              {!locations.includes(selectedLocation) && (
                <option value="">{selectedLocation}</option>
              )}
              {locations.map(loc => (
                <option key={loc} value={loc} className="text-gray-900">{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8 relative z-10">
        {/* Current Weather */}
        <AnimatePresence mode="wait">
          <motion.section 
            key={selectedLocation}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="md:col-span-2 bg-gradient-to-br from-[#00332C] to-[#004d43] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
            <div className="relative z-10">
              <p className="text-[#86EFAC] font-sans mb-1 text-lg">{current.location}</p>
              <div className="flex items-end gap-4 mb-8">
                <span className="text-8xl font-bold tracking-tighter">{current.temp}°</span>
                <span className="text-3xl mb-3 font-light text-white/80">{current.condition}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 font-sans">
                <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                  <Thermometer className="w-6 h-6 mb-3 text-[#86EFAC]" />
                  <p className="text-xs text-white/60 uppercase tracking-wider font-bold mb-1">Feels Like</p>
                  <p className="text-xl font-bold">{current.temp + 3}°C</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                  <Droplets className="w-6 h-6 mb-3 text-[#86EFAC]" />
                  <p className="text-xs text-white/60 uppercase tracking-wider font-bold mb-1">Humidity</p>
                  <p className="text-xl font-bold">{current.humidity}%</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                  <Wind className="w-6 h-6 mb-3 text-[#86EFAC]" />
                  <p className="text-xs text-white/60 uppercase tracking-wider font-bold mb-1">Wind</p>
                  <p className="text-xl font-bold">{current.wind} km/h</p>
                </div>
              </div>
            </div>
            <Sun className="absolute -top-20 -right-20 w-96 h-96 text-white/5 rotate-45" />
          </motion.section>
        </AnimatePresence>

        {/* 5-Day Forecast */}
        <section className="bg-white/40 dark:bg-[#00332C]/40 backdrop-blur-xl rounded-3xl p-8 border border-white/40 dark:border-[#86EFAC]/20 shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-[#00332C] dark:text-[#86EFAC]">5-Day Forecast</h3>
          <div className="space-y-4">
            {forecast.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors border border-white/20 dark:border-transparent">
                <span className="font-bold text-[#00332C] dark:text-white/80 w-12">{item.day}</span>
                <item.icon className="w-6 h-6 text-[#00332C] dark:text-[#86EFAC]" />
                <span className="font-bold text-[#00332C] dark:text-white text-lg">{item.temp}°</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Advice Section */}
      <section className="bg-gradient-to-r from-[#86EFAC]/20 to-transparent border border-[#86EFAC]/30 rounded-3xl p-8 flex flex-col md:flex-row items-start gap-6 backdrop-blur-md relative z-10">
        <div className="bg-[#00332C] p-4 rounded-2xl shadow-lg shrink-0">
          <CloudRain className="w-8 h-8 text-[#86EFAC]" />
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-[#00332C] dark:text-[#86EFAC]">Smart Farming Advice</h3>
          <p className="text-[#00332C]/80 dark:text-white/80 font-sans text-lg leading-relaxed">
            Weather patterns in <span className="font-bold">{selectedLocation.split('(')[0].trim()}</span> suggest {current.condition.toLowerCase()} conditions. 
            {current.condition === 'Sunny' ? ' Ideal for harvesting and drying crops. Ensure adequate irrigation.' : 
             current.condition === 'Light Rain' ? ' Good for soil moisture, but avoid spraying pesticides today.' :
             ' Keep an eye on moisture levels and potential pest activity.'}
          </p>
        </div>
      </section>
    </div>
  );
}
