import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, HelpCircle, Gamepad2 } from 'lucide-react';
import { COLORS } from '../data';
import { ColorItem, Language } from '../types';
import { speak } from '../utils/speak';

interface ColorsSectionProps {
  lang: Language;
  onEarnXp?: (amt: number) => void;
}

export default function ColorsSection({ lang, onEarnXp }: ColorsSectionProps) {
  const [selectedColor, setSelectedColor] = useState<ColorItem | null>(COLORS[0]);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [targetColor, setTargetColor] = useState<ColorItem | null>(null);
  const [options, setOptions] = useState<ColorItem[]>([]);
  const [gameFeedback, setGameFeedback] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);

  const handleColorTap = (color: ColorItem) => {
    setSelectedColor(color);
    onEarnXp?.(30); // Award 30 XP!
    
    // Pronounce the color name
    const colorName = lang === 'tr' ? color.name.tr : color.name.en;
    speak(colorName, lang);
  };

  const handleItemTap = (emoji: string, name: string) => {
    // Speak the item name
    speak(name, lang);
    onEarnXp?.(15); // Award 15 XP!
  };

  const startColorGame = () => {
    setGameActive(true);
    pickNewTarget();
  };

  const pickNewTarget = () => {
    const randomTarget = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(randomTarget);
    setIsCorrect(null);
    setGameFeedback('');

    // Pick 3 other random distractors
    const distractors = COLORS.filter(c => c.id !== randomTarget.id);
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random()).slice(0, 3);
    const allOptions = [...shuffledDistractors, randomTarget].sort(() => 0.5 - Math.random());
    setOptions(allOptions);

    const questionText = lang === 'tr'
      ? `Hadi bulalım: Hangisi ${randomTarget.name.tr}?`
      : `Let's find: Which one is ${randomTarget.name.en}?`;
    speak(questionText, lang);
  };

  const handleOptionClick = (color: ColorItem) => {
    if (!targetColor) return;
    if (color.id === targetColor.id) {
      setIsCorrect(true);
      setScore(s => s + 1);
      onEarnXp?.(50); // Earn 50 XP for a correct answer!
      const feedback = lang === 'tr'
        ? `Harika! Doğru bildin, bu ${color.name.tr}! 🎉`
        : `Awesome! You got it right, this is ${color.name.en}! 🎉`;
      setGameFeedback(feedback);
      speak(feedback, lang);
      setTimeout(() => {
        pickNewTarget();
      }, 2500);
    } else {
      setIsCorrect(false);
      const feedback = lang === 'tr'
        ? `Yaklaştın ama bu ${color.name.tr}! Tekrar dene! 🎈`
        : `Close, but this is ${color.name.en}! Try again! 🎈`;
      setGameFeedback(feedback);
      speak(feedback, lang);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* Intro Header banner - Styled with Green theme */}
      <div className="bg-green-100 border-2 border-green-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-bounce">🎈</div>
          <div>
            <h2 className="text-lg font-black text-green-900">
              {lang === 'tr' ? 'Hadi Renkleri Keşfedelim!' : 'Let\'s Explore Colors!'}
            </h2>
            <p className="text-xs sm:text-sm text-green-700 font-bold">
              {lang === 'tr' 
                ? 'Renkli bir balona dokunarak sesini duy, ardından o renkteki oyuncakları incele!' 
                : 'Tap a colorful balloon to hear its sound, then examine toys of that color!'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!gameActive ? (
            <button
              onClick={startColorGame}
              className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-black text-xs sm:text-sm rounded-full border-b-4 border-green-700 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Gamepad2 size={16} />
              <span>{lang === 'tr' ? 'Renk Bulma Oyunu' : 'Color Puzzle Game'}</span>
            </button>
          ) : (
            <button
              onClick={() => setGameActive(false)}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs sm:text-sm rounded-full border-b-4 border-red-700 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>🚪</span>
              <span>{lang === 'tr' ? 'Keşfe Geri Dön' : 'Back to Explorer'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Colors Selector (Balloons Grid) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-6 border-2 border-green-200 shadow-sm flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="text-sm font-black text-green-950 mb-4 uppercase tracking-wider">
              {lang === 'tr' ? 'Bir Balon Seç' : 'Pick a Balloon'}
            </h3>
            
            {/* Balloons Grid */}
            <div className="grid grid-cols-5 gap-3">
              {COLORS.map((color) => {
                const isSelected = selectedColor?.id === color.id && !gameActive;
                
                return (
                  <button
                    id={`btn-color-balloon-${color.id}`}
                    key={color.id}
                    onClick={() => {
                      setGameActive(false);
                      handleColorTap(color);
                    }}
                    className="flex flex-col items-center group cursor-pointer focus:outline-none"
                  >
                    {/* Floating Balloon Shape */}
                    <div
                      className={`w-12 h-14 rounded-t-full rounded-b-[45%] shadow-md transition-all relative transform ${
                        isSelected 
                          ? 'scale-115 border-2 border-green-800 ring-4 ring-green-300 -translate-y-2' 
                          : 'hover:-translate-y-1'
                      }`}
                      style={{ 
                        backgroundColor: color.hex,
                        boxShadow: isSelected 
                          ? `0 10px 15px -3px ${color.hex}80` 
                          : `0 4px 6px -1px ${color.hex}40`
                      }}
                    >
                      {/* Highlight reflection on balloon */}
                      <div className="absolute top-1.5 left-2 w-2.5 h-4 bg-white/40 rounded-full rotate-12" />
                      
                      {/* Little triangle knot at balloon base */}
                      <div 
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                        style={{ backgroundColor: color.hex }}
                      />
                    </div>

                    {/* Balloon String */}
                    <div className="w-0.5 h-5 bg-gray-300 mt-1 transform group-hover:skew-x-6 transition-transform" />

                    {/* Label */}
                    <span className="text-[10px] font-extrabold text-gray-700 mt-1 uppercase select-none tracking-tight">
                      {lang === 'tr' ? color.name.tr : color.name.en}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 bg-green-50 p-3.5 rounded-2xl border border-green-100 text-center">
            <span className="text-2xl">🎨</span>
            <p className="text-xs font-bold text-green-800 mt-1.5">
              {lang === 'tr' 
                ? 'Renkler dünyayı çok daha güzel ve neşeli hale verir!' 
                : 'Colors make our world beautiful and full of joy!'}
            </p>
          </div>
        </div>

        {/* Selected Color details with items card or Game viewport */}
        <div className="lg:col-span-7">
          <div className="flex bg-white p-1 rounded-2xl border-2 border-green-100 mb-4 gap-2">
            <button
              onClick={() => setGameActive(false)}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                !gameActive
                  ? 'bg-green-500 text-white shadow-sm border-b-4 border-green-700'
                  : 'text-green-700 hover:bg-green-50/50'
              }`}
            >
              <span>🎨</span>
              <span>{lang === 'tr' ? 'Renkleri Keşfet' : 'Explore Colors'}</span>
            </button>
            <button
              onClick={startColorGame}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                gameActive
                  ? 'bg-green-500 text-white shadow-sm border-b-4 border-green-700'
                  : 'text-green-700 hover:bg-green-50/50'
              }`}
            >
              <span>🎮</span>
              <span>{lang === 'tr' ? 'Renk Bulma Oyunu' : 'Color Puzzle Game'}</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!gameActive ? (
              selectedColor ? (
                <motion.div
                  key={selectedColor.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white rounded-3xl border-4 border-green-300 p-6 flex flex-col h-full shadow-md justify-between min-h-[360px]"
                >
                  {/* Header detail */}
                  <div className="flex justify-between items-center border-b border-green-100 pb-4 mb-5 gap-2">
                    <div className="flex items-center gap-3">
                      {/* Miniature floating big balloon */}
                      <div 
                        className="w-14 h-16 rounded-t-full rounded-b-[45%] relative shadow-md animate-bounce flex-shrink-0"
                        style={{ backgroundColor: selectedColor.hex }}
                      >
                        <div className="absolute top-2 left-2.5 w-3.5 h-5 bg-white/40 rounded-full rotate-12" />
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45" style={{ backgroundColor: selectedColor.hex }} />
                      </div>

                      <div>
                        <div className="text-[10px] font-black text-green-500 uppercase tracking-widest">
                          {lang === 'tr' ? 'AKTİF RENK' : 'ACTIVE COLOR'}
                        </div>
                        <div className="text-2xl font-black text-green-900 flex items-center gap-2">
                          <span>{lang === 'tr' ? selectedColor.name.tr : selectedColor.name.en}</span>
                          <button
                            id="btn-speak-color-word"
                            onClick={() => handleColorTap(selectedColor)}
                            className="p-1 text-green-500 hover:text-green-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                          >
                            <Volume2 size={18} className="stroke-[3px]" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-black text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                      {lang === 'tr' ? `Renk Kodu: ${selectedColor.hex}` : `Color Code: ${selectedColor.hex}`}
                    </span>
                  </div>

                  {/* Things that are of this color */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="text-left mb-3">
                      <h4 className="text-xs font-black text-green-600 uppercase tracking-wider">
                        {lang === 'tr' ? 'Neler Bu Renktedir?' : 'Things of this Color:'}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-bold">
                        {lang === 'tr' 
                          ? 'Resimlere dokunarak isimlerini Türkçe ve İngilizce duy!' 
                          : 'Tap the cards to hear their names and learn words!'}
                      </p>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 py-2 items-stretch">
                      {selectedColor.emojis.map((emoji, index) => {
                        const itemTr = selectedColor.items.tr[index];
                        const itemEn = selectedColor.items.en[index];
                        const activeItemName = lang === 'tr' ? itemTr : itemEn;

                        return (
                          <button
                            id={`btn-color-item-${index}`}
                            key={emoji}
                            onClick={() => handleItemTap(emoji, activeItemName)}
                            className="bg-green-50/40 hover:bg-green-50 border-2 border-green-100 rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all transform hover:scale-105 active:scale-95 hover:border-green-300 hover:shadow-sm gap-2 focus:outline-none cursor-pointer"
                          >
                            <span className="text-4xl select-none animate-pulse">{emoji}</span>
                            
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-green-950 truncate max-w-full">
                                {activeItemName}
                              </span>
                              <span className="text-[10px] font-bold text-green-600 mt-0.5 opacity-80 truncate max-w-full">
                                {lang === 'tr' ? itemEn : itemTr}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Cute feedback label */}
                    <div className="bg-gradient-to-r from-green-50 to-amber-50 p-3 rounded-2xl border border-green-100/70 mt-4 flex items-center gap-2 justify-center">
                      <Sparkles size={16} className="text-amber-500 animate-spin" />
                      <span className="text-xs font-black text-green-900">
                        {lang === 'tr' 
                          ? `Bu çok güzel bir ${selectedColor.name.tr}!` 
                          : `This is a beautiful ${selectedColor.name.en}!`}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-green-50/50 rounded-3xl border-2 border-dashed border-green-300/60 p-8 h-full flex flex-col items-center justify-center text-center text-green-600 min-h-[300px]">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-lg font-bold text-green-950 mb-1">
                    {lang === 'tr' ? 'Renk Seç' : 'Pick a Color'}
                  </h3>
                  <p className="text-sm max-w-[240px]">
                    {lang === 'tr' 
                      ? 'Soldan bir renk balonuna dokunarak eğlenceli eşyaları gör!' 
                      : 'Tap a color balloon on the left to see its toys!'}
                  </p>
                </div>
              )
            ) : (
              <motion.div
                key="game-mode"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border-4 border-green-300 p-6 flex flex-col h-full shadow-md justify-between min-h-[380px]"
              >
                <div className="text-center py-4 flex flex-col items-center justify-center h-full flex-1">
                  <span className="text-5xl animate-bounce mb-3">🔍</span>
                  <h3 className="text-xl sm:text-2xl font-black text-green-950">
                    {lang === 'tr' ? 'Hangi renk balon şudur?' : 'Which color balloon is:'}
                  </h3>
                  <div className="mt-2.5 px-6 py-2.5 bg-green-50 border-2 border-green-200 rounded-full font-black text-lg text-green-950 shadow-sm inline-flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: targetColor?.hex }} />
                    <span>{lang === 'tr' ? targetColor?.name.tr : targetColor?.name.en}</span>
                  </div>

                  {/* Options Balloons */}
                  <div className="grid grid-cols-4 gap-4 mt-8 w-full max-w-md">
                    {options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionClick(option)}
                        className="flex flex-col items-center group cursor-pointer focus:outline-none"
                      >
                        <div
                          className="w-12 h-14 rounded-t-full rounded-b-[45%] shadow-md transition-all relative transform hover:-translate-y-2 hover:scale-110 active:scale-95"
                          style={{
                            backgroundColor: option.hex,
                            boxShadow: `0 8px 12px -2px ${option.hex}50`,
                          }}
                        >
                          <div className="absolute top-1.5 left-2 w-2.5 h-4 bg-white/40 rounded-full rotate-12" />
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" style={{ backgroundColor: option.hex }} />
                        </div>
                        <div className="w-0.5 h-4 bg-gray-300 mt-1" />
                        <span className="text-[10px] font-black text-gray-500 mt-1 uppercase">
                          {lang === 'tr' ? option.name.tr : option.name.en}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Feedback overlay */}
                  <div className="h-12 mt-4 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {gameFeedback && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className={`text-xs sm:text-sm font-black px-4 py-2 rounded-2xl border-2 ${
                            isCorrect
                              ? 'bg-green-50 border-green-200 text-green-700'
                              : 'bg-orange-50 border-orange-200 text-orange-700'
                          }`}
                        >
                          {gameFeedback}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between w-full border-t border-green-100 pt-4 text-xs font-black text-green-600">
                  <span>🏆 {lang === 'tr' ? `Doğru: ${score}` : `Score: ${score}`}</span>
                  <button
                    onClick={pickNewTarget}
                    className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-full border border-green-200 font-bold"
                  >
                    {lang === 'tr' ? 'Değiştir ➔' : 'Skip ➔'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
