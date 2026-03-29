import { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { analyzeSoilAndRecommendCrops } from '../services/geminiService';
import { motion } from 'motion/react';
import { Sprout, Loader2, Upload, FileText, RefreshCw, AlertCircle, ArrowRight, BookOpen, Leaf, Sun, Droplets, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { SkeletonLoader } from '../components/SkeletonLoader';

// 3D Book Visual Anchor
const Book3D = () => {
  return (
    <div className="absolute top-8 right-8 w-32 h-32 hidden md:flex items-center justify-center pointer-events-none z-0" style={{ perspective: '800px' }}>
      <motion.div
        animate={{
          rotateY: [0, -10, 0, 10, 0],
          rotateX: [20, 25, 20, 15, 20],
          y: [0, -10, 0, 10, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-20 h-24"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(20deg) rotateY(-20deg)' }}
      >
        {/* Book Cover (Front) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00332C] to-emerald-800 dark:from-[#86EFAC] dark:to-emerald-500 rounded-r-lg rounded-l-sm shadow-[5px_5px_15px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_rgba(134,239,172,0.3)] border border-white/20 flex items-center justify-center" style={{ transform: 'translateZ(10px)' }}>
          <Leaf className="w-8 h-8 text-white dark:text-[#00332C] opacity-80" />
        </div>
        {/* Pages (Right Edge) */}
        <div className="absolute top-1 bottom-1 right-0 w-4 bg-stone-100 dark:bg-stone-200 rounded-r-sm" style={{ transform: 'rotateY(90deg) translateZ(10px) translateX(2px)' }}>
          <div className="w-full h-full flex flex-col justify-evenly opacity-30">
            {[1,2,3,4,5].map(i => <div key={i} className="w-full h-[1px] bg-stone-400" />)}
          </div>
        </div>
        {/* Book Cover (Back) */}
        <div className="absolute inset-0 bg-[#002211] dark:bg-emerald-700 rounded-r-lg rounded-l-sm" style={{ transform: 'translateZ(-10px)' }} />
        {/* Spine */}
        <div className="absolute top-0 bottom-0 left-0 w-5 bg-[#004433] dark:bg-emerald-600 rounded-l-sm" style={{ transform: 'rotateY(-90deg) translateZ(2.5px) translateX(-2.5px)' }} />
      </motion.div>
    </div>
  );
};

export function Crops() {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    soilType: 'Loam',
    ph: '',
    moisture: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    previousCrop: '',
    fieldArea: ''
  });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleAnalyzeLocally = () => {
    // Basic local analysis logic
    let localReport = "### Local Soil Analysis\n\n";
    
    if (formData.ph) {
      const ph = parseFloat(formData.ph);
      if (ph < 6.0) localReport += "- **pH:** Acidic. Consider adding lime.\n";
      else if (ph > 7.5) localReport += "- **pH:** Alkaline. Consider adding sulfur or organic matter.\n";
      else localReport += "- **pH:** Optimal for most crops.\n";
    }

    if (formData.nitrogen) {
      const n = parseFloat(formData.nitrogen);
      if (n < 20) localReport += "- **Nitrogen:** Low. Needs nitrogen-rich fertilizer.\n";
      else localReport += "- **Nitrogen:** Adequate.\n";
    }

    if (formData.phosphorus) {
      const p = parseFloat(formData.phosphorus);
      if (p < 15) localReport += "- **Phosphorus:** Low. Consider bone meal or rock phosphate.\n";
      else localReport += "- **Phosphorus:** Adequate.\n";
    }

    if (formData.potassium) {
      const k = parseFloat(formData.potassium);
      if (k < 100) localReport += "- **Potassium:** Low. Consider wood ash or kelp meal.\n";
      else localReport += "- **Potassium:** Adequate.\n";
    }

    localReport += "\n### Suggested Crops\n";
    if (formData.soilType === 'Loam') {
      localReport += "- Wheat, Cotton, Sugarcane, Jute, Vegetables\n";
    } else if (formData.soilType === 'Clay') {
      localReport += "- Rice, Cabbage, Broccoli\n";
    } else if (formData.soilType === 'Sandy') {
      localReport += "- Carrots, Potatoes, Melons\n";
    } else {
      localReport += "- Please consult local agricultural extension for specific recommendations.\n";
    }

    setReport(localReport);
  };

  const handleGenerateGemini = async () => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      let result = "";
      if (selectedImage) {
        const base64Data = await fileToBase64(selectedImage);
        result = await analyzeSoilAndRecommendCrops({
          imageBase64: base64Data,
          mimeType: selectedImage.type
        });
      } else {
        result = await analyzeSoilAndRecommendCrops(formData);
      }
      setReport(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      soilType: 'Loam',
      ph: '',
      moisture: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      previousCrop: '',
      fieldArea: ''
    });
    setReport(null);
    setError(null);
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto relative">
      <Book3D />
      <header className="flex flex-col gap-4 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-[#00332C] dark:text-[#86EFAC] tracking-tight">
          Crop Guidance
        </h1>
        <p className="text-stone-500 dark:text-stone-400 font-sans text-lg max-w-2xl leading-relaxed">
          Your intelligent knowledge library for soil analysis and crop recommendations.
        </p>
      </header>

      {/* 3D Progress Tracker */}
      <section className="bg-white/60 dark:bg-[#00332C]/40 backdrop-blur-[12px] rounded-[24px] p-8 border border-white/20 dark:border-[#86EFAC]/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#86EFAC]/10 blur-3xl -mr-32 -mt-32 rounded-full pointer-events-none" />
        
        <h2 className="text-2xl font-bold text-[#00332C] dark:text-white mb-8 flex items-center gap-3">
          <Sprout className="w-6 h-6 text-[#86EFAC]" />
          Growth Stage Tracker
        </h2>
        
        <div className="relative flex justify-between items-center max-w-4xl mx-auto mt-12 mb-8">
          {/* Glowing Timeline Line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#86EFAC] to-emerald-500 shadow-[0_0_10px_rgba(134,239,172,0.8)]"
            />
          </div>

          {/* Stages */}
          {[
            { icon: '🌱', label: 'Seedling', status: 'completed' },
            { icon: '🌿', label: 'Vegetative', status: 'completed' },
            { icon: '🌼', label: 'Flowering', status: 'current' },
            { icon: '🌾', label: 'Harvest', status: 'upcoming' },
          ].map((stage, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.1, y: -5 }}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg backdrop-blur-md border-2 transition-colors ${
                  stage.status === 'completed' 
                    ? 'bg-[#86EFAC] border-[#86EFAC] text-white shadow-[0_0_15px_rgba(134,239,172,0.5)]' 
                    : stage.status === 'current'
                    ? 'bg-[#00332C] border-[#86EFAC] shadow-[0_0_20px_rgba(134,239,172,0.8)] animate-pulse'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 opacity-50'
                }`}
              >
                {stage.icon}
              </motion.div>
              <span className={`text-sm font-bold font-sans ${
                stage.status === 'current' ? 'text-[#00332C] dark:text-[#86EFAC]' : 'text-stone-500'
              }`}>
                {stage.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Analysis Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/60 dark:bg-[#00332C]/40 backdrop-blur-[12px] rounded-[24px] p-8 border border-white/20 dark:border-[#86EFAC]/10 shadow-xl transition-colors duration-300">
            
            {/* File Upload Section */}
            <div className="p-6 bg-white/50 dark:bg-black/20 rounded-[24px] border border-dashed border-stone-300 dark:border-[#86EFAC]/30 mb-8">
              <h3 className="text-xl font-bold text-[#00332C] dark:text-white mb-2 flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#86EFAC]" />
                Upload Soil Health Card
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 font-sans mb-6">
                Have a physical soil health card? Upload a photo and our AI will extract the parameters for you.
              </p>
              
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
                ref={fileInputRef}
              />
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white dark:bg-[#00332C] border border-stone-200 dark:border-[#86EFAC]/30 text-[#00332C] dark:text-[#86EFAC] px-6 py-3 rounded-xl font-sans text-sm font-bold hover:bg-stone-50 dark:hover:bg-[#86EFAC]/10 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <FileText className="w-4 h-4" /> Choose File
                </button>
                {selectedImage && (
                  <span className="text-sm text-[#00332C] dark:text-[#86EFAC] font-sans flex items-center gap-2 bg-[#86EFAC]/20 px-3 py-1.5 rounded-lg">
                    {selectedImage.name}
                    <button onClick={() => { setSelectedImage(null); setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value=''; }} className="text-rose-500 hover:text-rose-700 ml-2">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>

              {imagePreview && (
                <div className="mt-6">
                  <img src={imagePreview} alt="Soil Health Card Preview" className="h-40 rounded-2xl object-cover border border-stone-200 dark:border-[#86EFAC]/30 shadow-md" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-stone-200 dark:bg-[#86EFAC]/20 flex-1"></div>
              <span className="text-stone-400 dark:text-[#86EFAC]/60 font-sans text-xs font-bold uppercase tracking-widest">OR ENTER MANUALLY</span>
              <div className="h-px bg-stone-200 dark:bg-[#86EFAC]/20 flex-1"></div>
            </div>

            {/* Manual Entry Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans mb-8">
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-[#86EFAC]/80 uppercase tracking-wider mb-2">Soil Type</label>
                <select 
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-[#86EFAC]/30 bg-white/50 dark:bg-black/20 text-[#00332C] dark:text-white focus:ring-2 focus:ring-[#86EFAC] outline-none backdrop-blur-sm transition-all"
                >
                  <option value="Loam">Loam</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Silt">Silt</option>
                  <option value="Peaty">Peaty</option>
                  <option value="Chalky">Chalky</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-[#86EFAC]/80 uppercase tracking-wider mb-2">pH (0 - 14)</label>
                <input 
                  type="number" 
                  name="ph"
                  value={formData.ph}
                  onChange={handleInputChange}
                  placeholder="e.g., 6.5"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-[#86EFAC]/30 bg-white/50 dark:bg-black/20 text-[#00332C] dark:text-white focus:ring-2 focus:ring-[#86EFAC] outline-none backdrop-blur-sm transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-[#86EFAC]/80 uppercase tracking-wider mb-2">Moisture (%)</label>
                <input 
                  type="number" 
                  name="moisture"
                  value={formData.moisture}
                  onChange={handleInputChange}
                  placeholder="e.g., 30"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-[#86EFAC]/30 bg-white/50 dark:bg-black/20 text-[#00332C] dark:text-white focus:ring-2 focus:ring-[#86EFAC] outline-none backdrop-blur-sm transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-[#86EFAC]/80 uppercase tracking-wider mb-2">Nitrogen (N) ppm</label>
                <input 
                  type="number" 
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleInputChange}
                  placeholder="e.g., 20"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-[#86EFAC]/30 bg-white/50 dark:bg-black/20 text-[#00332C] dark:text-white focus:ring-2 focus:ring-[#86EFAC] outline-none backdrop-blur-sm transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-[#86EFAC]/80 uppercase tracking-wider mb-2">Phosphorus (P) ppm</label>
                <input 
                  type="number" 
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleInputChange}
                  placeholder="e.g., 15"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-[#86EFAC]/30 bg-white/50 dark:bg-black/20 text-[#00332C] dark:text-white focus:ring-2 focus:ring-[#86EFAC] outline-none backdrop-blur-sm transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-[#86EFAC]/80 uppercase tracking-wider mb-2">Potassium (K) ppm</label>
                <input 
                  type="number" 
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleInputChange}
                  placeholder="e.g., 150"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-[#86EFAC]/30 bg-white/50 dark:bg-black/20 text-[#00332C] dark:text-white focus:ring-2 focus:ring-[#86EFAC] outline-none backdrop-blur-sm transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleGenerateGemini}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#00332C] to-emerald-800 dark:from-[#86EFAC] dark:to-emerald-400 text-white dark:text-[#00332C] px-6 py-4 rounded-xl font-sans text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Loader2 className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Sprout className="w-5 h-5" />
                )}
                Generate Smart Report
              </button>
              <button 
                onClick={handleAnalyzeLocally}
                className="px-6 py-4 bg-white/50 dark:bg-black/20 border border-stone-200 dark:border-[#86EFAC]/30 text-[#00332C] dark:text-white rounded-xl font-sans text-sm font-bold hover:bg-stone-50 dark:hover:bg-[#86EFAC]/10 transition-colors"
              >
                Quick Analysis
              </button>
              <button 
                onClick={handleReset}
                className="p-4 bg-white/50 dark:bg-black/20 border border-stone-200 dark:border-[#86EFAC]/30 text-stone-500 dark:text-stone-400 rounded-xl hover:bg-stone-50 dark:hover:bg-[#86EFAC]/10 transition-colors"
                title="Reset Form"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {/* Loading State (Skeleton) */}
            {loading && (
              <div className="mt-8">
                <SkeletonLoader type="card" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mt-8 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 text-rose-700 dark:text-rose-400 font-sans flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Report Display */}
            {report && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white/80 dark:bg-black/40 border border-stone-200 dark:border-[#86EFAC]/30 rounded-[24px] p-8 backdrop-blur-md"
              >
                <h2 className="text-2xl font-bold text-[#00332C] dark:text-[#86EFAC] mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6" /> Knowledge Library Report
                </h2>
                <div className="prose prose-stone dark:prose-invert max-w-none font-sans prose-headings:font-serif prose-headings:text-[#00332C] dark:prose-headings:text-[#86EFAC] prose-a:text-emerald-600 dark:prose-a:text-[#86EFAC] prose-strong:text-[#00332C] dark:prose-strong:text-white">
                  <Markdown>{report}</Markdown>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar / Knowledge Cards */}
        <div className="space-y-6">
          <div className="bg-[#00332C] text-white rounded-[24px] p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#86EFAC]/20 blur-2xl -mr-16 -mt-16 rounded-full" />
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#86EFAC]">
              <Leaf className="w-5 h-5" /> Quick Tips
            </h3>
            <div className="space-y-4 font-sans">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                <h4 className="font-bold text-sm mb-1">Soil pH Balance</h4>
                <p className="text-xs text-stone-300">Most crops prefer a pH between 6.0 and 7.0. Use lime to raise pH or sulfur to lower it.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                <h4 className="font-bold text-sm mb-1">Nitrogen Management</h4>
                <p className="text-xs text-stone-300">Apply nitrogen in split doses to prevent leaching and improve crop uptake efficiency.</p>
              </div>
            </div>
          </div>

          <Link 
            to="/pest-diagnosis" 
            className="block bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-[24px] p-8 border border-rose-100 dark:border-rose-900/30 hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 bg-white dark:bg-black/40 rounded-2xl flex items-center justify-center text-rose-500 mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-300 mb-2">Pest Diagnosis</h3>
            <p className="text-sm text-rose-800/70 dark:text-rose-400/70 font-sans mb-4">
              Identify and treat crop diseases instantly using our AI vision tool.
            </p>
            <span className="text-rose-600 dark:text-rose-400 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Scan Now <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
