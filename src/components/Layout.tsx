import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LanguageSelector } from './LanguageSelector';
import { 
  Home, 
  Sprout, 
  CloudSun, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  FileText, 
  Menu, 
  X,
  AlertCircle,
  Calculator,
  LogOut,
  User,
  Cpu,
  Moon,
  Sun,
  Bell,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GrootChat } from './GrootChat';

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: t('home'), icon: Home },
    { path: '/crops', label: t('crops'), icon: Sprout },
    { path: '/pest-diagnosis', label: t('pestDiagnosis'), icon: AlertCircle },
    { path: '/weather', label: t('weather'), icon: CloudSun },
    { path: '/market', label: t('market'), icon: TrendingUp },
    { path: '/iot-dashboard', label: 'IoT Dashboard', icon: Cpu },
    { path: '/community', label: t('community'), icon: Users },
    { path: '/marketplace', label: t('marketplace'), icon: ShoppingBag },
    { path: '/resources', label: t('resources'), icon: FileText },
    { path: '/loan-calculator', label: t('loanCalculator'), icon: Calculator },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const getPageTitle = (path: string) => {
    const item = navItems.find(i => i.path === path);
    return item ? item.label : 'Page';
  };

  const get3DAnchor = (path: string) => {
    switch (path) {
      case '/market':
      case '/marketplace':
      case '/crops':
      case '/community':
      case '/iot-dashboard':
      case '/weather':
      case '/pest-diagnosis':
      case '/resources':
      case '/loan-calculator':
      case '/profile':
        return null; // Using custom 3D components on these pages
      default:
        return '✨';
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 px-4 dark:bg-stone-900">
      <div className="flex items-center justify-between px-2 mb-10">
        <div className="flex items-center gap-2">
          <Sprout className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          <span className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 tracking-tight">{t('appName')}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 dark:shadow-emerald-900/40'
                : 'text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-emerald-400'
            }`}
          >
            <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-white' : 'text-stone-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="pt-6 mt-6 border-t border-stone-100 dark:border-stone-800 space-y-6">
        {user && (
          <div className="px-4 py-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl flex items-center justify-between gap-3">
            <Link 
              to="/profile" 
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-stone-800 dark:text-stone-200 truncate">{user.name}</p>
                <p className="text-[10px] text-stone-400 dark:text-stone-500 font-sans truncate">{user.email}</p>
              </div>
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 text-stone-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}

        <div>
          <p className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-sans font-bold px-4 mb-4">
            {t('selectLanguage')}
          </p>
          <div className="px-2">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f0] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-serif flex transition-colors duration-300">
      {/* Sidebar Overlay (All Screens) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-stone-900 z-[70] shadow-2xl overflow-y-auto custom-scrollbar"
            >
              <SidebarContent />
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-6 right-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Global Header */}
        <header className="sticky top-0 z-50 bg-[#00332C]/80 dark:bg-[#00332C]/90 backdrop-blur-[12px] border-b border-white/10 transition-colors duration-300">
          <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-[#86EFAC] hover:bg-white/10 rounded-xl transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* 3D Breadcrumbs */}
              <div className="hidden md:flex items-center gap-2 text-sm font-sans font-bold">
                <Link to="/" className="text-[#86EFAC]/60 hover:text-[#86EFAC] transition-colors flex items-center gap-1">
                  <Home className="w-4 h-4" /> Home
                </Link>
                {location.pathname !== '/' && (
                  <>
                    <ChevronRight className="w-4 h-4 text-[#86EFAC]/40" />
                    <span className="text-[#86EFAC] drop-shadow-[0_0_8px_rgba(134,239,172,0.5)]">
                      {getPageTitle(location.pathname)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 text-[#86EFAC] hover:bg-white/10 rounded-xl transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Notification Bell */}
              <button className="relative p-2 text-[#86EFAC] hover:bg-white/10 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              </button>
              
              {/* Avatar */}
              <Link to="/profile" className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#86EFAC] to-emerald-600 p-[2px] shadow-[0_0_12px_rgba(134,239,172,0.3)]">
                <div className="w-full h-full bg-[#00332C] rounded-full flex items-center justify-center overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-[#86EFAC]" />
                  )}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* 3D Visual Anchor (Top Right) */}
        {location.pathname !== '/' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            className="absolute top-20 right-8 text-6xl drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)] z-40 hidden lg:block pointer-events-none"
            style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.2))' }}
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              {get3DAnchor(location.pathname)}
            </motion.div>
          </motion.div>
        )}

        {/* Main Content */}
        <main className={`flex-1 w-full ${location.pathname === '/' ? '' : 'p-4 md:p-8 lg:p-12 max-w-7xl mx-auto'}`}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={location.pathname === '/' ? 'h-full' : ''}
          >
            {children}
          </motion.div>
        </main>

        {/* Mobile Bottom Quick Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-4 py-2 flex justify-around items-center z-50 transition-colors duration-300">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                location.pathname === item.path
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-stone-400 dark:text-stone-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold font-sans">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center gap-1 p-2 text-stone-400 dark:text-stone-500"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-bold font-sans">Menu</span>
          </button>
        </nav>
      </div>
      <GrootChat />
    </div>
  );
}
