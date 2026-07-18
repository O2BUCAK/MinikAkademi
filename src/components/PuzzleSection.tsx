import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Puzzle, RefreshCw, Star, Trophy, Sparkles, AlertCircle, Play, Eye, Flame, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { speak } from '../utils/speak';

interface PuzzleSectionProps {
  lang: Language;
  onEarnXp: (amount: number) => void;
}

interface PuzzleTheme {
  id: string;
  nameTr: string;
  nameEn: string;
  emoji: string;
  bgGradient: string;
  // Elements rendered within the composite image scene
  renderScene: () => React.ReactNode;
}

const PUZZLE_THEMES: PuzzleTheme[] = [
  {
    id: 'eagle',
    nameTr: 'Gökyüzü Kartalı',
    nameEn: 'Sky Eagle',
    emoji: '🦅',
    bgGradient: 'from-sky-300 via-blue-200 to-indigo-300',
    renderScene: () => (
      <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-4">
        {/* Sun */}
        <div className="absolute top-4 right-6 text-5xl animate-spin duration-10000">☀️</div>
        {/* Clouds */}
        <div className="absolute top-8 left-4 text-4xl opacity-80 animate-pulse">☁️</div>
        <div className="absolute top-16 right-16 text-3xl opacity-60">☁️</div>
        {/* Flying hot air balloon */}
        <div className="absolute top-24 left-16 text-4xl animate-bounce">🎈</div>
        {/* Rainbow arch */}
        <div className="absolute bottom-12 left-0 right-0 h-10 bg-gradient-to-r from-red-400 via-yellow-300 via-green-300 via-blue-300 to-purple-400 opacity-40 blur-[1px] rounded-full" />
        
        {/* Main Giant Eagle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center transform scale-150 flex flex-col items-center">
            <span className="text-8xl select-none filter drop-shadow-md">🦅</span>
            <span className="text-xs font-black text-indigo-950 bg-white/75 px-2 py-0.5 rounded-full border border-indigo-200 -mt-2">
              KARTAL KAAN
            </span>
          </div>
        </div>

        {/* Forest base */}
        <div className="absolute bottom-0 left-0 right-0 h-12 flex justify-around items-end bg-gradient-to-t from-emerald-400/50 to-transparent">
          <span className="text-2xl">🌲</span>
          <span className="text-xl">🌲</span>
          <span className="text-2xl">🏡</span>
          <span className="text-xl">🌲</span>
          <span className="text-2xl">🌲</span>
        </div>
      </div>
    )
  },
  {
    id: 'dino',
    nameTr: 'Dinozor Dünyası',
    nameEn: 'Dino Island',
    emoji: '🦖',
    bgGradient: 'from-emerald-300 via-green-100 to-yellow-200',
    renderScene: () => (
      <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-4">
        {/* Volcano */}
        <div className="absolute top-6 left-12 text-center">
          <span className="text-4xl block animate-pulse">🌋</span>
          <span className="text-xs font-bold text-red-700">LAV</span>
        </div>
        {/* Sun */}
        <div className="absolute top-4 right-10 text-4xl">☀️</div>
        
        {/* Main Dinosaurs */}
        <div className="absolute inset-0 flex items-center justify-center gap-6">
          <span className="text-7xl select-none filter drop-shadow animate-bounce">🦖</span>
          <span className="text-6xl select-none filter drop-shadow animate-pulse delay-500">🦕</span>
        </div>

        {/* Palms and grass */}
        <div className="absolute bottom-0 left-0 right-0 h-10 flex justify-between items-end">
          <span className="text-3xl">🌴</span>
          <span className="text-2xl">🌿</span>
          <span className="text-3xl">🌴</span>
        </div>
      </div>
    )
  },
  {
    id: 'sea',
    nameTr: 'Mutlu Deniz',
    nameEn: 'Happy Ocean',
    emoji: '🐠',
    bgGradient: 'from-blue-400 via-cyan-200 to-teal-400',
    renderScene: () => (
      <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-4">
        {/* Ocean bubbles */}
        <div className="absolute top-8 left-1/4 text-xl opacity-60 animate-bounce">🫧</div>
        <div className="absolute top-16 right-1/4 text-2xl opacity-80">🫧</div>
        
        {/* Aquatic Friends */}
        <div className="absolute inset-0 flex items-center justify-center gap-4">
          <span className="text-6xl select-none filter drop-shadow animate-bounce">🦈</span>
          <span className="text-5xl select-none filter drop-shadow">🐠</span>
          <span className="text-5xl select-none filter drop-shadow animate-pulse">🐙</span>
        </div>

        {/* Sea floor */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-yellow-100/80 flex justify-around items-end">
          <span className="text-xl">🐚</span>
          <span className="text-2xl">🌱</span>
          <span className="text-xl">🐚</span>
          <span className="text-2xl">🌱</span>
        </div>
      </div>
    )
  },
  {
    id: 'farm',
    nameTr: 'Sevimli Çiftlik',
    nameEn: 'Sweet Farm',
    emoji: '🐮',
    bgGradient: 'from-amber-200 via-orange-100 to-green-200',
    renderScene: () => (
      <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-4">
        {/* Windmill/Barn */}
        <div className="absolute top-6 right-8 text-4xl">🏡</div>
        <div className="absolute top-4 left-6 text-4xl">🌻</div>
        
        {/* Animals */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 mt-4">
          <span className="text-6xl select-none filter drop-shadow animate-pulse">🐮</span>
          <span className="text-5xl select-none filter drop-shadow animate-bounce">🐷</span>
          <span className="text-4xl select-none filter drop-shadow">🐔</span>
        </div>

        {/* Tractor and fences */}
        <div className="absolute bottom-0 left-0 right-0 h-10 flex justify-between items-end">
          <span className="text-2xl">🚜</span>
          <span className="text-xl">🪵</span>
          <span className="text-2xl">🌳</span>
        </div>
      </div>
    )
  }
];

export default function PuzzleSection({ lang, onEarnXp }: PuzzleSectionProps) {
  const [gridSize, setGridSize] = useState<2 | 3>(3); // 2x2 or 3x3 difficulty
  const [activeThemeIndex, setActiveThemeIndex] = useState<number>(0);
  
  // Slicing states
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [victoryCelebration, setVictoryCelebration] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(true);

  const activeTheme = PUZZLE_THEMES[activeThemeIndex];
  const numPieces = gridSize * gridSize;

  // Initialize and shuffle puzzle pieces
  const handleStartPuzzle = (sizeChanged = false) => {
    const size = sizeChanged ? (gridSize === 2 ? 3 : 2) : gridSize;
    const count = size * size;

    // Create sorted list of indices [0, 1, ..., count-1]
    const sorted = Array.from({ length: count }, (_, i) => i);
    let shuffled = [...sorted];

    // Keep shuffling until it's genuinely mixed up and not in correct order
    let isIdentical = true;
    while (isIdentical) {
      shuffled = [...sorted].sort(() => Math.random() - 0.5);
      isIdentical = shuffled.every((val, index) => val === index);
    }

    setShuffledIndices(shuffled);
    setSelectedPieceIndex(null);
    setMovesCount(0);
    setGameStarted(true);
    setIsCompleted(false);
    setVictoryCelebration(false);

    speak(
      lang === 'tr'
        ? 'Parçalar dağıtıldı! Hadi doğru yerlerine yerleştirelim.'
        : 'Pieces shuffled! Let\'s match them back to their correct positions.',
      lang
    );
  };

  // Reset/Restart automatically when grid size or theme changes
  useEffect(() => {
    handleStartPuzzle();
  }, [gridSize, activeThemeIndex]);

  const handleTileClick = (clickedIndex: number) => {
    if (isCompleted) return;

    if (selectedPieceIndex === null) {
      // Select first tile
      setSelectedPieceIndex(clickedIndex);
      // Play brief swap sound or feedback
      speak(lang === 'tr' ? 'Seçildi' : 'Selected', lang);
    } else {
      // Swap tiles
      const firstIndex = selectedPieceIndex;
      const secondIndex = clickedIndex;

      if (firstIndex === secondIndex) {
        // Deselect if clicked same item
        setSelectedPieceIndex(null);
        return;
      }

      // Perform swap
      setShuffledIndices(prev => {
        const next = [...prev];
        const temp = next[firstIndex];
        next[firstIndex] = next[secondIndex];
        next[secondIndex] = temp;

        // Check if correct arrangement is solved
        const solved = next.every((val, idx) => val === idx);
        if (solved) {
          handleSolved();
        }

        return next;
      });

      setSelectedPieceIndex(null);
      setMovesCount(prev => prev + 1);
    }
  };

  const handleSolved = () => {
    setIsCompleted(true);
    setVictoryCelebration(true);
    
    speak(
      lang === 'tr'
        ? 'Harika! Yapboz tamamlandı! Sen gerçek bir dâhisin!'
        : 'Superb! Puzzle is solved! You are a real genius!',
      lang
    );

    // Award major XP!
    const xpReward = gridSize === 2 ? 50 : 100;
    onEarnXp(xpReward);

    setTimeout(() => {
      setVictoryCelebration(false);
    }, 6000);
  };

  // Helper to calculate row/col from standard index
  const getPosition = (index: number, size: number) => {
    return {
      row: Math.floor(index / size),
      col: index % size
    };
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-indigo-300 p-6 md:p-8 shadow-xl relative overflow-hidden">
      {/* Decorative background vectors */}
      <div className="absolute top-2 right-4 text-4xl opacity-30 select-none pointer-events-none animate-bounce duration-3000">🧩</div>
      <div className="absolute bottom-4 left-4 text-4xl opacity-20 select-none pointer-events-none animate-pulse">✨</div>

      {/* Victory Congratulation Overlay */}
      <AnimatePresence>
        {victoryCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-indigo-950/20 backdrop-blur-sm flex items-center justify-center pointer-events-none"
          >
            <div className="text-center bg-white border-4 border-yellow-300 p-8 rounded-3xl shadow-2xl animate-bounce">
              <span className="text-6xl block mb-2">🎉🧩🏆</span>
              <h2 className="text-2xl font-black text-indigo-950 uppercase">
                {lang === 'tr' ? 'TEBRİKLER! TAMAMLANDI' : 'CONGRATULATIONS! SOLVED'}
              </h2>
              <p className="text-sm font-bold text-indigo-700 mt-2">
                {lang === 'tr' ? `Yapbozu ${movesCount} hamlede tamamladın!` : `Completed in ${movesCount} swaps!`}
              </p>
              <div className="bg-amber-100 text-amber-950 font-black px-4 py-2 rounded-full border border-amber-300 shadow-sm mt-4 text-sm flex items-center gap-1.5 justify-center">
                <span>⭐</span>
                <span>{lang === 'tr' ? `+${gridSize === 2 ? 50 : 100} XP Kazandın!` : `+${gridSize === 2 ? 50 : 100} XP Awarded!`}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 flex items-center gap-2">
            <Puzzle className="text-indigo-500 stroke-[2.5px] animate-pulse" size={28} />
            <span>{lang === 'tr' ? 'Eğlenceli Yapboz Aktivitesi' : 'Kids Puzzle Adventure'}</span>
          </h2>
          <p className="text-xs sm:text-sm font-bold text-gray-500 mt-1">
            {lang === 'tr' 
              ? 'Karışık parçalara dokunarak yerlerini değiştir ve sevimli resimleri birleştir!'
              : 'Tap on shuffled puzzle tiles to swap their positions and complete the cute pictures!'}
          </p>
        </div>

        {/* Difficulty Selector Controls */}
        <div className="flex bg-gray-100 p-1 rounded-2xl border-2 border-gray-200 shadow-inner">
          <button
            onClick={() => {
              setGridSize(2);
              speak(lang === 'tr' ? 'Kolay seviye, ikiye iki seçildi' : 'Easy 2x2 level selected', lang);
            }}
            className={`px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              gridSize === 2
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>🎈</span>
            <span>{lang === 'tr' ? '2x2 (Çok Kolay)' : '2x2 (Toddler)'}</span>
          </button>
          <button
            onClick={() => {
              setGridSize(3);
              speak(lang === 'tr' ? 'Zor seviye, üçe üç seçildi' : 'Advanced 3x3 level selected', lang);
            }}
            className={`px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              gridSize === 3
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Flame size={12} className="text-yellow-400 fill-yellow-400" />
            <span>{lang === 'tr' ? '3x3 (Eğlenceli)' : '3x3 (Fun Jigsaw)'}</span>
          </button>
        </div>
      </div>

      {/* Theme Picker bar */}
      <div className="bg-indigo-50 rounded-2xl border-2 border-indigo-100 p-3.5 mb-6">
        <h3 className="text-xs font-black text-indigo-950 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
          <span>📚</span>
          <span>{lang === 'tr' ? 'Yapboz Resmini Seç' : 'Choose a Jigsaw Scene'}</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PUZZLE_THEMES.map((theme, idx) => {
            const isSelected = activeThemeIndex === idx;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  setActiveThemeIndex(idx);
                  speak(lang === 'tr' ? theme.nameTr : theme.nameEn, lang);
                }}
                className={`p-2.5 rounded-xl border-2 transition-all active:scale-95 flex items-center justify-center gap-2 font-black text-xs sm:text-sm cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-white ring-4 ring-indigo-200 scale-105 shadow-sm text-indigo-950'
                    : 'border-indigo-200/50 bg-indigo-100/50 text-indigo-800 hover:bg-indigo-100'
                }`}
              >
                <span className="text-2xl">{theme.emoji}</span>
                <span>{lang === 'tr' ? theme.nameTr : theme.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Game Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Shuffled Jigsaw Play Board (7 columns) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          {/* Main Shuffled Puzzle Grid Box */}
          <div className="bg-amber-50 rounded-3xl border-4 border-amber-200 p-5 shadow-inner relative max-w-full">
            <div 
              className={`grid gap-1.5 bg-gray-200/50 p-2.5 rounded-2xl`}
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                width: '320px',
                height: '320px',
                maxWidth: '100%'
              }}
            >
              {shuffledIndices.map((originalIndex, currentIndex) => {
                // Calculate position offsets for sliced puzzle pieces
                const origPos = getPosition(originalIndex, gridSize);
                const tileWidth = 300 / gridSize;
                
                // Determine if this tile is currently selected by the kid
                const isSelected = selectedPieceIndex === currentIndex;
                const isTileSolved = originalIndex === currentIndex;

                return (
                  <button
                    key={currentIndex}
                    onClick={() => handleTileClick(currentIndex)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'border-yellow-400 ring-4 ring-yellow-300 scale-102 z-10 shadow-lg'
                        : isTileSolved && isCompleted
                        ? 'border-emerald-400/80'
                        : 'border-white hover:border-indigo-200 shadow-sm'
                    }`}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    {/* CSS offset slice render */}
                    <div 
                      className={`absolute bg-gradient-to-br ${activeTheme.bgGradient}`}
                      style={{
                        width: '300px',
                        height: '300px',
                        left: `-${origPos.col * tileWidth}px`,
                        top: `-${origPos.row * tileWidth}px`,
                        pointerEvents: 'none',
                        transform: 'scale(1)',
                        transformOrigin: 'top left'
                      }}
                    >
                      {activeTheme.renderScene()}
                    </div>

                    {/* Fun solved lock indicator icon */}
                    {isTileSolved && !isCompleted && (
                      <span className="absolute bottom-1 right-1 bg-emerald-500/80 text-white rounded-full text-[8px] w-4 h-4 flex items-center justify-center font-bold shadow-sm">
                        ✓
                      </span>
                    )}

                    {/* Helper index number inside piece if the user needs guidance */}
                    {showGuide && !isCompleted && (
                      <span className="absolute top-1 left-1 bg-white/75 border border-indigo-200 text-[9px] font-black text-indigo-900 rounded px-1 min-w-[14px] text-center shadow-sm">
                        {originalIndex + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick stats overlays */}
            <div className="flex justify-between items-center mt-4 px-1.5">
              <span className="text-xs font-black text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                🔄 {lang === 'tr' ? `${movesCount} Hamle` : `${movesCount} Swaps`}
              </span>

              <button
                onClick={() => setShowGuide(!showGuide)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-black flex items-center gap-1 border transition-all ${
                  showGuide
                    ? 'bg-indigo-100 text-indigo-950 border-indigo-300'
                    : 'bg-white hover:bg-gray-50 text-gray-500 border-gray-200'
                }`}
              >
                <Eye size={12} />
                <span>{lang === 'tr' ? 'Sayıları Gizle/Göster' : 'Guide Numbers'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Completed Reference & Control panel (5 columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5 h-full">
          
          {/* Reference Image Section */}
          <div className="bg-indigo-50/50 rounded-3xl border-2 border-indigo-100 p-5 shadow-sm text-center">
            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-3 flex items-center justify-center gap-1">
              <span>🎯</span>
              <span>{lang === 'tr' ? 'Hedef Resim Kartı' : 'Reference Target Card'}</span>
            </h4>
            
            {/* Miniature Target preview frame */}
            <div className="flex justify-center mb-3">
              <div 
                className={`w-[160px] h-[160px] rounded-2xl border-4 border-white shadow-md relative overflow-hidden bg-gradient-to-br ${activeTheme.bgGradient}`}
              >
                {activeTheme.renderScene()}
              </div>
            </div>

            <p className="text-[11px] font-extrabold text-indigo-800 leading-normal">
              {lang === 'tr' 
                ? `Hedefimiz: ${activeTheme.nameTr} resmini doğru parçaları değiştirerek eşleştirmek!`
                : `Target: Recreate the ${activeTheme.nameEn} drawing card by matching all pieces!`}
            </p>
          </div>

          {/* Interactive controls bar */}
          <div className="bg-white rounded-3xl border-2 border-indigo-100 p-5 flex flex-col gap-3 shadow-sm">
            
            {isCompleted ? (
              /* Success replay block */
              <div className="text-center p-1.5 animate-pulse">
                <div className="text-emerald-600 font-black text-sm uppercase flex items-center justify-center gap-1.5 mb-3">
                  <span>🌟</span>
                  <span>{lang === 'tr' ? 'HARİKA BAŞARI!' : 'GREAT MATCH!'}</span>
                </div>
                <button
                  onClick={() => handleStartPuzzle()}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-black rounded-2xl border-b-6 border-indigo-700 active:translate-y-1 active:border-b-2 shadow-md transition-all text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw size={14} className="stroke-[2.5px]" />
                  <span>{lang === 'tr' ? 'YENİDEN KARIŞTIR & OYNA' : 'SHUFFLE & PLAY AGAIN'}</span>
                </button>
              </div>
            ) : (
              /* Standard play controls */
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-900 font-extrabold leading-normal">
                  <AlertCircle size={16} className="text-amber-500 shrink-0" />
                  <span>
                    {lang === 'tr' 
                      ? 'Nasıl Oynanır: İki yapboz parçasına sırayla dokunarak yerlerini değiştir!'
                      : 'How to Play: Select a tile, then tap another to swap their positions!'}
                  </span>
                </div>

                <button
                  onClick={() => handleStartPuzzle()}
                  className="w-full py-3.5 bg-white hover:bg-gray-100 text-indigo-900 font-black rounded-2xl border-2 border-indigo-200 active:translate-y-0.5 shadow-sm transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw size={14} className="stroke-[2.5px]" />
                  <span>{lang === 'tr' ? 'Yapbozu Yeniden Dağıt' : 'Reshuffle Pieces'}</span>
                </button>
              </div>
            )}

            <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-[11px] font-black text-gray-400">
              <span>{lang === 'tr' ? '🏆 TAMAMLAMA SKORU:' : '🏆 COMPLETION SCORE:'}</span>
              <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-mono">
                +{gridSize === 2 ? 50 : 100} XP
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
