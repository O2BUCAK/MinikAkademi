import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Check, Play, Award, Clock } from 'lucide-react';
import { Language } from '../types';
import { speak } from '../utils/speak';

interface RoutineStep {
  id: string;
  time: string;
  emoji: string;
  title: { tr: string; en: string };
  description: { tr: string; en: string };
  careTip: { tr: string; en: string };
  audioPhrase: { tr: string; en: string };
  interactivePrompt: { tr: string; en: string };
  interactiveEmoji: string;
  interactiveSuccess: { tr: string; en: string };
}

const ROUTINES: RoutineStep[] = [
  {
    id: 'brushing',
    time: '08:00',
    emoji: '🪥',
    title: { tr: 'Güne Merhaba ve Diş Fırçalama', en: 'Morning Hello & Tooth Brushing' },
    description: { tr: 'Sabah uyanınca yüzümüzü yıkar, dişlerimizi dairesel hareketlerle pırıl pırıl fırçalarız!', en: 'When we wake up, we wash our face and brush our teeth in circular motions until they sparkle!' },
    careTip: { tr: 'Günde en az iki kere dişlerimizi fırçalamak diş canavarlarını uzak tutar!', en: 'Brushing twice a day keeps dental cavities away!' },
    audioPhrase: { tr: 'Sabah uyandım! Dişlerimi fırçalıyorum. Fış fış fış! Tertemiz dişler!', en: 'Morning is here! Brushing my teeth. Brush brush brush! Sparkling clean teeth!' },
    interactivePrompt: { tr: 'Diş macununu fırçanın üzerine sürmek için macuna dokun!', en: 'Tap the toothpaste to put it on your toothbrush!' },
    interactiveEmoji: '🧴',
    interactiveSuccess: { tr: 'Harika! Şimdi dişlerimizi fırçalayabiliriz! Tertemiz oldu!', en: 'Brilliant! Now we can brush our teeth! So shiny!' }
  },
  {
    id: 'eating',
    time: '09:00',
    emoji: '🍳',
    title: { tr: 'Sağlıklı Kahvaltı ve Yemek Yeme', en: 'Healthy Breakfast & Eating Yummy Food' },
    description: { tr: 'Yumurtamızı yer, sütümüzü içeriz. Yemek yerken masada oturur ve çatal bıçak kullanırız.', en: 'We eat delicious eggs and drink healthy milk. We sit properly at the dining table.' },
    careTip: { tr: 'Vitamin dolu meyveler ve sebzeler bizi bir süper kahraman gibi güçlü yapar!', en: 'Vitamins in healthy fruits and vegetables make us strong like superheroes!' },
    audioPhrase: { tr: 'Yemek zamanı! Yumurtamı yiyorum ve sütümü içip büyüyorum! Ham hum!', en: 'Yummy breakfast time! I eat my egg and drink my fresh milk. Yum!' },
    interactivePrompt: { tr: 'Sağlıklı sütünü bardağa doldurmak için süt şişesine dokun!', en: 'Tap the milk bottle to fill up your glass!' },
    interactiveEmoji: '🥛',
    interactiveSuccess: { tr: 'Nefis! Sütümüzü içtik ve kemiklerimiz güçlendi!', en: 'Yummy! We drank our milk and our bones are super strong!' }
  },
  {
    id: 'tidying',
    time: '14:00',
    emoji: '🧸',
    title: { tr: 'Oyun ve Oyuncakları Toplama', en: 'Playtime & Tidying Up Toys' },
    description: { tr: 'Eğlenceli oyunlar oynadıktan sonra oyuncaklarımızı kutusuna yerleştirip odamızı düzenleriz.', en: 'After having fun playing, we always gather our toys and place them neatly in the toy box.' },
    careTip: { tr: 'Odamızı düzenli tutmak hem bizi hem de ailemizi çok mutlu eder!', en: 'Keeping our room tidy makes us and our family extremely happy!' },
    audioPhrase: { tr: 'Oyun bitti! Şimdi tüm oyuncakları pofuduk kutuya koyma zamanı! Düzenli olmak harika!', en: 'Playtime over! Now let\'s put all toys back in the fluffy toy box. Tidiness is super!' },
    interactivePrompt: { tr: 'Oyuncakları kutuya toplamak için oyuncak ayıcığa dokun!', en: 'Tap the teddy bear to tidy it up into the toy box!' },
    interactiveEmoji: '📦',
    interactiveSuccess: { tr: 'Odamız tertemiz ve düzenli oldu! Harika bir yardımcısm!', en: 'Our room is clean and tidy now! You are an amazing helper!' }
  },
  {
    id: 'bedtime',
    time: '21:00',
    emoji: '🌙',
    title: { tr: 'Kitap Okuma ve Uyku Saati', en: 'Storytime & Sound Bedtime Sleep' },
    description: { tr: 'Uykudan önce güzel bir masal dinleriz, ışıkları kapatıp tatlı rüyalara dalarız.', en: 'We listen to a beautiful bedtime story, turn off the lights, and drift into sweet dreams.' },
    careTip: { tr: 'Erken uyumak ertesi güne bol enerjiyle başlamamızı sağlar!', en: 'Sleeping early fills our body with fresh energy for tomorrow!' },
    audioPhrase: { tr: 'Gece oldu. Tatlı uykular, güzel rüyalar! İyi geceler!', en: 'Night has come. Sweet dreams and beautiful sleep! Good night!' },
    interactivePrompt: { tr: 'Masal kitabını açmak ve rüyalara dalmak için kitaba dokun!', en: 'Tap the storybook to open it and start dreaming!' },
    interactiveEmoji: '📖',
    interactiveSuccess: { tr: 'Mışıl mışıl uykular! Yarın yeni bir macera bizi bekliyor olacak!', en: 'Sleep tight! Tomorrow another magical adventure awaits us!' }
  }
];

interface RoutinesSectionProps {
  lang: Language;
  onEarnXp?: (amt: number) => void;
}

export default function RoutinesSection({ lang, onEarnXp }: RoutinesSectionProps) {
  const [selectedStep, setSelectedStep] = useState<RoutineStep>(ROUTINES[0]);
  const [interactiveCompleted, setInteractiveCompleted] = useState<boolean>(false);
  const [interactFeedback, setInteractFeedback] = useState<string>('');

  const handleStepSelect = (step: RoutineStep) => {
    setSelectedStep(step);
    setInteractiveCompleted(false);
    setInteractFeedback('');

    const text = lang === 'tr' 
      ? `${step.title.tr}. ${step.audioPhrase.tr}` 
      : `${step.title.en}. ${step.audioPhrase.en}`;
    speak(text, lang);
  };

  const handleInteractiveAction = () => {
    setInteractiveCompleted(true);
    onEarnXp?.(50);

    const feedback = lang === 'tr' ? selectedStep.interactiveSuccess.tr : selectedStep.interactiveSuccess.en;
    setInteractFeedback(feedback);
    speak(feedback, lang);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-indigo-100 border-2 border-indigo-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
        <div className="text-3xl animate-bounce">⏰</div>
        <div>
          <h2 className="text-lg font-black text-indigo-900">
            {lang === 'tr' ? 'Günlük Rutinler ve Öz Bakım!' : 'Daily Routines & Self-Care!'}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-700 font-bold">
            {lang === 'tr' 
              ? 'Diş fırçalama, sağlıklı beslenme gibi günlük alışkanlıkları görsel olarak keşfet ve interaktif görevleri tamamla!' 
              : 'Discover daily habits like tooth brushing and healthy eating, and complete interactive mini tasks!'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Schedule Timeline column */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-6 border-2 border-indigo-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-indigo-950 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Clock size={16} className="text-indigo-500 animate-spin" />
              <span>{lang === 'tr' ? 'Günlük Programım' : 'My Daily Schedule'}</span>
            </h3>

            <div className="relative border-l-4 border-indigo-100 pl-4 space-y-6">
              {ROUTINES.map((step) => {
                const isSelected = selectedStep.id === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepSelect(step)}
                    className="w-full text-left relative focus:outline-none cursor-pointer"
                  >
                    {/* Bullet marker */}
                    <span className={`absolute -left-[26px] top-1.5 w-4.5 h-4.5 rounded-full border-2 transition-all ${
                      isSelected ? 'bg-indigo-500 border-indigo-700 scale-125' : 'bg-white border-indigo-300'
                    }`} />

                    <div className={`p-3 rounded-2xl border transition-all ${
                      isSelected 
                        ? 'bg-indigo-50 border-indigo-300 shadow-sm scale-[1.02]' 
                        : 'hover:bg-indigo-50/30 border-transparent'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-indigo-500 tracking-wider bg-white px-2 py-0.5 rounded-full border border-indigo-100">
                          {step.time}
                        </span>
                        <span className="text-xl">{step.emoji}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-indigo-950 mt-1">
                        {lang === 'tr' ? step.title.tr : step.title.en}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-center">
            <span className="text-2xl">🌟</span>
            <p className="text-xs font-bold text-indigo-800 mt-1">
              {lang === 'tr' 
                ? 'Rutinlerimizi kendimiz yapmak bizi çok bağımsız ve becerikli kılar!' 
                : 'Doing our daily tasks makes us independent, smart, and strong!'}
            </p>
          </div>
        </div>

        {/* Right Detailed Visual Story column with interaction */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStep.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl border-4 border-indigo-300 p-6 flex flex-col justify-between h-full shadow-md min-h-[420px]"
            >
              <div>
                {/* Step Header */}
                <div className="flex justify-between items-center border-b border-indigo-100 pb-3 mb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl bg-indigo-50 p-2.5 rounded-2xl border border-indigo-200">{selectedStep.emoji}</span>
                    <div>
                      <div className="text-[10px] font-black text-indigo-500 tracking-widest uppercase">
                        {lang === 'tr' ? 'GÜNLÜK ETKİNLİK' : 'DAILY STEP'}
                      </div>
                      <h3 className="text-xl font-black text-indigo-950">
                        {lang === 'tr' ? selectedStep.title.tr : selectedStep.title.en}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStepSelect(selectedStep)}
                    className="p-2.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 hover:scale-110 active:scale-95 rounded-full transition-all cursor-pointer"
                  >
                    <Volume2 size={18} className="stroke-[3px]" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Detailed Description */}
                  <p className="text-sm font-bold text-gray-700 leading-relaxed text-left">
                    {lang === 'tr' ? selectedStep.description.tr : selectedStep.description.en}
                  </p>

                  {/* Child Care Recommendation */}
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-left">
                    <span className="text-xs font-black text-amber-700 uppercase tracking-wider block mb-0.5">
                      💡 {lang === 'tr' ? 'ALTIN TAVSİYE' : 'CARE RECOMMENDATION'}
                    </span>
                    <p className="text-xs font-extrabold text-amber-900 leading-relaxed">
                      {lang === 'tr' ? selectedStep.careTip.tr : selectedStep.careTip.en}
                    </p>
                  </div>

                  {/* Interactive Mini Game */}
                  <div className="p-4 bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200 text-center relative overflow-hidden">
                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1.5">
                      {lang === 'tr' ? 'MİNİK ETKİLEŞİM OYUNU' : 'INTERACTIVE MINI TASK'}
                    </div>

                    {!interactiveCompleted ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-xs font-black text-indigo-950">
                          {lang === 'tr' ? selectedStep.interactivePrompt.tr : selectedStep.interactivePrompt.en}
                        </p>
                        <button
                          onClick={handleInteractiveAction}
                          className="w-16 h-16 bg-white hover:bg-indigo-100 border-2 border-indigo-200 text-4xl rounded-2xl transition-all transform hover:scale-110 active:scale-95 shadow-sm cursor-pointer flex items-center justify-center animate-bounce mt-1"
                        >
                          {selectedStep.interactiveEmoji}
                        </button>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center gap-2 text-green-700"
                      >
                        <span className="text-4xl animate-pulse">🌟🎉</span>
                        <p className="text-xs font-black">
                          {interactFeedback}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-50 to-amber-50 p-3 rounded-2xl border border-indigo-100/70">
                <Sparkles size={16} className="text-amber-500 animate-spin" />
                <span className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                  {interactiveCompleted 
                    ? (lang === 'tr' ? '+50 XP VE YILDIZ KAZANILDI!' : '+50 XP & STARS EARNED!') 
                    : (lang === 'tr' ? 'GÖREVİ YAP VE +50 XP KAZAN!' : 'DO TASK TO EARN +50 XP!')}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
