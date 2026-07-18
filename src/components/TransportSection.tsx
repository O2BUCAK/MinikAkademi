import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, HelpCircle, Check, Award } from 'lucide-react';
import { Language } from '../types';
import { speak } from '../utils/speak';

interface Vehicle {
  id: string;
  emoji: string;
  name: { tr: string; en: string };
  soundText: { tr: string; en: string };
  pathType: { tr: string; en: string };
  pathEmoji: string;
  voicePhrase: { tr: string; en: string };
  funFact: { tr: string; en: string };
}

const VEHICLES: Vehicle[] = [
  {
    id: 'train',
    emoji: '🚂',
    name: { tr: 'Tren / Şimendifer', en: 'Train / Locomotive' },
    soundText: { tr: 'Çuf çuf, düüüt!', en: 'Choo choo, toot toot!' },
    pathType: { tr: 'Demir Yolu (Raylar)', en: 'Railways (Tracks)' },
    pathEmoji: '🛤️',
    voicePhrase: { tr: 'Çuf çuf çuf! Ben hızlı trenim, rayların üzerinde tıkır tıkır uzun yolculuklar yaparım!', en: 'Choo choo! I am the train, I travel long distances on metal tracks!' },
    funFact: { tr: 'Trenler arkalarında vagonlar dolusu insan veya oyuncak taşıyabilirler!', en: 'Trains can pull many passenger cars full of people or cargo containers behind them!' }
  },
  {
    id: 'plane',
    emoji: '✈️',
    name: { tr: 'Uçak', en: 'Airplane' },
    soundText: { tr: 'Vııınnn!', en: 'Whoosh!' },
    pathType: { tr: 'Hava Yolu (Gökyüzü)', en: 'Airways (Sky)' },
    pathEmoji: '☁️',
    voicePhrase: { tr: 'Vııınnn! Ben dev uçağım, bulutların arasında kuşlar gibi süzülür ve kıtalar aşarım!', en: 'Whoosh! I am the giant airplane, soaring through clouds like a big metal bird!' },
    funFact: { tr: 'Uçaklar kocaman kanatları sayesinde havada süzülür ve çok ama çok hızlı uçarlar!', en: 'Airplanes stay up using wings and air pressure, flying extremely fast across the world!' }
  },
  {
    id: 'ship',
    emoji: '🚢',
    name: { tr: 'Gemi', en: 'Ship / Ferry' },
    soundText: { tr: 'Düüüt!', en: 'Honk honk!' },
    pathType: { tr: 'Deniz Yolu (Mavi Deniz)', en: 'Waterways (Sea)' },
    pathEmoji: '🌊',
    voicePhrase: { tr: 'Düüüt! Ben büyük gemiyim, masmavi denizlerde dalgalarla oynayarak yüzerim!', en: 'Toot! I am the large ship, sailing across blue oceans and playing with sea waves!' },
    funFact: { tr: 'Gemiler çok ağır olmalarına rağmen suyun kaldırma gücü sayesinde batmadan yüzerler!', en: 'Even though ships are super heavy, they float safely due to the water buoyancy!' }
  },
  {
    id: 'bus',
    emoji: '🚌',
    name: { tr: 'Belediye Otobüsü', en: 'City Bus' },
    soundText: { tr: 'Biiip biiip!', en: 'Beep beep!' },
    pathType: { tr: 'Kara Yolu (Cadde/Sokak)', en: 'Roadways (Street)' },
    pathEmoji: '🛣️',
    voicePhrase: { tr: 'Bip bip! Ben şehir içi otobüsüyüm, her durakta durup yolcuları gitmek istedikleri yere ulaştırırım!', en: 'Beep beep! I am the city bus, stopping at every station to take people to school and work!' },
    funFact: { tr: 'Çift katlı otobüsler özellikle bazı ülkelerde şehir turları için çok sevilir!', en: 'Double-decker buses have two floors, making sightseeing tours incredibly fun for children!' }
  }
];

interface TransportSectionProps {
  lang: Language;
  onEarnXp?: (amt: number) => void;
}

export default function TransportSection({ lang, onEarnXp }: TransportSectionProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(VEHICLES[0]);
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [targetVehicle, setTargetVehicle] = useState<Vehicle | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleVehicleTap = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    onEarnXp?.(20);

    const speakText = lang === 'tr' 
      ? `${vehicle.name.tr}. Çıkardığı ses: ${vehicle.soundText.tr}. ${vehicle.voicePhrase.tr}` 
      : `${vehicle.name.en}. It sounds like: ${vehicle.soundText.en}. ${vehicle.voicePhrase.en}`;
    speak(speakText, lang);
  };

  const startQuiz = () => {
    setQuizActive(true);
    pickNewTarget();
  };

  const pickNewTarget = () => {
    const randomVehicle = VEHICLES[Math.floor(Math.random() * VEHICLES.length)];
    setTargetVehicle(randomVehicle);
    setIsCorrect(null);
    setQuizFeedback('');

    const question = lang === 'tr'
      ? `Bana söyler misin: "${randomVehicle.pathType.tr}" üzerinde giden araç hangisidir?`
      : `Can you tell me: Which vehicle travels on the ${randomVehicle.pathType.en}?`;
    speak(question, lang);
  };

  const handleQuizAnswer = (vehicle: Vehicle) => {
    if (!targetVehicle) return;

    if (vehicle.id === targetVehicle.id) {
      setIsCorrect(true);
      setScore((s) => s + 1);
      onEarnXp?.(40);

      const successFeedback = lang === 'tr'
        ? `Tebrikler! Doğru! Evet, ${vehicle.name.tr} ${vehicle.pathEmoji} ${vehicle.pathType.tr} üzerinde hareket eder!`
        : `Congratulations! Correct! Yes, the ${vehicle.name.en} ${vehicle.pathEmoji} travels on ${vehicle.pathType.en}!`;
      setQuizFeedback(successFeedback);
      speak(successFeedback, lang);

      setTimeout(() => {
        pickNewTarget();
      }, 3000);
    } else {
      setIsCorrect(false);
      const failFeedback = lang === 'tr'
        ? `Yaklaştın ama bu ${vehicle.name.tr} ve o ${vehicle.pathEmoji} ${vehicle.pathType.tr} üzerinde gider! Başka seç!`
        : `Close! That is the ${vehicle.name.en} and it travels on ${vehicle.pathEmoji} ${vehicle.pathType.en}! Try another!`;
      setQuizFeedback(failFeedback);
      speak(failFeedback, lang);
    }
  };

  const exitQuiz = () => {
    setQuizActive(false);
    setTargetVehicle(null);
    setIsCorrect(null);
    setQuizFeedback('');
  };

  return (
    <div className="space-y-6">
      
      {/* Introduction Header banner */}
      <div className="bg-purple-100 border-2 border-purple-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-bounce">🚂</div>
          <div>
            <h2 className="text-lg font-black text-purple-900">
              {lang === 'tr' ? 'Taşıtları ve Yolculukları Öğrenelim!' : 'Let\'s Learn Vehicles & Journeys!'}
            </h2>
            <p className="text-xs sm:text-sm text-purple-700 font-bold">
              {lang === 'tr' 
                ? 'Hızlı trenleri, uçan dev uçakları keşfet ve nerede yolculuk ettiklerini eşleştir!' 
                : 'Explore fast trains and giant flying airplanes, and match where they travel!'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!quizActive ? (
            <button
              onClick={startQuiz}
              className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-black text-xs sm:text-sm rounded-full border-b-4 border-purple-700 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle size={16} />
              <span>{lang === 'tr' ? 'Yolculuk Eşleştirme Oyunu' : 'Vehicle Path Quiz'}</span>
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

      {quizActive && targetVehicle && (
        <div className="bg-white rounded-3xl p-5 border-4 border-dashed border-purple-300 text-center shadow-inner relative overflow-hidden">
          <div className="text-xs font-black text-purple-500 uppercase tracking-widest mb-1">
            {lang === 'tr' ? 'YOLCULUK BULMACA' : 'VEHICLE MATCH QUIZ'}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-purple-950 flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>🔍 {lang === 'tr' ? `Hangisi şurada yolculuk eder?` : `Which one travels here?`}</span>
            <span className="bg-purple-50 px-3 py-1 rounded-full border border-purple-200 text-sm flex items-center gap-1">
              <span>{targetVehicle.pathEmoji}</span>
              <span>{targetVehicle.pathType[lang]}</span>
            </span>
          </h3>

          <AnimatePresence mode="wait">
            {quizFeedback && (
              <motion.div
                key={quizFeedback}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`mt-4 text-xs sm:text-sm font-black p-3 rounded-2xl border-2 inline-block ${
                  isCorrect 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-orange-50 border-orange-200 text-orange-700'
                }`}
              >
                <span>{quizFeedback}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs font-black text-purple-600">
            <span>🏆 {lang === 'tr' ? `Doğru: ${score}` : `Score: ${score}`}</span>
          </div>
        </div>
      )}

      {/* Main Vehicles list & details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Vehicles Cards Row */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border-2 border-purple-200 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            {VEHICLES.map((vehicle) => {
              const isSelected = selectedVehicle.id === vehicle.id;
              return (
                <button
                  key={vehicle.id}
                  onClick={() => quizActive ? handleQuizAnswer(vehicle) : handleVehicleTap(vehicle)}
                  className={`p-5 rounded-2xl border-b-8 transition-all transform active:scale-95 flex flex-col items-center justify-center gap-3 text-center cursor-pointer ${
                    isSelected && !quizActive
                      ? 'bg-purple-400 border-purple-600 text-purple-950 font-black scale-[1.03] shadow-md'
                      : 'bg-purple-50/50 hover:bg-purple-50 border-purple-100 text-purple-800'
                  }`}
                >
                  <span className="text-6xl select-none filter drop-shadow-sm animate-pulse">{vehicle.emoji}</span>
                  <div>
                    <span className="block text-sm sm:text-base font-black">
                      {lang === 'tr' ? vehicle.name.tr : vehicle.name.en}
                    </span>
                    <span className="text-[10px] bg-white px-2.5 py-0.5 rounded-full border border-purple-100 font-bold block mt-1.5 text-purple-700">
                      {vehicle.soundText[lang]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vehicle Detail Info Box */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedVehicle.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border-4 border-purple-300 p-6 flex flex-col justify-between h-full shadow-md min-h-[350px]"
            >
              <div>
                <div className="flex justify-between items-center border-b border-purple-100 pb-3 mb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl bg-purple-50 p-2.5 rounded-2xl border border-purple-200">{selectedVehicle.emoji}</span>
                    <div>
                      <div className="text-[10px] font-black text-purple-500 uppercase tracking-widest">
                        {lang === 'tr' ? 'TAŞIT DETAYI' : 'VEHICLE FINDER'}
                      </div>
                      <h3 className="text-lg font-black text-purple-950">
                        {lang === 'tr' ? selectedVehicle.name.tr : selectedVehicle.name.en}
                      </h3>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleVehicleTap(selectedVehicle)}
                    className="p-2.5 bg-purple-100 hover:bg-purple-200 text-purple-700 hover:scale-110 active:scale-95 rounded-full transition-all cursor-pointer"
                  >
                    <Volume2 size={18} className="stroke-[3px]" />
                  </button>
                </div>

                <div className="space-y-4 text-left">
                  {/* Path Type info */}
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black text-purple-600 block uppercase tracking-wider">
                        {lang === 'tr' ? 'YOLCULUK ALANI' : 'TRAVEL PATH'}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-purple-950">
                        {lang === 'tr' ? selectedVehicle.pathType.tr : selectedVehicle.pathType.en}
                      </span>
                    </div>
                    <span className="text-2xl">{selectedVehicle.pathEmoji}</span>
                  </div>

                  {/* Fun Fact */}
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                    <span className="text-[10px] font-black text-amber-600 block uppercase tracking-wider mb-0.5">
                      💡 {lang === 'tr' ? 'EĞLENCELİ BİLGİ' : 'COOL FACT'}
                    </span>
                    <p className="text-xs font-bold text-amber-900 leading-relaxed">
                      {lang === 'tr' ? selectedVehicle.funFact.tr : selectedVehicle.funFact.en}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-50 to-amber-50 p-3 rounded-2xl border border-purple-100/70">
                <Sparkles size={16} className="text-amber-500 animate-spin" />
                <span className="text-xs font-black text-purple-950 uppercase tracking-wide">
                  {lang === 'tr' ? '+20 XP KAZANILDI!' : '+20 XP EARNED!'}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
