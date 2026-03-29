import { useLanguage } from '../context/LanguageContext';
import { FileText, Landmark, Calculator, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

// 3D Book Visual Anchor
const Book3D = () => {
  return (
    <div className="absolute top-8 right-8 w-32 h-32 hidden md:flex items-center justify-center pointer-events-none z-0" style={{ perspective: '800px' }}>
      <motion.div
        animate={{
          rotateY: [0, 15, 0, -15, 0],
          rotateX: [20, 25, 20, 15, 20],
          y: [0, -10, 0, 10, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-20 h-24"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(20deg)' }}
      >
        {/* Book Cover */}
        <div className="absolute inset-0 bg-emerald-700 rounded-r-lg shadow-[inset_-5px_0_15px_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center border-l-8 border-emerald-900" style={{ transform: 'translateZ(0px)' }}>
          <BookOpen className="w-8 h-8 text-emerald-300 opacity-80" />
        </div>
        
        {/* Pages */}
        <div className="absolute top-1 bottom-1 right-0 w-4 bg-stone-100 rounded-r-sm shadow-[inset_2px_0_5px_rgba(0,0,0,0.1)]" style={{ transform: 'translateZ(-5px) translateX(2px)' }} />
        <div className="absolute top-2 bottom-2 right-0 w-4 bg-stone-200 rounded-r-sm shadow-[inset_2px_0_5px_rgba(0,0,0,0.1)]" style={{ transform: 'translateZ(-10px) translateX(4px)' }} />
        
        {/* Bookmark */}
        <div className="absolute -top-2 right-4 w-3 h-8 bg-rose-500 shadow-md" style={{ transform: 'translateZ(1px)' }} />
        
        {/* Glowing Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-emerald-500 rounded-full blur-2xl opacity-30" style={{ transform: 'translateZ(-20px)' }} />
      </motion.div>
    </div>
  );
};

export function Resources() {
  const { t } = useLanguage();

  const schemes = [
    { title: 'PM-Kisan Samman Nidhi', description: 'Direct income support of ₹6,000 per year to all landholding farmer families.', link: 'https://pmkisan.gov.in/' },
    { title: 'Pradhan Mantri Fasal Bima Yojana', description: 'Crop insurance scheme to provide financial support to farmers suffering crop loss.', link: 'https://pmfby.gov.in/' },
    { title: 'Kisan Credit Card (KCC)', description: 'Provides farmers with timely access to credit for cultivation and other needs.', link: 'https://fasalrin.gov.in/' },
    { title: 'Soil Health Card Scheme', description: 'Assists state governments to issue soil health cards to all farmers in the country.', link: 'https://www.soilhealth.dac.gov.in/home' },
  ];

  return (
    <div className="space-y-12 relative">
      <Book3D />
      <header className="relative z-10">
        <h1 className="text-4xl font-bold text-emerald-900 dark:text-[#86EFAC]">{t('resources')}</h1>
      </header>

      <div className="grid lg:grid-cols-3 gap-8 relative z-10">
        {/* Government Schemes */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 text-[#00332C] dark:text-[#86EFAC]">
            <Landmark className="w-6 h-6" />
            <h2 className="text-2xl font-bold">{t('governmentSchemes')}</h2>
          </div>
          <div className="space-y-4">
            {schemes.map((scheme, idx) => (
              <div key={idx} className="bg-white/60 dark:bg-[#00332C]/40 backdrop-blur-xl p-6 rounded-[24px] border border-white/40 dark:border-[#86EFAC]/20 hover:border-[#00332C]/30 dark:hover:border-[#86EFAC]/50 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(0,51,44,0.1)] group">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#00332C] dark:text-white">{scheme.title}</h3>
                    <p className="text-sm text-stone-600 dark:text-stone-300 font-sans">{scheme.description}</p>
                  </div>
                  <a 
                    href={scheme.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm rounded-xl text-stone-400 dark:text-stone-500 group-hover:text-[#00332C] dark:group-hover:text-[#86EFAC] group-hover:bg-[#86EFAC]/20 transition-colors shadow-sm"
                  >
                    <FileText className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Link to Loan Calculator */}
        <section className="space-y-6">
          <div className="bg-gradient-to-br from-[#00332C] to-[#004d43] rounded-[24px] p-8 border border-[#86EFAC]/20 space-y-4 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#86EFAC] rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#86EFAC] shadow-sm border border-white/10 mb-6">
                <Calculator className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{t('loanCalculator')}</h3>
              <p className="text-sm text-[#86EFAC]/80 font-sans leading-relaxed mb-8">
                Plan your agricultural finances. Calculate EMIs and interest for your farm loans with our smart tool.
              </p>
              <Link 
                to="/loan-calculator" 
                className="inline-flex items-center justify-center w-full gap-2 bg-[#86EFAC] text-[#00332C] py-3.5 px-6 rounded-xl font-bold hover:bg-white transition-colors shadow-lg shadow-[#86EFAC]/20"
              >
                Go to Calculator <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
