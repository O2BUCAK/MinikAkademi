import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Undo, Trash2, Eraser, Sparkles, Volume2, ArrowLeft, Paintbrush } from 'lucide-react';
import { speak } from '../utils/speak';
import { Language } from '../types';

interface WritingCanvasProps {
  letter: string;
  word: { tr: string; en: string };
  emoji: string;
  lang: Language;
  onBack?: () => void;
  onEarnXp?: (amt: number) => void;
}

const BRUSH_COLORS = [
  { name: 'Kırmızı / Red', hex: '#FF4D4D' },
  { name: 'Mavi / Blue', hex: '#3B82F6' },
  { name: 'Yeşil / Green', hex: '#10B981' },
  { name: 'Sarı / Yellow', hex: '#FBBF24' },
  { name: 'Pembe / Pink', hex: '#EC4899' },
  { name: 'Mor / Purple', hex: '#8B5CF6' },
  { name: 'Rainbow', hex: 'rainbow' }, // special rainbow brush
];

export default function WritingCanvas({ letter, word, emoji, lang, onBack, onEarnXp }: WritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#FF4D4D');
  const [brushSize, setBrushSize] = useState(12);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [rainbowHue, setRainbowHue] = useState(0);

  // Success messages
  const successMessages = {
    tr: [
      'Harika yazdın!',
      'Muhteşem!',
      'Süper gidiyorsun!',
      'Tebrikler, çok güzel!',
      'Aferin sana!',
    ],
    en: [
      'Wonderful writing!',
      'Awesome!',
      'Super job!',
      'Congratulations, beautiful!',
      'Well done!',
    ],
  };

  // Sound cue on mounting
  useEffect(() => {
    const isNumber = !isNaN(Number(letter));
    const textToSpeak = lang === 'tr' 
      ? (isNumber ? `Hadi ${letter} sayısını yazalım! ${word.tr}` : `Hadi ${letter} harfini yazalım! ${word.tr}`)
      : (isNumber ? `Let's write the number ${letter}! ${word.en}` : `Let's write the letter ${letter}! ${word.en}`);
    speak(textToSpeak, lang);
  }, [letter, lang]);

  // Adjust canvas resolution based on container size
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Draw standard line guides for children's tracing
      drawNotebookLines(canvas);
      
      // Load history if exists
      if (history.length > 0) {
        const img = new Image();
        img.src = history[history.length - 1];
        img.onload = () => {
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.drawImage(img, 0, 0);
        };
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [letter]);

  // Keep rainbow color shifting
  useEffect(() => {
    if (brushColor === 'rainbow' && isDrawing) {
      const interval = setInterval(() => {
        setRainbowHue((prev) => (prev + 5) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [brushColor, isDrawing]);

  const drawNotebookLines = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Draw school book dashed lines behind
    ctx.save();
    ctx.strokeStyle = '#D1D5DB'; // light gray
    ctx.lineWidth = 1.5;

    // We draw 3 lines to represent the classic learning handwriting lines
    const lineSpacing = h * 0.15;
    const centerY = h / 2;

    // Top line
    ctx.beginPath();
    ctx.moveTo(0, centerY - lineSpacing);
    ctx.lineTo(w, centerY - lineSpacing);
    ctx.stroke();

    // Bottom line
    ctx.beginPath();
    ctx.moveTo(0, centerY + lineSpacing);
    ctx.lineTo(w, centerY + lineSpacing);
    ctx.stroke();

    // Dotted mid line
    ctx.strokeStyle = '#FCA5A5'; // soft red/pink
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(w, centerY);
    ctx.stroke();

    ctx.restore();
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save state to history before drawing
    saveToHistory();

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (isEraser) {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 2.5; // larger eraser is friendly
    } else {
      ctx.strokeStyle = brushColor === 'rainbow' ? `hsl(${rainbowHue}, 90%, 60%)` : brushColor;
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (isEraser) {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 2.5;
    } else {
      ctx.strokeStyle = brushColor === 'rainbow' ? `hsl(${rainbowHue}, 90%, 60%)` : brushColor;
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory((prev) => [...prev, canvas.toDataURL()]);
  };

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNotebookLines(canvas);

    if (history.length > 0) {
      const newHistory = [...history];
      const previousState = newHistory.pop(); // remove last state
      setHistory(newHistory);

      if (previousState) {
        const img = new Image();
        img.src = previousState;
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveToHistory();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNotebookLines(canvas);
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    onEarnXp?.(100); // Massive 100 XP award for drawing completion!
    // Voice praise
    const array = successMessages[lang];
    const phrase = array[Math.floor(Math.random() * array.length)];
    speak(phrase, lang);

    setTimeout(() => {
      setShowCelebration(false);
    }, 4000);
  };

  const handleSpeakWord = () => {
    const textToSpeak = lang === 'tr' 
      ? `${letter}. ${word.tr}.` 
      : `${letter}. ${word.en}.`;
    speak(textToSpeak, lang);
    onEarnXp?.(10); // Award 10 XP
  };

  return (
    <div className="flex flex-col h-full bg-purple-50 rounded-3xl p-4 md:p-6 shadow-xl border-4 border-purple-200 relative overflow-hidden select-none">
      
      {/* Top action bar */}
      <div className="flex justify-between items-center mb-4 gap-2 z-10">
        <button
          id="btn-back-to-alphabet"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white text-purple-700 font-bold rounded-full border-2 border-purple-300 hover:bg-purple-100 transition-all text-sm md:text-base shadow-sm cursor-pointer"
        >
          <ArrowLeft size={18} className="stroke-[3px]" />
          <span>{lang === 'tr' ? 'Geri Dön' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-full border-2 border-purple-300 shadow-sm animate-bounce">
          <span className="text-3xl md:text-4xl">{emoji}</span>
          <div className="text-left">
            <div className="text-xs text-purple-500 font-bold tracking-wider uppercase">
              {lang === 'tr' ? 'KELİME' : 'WORD'}
            </div>
            <div className="text-lg md:text-xl font-extrabold text-purple-900 flex items-center gap-1.5">
              <span>{lang === 'tr' ? word.tr : word.en}</span>
              <button 
                id="btn-speak-word-canvas"
                onClick={handleSpeakWord} 
                className="text-purple-500 hover:text-purple-700 hover:scale-110 active:scale-95 transition-all p-0.5 cursor-pointer"
              >
                <Volume2 size={16} className="stroke-[3.5px]" />
              </button>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-bold text-purple-700 bg-purple-200/50 px-3 py-1 rounded-full border border-purple-200">
            {!isNaN(Number(letter))
              ? (lang === 'tr' ? 'Sayı Çizimi' : 'Number Drawing')
              : (lang === 'tr' ? 'Harf Çizimi' : 'Letter Drawing')}
          </span>
        </div>
      </div>

      {/* Main Grid: Tools + Canvas */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch relative min-h-0">
        
        {/* Colors and Brush Settings (left on wide, top/bottom on narrow) */}
        <div className="md:col-span-3 bg-white rounded-2xl border-2 border-purple-200 p-4 flex flex-col justify-between gap-4 shadow-sm z-10">
          <div>
            <h3 className="text-sm font-black text-purple-900 mb-2.5 flex items-center gap-1.5">
              <Paintbrush size={16} className="text-purple-500 stroke-[3px]" />
              <span>{lang === 'tr' ? 'Renk Kalemi' : 'Magic Colors'}</span>
            </h3>
            
            {/* Color Palette Grid */}
            <div className="grid grid-cols-4 md:grid-cols-3 gap-2">
              {BRUSH_COLORS.map((color) => {
                const isActive = brushColor === color.hex && !isEraser;
                const isRainbow = color.hex === 'rainbow';
                
                return (
                  <button
                    id={`btn-color-${color.name.toLowerCase().replace(/[\s\/]/g, '-')}`}
                    key={color.hex}
                    onClick={() => {
                      setBrushColor(color.hex);
                      setIsEraser(false);
                    }}
                    style={{
                      background: isRainbow
                        ? 'linear-gradient(135deg, #ff4d4d, #fbbf24, #10b981, #3b82f6, #ec4899)'
                        : color.hex,
                    }}
                    className={`aspect-square rounded-xl transition-all relative transform hover:scale-105 active:scale-95 border-2 shadow-sm cursor-pointer ${
                      isActive ? 'border-purple-900 scale-110 ring-4 ring-purple-400' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    title={color.name}
                  >
                    {isActive && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs drop-shadow-md">
                        🌟
                      </span>
                    )}
                  </button>
                );
              })}
              
              {/* Eraser Tool */}
              <button
                id="btn-tool-eraser"
                onClick={() => setIsEraser(true)}
                className={`aspect-square rounded-xl transition-all border-2 flex flex-col items-center justify-center gap-0.5 text-xs font-bold shadow-sm cursor-pointer ${
                  isEraser 
                    ? 'bg-purple-100 border-purple-600 text-purple-900 ring-4 ring-purple-400 scale-110' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-500'
                }`}
              >
                <Eraser size={20} className={isEraser ? 'text-purple-700 animate-pulse' : 'text-gray-400'} />
                <span className="scale-75 md:scale-100">{lang === 'tr' ? 'Silgi' : 'Eraser'}</span>
              </button>
            </div>
          </div>

          {/* Brush Size Picker */}
          <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
            <div className="flex justify-between items-center mb-1 text-xs font-bold text-purple-900">
              <span>{lang === 'tr' ? 'Kalem Kalınlığı' : 'Brush Size'}</span>
              <span className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full text-[10px]">
                {brushSize}px
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="brush-size-range"
                type="range"
                min="6"
                max="32"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="flex-1 accent-purple-500 cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none"
              />
              <div 
                className="bg-purple-500 rounded-full flex-shrink-0"
                style={{ 
                  width: `${Math.min(brushSize, 24)}px`, 
                  height: `${Math.min(brushSize, 24)}px` 
                }}
              />
            </div>
          </div>

          {/* Quick Actions (Undo, Clear) */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              id="btn-draw-undo"
              onClick={undo}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 text-gray-700 font-extrabold rounded-xl border-2 border-gray-200 hover:bg-gray-200 active:scale-95 transition-all text-xs cursor-pointer"
            >
              <Undo size={14} className="stroke-[3px]" />
              <span>{lang === 'tr' ? 'Geri' : 'Undo'}</span>
            </button>
            <button
              id="btn-draw-clear"
              onClick={clearCanvas}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-red-50 text-red-600 font-extrabold rounded-xl border-2 border-red-200 hover:bg-red-100 active:scale-95 transition-all text-xs cursor-pointer"
            >
              <Trash2 size={14} className="stroke-[3px]" />
              <span>{lang === 'tr' ? 'Temizle' : 'Clear'}</span>
            </button>
          </div>
        </div>

        {/* Drawing Board Canvas Area */}
        <div className="md:col-span-9 flex flex-col items-stretch relative min-h-[340px] md:min-h-[400px]">
          
          {/* Notebook Paper Overlay containing the dotted guide letter */}
          <div className="absolute inset-0 bg-white rounded-2xl border-4 border-purple-200 shadow-inner overflow-hidden select-none">
            
            {/* Lined notebook decoration behind */}
            <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
            
            {/* Template guide letter centered in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
              <span className="text-[180px] sm:text-[240px] md:text-[280px] font-black tracking-widest text-purple-500/10 uppercase select-none font-sans border-4 border-dashed border-purple-500/5 px-8 rounded-3xl">
                {letter}
              </span>
            </div>

            {/* School paper red side line decoration */}
            <div className="absolute left-10 md:left-14 top-0 bottom-0 border-r-2 border-red-200 pointer-events-none z-0" />

            {/* The Actual Canvas for Drawing */}
            <div ref={containerRef} className="w-full h-full relative z-10">
              <canvas
                id="writing-trace-canvas"
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full cursor-crosshair block absolute inset-0 touch-none"
              />
            </div>
            
            {/* "I'm Done" / Completed stamp button */}
            <div className="absolute bottom-4 right-4 z-20">
              <button
                id="btn-drawing-finished-success"
                onClick={triggerCelebration}
                className="flex items-center gap-2 px-5 py-3 bg-purple-500 hover:bg-purple-600 active:scale-95 text-white font-black rounded-full border-b-8 border-purple-700 shadow-lg text-sm sm:text-base transition-all animate-pulse cursor-pointer"
              >
                <Sparkles size={18} className="fill-white" />
                <span>{lang === 'tr' ? 'Bitirdim! 🌟' : "Finished! 🌟"}</span>
              </button>
            </div>

            {/* Hint message overlay */}
            <div className="absolute top-2 left-16 md:left-20 pointer-events-none z-20">
              <span className="text-[10px] sm:text-xs font-bold text-purple-500/70 bg-purple-50/90 px-3 py-1 rounded-full border border-purple-100 shadow-sm uppercase tracking-wider">
                {!isNaN(Number(letter))
                  ? (lang === 'tr' ? 'Parmağınla Çizerek Sayıyı Takip Et' : 'Trace the number with your finger')
                  : (lang === 'tr' ? 'Parmağınla Çizerek Harfi Takip Et' : 'Trace the letter with your finger')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Celebration Modal / Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-purple-950/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 pointer-events-auto"
          >
            {/* Balloon / Star Burst Box */}
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-center border-4 border-purple-300 shadow-2xl relative"
            >
              {/* Confetti Emojis popping out */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2 text-3xl">
                <span>🎈</span>
                <span>🎉</span>
                <span>⭐</span>
                <span>🎈</span>
              </div>

              <div className="text-6xl md:text-7xl mb-4 transform hover:rotate-12 transition-transform duration-300">
                🏆
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-purple-900 mb-2">
                {lang === 'tr' ? 'Harika İş Çıkardın!' : 'Brilliant Writing!'}
              </h2>
              
              <p className="text-base font-bold text-purple-600 mb-6 bg-purple-50 py-2.5 px-4 rounded-xl border border-purple-100">
                {lang === 'tr' ? 'Öğrenmeye devam et, sen bir yıldızsın!' : 'Keep learning, you are a star!'}
              </p>

              <button
                id="btn-celebration-continue"
                onClick={() => setShowCelebration(false)}
                className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold rounded-full border-b-8 border-indigo-700 shadow-lg text-base transition-all cursor-pointer"
              >
                {lang === 'tr' ? 'Tekrar Çiz veya Devam Et ➔' : 'Draw Again or Continue ➔'}
              </button>

              {/* Little floating stars */}
              <div className="absolute -bottom-4 -left-4 text-2xl animate-bounce">⭐</div>
              <div className="absolute -bottom-4 -right-4 text-2xl animate-bounce delay-150">🌟</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
