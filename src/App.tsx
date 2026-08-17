import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Volume2, VolumeX, BookOpen, Hash, Palette, Edit2, Star, LogOut, UserCheck, Trophy, Shield } from 'lucide-react';

import { Language, ActiveTab, LetterItem } from './types';
import { speak } from './utils/speak';
import { TURKISH_ALPHABET, ENGLISH_ALPHABET, NUMBERS } from './data';

import AlphabetSection from './components/AlphabetSection';
import NumbersSection from './components/NumbersSection';
import ColorsSection from './components/ColorsSection';
import WritingCanvas from './components/WritingCanvas';
import WelcomeScreen from './components/WelcomeScreen';
import ParentControl, { PlaytimeLockOverlay } from './components/ParentControl';

import BodyPartsSection from './components/BodyPartsSection';
import AnimalsSection from './components/AnimalsSection';
import OppositesSection from './components/OppositesSection';
import RoutinesSection from './components/RoutinesSection';
import NatureSection from './components/NatureSection';
import TransportSection from './components/TransportSection';
import EmotionsSection from './components/EmotionsSection';
import ColoringSection from './components/ColoringSection';
import PuzzleSection from './components/PuzzleSection';

import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { 
  OperationType, 
  handleFirestoreError, 
  sanitizeNumber, 
  sanitizeString, 
  secureStorage,
  generateSalt,
  hashParentPin
} from './utils/security';

export default function App() {
  const [lang, setLang] = useState<Language>('tr');
  const [activeTab, setActiveTab] = useState<ActiveTab>('alphabet');
  const [screen, setScreen] = useState<'welcome' | 'portal'>('welcome');
  
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isKvkkOpen, setIsKvkkOpen] = useState<boolean>(false);
  
  // Track children's score/XP
  const [xp, setXp] = useState<number>(() => {
    const saved = secureStorage.get('kids_academy_xp');
    return saved ? sanitizeNumber(parseInt(saved, 10), 0, 5000000, 1250) : 1250;
  });

  // Cryptographically hashed Parent Passcode states (salted SHA-256)
  const [parentPasscodeHash, setParentPasscodeHash] = useState<string>(() => {
    return secureStorage.get('parent_pin_hash') || '';
  });

  const [parentPasscodeSalt, setParentPasscodeSalt] = useState<string>(() => {
    return secureStorage.get('parent_pin_salt') || '';
  });

  const [playtimeLimit, setPlaytimeLimit] = useState<number>(() => {
    const saved = secureStorage.get('playtime_limit');
    return saved ? sanitizeNumber(parseInt(saved, 10), 0, 300, 0) : 0; // 0 means unlimited
  });

  const [playtimeLeft, setPlaytimeLeft] = useState<number>(() => {
    const savedLeft = secureStorage.get('playtime_left');
    if (savedLeft !== null) {
      return sanitizeNumber(parseInt(savedLeft, 10), 0, 18000, 0);
    }
    const limit = secureStorage.get('playtime_limit');
    const limitMins = limit ? sanitizeNumber(parseInt(limit, 10), 0, 300, 0) : 0;
    return limitMins * 60;
  });

  const [isParentControlOpen, setIsParentControlOpen] = useState<boolean>(false);

  // Subscribe to Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);

      if (firebaseUser) {
        // Logged in! Fetch XP & Parent Settings from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (typeof data.xp === 'number') {
              const safeXp = sanitizeNumber(data.xp, 0, 5000000, 1250);
              setXp(safeXp);
              secureStorage.set('kids_academy_xp', safeXp.toString());
            }
            if (typeof data.parentPasscodeHash === 'string') {
              setParentPasscodeHash(data.parentPasscodeHash);
              secureStorage.set('parent_pin_hash', data.parentPasscodeHash);
            }
            if (typeof data.parentPasscodeSalt === 'string') {
              setParentPasscodeSalt(data.parentPasscodeSalt);
              secureStorage.set('parent_pin_salt', data.parentPasscodeSalt);
            }
            if (typeof data.playtimeLimit === 'number') {
              const safeLimit = sanitizeNumber(data.playtimeLimit, 0, 300, 0);
              setPlaytimeLimit(safeLimit);
              secureStorage.set('playtime_limit', safeLimit.toString());
              
              const savedLeft = secureStorage.get('playtime_left');
              if (savedLeft === null) {
                setPlaytimeLeft(safeLimit * 60);
                secureStorage.set('playtime_left', (safeLimit * 60).toString());
              }
            }
          } else {
            // New User! Initialize with current local settings
            const currentLocalXp = sanitizeNumber(parseInt(secureStorage.get('kids_academy_xp') || '1250', 10), 0, 5000000, 1250);
            const currentHash = secureStorage.get('parent_pin_hash') || '';
            const currentSalt = secureStorage.get('parent_pin_salt') || '';
            const currentLocalLimit = sanitizeNumber(parseInt(secureStorage.get('playtime_limit') || '0', 10), 0, 300, 0);

            await setDoc(userDocRef, {
              displayName: sanitizeString(firebaseUser.displayName || 'Minik Öğrenci', 100),
              email: sanitizeString(firebaseUser.email || '', 150),
              xp: currentLocalXp,
              parentPasscodeHash: currentHash,
              parentPasscodeSalt: currentSalt,
              playtimeLimit: currentLocalLimit,
              createdAt: new Date().toISOString(),
              lastActive: new Date().toISOString(),
              lang: lang
            });
            setXp(currentLocalXp);
            setParentPasscodeHash(currentHash);
            setParentPasscodeSalt(currentSalt);
            setPlaytimeLimit(currentLocalLimit);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`, firebaseUser);
        }
      } else {
        // Logged out: Restore local settings safely
        const saved = secureStorage.get('kids_academy_xp');
        setXp(saved ? sanitizeNumber(parseInt(saved, 10), 0, 5000000, 1250) : 1250);

        const savedHash = secureStorage.get('parent_pin_hash');
        setParentPasscodeHash(savedHash || '');

        const savedSalt = secureStorage.get('parent_pin_salt');
        setParentPasscodeSalt(savedSalt || '');

        const savedLimit = secureStorage.get('playtime_limit');
        setPlaytimeLimit(savedLimit ? sanitizeNumber(parseInt(savedLimit, 10), 0, 300, 0) : 0);

        const savedLeft = secureStorage.get('playtime_left');
        if (savedLeft !== null) {
          setPlaytimeLeft(sanitizeNumber(parseInt(savedLeft, 10), 0, 18000, 0));
        } else if (savedLimit) {
          setPlaytimeLeft(parseInt(savedLimit, 10) * 60);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Playtime countdown timer
  useEffect(() => {
    if (playtimeLimit === 0) return; // Unlimited

    const interval = setInterval(() => {
      setPlaytimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          secureStorage.set('playtime_left', '0');
          return 0;
        }
        const next = prev - 1;
        if (next % 5 === 0) {
          secureStorage.set('playtime_left', next.toString());
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [playtimeLimit, playtimeLeft]);

  const handleUpdateParentPasscode = async (hash: string, salt: string) => {
    setParentPasscodeHash(hash);
    setParentPasscodeSalt(salt);
    secureStorage.set('parent_pin_hash', hash);
    secureStorage.set('parent_pin_salt', salt);
    
    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await updateDoc(userDocRef, {
          parentPasscodeHash: hash,
          parentPasscodeSalt: salt,
          lastActive: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}`, auth.currentUser);
      }
    }
  };

  const handleUpdatePlaytimeLimit = async (limit: number) => {
    const safeLimit = sanitizeNumber(limit, 0, 300, 0);
    setPlaytimeLimit(safeLimit);
    secureStorage.set('playtime_limit', safeLimit.toString());
    
    const secondsLeft = safeLimit * 60;
    setPlaytimeLeft(secondsLeft);
    secureStorage.set('playtime_left', secondsLeft.toString());

    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await updateDoc(userDocRef, {
          playtimeLimit: safeLimit,
          lastActive: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}`, auth.currentUser);
      }
    }
  };

  const handleExtendPlaytime = (minutes: number) => {
    const safeMins = sanitizeNumber(minutes, 0, 300, 0);
    if (safeMins === 0) {
      handleUpdatePlaytimeLimit(0);
    } else {
      const addedSeconds = safeMins * 60;
      setPlaytimeLeft((prev) => {
        const next = (prev > 0 ? prev : 0) + addedSeconds;
        secureStorage.set('playtime_left', next.toString());
        return next;
      });
      if (playtimeLimit === 0) {
        setPlaytimeLimit(safeMins);
        secureStorage.set('playtime_limit', safeMins.toString());
      }
    }
  };

  const earnXp = (amount: number) => {
    const safeIncrement = sanitizeNumber(amount, 1, 500, 10);
    setXp((prev) => {
      const next = Math.min(5000000, prev + safeIncrement);
      secureStorage.set('kids_academy_xp', next.toString());
      
      // Sync with Firestore if logged in
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        updateDoc(userDocRef, {
          xp: next,
          lastActive: new Date().toISOString()
        }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser?.uid}`, auth.currentUser);
        });
      }
      return next;
    });
  };

  const handleSignInWithGoogle = async () => {
    try {
      setAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google authentication error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthLoading(true);
      await signOut(auth);
      secureStorage.remove('kids_academy_xp');
      setXp(1250); // Reset to baseline for guest
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Track letter selected for writing trace
  const [selectedLetterForWriting, setSelectedLetterForWriting] = useState<LetterItem>(
    TURKISH_ALPHABET[0]
  );
  const [writingType, setWritingType] = useState<'letters' | 'numbers'>('letters');

  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play custom speech greetings when language or tab changes
  useEffect(() => {
    if (!soundEnabled || screen !== 'portal') return;

    if (activeTab === 'alphabet') {
      const greeting = lang === 'tr' 
        ? 'Alfabeyi öğrenelim! Harflere dokun.' 
        : 'Let\'s learn the alphabet! Tap any letter.';
      speak(greeting, lang);
    } else if (activeTab === 'numbers') {
      const greeting = lang === 'tr' 
        ? 'Sayıları sayalım! Sayı seç.' 
        : 'Let\'s count numbers! Choose a number.';
      speak(greeting, lang);
    } else if (activeTab === 'colors') {
      const greeting = lang === 'tr' 
        ? 'Renkleri keşfedelim! Balona dokun.' 
        : 'Let\'s explore colors! Tap a balloon.';
      speak(greeting, lang);
    } else if (activeTab === 'writing') {
      const greeting = lang === 'tr'
        ? `Hadi ${selectedLetterForWriting.letter} harfini yazalım!`
        : `Let's write the letter ${selectedLetterForWriting.letter}!`;
      speak(greeting, lang);
    } else if (activeTab === 'body_parts') {
      const greeting = lang === 'tr'
        ? 'Vücudumuzun bölümlerini öğrenelim! Dokun ve keşfet.'
        : 'Let\'s learn body parts! Tap and explore.';
      speak(greeting, lang);
    } else if (activeTab === 'animals') {
      const greeting = lang === 'tr'
        ? 'Sevimli hayvan dostlarımızın seslerini tanıyalım!'
        : 'Let\'s learn animal sounds!';
      speak(greeting, lang);
    } else if (activeTab === 'opposites') {
      const greeting = lang === 'tr'
        ? 'Zıt kavramları keşfedelim!'
        : 'Let\'s explore opposites!';
      speak(greeting, lang);
    } else if (activeTab === 'routines') {
      const greeting = lang === 'tr'
        ? 'Günlük rutinlerimizi ve sağlıklı alışkanlıklarımızı görelim!'
        : 'Let\'s check our daily routines and healthy habits!';
      speak(greeting, lang);
    } else if (activeTab === 'nature') {
      const greeting = lang === 'tr'
        ? 'Hava durumunu ve doğa olaylarını öğrenelim!'
        : 'Let\'s learn nature and weather!';
      speak(greeting, lang);
    } else if (activeTab === 'transport') {
      const greeting = lang === 'tr'
        ? 'Toplu taşıma araçlarını ve çıkardıkları sesleri keşfedelim!'
        : 'Let\'s explore public transportation and vehicle sounds!';
      speak(greeting, lang);
    } else if (activeTab === 'emotions') {
      const greeting = lang === 'tr'
        ? 'Duygularımızı tanıyalım ve empati kurmayı öğrenelim!'
        : 'Let\'s learn our emotions and empathy!';
      speak(greeting, lang);
    } else if (activeTab === 'coloring') {
      const greeting = lang === 'tr'
        ? 'Boyama yapalım ve resimleri renklendirelim!'
        : 'Let\'s do some coloring and paint pictures!';
      speak(greeting, lang);
    } else if (activeTab === 'puzzle') {
      const greeting = lang === 'tr'
        ? 'Parçaları birleştirip yapbozu çözelim!'
        : 'Let\'s match pieces and solve the jigsaw puzzle!';
      speak(greeting, lang);
    }
  }, [activeTab, lang, soundEnabled, screen]);

  // Handle switching language
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    earnXp(20); // Award 20 XP for practicing a second language!
    
    // Automatically swap active default letter if the old one does not exist
    const currentAlphabet = newLang === 'tr' ? TURKISH_ALPHABET : ENGLISH_ALPHABET;
    const exists = currentAlphabet.find(item => item.letter === selectedLetterForWriting.letter);
    if (!exists) {
      setSelectedLetterForWriting(currentAlphabet[0]);
    }

    if (soundEnabled) {
      const introText = newLang === 'tr' 
        ? 'Merhaba! Türkçe öğrenmeye hazır mısın?' 
        : 'Hello! Are you ready to learn English?';
      speak(introText, newLang);
    }
  };

  const handleSelectLetterForDrawing = (letterItem: LetterItem) => {
    setSelectedLetterForWriting(letterItem);
    setActiveTab('writing');
    earnXp(50); // Award 50 XP for starting a drawing challenge!
  };

  const handleToggleSound = () => {
    if (soundEnabled) {
      window.speechSynthesis?.cancel();
    }
    setSoundEnabled(!soundEnabled);
  };

  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-[#FFF9E6] pb-12 font-sans selection:bg-orange-200 relative overflow-hidden">
        {/* Decorative background clouds / suns */}
        <div className="absolute top-4 left-10 pointer-events-none opacity-40 animate-pulse hidden sm:block text-2xl">☁️</div>
        <div className="absolute top-24 right-16 pointer-events-none opacity-40 animate-bounce hidden sm:block text-3xl delay-300">☀️</div>

        <WelcomeScreen
          lang={lang}
          soundEnabled={soundEnabled}
          onLanguageChange={handleLanguageChange}
          onToggleSound={handleToggleSound}
          onStartLearning={(subject) => {
            setActiveTab(subject);
            setScreen('portal');
          }}
          xp={xp}
          user={user}
          authLoading={authLoading}
          onSignIn={handleSignInWithGoogle}
          onSignOut={handleSignOut}
          onOpenParentControl={() => setIsParentControlOpen(true)}
          playtimeLimit={playtimeLimit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9E6] pb-12 font-sans selection:bg-orange-200 relative">
      
      {/* Decorative background clouds / suns */}
      <div className="absolute top-4 left-10 pointer-events-none opacity-40 animate-pulse hidden sm:block text-2xl">☁️</div>
      <div className="absolute top-24 right-16 pointer-events-none opacity-40 animate-bounce hidden sm:block text-3xl delay-300">☀️</div>

      {/* Primary header portal in Vibrant Palette Style */}
      <header className="h-auto md:h-20 bg-white border-b-4 border-orange-200 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 py-4 md:py-0 shrink-0 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setScreen('welcome')}
            title={lang === 'tr' ? 'Ana Ekrana Dön' : 'Back to Home'}
            className="w-12 h-12 bg-orange-400 hover:bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-orange-300 transform rotate-3 hover:rotate-12 transition-transform cursor-pointer animate-pulse"
          >
            <span className="text-white text-2xl font-black">🏠</span>
          </div>
          <div>
            <h1 
              onClick={() => setScreen('welcome')}
              className="text-2xl sm:text-3xl font-black text-orange-600 tracking-tight italic uppercase flex items-center gap-2 cursor-pointer hover:text-orange-500 transition-colors"
            >
              <span>{lang === 'tr' ? 'MİNİK AKADEMİ' : 'KIDSLEARN'}</span>
              <Sparkles size={16} className="text-yellow-400 fill-yellow-400 animate-spin" />
            </h1>
          </div>
        </div>
        
        {/* Header Right Widgets */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* Back to Home Button */}
          <button
            id="btn-nav-home"
            onClick={() => setScreen('welcome')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 font-black rounded-full border-2 border-orange-200 transition-all active:scale-95 text-xs cursor-pointer shadow-sm"
          >
            <span>🏠</span>
            <span>{lang === 'tr' ? 'Ana Ekran' : 'Main Menu'}</span>
          </button>

          {/* Sound Mute control */}
          <button
            id="btn-toggle-sound"
            onClick={handleToggleSound}
            className={`w-10 h-10 rounded-full border-2 transition-all active:scale-95 shadow-sm flex items-center justify-center cursor-pointer ${
              soundEnabled 
                ? 'bg-orange-50 border-orange-200 text-orange-600' 
                : 'bg-gray-100 border-gray-200 text-gray-400'
            }`}
            title={soundEnabled ? 'Sesi Kapat / Mute' : 'Sesi Aç / Unmute'}
          >
            {soundEnabled ? <Volume2 size={18} className="stroke-[3px]" /> : <VolumeX size={18} className="stroke-[3px]" />}
          </button>

          {/* Language selection pill */}
          <div className="flex bg-gray-100 p-1 rounded-full border-2 border-gray-200 shadow-inner">
            <button
              id="btn-lang-tr"
              onClick={() => handleLanguageChange('tr')}
              className={`px-4 sm:px-6 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                lang === 'tr' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Türkçe
            </button>
            <button
              id="btn-lang-en"
              onClick={() => handleLanguageChange('en')}
              className={`px-4 sm:px-6 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                lang === 'en' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              English
            </button>
          </div>

          {/* Active Playtime Countdown indicator */}
          {playtimeLimit > 0 && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-black shadow-sm ${
              playtimeLeft < 120 
                ? 'bg-red-50 border-red-200 text-red-600 animate-pulse font-black' 
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}
              title={lang === 'tr' ? 'Kalan Oyun Süresi' : 'Remaining Playtime'}
            >
              <span>⏱️</span>
              <span>
                {Math.floor(playtimeLeft / 60)}:{(playtimeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Parent Control Settings Shield Button */}
          <button
            onClick={() => setIsParentControlOpen(true)}
            className="w-10 h-10 rounded-full border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-600 flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-sm"
            title={lang === 'tr' ? 'Veli Ayarları (Süre Sınırı)' : 'Parent Settings (Playtime Limit)'}
          >
            <Shield size={18} className="stroke-[2.5px]" />
          </button>

          {/* Star Badge */}
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-yellow-200 shadow-sm animate-pulse">
            <span className="text-lg">⭐</span>
          </div>

          {/* XP Progress count */}
          <div className="flex items-center px-4 py-1.5 bg-blue-100 rounded-full border-2 border-blue-200 shadow-sm">
            <span className="font-black text-blue-600 text-xs sm:text-sm tracking-wide">
              {xp.toLocaleString()} XP
            </span>
          </div>

          {/* Veli Girişi / Google Account Profile Badge */}
          {user ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border-2 border-emerald-200 shadow-sm text-xs font-bold">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full border border-emerald-100" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-sm">🙋‍♀️</span>
              )}
              <span className="max-w-[80px] truncate">{user.displayName?.split(' ')[0]}</span>
              <button 
                onClick={handleSignOut} 
                className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer transition-colors flex items-center justify-center"
                title={lang === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
              >
                <LogOut size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignInWithGoogle}
              disabled={authLoading}
              className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 hover:bg-sky-100/50 text-sky-800 rounded-full border-2 border-sky-200 transition-all text-xs font-bold cursor-pointer shadow-sm"
              title={lang === 'tr' ? 'Velimle Giriş Yap' : 'Sign In with Google'}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-7.989s3.529-7.989 7.859-7.989c2.47 0 4.12 1.023 5.07 1.926l3.24-3.119C18.3 1.932 15.54 1 12.24 1 5.922 1 12.24s4.922 11.24 11.24 11.24c6.6 0 11-4.64 11-11.24 0-.756-.08-1.334-.18-1.956H12.24z"/>
              </svg>
              <span>{authLoading ? '...' : (lang === 'tr' ? 'Veli Girişi' : 'Parent Login')}</span>
            </button>
          )}
        </div>
      </header>

      {/* Playful primary tab bar navigation - styled with the design mockup's border-b-4 cartoon feel */}
      <nav className="max-w-6xl mx-auto px-4 mt-6 mb-6">
        <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-orange-200">
          
          <button
            id="tab-alphabet"
            onClick={() => { setActiveTab('alphabet'); earnXp(10); }}
            className={`px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'alphabet'
                ? 'bg-pink-500 border-b-4 border-pink-700 text-white font-black shadow-md'
                : 'bg-white border-2 border-pink-100 hover:bg-pink-50 text-pink-700 font-bold'
            }`}
          >
            <span className="text-xl">🔠</span>
            <span className="text-xs uppercase tracking-wider">{lang === 'tr' ? 'Alfabe' : 'Alphabet'}</span>
          </button>

          <button
            id="tab-writing"
            onClick={() => { setActiveTab('writing'); earnXp(10); }}
            className={`px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'writing'
                ? 'bg-purple-500 border-b-4 border-purple-700 text-white font-black shadow-md'
                : 'bg-white border-2 border-purple-100 hover:bg-purple-50 text-purple-700 font-bold'
            }`}
          >
            <span className="text-xl">✍️</span>
            <span className="text-xs uppercase tracking-wider">{lang === 'tr' ? 'Yazım Defteri' : 'Writing Board'}</span>
          </button>

          <button
            id="tab-numbers"
            onClick={() => { setActiveTab('numbers'); earnXp(10); }}
            className={`px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'numbers'
                ? 'bg-blue-500 border-b-4 border-blue-700 text-white font-black shadow-md'
                : 'bg-white border-2 border-blue-100 hover:bg-blue-50 text-blue-700 font-bold'
            }`}
          >
            <span className="text-xl">🔢</span>
            <span className="text-xs uppercase tracking-wider">{lang === 'tr' ? 'Sayılar' : 'Numbers'}</span>
          </button>

          <button
            id="tab-colors"
            onClick={() => { setActiveTab('colors'); earnXp(10); }}
            className={`px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'colors'
                ? 'bg-green-500 border-b-4 border-green-700 text-white font-black shadow-md'
                : 'bg-white border-2 border-green-100 hover:bg-green-50 text-green-700 font-bold'
            }`}
          >
            <span className="text-xl">🎨</span>
            <span className="text-xs uppercase tracking-wider">{lang === 'tr' ? 'Renkler' : 'Colors'}</span>
          </button>

          <button
            id="tab-animals"
            onClick={() => { setActiveTab('animals'); earnXp(10); }}
            className={`px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'animals'
                ? 'bg-amber-500 border-b-4 border-amber-700 text-white font-black shadow-md'
                : 'bg-white border-2 border-amber-100 hover:bg-amber-50 text-amber-700 font-bold'
            }`}
          >
            <span className="text-xl">🦁</span>
            <span className="text-xs uppercase tracking-wider">{lang === 'tr' ? 'Hayvanlar' : 'Animals'}</span>
          </button>

          <button
            id="tab-body-parts"
            onClick={() => { setActiveTab('body_parts'); earnXp(10); }}
            className={`px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'body_parts'
                ? 'bg-rose-500 border-b-4 border-rose-700 text-white font-black shadow-md'
                : 'bg-white border-2 border-rose-100 hover:bg-rose-50 text-rose-700 font-bold'
            }`}
          >
            <span className="text-xl">🙋‍♀️</span>
            <span className="text-xs uppercase tracking-wider">{lang === 'tr' ? 'Vücudumuz' : 'Our Body'}</span>
          </button>

          <button
            id="tab-opposites"
            onClick={() => { setActiveTab('opposites'); earnXp(10); }}
            className={`px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'opposites'
                ? 'bg-sky-500 border-b-4 border-sky-700 text-white font-black shadow-md'
                : 'bg-white border-2 border-sky-100 hover:bg-sky-50 text-sky-700 font-bold'
            }`}
          >
            <span className="text-xl">⚖️</span>
            <span className="text-xs uppercase tracking-wider">{lang === 'tr' ? 'Zıtlıklar' : 'Opposites'}</span>
          </button>

          <button
            id="tab-routines"
            onClick={() => { setActiveTab('routines'); earnXp(10); }}
            className={`px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'routines'
                ? 'bg-indigo-500 border-b-4 border-indigo-700 text-white font-black shadow-md'
                : 'bg-white border-2 border-indigo-100 hover:bg-indigo-50 text-indigo-700 font-bold'
            }`}
          >
            <span className="text-xl">⏰</span>
            <span className="text-xs uppercase tracking-wider">{lang === 'tr' ? 'Rutinler' : 'Routines'}</span>
          </button>

          <button
            id="tab-nature"
            onClick={() => { setActiveTab('nature'); earnXp(10); }}
            className={`px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'nature'
                ? 'bg-cyan-500 border-b-4 border-cyan-700 text-white font-black shadow-md'
                : 'bg-white border-2 border-cyan-100 hover:bg-cyan-50 text-cyan-700 font-bold'
            }`}
          >
            <span className="text-xl">🌈</span>
            <span className="text-xs uppercase tracking-wider">{lang === 'tr' ? 'Doğa/Hava' : 'Nature/Weather'}</span>
          </button>

          <button
            id="tab-transport"
            onClick={() => { setActiveTab('transport'); earnXp(10); }}
            className={`px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'transport'
                ? 'bg-violet-500 border-b-4 border-violet-700 text-white font-black shadow-md'
                : 'bg-white border-2 border-violet-100 hover:bg-violet-50 text-violet-700 font-bold'
            }`}
          >
            <span className="text-xl">🚂</span>
            <span className="text-xs uppercase tracking-wider">{lang === 'tr' ? 'Taşıtlar' : 'Vehicles'}</span>
          </button>

          <button
            id="tab-emotions"
            onClick={() => { setActiveTab('emotions'); earnXp(10); }}
            className={`px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'emotions'
                ? 'bg-emerald-500 border-b-4 border-emerald-700 text-white font-black shadow-md'
                : 'bg-white border-2 border-emerald-100 hover:bg-emerald-50 text-emerald-700 font-bold'
            }`}
          >
            <span className="text-xl">😊</span>
            <span className="text-xs uppercase tracking-wider">{lang === 'tr' ? 'Duygular' : 'Emotions'}</span>
          </button>

          <button
            id="tab-coloring"
            onClick={() => { setActiveTab('coloring'); earnXp(10); }}
            className={`px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'coloring'
                ? 'bg-emerald-500 border-b-4 border-emerald-700 text-white font-black shadow-md'
                : 'bg-white border-2 border-emerald-100 hover:bg-emerald-50 text-emerald-700 font-bold'
            }`}
          >
            <span className="text-xl">🎨</span>
            <span className="text-xs uppercase tracking-wider">{lang === 'tr' ? 'Boyama Kitabı' : 'Coloring'}</span>
          </button>

          <button
            id="tab-puzzle"
            onClick={() => { setActiveTab('puzzle'); earnXp(10); }}
            className={`px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'puzzle'
                ? 'bg-indigo-500 border-b-4 border-indigo-700 text-white font-black shadow-md'
                : 'bg-white border-2 border-indigo-100 hover:bg-indigo-50 text-indigo-700 font-bold'
            }`}
          >
            <span className="text-xl">🧩</span>
            <span className="text-xs uppercase tracking-wider">{lang === 'tr' ? 'Yapboz Oyunu' : 'Puzzle'}</span>
          </button>

        </div>
      </nav>

      {/* Cute Interactive Word of the Day Widget right before main content - Only shown on Alphabet tab */}
      {activeTab === 'alphabet' && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div 
            onClick={() => {
              const textToSpeak = lang === 'tr' ? 'Bugünün Kelimesi: Çilek!' : 'Word of the Day: Strawberry!';
              speak(textToSpeak, lang);
              earnXp(15);
            }}
            className="bg-purple-50 hover:bg-purple-100/75 border-4 border-purple-200 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm cursor-pointer transition-transform hover:scale-[1.01] active:scale-95 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce duration-1000">🍓</span>
              <div className="text-left">
                <span className="text-[10px] sm:text-xs font-black text-purple-600 uppercase tracking-widest">
                  {lang === 'tr' ? 'Günün Eğlenceli Kelimesi' : 'Fun Word of the Day'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-purple-900 group-hover:text-purple-700 transition-colors">
                  {lang === 'tr' ? 'ÇİLEK' : 'STRAWBERRY'}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-600 italic bg-white px-3 py-1 rounded-full border border-purple-100 group-hover:scale-105 transition-transform">
                {lang === 'tr' ? 'İngilizce: Strawberry' : 'Turkish: Çilek'}
              </span>
              <span className="text-xs font-black text-purple-800 bg-purple-200/50 px-3 py-1 rounded-full flex items-center gap-1">
                🔊 {lang === 'tr' ? 'Dinle' : 'Listen'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main active viewport */}
      <main className="max-w-6xl mx-auto px-4 min-h-[460px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + lang}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            {activeTab === 'alphabet' && (
              <AlphabetSection
                lang={lang}
                onSelectLetterForDrawing={handleSelectLetterForDrawing}
                onEarnXp={earnXp}
              />
            )}

            {activeTab === 'numbers' && (
              <NumbersSection lang={lang} onEarnXp={earnXp} />
            )}

            {activeTab === 'colors' && (
              <ColorsSection lang={lang} onEarnXp={earnXp} />
            )}

            {activeTab === 'body_parts' && (
              <BodyPartsSection lang={lang} onEarnXp={earnXp} />
            )}

            {activeTab === 'animals' && (
              <AnimalsSection lang={lang} onEarnXp={earnXp} />
            )}

            {activeTab === 'opposites' && (
              <OppositesSection lang={lang} onEarnXp={earnXp} />
            )}

            {activeTab === 'routines' && (
              <RoutinesSection lang={lang} onEarnXp={earnXp} />
            )}

            {activeTab === 'nature' && (
              <NatureSection lang={lang} onEarnXp={earnXp} />
            )}

            {activeTab === 'transport' && (
              <TransportSection lang={lang} onEarnXp={earnXp} />
            )}

            {activeTab === 'emotions' && (
              <EmotionsSection lang={lang} onEarnXp={earnXp} />
            )}

            {activeTab === 'coloring' && (
              <ColoringSection lang={lang} onEarnXp={earnXp} />
            )}

            {activeTab === 'puzzle' && (
              <PuzzleSection lang={lang} onEarnXp={earnXp} />
            )}

            {activeTab === 'writing' && (
              <div className="flex flex-col gap-5">
                
                {/* Horizontal Quick-Select Letter Template Picker - Styled in purple */}
                <div className="bg-white rounded-2xl border-2 border-purple-200 p-3.5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-purple-100">
                    <h4 className="text-xs font-black text-purple-900 uppercase tracking-widest flex items-center gap-1.5">
                      <Star size={12} className="text-purple-500 fill-purple-400 animate-pulse" />
                      <span>{lang === 'tr' ? 'Yazılacak Şablonu Seç' : 'Choose Trace Template'}</span>
                    </h4>

                    {/* Mode Toggle Selector */}
                    <div className="flex bg-purple-50 p-1 rounded-full border border-purple-200 self-start sm:self-auto shadow-inner">
                      <button
                        id="btn-writing-type-letters"
                        onClick={() => {
                          setWritingType('letters');
                          const alphabet = lang === 'tr' ? TURKISH_ALPHABET : ENGLISH_ALPHABET;
                          setSelectedLetterForWriting(alphabet[0]);
                          earnXp(10);
                        }}
                        className={`px-4 py-1.5 rounded-full font-black text-xs transition-all cursor-pointer ${
                          writingType === 'letters'
                            ? 'bg-purple-500 text-white shadow-sm'
                            : 'text-purple-700 hover:text-purple-900'
                        }`}
                      >
                        🔤 {lang === 'tr' ? 'Harfler' : 'Letters'}
                      </button>
                      <button
                        id="btn-writing-type-numbers"
                        onClick={() => {
                          setWritingType('numbers');
                          const numbersMapped: LetterItem[] = NUMBERS.map((n) => ({
                            letter: String(n.value),
                            word: n.word,
                            emoji: n.emoji,
                          }));
                          setSelectedLetterForWriting(numbersMapped[0]);
                          earnXp(10);
                        }}
                        className={`px-4 py-1.5 rounded-full font-black text-xs transition-all cursor-pointer ${
                          writingType === 'numbers'
                            ? 'bg-purple-500 text-white shadow-sm'
                            : 'text-purple-700 hover:text-purple-900'
                        }`}
                      >
                        🔢 {lang === 'tr' ? 'Sayılar' : 'Numbers'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-purple-300">
                    {(writingType === 'letters'
                      ? (lang === 'tr' ? TURKISH_ALPHABET : ENGLISH_ALPHABET)
                      : NUMBERS.map((n) => ({
                          letter: String(n.value),
                          word: n.word,
                          emoji: n.emoji,
                        }))
                    ).map((item) => {
                      const isCurrent = selectedLetterForWriting.letter === item.letter;
                      return (
                        <button
                          id={`btn-canvas-swap-letter-${item.letter}`}
                          key={item.letter}
                          onClick={() => {
                            setSelectedLetterForWriting(item);
                            earnXp(10);
                          }}
                          className={`flex-shrink-0 w-11 h-11 flex flex-col items-center justify-center rounded-xl font-black text-base border transition-all active:scale-95 cursor-pointer ${
                            isCurrent
                              ? 'bg-purple-400 border-purple-600 text-purple-950 scale-105 shadow-sm font-extrabold'
                              : 'bg-purple-50/50 hover:bg-purple-100/70 border-purple-200 text-purple-800'
                          }`}
                        >
                          <span>{item.letter}</span>
                          <span className="text-[9px] -mt-0.5">{item.emoji}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* The Handwriting Tracing Board Canvas */}
                <WritingCanvas
                  letter={selectedLetterForWriting.letter}
                  word={selectedLetterForWriting.word}
                  emoji={selectedLetterForWriting.emoji}
                  lang={lang}
                  onBack={() => setActiveTab('alphabet')}
                  onEarnXp={earnXp}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Educational & Privacy Footer */}
      <footer className="max-w-6xl mx-auto px-4 mt-12 mb-6 text-center flex flex-col items-center gap-3">
        <p className="text-xs font-bold text-amber-600/80">
          {lang === 'tr' 
            ? '🎈 Çocukların gelişimine destek olmak için tasarlanmıştır. Tablet ve telefon uyumludur. 🎈' 
            : '🎈 Designed to support children\'s development. Fully compatible with tablets and phones. 🎈'}
        </p>
        <div className="flex items-center gap-3 text-[11px] font-extrabold text-amber-800/70">
          <button 
            onClick={() => setIsKvkkOpen(true)} 
            className="hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>🔒 {lang === 'tr' ? 'KVKK Aydınlatma Metni & Bilgi Güvenliği (2026)' : 'Privacy Policy & Data Security (2026)'}</span>
          </button>
        </div>
      </footer>

      {/* KVKK / Security Dialog */}
      <AnimatePresence>
        {isKvkkOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto border-4 border-amber-300 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <span>🛡️</span>
                  <span>{lang === 'tr' ? 'KVKK & Bilgi Güvenliği Politikası' : 'Privacy & Security Policy'}</span>
                </h3>
                <button 
                  onClick={() => setIsKvkkOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500 font-black cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
                <p>
                  <strong>6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK)</strong> ve çocukların dijital güvenliği esaslarına tam uyumlu olarak:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Minimal Veri İlkesi:</strong> Çocuklara ait hiçbir özel nitelikli kişisel veri, biyometrik veri veya konum bilgisi toplanmaz.</li>
                  <li><strong>Kriptografik Güvenlik:</strong> Veli şifreleri SHA-256 algoritması ve tuzlama (salt) ile tek yönlü kriptolanarak saklanır.</li>
                  <li><strong>Satır Düzeyinde Güvenlik (Row-Level Security):</strong> Firestore güvenlik kuralları ile her kullanıcının verisi sadece kendi oturumuyla sınırlandırılmıştır.</li>
                  <li><strong>Brute-Force & Bot Koruması:</strong> Veli paneli ardışık hatalı girişlerde otomatik güvenlik kilidi ve dinamik matematik doğrulama mekanizması uygular.</li>
                  <li><strong>Güvenli İletişim:</strong> Tüm veri transferleri zorunlu HTTPS/TLS 1.3 şifrelemesi üzerinden yürütülür.</li>
                </ul>
                <p className="text-[11px] text-gray-400 pt-2 border-t">
                  2026 Türkiye mevzuatına ve uluslararası çocuk verisi koruma standartlarına uygundur.
                </p>
              </div>
              <button
                onClick={() => setIsKvkkOpen(false)}
                className="mt-5 w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                {lang === 'tr' ? 'Anladım' : 'Close'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Parent Control Dialog Panel */}
      <AnimatePresence>
        {isParentControlOpen && (
          <ParentControl
            lang={lang}
            isOpen={isParentControlOpen}
            onClose={() => setIsParentControlOpen(false)}
            playtimeLimit={playtimeLimit}
            onUpdatePlaytimeLimit={handleUpdatePlaytimeLimit}
            parentPasscodeHash={parentPasscodeHash}
            parentPasscodeSalt={parentPasscodeSalt}
            onUpdateParentPasscode={handleUpdateParentPasscode}
            playtimeLeft={playtimeLeft}
            onExtendPlaytime={handleExtendPlaytime}
          />
        )}
      </AnimatePresence>

      {/* Screen lock overlay when playtime runs out */}
      <AnimatePresence>
        {playtimeLimit > 0 && playtimeLeft <= 0 && (
          <PlaytimeLockOverlay
            lang={lang}
            parentPasscodeHash={parentPasscodeHash}
            parentPasscodeSalt={parentPasscodeSalt}
            onExtendPlaytime={handleExtendPlaytime}
            onUpdateParentPasscode={handleUpdateParentPasscode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
