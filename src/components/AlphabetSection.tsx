import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Edit3, Award, RefreshCw, Star } from 'lucide-react';
import { TURKISH_ALPHABET, ENGLISH_ALPHABET } from '../data';
import { LetterItem, Language } from '../types';
import { speak } from '../utils/speak';

interface AlphabetSectionProps {
  lang: Language;
  onSelectLetterForDrawing: (letter: LetterItem) => void;
  onEarnXp?: (amt: number) => void;
}

export default function AlphabetSection({ lang, onSelectLetterForDrawing, onEarnXp }: AlphabetSectionProps) {
  const [selectedLetter, setSelectedLetter] = useState<LetterItem | null>(null);
  
  // Use the correct alphabet based on selected language
  const alphabet = lang === 'tr' ? TURKISH_ALPHABET : ENGLISH_ALPHABET;

  const handleLetterTap = (item: LetterItem) => {
    setSelectedLetter(item);
    onEarnXp?.(30); // Award 30 XP!
    
    // Pronounce the letter and the word
    const isTurkish = lang === 'tr';
    const textToSpeak = isTurkish
      ? `${item.letter} harfi. ${item.word.tr}.`
      : `${item.letter}. for ${item.word.en}.`;
      
    speak(textToSpeak, lang);
  };

  const handleWordSpeak = (item: LetterItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const wordText = lang === 'tr' ? item.word.tr : item.word.en;
    speak(wordText, lang);
    onEarnXp?.(15); // Award extra XP for listening
  };

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* Intro Instruction - Styled with Pink theme */}
      <div className="bg-pink-100 border-2 border-pink-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
        <div className="text-3xl animate-bounce">🦖</div>
        <div>
          <h2 className="text-lg font-black text-pink-900">
            {lang === 'tr' ? 'Hadi Alfabeyi Öğrenelim!' : 'Let\'s Learn the Alphabet!'}
          </h2>
          <p className="text-xs sm:text-sm text-pink-700 font-bold">
            {lang === 'tr' 
              ? 'Bir harfe dokunarak sesini duy, resmi gör ve ardından çizmeyi öğren!' 
              : 'Tap a letter to hear its sound, see its word, then learn to draw it!'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Letters Grid */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border-2 border-pink-200 shadow-sm">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {alphabet.map((item) => {
              const isSelected = selectedLetter?.letter === item.letter;
              return (
                <button
                  id={`btn-letter-card-${item.letter}`}
                  key={item.letter}
                  onClick={() => handleLetterTap(item)}
                  className={`aspect-square flex flex-col items-center justify-center p-2 rounded-2xl transition-all relative transform active:scale-95 ${
                    isSelected
                      ? 'bg-pink-400 border-b-8 border-pink-600 text-white scale-105 shadow-md font-black'
                      : 'bg-pink-50 hover:bg-[#FFEDF2] border-b-8 border-pink-200 border-2 text-pink-800'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl font-extrabold select-none tracking-tight">
                    {item.letter}
                  </span>
                  <span className="text-sm mt-0.5 opacity-90 select-none">
                    {item.emoji}
                  </span>
                  
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 text-xs animate-spin duration-300">
                      ⭐
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Letter Detail Panel */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <AnimatePresence mode="wait">
            {selectedLetter ? (
              <motion.div
                key={selectedLetter.letter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl border-4 border-pink-300 p-6 text-center shadow-md flex flex-col justify-between items-center h-full relative overflow-hidden min-h-[360px]"
              >
                {/* Visual sparkles overlay */}
                <div className="absolute top-2 left-2 text-xl animate-pulse">✨</div>
                <div className="absolute top-2 right-2 text-xl animate-pulse delay-100">✨</div>

                <div className="w-full">
                  {/* Huge Letter Display */}
                  <div className="relative inline-block mb-3">
                    <span className="text-8xl sm:text-9xl font-black text-pink-500 drop-shadow-sm select-none">
                      {selectedLetter.letter}
                    </span>
                    <span className="absolute -bottom-1 -right-4 text-4xl sm:text-5xl animate-bounce">
                      {selectedLetter.emoji}
                    </span>
                  </div>

                  {/* Words translation */}
                  <div className="my-4 p-4 bg-pink-50 rounded-2xl border-2 border-pink-100">
                    <div className="text-xs font-black text-pink-500 uppercase tracking-widest mb-1">
                      {lang === 'tr' ? 'KELİME ÖRNEĞİ' : 'EXAMPLE WORD'}
                    </div>
                    
                    <div className="text-2xl sm:text-3xl font-black text-pink-900 flex items-center justify-center gap-2">
                      <span>{lang === 'tr' ? selectedLetter.word.tr : selectedLetter.word.en}</span>
                      <button
                        id="btn-speak-selected-word"
                        onClick={(e) => handleWordSpeak(selectedLetter, e)}
                        className="p-1.5 bg-pink-100 text-pink-700 hover:text-pink-900 hover:scale-110 active:scale-95 rounded-full transition-all"
                        title={lang === 'tr' ? 'Seslendir' : 'Speak'}
                      >
                        <Volume2 size={18} className="stroke-[3px]" />
                      </button>
                    </div>

                    {/* Secondary translation */}
                    <div className="text-sm font-bold text-pink-600 mt-1">
                      {lang === 'tr' ? `English: ${selectedLetter.word.en}` : `Türkçe: ${selectedLetter.word.tr}`}
                    </div>
                  </div>
                </div>

                {/* Primary Action: Go to Trace Writing Board */}
                <button
                  id="btn-start-writing-practice"
                  onClick={() => onSelectLetterForDrawing(selectedLetter)}
                  className="w-full py-4 px-6 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-extrabold rounded-full border-b-8 border-pink-700 shadow-lg flex items-center justify-center gap-2.5 text-base sm:text-lg transition-all cursor-pointer"
                >
                  <Edit3 size={20} className="stroke-[3px]" />
                  <span>{lang === 'tr' ? 'Yazmayı Öğren! ➔' : 'Learn to Write! ➔'}</span>
                </button>
              </motion.div>
            ) : (
              <div className="bg-pink-50/50 rounded-3xl border-2 border-dashed border-pink-300/60 p-8 flex-1 flex flex-col items-center justify-center text-center text-pink-600 min-h-[300px]">
                <div className="text-6xl mb-4 animate-pulse">🧸</div>
                <h3 className="text-lg font-bold text-pink-950 mb-1">
                  {lang === 'tr' ? 'Harf Seç' : 'Pick a Letter'}
                </h3>
                <p className="text-sm max-w-[240px]">
                  {lang === 'tr' 
                    ? 'Yukarıdan bir harfe dokunarak eğlenceyi başlat!' 
                    : 'Tap any letter above to start the fun!'}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
