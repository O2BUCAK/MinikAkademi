import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Sparkles, RefreshCw, CheckCircle2, Paintbrush, Smile, ArrowLeft, Star, Heart } from 'lucide-react';
import { Language } from '../types';
import { speak } from '../utils/speak';

interface ColoringSectionProps {
  lang: Language;
  onEarnXp: (amount: number) => void;
}

interface ColorOption {
  hex: string;
  nameTr: string;
  nameEn: string;
  emoji: string;
}

const COLOR_PALETTE: ColorOption[] = [
  { hex: '#EF4444', nameTr: 'Kiraz Kırmızısı', nameEn: 'Cherry Red', emoji: '🍒' },
  { hex: '#F97316', nameTr: 'Mandalina Turuncusu', nameEn: 'Tangerine Orange', emoji: '🍊' },
  { hex: '#FBBF24', nameTr: 'Güneş Sarısı', nameEn: 'Sunny Yellow', emoji: '☀️' },
  { hex: '#10B981', nameTr: 'Orman Yeşili', nameEn: 'Forest Green', emoji: '🌳' },
  { hex: '#06B6D4', nameTr: 'Deniz Mavisi', nameEn: 'Ocean Blue', emoji: '🌊' },
  { hex: '#3B82F6', nameTr: 'Gökyüzü Mavisi', nameEn: 'Sky Blue', emoji: '☁️' },
  { hex: '#8B5CF6', nameTr: 'Lila Lavanta', nameEn: 'Lavender Purple', emoji: '🪻' },
  { hex: '#EC4899', nameTr: 'Şeker Pembesi', nameEn: 'Candy Pink', emoji: '🍬' },
  { hex: '#F43F5E', nameTr: 'Çilek Pembesi', nameEn: 'Strawberry Rose', emoji: '🍓' },
  { hex: '#78350F', nameTr: 'Çikolata Kahvesi', nameEn: 'Chocolate Brown', emoji: '🍫' },
  { hex: '#1E293B', nameTr: 'Kömür Siyahı', nameEn: 'Coal Black', emoji: '🐈‍⬛' },
  { hex: '#FFFFFF', nameTr: 'Kar Beyazı', nameEn: 'Snow White', emoji: '❄️' },
];

type ColoringTemplateId = 'butterfly' | 'rocket' | 'fish' | 'cat';

interface ColoringTemplate {
  id: ColoringTemplateId;
  nameTr: string;
  nameEn: string;
  emoji: string;
  defaultColors: Record<string, string>;
  regions: { id: string; nameTr: string; nameEn: string }[];
}

const TEMPLATES: ColoringTemplate[] = [
  {
    id: 'butterfly',
    nameTr: 'Sevimli Kelebek',
    nameEn: 'Cute Butterfly',
    emoji: '🦋',
    defaultColors: {
      bg: '#F8FAFC',
      leftWingTop: '#FFFFFF',
      leftWingBottom: '#FFFFFF',
      rightWingTop: '#FFFFFF',
      rightWingBottom: '#FFFFFF',
      body: '#FFFFFF',
      head: '#FFFFFF',
      antennaLeft: '#1E293B',
      antennaRight: '#1E293B',
      wingDetail1: '#FFFFFF',
      wingDetail2: '#FFFFFF',
      wingDetail3: '#FFFFFF',
      wingDetail4: '#FFFFFF',
    },
    regions: [
      { id: 'bg', nameTr: 'Arka Plan', nameEn: 'Background' },
      { id: 'leftWingTop', nameTr: 'Sol Üst Kanat', nameEn: 'Left Top Wing' },
      { id: 'leftWingBottom', nameTr: 'Sol Alt Kanat', nameEn: 'Left Bottom Wing' },
      { id: 'rightWingTop', nameTr: 'Sağ Üst Kanat', nameEn: 'Right Top Wing' },
      { id: 'rightWingBottom', nameTr: 'Sağ Alt Kanat', nameEn: 'Right Bottom Wing' },
      { id: 'body', nameTr: 'Gövde', nameEn: 'Body' },
      { id: 'head', nameTr: 'Kafa', nameEn: 'Head' },
      { id: 'wingDetail1', nameTr: 'Kanat Deseni 1', nameEn: 'Wing Detail 1' },
      { id: 'wingDetail2', nameTr: 'Kanat Deseni 2', nameEn: 'Wing Detail 2' },
      { id: 'wingDetail3', nameTr: 'Kanat Deseni 3', nameEn: 'Wing Detail 3' },
      { id: 'wingDetail4', nameTr: 'Kanat Deseni 4', nameEn: 'Wing Detail 4' },
    ]
  },
  {
    id: 'rocket',
    nameTr: 'Uzay Roketi',
    nameEn: 'Space Rocket',
    emoji: '🚀',
    defaultColors: {
      bg: '#0F172A',
      body: '#FFFFFF',
      nose: '#FFFFFF',
      wingLeft: '#FFFFFF',
      wingRight: '#FFFFFF',
      windowOuter: '#FFFFFF',
      windowInner: '#FFFFFF',
      thruster: '#FFFFFF',
      fire: '#FFFFFF',
      star1: '#FBBF24',
      star2: '#FBBF24',
      planet: '#FFFFFF',
    },
    regions: [
      { id: 'bg', nameTr: 'Uzay Boşluğu', nameEn: 'Space Void' },
      { id: 'body', nameTr: 'Roket Gövdesi', nameEn: 'Rocket Body' },
      { id: 'nose', nameTr: 'Roket Burnu', nameEn: 'Rocket Nose' },
      { id: 'wingLeft', nameTr: 'Sol Kanat', nameEn: 'Left Wing' },
      { id: 'wingRight', nameTr: 'Sağ Kanat', nameEn: 'Right Wing' },
      { id: 'windowOuter', nameTr: 'Pencere Kenarı', nameEn: 'Window Ring' },
      { id: 'windowInner', nameTr: 'Pencere Camı', nameEn: 'Window Glass' },
      { id: 'thruster', nameTr: 'Motor Bölümü', nameEn: 'Rocket Thruster' },
      { id: 'fire', nameTr: 'Roket Ateşi', nameEn: 'Rocket Exhaust Flame' },
      { id: 'star1', nameTr: 'Küçük Yıldız', nameEn: 'Little Star' },
      { id: 'star2', nameTr: 'Büyük Yıldız', nameEn: 'Big Star' },
      { id: 'planet', nameTr: 'Uzak Gezegen', nameEn: 'Distant Planet' },
    ]
  },
  {
    id: 'fish',
    nameTr: 'Mutlu Balık',
    nameEn: 'Happy Fish',
    emoji: '🐠',
    defaultColors: {
      bg: '#E0F2FE',
      body: '#FFFFFF',
      tail: '#FFFFFF',
      finTop: '#FFFFFF',
      finBottom: '#FFFFFF',
      stripe1: '#FFFFFF',
      stripe2: '#FFFFFF',
      bubble1: '#FFFFFF',
      bubble2: '#FFFFFF',
      seaweedLeft: '#10B981',
      seaweedRight: '#10B981',
      sand: '#FBBF24',
    },
    regions: [
      { id: 'bg', nameTr: 'Mavi Deniz', nameEn: 'Blue Sea' },
      { id: 'body', nameTr: 'Balık Gövdesi', nameEn: 'Fish Body' },
      { id: 'tail', nameTr: 'Balık Kuyruğu', nameEn: 'Fish Tail' },
      { id: 'finTop', nameTr: 'Üst Yüzgeç', nameEn: 'Top Fin' },
      { id: 'finBottom', nameTr: 'Alt Yüzgeç', nameEn: 'Bottom Fin' },
      { id: 'stripe1', nameTr: 'Göğüs Çizgisi', nameEn: 'Body Stripe 1' },
      { id: 'stripe2', nameTr: 'Kuyruk Çizgisi', nameEn: 'Body Stripe 2' },
      { id: 'bubble1', nameTr: 'Küçük Baloncuk', nameEn: 'Small Bubble' },
      { id: 'bubble2', nameTr: 'Büyük Baloncuk', nameEn: 'Big Bubble' },
      { id: 'seaweedLeft', nameTr: 'Sol Yosun', nameEn: 'Left Seaweed' },
      { id: 'seaweedRight', nameTr: 'Sağ Yosun', nameEn: 'Right Seaweed' },
      { id: 'sand', nameTr: 'Deniz Kumu', nameEn: 'Sea Sand' },
    ]
  },
  {
    id: 'cat',
    nameTr: 'Sevimli Kedi',
    nameEn: 'Cute Kitten',
    emoji: '🐱',
    defaultColors: {
      bg: '#FFF1F2',
      face: '#FFFFFF',
      body: '#FFFFFF',
      earLeftOuter: '#FFFFFF',
      earLeftInner: '#FFFFFF',
      earRightOuter: '#FFFFFF',
      earRightInner: '#FFFFFF',
      tail: '#FFFFFF',
      collar: '#FFFFFF',
      bell: '#FFFFFF',
      paws: '#FFFFFF',
    },
    regions: [
      { id: 'bg', nameTr: 'Oda Arka Planı', nameEn: 'Room Background' },
      { id: 'face', nameTr: 'Kedi Yüzü', nameEn: 'Kitten Face' },
      { id: 'body', nameTr: 'Kedi Gövdesi', nameEn: 'Kitten Body' },
      { id: 'earLeftOuter', nameTr: 'Sol Kulak', nameEn: 'Left Ear' },
      { id: 'earLeftInner', nameTr: 'Sol Kulak İçi', nameEn: 'Left Inner Ear' },
      { id: 'earRightOuter', nameTr: 'Sağ Kulak', nameEn: 'Right Ear' },
      { id: 'earRightInner', nameTr: 'Sağ Kulak İçi', nameEn: 'Right Inner Ear' },
      { id: 'tail', nameTr: 'Kuyruk', nameEn: 'Tail' },
      { id: 'collar', nameTr: 'Tasma', nameEn: 'Collar' },
      { id: 'bell', nameTr: 'Tasma Zili', nameEn: 'Collar Bell' },
      { id: 'paws', nameTr: 'Patiler', nameEn: 'Cute Paws' },
    ]
  }
];

export default function ColoringSection({ lang, onEarnXp }: ColoringSectionProps) {
  const [activeMode, setActiveMode] = useState<'magic' | 'free'>('magic');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>('#EF4444'); // default cherry red
  
  // Track colors for each template
  const [templateColors, setTemplateColors] = useState<Record<ColoringTemplateId, Record<string, string>>>(() => {
    const initial: Record<ColoringTemplateId, Record<string, string>> = {} as any;
    TEMPLATES.forEach(t => {
      initial[t.id] = { ...t.defaultColors };
    });
    return initial;
  });

  // Free drawing states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushWidth, setBrushWidth] = useState(12);
  const [isEraser, setIsEraser] = useState(false);
  const [successConfetti, setSuccessConfetti] = useState(false);

  const currentTemplate = TEMPLATES[selectedTemplateIndex];
  const activeColorObject = COLOR_PALETTE.find(c => c.hex === selectedColor) || COLOR_PALETTE[0];

  // Draw background image template in canvas when in free mode
  useEffect(() => {
    if (activeMode === 'free') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
        }
      }
    }
  }, [activeMode]);

  const handleSelectColor = (hex: string, nameTr: string, nameEn: string) => {
    setSelectedColor(hex);
    if (lang === 'tr') {
      speak(`${nameTr}!`, 'tr');
    } else {
      speak(`${nameEn}!`, 'en');
    }
  };

  const handleRegionClick = (regionId: string) => {
    const regionName = currentTemplate.regions.find(r => r.id === regionId);
    
    // Play voice/speech cues
    if (regionName) {
      const regionText = lang === 'tr' ? regionName.nameTr : regionName.nameEn;
      const colorText = lang === 'tr' ? activeColorObject.nameTr : activeColorObject.nameEn;
      speak(lang === 'tr' ? `${regionText} ${colorText} yapıldı!` : `${regionText} painted ${colorText}!`, lang);
    }

    setTemplateColors(prev => ({
      ...prev,
      [currentTemplate.id]: {
        ...prev[currentTemplate.id],
        [regionId]: selectedColor
      }
    }));

    onEarnXp(5); // 5 XP for painting a region
  };

  const handleResetTemplate = () => {
    if (activeMode === 'magic') {
      setTemplateColors(prev => ({
        ...prev,
        [currentTemplate.id]: { ...currentTemplate.defaultColors }
      }));
      speak(lang === 'tr' ? 'Tüm boyamalar temizlendi!' : 'All coloring cleared!', lang);
    } else {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          speak(lang === 'tr' ? 'Resim tuvali temizlendi!' : 'Drawing board cleared!', lang);
        }
      }
    }
  };

  const handleCompleteColoring = () => {
    setSuccessConfetti(true);
    speak(
      lang === 'tr'
        ? 'Harika iş başardın! Ressam dostum, bu boyama mükemmel oldu!'
        : 'Amazing work! My artist friend, this coloring looks perfect!',
      lang
    );
    onEarnXp(80); // 80 XP for completion!
    setTimeout(() => setSuccessConfetti(false), 5000);
  };

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get exact mouse or touch coordinates relative to canvas
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);

    // Initial dot
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = isEraser ? '#FFF9E6' : selectedColor; // bg is light yellow #FFF9E6
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      // Prevent scrolling when drawing on touchscreen
      e.preventDefault();
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = isEraser ? '#FFF9E6' : selectedColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-emerald-300 p-6 md:p-8 shadow-xl relative overflow-hidden">
      {/* Background cute blobs */}
      <div className="absolute top-2 right-4 text-4xl opacity-30 select-none pointer-events-none animate-bounce duration-1000">🎨</div>
      <div className="absolute bottom-4 left-4 text-4xl opacity-20 select-none pointer-events-none animate-pulse">🌈</div>

      {/* Confetti celebration overlay */}
      <AnimatePresence>
        {successConfetti && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-emerald-900/10 pointer-events-none flex items-center justify-center"
          >
            <div className="text-center bg-white border-4 border-yellow-300 p-8 rounded-3xl shadow-2xl animate-bounce">
              <span className="text-6xl block mb-2">🎉🏆✨</span>
              <h2 className="text-2xl font-black text-emerald-800 uppercase">
                {lang === 'tr' ? 'MÜKEMMEL BİR ESER!' : 'A MASTERPIECE!'}
              </h2>
              <p className="text-sm font-bold text-emerald-600 mt-2">
                {lang === 'tr' ? '+80 XP Kazandın!' : 'You earned +80 XP!'}
              </p>
            </div>
            {/* Generate random flying items */}
            <div className="absolute top-10 left-10 text-3xl animate-ping">⭐</div>
            <div className="absolute top-20 right-16 text-3xl animate-bounce">🎈</div>
            <div className="absolute bottom-12 left-1/4 text-3xl animate-bounce">❤️</div>
            <div className="absolute bottom-20 right-1/4 text-3xl animate-ping">🎨</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-900 flex items-center gap-2">
            <Palette className="text-emerald-500 stroke-[2.5px] animate-spin" size={28} />
            <span>{lang === 'tr' ? 'Boya ve Çiz Bölümü' : 'Coloring & Drawing Book'}</span>
          </h2>
          <p className="text-xs sm:text-sm font-bold text-gray-500 mt-1">
            {lang === 'tr' 
              ? 'Şablonları sihirli fırçayla renklendir veya serbest çizim tuvalinde hayal gücünü göster!'
              : 'Color in the cute templates with magic touch or paint freely on the sketch canvas!'}
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-gray-100 p-1 rounded-2xl border-2 border-gray-200 shadow-inner">
          <button
            id="btn-mode-magic"
            onClick={() => {
              setActiveMode('magic');
              speak(lang === 'tr' ? 'Sihirli Boyama seçildi!' : 'Magic Touch coloring mode!', lang);
            }}
            className={`px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'magic'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>✨</span>
            <span>{lang === 'tr' ? 'Sihirli Boyama' : 'Magic Touch'}</span>
          </button>
          <button
            id="btn-mode-free"
            onClick={() => {
              setActiveMode('free');
              speak(lang === 'tr' ? 'Serbest Çizim seçildi!' : 'Freehand sketch mode!', lang);
            }}
            className={`px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'free'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Paintbrush size={14} />
            <span>{lang === 'tr' ? 'Serbest Çizim' : 'Free Canvas'}</span>
          </button>
        </div>
      </div>

      {/* Template Quick Selection Bar */}
      <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-100 p-3.5 mb-6">
        <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
          <Smile size={14} className="text-emerald-500" />
          <span>{lang === 'tr' ? 'Boyanacak Şirin Bir Şablon Seç' : 'Choose a Cute Picture to Color'}</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TEMPLATES.map((tpl, idx) => {
            const isSelected = selectedTemplateIndex === idx;
            return (
              <button
                key={tpl.id}
                onClick={() => {
                  setSelectedTemplateIndex(idx);
                  speak(lang === 'tr' ? tpl.nameTr : tpl.nameEn, lang);
                }}
                className={`p-2.5 rounded-xl border-2 transition-all active:scale-95 flex items-center justify-center gap-2 font-black text-xs sm:text-sm cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-white ring-4 ring-emerald-200 scale-105 shadow-sm text-emerald-950'
                    : 'border-emerald-200/50 bg-emerald-100/50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <span className="text-2xl">{tpl.emoji}</span>
                <span>{lang === 'tr' ? tpl.nameTr : tpl.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sandbox Interactive Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Interactive Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-[#FFF9E6] rounded-3xl border-4 border-amber-200 p-4 shadow-inner flex flex-col items-center justify-center min-h-[400px] relative">
          
          {activeMode === 'magic' ? (
            /* Mode 1: SVG Magic Tap-to-Fill Canvas */
            <div className="w-full max-w-[340px] sm:max-w-[420px] aspect-square flex items-center justify-center">
              {currentTemplate.id === 'butterfly' && (
                <svg viewBox="0 0 400 400" className="w-full h-full select-none cursor-pointer filter drop-shadow-md">
                  {/* Sky/Background */}
                  <rect 
                    width="400" height="400" rx="30" 
                    fill={templateColors.butterfly.bg} 
                    stroke="#1E293B" strokeWidth="6"
                    onClick={() => handleRegionClick('bg')}
                  />
                  {/* Grass/Plants details in BG */}
                  <path d="M0,400 Q100,320 200,400 T400,400" fill="none" stroke="#1E293B" strokeWidth="4" />
                  
                  {/* Left Wings */}
                  <path 
                    d="M200,200 C120,80 40,110 50,190 C60,250 140,240 200,210 Z" 
                    fill={templateColors.butterfly.leftWingTop} 
                    stroke="#1E293B" strokeWidth="6" strokeLinejoin="round"
                    onClick={() => handleRegionClick('leftWingTop')}
                  />
                  <path 
                    d="M200,210 C140,240 70,260 80,310 C90,360 160,330 200,220 Z" 
                    fill={templateColors.butterfly.leftWingBottom} 
                    stroke="#1E293B" strokeWidth="6" strokeLinejoin="round"
                    onClick={() => handleRegionClick('leftWingBottom')}
                  />

                  {/* Right Wings */}
                  <path 
                    d="M200,200 C280,80 360,110 350,190 C340,250 260,240 200,210 Z" 
                    fill={templateColors.butterfly.rightWingTop} 
                    stroke="#1E293B" strokeWidth="6" strokeLinejoin="round"
                    onClick={() => handleRegionClick('rightWingTop')}
                  />
                  <path 
                    d="M200,210 C260,240 330,260 320,310 C310,360 240,330 200,220 Z" 
                    fill={templateColors.butterfly.rightWingBottom} 
                    stroke="#1E293B" strokeWidth="6" strokeLinejoin="round"
                    onClick={() => handleRegionClick('rightWingBottom')}
                  />

                  {/* Wing Spot Details */}
                  <circle 
                    cx="110" cy="160" r="18" 
                    fill={templateColors.butterfly.wingDetail1} 
                    stroke="#1E293B" strokeWidth="4"
                    onClick={() => handleRegionClick('wingDetail1')}
                  />
                  <circle 
                    cx="290" cy="160" r="18" 
                    fill={templateColors.butterfly.wingDetail2} 
                    stroke="#1E293B" strokeWidth="4"
                    onClick={() => handleRegionClick('wingDetail2')}
                  />
                  <circle 
                    cx="130" cy="280" r="14" 
                    fill={templateColors.butterfly.wingDetail3} 
                    stroke="#1E293B" strokeWidth="4"
                    onClick={() => handleRegionClick('wingDetail3')}
                  />
                  <circle 
                    cx="270" cy="280" r="14" 
                    fill={templateColors.butterfly.wingDetail4} 
                    stroke="#1E293B" strokeWidth="4"
                    onClick={() => handleRegionClick('wingDetail4')}
                  />

                  {/* Antennae */}
                  <path d="M190,140 Q160,80 140,90" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
                  <path d="M210,140 Q240,80 260,90" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="140" cy="90" r="8" fill="#1E293B" />
                  <circle cx="260" cy="90" r="8" fill="#1E293B" />

                  {/* Butterfly Body */}
                  <rect 
                    x="184" y="130" width="32" height="110" rx="16" 
                    fill={templateColors.butterfly.body} 
                    stroke="#1E293B" strokeWidth="6"
                    onClick={() => handleRegionClick('body')}
                  />
                  <circle 
                    cx="200" cy="120" r="24" 
                    fill={templateColors.butterfly.head} 
                    stroke="#1E293B" strokeWidth="6"
                    onClick={() => handleRegionClick('head')}
                  />

                  {/* Cute Face Details (Always cute) */}
                  <circle cx="192" cy="116" r="3.5" fill="#1E293B" />
                  <circle cx="208" cy="116" r="3.5" fill="#1E293B" />
                  <path d="M194,126 Q200,132 206,126" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}

              {currentTemplate.id === 'rocket' && (
                <svg viewBox="0 0 400 400" className="w-full h-full select-none cursor-pointer filter drop-shadow-md">
                  {/* Space BG */}
                  <rect 
                    width="400" height="400" rx="30" 
                    fill={templateColors.rocket.bg} 
                    stroke="#1E293B" strokeWidth="6"
                    onClick={() => handleRegionClick('bg')}
                  />

                  {/* Big Planet */}
                  <circle 
                    cx="70" cy="300" r="45" 
                    fill={templateColors.rocket.planet} 
                    stroke="#1E293B" strokeWidth="5"
                    onClick={() => handleRegionClick('planet')}
                  />
                  <path d="M20,300 Q70,270 120,300" fill="none" stroke="#1E293B" strokeWidth="4" />

                  {/* Stars */}
                  <polygon 
                    points="320,80 325,95 340,95 328,105 332,120 320,110 308,120 312,105 300,95 315,95" 
                    fill={templateColors.rocket.star1} 
                    stroke="#1E293B" strokeWidth="3"
                    onClick={() => handleRegionClick('star1')}
                  />
                  <polygon 
                    points="120,60 123,70 135,70 125,78 128,90 120,82 112,90 115,78 105,70 117,70" 
                    fill={templateColors.rocket.star2} 
                    stroke="#1E293B" strokeWidth="3"
                    onClick={() => handleRegionClick('star2')}
                  />

                  {/* Rocket exhaust flame */}
                  <path 
                    d="M175,280 L160,340 L200,380 L240,340 L225,280 Z" 
                    fill={templateColors.rocket.fire} 
                    stroke="#1E293B" strokeWidth="5" strokeLinejoin="round"
                    onClick={() => handleRegionClick('fire')}
                  />

                  {/* Rocket Fins / Wings */}
                  <path 
                    d="M165,220 L115,280 L165,280 Z" 
                    fill={templateColors.rocket.wingLeft} 
                    stroke="#1E293B" strokeWidth="5" strokeLinejoin="round"
                    onClick={() => handleRegionClick('wingLeft')}
                  />
                  <path 
                    d="M235,220 L285,280 L235,280 Z" 
                    fill={templateColors.rocket.wingRight} 
                    stroke="#1E293B" strokeWidth="5" strokeLinejoin="round"
                    onClick={() => handleRegionClick('wingRight')}
                  />

                  {/* Rocket Body */}
                  <path 
                    d="M165,130 L165,280 L235,280 L235,130 Z" 
                    fill={templateColors.rocket.body} 
                    stroke="#1E293B" strokeWidth="6" strokeLinejoin="round"
                    onClick={() => handleRegionClick('body')}
                  />

                  {/* Rocket Nose */}
                  <path 
                    d="M165,130 C165,60 200,30 200,30 C200,30 235,60 235,130 Z" 
                    fill={templateColors.rocket.nose} 
                    stroke="#1E293B" strokeWidth="6" strokeLinejoin="round"
                    onClick={() => handleRegionClick('nose')}
                  />

                  {/* Motor Thruster ring */}
                  <rect 
                    x="175" y="280" width="50" height="12" rx="4" 
                    fill={templateColors.rocket.thruster} 
                    stroke="#1E293B" strokeWidth="5"
                    onClick={() => handleRegionClick('thruster')}
                  />

                  {/* Window outer ring */}
                  <circle 
                    cx="200" cy="180" r="32" 
                    fill={templateColors.rocket.windowOuter} 
                    stroke="#1E293B" strokeWidth="5"
                    onClick={() => handleRegionClick('windowOuter')}
                  />
                  {/* Window inner glass */}
                  <circle 
                    cx="200" cy="180" r="20" 
                    fill={templateColors.rocket.windowInner} 
                    stroke="#1E293B" strokeWidth="4"
                    onClick={() => handleRegionClick('windowInner')}
                  />
                </svg>
              )}

              {currentTemplate.id === 'fish' && (
                <svg viewBox="0 0 400 400" className="w-full h-full select-none cursor-pointer filter drop-shadow-md">
                  {/* Underwater Water BG */}
                  <rect 
                    width="400" height="400" rx="30" 
                    fill={templateColors.fish.bg} 
                    stroke="#1E293B" strokeWidth="6"
                    onClick={() => handleRegionClick('bg')}
                  />

                  {/* Sandy floor */}
                  <path 
                    d="M0,350 Q100,330 200,360 T400,340 L400,400 L0,400 Z" 
                    fill={templateColors.fish.sand} 
                    stroke="#1E293B" strokeWidth="5"
                    onClick={() => handleRegionClick('sand')}
                  />

                  {/* Seaweeds */}
                  <path 
                    d="M50,360 Q35,280 60,200 Q70,280 65,360" 
                    fill={templateColors.fish.seaweedLeft} 
                    stroke="#1E293B" strokeWidth="4" strokeLinejoin="round"
                    onClick={() => handleRegionClick('seaweedLeft')}
                  />
                  <path 
                    d="M340,360 Q360,250 330,170 Q315,250 325,360" 
                    fill={templateColors.fish.seaweedRight} 
                    stroke="#1E293B" strokeWidth="4" strokeLinejoin="round"
                    onClick={() => handleRegionClick('seaweedRight')}
                  />

                  {/* Bubbles */}
                  <circle 
                    cx="120" cy="110" r="14" 
                    fill={templateColors.fish.bubble1} 
                    stroke="#1E293B" strokeWidth="4"
                    onClick={() => handleRegionClick('bubble1')}
                  />
                  <circle 
                    cx="90" cy="70" r="22" 
                    fill={templateColors.fish.bubble2} 
                    stroke="#1E293B" strokeWidth="4"
                    onClick={() => handleRegionClick('bubble2')}
                  />

                  {/* Fins top and bottom */}
                  <path 
                    d="M200,120 Q240,60 270,120 Z" 
                    fill={templateColors.fish.finTop} 
                    stroke="#1E293B" strokeWidth="5" strokeLinejoin="round"
                    onClick={() => handleRegionClick('finTop')}
                  />
                  <path 
                    d="M210,240 Q230,290 250,240 Z" 
                    fill={templateColors.fish.finBottom} 
                    stroke="#1E293B" strokeWidth="5" strokeLinejoin="round"
                    onClick={() => handleRegionClick('finBottom')}
                  />

                  {/* Tail fin */}
                  <path 
                    d="M300,180 C360,130 380,100 370,180 C380,260 360,230 300,180 Z" 
                    fill={templateColors.fish.tail} 
                    stroke="#1E293B" strokeWidth="5" strokeLinejoin="round"
                    onClick={() => handleRegionClick('tail')}
                  />

                  {/* Fish main Body */}
                  <path 
                    d="M120,180 C180,110 300,120 310,180 C300,240 180,250 120,180 Z" 
                    fill={templateColors.fish.body} 
                    stroke="#1E293B" strokeWidth="6" strokeLinejoin="round"
                    onClick={() => handleRegionClick('body')}
                  />

                  {/* Stripes */}
                  <path 
                    d="M190,142 Q200,180 190,218" 
                    fill="none" stroke={templateColors.fish.stripe1} strokeWidth="12" strokeLinecap="round"
                    onClick={() => handleRegionClick('stripe1')}
                  />
                  <path 
                    d="M240,140 Q250,180 240,220" 
                    fill="none" stroke={templateColors.fish.stripe2} strokeWidth="12" strokeLinecap="round"
                    onClick={() => handleRegionClick('stripe2')}
                  />

                  {/* Eye details */}
                  <circle cx="155" cy="165" r="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
                  <circle cx="152" cy="163" r="5" fill="#1E293B" />
                  
                  {/* Happy Smile */}
                  <path d="M138,185 Q145,192 152,183" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}

              {currentTemplate.id === 'cat' && (
                <svg viewBox="0 0 400 400" className="w-full h-full select-none cursor-pointer filter drop-shadow-md">
                  {/* Home wallpaper/floor BG */}
                  <rect 
                    width="400" height="400" rx="30" 
                    fill={templateColors.cat.bg} 
                    stroke="#1E293B" strokeWidth="6"
                    onClick={() => handleRegionClick('bg')}
                  />

                  {/* Floor line */}
                  <line x1="0" y1="330" x2="400" y2="330" stroke="#1E293B" strokeWidth="5" />

                  {/* Tail */}
                  <path 
                    d="M290,260 Q360,220 340,140 Q320,150 310,210 Z" 
                    fill={templateColors.cat.tail} 
                    stroke="#1E293B" strokeWidth="5" strokeLinejoin="round"
                    onClick={() => handleRegionClick('tail')}
                  />

                  {/* Left Ear */}
                  <path 
                    d="M120,110 L80,30 L150,60 Z" 
                    fill={templateColors.cat.earLeftOuter} 
                    stroke="#1E293B" strokeWidth="5" strokeLinejoin="round"
                    onClick={() => handleRegionClick('earLeftOuter')}
                  />
                  <path 
                    d="M110,95 L88,44 L132,64 Z" 
                    fill={templateColors.cat.earLeftInner} 
                    stroke="#1E293B" strokeWidth="4" strokeLinejoin="round"
                    onClick={() => handleRegionClick('earLeftInner')}
                  />

                  {/* Right Ear */}
                  <path 
                    d="M240,110 L280,30 L210,60 Z" 
                    fill={templateColors.cat.earRightOuter} 
                    stroke="#1E293B" strokeWidth="5" strokeLinejoin="round"
                    onClick={() => handleRegionClick('earRightOuter')}
                  />
                  <path 
                    d="M250,95 L272,44 L228,64 Z" 
                    fill={templateColors.cat.earRightInner} 
                    stroke="#1E293B" strokeWidth="4" strokeLinejoin="round"
                    onClick={() => handleRegionClick('earRightInner')}
                  />

                  {/* Kitty Body */}
                  <path 
                    d="M125,210 C125,210 110,310 130,310 C150,310 210,310 230,310 C250,310 235,210 235,210 Z" 
                    fill={templateColors.cat.body} 
                    stroke="#1E293B" strokeWidth="6" strokeLinejoin="round"
                    onClick={() => handleRegionClick('body')}
                  />

                  {/* Paw Details */}
                  <rect 
                    x="134" y="300" width="30" height="20" rx="10" 
                    fill={templateColors.cat.paws} 
                    stroke="#1E293B" strokeWidth="4"
                    onClick={() => handleRegionClick('paws')}
                  />
                  <rect 
                    x="196" y="300" width="30" height="20" rx="10" 
                    fill={templateColors.cat.paws} 
                    stroke="#1E293B" strokeWidth="4"
                    onClick={() => handleRegionClick('paws')}
                  />

                  {/* Face Head */}
                  <circle 
                    cx="180" cy="140" r="70" 
                    fill={templateColors.cat.face} 
                    stroke="#1E293B" strokeWidth="6"
                    onClick={() => handleRegionClick('face')}
                  />

                  {/* Collar and golden bell */}
                  <path 
                    d="M130,195 Q180,215 230,195" 
                    fill="none" stroke={templateColors.cat.collar} strokeWidth="12" strokeLinecap="round"
                    onClick={() => handleRegionClick('collar')}
                  />
                  <circle 
                    cx="180" cy="214" r="14" 
                    fill={templateColors.cat.bell} 
                    stroke="#1E293B" strokeWidth="4"
                    onClick={() => handleRegionClick('bell')}
                  />
                  <circle cx="180" cy="214" r="3" fill="#1E293B" />

                  {/* Whiskers */}
                  <line x1="110" y1="145" x2="65" y2="140" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
                  <line x1="110" y1="155" x2="60" y2="155" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
                  <line x1="250" y1="145" x2="295" y2="140" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
                  <line x1="250" y1="155" x2="300" y2="155" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />

                  {/* Eye circles */}
                  <circle cx="152" cy="125" r="8" fill="#1E293B" />
                  <circle cx="150" cy="122" r="2.5" fill="#FFFFFF" />
                  <circle cx="208" cy="125" r="8" fill="#1E293B" />
                  <circle cx="206" cy="122" r="2.5" fill="#FFFFFF" />

                  {/* Tiny pink nose */}
                  <polygon points="174,142 186,142 180,149" fill="#EC4899" stroke="#1E293B" strokeWidth="2.5" />

                  {/* Mouth curves */}
                  <path d="M172,154 Q180,160 180,154 Q180,160 188,154" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
            </div>
          ) : (
            /* Mode 2: HTML5 Sketching Tuval Canvas */
            <div className="w-full h-full flex flex-col items-center justify-center">
              {/* Brush size settings overlay floating in Tuval */}
              <div className="absolute top-3 left-4 flex items-center gap-3 bg-white/90 border-2 border-purple-200 px-3 py-1.5 rounded-2xl shadow-sm z-10">
                <span className="text-xs font-black text-purple-900">{lang === 'tr' ? 'Fırça:' : 'Size:'}</span>
                <input
                  type="range"
                  min="4"
                  max="36"
                  value={brushWidth}
                  onChange={(e) => setBrushWidth(parseInt(e.target.value, 10))}
                  className="w-20 accent-purple-600 h-2 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-lg border border-purple-100">
                  {brushWidth}px
                </span>

                <button
                  onClick={() => {
                    setIsEraser(!isEraser);
                    speak(isEraser ? (lang === 'tr' ? 'Kalem fırçası seçildi!' : 'Pen brush selected!') : (lang === 'tr' ? 'Silgi seçildi!' : 'Eraser selected!'), lang);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all border cursor-pointer ${
                    isEraser
                      ? 'bg-rose-500 border-rose-600 text-white shadow-sm'
                      : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  <span>🧹</span>
                  <span>{lang === 'tr' ? 'Silgi' : 'Eraser'}</span>
                </button>
              </div>

              {/* HTML5 drawing element */}
              <canvas
                ref={canvasRef}
                width={480}
                height={400}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="bg-[#FFF9E6] max-w-full aspect-[6/5] rounded-2xl border-4 border-dashed border-purple-300 cursor-crosshair touch-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 8 8'%3E%3Cpath d='M0 0h4v4H0V0zm4 4h4v4H4V4z' fill='%23FEE2E2' fill-opacity='.12'/%3E%3C/svg%3E")` }}
              />
              
              <p className="text-[11px] font-bold text-purple-700/80 mt-2 text-center">
                {lang === 'tr' 
                  ? '👆 Parmağınla veya farenle tuvale dilediğini çizerek boyayabilirsin!'
                  : '👆 Paint and sketch anything you want using your finger or mouse cursor!'}
              </p>
            </div>
          )}

          {/* Prompt banner for currently hovered or active area */}
          <div className="absolute bottom-3 right-4 bg-white/95 border-2 border-amber-200 rounded-full px-4 py-1.5 shadow-sm text-xs font-black text-amber-900 flex items-center gap-1.5 animate-bounce">
            <span className="text-sm">⭐️</span>
            <span>
              {activeMode === 'magic'
                ? (lang === 'tr' ? `${currentTemplate.nameTr} Boyanıyor` : `Coloring ${currentTemplate.nameEn}`)
                : (lang === 'tr' ? 'Özgür Çizim Paneli' : 'Freehand Drawing Board')}
            </span>
          </div>

        </div>

        {/* Right Color Swatches and Actions Sidebar (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-5">
          
          {/* Palette selections */}
          <div className="bg-white rounded-3xl border-2 border-emerald-100 p-5 flex-1 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <span className="text-2xl">🎨</span>
              <h4 className="text-sm font-black text-emerald-950 uppercase tracking-wide">
                {lang === 'tr' ? 'Eğlenceli Boya Kutuları' : 'Magic Paint Boxes'}
              </h4>
            </div>

            {/* Selected color status */}
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-2.5 rounded-2xl mb-4 shadow-inner">
              <div 
                className="w-10 h-10 rounded-xl border-2 border-white shadow-md transform rotate-6 animate-pulse"
                style={{ backgroundColor: selectedColor }}
              />
              <div className="text-left">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'tr' ? 'Seçili Renk' : 'Active Color'}</span>
                <h5 className="text-xs sm:text-sm font-black text-gray-800 flex items-center gap-1">
                  <span>{activeColorObject.emoji}</span>
                  <span>{lang === 'tr' ? activeColorObject.nameTr : activeColorObject.nameEn}</span>
                </h5>
              </div>
            </div>

            {/* Bubble swatches grid */}
            <div className="grid grid-cols-3 gap-3">
              {COLOR_PALETTE.map((c) => {
                const isActive = selectedColor === c.hex;
                return (
                  <button
                    key={c.hex}
                    onClick={() => handleSelectColor(c.hex, c.nameTr, c.nameEn)}
                    style={{ backgroundColor: c.hex }}
                    className={`h-11 sm:h-12 rounded-2xl border-4 transition-all active:scale-95 flex items-center justify-center cursor-pointer relative shadow-sm group ${
                      isActive
                        ? 'border-emerald-500 scale-110 rotate-3 z-10 ring-4 ring-emerald-100'
                        : 'border-white hover:border-gray-100'
                    }`}
                    title={lang === 'tr' ? c.nameTr : c.nameEn}
                  >
                    <span className="text-lg filter drop-shadow group-hover:scale-125 transition-transform">
                      {c.emoji}
                    </span>
                    {isActive && (
                      <span className="absolute -bottom-1 -right-1 text-[9px] bg-emerald-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white font-extrabold shadow">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="bg-emerald-50/50 rounded-3xl border border-emerald-100 p-4 flex flex-col gap-3">
            <button
              onClick={handleResetTemplate}
              className="w-full py-3 bg-white hover:bg-gray-100 text-emerald-800 font-black rounded-2xl border-2 border-emerald-200/60 active:translate-y-0.5 shadow-sm transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} className="stroke-[2.5px]" />
              <span>{lang === 'tr' ? 'Baştan Temizle' : 'Clear All'}</span>
            </button>

            <button
              onClick={handleCompleteColoring}
              className="w-full py-4.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black rounded-2xl border-b-6 border-emerald-700 active:translate-y-1 active:border-b-2 shadow-md transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer animate-pulse"
            >
              <CheckCircle2 size={18} className="stroke-[3px]" />
              <span>{lang === 'tr' ? 'BOYAMAYI BİTİR! 🎉' : 'I AM DONE! 🎉'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
