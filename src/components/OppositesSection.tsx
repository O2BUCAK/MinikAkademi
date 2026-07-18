import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, HelpCircle, Check, Play, Award } from 'lucide-react';
import { Language } from '../types';
import { speak } from '../utils/speak';

interface OppositeItem {
  id: string;
  name: { tr: string; en: string };
  emoji: string;
  voicePhrase: { tr: string; en: string };
}

interface OppositePair {
  id: string;
  conceptA: OppositeItem;
  conceptB: OppositeItem;
  themeColor: string; // e.g. blue, red, etc
  borderColor: string;
  bgColor: string;
}

const OPPOSITE_PAIRS: OppositePair[] = [
  {
    id: 'big_small',
    conceptA: {
      id: 'big',
      name: { tr: 'Büyük 🐘', en: 'Big 🐘' },
      emoji: '🐘',
      voicePhrase: { tr: 'Büyük! Kocaman bir fil!', en: 'Big! A huge elephant!' }
    },
    conceptB: {
      id: 'small',
      name: { tr: 'Küçük 🐭', en: 'Small 🐭' },
      emoji: '🐭',
      voicePhrase: { tr: 'Küçük! Minik bir farecik!', en: 'Small! A tiny little mouse!' }
    },
    themeColor: 'from-blue-500 to-indigo-500',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'hot_cold',
    conceptA: {
      id: 'hot',
      name: { tr: 'Sıcak ☀️', en: 'Hot ☀️' },
      emoji: '☀️',
      voicePhrase: { tr: 'Sıcak! Parlayan güneş sıcaktır!', en: 'Hot! The shining sun is hot!' }
    },
    conceptB: {
      id: 'cold',
      name: { tr: 'Soğuk ❄️', en: 'Cold ❄️' },
      emoji: '❄️',
      voicePhrase: { tr: 'Soğuk! Kardan adam soğuktur!', en: 'Cold! Snowman is cold!' }
    },
    themeColor: 'from-orange-500 to-sky-500',
    borderColor: 'border-sky-200',
    bgColor: 'bg-sky-50'
  },
  {
    id: 'day_night',
    conceptA: {
      id: 'day',
      name: { tr: 'Gece 🌙', en: 'Night 🌙' },
      emoji: '🌙',
      voicePhrase: { tr: 'Gece! Aydede çıktı ve gökyüzü karanlık oldu!', en: 'Night! The moon is out and the sky is dark!' }
    },
    conceptB: {
      id: 'night',
      name: { tr: 'Gündüz ☀️', en: 'Day ☀️' },
      emoji: '☀️',
      voicePhrase: { tr: 'Gündüz! Güneş parlıyor ve oyun saati geldi!', en: 'Day! The sun is shining and it is playtime!' }
    },
    themeColor: 'from-indigo-950 to-amber-400',
    borderColor: 'border-amber-200',
    bgColor: 'bg-yellow-50'
  },
  {
    id: 'open_closed',
    conceptA: {
      id: 'open',
      name: { tr: 'Açık 🔓', en: 'Open 🔓' },
      emoji: '🔓',
      voicePhrase: { tr: 'Açık! Kilit açık ve kapı ardına kadar açık!', en: 'Open! The lock is open and the door is wide open!' }
    },
    conceptB: {
      id: 'closed',
      name: { tr: 'Kapalı 🔒', en: 'Closed 🔒' },
      emoji: '🔒',
      voicePhrase: { tr: 'Kapalı! Kilit kapandı, içeride güvendeyiz!', en: 'Closed! The lock is closed, we are safe inside!' }
    },
    themeColor: 'from-emerald-500 to-rose-500',
    borderColor: 'border-emerald-200',
    bgColor: 'bg-emerald-50'
  }
];

interface OppositesSectionProps {
  lang: Language;
  onEarnXp?: (amt: number) => void;
}

export default function OppositesSection({ lang, onEarnXp }: OppositesSectionProps) {
  const [selectedPair, setSelectedPair] = useState<OppositePair | null>(OPPOSITE_PAIRS[0]);
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // For quiz, target a random item and ask to find its opposite
  const [targetItem, setTargetItem] = useState<OppositeItem | null>(null);
  const [oppositeTarget, setOppositeTarget] = useState<OppositeItem | null>(null);

  const handleItemTap = (item: OppositeItem) => {
    onEarnXp?.(15);
    const text = lang === 'tr' ? item.voicePhrase.tr : item.voicePhrase.en;
    speak(text, lang);
  };

  const startQuiz = () => {
    setQuizActive(true);
    pickNewQuizTarget();
  };

  const pickNewQuizTarget = () => {
    // Pick a random pair
    const randomPair = OPPOSITE_PAIRS[Math.floor(Math.random() * OPPOSITE_PAIRS.length)];
    // Randomly select conceptA or conceptB as prompt
    const useA = Math.random() > 0.5;
    const promptItem = useA ? randomPair.conceptA : randomPair.conceptB;
    const answerItem = useA ? randomPair.conceptB : randomPair.conceptA;

    setTargetItem(promptItem);
    setOppositeTarget(answerItem);
    setIsCorrect(null);
    setQuizFeedback('');

    const question = lang === 'tr'
      ? `Bana "${promptItem.name.tr}" kavramının zıttını (tersini) gösterebilir misin?`
      : `Can you show me the opposite of "${promptItem.name.en}"?`;
    speak(question, lang);
  };

  const handleQuizAnswer = (item: OppositeItem) => {
    if (!oppositeTarget) return;

    if (item.id === oppositeTarget.id) {
      setIsCorrect(true);
      setScore((s) => s + 1);
      onEarnXp?.(40);

      const feedback = lang === 'tr'
        ? `Harika! Doğru bildin! "${targetItem?.name.tr}" kavramının zıttı "${item.name.tr}"dur! Aferin!`
        : `Brilliant! You got it right! The opposite of "${targetItem?.name.en}" is "${item.name.en}"! Well done!`;
      setQuizFeedback(feedback);
      speak(feedback, lang);

      setTimeout(() => {
        pickNewQuizTarget();
      }, 3500);
    } else {
      setIsCorrect(false);
      const feedback = lang === 'tr'
        ? `Bu tam olarak zıttı değil. "${targetItem?.name.tr}" neresi, zıttı neresi? Tekrar düşün!`
        : `That is not the opposite. Let's try again for "${targetItem?.name.en}"!`;
      setQuizFeedback(feedback);
      speak(feedback, lang);
    }
  };

  const exitQuiz = () => {
    setQuizActive(false);
    setTargetItem(null);
    setOppositeTarget(null);
    setIsCorrect(null);
    setQuizFeedback('');
  };

  // Get all items flattened for the quiz choices
  const allQuizChoices = OPPOSITE_PAIRS.flatMap(p => [p.conceptA, p.conceptB]);

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-sky-100 border-2 border-sky-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-bounce">⚖️</div>
          <div>
            <h2 className="text-lg font-black text-sky-900">
              {lang === 'tr' ? 'Zıt Kavramları Öğrenelim!' : 'Let\'s Learn Opposites!'}
            </h2>
            <p className="text-xs sm:text-sm text-sky-700 font-bold">
              {lang === 'tr' 
                ? 'Büyük-küçük, sıcak-soğuk gibi birbirinin tam tersi olan kavramları eğlenceli şekillerle eşleştir!' 
                : 'Match words that are exact opposites of each other, like big-small and hot-cold!'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!quizActive ? (
            <button
              onClick={startQuiz}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs sm:text-sm rounded-full border-b-4 border-sky-700 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle size={16} />
              <span>{lang === 'tr' ? 'Zıtlık Oyunu Başlat' : 'Start Opposites Quiz'}</span>
            </button>
          ) : (
            <button
              onClick={exitQuiz}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs sm:text-sm rounded-full border-b-4 border-red-700 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>🚪</span>
              <span>{lang === 'tr' ? 'Keşfe Geri Dön' : 'Back to Explorer'}</span>
            </button>
          )}
        </div>
      </div>

      {quizActive && targetItem && (
        <div className="bg-white rounded-3xl p-5 border-4 border-dashed border-sky-300 text-center shadow-inner">
          <div className="text-xs font-black text-sky-500 uppercase tracking-widest mb-1">
            {lang === 'tr' ? 'ZIT ANLAMLISINI BUL' : 'FIND THE OPPOSITE'}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-sky-950 flex flex-wrap items-center justify-center gap-2">
            <span>🔍 {lang === 'tr' ? `"${targetItem.name.tr}" kavramının zıttı nedir?` : `What is the opposite of "${targetItem.name.en}"?`}</span>
            <span className="text-3xl animate-bounce">{targetItem.emoji}</span>
          </h3>

          <AnimatePresence mode="wait">
            {quizFeedback && (
              <motion.div
                key={quizFeedback}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`mt-4 text-xs sm:text-sm font-black p-3 rounded-2xl inline-flex items-center gap-2 border-2 ${
                  isCorrect 
                    ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' 
                    : 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm'
                }`}
              >
                <span>{isCorrect ? '🌟' : '💡'}</span>
                <span>{quizFeedback}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="text-xs font-black text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              🏆 {lang === 'tr' ? `Doğru Cevap: ${score}` : `Correct Answers: ${score}`}
            </span>
          </div>
        </div>
      )}

      {/* Main interaction board */}
      {!quizActive ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Pairs Selection List */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-6 border-2 border-sky-200 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-sky-950 uppercase tracking-wider mb-2">
              {lang === 'tr' ? 'Bir Çift Seç' : 'Pick an Opposite Pair'}
            </h3>

            {OPPOSITE_PAIRS.map((pair) => {
              const isSelected = selectedPair?.id === pair.id;
              return (
                <button
                  key={pair.id}
                  onClick={() => setSelectedPair(pair)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-98 cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected 
                      ? 'border-sky-500 bg-sky-50/70 ring-4 ring-sky-200' 
                      : 'border-gray-100 hover:border-sky-100 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{pair.conceptA.emoji}</span>
                    <span className="text-xs font-bold text-gray-500">vs</span>
                    <span className="text-2xl">{pair.conceptB.emoji}</span>
                  </div>
                  <span className="text-sm font-black text-sky-950">
                    {lang === 'tr' 
                      ? `${pair.conceptA.name.tr.split(' ')[0]} ⇄ ${pair.conceptB.name.tr.split(' ')[0]}` 
                      : `${pair.conceptA.name.en.split(' ')[0]} ⇄ ${pair.conceptB.name.en.split(' ')[0]}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive display of selected pair */}
          <div className="lg:col-span-7">
            {selectedPair && (
              <div className={`rounded-3xl border-4 ${selectedPair.borderColor} ${selectedPair.bgColor} p-6 h-full flex flex-col justify-between shadow-md`}>
                <div>
                  <div className="text-center mb-6">
                    <span className="text-xs font-black text-sky-600 uppercase tracking-widest bg-white/80 px-4 py-1.5 rounded-full border border-sky-100">
                      {lang === 'tr' ? 'KARŞILAŞTIRMA PANOSU' : 'COMPARISON BOARD'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Concept A */}
                    <button
                      onClick={() => handleItemTap(selectedPair.conceptA)}
                      className="bg-white hover:bg-sky-50 border-2 border-sky-200/60 p-6 rounded-2xl transition-all transform hover:scale-[1.03] active:scale-95 shadow-sm flex flex-col items-center justify-center text-center gap-3 cursor-pointer"
                    >
                      <motion.span 
                        animate={{ scale: [1, 1.1, 1] }} 
                        transition={{ repeat: Infinity, duration: 2.5 }}
                        className="text-6xl sm:text-7xl select-none"
                      >
                        {selectedPair.conceptA.emoji}
                      </motion.span>
                      <div>
                        <span className="block text-lg font-black text-sky-950 uppercase">
                          {lang === 'tr' ? selectedPair.conceptA.name.tr : selectedPair.conceptA.name.en}
                        </span>
                        <span className="block text-[11px] text-sky-600 font-extrabold mt-1">
                          {lang === 'tr' ? 'Dokun ve Dinle 🔊' : 'Tap to Listen 🔊'}
                        </span>
                      </div>
                    </button>

                    {/* Concept B */}
                    <button
                      onClick={() => handleItemTap(selectedPair.conceptB)}
                      className="bg-white hover:bg-sky-50 border-2 border-sky-200/60 p-6 rounded-2xl transition-all transform hover:scale-[1.03] active:scale-95 shadow-sm flex flex-col items-center justify-center text-center gap-3 cursor-pointer"
                    >
                      <motion.span 
                        animate={{ scale: [1, 1.1, 1] }} 
                        transition={{ repeat: Infinity, duration: 2.5, delay: 1.25 }}
                        className="text-6xl sm:text-7xl select-none"
                      >
                        {selectedPair.conceptB.emoji}
                      </motion.span>
                      <div>
                        <span className="block text-lg font-black text-sky-950 uppercase">
                          {lang === 'tr' ? selectedPair.conceptB.name.tr : selectedPair.conceptB.name.en}
                        </span>
                        <span className="block text-[11px] text-sky-600 font-extrabold mt-1">
                          {lang === 'tr' ? 'Dokun ve Dinle 🔊' : 'Tap to Listen 🔊'}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="mt-8 bg-white/70 p-4 rounded-xl border border-sky-100/50 text-center text-xs font-bold text-sky-900 leading-relaxed">
                  💡 {lang === 'tr' 
                    ? 'Zıt anlamlı kavramlar çevreye dair harika ipuçları verir, her şey zıttıyla bilinir!' 
                    : 'Opposite concepts help us describe our world perfectly. Everything has a counterpart!'}
                </div>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Quiz Active Selection Grid */
        <div className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-sm">
          <h3 className="text-sm font-black text-sky-950 uppercase tracking-wider mb-4 text-center">
            {lang === 'tr' ? 'Doğru Zıt Kavramı Seç' : 'Select the Correct Opposite Choice'}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {allQuizChoices.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => handleQuizAnswer(item)}
                  className="bg-sky-50/50 hover:bg-sky-50 border-2 border-sky-100 p-4 rounded-2xl transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <span className="text-5xl select-none animate-pulse">{item.emoji}</span>
                  <span className="text-sm font-extrabold text-sky-950">
                    {lang === 'tr' ? item.name.tr : item.name.en}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
