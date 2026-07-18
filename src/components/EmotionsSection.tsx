import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, HelpCircle, Check, Award } from 'lucide-react';
import { Language } from '../types';
import { speak } from '../utils/speak';

interface Emotion {
  id: string;
  emoji: string;
  name: { tr: string; en: string };
  voicePhrase: { tr: string; en: string };
  careTip: { tr: string; en: string };
}

const EMOTIONS: Emotion[] = [
  {
    id: 'happy',
    emoji: '😊',
    name: { tr: 'Mutlu', en: 'Happy' },
    voicePhrase: { tr: 'Mutlu! Yüzüm gülüyor, içimde kelebekler uçuşuyor ve şarkı söylemek istiyorum!', en: 'Happy! Smiling bright, feeling super joyful and ready to laugh!' },
    careTip: { tr: 'Mutluluğumuzu sevdiklerimizle paylaşmak dünyayı çok daha güzel kılar!', en: 'Sharing our joy with friends makes our happiness multiply!' }
  },
  {
    id: 'sad',
    emoji: '😢',
    name: { tr: 'Üzgün', en: 'Sad' },
    voicePhrase: { tr: 'Üzgün. Bazen işler istediğimiz gibi gitmeyince üzülebilir ve ağlayabiliriz. Bu çok normaldir!', en: 'Sad. Sometimes when things don\'t go our way, we feel sad or cry. It is completely okay to feel sad!' },
    careTip: { tr: 'Üzgün hissettiğimizde sevdiğimiz birine sarılmak veya anlatmak bizi rahatlatır!', en: 'When sad, talking to our parents or hugging a soft toy helps us feel warm and safe!' }
  },
  {
    id: 'angry',
    emoji: '😡',
    name: { tr: 'Kızgın', en: 'Angry' },
    voicePhrase: { tr: 'Kızgın! İstediğimiz bir şey engellendiğinde veya haksızlık olunca öfkelenebiliriz!', en: 'Angry! Sometimes we feel mad or frustrated when things feel unfair!' },
    careTip: { tr: 'Kızgın olduğumuzda derin derin 3 kez nefes alıp sakinleşmeyi deneyebiliriz!', en: 'When angry, taking 3 deep slow breaths helps our heart and body calm down!' }
  },
  {
    id: 'surprised',
    emoji: '😲',
    name: { tr: 'Şaşırmış', en: 'Surprised' },
    voicePhrase: { tr: 'Şaşırmış! Beklemediğimiz harika sürprizlerle karşılaşınca gözlerimiz kocaman açılır!', en: 'Surprised! When we see a wonderful unexpected gift or magic trick, our eyes open wide!' },
    careTip: { tr: 'Yeni şeyler keşfetmek her gün bizi şaşırtıp heyecanlandırabilir!', en: 'Discovering brand new facts about our big beautiful world keeps us surprised!' }
  },
  {
    id: 'scared',
    emoji: '😨',
    name: { tr: 'Korkmuş', en: 'Scared' },
    voicePhrase: { tr: 'Korkmuş! Karanlıktan veya yüksek seslerden bazen korkabiliriz. Ama biz güvendeyiz!', en: 'Scared! Sometimes dark rooms or very loud thunders make us feel tiny and afraid. But you are always safe!' },
    careTip: { tr: 'Korktuğumuzda sevdiğimiz bir büyüğümüzün elini tutmak bize cesaret verir!', en: 'Holding a parent\'s hand or carrying a small nightlight helps us feel brave!' }
  },
  {
    id: 'sleepy',
    emoji: '😴',
    name: { tr: 'Uykulu', en: 'Sleepy' },
    voicePhrase: { tr: 'Uykulu! Gözlerim kapanıyor, esniyorum ve yumuşacık yatağımı özledim!', en: 'Sleepy! Yawning, eyes getting heavy, and looking forward to cozy blankets!' },
    careTip: { tr: 'Güzelce uyumak beynimizi büyütür ve bizi ertesi güne hazırlar!', en: 'Going to bed early helps our brain grow big and strong while we dream!' }
  }
];

interface Scenario {
  id: string;
  prompt: { tr: string; en: string };
  correctEmotionId: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'gift',
    prompt: {
      tr: 'Biri sana kocaman renkli bir oyuncak hediye ettiğinde ne hissedersin? 🎁',
      en: 'How would you feel if someone gave you a huge colorful toy gift? 🎁'
    },
    correctEmotionId: 'happy'
  },
  {
    id: 'pop',
    prompt: {
      tr: 'Çok sevdiğin balonun aniden pıt diye patladığında ne hissedersin? 🎈💥',
      en: 'How would you feel if your favorite colorful balloon suddenly popped? 🎈💥'
    },
    correctEmotionId: 'sad'
  },
  {
    id: 'toy_taken',
    prompt: {
      tr: 'Tam oynayacakken birisi oyuncağını elinden çekip aldığında ne hissedersin? 🧸😠',
      en: 'How would you feel if someone suddenly pulled away the toy you were playing with? 🧸😠'
    },
    correctEmotionId: 'angry'
  },
  {
    id: 'magic',
    prompt: {
      tr: 'Bir şapkadan birdenbire sevimli beyaz bir tavşan çıktığında ne hissedersin? 🎩🐰',
      en: 'How would you feel if a cute white bunny popped out of an empty top hat? 🎩🐰'
    },
    correctEmotionId: 'surprised'
  },
  {
    id: 'thunder',
    prompt: {
      tr: 'Dışarıda çok yüksek sesli şimşekler çaktığında ne hissedersin? ⚡⛈️',
      en: 'How would you feel if very loud thunders and lightning started outside? ⚡⛈️'
    },
    correctEmotionId: 'scared'
  }
];

interface EmotionsSectionProps {
  lang: Language;
  onEarnXp?: (amt: number) => void;
}

export default function EmotionsSection({ lang, onEarnXp }: EmotionsSectionProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion>(EMOTIONS[0]);
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [currentScenarioStep, setCurrentScenarioStep] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleEmotionTap = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    onEarnXp?.(20);

    const speakText = lang === 'tr' 
      ? `${emotion.name.tr}. ${emotion.voicePhrase.tr}` 
      : `${emotion.name.en}. ${emotion.voicePhrase.en}`;
    speak(speakText, lang);
  };

  const startQuiz = () => {
    setQuizActive(true);
    setCurrentScenarioStep(0);
    setQuizFeedback('');
    setIsCorrect(null);

    const question = lang === 'tr'
      ? SCENARIOS[0].prompt.tr
      : SCENARIOS[0].prompt.en;
    speak(question, lang);
  };

  const handleQuizAnswer = (emotion: Emotion) => {
    const currentScenario = SCENARIOS[currentScenarioStep];

    if (emotion.id === currentScenario.correctEmotionId) {
      setIsCorrect(true);
      setScore((s) => s + 1);
      onEarnXp?.(40);

      const feedback = lang === 'tr'
        ? `Evet, kesinlikle! Böyle bir durumda ${emotion.name.tr} hissetmek çok doğaldır! Aferin sana!`
        : `Yes, absolutely! It is very natural to feel ${emotion.name.en} in this situation! Well done!`;
      setQuizFeedback(feedback);
      speak(feedback, lang);

      // Go to next after a delay
      setTimeout(() => {
        if (currentScenarioStep < SCENARIOS.length - 1) {
          setCurrentScenarioStep(currentScenarioStep + 1);
          setIsCorrect(null);
          setQuizFeedback('');

          const nextQuestion = lang === 'tr'
            ? SCENARIOS[currentScenarioStep + 1].prompt.tr
            : SCENARIOS[currentScenarioStep + 1].prompt.en;
          speak(nextQuestion, lang);
        } else {
          // Finished
          const finishText = lang === 'tr'
            ? `Harika! Tüm duygusal durumları başarıyla tamamladın! Kendini çok iyi tanıyorsun!`
            : `Brilliant! You successfully completed the emotions game! You understand feelings so well!`;
          setQuizFeedback(finishText);
          speak(finishText, lang);
        }
      }, 3500);
    } else {
      setIsCorrect(false);
      const feedback = lang === 'tr'
        ? `Farklı hissedebilirsin tabii, ama genellikle bu durumda ${EMOTIONS.find(e => e.id === currentScenario.correctEmotionId)?.name.tr} hissederiz. Bir daha dene!`
        : `You might feel that way, but usually we would feel ${EMOTIONS.find(e => e.id === currentScenario.correctEmotionId)?.name.en}. Try again!`;
      setQuizFeedback(feedback);
      speak(feedback, lang);
    }
  };

  const exitQuiz = () => {
    setQuizActive(false);
    setCurrentScenarioStep(0);
    setIsCorrect(null);
    setQuizFeedback('');
  };

  return (
    <div className="space-y-6">
      
      {/* Introduction Header banner */}
      <div className="bg-orange-50 border-2 border-orange-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-bounce">😊</div>
          <div>
            <h2 className="text-lg font-black text-orange-950">
              {lang === 'tr' ? 'Duygularımızı Tanıyalım!' : 'Let\'s Meet Our Emotions!'}
            </h2>
            <p className="text-xs sm:text-sm text-orange-700 font-bold">
              {lang === 'tr' 
                ? 'Mutluluk, üzüntü veya heyecan gibi duyguların yüz ifadelerini tanı ve empati oyununu tamamla!' 
                : 'Recognize facial expressions for feelings like happiness, sadness, or excitement, and play the empathy game!'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!quizActive ? (
            <button
              onClick={startQuiz}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm rounded-full border-b-4 border-orange-700 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle size={16} />
              <span>{lang === 'tr' ? 'Duygu Bilmece Oyunu' : 'Empathy Scenario Game'}</span>
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

      {quizActive && (
        <div className="bg-white rounded-3xl p-5 border-4 border-dashed border-orange-300 text-center shadow-inner max-w-2xl mx-auto space-y-4">
          <div className="text-xs font-black text-orange-500 uppercase tracking-widest">
            {lang === 'tr' ? 'EMPATİ VE DUYGU BULMACA' : 'EMPATHY SCENARIO GAME'}
          </div>

          <h3 className="text-lg sm:text-xl font-black text-orange-950">
            🔍 {lang === 'tr' ? SCENARIOS[currentScenarioStep].prompt.tr : SCENARIOS[currentScenarioStep].prompt.en}
          </h3>

          <AnimatePresence mode="wait">
            {quizFeedback && (
              <motion.div
                key={quizFeedback}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`text-xs sm:text-sm font-black p-3.5 rounded-2xl border-2 inline-block max-w-md ${
                  isCorrect 
                    ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' 
                    : 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm'
                }`}
              >
                <span>{quizFeedback}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 text-xs font-black text-orange-700 pt-2 border-t border-orange-100">
            <span>🏆 {lang === 'tr' ? `Puan: ${score}` : `Score: ${score}`}</span>
            <span>•</span>
            <span>{lang === 'tr' ? `${currentScenarioStep + 1} / ${SCENARIOS.length} Soru` : `Question ${currentScenarioStep + 1} of ${SCENARIOS.length}`}</span>
          </div>
        </div>
      )}

      {/* Main Grid: Explorer vs Quiz responses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Emotions choices column */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border-2 border-orange-200 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {EMOTIONS.map((emotion) => {
              const isSelected = selectedEmotion.id === emotion.id;
              return (
                <button
                  key={emotion.id}
                  onClick={() => quizActive ? handleQuizAnswer(emotion) : handleEmotionTap(emotion)}
                  className={`p-5 rounded-2xl border-b-8 transition-all transform active:scale-95 flex flex-col items-center justify-center gap-3 text-center cursor-pointer ${
                    isSelected && !quizActive
                      ? 'bg-orange-400 border-orange-600 text-orange-950 font-black scale-[1.03] shadow-md'
                      : 'bg-orange-50/50 hover:bg-orange-50 border-orange-100 text-orange-800'
                  }`}
                >
                  <span className="text-6xl select-none filter drop-shadow-sm animate-pulse">{emotion.emoji}</span>
                  <span className="text-sm font-black text-orange-950">
                    {lang === 'tr' ? emotion.name.tr : emotion.name.en}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Informative description block */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {!quizActive ? (
              <motion.div
                key={selectedEmotion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl border-4 border-orange-300 p-6 flex flex-col justify-between h-full shadow-md min-h-[350px]"
              >
                <div>
                  <div className="flex justify-between items-center border-b border-orange-100 pb-3 mb-4 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl bg-orange-50 p-2.5 rounded-2xl border border-orange-200">{selectedEmotion.emoji}</span>
                      <div>
                        <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                          {lang === 'tr' ? 'BİR DUYGU' : 'FEELING COMPANION'}
                        </div>
                        <h3 className="text-xl font-black text-orange-950">
                          {lang === 'tr' ? selectedEmotion.name.tr : selectedEmotion.name.en}
                        </h3>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleEmotionTap(selectedEmotion)}
                      className="p-2.5 bg-orange-100 hover:bg-orange-200 text-orange-700 hover:scale-110 active:scale-95 rounded-full transition-all cursor-pointer"
                    >
                      <Volume2 size={18} className="stroke-[3px]" />
                    </button>
                  </div>

                  <div className="space-y-4 text-left">
                    {/* Emotion voice description */}
                    <p className="text-sm font-bold text-gray-700 leading-relaxed italic bg-orange-50/50 p-3 rounded-xl border border-orange-100/40">
                      "{lang === 'tr' ? selectedEmotion.voicePhrase.tr : selectedEmotion.voicePhrase.en}"
                    </p>

                    {/* Care Tip */}
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                      <span className="text-[10px] font-black text-amber-600 block uppercase tracking-wider mb-0.5">
                        💡 {lang === 'tr' ? 'DUYGU YÖNETİMİ' : 'FEELING MANAGEMENT'}
                      </span>
                      <p className="text-xs font-bold text-amber-900 leading-relaxed">
                        {lang === 'tr' ? selectedEmotion.careTip.tr : selectedEmotion.careTip.en}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-2xl border border-orange-100/70">
                  <Sparkles size={16} className="text-amber-500 animate-spin" />
                  <span className="text-xs font-black text-orange-950 uppercase tracking-wide">
                    {lang === 'tr' ? '+20 XP KAZANILDI!' : '+20 XP EARNED!'}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="bg-orange-50/50 rounded-3xl border-2 border-dashed border-orange-300/60 p-8 h-full flex flex-col items-center justify-center text-center text-orange-600 min-h-[350px]">
                <div className="text-6xl mb-4 animate-bounce">🎈</div>
                <h3 className="text-lg font-bold text-orange-950 mb-1">
                  {lang === 'tr' ? 'Empati Oyunundayız!' : 'Empathy Game is Active!'}
                </h3>
                <p className="text-xs sm:text-sm max-w-[240px]">
                  {lang === 'tr' 
                    ? 'Soldaki duygulardan, sorulan senaryoya en uygun yüz ifadesini seç!' 
                    : 'Choose the matching feeling expression on the left for the active scenario!'}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
