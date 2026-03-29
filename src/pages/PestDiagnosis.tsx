import { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getPestAdvice, detectCropDisease } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Loader2, Camera, Upload, Image as ImageIcon, Trash2, Bug } from 'lucide-react';
import Markdown from 'react-markdown';

// 3D Bug Visual Anchor
const Bug3D = () => {
  return (
    <div className="absolute top-8 right-8 w-32 h-32 hidden md:flex items-center justify-center pointer-events-none z-0" style={{ perspective: '800px' }}>
      <motion.div
        animate={{
          rotateY: [0, 15, 0, -15, 0],
          rotateX: [20, 25, 20, 15, 20],
          y: [0, -10, 0, 10, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-20 h-20"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(20deg)' }}
      >
        {/* Bug Body */}
        <div className="absolute inset-0 bg-rose-500 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.3),0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center" style={{ transform: 'translateZ(0px)' }}>
          <Bug className="w-10 h-10 text-white opacity-80" />
        </div>
        
        {/* Spots */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-rose-900 rounded-full" style={{ transform: 'translateZ(15px)' }} />
        <div className="absolute top-8 right-4 w-4 h-4 bg-rose-900 rounded-full" style={{ transform: 'translateZ(15px)' }} />
        <div className="absolute bottom-6 left-8 w-5 h-5 bg-rose-900 rounded-full" style={{ transform: 'translateZ(15px)' }} />
        
        {/* Glowing Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-rose-500 rounded-full blur-2xl opacity-30" style={{ transform: 'translateZ(-20px)' }} />
      </motion.div>
    </div>
  );
};

export function PestDiagnosis() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('image');
  
  // Text-based state
  const [cropForAdvice, setCropForAdvice] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [textAdvice, setTextAdvice] = useState('');
  const [textLoading, setTextLoading] = useState(false);

  // Image-based state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [imageAdvice, setImageAdvice] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGetTextAdvice = async () => {
    if (!cropForAdvice || !symptoms) return;
    setTextLoading(true);
    try {
      const res = await getPestAdvice(cropForAdvice, symptoms);
      setTextAdvice(res);
    } catch (error) {
      console.error(error);
      setTextAdvice("Failed to get advice. Please try again.");
    } finally {
      setTextLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectDisease = async () => {
    if (!selectedImage || !imageMimeType) return;
    setImageLoading(true);
    try {
      const base64Data = selectedImage.split(',')[1];
      const res = await detectCropDisease(base64Data, imageMimeType);
      setImageAdvice(res);
    } catch (error) {
      console.error(error);
      setImageAdvice("Failed to analyze image. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageMimeType(null);
    setImageAdvice('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-12 relative">
      <Bug3D />
      <header className="space-y-4 relative z-10">
        <h1 className="text-4xl font-bold text-emerald-900 dark:text-[#86EFAC]">{t('pestDiagnosis')}</h1>
        <p className="text-stone-600 dark:text-stone-400 max-w-2xl font-sans">
          Identify pests and diseases affecting your crops. You can either describe the symptoms or upload a photo for instant AI detection.
        </p>
      </header>

      <div className="flex justify-center relative z-10">
        <div className="bg-white/40 dark:bg-[#00332C]/40 backdrop-blur-md p-1.5 rounded-2xl flex gap-1 border border-white/20 shadow-sm">
          <button 
            onClick={() => setActiveTab('image')}
            className={`px-6 py-2.5 rounded-xl font-bold font-sans transition-all flex items-center gap-2 ${activeTab === 'image' ? 'bg-[#00332C] text-[#86EFAC] shadow-md scale-105' : 'text-stone-600 dark:text-stone-300 hover:text-[#00332C] dark:hover:text-[#86EFAC]'}`}
          >
            <Camera className="w-4 h-4" />
            Photo Detection
          </button>
          <button 
            onClick={() => setActiveTab('text')}
            className={`px-6 py-2.5 rounded-xl font-bold font-sans transition-all flex items-center gap-2 ${activeTab === 'text' ? 'bg-[#00332C] text-[#86EFAC] shadow-md scale-105' : 'text-stone-600 dark:text-stone-300 hover:text-[#00332C] dark:hover:text-[#86EFAC]'}`}
          >
            <AlertCircle className="w-4 h-4" />
            Describe Symptoms
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'image' ? (
            <motion.section 
              key="image-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/60 dark:bg-[#00332C]/40 backdrop-blur-xl rounded-[24px] p-8 border border-white/40 dark:border-[#86EFAC]/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-6"
            >
              <div className="flex items-center gap-3 text-[#00332C] dark:text-[#86EFAC]">
                <Camera className="w-6 h-6" />
                <h2 className="text-2xl font-bold">AI Photo Diagnosis</h2>
              </div>

              {!selectedImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 hover:border-[#86EFAC] hover:bg-white/50 dark:hover:bg-[#00332C]/50 transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#86EFAC]/20 transition-colors shadow-sm">
                    <Upload className="w-8 h-8 text-stone-400 group-hover:text-[#00332C] dark:group-hover:text-[#86EFAC]" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-stone-700 dark:text-stone-300">Click to upload or take a photo</p>
                    <p className="text-sm text-stone-400 font-sans">Supports JPG, PNG (Max 10MB)</p>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative aspect-video max-h-[400px] rounded-2xl overflow-hidden bg-stone-100/50 dark:bg-stone-800/50 backdrop-blur-sm border border-stone-200 dark:border-stone-700">
                    <img src={selectedImage} alt="Selected crop" className="w-full h-full object-contain" />
                    <button 
                      onClick={clearImage}
                      className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-full text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors shadow-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleDetectDisease}
                    disabled={imageLoading}
                    className="w-full bg-[#00332C] text-[#86EFAC] py-4 rounded-2xl font-bold hover:bg-[#004433] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#00332C]/20 transition-colors"
                  >
                    {imageLoading ? <Loader2 className="animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                    {imageLoading ? 'Analyzing Image...' : 'Detect Disease'}
                  </button>
                </div>
              )}

              {imageAdvice && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-3xl border border-stone-200 dark:border-stone-700 prose prose-stone dark:prose-invert max-w-none"
                >
                  <Markdown>{imageAdvice}</Markdown>
                </motion.div>
              )}
            </motion.section>
          ) : (
            <motion.section 
              key="text-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/60 dark:bg-[#00332C]/40 backdrop-blur-xl rounded-[24px] p-8 border border-white/40 dark:border-[#86EFAC]/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-6"
            >
              <div className="flex items-center gap-3 text-[#00332C] dark:text-[#86EFAC]">
                <AlertCircle className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Symptom Description</h2>
              </div>

              <div className="grid gap-6 font-sans">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Crop Name</label>
                  <input 
                    type="text" 
                    value={cropForAdvice}
                    onChange={(e) => setCropForAdvice(e.target.value)}
                    placeholder="e.g. Paddy, Cotton, Chilli"
                    className="w-full bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm border border-stone-200 dark:border-stone-700 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#86EFAC] focus:border-[#00332C] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Describe Symptoms</label>
                  <textarea 
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={4}
                    placeholder="e.g. Yellowing leaves, small holes in stems, white spots on underside of leaves..."
                    className="w-full bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm border border-stone-200 dark:border-stone-700 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#86EFAC] focus:border-[#00332C] outline-none resize-none transition-all"
                  />
                </div>
                <button 
                  onClick={handleGetTextAdvice}
                  disabled={textLoading || !cropForAdvice || !symptoms}
                  className="w-full bg-[#00332C] text-[#86EFAC] py-4 rounded-2xl font-bold hover:bg-[#004433] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#00332C]/20 transition-colors"
                >
                  {textLoading ? <Loader2 className="animate-spin" /> : <AlertCircle className="w-5 h-5" />}
                  {textLoading ? 'Getting Advice...' : 'Get Expert Advice'}
                </button>
              </div>

              {textAdvice && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-3xl border border-stone-200 dark:border-stone-700 prose prose-stone dark:prose-invert max-w-none"
                >
                  <Markdown>{textAdvice}</Markdown>
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
