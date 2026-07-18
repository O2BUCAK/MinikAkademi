import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, HelpCircle, Check, Play, Award } from 'lucide-react';
import { Language } from '../types';
import { speak } from '../utils/speak';

interface WeatherItem {
  id: string;
  emoji: string;
  name: { tr: string; en: string };
  description: { tr: string; en: string };
  careTip: { tr: string; en: string };
  correctOutfitId: string; // which outfit goes with this weather
  outfitOptions: {
    id: string;
    emoji: string;
    name: { tr: string; en: string };
  }[];
  audioPhrase: { tr: string; en: string };
}

const WEATHERS: WeatherItem[] = [
  {
    id: 'sun',
    emoji: '☀️',
    name: { tr: 'Güneş / Güneşli', en: 'Sun / Sunny' },
    description: { tr: 'Güneş gökyüzünde parlar, etrafı ısıtır ve aydınlatır. Dışarı çıkıp parkta oynamak için harika bir gündür!', en: 'The sun shines bright, warming and lighting up our earth! A wonderful day to play in the park!' },
    careTip: { tr: 'Güneşli günlerde başımıza şapka takmalı ve bol bol su içmeliyiz!', en: 'Wear a sun hat on sunny days and remember to drink plenty of fresh water!' },
    correctOutfitId: 'sunglasses',
    outfitOptions: [
      { id: 'sunglasses', emoji: '🕶️', name: { tr: 'Güneş Gözlüğü & Şapka', en: 'Sunglasses & Hat' } },
      { id: 'coat', emoji: '🧥', name: { tr: 'Kalın Kışlık Mont', en: 'Thick Winter Coat' } }
    ],
    audioPhrase: { tr: 'Güneşli bir gün! Gökyüzü masmavi ve hava çok sıcak! Şapkanı takmayı unutma!', en: 'A bright sunny day! The sky is blue and it is warm outside! Remember your sun hat!' }
  },
  {
    id: 'rain',
    emoji: '🌧️',
    name: { tr: 'Yağmur / Yağmurlu', en: 'Rain / Rainy' },
    description: { tr: 'Bulutlardan su damlacıkları süzülür. Yağmur barajları doldurur, bitkileri ve sevimli çiçekleri sular!', en: 'Water droplets fall gently from fluffy clouds. Rain waters beautiful flowers and fills up lakes!' },
    careTip: { tr: 'Yağmurlu havada dışarı çıkarken şemsiye almalı ve yağmurluk giymeliyiz!', en: 'Always carry a colorful umbrella and put on your raincoat when walking in rain!' },
    correctOutfitId: 'umbrella',
    outfitOptions: [
      { id: 'umbrella', emoji: '☔', name: { tr: 'Şemsiye & Çizme', en: 'Umbrella & Boots' } },
      { id: 'swimsuit', emoji: '🩱', name: { tr: 'Yüzme Mayosu', en: 'Swimming Suit' } }
    ],
    audioPhrase: { tr: 'Yağmur yağıyor! Şıp şıp şıp! Şemsiyeni açıp su birikintilerinde zıplayabilirsin!', en: 'It is raining! Drip drop drip! Open your umbrella and jump in muddy puddles!' }
  },
  {
    id: 'snow',
    emoji: '❄️',
    name: { tr: 'Kar / Karlı', en: 'Snow / Snowy' },
    description: { tr: 'Gökyüzünden yumuşacık beyaz kar taneleri süzülür. Kardan adam yapmak ve kızakla kaymak için çok eğlencelidir!', en: 'Soft, white snowflakes drift down from the sky. Super fun for building a big snowman!' },
    careTip: { tr: 'Karlı havalarda üşümemek için eldiven, atkı ve kalın mont giymeliyiz!', en: 'Wear cozy gloves, a warm scarf, and a thick coat to stay safe and snug!' },
    correctOutfitId: 'scarf',
    outfitOptions: [
      { id: 'scarf', emoji: '🧣', name: { tr: 'Atkı, Bere & Eldiven', en: 'Scarf, Beanie & Gloves' } },
      { id: 'tshirt', emoji: '👕', name: { tr: 'İnce Tişört', en: 'Short Sleeves T-Shirt' } }
    ],
    audioPhrase: { tr: 'Kar yağıyor! Her yer bembeyaz oldu! Hadi kalın eldivenlerini giy ve kardan adam yapalım!', en: 'It is snowing! Everything is white and beautiful! Put on gloves and let\'s build a snowman!' }
  },
  {
    id: 'rainbow',
    emoji: '🌈',
    name: { tr: 'Gökkuşağı', en: 'Rainbow' },
    description: { tr: 'Yağmur yağdıktan sonra güneş açınca gökyüzünde 7 farklı renkten oluşan harika bir kemer belirir!', en: 'When the sun comes out right after a rainfall, a colorful arch of 7 colors appears in the sky!' },
    careTip: { tr: 'Gökkuşağının renklerini saymak çok eğlencelidir! Kırmızı, turuncu, sarı, yeşil...', en: 'Counting the rainbow colors is super fun! Red, orange, yellow, green, blue...' },
    correctOutfitId: 'camera',
    outfitOptions: [
      { id: 'camera', emoji: '📷', name: { tr: 'Fotoğraf Makinesi', en: 'Photo Camera' } },
      { id: 'snowboard', emoji: '🏂', name: { tr: 'Kar Tahtası', en: 'Snowboard' } }
    ],
    audioPhrase: { tr: 'Bak, gökyüzünde kocaman renkli bir gökkuşağı çıktı! Çok güzel görünüyor!', en: 'Look! A gorgeous colorful rainbow has appeared in the sky! It looks so magical!' }
  }
];

interface NatureSectionProps {
  lang: Language;
  onEarnXp?: (amt: number) => void;
}

export default function NatureSection({ lang, onEarnXp }: NatureSectionProps) {
  const [selectedWeather, setSelectedWeather] = useState<WeatherItem>(WEATHERS[0]);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [currentOutfitStep, setCurrentOutfitStep] = useState<number>(0);
  const [gameFeedback, setGameFeedback] = useState<string>('');
  const [gameScore, setGameScore] = useState<number>(0);
  const [isOutfitCorrect, setIsOutfitCorrect] = useState<boolean | null>(null);

  const handleWeatherTap = (weather: WeatherItem) => {
    setSelectedWeather(weather);
    onEarnXp?.(20);

    const speakText = lang === 'tr' 
      ? `${weather.name.tr}. ${weather.audioPhrase.tr}` 
      : `${weather.name.en}. ${weather.audioPhrase.en}`;
    speak(speakText, lang);
  };

  const startOutfitGame = () => {
    setGameActive(true);
    setCurrentOutfitStep(0);
    setGameFeedback('');
    setIsOutfitCorrect(null);

    const intro = lang === 'tr'
      ? `Hava durumu kıyafet oyununa hoş geldin! ${WEATHERS[0].name.tr} havada ne giymeliyiz?`
      : `Welcome to the weather dressing game! What should we wear in ${WEATHERS[0].name.en} weather?`;
    speak(intro, lang);
  };

  const handleOutfitChoice = (choiceId: string, weather: WeatherItem) => {
    if (choiceId === weather.correctOutfitId) {
      setIsOutfitCorrect(true);
      setGameScore((s) => s + 1);
      onEarnXp?.(40);

      const successFeedback = lang === 'tr'
        ? `Aferin! Süper bir seçim! ${weather.name.tr} havalarda tam da buna ihtiyacımız var!`
        : `Well done! Perfect choice! That is exactly what we need for ${weather.name.en} days!`;
      setGameFeedback(successFeedback);
      speak(successFeedback, lang);

      // Advance after a delay
      setTimeout(() => {
        if (currentOutfitStep < WEATHERS.length - 1) {
          setCurrentOutfitStep(currentOutfitStep + 1);
          setIsOutfitCorrect(null);
          setGameFeedback('');

          const nextPrompt = lang === 'tr'
            ? `Şimdi sıra bunda: ${WEATHERS[currentOutfitStep + 1].name.tr} havada dışarı çıkarken ne almalıyız?`
            : `Now for this one: What should we pick in ${WEATHERS[currentOutfitStep + 1].name.en} weather?`;
          speak(nextPrompt, lang);
        } else {
          // Game finished
          const finishedText = lang === 'tr'
            ? `Tebrikler! Oyunu tamamladın! Harika bir doğa uzmanı oldun!`
            : `Congratulations! You completed the game! You are a brilliant nature explorer!`;
          setGameFeedback(finishedText);
          speak(finishedText, lang);
        }
      }, 3000);
    } else {
      setIsOutfitCorrect(false);
      const failFeedback = lang === 'tr'
        ? `Hmm, bu kıyafet veya araç bu havaya pek uygun değil gibi! Tekrar düşün!`
        : `Hmm, that choice doesn't quite match this weather condition! Think again!`;
      setGameFeedback(failFeedback);
      speak(failFeedback, lang);
    }
  };

  const resetGame = () => {
    setGameActive(false);
    setCurrentOutfitStep(0);
    setGameFeedback('');
    setIsOutfitCorrect(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-sky-50 border-2 border-sky-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-bounce">🌈</div>
          <div>
            <h2 className="text-lg font-black text-sky-950">
              {lang === 'tr' ? 'Doğa Olayları ve Hava Durumu!' : 'Nature & Weather Wonders!'}
            </h2>
            <p className="text-xs sm:text-sm text-sky-700 font-bold">
              {lang === 'tr' 
                ? 'Güneş, yağmur, kar gibi doğa harikalarını tanı, kıyafet eşleştirme oyununu oyna!' 
                : 'Meet the wonders of nature like sun, rain, and snow, and play the dressing-up match game!'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!gameActive ? (
            <button
              onClick={startOutfitGame}
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-black text-xs sm:text-sm rounded-full border-b-4 border-yellow-600 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>🧥</span>
              <span>{lang === 'tr' ? 'Kıyafet Giydirme Oyunu' : 'Dress-up Game'}</span>
            </button>
          ) : (
            <button
              onClick={resetGame}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs sm:text-sm rounded-full border-b-4 border-red-700 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>🚪</span>
              <span>{lang === 'tr' ? 'Keşfe Geri Dön' : 'Back to Explorer'}</span>
            </button>
          )}
        </div>
      </div>

      {gameActive ? (
        /* Outfit Dress up interactive game block */
        <div className="bg-white rounded-3xl p-6 border-4 border-dashed border-yellow-300 text-center shadow-inner space-y-6 max-w-2xl mx-auto">
          <div className="text-xs font-black text-yellow-600 uppercase tracking-widest">
            {lang === 'tr' ? 'HAVA DURUMUNA GÖRE GİYİN' : 'DRESS FOR THE WEATHER'}
          </div>

          {/* Current weather question display */}
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-7xl select-none animate-bounce">{WEATHERS[currentOutfitStep].emoji}</span>
            <h3 className="text-xl font-black text-gray-900 mt-2">
              {lang === 'tr' 
                ? `Hava ${WEATHERS[currentOutfitStep].name.tr}! Dışarı çıkarken ne almalıyız?` 
                : `It is ${WEATHERS[currentOutfitStep].name.en}! What should we pick?`}
            </h3>
          </div>

          {/* Options side-by-side */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {WEATHERS[currentOutfitStep].outfitOptions.map((option) => {
              return (
                <button
                  key={option.id}
                  onClick={() => handleOutfitChoice(option.id, WEATHERS[currentOutfitStep])}
                  className="bg-yellow-50/50 hover:bg-yellow-50 border-2 border-yellow-100 p-5 rounded-2xl transition-all transform hover:scale-[1.03] active:scale-95 flex flex-col items-center justify-center gap-3 cursor-pointer"
                >
                  <span className="text-5xl select-none">{option.emoji}</span>
                  <span className="text-xs sm:text-sm font-black text-yellow-950">
                    {lang === 'tr' ? option.name.tr : option.name.en}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {gameFeedback && (
              <motion.div
                key={gameFeedback}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`text-xs sm:text-sm font-black p-3.5 rounded-2xl border-2 inline-block max-w-md mx-auto ${
                  isOutfitCorrect 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-orange-50 border-orange-200 text-orange-700'
                }`}
              >
                {gameFeedback}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 text-xs font-black text-yellow-700 pt-3 border-t border-yellow-100">
            <span>🏆 {lang === 'tr' ? `Puan: ${gameScore}` : `Score: ${gameScore}`}</span>
            <span>•</span>
            <span>{lang === 'tr' ? `${currentOutfitStep + 1} / ${WEATHERS.length} Aşama` : `Step ${currentOutfitStep + 1} of ${WEATHERS.length}`}</span>
          </div>
        </div>
      ) : (
        /* Standard Exploration Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Weather Cards Grid */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border-2 border-sky-200 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              {WEATHERS.map((weather) => {
                const isSelected = selectedWeather.id === weather.id;
                return (
                  <button
                    key={weather.id}
                    onClick={() => handleWeatherTap(weather)}
                    className={`p-5 rounded-2xl border-b-8 transition-all transform active:scale-95 flex flex-col items-center justify-center gap-3 text-center cursor-pointer ${
                      isSelected 
                        ? 'bg-sky-400 border-sky-600 text-sky-950 font-black scale-103 shadow-md' 
                        : 'bg-sky-50/50 hover:bg-sky-50 border-sky-100 text-sky-800'
                    }`}
                  >
                    <span className="text-6xl select-none filter drop-shadow-sm animate-pulse">{weather.emoji}</span>
                    <div>
                      <span className="block text-sm sm:text-base font-black">
                        {lang === 'tr' ? weather.name.tr : weather.name.en}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Detail Card for selected weather */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedWeather.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl border-4 border-sky-300 p-6 flex flex-col justify-between h-full shadow-md min-h-[350px]"
              >
                <div>
                  <div className="flex justify-between items-center border-b border-sky-100 pb-3 mb-4 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl bg-sky-50 p-2 rounded-xl border border-sky-200">{selectedWeather.emoji}</span>
                      <div>
                        <div className="text-[10px] font-black text-sky-500 uppercase tracking-widest">
                          {lang === 'tr' ? 'DOĞA OLAYI' : 'NATURE WONDER'}
                        </div>
                        <h3 className="text-xl font-black text-sky-950">
                          {lang === 'tr' ? selectedWeather.name.tr : selectedWeather.name.en}
                        </h3>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleWeatherTap(selectedWeather)}
                      className="p-2.5 bg-sky-100 hover:bg-sky-200 text-sky-700 hover:scale-110 active:scale-95 rounded-full transition-all cursor-pointer"
                    >
                      <Volume2 size={18} className="stroke-[3px]" />
                    </button>
                  </div>

                  <div className="space-y-4 text-left">
                    {/* Description */}
                    <p className="text-sm font-bold text-gray-700 leading-relaxed">
                      {lang === 'tr' ? selectedWeather.description.tr : selectedWeather.description.en}
                    </p>

                    {/* Recommendation Card */}
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                      <h4 className="text-[11px] font-black text-amber-700 uppercase tracking-wider mb-0.5">
                        💡 {lang === 'tr' ? 'SAĞLIK & GÜVENLİK' : 'HEALTH & PROTECTION'}
                      </h4>
                      <p className="text-xs font-extrabold text-amber-900 leading-relaxed">
                        {lang === 'tr' ? selectedWeather.careTip.tr : selectedWeather.careTip.en}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-sky-50 to-amber-50 p-3 rounded-2xl border border-sky-100/70">
                  <Sparkles size={16} className="text-amber-500 animate-spin" />
                  <span className="text-xs font-black text-sky-950 uppercase tracking-wide">
                    {lang === 'tr' ? '+20 XP KAZANILDI!' : '+20 XP EARNED!'}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      )}

    </div>
  );
}
