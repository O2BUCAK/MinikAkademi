import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RefreshCw, Star, Sparkles } from 'lucide-react';
import { NUMBERS } from '../data';
import { NumberItem, Language } from '../types';
import { speak } from '../utils/speak';

interface NumbersSectionProps {
  lang: Language;
  onEarnXp?: (amt: number) => void;
}

export default function NumbersSection({ lang, onEarnXp }: NumbersSectionProps) {
  const [selectedNum, setSelectedNum] = useState<NumberItem | null>(null);
  
  // Track which indices of the items have been tapped/counted so far
  const [countedIndices, setCountedIndices] = useState<Record<number, boolean>>({});
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    // Select 1 by default to show how the board works immediately
    if (NUMBERS.length > 0 && !selectedNum) {
      setSelectedNum(NUMBERS[0]);
    }
  }, [selectedNum]);

  // Handle selecting a new number
  const handleNumberSelect = (item: NumberItem) => {
    setSelectedNum(item);
    setCountedIndices({});
    setCurrentCount(0);
    onEarnXp?.(30); // Award 30 XP!

    // Speak the chosen number
    const label = lang === 'tr' ? item.word.tr : item.word.en;
    speak(label, lang);
  };

  // Tapping an individual emoji to count it out loud
  const handleItemTap = (idx: number) => {
    if (countedIndices[idx]) return; // already counted

    // Mark as counted
    setCountedIndices((prev) => ({ ...prev, [idx]: true }));
    onEarnXp?.(10); // Award 10 XP per counted bubble!
    
    // Increment local counting step
    const nextCount = currentCount + 1;
    setCurrentCount(nextCount);

    // Get the word for the current number step
    const numberWord = NUMBERS.find((n) => n.value === nextCount);
    const textToSpeak = numberWord 
      ? (lang === 'tr' ? numberWord.word.tr : numberWord.word.en) 
      : `${nextCount}`;

    // Speak the next counting step!
    speak(textToSpeak, lang, 1.0, 1.2);

    // If fully counted, play celebration
    if (selectedNum && nextCount === selectedNum.value) {
      onEarnXp?.(50); // Extra 50 XP bonus!
      setTimeout(() => {
        const cheerText = lang === 'tr' 
          ? `Tebrikler! Tam ${selectedNum.value} adet ${selectedNum.word.tr} saydın!`
          : `Congratulations! You counted exactly ${selectedNum.value} ${selectedNum.word.en}!`;
        speak(cheerText, lang, 0.9, 1.1);
      }, 900);
    }
  };

  const handleResetCount = () => {
    setCountedIndices({});
    setCurrentCount(0);
    if (selectedNum) {
      const label = lang === 'tr' ? `Tekrar sayalım! ${selectedNum.word.tr}` : `Let's count again! ${selectedNum.word.en}`;
      speak(label, lang);
    }
  };

  const handleSpeakMain = () => {
    if (!selectedNum) return;
    const label = lang === 'tr' ? selectedNum.word.tr : selectedNum.word.en;
    speak(label, lang);
    onEarnXp?.(10); // Hear name
  };

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* Intro Header banner - Styled with Blue theme */}
      <div className="bg-blue-100 border-2 border-blue-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
        <div className="text-3xl animate-bounce">🎈</div>
        <div>
          <h2 className="text-lg font-black text-blue-900">
            {lang === 'tr' ? 'Hadi Sayıları Sayalım!' : 'Let\'s Learn Counting!'}
          </h2>
          <p className="text-xs sm:text-sm text-blue-700 font-bold">
            {lang === 'tr' 
              ? 'Bir sayı seç, ardından sağdaki baloncuklara teker teker dokunarak say!' 
              : 'Pick a number, then tap the bubbles on the right one-by-one to count!'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Numbers Selection Grid */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-6 border-2 border-blue-200 shadow-sm">
          <h3 className="text-sm font-black text-blue-900 mb-3 uppercase tracking-wider">
            {lang === 'tr' ? 'Sayı Seçin' : 'Choose a Number'}
          </h3>
          
          <div className="grid grid-cols-4 gap-3">
            {NUMBERS.map((item) => {
              const isSelected = selectedNum?.value === item.value;
              return (
                <button
                  id={`btn-number-card-${item.value}`}
                  key={item.value}
                  onClick={() => handleNumberSelect(item)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all border-b-8 transform active:scale-95 ${
                    isSelected
                      ? 'bg-blue-400 border-blue-600 text-white font-black text-2xl scale-105 shadow-md'
                      : 'bg-blue-50 hover:bg-[#EBF5FF] border-blue-200 border-2 text-blue-800 font-bold text-xl'
                  }`}
                >
                  <span>{item.value}</span>
                  <span className="text-xs opacity-75">{item.emoji}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Counting Game Board */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedNum ? (
              <motion.div
                key={selectedNum.value}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border-4 border-blue-300 p-6 flex flex-col justify-between h-full shadow-md min-h-[360px]"
              >
                {/* Header detail info */}
                <div className="flex justify-between items-center border-b border-blue-100 pb-4 mb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl font-black text-blue-500 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-200">
                      {selectedNum.value}
                    </span>
                    <div>
                      <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                        {lang === 'tr' ? 'SAYI' : 'NUMBER'}
                      </div>
                      <div className="text-2xl font-black text-blue-900 flex items-center gap-1.5">
                        <span>{lang === 'tr' ? selectedNum.word.tr : selectedNum.word.en}</span>
                        <button
                          id="btn-speak-number-word"
                          onClick={handleSpeakMain}
                          className="p-1 text-blue-500 hover:text-blue-700 hover:scale-110 active:scale-95 transition-all"
                        >
                          <Volume2 size={16} className="stroke-[3px]" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reset/Recount button */}
                  <button
                    id="btn-recount-numbers"
                    onClick={handleResetCount}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 active:scale-95 rounded-full text-xs font-bold text-gray-700 transition-all border border-gray-200 cursor-pointer"
                  >
                    <RefreshCw size={14} className="stroke-[3px]" />
                    <span>{lang === 'tr' ? 'Tekrar Say' : 'Recount'}</span>
                  </button>
                </div>

                {/* Main Interactive Items Board */}
                <div className="flex-1 bg-gradient-to-b from-blue-50/50 to-amber-50/10 rounded-2xl p-4 border-2 border-blue-100/70 min-h-[220px] flex flex-col justify-between">
                  <div className="text-center mb-3">
                    <span className="text-xs font-black text-blue-600 bg-blue-100/50 px-4 py-1.5 rounded-full border border-blue-200">
                      {lang === 'tr' 
                        ? `Balonlara sırasıyla dokun: ${currentCount} / ${selectedNum.value}` 
                        : `Tap bubbles in order: ${currentCount} / ${selectedNum.value}`}
                    </span>
                  </div>

                  {/* Emojis Grid for child interaction */}
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-3 justify-items-center items-center py-4 flex-1">
                    {Array.from({ length: selectedNum.value }).map((_, index) => {
                      const isCounted = countedIndices[index];
                      const isNext = index === currentCount;
                      
                      return (
                        <button
                          id={`btn-count-item-${index}`}
                          key={index}
                          disabled={isCounted}
                          onClick={() => handleItemTap(index)}
                          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl relative shadow-sm transition-all transform active:scale-75 ${
                            isCounted
                              ? 'bg-blue-100 border-blue-400 scale-95 opacity-60'
                              : isNext
                              ? 'bg-amber-100 border-amber-400 scale-115 animate-bounce ring-4 ring-amber-300'
                              : 'bg-white hover:bg-blue-50 border-gray-200 hover:scale-105 cursor-pointer'
                          }`}
                        >
                          <span className="select-none">{selectedNum.emoji}</span>
                          
                          {/* Star overlay when counted */}
                          {isCounted && (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue-500/15 rounded-full">
                              <Star size={18} className="text-amber-500 fill-amber-400 animate-ping" />
                            </div>
                          )}

                          {/* Order counter indicator badge */}
                          <span className="absolute -bottom-1 -right-1 text-[9px] bg-gray-900 text-white font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                            {index + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Fully Counted Celebration banner inside the container */}
                  {currentCount === selectedNum.value && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-500 text-white p-3 rounded-xl border-b-4 border-blue-700 shadow-md text-center font-extrabold text-sm flex items-center justify-center gap-1.5 animate-bounce mt-4"
                    >
                      <Sparkles size={16} />
                      <span>{lang === 'tr' ? 'Tebrikler! Hepsini Saydın! 🥳' : 'Hooray! You counted them all! 🥳'}</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-blue-50/50 rounded-3xl border-2 border-dashed border-blue-300/60 p-8 h-full flex flex-col items-center justify-center text-center text-blue-600 min-h-[300px]">
                <div className="text-6xl mb-4 animate-bounce">🎈</div>
                <h3 className="text-lg font-bold text-blue-950 mb-1">
                  {lang === 'tr' ? 'Bir Sayı Seç' : 'Pick a Number'}
                </h3>
                <p className="text-sm max-w-[240px]">
                  {lang === 'tr' 
                    ? 'Soldan bir sayı seçerek sayma macerasına katıl!' 
                    : 'Select a number from the left to start counting!'}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
