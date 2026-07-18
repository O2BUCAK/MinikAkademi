import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, HelpCircle, Check, Play, Award, Grid, HelpCircle as HelpIcon, Trophy, Gamepad2 } from 'lucide-react';
import { Language } from '../types';
import { speak } from '../utils/speak';

interface Animal {
  id: string;
  emoji: string;
  name: { tr: string; en: string };
  soundText: { tr: string; en: string };
  voicePhrase: { tr: string; en: string };
  funFact: { tr: string; en: string };
}

const ANIMALS: Animal[] = [
  {
    id: 'lion',
    emoji: '🦁',
    name: { tr: 'Aslan', en: 'Lion' },
    soundText: { tr: 'Roooar!', en: 'Roooar!' },
    voicePhrase: { tr: 'Kükrer! Ben ormanlar kralı aslanım! Roaar!', en: 'Roar! I am the lion, king of the jungle! Roaar!' },
    funFact: { tr: 'Aslanlar çok güçlüdür ve aileleriyle birlikte kocaman sürüler halinde yaşarlar!', en: 'Lions are super strong and live in big families called prides!' }
  },
  {
    id: 'cow',
    emoji: '🐮',
    name: { tr: 'İnek', en: 'Cow' },
    soundText: { tr: 'Möööö!', en: 'Mooow!' },
    voicePhrase: { tr: 'Mööö! Ben ineğim, taze yeşil otları yemeyi ve süt vermeyi çok severim!', en: 'Moo! I am the cow, I love eating fresh grass and making milk!' },
    funFact: { tr: 'İnekler günde bol bol su içer ve arkadaşlarıyla otlakta oynamayı severler!', en: 'Cows drink lots of fresh water and love playing with friends in the pasture!' }
  },
  {
    id: 'cat',
    emoji: '🐱',
    name: { tr: 'Kedi', en: 'Cat' },
    soundText: { tr: 'Miyavv!', en: 'Meow!' },
    voicePhrase: { tr: 'Miyav! Ben sevimli kediyim, yumuşacık tüylerim var, mır mır oyun oynarım!', en: 'Meow! I am the cute kitty, I have soft fur and I love playing with wool!' },
    funFact: { tr: 'Kediler çok temiz hayvanlardır, kendilerini yalayarak temizlerler ve uykuyu severler!', en: 'Cats are extremely clean animals, they wash themselves and love warm naps!' }
  },
  {
    id: 'dog',
    emoji: '🐶',
    name: { tr: 'Köpek', en: 'Dog' },
    soundText: { tr: 'Hav hav!', en: 'Woof woof!' },
    voicePhrase: { tr: 'Hav hav! Ben köpek, senin en sadık dostunum! Top koşturmayı çok severim!', en: 'Woof woof! I am the dog, your best loyal companion! I love fetching balls!' },
    funFact: { tr: 'Köpekler çok gelişmiş burunlarıyla kokuları uzaktan duyabilirler!', en: 'Dogs have super smelling noses and can detect scents from far away!' }
  },
  {
    id: 'frog',
    emoji: '🐸',
    name: { tr: 'Kurbağa', en: 'Frog' },
    soundText: { tr: 'Vırak vırak!', en: 'Ribbit ribbit!' },
    voicePhrase: { tr: 'Vırak vırak! Zıplayan yeşil kurbağayım! Göllerde gezerim!', en: 'Ribbit ribbit! I am the jumping green frog! I love splashing in lakes!' },
    funFact: { tr: 'Kurbağalar hem karada hem suda yaşayabilir ve dilleriyle sinekleri yakalarlar!', en: 'Frogs can live both on land and in water, and catch food with super-fast tongues!' }
  },
  {
    id: 'monkey',
    emoji: '🐵',
    name: { tr: 'Maymun', en: 'Monkey' },
    soundText: { tr: 'Uu aa aa!', en: 'Oo oo ah ah!' },
    voicePhrase: { tr: 'Uu aa aa! Ben neşeli maymun, muz yemeyi ve ağaçlarda sallanmayı çok severim!', en: 'Oo oo ah ah! I am the happy monkey, I love sweet bananas and swinging on tree branches!' },
    funFact: { tr: 'Maymunlar kuyruklarını tıpkı üçüncü bir el gibi kullanarak dengede dururlar!', en: 'Monkeys use their long tails almost like a third hand to hold onto tree branches!' }
  },
  {
    id: 'sheep',
    emoji: '🐑',
    name: { tr: 'Koyun', en: 'Sheep' },
    soundText: { tr: 'Me eee!', en: 'Baa baa!' },
    voicePhrase: { tr: 'Mee! Ben koyun, pofuduk yumuşak yünlerimle kırlarda koşarım!', en: 'Baa! I am the sheep, running in meadows with my fluffy warm wool!' },
    funFact: { tr: 'Koyunların yünlerinden kışın bizi sıcak tutan yumuşacık kazaklar yapılır!', en: 'Warm sweaters are crafted from fluffy sheep wool to keep us cozy in winter!' }
  },
  {
    id: 'duck',
    emoji: '🦆',
    name: { tr: 'Ördek', en: 'Duck' },
    soundText: { tr: 'Vak vak!', en: 'Quack quack!' },
    voicePhrase: { tr: 'Vak vak! Paytak paytak yürürüm, göllerde neşeyle yüzerim!', en: 'Quack quack! I waddle on land and swim happily in clean lakes!' },
    funFact: { tr: 'Ördeklerin tüyleri su geçirmezdir, bu yüzden suda hiç üşümeden yüzebilirler!', en: 'Ducks have waterproof feathers which let them swim in cold water without getting wet!' }
  }
];

interface AnimalsSectionProps {
  lang: Language;
  onEarnXp?: (amt: number) => void;
}

export default function AnimalsSection({ lang, onEarnXp }: AnimalsSectionProps) {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  
  // Voice Quiz state
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [targetAnimal, setTargetAnimal] = useState<Animal | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Matching Game state ("İsim ve Resim Eşleştirme")
  const [matchingGameActive, setMatchingGameActive] = useState<boolean>(false);
  const [leftNames, setLeftNames] = useState<{ id: string; name: string }[]>([]);
  const [rightEmojis, setRightEmojis] = useState<{ id: string; emoji: string }[]>([]);
  const [selectedNameId, setSelectedNameId] = useState<string | null>(null);
  const [selectedEmojiId, setSelectedEmojiId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]); // animal ids that are matched
  const [matchCount, setMatchCount] = useState<number>(0);
  const [showGameSuccess, setShowGameSuccess] = useState<boolean>(false);

  const handleAnimalTap = (animal: Animal) => {
    setSelectedAnimal(animal);
    onEarnXp?.(20);

    const speakText = lang === 'tr' 
      ? `${animal.name.tr}. Çıkardığı ses: ${animal.soundText.tr}. ${animal.voicePhrase.tr}` 
      : `${animal.name.en}. It goes: ${animal.soundText.en}. ${animal.voicePhrase.en}`;
    speak(speakText, lang);
  };

  // Voice quiz handlers
  const startQuiz = () => {
    setQuizActive(true);
    setMatchingGameActive(false);
    pickNewTarget();
  };

  const pickNewTarget = () => {
    const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setTargetAnimal(randomAnimal);
    setIsCorrect(null);
    setQuizFeedback('');

    const question = lang === 'tr'
      ? `Hangi sevimli dostumuz "${randomAnimal.soundText.tr}" diye ses çıkarır?`
      : `Which lovely animal friend goes "${randomAnimal.soundText.en}"?`;
    speak(question, lang);
  };

  const handleQuizAnswer = (animal: Animal) => {
    if (!targetAnimal) return;

    if (animal.id === targetAnimal.id) {
      setIsCorrect(true);
      setScore((s) => s + 1);
      onEarnXp?.(40);

      const successPraise = lang === 'tr'
        ? `Aferin! Harika iş! Evet, ${animal.name.tr} "${animal.soundText.tr}" der!`
        : `Brilliant! Great job! Yes, the ${animal.name.en} goes "${animal.soundText.en}"!`;
      setQuizFeedback(successPraise);
      speak(successPraise, lang);

      setTimeout(() => {
        pickNewTarget();
      }, 3000);
    } else {
      setIsCorrect(false);
      const feedback = lang === 'tr'
        ? `Bu ${animal.name.tr} ve o "${animal.soundText.tr}" sesi çıkarır. Başka bir tane seç!`
        : `That is the ${animal.name.en} and it goes "${animal.soundText.en}". Try another!`;
      setQuizFeedback(feedback);
      speak(feedback, lang);
    }
  };

  const exitQuiz = () => {
    setQuizActive(false);
    setTargetAnimal(null);
    setIsCorrect(null);
    setQuizFeedback('');
  };

  // Matching game handlers
  const startMatchingGame = () => {
    setMatchingGameActive(true);
    setQuizActive(false);
    setSelectedNameId(null);
    setSelectedEmojiId(null);
    setMatchedIds([]);
    setShowGameSuccess(false);

    // Pick 4 random animals
    const shuffled = [...ANIMALS].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    // Shuffle names for left side
    const names = shuffled.map(a => ({ id: a.id, name: lang === 'tr' ? a.name.tr : a.name.en }));
    const shuffledNames = [...names].sort(() => 0.5 - Math.random());
    setLeftNames(shuffledNames);

    // Shuffle emojis for right side
    const emojis = shuffled.map(a => ({ id: a.id, emoji: a.emoji }));
    const shuffledEmojis = [...emojis].sort(() => 0.5 - Math.random());
    setRightEmojis(shuffledEmojis);

    const greeting = lang === 'tr' 
      ? 'Hadi isimlerle resimleri eşleştirelim! Önce bir isme, sonra onun resmine dokun!'
      : 'Let\'s match names with pictures! Tap a name first, then tap its picture!';
    speak(greeting, lang);
  };

  const handleNameSelect = (id: string) => {
    if (matchedIds.includes(id)) return;
    
    // Toggle if clicked again
    if (selectedNameId === id) {
      setSelectedNameId(null);
      return;
    }

    setSelectedNameId(id);
    speak(leftNames.find(n => n.id === id)?.name || '', lang);

    // Check match if emoji was already selected
    if (selectedEmojiId) {
      checkMatch(id, selectedEmojiId);
    }
  };

  const handleEmojiSelect = (id: string, emoji: string) => {
    if (matchedIds.includes(id)) return;

    // Toggle if clicked again
    if (selectedEmojiId === id) {
      setSelectedEmojiId(null);
      return;
    }

    setSelectedEmojiId(id);
    speak(lang === 'tr' ? 'Seçildi' : 'Selected', lang);

    // Check match if name was already selected
    if (selectedNameId) {
      checkMatch(selectedNameId, id);
    }
  };

  const checkMatch = (nameId: string, emojiId: string) => {
    if (nameId === emojiId) {
      // SUCCESS MATCH!
      const currentMatched = [...matchedIds, nameId];
      setMatchedIds(currentMatched);
      setSelectedNameId(null);
      setSelectedEmojiId(null);
      onEarnXp?.(30);

      const animalName = ANIMALS.find(a => a.id === nameId)?.name[lang] || '';
      const phrase = lang === 'tr'
        ? `Süper! Doğru eşleşme: ${animalName}! 🌟`
        : `Great! Correct match: ${animalName}! 🌟`;
      speak(phrase, lang);

      // Check if game is completed
      if (currentMatched.length === 4) {
        setMatchCount(c => c + 1);
        onEarnXp?.(100); // 100 XP bonus for completing!
        setTimeout(() => {
          setShowGameSuccess(true);
          const successPhrase = lang === 'tr'
            ? 'Tebrikler! Bütün hayvanları başarıyla eşleştirdin! Harika bir iş çıkardın! 🏆'
            : 'Congratulations! You matched all animals successfully! Brilliant job! 🏆';
          speak(successPhrase, lang);
        }, 1000);
      }
    } else {
      // FAIL MATCH!
      speak(lang === 'tr' ? 'Tekrar dene!' : 'Try again!', lang);
      setSelectedNameId(null);
      setSelectedEmojiId(null);
    }
  };

  const exitMatchingGame = () => {
    setMatchingGameActive(false);
    setSelectedNameId(null);
    setSelectedEmojiId(null);
    setMatchedIds([]);
    setShowGameSuccess(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-pink-100 border-2 border-pink-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-bounce">🦁</div>
          <div>
            <h2 className="text-lg font-black text-pink-900">
              {lang === 'tr' ? 'Sevimli Hayvan Dostlarımız!' : 'Our Lovely Animal Friends!'}
            </h2>
            <p className="text-xs sm:text-sm text-pink-700 font-bold">
              {lang === 'tr' 
                ? 'Hayvanlara dokun, çıkardıkları sesleri, özellikleri öğren ve eğlenceli oyunlar oyna!' 
                : 'Tap animals to hear their happy voices, discover cool features, and play fun matching games!'}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {!quizActive && !matchingGameActive ? (
            <>
              <button
                onClick={startQuiz}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-black text-xs sm:text-sm rounded-full border-b-4 border-pink-700 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <HelpCircle size={16} />
                <span>{lang === 'tr' ? 'Ses Bulmaca Oyunu' : 'Animal Voice Quiz'}</span>
              </button>
              <button
                onClick={startMatchingGame}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-black text-xs sm:text-sm rounded-full border-b-4 border-purple-700 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Gamepad2 size={16} />
                <span>{lang === 'tr' ? 'Eşleştirme Oyunu' : 'Matching Game'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => { exitQuiz(); exitMatchingGame(); }}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs sm:text-sm rounded-full border-b-4 border-red-700 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>🚪</span>
              <span>{lang === 'tr' ? 'Keşfe Geri Dön' : 'Back to Explorer'}</span>
            </button>
          )}
        </div>
      </div>

      {/* MATCHING GAME INTERFACE ("İsim ve Resim Eşleştirme") */}
      {matchingGameActive && (
        <div className="bg-white rounded-3xl p-6 border-4 border-dashed border-purple-300 shadow-md relative overflow-hidden">
          {showGameSuccess ? (
            <div className="text-center py-8 flex flex-col items-center justify-center">
              <span className="text-6xl md:text-7xl mb-4 animate-bounce">🏆</span>
              <h3 className="text-2xl md:text-3xl font-black text-purple-950">
                {lang === 'tr' ? 'Harika Eşleştirme!' : 'Brilliant Match!'}
              </h3>
              <p className="text-sm font-bold text-purple-700 mt-2 bg-purple-50 px-4 py-2 rounded-xl">
                {lang === 'tr' ? 'Tüm sevimli dostlarımızı başarıyla isimleriyle eşleştirdin!' : 'You matched all our lovely animal friends with their correct names!'}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={startMatchingGame}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-black rounded-full border-b-6 border-purple-700 shadow-md transition-all active:scale-95"
                >
                  🔄 {lang === 'tr' ? 'Tekrar Oyna' : 'Play Again'}
                </button>
                <button
                  onClick={exitMatchingGame}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-full border border-gray-300"
                >
                  🚪 {lang === 'tr' ? 'Keşfet' : 'Explorer'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <span className="text-xs font-black text-purple-500 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                  {lang === 'tr' ? 'İSİM VE RESİM EŞLEŞTİRME' : 'NAME & PICTURE MATCHING'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-purple-950 mt-2">
                  {lang === 'tr' ? 'İsim Kartı Seç ve Onun Resmine Dokun!' : 'Select a Name Card, then Tap its Picture!'}
                </h3>
              </div>

              {/* Game Board Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto my-4 items-stretch">
                
                {/* Left Column: Names */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider text-center">
                    {lang === 'tr' ? 'İSİMLER' : 'NAMES'}
                  </h4>
                  {leftNames.map((item) => {
                    const isMatched = matchedIds.includes(item.id);
                    const isSelected = selectedNameId === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNameSelect(item.id)}
                        disabled={isMatched}
                        className={`w-full p-4 rounded-2xl border-2 text-center font-black text-base transition-all transform active:scale-95 cursor-pointer ${
                          isMatched
                            ? 'bg-green-100 border-green-300 text-green-700 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-purple-400 border-purple-600 text-purple-950 scale-[1.03] ring-4 ring-purple-200'
                            : 'bg-purple-50/50 hover:bg-purple-50 border-purple-200 text-purple-900'
                        }`}
                      >
                        <div className="flex items-center justify-between px-2">
                          <span>📝</span>
                          <span>{item.name}</span>
                          <span>{isMatched ? '✅' : isSelected ? '⭐' : ''}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right Column: Emojis */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider text-center">
                    {lang === 'tr' ? 'RESİMLER' : 'PICTURES'}
                  </h4>
                  {rightEmojis.map((item) => {
                    const isMatched = matchedIds.includes(item.id);
                    const isSelected = selectedEmojiId === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleEmojiSelect(item.id, item.emoji)}
                        disabled={isMatched}
                        className={`w-full p-4 rounded-2xl border-2 text-center transition-all transform active:scale-95 cursor-pointer ${
                          isMatched
                            ? 'bg-green-100 border-green-300 text-green-700 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-purple-400 border-purple-600 scale-[1.03] ring-4 ring-purple-200'
                            : 'bg-purple-50/50 hover:bg-purple-50 border-purple-200'
                        }`}
                      >
                        <div className="flex items-center justify-between px-2">
                          <span>🐾</span>
                          <span className="text-4xl select-none">{item.emoji}</span>
                          <span>{isMatched ? '✅' : isSelected ? '⭐' : ''}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Stats Footer of matching board */}
              <div className="mt-8 pt-4 border-t border-purple-100 flex items-center justify-between text-xs font-black text-purple-600">
                <span>🏆 {lang === 'tr' ? `Tamamlanan Seriler: ${matchCount}` : `Sets Solved: ${matchCount}`}</span>
                <span>⭐ {lang === 'tr' ? `Uyumlar: ${matchedIds.length} / 4` : `Matches: ${matchedIds.length} / 4`}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VOICE QUIZ INTERFACE */}
      {quizActive && targetAnimal && (
        <div className="bg-white rounded-3xl p-5 border-4 border-dashed border-pink-300 text-center shadow-inner relative overflow-hidden">
          <div className="text-xs font-black text-pink-500 uppercase tracking-widest mb-1">
            {lang === 'tr' ? 'HAYVAN SESİNİ BUL' : 'GUESS THE ANIMAL VOICE'}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-pink-950 flex flex-col items-center justify-center gap-1">
            <span className="text-4xl text-pink-500 font-extrabold animate-pulse">📢 "{targetAnimal.soundText[lang]}"</span>
            <span className="text-sm text-gray-500 mt-2">
              {lang === 'tr' ? 'Bu ses hangi hayvana ait? Aşağıdan doğru hayvanın üzerine dokun!' : 'Whose voice is this? Tap the matching animal below!'}
            </span>
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
            <span className="text-xs font-black text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200 flex items-center gap-1">
              <Award size={14} />
              {lang === 'tr' ? `Doğru: ${score}` : `Score: ${score}`}
            </span>
          </div>
        </div>
      )}

      {/* Main Grid display of animals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Animals Catalog Grid */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border-2 border-pink-200 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ANIMALS.map((animal) => {
              const isSelected = selectedAnimal?.id === animal.id && !quizActive && !matchingGameActive;
              return (
                <button
                  key={animal.id}
                  onClick={() => {
                    if (quizActive) {
                      handleQuizAnswer(animal);
                    } else if (matchingGameActive) {
                      // in matching mode we ignore clicks in catalog
                    } else {
                      handleAnimalTap(animal);
                    }
                  }}
                  className={`p-4 rounded-2xl transition-all border-b-8 transform active:scale-95 flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-pink-400 border-pink-600 text-pink-950 scale-105 shadow-md font-black'
                      : 'bg-pink-50/50 hover:bg-pink-50 border-pink-100 text-pink-800 hover:border-pink-300'
                  }`}
                >
                  <span className="text-5xl select-none filter drop-shadow-sm transition-transform hover:scale-110">{animal.emoji}</span>
                  <span className="text-sm font-extrabold text-pink-950">
                    {lang === 'tr' ? animal.name.tr : animal.name.en}
                  </span>
                  <span className="text-[10px] font-bold text-pink-600 bg-pink-100/50 px-2.5 py-0.5 rounded-full border border-pink-100">
                    {animal.soundText[lang]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Animal card details */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {selectedAnimal && !quizActive && !matchingGameActive ? (
              <motion.div
                key={selectedAnimal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border-4 border-pink-300 p-6 flex flex-col justify-between h-full shadow-md min-h-[350px]"
              >
                <div>
                  <div className="flex justify-between items-center border-b border-pink-100 pb-3 mb-4 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl bg-pink-50 p-2.5 rounded-2xl border border-pink-200">{selectedAnimal.emoji}</span>
                      <div>
                        <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest">
                          {lang === 'tr' ? 'HAYVAN DETAYI' : 'ANIMAL FRIEND'}
                        </div>
                        <h3 className="text-xl font-black text-pink-950">
                          {lang === 'tr' ? selectedAnimal.name.tr : selectedAnimal.name.en}
                        </h3>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleAnimalTap(selectedAnimal)}
                      className="p-2.5 bg-pink-100 hover:bg-pink-200 text-pink-700 hover:scale-110 active:scale-95 rounded-full transition-all cursor-pointer"
                    >
                      <Volume2 size={18} className="stroke-[3px]" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Animal Voice card */}
                    <div className="p-4 bg-pink-50/60 rounded-2xl border-2 border-pink-100">
                      <h4 className="text-xs font-black text-pink-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span>🔊</span>
                        <span>{lang === 'tr' ? 'NASIL SES ÇIKARIR?' : 'ANIMAL SOUND'}</span>
                      </h4>
                      <p className="text-base font-black text-pink-950 italic">
                        "{selectedAnimal.soundText[lang]}"
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-bold">
                        {lang === 'tr' ? selectedAnimal.voicePhrase.tr : selectedAnimal.voicePhrase.en}
                      </p>
                    </div>

                    {/* Animal Fun Fact card */}
                    <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-100">
                      <h4 className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1">
                        {lang === 'tr' ? 'EĞLENCELİ BİLGİ' : 'FUN FACT'}
                      </h4>
                      <p className="text-xs sm:text-sm font-bold text-amber-900 leading-relaxed">
                        {lang === 'tr' ? selectedAnimal.funFact.tr : selectedAnimal.funFact.en}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-50 to-amber-50 p-3 rounded-2xl border border-pink-100/70">
                  <Sparkles size={16} className="text-amber-500 animate-spin" />
                  <span className="text-xs font-black text-pink-950 uppercase tracking-wide">
                    {lang === 'tr' ? '+20 XP KAZANILDI!' : '+20 XP EARNED!'}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="bg-pink-50/50 rounded-3xl border-2 border-dashed border-pink-300/60 p-8 h-full flex flex-col items-center justify-center text-center text-pink-600 min-h-[350px]">
                <div className="text-6xl mb-4 animate-bounce">🐶</div>
                <h3 className="text-lg font-bold text-pink-950 mb-1">
                  {lang === 'tr' ? 'Hayvanları Dinle!' : 'Listen to Animals!'}
                </h3>
                <p className="text-xs sm:text-sm max-w-[240px]">
                  {lang === 'tr' 
                    ? 'Soldaki sevimli dostlarımızdan birine dokunarak çıkardıkları neşeli sesleri öğren!' 
                    : 'Tap any lovely animal friend on the left to learn their realistic sound and fun features!'}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
