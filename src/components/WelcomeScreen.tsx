import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Volume2, VolumeX, Trophy, Play, Star, Heart, LogIn, LogOut, UserCheck } from 'lucide-react';
import { Language } from '../types';
import { speak } from '../utils/speak';
import { User } from 'firebase/auth';

interface WelcomeScreenProps {
  lang: Language;
  soundEnabled: boolean;
  onLanguageChange: (newLang: Language) => void;
  onToggleSound: () => void;
  onStartLearning: (selectedSubject: string) => void;
  xp: number;
  user: User | null;
  authLoading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenParentControl: () => void;
  playtimeLimit: number;
}

interface Companion {
  emoji: string;
  nameTr: string;
  nameEn: string;
  soundTr: string;
  soundEn: string;
  colorClass: string;
  bgClass: string;
}

const COMPANIONS: Companion[] = [
  {
    emoji: '🦅',
    nameTr: 'Kartal Kaan',
    nameEn: 'Kaan the Eagle',
    soundTr: 'Göklerde süzülelim! Ben Kartal Kaan, seninle öğrenmeye hazırım!',
    soundEn: 'Fly high! I am Kaan the Eagle, ready to learn with you!',
    colorClass: 'text-sky-500 border-sky-400',
    bgClass: 'bg-sky-100 hover:bg-sky-200',
  },
  {
    emoji: '🦁',
    nameTr: 'Aslan Leo',
    nameEn: 'Leo the Lion',
    soundTr: 'Kükre! Ben Leo, seninle öğrenmeye hazırım!',
    soundEn: 'Roar! I am Leo, ready to learn with you!',
    colorClass: 'text-orange-500 border-orange-400',
    bgClass: 'bg-orange-100 hover:bg-orange-200',
  },
  {
    emoji: '🦖',
    nameTr: 'Dino T-Rex',
    nameEn: 'Rexy the Dino',
    soundTr: 'Hrr! Hadi birlikte harfleri çizelim!',
    soundEn: 'Rawr! Let\'s draw letters together!',
    colorClass: 'text-green-500 border-green-400',
    bgClass: 'bg-green-100 hover:bg-green-200',
  },
  {
    emoji: '🧸',
    nameTr: 'Ayıcık Bobo',
    nameEn: 'Bobo the Bear',
    soundTr: 'Merhaba! Ben Bobo, sayıları birlikte sayalım mı?',
    soundEn: 'Hello! I am Bobo, shall we count numbers together?',
    colorClass: 'text-amber-600 border-amber-400',
    bgClass: 'bg-amber-100 hover:bg-amber-200',
  },
  {
    emoji: '🦄',
    nameTr: 'Tekboynuz Luna',
    nameEn: 'Luna the Unicorn',
    soundTr: 'Şak şak! Ben Luna, en sevdiğin renk hangisi?',
    soundEn: 'Sparkle! I am Luna, what is your favorite color?',
    colorClass: 'text-pink-500 border-pink-400',
    bgClass: 'bg-pink-100 hover:bg-pink-200',
  },
];

export default function WelcomeScreen({
  lang,
  soundEnabled,
  onLanguageChange,
  onToggleSound,
  onStartLearning,
  xp,
  user,
  authLoading,
  onSignIn,
  onSignOut,
  onOpenParentControl,
  playtimeLimit,
}: WelcomeScreenProps) {
  const [selectedCompanion, setSelectedCompanion] = useState<number>(0);
  const [companionAnimTrigger, setCompanionAnimTrigger] = useState<boolean>(false);

  const activeCompanion = COMPANIONS[selectedCompanion];

  const handleCompanionSelect = (index: number) => {
    setSelectedCompanion(index);
    setCompanionAnimTrigger(true);
    setTimeout(() => setCompanionAnimTrigger(false), 500);

    if (soundEnabled) {
      const intro = lang === 'tr' ? COMPANIONS[index].soundTr : COMPANIONS[index].soundEn;
      speak(intro, lang);
    }
  };

  const handleStartWithVoice = (subject: string) => {
    if (soundEnabled) {
      const goText = lang === 'tr' 
        ? 'Eğitim başlıyor! Harika bir macera bizi bekliyor!' 
        : 'Learning is starting! A wonderful adventure awaits us!';
      speak(goText, lang);
    }
    onStartLearning(subject);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-12 select-none">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/50 p-4 rounded-3xl border border-orange-100 shadow-sm">
        {/* Left Side: Kid Level Badge & Welcome back */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-yellow-400 text-yellow-950 font-black px-4 py-2 rounded-full border-b-4 border-yellow-600 shadow-sm">
            <Trophy size={18} className="animate-bounce" />
            <span className="text-xs sm:text-sm uppercase tracking-wider">
              {lang === 'tr' ? `MİNİK KAHRAMAN • ${xp} XP` : `LITTLE HERO • ${xp} XP`}
            </span>
          </div>

          {user && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-extrabold text-orange-950 italic">
              <span>👋</span>
              <span>{lang === 'tr' ? `Hoş geldin, ${user.displayName}!` : `Welcome, ${user.displayName}!`}</span>
            </div>
          )}
        </div>

        {/* Global Sound, Language & Parent Login controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Parental Login status badge */}
          {user ? (
            <div className="flex items-center gap-2 bg-emerald-500 text-white font-black px-3.5 py-1.5 rounded-full border-b-4 border-emerald-700 shadow-sm text-xs cursor-default">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full border border-white" referrerPolicy="no-referrer" />
              ) : (
                <UserCheck size={14} />
              )}
              <span className="max-w-[100px] truncate">{user.displayName?.split(' ')[0]}</span>
              <button 
                onClick={onSignOut} 
                className="ml-1 bg-emerald-600 hover:bg-emerald-700 p-1 rounded-full cursor-pointer transition-colors flex items-center justify-center"
                title={lang === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
              >
                <LogOut size={11} />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              disabled={authLoading}
              className="flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50 font-bold px-3.5 py-1.5 rounded-full border-2 border-orange-200 active:translate-y-0.5 transition-all text-xs cursor-pointer shadow-sm"
              title={lang === 'tr' ? 'Velimle Giriş Yap' : 'Sign In with Google'}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-7.989s3.529-7.989 7.859-7.989c2.47 0 4.12 1.023 5.07 1.926l3.24-3.119C18.3 1.932 15.54 1 12.24 1 5.922 1 12.24s4.922 11.24 11.24 11.24c6.6 0 11-4.64 11-11.24 0-.756-.08-1.334-.18-1.956H12.24z"/>
              </svg>
              <span>{authLoading ? '...' : (lang === 'tr' ? 'Veli Girişi' : 'Parent Sign-In')}</span>
            </button>
          )}

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleSound}
            className={`w-10 h-10 rounded-full border-2 transition-all active:scale-95 shadow-sm flex items-center justify-center cursor-pointer ${
              soundEnabled 
                ? 'bg-orange-50 border-orange-200 text-orange-600' 
                : 'bg-gray-100 border-gray-200 text-gray-400'
            }`}
            title={soundEnabled ? 'Sesi Kapat / Mute' : 'Sesi Aç / Unmute'}
          >
            {soundEnabled ? <Volume2 size={18} className="stroke-[3px]" /> : <VolumeX size={18} className="stroke-[3px]" />}
          </button>

          {/* Language Selection Toggle */}
          <div className="flex bg-white p-1 rounded-full border-2 border-orange-200 shadow-sm">
            <button
              onClick={() => onLanguageChange('tr')}
              className={`px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                lang === 'tr' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-orange-600 hover:text-orange-800'
              }`}
            >
              Türkçe
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                lang === 'en' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-orange-600 hover:text-orange-800'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-white rounded-3xl border-4 border-orange-200 p-6 md:p-10 shadow-lg text-center relative overflow-hidden mb-8">
        {/* Background Sparkle Emojis */}
        <div className="absolute top-4 left-6 text-3xl animate-pulse opacity-50">🎈</div>
        <div className="absolute top-8 right-8 text-3xl animate-bounce opacity-50">✨</div>
        <div className="absolute bottom-4 left-8 text-3xl animate-bounce opacity-40">🎨</div>
        <div className="absolute bottom-6 right-10 text-3xl animate-pulse opacity-50">🧩</div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          {/* Main Giant Mascot display with bounce */}
          <div className="inline-block relative mb-4">
            <motion.div
              animate={companionAnimTrigger ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : { y: [0, -10, 0] }}
              transition={companionAnimTrigger ? { duration: 0.5 } : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-8xl sm:text-9xl cursor-pointer select-none filter drop-shadow-md"
              onClick={() => handleCompanionSelect(selectedCompanion)}
            >
              {activeCompanion.emoji}
            </motion.div>
            <span className="absolute -bottom-1 -right-2 text-3xl sm:text-4xl animate-pulse">👑</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-orange-600 tracking-tight italic uppercase mb-2">
            {lang === 'tr' ? 'MİNİK AKADEMİ' : 'LITTLE ACADEMY'}
          </h1>
          
          <p className="text-sm sm:text-lg font-extrabold text-orange-900/80 max-w-lg mx-auto leading-relaxed mb-6">
            {lang === 'tr' 
              ? `${activeCompanion.nameTr} ile eğlenceli ve renkli bir öğrenme yolculuğuna çıkmaya hazır mısın?`
              : `Are you ready to embark on a fun and colorful learning journey with ${activeCompanion.nameEn}?`}
          </p>

          {/* Big Cartoon Button to start general portal */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => handleStartWithVoice('alphabet')}
              className="py-4 px-10 bg-orange-500 hover:bg-orange-600 active:translate-y-1 active:border-b-4 text-white font-black rounded-3xl border-b-8 border-orange-700 shadow-xl text-lg sm:text-2xl transition-all cursor-pointer flex items-center gap-3 animate-pulse"
            >
              <Play className="fill-white stroke-[3px]" size={24} />
              <span>{lang === 'tr' ? 'EĞİTİME BAŞLA! ➔' : 'START LEARNING! ➔'}</span>
            </button>
          </div>

          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest flex items-center justify-center gap-1">
            <Star size={14} className="fill-orange-400 stroke-none" />
            {lang === 'tr' ? 'Harfler, Çizim, Sayılar ve Renkler Seni Bekliyor!' : 'Letters, Writing, Numbers and Colors Await You!'}
            <Star size={14} className="fill-orange-400 stroke-none" />
          </p>
        </motion.div>
      </div>

      {/* Subject Selections & Mascot Chooser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Select your companion (Left Grid Column) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border-2 border-orange-200 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-orange-950 mb-1 flex items-center gap-2">
              <span>🧸</span>
              <span>{lang === 'tr' ? 'Öğrenme Arkadaşını Seç' : 'Choose Your Companion'}</span>
            </h3>
            <p className="text-xs font-bold text-gray-500 mb-4">
              {lang === 'tr' ? 'Dilediğin arkadaşına dokunarak onun sesini duy!' : 'Tap on any friend to hear their playful voice greeting!'}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {COMPANIONS.map((companion, idx) => {
                const isSelected = selectedCompanion === idx;
                return (
                  <button
                    key={companion.emoji}
                    onClick={() => handleCompanionSelect(idx)}
                    className={`p-4 rounded-2xl border-2 transition-all active:scale-95 flex flex-col items-center text-center gap-2 relative cursor-pointer ${
                      isSelected 
                        ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-300 scale-105 shadow-md' 
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl select-none">{companion.emoji}</span>
                    <span className="text-xs sm:text-sm font-black text-gray-800">
                      {lang === 'tr' ? companion.nameTr : companion.nameEn}
                    </span>
                    {isSelected && (
                      <span className="absolute top-2 right-2 text-sm bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center border border-yellow-600 text-yellow-950 font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎈</span>
            <p className="text-xs font-extrabold text-orange-800 italic">
              {lang === 'tr' 
                ? `Mevcut Arkadaşın: ${activeCompanion.nameTr}! Seninle oyun oynamayı çok seviyor.` 
                : `Current Friend: ${activeCompanion.nameEn}! They love playing games with you.`}
            </p>
          </div>

          <div className="mt-4 p-4 bg-sky-50 rounded-2xl border border-sky-100 flex flex-col gap-3.5">
            <h4 className="text-xs font-extrabold text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
              <span>🛡️</span>
              <span>{lang === 'tr' ? 'Veli Kontrol Paneli & Giriş' : 'Parent Control & Login'}</span>
            </h4>
            <p className="text-[11px] font-bold text-sky-900 leading-normal">
              {lang === 'tr' 
                ? 'Miniğin kazandığı XP skorlarını bulutta güvenle kaydetmek ve tüm cihazlarda senkronize etmek için Google ile giriş yapabilirsiniz.'
                : 'Sign in with Google to save your child\'s XP progress in the cloud and sync their learning journey across devices.'}
            </p>
            {user ? (
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-sky-200">
                <div className="flex items-center gap-2">
                  {user.photoURL && (
                    <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                  )}
                  <span className="text-xs font-black text-gray-800">{user.displayName}</span>
                </div>
                <button 
                  onClick={onSignOut} 
                  className="text-xs font-extrabold text-red-500 hover:text-red-700 cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <LogOut size={12} />
                  {lang === 'tr' ? 'Çıkış' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <button 
                onClick={onSignIn} 
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-sky-100/50 text-sky-950 font-extrabold px-3 py-2.5 rounded-xl border border-sky-200 transition-all text-xs cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-7.989s3.529-7.989 7.859-7.989c2.47 0 4.12 1.023 5.07 1.926l3.24-3.119C18.3 1.932 15.54 1 12.24 1 5.922 1 12.24s4.922 11.24 11.24 11.24c6.6 0 11-4.64 11-11.24 0-.756-.08-1.334-.18-1.956H12.24z"/>
                </svg>
                <span>{authLoading ? '...' : (lang === 'tr' ? 'Google ile Veli Girişi Yap' : 'Parent Sign-In with Google')}</span>
              </button>
            )}

            {/* Playtime Limit Status & Action Button */}
            <div className="border-t border-sky-200/60 pt-3 mt-1 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-sky-900">{lang === 'tr' ? '⏱️ Günlük Oyun Süresi:' : '⏱️ Daily Playtime Limit:'}</span>
                <span className="font-black bg-sky-200/75 text-sky-950 px-2.5 py-0.5 rounded-full text-[11px]">
                  {playtimeLimit === 0 
                    ? (lang === 'tr' ? 'Sınırsız' : 'Unlimited') 
                    : (lang === 'tr' ? `${playtimeLimit} Dakika` : `${playtimeLimit} Minutes`)}
                </span>
              </div>
              <button
                onClick={onOpenParentControl}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-xl text-xs uppercase tracking-wide shadow-sm border-b-2 border-orange-700 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🛡️</span>
                <span>{lang === 'tr' ? 'Oyun Süresi ve Şifreyi Ayarla' : 'Set Playtime & Passcode'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Topics & Subject cards (Right Grid Column) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border-2 border-orange-200 shadow-md">
          <h3 className="text-lg font-black text-orange-950 mb-1 flex items-center gap-2">
            <span>📚</span>
            <span>{lang === 'tr' ? 'Eğitim Bölümleri' : 'Learning Subjects'}</span>
          </h3>
          <p className="text-xs font-bold text-gray-500 mb-6">
            {lang === 'tr' ? 'Öğrenmek istediğin bölümü doğrudan seçerek başlayabilirsin!' : 'You can jump directly into any category below!'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            
            {/* Subject 1: Alphabet */}
            <div 
              onClick={() => handleStartWithVoice('alphabet')}
              className="group bg-pink-50 hover:bg-pink-100/75 border-2 border-pink-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
            >
              <span className="text-3xl bg-white p-2 rounded-xl border border-pink-200 group-hover:scale-110 transition-transform">🔠</span>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-pink-900">
                  {lang === 'tr' ? 'Alfabe ve Kelimeler' : 'Alphabet & Words'}
                </h4>
                <p className="text-[10px] text-pink-700 font-bold leading-tight">
                  {lang === 'tr' ? 'Harfleri dinle ve nesneleri gör' : 'Hear letters and discover matching words'}
                </p>
              </div>
            </div>

            {/* Subject 2: Interactive Writing */}
            <div 
              onClick={() => handleStartWithVoice('writing')}
              className="group bg-purple-50 hover:bg-purple-100/75 border-2 border-purple-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
            >
              <span className="text-3xl bg-white p-2 rounded-xl border border-purple-200 group-hover:scale-110 transition-transform">✍️</span>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-purple-900">
                  {lang === 'tr' ? 'Harf Çizim Defteri' : 'Letter Writing Board'}
                </h4>
                <p className="text-[10px] text-purple-700 font-bold leading-tight">
                  {lang === 'tr' ? 'Harf şablonlarını parmağınla çiz' : 'Trace alphabet templates on the canvas'}
                </p>
              </div>
            </div>

            {/* Subject 3: Numbers */}
            <div 
              onClick={() => handleStartWithVoice('numbers')}
              className="group bg-blue-50 hover:bg-blue-100/75 border-2 border-blue-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
            >
              <span className="text-3xl bg-white p-2 rounded-xl border border-blue-200 group-hover:scale-110 transition-transform">🔢</span>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-blue-900">
                  {lang === 'tr' ? 'Sayıları Sayma Oyunu' : 'Counting Balloons'}
                </h4>
                <p className="text-[10px] text-blue-700 font-bold leading-tight">
                  {lang === 'tr' ? 'Balon patlatarak saymayı öğren' : 'Tap bubble balloons to learn counting'}
                </p>
              </div>
            </div>

            {/* Subject 4: Colors */}
            <div 
              onClick={() => handleStartWithVoice('colors')}
              className="group bg-green-50 hover:bg-green-100/75 border-2 border-green-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
            >
              <span className="text-3xl bg-white p-2 rounded-xl border border-green-200 group-hover:scale-110 transition-transform">🎨</span>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-green-900">
                  {lang === 'tr' ? 'Renk Keşif Balonları' : 'Color Discovery'}
                </h4>
                <p className="text-[10px] text-green-700 font-bold leading-tight">
                  {lang === 'tr' ? 'Renkleri ve eşleşen nesneleri incele' : 'Pop balloons to see colored items'}
                </p>
              </div>
            </div>

            {/* Subject 5: Animals */}
            <div 
              onClick={() => handleStartWithVoice('animals')}
              className="group bg-amber-50 hover:bg-amber-100/75 border-2 border-amber-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
            >
              <span className="text-3xl bg-white p-2 rounded-xl border border-amber-200 group-hover:scale-110 transition-transform">🦁</span>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-amber-900">
                  {lang === 'tr' ? 'Hayvanlar ve Sesleri' : 'Animals & Sounds'}
                </h4>
                <p className="text-[10px] text-amber-700 font-bold leading-tight">
                  {lang === 'tr' ? 'Hayvan seslerini dinle ve tahmin et' : 'Hear realistic voices & guess sounds'}
                </p>
              </div>
            </div>

            {/* Subject 6: Body Parts */}
            <div 
              onClick={() => handleStartWithVoice('body_parts')}
              className="group bg-rose-50 hover:bg-rose-100/75 border-2 border-rose-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
            >
              <span className="text-3xl bg-white p-2 rounded-xl border border-rose-200 group-hover:scale-110 transition-transform">🙋‍♀️</span>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-rose-900">
                  {lang === 'tr' ? 'Vücudun Bölümleri' : 'Body Parts Discovery'}
                </h4>
                <p className="text-[10px] text-rose-700 font-bold leading-tight">
                  {lang === 'tr' ? 'Baş, göz, el ve ayaklarımızı tanı' : 'Interactive head, hands, and feet quiz'}
                </p>
              </div>
            </div>

            {/* Subject 7: Opposites */}
            <div 
              onClick={() => handleStartWithVoice('opposites')}
              className="group bg-sky-50 hover:bg-sky-100/75 border-2 border-sky-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
            >
              <span className="text-3xl bg-white p-2 rounded-xl border border-sky-200 group-hover:scale-110 transition-transform">⚖️</span>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-sky-900">
                  {lang === 'tr' ? 'Zıt Kavramlar' : 'Learn Opposites'}
                </h4>
                <p className="text-[10px] text-sky-700 font-bold leading-tight">
                  {lang === 'tr' ? 'Büyük-küçük, sıcak-soğuk kelimeleri' : 'Match words that are exact opposites'}
                </p>
              </div>
            </div>

            {/* Subject 8: Daily Routines */}
            <div 
              onClick={() => handleStartWithVoice('routines')}
              className="group bg-indigo-50 hover:bg-indigo-100/75 border-2 border-indigo-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
            >
              <span className="text-3xl bg-white p-2 rounded-xl border border-indigo-200 group-hover:scale-110 transition-transform">⏰</span>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-indigo-900">
                  {lang === 'tr' ? 'Günlük Rutinler' : 'Daily Routines'}
                </h4>
                <p className="text-[10px] text-indigo-700 font-bold leading-tight">
                  {lang === 'tr' ? 'Yemek yeme, diş fırçalama, uyku' : 'Healthy self-care habits story timeline'}
                </p>
              </div>
            </div>

            {/* Subject 9: Nature */}
            <div 
              onClick={() => handleStartWithVoice('nature')}
              className="group bg-cyan-50 hover:bg-cyan-100/75 border-2 border-cyan-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
            >
              <span className="text-3xl bg-white p-2 rounded-xl border border-cyan-200 group-hover:scale-110 transition-transform">🌈</span>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-cyan-900">
                  {lang === 'tr' ? 'Doğa ve Hava Durumu' : 'Nature & Weather'}
                </h4>
                <p className="text-[10px] text-cyan-700 font-bold leading-tight">
                  {lang === 'tr' ? 'Güneş, yağmur, kar ve mevsim kıyafetleri' : 'Sun, rain, snow dressing-up game'}
                </p>
              </div>
            </div>

            {/* Subject 10: Transport */}
            <div 
              onClick={() => handleStartWithVoice('transport')}
              className="group bg-violet-50 hover:bg-violet-100/75 border-2 border-violet-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
            >
              <span className="text-3xl bg-white p-2 rounded-xl border border-violet-200 group-hover:scale-110 transition-transform">🚂</span>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-violet-900">
                  {lang === 'tr' ? 'Toplu Taşıma Araçları' : 'Public Transportation'}
                </h4>
                <p className="text-[10px] text-violet-700 font-bold leading-tight">
                  {lang === 'tr' ? 'Tren, otobüs, gemi seslerini bul' : 'Find trains, buses, planes, and sounds'}
                </p>
              </div>
            </div>

            {/* Subject 11: Emotions */}
            <div 
              onClick={() => handleStartWithVoice('emotions')}
              className="group bg-emerald-50 hover:bg-emerald-100/75 border-2 border-emerald-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
            >
              <span className="text-3xl bg-white p-2 rounded-xl border border-emerald-200 group-hover:scale-110 transition-transform">😊</span>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-emerald-900">
                  {lang === 'tr' ? 'Duygularımız' : 'Our Emotions'}
                </h4>
                <p className="text-[10px] text-emerald-700 font-bold leading-tight">
                  {lang === 'tr' ? 'Yüz ifadelerini tanı ve empati kur' : 'Recognize expressions & learn feelings'}
                </p>
              </div>
            </div>

            {/* Subject 12: Coloring */}
            <div 
              onClick={() => handleStartWithVoice('coloring')}
              className="group bg-emerald-50 hover:bg-emerald-100/75 border-2 border-emerald-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
            >
              <span className="text-3xl bg-white p-2 rounded-xl border border-emerald-200 group-hover:scale-110 transition-transform">🎨</span>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-emerald-900">
                  {lang === 'tr' ? 'Boya ve Çiz' : 'Coloring & Sketch'}
                </h4>
                <p className="text-[10px] text-emerald-700 font-bold leading-tight">
                  {lang === 'tr' ? 'Sihirli boyama ve serbest çizim tuvali' : 'Magic touch paint and freehand drawing'}
                </p>
              </div>
            </div>

            {/* Subject 13: Puzzle */}
            <div 
              onClick={() => handleStartWithVoice('puzzle')}
              className="group bg-indigo-50 hover:bg-indigo-100/75 border-2 border-indigo-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
            >
              <span className="text-3xl bg-white p-2 rounded-xl border border-indigo-200 group-hover:scale-110 transition-transform">🧩</span>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-indigo-900">
                  {lang === 'tr' ? 'Eğlenceli Yapboz' : 'Jigsaw Puzzle'}
                </h4>
                <p className="text-[10px] text-indigo-700 font-bold leading-tight">
                  {lang === 'tr' ? 'Sevimli resimlerin parçalarını birleştir' : 'Match and swap tiles to solve puzzles'}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
