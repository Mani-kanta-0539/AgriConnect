import { useLanguage } from '../context/LanguageContext';
import { Calculator, ShieldCheck, IndianRupee } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

// 3D Coin Visual Anchor
const Coin3D = () => {
  return (
    <div className="absolute top-8 right-8 w-32 h-32 hidden md:flex items-center justify-center pointer-events-none z-0" style={{ perspective: '800px' }}>
      <motion.div
        animate={{
          rotateY: [0, 360],
          y: [0, -15, 0]
        }}
        transition={{ 
          rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative w-20 h-20"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Coin Faces */}
        <div className="absolute inset-0 bg-yellow-400 rounded-full shadow-[inset_-5px_-5px_15px_rgba(180,130,0,0.5),0_10px_20px_rgba(0,0,0,0.3)] flex items-center justify-center border-4 border-yellow-500" style={{ transform: 'translateZ(4px)' }}>
          <IndianRupee className="w-10 h-10 text-yellow-700 drop-shadow-sm" />
        </div>
        <div className="absolute inset-0 bg-yellow-500 rounded-full shadow-[inset_5px_5px_15px_rgba(180,130,0,0.5)] flex items-center justify-center border-4 border-yellow-600" style={{ transform: 'translateZ(-4px) rotateY(180deg)' }}>
          <IndianRupee className="w-10 h-10 text-yellow-800 drop-shadow-sm" />
        </div>
        
        {/* Coin Edge */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute top-0 left-1/2 w-2 h-full bg-yellow-600" 
            style={{ 
              transform: `translateX(-50%) rotateY(${i * 18}deg) translateZ(40px)`,
              backfaceVisibility: 'hidden'
            }} 
          />
        ))}
        
        {/* Glowing Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-30" style={{ transform: 'translateZ(-20px)' }} />
      </motion.div>
    </div>
  );
};

export function LoanCalculator() {
  const { t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(7);
  const [tenure, setTenure] = useState<number>(12);

  const monthlyInterest = interestRate / 100 / 12;
  const emi = (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, tenure)) / (Math.pow(1 + monthlyInterest, tenure) - 1);

  return (
    <div className="space-y-12 relative">
      <Coin3D />
      <header className="space-y-4 relative z-10">
        <h1 className="text-4xl font-bold text-emerald-900 dark:text-[#86EFAC]">{t('loanCalculator')}</h1>
        <p className="text-stone-600 dark:text-stone-400 max-w-2xl font-sans">
          Plan your agricultural finances by calculating your monthly loan repayments and interest costs.
        </p>
      </header>

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <section className="bg-white/60 dark:bg-[#00332C]/40 backdrop-blur-xl p-8 rounded-[24px] border border-white/40 dark:border-[#86EFAC]/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-6">
          <div className="flex items-center gap-3 text-[#00332C] dark:text-[#86EFAC]">
            <Calculator className="w-6 h-6" />
            <h2 className="text-2xl font-bold">{t('loanCalculator')}</h2>
          </div>
          
          <div className="grid gap-8 font-sans">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Loan Amount (₹)</label>
                <span className="text-xl font-bold text-[#00332C] dark:text-[#86EFAC]">₹{loanAmount.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="10000" 
                max="1000000" 
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#00332C] dark:accent-[#86EFAC]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Interest Rate (%)</label>
                <input 
                  type="number" 
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm rounded-xl border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-[#86EFAC] focus:border-[#00332C] font-bold text-[#00332C] dark:text-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Tenure (Months)</label>
                <input 
                  type="number" 
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm rounded-xl border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-[#86EFAC] focus:border-[#00332C] font-bold text-[#00332C] dark:text-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-200 dark:border-stone-700">
            <div className="bg-gradient-to-br from-[#00332C] to-[#004d43] p-8 rounded-[24px] text-center shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
              <div className="relative z-10">
                <p className="text-xs text-[#86EFAC] font-bold uppercase tracking-widest mb-2">Estimated Monthly EMI</p>
                <div className="text-5xl font-bold text-white">₹{Math.round(emi).toLocaleString()}</div>
                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-sm text-white/80 font-sans">
                  <div>
                    <p>Total Interest</p>
                    <p className="font-bold text-white text-lg">₹{Math.round((emi * tenure) - loanAmount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p>Total Payment</p>
                    <p className="font-bold text-white text-lg">₹{Math.round(emi * tenure).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-white/60 dark:bg-[#00332C]/40 backdrop-blur-xl p-8 rounded-[24px] flex items-start gap-6 border border-white/40 dark:border-[#86EFAC]/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <ShieldCheck className="w-8 h-8 text-[#00332C] dark:text-[#86EFAC] shrink-0" />
          <div className="space-y-2">
            <h4 className="font-bold text-[#00332C] dark:text-white text-lg">Financial Tip</h4>
            <p className="text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
              Agricultural loans often come with interest subvention schemes. Ensure you pay your installments on time to benefit from reduced interest rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
