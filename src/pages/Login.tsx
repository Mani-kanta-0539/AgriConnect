import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Sprout, Mail, Lock, ArrowRight, Loader2, User } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        // Create profile in Firestore
        await setDoc(doc(db, 'profiles', userCredential.user.uid), {
          name: name,
          email: email,
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      console.error("Auth error:", err.message);
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password. If you haven't created an account on this Firebase project yet, please register first.");
      } else {
        setError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] dark:bg-stone-950 flex items-center justify-center p-4 font-serif transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 transition-colors duration-300"
      >
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-4">
              <Sprout className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">AgriConnect</h1>
            <p className="text-stone-500 dark:text-stone-400 font-sans text-sm mt-2">
              {isRegistering ? 'Create your farmer account' : 'Welcome back, Farmer!'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1 font-sans">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border-none rounded-2xl px-12 py-4 focus:ring-2 focus:ring-emerald-500 outline-none font-sans text-stone-900 dark:text-stone-100"
                    placeholder="Enter your name"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 dark:text-stone-500" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1 font-sans">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border-none rounded-2xl px-12 py-4 focus:ring-2 focus:ring-emerald-500 outline-none font-sans text-stone-900 dark:text-stone-100"
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 dark:text-stone-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1 font-sans">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border-none rounded-2xl px-12 py-4 focus:ring-2 focus:ring-emerald-500 outline-none font-sans text-stone-900 dark:text-stone-100"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 dark:text-stone-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white rounded-2xl py-4 font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 dark:shadow-emerald-900/40 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  {isRegistering ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-stone-500 dark:text-stone-400 font-sans text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
        
        <div className="bg-stone-50 dark:bg-stone-800/50 p-6 text-center border-t border-stone-100 dark:border-stone-800">
          <p className="text-xs text-stone-400 dark:text-stone-500 font-sans">
            By continuing, you agree to AgriConnect's Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
