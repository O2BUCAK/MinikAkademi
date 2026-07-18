import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Check, HelpCircle, Trophy, Award, Star } from 'lucide-react';
import { Language } from '../types';
import { speak } from '../utils/speak';

interface BodyPart {
  id: string;
  emoji: string;
  name: { tr: string; en: string };
  funFact: { tr: string; en: string };
  audioPhrase: { tr: string; en: string };
}

const BODY_PARTS: BodyPart[] = [
  {
    id: 'head',
    emoji: '🧠',
    name: { tr: 'Baş / Kafa', en: 'Head / Brain' },
    funFact: { tr: 'Düşünmemizi, hayal kurmamızı ve öğrenmemizi sağlar!', en: 'Helps us think, dream, and learn new things!' },
    audioPhrase: { tr: 'Harika bir baş! İçinde senin süper beynin var!', en: 'Great head! Your super brain is inside!' }
  },
  {
    id: 'eyes',
    emoji: '👀',
    name: { tr: 'Gözler', en: 'Eyes' },
    funFact: { tr: 'Etrafındaki tüm güzel renkleri görmeni sağlar!', en: 'Allows you to see all the beautiful colors around you!' },
    audioPhrase: { tr: 'Gözlerinle kitap okuyabilir ve gökkuşağını görebilirsin!', en: 'With eyes, you can read books and see rainbows!' }
  },
  {
    id: 'ears',
    emoji: '👂',
    name: { tr: 'Kulaklar', en: 'Ears' },
    funFact: { tr: 'Kuş seslerini, müzikleri ve sevdiklerinin sesini duyar!', en: 'Hears birds singing, music, and the voice of your loved ones!' },
    audioPhrase: { tr: 'Kulaklarınla harika şarkılar dinleyebilirsin!', en: 'With ears, you can listen to wonderful songs!' }
  },
  {
    id: 'nose',
    emoji: '👃',
    name: { tr: 'Burun', en: 'Nose' },
    funFact: { tr: 'Çiçekleri koklamamızı ve nefes almamızı sağlar!', en: 'Helps us smell beautiful flowers and breathe fresh air!' },
    audioPhrase: { tr: 'Mis kokulu çilekleri burnunla koklarsın!', en: 'You smell sweet strawberries with your nose!' }
  },
  {
    id: 'mouth',
    emoji: '👄',
    name: { tr: 'Ağız / Dişler', en: 'Mouth / Teeth' },
    funFact: { tr: 'Yemek yememizi, konuşmamızı ve gülümsememizi sağlar!', en: 'Helps us eat yummy food, speak, and smile!' },
    audioPhrase: { tr: 'Gülümse ve ağzınla harika şarkılar söyle!', en: 'Smile and sing wonderful songs with your mouth!' }
  },
  {
    id: 'hands',
    emoji: '🙌',
    name: { tr: 'Eller / Parmaklar', en: 'Hands / Fingers' },
    funFact: { tr: 'Yazı yazmanı, resim yapmanı ve alkışlamanı sağlar!', en: 'Helps you write, paint, draw, and clap your hands!' },
    audioPhrase: { tr: 'Ellerinle kocaman alkışla! Aferin sana!', en: 'Clap with your hands! Well done to you!' }
  },
  {
    id: 'feet',
    emoji: '👣',
    name: { tr: 'Ayaklar', en: 'Feet' },
    funFact: { tr: 'Koşmanı, zıplamanı ve dans etmeni sağlar!', en: 'Helps you run, jump high, and dance to the music!' },
    audioPhrase: { tr: 'Ayaklarınla tıp tıp tıp diye dans et!', en: 'Dance and stomp with your feet!' }
  },
  {
    id: 'heart',
    emoji: '❤️',
    name: { tr: 'Kalp', en: 'Heart' },
    funFact: { tr: 'Tüm vücudumuza sevgi ve enerji pompalar!', en: 'Pumps love and energy to our entire body!' },
    audioPhrase: { tr: 'Pıt pıt atan sevgi dolu bir kalp!', en: 'Thump thump! A heart full of love!' }
  }
];

// Coordinate hotspots for the doll model
const HOTSPOTS = [
  { id: 'head', top: '10%', left: '50%', transform: 'translateX(-50%)' },
  { id: 'eyes', top: '19%', left: '50%', transform: 'translateX(-50%)' },
  { id: 'ears', top: '19%', left: '32%', transform: 'translateX(-50%)' },
  { id: 'nose', top: '24%', left: '50%', transform: 'translateX(-50%)' },
  { id: 'mouth', top: '29%', left: '50%', transform: 'translateX(-50%)' },
  { id: 'heart', top: '48%', left: '50%', transform: 'translateX(-50%)' },
  { id: 'hands', top: '55%', left: '22%', transform: 'translateX(-50%)' },
  { id: 'feet', top: '86%', left: '50%', transform: 'translateX(-50%)' },
];

interface BodyPartsSectionProps {
  lang: Language;
  onEarnXp?: (amt: number) => void;
}

export default function BodyPartsSection({ lang, onEarnXp }: BodyPartsSectionProps) {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(BODY_PARTS[0]);
  const [score, setScore] = useState<number>(0);
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [targetPart, setTargetPart] = useState<BodyPart | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handlePartTap = (part: BodyPart) => {
    setSelectedPart(part);
    onEarnXp?.(20);

    const speakText = lang === 'tr' 
      ? `${part.name.tr}. ${part.audioPhrase.tr}` 
      : `${part.name.en}. ${part.audioPhrase.en}`;
    speak(speakText, lang);
  };

  const startQuiz = () => {
    setQuizActive(true);
    pickNewTarget();
    setQuizFeedback('');
    setIsCorrect(null);
  };

  const pickNewTarget = () => {
    const randomPart = BODY_PARTS[Math.floor(Math.random() * BODY_PARTS.length)];
    setTargetPart(randomPart);
    setIsCorrect(null);
    setQuizFeedback('');

    const question = lang === 'tr'
      ? `Hadi maket üstünde göster: ${randomPart.name.tr} nerede?`
      : `Find on the model: Where is the ${randomPart.name.en}?`;
    speak(question, lang);
  };

  const handleQuizAnswer = (part: BodyPart) => {
    if (!targetPart) return;

    if (part.id === targetPart.id) {
      setIsCorrect(true);
      setScore((s) => s + 1);
      onEarnXp?.(50);

      const feedback = lang === 'tr'
        ? `Harika! Evet, maket üstünde ${part.name.tr} burası! 🎉`
        : `Awesome! Yes, this is the ${part.name.en} on our model! 🎉`;
      setQuizFeedback(feedback);
      speak(feedback, lang);

      // Pick next after a short delay
      setTimeout(() => {
        pickNewTarget();
      }, 2500);
    } else {
      setIsCorrect(false);
      const feedback = lang === 'tr'
        ? `Yaklaştın ama bu ${part.name.tr}. Hadi tekrar deneyelim!`
        : `Close, but that is the ${part.name.en}. Let's try again!`;
      setQuizFeedback(feedback);
      speak(feedback, lang);
    }
  };

  const exitQuiz = () => {
    setQuizActive(false);
    setTargetPart(null);
    setIsCorrect(null);
    setQuizFeedback('');
  };

  return (
    <div className="space-y-6">
      
      {/* Introduction Header banner */}
      <div className="bg-amber-100 border-2 border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-bounce">🙋‍♀️</div>
          <div>
            <h2 className="text-lg font-black text-amber-900">
              {lang === 'tr' ? 'Vücudumuzu Maket Üzerinde Tanıyalım!' : 'Let\'s Learn Our Body Parts on the Model!'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-700 font-bold">
              {lang === 'tr' 
                ? 'Maket üzerindeki organların üstüne dokun veya eğlenceli maket bulmacasını çöz!' 
                : 'Tap on organs on our model to learn what they do, or solve the fun body quiz!'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!quizActive ? (
            <button
              onClick={startQuiz}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm rounded-full border-b-4 border-amber-700 shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle size={16} />
              <span>{lang === 'tr' ? 'Maket Bulmaca Oyunu' : 'Model Puzzle Game'}</span>
            </button>
          ) : (
            <button
              onClick={exitQuiz}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs sm:text-sm rounded-full border-b-4 border-red-700 shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>🚪</span>
              <span>{lang === 'tr' ? 'Keşfe Geri Dön' : 'Back to Explorer'}</span>
            </button>
          )}
        </div>
      </div>

      {quizActive && targetPart && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border-4 border-dashed border-amber-300 text-center shadow-inner relative overflow-hidden">
          <div className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">
            {lang === 'tr' ? 'MAKET BULMACA GÖREVİ' : 'MODEL GUESSING TASK'}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-amber-950 flex items-center justify-center gap-2">
            <span>🔍 {lang === 'tr' ? `Maket üstünde göster: ${targetPart.name.tr} nerede?` : `Find on model: Where is the ${targetPart.name.en}?`}</span>
          </h3>
          
          <AnimatePresence mode="wait">
            {quizFeedback && (
              <motion.div
                key={quizFeedback}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`mt-3 text-sm font-black p-3 rounded-2xl inline-flex items-center gap-2 border-2 ${
                  isCorrect 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-orange-50 border-orange-200 text-orange-700'
                }`}
              >
                <span>{isCorrect ? '🏆' : '💡'}</span>
                <span>{quizFeedback}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
              <Award size={14} />
              {lang === 'tr' ? `Doğru: ${score}` : `Score: ${score}`}
            </span>
          </div>
        </div>
      )}

      {/* Main Grid area with interactive model map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Interactive Human Avatar Model Card ("Maket") */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-4 sm:p-6 border-2 border-amber-200 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-sm font-black text-amber-900 mb-4 uppercase tracking-widest">
            🧍‍♀️ {lang === 'tr' ? 'BİLİM MAKETİ' : 'ANATOMY MODEL'}
          </h3>

          <div className="relative w-full max-w-[280px] h-[390px] bg-amber-50/50 rounded-3xl border-4 border-dashed border-amber-200 flex items-center justify-center overflow-hidden">
            
            {/* The Visual Doll Figure */}
            <div className="relative w-48 h-72 flex flex-col items-center mt-4">
              
              {/* Head */}
              <div className="w-20 h-20 bg-orange-100 rounded-full border-4 border-orange-200 flex flex-col items-center justify-center relative shadow-sm">
                {/* Hair */}
                <div className="absolute top-0 inset-x-0 h-4 bg-amber-700 rounded-t-full" />
                {/* Eyes visual */}
                <div className="flex gap-4 mt-3">
                  <span className="text-[10px]">👀</span>
                </div>
                {/* Nose visual */}
                <div className="w-1 h-2 bg-orange-300 rounded-full mt-0.5" />
                {/* Smile visual */}
                <div className="w-4 h-2 border-b-2 border-orange-400 rounded-b-full mt-0.5" />
              </div>

              {/* Neck */}
              <div className="w-3 h-4 bg-orange-100 border-x-4 border-orange-200 -mt-1" />

              {/* Body / Torso */}
              <div className="w-16 h-28 bg-orange-100 rounded-2xl border-4 border-orange-200 relative flex items-center justify-center shadow-sm">
                {/* Heart visual */}
                <div className="absolute top-4 left-3 text-rose-500 text-sm animate-pulse">❤️</div>
              </div>

              {/* Arms */}
              <div className="absolute top-[88px] inset-x-0 flex justify-between px-3">
                {/* Left Arm */}
                <div className="w-8 h-3 bg-orange-100 border-2 border-orange-200 rounded-l-full rotate-12" />
                {/* Right Arm */}
                <div className="w-8 h-3 bg-orange-100 border-2 border-orange-200 rounded-r-full -rotate-12" />
              </div>

              {/* Legs */}
              <div className="flex gap-4 mt-1">
                {/* Left Leg */}
                <div className="w-4 h-14 bg-orange-100 border-4 border-orange-200 rounded-b-xl" />
                {/* Right Leg */}
                <div className="w-4 h-14 bg-orange-100 border-4 border-orange-200 rounded-b-xl" />
              </div>
            </div>

            {/* Hotspots placed absolutely over the figure */}
            {HOTSPOTS.map((hotspot) => {
              const bodyPartInfo = BODY_PARTS.find(b => b.id === hotspot.id)!;
              const isTarget = targetPart?.id === hotspot.id && quizActive;
              const isCurrentSelected = selectedPart?.id === hotspot.id && !quizActive;

              return (
                <button
                  key={hotspot.id}
                  onClick={() => quizActive ? handleQuizAnswer(bodyPartInfo) : handlePartTap(bodyPartInfo)}
                  style={{ top: hotspot.top, left: hotspot.left, transform: hotspot.transform }}
                  className={`absolute w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-black transition-all shadow-md transform hover:scale-125 active:scale-95 cursor-pointer z-20 ${
                    isTarget
                      ? 'bg-amber-400 border-amber-600 ring-4 ring-amber-300 animate-bounce'
                      : isCurrentSelected
                      ? 'bg-amber-500 border-amber-700 text-white scale-115 ring-4 ring-amber-200'
                      : 'bg-white/95 border-amber-300 text-amber-900 hover:bg-amber-100'
                  }`}
                  title={lang === 'tr' ? bodyPartInfo.name.tr : bodyPartInfo.name.en}
                >
                  <span className="select-none">{bodyPartInfo.emoji}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Informative Side Card / Selector Column */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          
          {/* Quick list selectors */}
          {!quizActive && (
            <div className="bg-white rounded-3xl p-4 border-2 border-amber-100 shadow-sm">
              <h4 className="text-xs font-black text-amber-700 uppercase tracking-wider mb-2">
                {lang === 'tr' ? 'VÜCUT LİSTESİ' : 'BODY LIST'}
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {BODY_PARTS.map((part) => {
                  const isSelected = selectedPart?.id === part.id;
                  return (
                    <button
                      key={part.id}
                      onClick={() => handlePartTap(part)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-amber-400 border-amber-500 text-amber-950 font-black'
                          : 'bg-amber-50/20 border-amber-100 text-amber-800'
                      }`}
                    >
                      <span className="text-xl">{part.emoji}</span>
                      <span className="text-[9px] font-bold truncate max-w-full">
                        {lang === 'tr' ? part.name.tr.split(' ')[0] : part.name.en.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {selectedPart && !quizActive ? (
              <motion.div
                key={selectedPart.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border-4 border-amber-300 p-6 flex flex-col justify-between flex-1 shadow-md"
              >
                <div>
                  <div className="flex justify-between items-center border-b border-amber-100 pb-3 mb-4 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl bg-amber-50 p-2.5 rounded-2xl border border-amber-200">{selectedPart.emoji}</span>
                      <div>
                        <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                          {lang === 'tr' ? 'ORGAN BİLGİSİ' : 'ORGAN INFO'}
                        </div>
                        <h3 className="text-lg font-black text-amber-950">
                          {lang === 'tr' ? selectedPart.name.tr : selectedPart.name.en}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePartTap(selectedPart)}
                      className="p-2.5 bg-amber-100 hover:bg-amber-200 text-amber-700 hover:scale-105 active:scale-95 rounded-full transition-all cursor-pointer"
                    >
                      <Volume2 size={18} className="stroke-[3px]" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                      <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-wider mb-0.5">
                        {lang === 'tr' ? 'EĞLENCELİ BİLGİ' : 'FUN FACT'}
                      </h4>
                      <p className="text-xs font-bold text-amber-900 leading-relaxed">
                        {lang === 'tr' ? selectedPart.funFact.tr : selectedPart.funFact.en}
                      </p>
                    </div>

                    <div className="p-3 bg-orange-50 rounded-2xl border border-orange-150">
                      <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-wider mb-0.5">
                        {lang === 'tr' ? 'GÜNLÜK TAVSİYE' : 'DAILY CARE TIP'}
                      </h4>
                      <p className="text-[11px] font-bold text-orange-900 leading-relaxed">
                        {selectedPart.id === 'hands' && (lang === 'tr' ? 'Ellerimizi en az 20 saniye sabunla yıkamalıyız!' : 'Always wash hands for at least 20 seconds with soap!')}
                        {selectedPart.id === 'mouth' && (lang === 'tr' ? 'Dişlerimizi günde 2 kez fırçalamayı unutmayalım!' : 'Brush your teeth twice a day for a bright smile!')}
                        {selectedPart.id === 'eyes' && (lang === 'tr' ? 'Ekrana çok yakından uzun süre bakmamalıyız!' : 'Do not sit too close to screens or watch for too long!')}
                        {selectedPart.id === 'ears' && (lang === 'tr' ? 'Çok yüksek sesli müzik dinlememeliyiz!' : 'Keep headphone volume low to protect your beautiful ears!')}
                        {selectedPart.id !== 'hands' && selectedPart.id !== 'mouth' && selectedPart.id !== 'eyes' && selectedPart.id !== 'ears' && (lang === 'tr' ? 'Vücudumuza sevgiyle yaklaşmalı, sağlıklı beslenmeliyiz!' : 'Eat colorful fruits and vegetables to keep your body strong!')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-2xl border border-amber-100/70">
                  <Sparkles size={16} className="text-amber-500 animate-spin" />
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wide">
                    {lang === 'tr' ? '+20 XP KAZANILDI!' : '+20 XP EARNED!'}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="bg-amber-50/50 rounded-3xl border-2 border-dashed border-amber-300/60 p-8 flex-1 flex flex-col items-center justify-center text-center text-amber-600">
                <div className="text-6xl mb-4 animate-bounce">🧬</div>
                <h3 className="text-lg font-bold text-amber-950 mb-1">
                  {lang === 'tr' ? 'Dokun ve Keşfet!' : 'Tap and Discover!'}
                </h3>
                <p className="text-xs max-w-[240px]">
                  {lang === 'tr' 
                    ? 'Maket üstündeki organ butonlarına tıklayarak heyecan verici detayları sesli öğren!' 
                    : 'Tap any body part hotspot on the model to learn amazing facts out loud!'}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
