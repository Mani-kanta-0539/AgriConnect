import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Calendar, 
  Save, 
  Loader2, 
  Camera,
  Sprout
} from 'lucide-react';
import { motion } from 'motion/react';

// 3D User Visual Anchor
const User3D = () => {
  return (
    <div className="absolute top-8 right-8 w-32 h-32 hidden md:flex items-center justify-center pointer-events-none z-0" style={{ perspective: '800px' }}>
      <motion.div
        animate={{
          rotateY: [0, 15, 0, -15, 0],
          rotateX: [10, 15, 10, 5, 10],
          y: [0, -10, 0, 10, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-20 h-24"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(10deg)' }}
      >
        {/* Head */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-emerald-500 rounded-full shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.2),0_10px_20px_rgba(0,0,0,0.3)] flex items-center justify-center border-2 border-emerald-400" style={{ transform: 'translateZ(10px)' }}>
          <User className="w-6 h-6 text-emerald-100 opacity-80" />
        </div>
        
        {/* Body */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-16 bg-emerald-600 rounded-t-3xl shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.2),0_10px_20px_rgba(0,0,0,0.3)] border-2 border-emerald-500" style={{ transform: 'translateZ(0px)' }} />
        
        {/* Glowing Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-emerald-400 rounded-full blur-2xl opacity-30" style={{ transform: 'translateZ(-20px)' }} />
      </motion.div>
    </div>
  );
};

interface UserProfile {
  location: string;
  phone: string;
  farmSize: string;
  primaryCrops: string;
  experience: string;
}

export function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    location: '',
    phone: '',
    farmSize: '',
    primaryCrops: '',
    experience: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.uid) return;
      try {
        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            location: data.location || '',
            phone: data.phone || '',
            farmSize: data.farm_size || '',
            primaryCrops: data.primary_crops || '',
            experience: data.experience || ''
          });
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setMessage({ type: 'error', text: 'Failed to fetch profile.' });
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await setDoc(doc(db, 'profiles', user.uid), {
        name: user.name,
        email: user.email,
        location: profile.location,
        phone: profile.phone,
        farm_size: profile.farmSize,
        primary_crops: profile.primaryCrops,
        experience: profile.experience,
        updated_at: new Date().toISOString(),
      }, { merge: true });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      <User3D />
      <header className="flex flex-col md:flex-row md:items-end gap-6 relative z-10">
        <div className="relative group">
          <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center border-4 border-white dark:border-stone-900 shadow-xl overflow-hidden">
            <User className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-stone-100 dark:border-stone-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-stone-700 transition-colors">
            <Camera className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 space-y-2">
          <h1 className="text-4xl font-bold text-emerald-900 dark:text-emerald-300">{user?.name}</h1>
          <p className="text-stone-500 dark:text-stone-400 font-sans flex items-center gap-2">
            <Mail className="w-4 h-4" /> {user?.email}
          </p>
        </div>
      </header>

      {message.text && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl font-sans text-sm ${
            message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-stone-900 p-8 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 transition-colors duration-300">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Personal Details
          </h2>
          
          <div className="space-y-4 font-sans">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Location</label>
              <div className="relative">
                <input 
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border-none rounded-xl px-10 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-stone-900 dark:text-stone-100"
                  placeholder="e.g. Guntur, Andhra Pradesh"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 dark:text-stone-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <input 
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border-none rounded-xl px-10 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-stone-900 dark:text-stone-100"
                  placeholder="+91 98765 43210"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 dark:text-stone-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-8 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 transition-colors duration-300">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Farm Information
          </h2>
          
          <div className="space-y-4 font-sans">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Farm Size (Acres)</label>
              <div className="relative">
                <input 
                  type="text"
                  value={profile.farmSize}
                  onChange={(e) => setProfile({...profile, farmSize: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border-none rounded-xl px-10 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-stone-900 dark:text-stone-100"
                  placeholder="e.g. 5"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 dark:text-stone-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Primary Crops</label>
              <div className="relative">
                <input 
                  type="text"
                  value={profile.primaryCrops}
                  onChange={(e) => setProfile({...profile, primaryCrops: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border-none rounded-xl px-10 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-stone-900 dark:text-stone-100"
                  placeholder="e.g. Paddy, Cotton"
                />
                <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 dark:text-stone-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 dark:shadow-emerald-900/40 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
