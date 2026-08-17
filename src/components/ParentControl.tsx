import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Timer, Lock, RefreshCw, Check, X, Eye, EyeOff, Award, AlertTriangle } from 'lucide-react';
import { generateSalt, hashParentPin, verifyParentPin, parentPinLimiter, sanitizeNumber } from '../utils/security';

interface ParentControlProps {
  lang: 'tr' | 'en';
  isOpen: boolean;
  onClose: () => void;
  playtimeLimit: number; // in minutes (0 means unlimited)
  onUpdatePlaytimeLimit: (limit: number) => void;
  parentPasscodeHash: string; // SHA-256 salted hash
  parentPasscodeSalt: string; // Salt for the hash
  onUpdateParentPasscode: (hash: string, salt: string) => void;
  playtimeLeft: number; // in seconds
  onExtendPlaytime: (minutes: number) => void;
  userEmail?: string;
}

export default function ParentControl({
  lang,
  isOpen,
  onClose,
  playtimeLimit,
  onUpdatePlaytimeLimit,
  parentPasscodeHash,
  parentPasscodeSalt,
  onUpdateParentPasscode,
  playtimeLeft,
  onExtendPlaytime,
}: ParentControlProps) {
  const [step, setStep] = useState<'auth' | 'math' | 'settings'>('auth');
  
  // Passcode entry states
  const [pinInput, setPinInput] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  
  // Math gate states (kid proof fallback)
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [mathAnswer, setMathAnswer] = useState<string>('');
  const [mathError, setMathError] = useState<boolean>(false);

  // New passcode state (when setting or changing)
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [settingsError, setSettingsError] = useState<string>('');
  const [settingsSuccess, setSettingsSuccess] = useState<boolean>(false);

  // Check lockout on mount and active interval
  useEffect(() => {
    const status = parentPinLimiter.isLockedOut();
    if (status.locked) {
      setLockoutSeconds(status.remainingSeconds);
    }
  }, []);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      const status = parentPinLimiter.isLockedOut();
      if (status.locked) {
        setLockoutSeconds(status.remainingSeconds);
      } else {
        setLockoutSeconds(0);
        setPinError('');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Generate math puzzle
  const generateMathPuzzle = () => {
    const n1 = Math.floor(Math.random() * 8) + 6; // 6 to 13
    const n2 = Math.floor(Math.random() * 7) + 5; // 5 to 11
    setNum1(n1);
    setNum2(n2);
    setMathAnswer('');
    setMathError(false);
  };

  // Reset flow when modal is opened
  useEffect(() => {
    if (isOpen) {
      if (!parentPasscodeHash) {
        setStep('settings');
      } else {
        setStep('auth');
      }
      setPinInput('');
      setPinError('');
      setSettingsSuccess(false);
      setSettingsError('');
      setNewPin('');
      setConfirmPin('');
    }
  }, [isOpen, parentPasscodeHash]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const lockoutStatus = parentPinLimiter.isLockedOut();
    if (lockoutStatus.locked) {
      setLockoutSeconds(lockoutStatus.remainingSeconds);
      setPinError(lang === 'tr' 
        ? `Çok fazla hatalı deneme! Lütfen ${lockoutStatus.remainingSeconds} saniye bekleyin.`
        : `Too many attempts! Please wait ${lockoutStatus.remainingSeconds}s.`);
      return;
    }

    const isValid = await verifyParentPin(pinInput, parentPasscodeHash, parentPasscodeSalt);
    if (isValid) {
      parentPinLimiter.recordSuccess();
      setStep('settings');
      setPinError('');
      setLockoutSeconds(0);
    } else {
      const result = parentPinLimiter.recordFailedAttempt();
      setPinInput('');
      if (result.locked) {
        setLockoutSeconds(result.remainingSeconds);
        setPinError(lang === 'tr' 
          ? `Güvenlik Kilidi: 5 hatalı deneme yapıldı. ${result.remainingSeconds} saniye bekleyin.`
          : `Security Lockout: 5 failed attempts. Please wait ${result.remainingSeconds}s.`);
      } else {
        setPinError(lang === 'tr' 
          ? `Hatalı şifre! (Kalan hak: ${result.attemptsLeft})` 
          : `Incorrect passcode! (${result.attemptsLeft} attempts remaining)`);
      }
    }
  };

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = num1 * num2;
    if (parseInt(mathAnswer, 10) === correct) {
      parentPinLimiter.recordSuccess();
      setLockoutSeconds(0);
      setStep('settings');
      setMathError(false);
    } else {
      setMathError(true);
      setMathAnswer('');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Passcode validation & secure cryptographic hashing
    if (newPin) {
      if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
        setSettingsError(lang === 'tr' ? 'Şifre tam olarak 4 haneli rakamdan oluşmalıdır!' : 'Passcode must be exactly 4 digits!');
        return;
      }
      if (newPin !== confirmPin) {
        setSettingsError(lang === 'tr' ? 'Şifreler eşleşmiyor!' : 'Passcodes do not match!');
        return;
      }
      
      const salt = generateSalt(16);
      const hash = await hashParentPin(newPin, salt);
      onUpdateParentPasscode(hash, salt);
    }

    setSettingsSuccess(true);
    setSettingsError('');
    setNewPin('');
    setConfirmPin('');

    setTimeout(() => {
      setSettingsSuccess(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-orange-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-md border-4 border-orange-300 shadow-2xl overflow-hidden"
      >
        {/* Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white text-center relative border-b-4 border-orange-600">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 text-white p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white/40">
            <Shield size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-black tracking-tight uppercase">
            {lang === 'tr' ? 'GÜVENLİ VELİ PANELİ' : 'SECURE PARENT PANEL'}
          </h3>
          <p className="text-xs font-bold text-orange-50 mt-1">
            {lang === 'tr' ? '🔒 KVKK Uyumlu & Şifreli Veli Denetimi' : '🔒 Secure & Encrypted Parental Controls'}
          </p>
        </div>

        {/* STEP 1: AUTH WITH PASSCODE */}
        {step === 'auth' && (
          <div className="p-6">
            <h4 className="text-sm font-black text-gray-800 text-center mb-4">
              {lang === 'tr' ? 'Lütfen 4 haneli veli şifrenizi girin:' : 'Please enter your 4-digit parent passcode:'}
            </h4>

            <form onSubmit={handlePinSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={4}
                  value={pinInput}
                  disabled={lockoutSeconds > 0}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPinInput(val);
                    if (pinError) setPinError('');
                  }}
                  placeholder="••••"
                  autoFocus
                  className={`w-full text-center tracking-[1em] text-2xl font-black py-3 rounded-2xl border-3 bg-orange-50/30 focus:outline-none focus:bg-orange-50 transition-all ${
                    lockoutSeconds > 0 
                      ? 'border-red-400 bg-red-50 text-red-700 cursor-not-allowed'
                      : pinError 
                        ? 'border-red-500 text-red-600' 
                        : 'border-orange-200 focus:border-orange-400 text-orange-950'
                  }`}
                />
                <button
                  type="button"
                  disabled={lockoutSeconds > 0}
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-600 p-2"
                >
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {lockoutSeconds > 0 && (
                <div className="p-3 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center justify-center gap-2 text-red-700 text-xs font-black text-center">
                  <AlertTriangle size={16} className="text-red-600 shrink-0" />
                  <span>
                    {lang === 'tr' 
                      ? `Güvenlik Kilidi: Lütfen ${lockoutSeconds} saniye bekleyin.` 
                      : `Rate Limited: Please wait ${lockoutSeconds}s.`}
                  </span>
                </div>
              )}

              {pinError && lockoutSeconds === 0 && (
                <p className="text-xs font-bold text-red-600 text-center animate-bounce">
                  ❌ {pinError}
                </p>
              )}

              <button
                type="submit"
                disabled={pinInput.length !== 4 || lockoutSeconds > 0}
                className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider border-b-4 transition-all active:translate-y-0.5 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  pinInput.length === 4 && lockoutSeconds === 0
                    ? 'bg-orange-500 border-orange-700 hover:bg-orange-600 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Check size={18} />
                {lang === 'tr' ? 'Giriş Yap' : 'Unlock Settings'}
              </button>

              {/* Math gate bypass as fallback */}
              <div className="border-t border-gray-100 pt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    generateMathPuzzle();
                    setStep('math');
                  }}
                  className="text-xs font-black text-orange-500 hover:text-orange-700 underline transition-colors cursor-pointer"
                >
                  {lang === 'tr' ? 'Şifremi unuttum? (Matematik Sorusu Çöz)' : 'Forgot Passcode? (Solve Math Challenge)'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: MATH CHALLENGE (KID PROOF FALLBACK) */}
        {step === 'math' && (
          <div className="p-6">
            <h4 className="text-sm font-black text-gray-800 text-center mb-1">
              {lang === 'tr' ? 'Velisiniz değil mi? Soruyu çözün:' : 'Are you a parent? Solve this math challenge:'}
            </h4>
            <p className="text-[11px] font-bold text-gray-400 text-center mb-5">
              {lang === 'tr' ? 'Şifrenizi sıfırlayıp ayarlara girmek için soruyu yanıtlayın.' : 'Solve the puzzle to access settings and reset PIN.'}
            </p>

            <form onSubmit={handleMathSubmit} className="flex flex-col gap-4">
              <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-5 text-center">
                <span className="text-3xl font-black text-orange-950 font-mono">
                  {num1} × {num2} = ?
                </span>
              </div>

              <input
                type="number"
                pattern="\d*"
                value={mathAnswer}
                onChange={(e) => {
                  setMathAnswer(e.target.value);
                  if (mathError) setMathError(false);
                }}
                placeholder={lang === 'tr' ? 'Cevap' : 'Answer'}
                autoFocus
                className={`w-full text-center text-xl font-black py-3 rounded-2xl border-3 bg-orange-50/30 focus:outline-none focus:bg-orange-50 transition-all ${
                  mathError ? 'border-red-500 text-red-600' : 'border-orange-200 focus:border-orange-400 text-orange-950'
                }`}
              />

              {mathError && (
                <p className="text-xs font-bold text-red-600 text-center animate-bounce">
                  ❌ {lang === 'tr' ? 'Yanlış cevap! Tekrar dene.' : 'Wrong answer! Try again.'}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('auth')}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm bg-gray-100 border-2 border-gray-200 hover:bg-gray-200 text-gray-700 transition-all cursor-pointer"
                >
                  {lang === 'tr' ? 'Geri' : 'Back'}
                </button>
                <button
                  type="submit"
                  disabled={!mathAnswer}
                  className="flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider bg-orange-500 border-b-4 border-orange-700 hover:bg-orange-600 text-white shadow-md cursor-pointer"
                >
                  {lang === 'tr' ? 'Doğrula' : 'Verify'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={generateMathPuzzle}
                  className="text-xs font-bold text-orange-500 hover:text-orange-700 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} />
                  {lang === 'tr' ? 'Yeni Soru Sor' : 'Change Question'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: PLAYTIME LIMITS AND PASSCODE MANAGEMENT */}
        {step === 'settings' && (
          <div className="p-6">
            <form onSubmit={handleSaveSettings} className="flex flex-col gap-5">
              
              {/* Playtime Limit Section */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Timer size={14} className="text-orange-500" />
                  <span>{lang === 'tr' ? 'Günlük Oynama Süresi' : 'Daily Playtime Limit'}</span>
                </label>
                <p className="text-[11px] font-bold text-gray-400">
                  {lang === 'tr' 
                    ? 'Miniğin günde kaç dakika oynayabileceğini seçin.' 
                    : 'Select how many minutes your child can play per day.'}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[0, 5, 15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => onUpdatePlaytimeLimit(sanitizeNumber(mins, 0, 300, 0))}
                      className={`py-2 rounded-xl text-xs font-extrabold border-2 transition-all cursor-pointer ${
                        playtimeLimit === mins
                          ? 'bg-orange-500 border-orange-600 text-white shadow-sm font-black'
                          : 'bg-white border-orange-100 hover:bg-orange-50 text-orange-900'
                      }`}
                    >
                      {mins === 0 
                        ? (lang === 'tr' ? 'Sınırsız' : 'Unlimited') 
                        : (lang === 'tr' ? `${mins} Dk` : `${mins} Min`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passcode Config Section with Hashing notice */}
              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                <label className="text-xs font-extrabold text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock size={14} className="text-orange-500" />
                  <span>{lang === 'tr' ? 'Şifreli Veli PIN Belirle' : 'Set Salted Parent PIN'}</span>
                </label>
                <p className="text-[11px] font-bold text-gray-400">
                  {lang === 'tr' 
                    ? 'Şifreniz cihazınızda ve veritabanında tek yönlü SHA-256 ile kriptolanarak saklanır.' 
                    : 'Your PIN is securely hashed using SHA-256 with unique device salt.'}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder={lang === 'tr' ? 'Yeni PIN (4 Rakam)' : 'New PIN (4 Digits)'}
                    className="w-full text-center text-xs font-bold py-2 px-3 rounded-xl border-2 border-orange-100 bg-orange-50/10 focus:outline-none focus:border-orange-400"
                  />
                  <input
                    type="password"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    placeholder={lang === 'tr' ? 'PIN Tekrar' : 'Confirm PIN'}
                    className="w-full text-center text-xs font-bold py-2 px-3 rounded-xl border-2 border-orange-100 bg-orange-50/10 focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              {settingsError && (
                <p className="text-xs font-black text-red-600 text-center bg-red-50 py-1.5 rounded-xl border border-red-100 animate-pulse">
                  ❌ {settingsError}
                </p>
              )}

              {settingsSuccess && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-xs text-center animate-bounce">
                  <Check size={16} />
                  <span>{lang === 'tr' ? 'Kriptolu ayarlar başarıyla kaydedildi!' : 'Encrypted settings saved successfully!'}</span>
                </div>
              )}

              <div className="flex gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 text-gray-700 transition-all cursor-pointer"
                >
                  {lang === 'tr' ? 'Kapat' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={settingsSuccess}
                  className="flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-500 border-b-4 border-emerald-700 hover:bg-emerald-600 text-white shadow-md cursor-pointer transition-all active:translate-y-0.5"
                >
                  {lang === 'tr' ? 'Ayarları Kaydet' : 'Save Settings'}
                </button>
              </div>

            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}

interface LockOverlayProps {
  lang: 'tr' | 'en';
  parentPasscodeHash: string;
  parentPasscodeSalt: string;
  onExtendPlaytime: (minutes: number) => void;
  onUpdateParentPasscode: (hash: string, salt: string) => void;
}

export function PlaytimeLockOverlay({
  lang,
  parentPasscodeHash,
  parentPasscodeSalt,
  onExtendPlaytime,
  onUpdateParentPasscode,
}: LockOverlayProps) {
  const [pin, setPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  
  // Math challenge states for forgot passcode
  const [n1, setN1] = useState<number>(0);
  const [n2, setN2] = useState<number>(0);
  const [ans, setAns] = useState<string>('');
  const [err, setErr] = useState<boolean>(false);
  const [unlockStep, setUnlockStep] = useState<'pin' | 'math' | 'success'>('pin');

  const generatePuzzle = () => {
    setN1(Math.floor(Math.random() * 8) + 6);
    setN2(Math.floor(Math.random() * 7) + 5);
    setAns('');
    setErr(false);
  };

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      const status = parentPinLimiter.isLockedOut();
      if (status.locked) {
        setLockoutSeconds(status.remainingSeconds);
      } else {
        setLockoutSeconds(0);
        setPinError('');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const lockoutStatus = parentPinLimiter.isLockedOut();
    if (lockoutStatus.locked) {
      setLockoutSeconds(lockoutStatus.remainingSeconds);
      setPinError(lang === 'tr' 
        ? `Lütfen ${lockoutStatus.remainingSeconds} saniye bekleyin.`
        : `Please wait ${lockoutStatus.remainingSeconds}s.`);
      return;
    }

    const isValid = await verifyParentPin(pin, parentPasscodeHash, parentPasscodeSalt);
    if (isValid || (!parentPasscodeHash && pin === '1234')) {
      parentPinLimiter.recordSuccess();
      setUnlockStep('success');
      setPin('');
      setPinError('');
      setLockoutSeconds(0);
    } else {
      const result = parentPinLimiter.recordFailedAttempt();
      setPin('');
      if (result.locked) {
        setLockoutSeconds(result.remainingSeconds);
        setPinError(lang === 'tr' 
          ? `Güvenlik Kilidi: ${result.remainingSeconds} saniye bekleyin.`
          : `Lockout: Wait ${result.remainingSeconds}s.`);
      } else {
        setPinError(lang === 'tr' 
          ? `Hatalı şifre! (${result.attemptsLeft} hak kaldı)` 
          : `Wrong PIN! (${result.attemptsLeft} attempts left)`);
      }
    }
  };

  const handleMathVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(ans, 10) === n1 * n2) {
      parentPinLimiter.recordSuccess();
      setUnlockStep('success');
      setLockoutSeconds(0);
    } else {
      setAns('');
      setErr(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-indigo-950 z-[9999] flex flex-col items-center justify-center p-6 text-white overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md text-center flex flex-col items-center gap-6"
      >
        {/* Sleeping Dino Icon */}
        <div className="relative">
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center border-4 border-indigo-400 relative">
            <span className="text-6xl animate-bounce">🦕</span>
          </div>
          <span className="absolute -top-1 -right-1 text-2xl font-black text-yellow-300 animate-pulse">💤</span>
          <span className="absolute top-2 -left-2 text-xl font-black text-yellow-300 animate-pulse delay-75">💤</span>
        </div>

        <div>
          <h2 className="text-3xl font-black text-yellow-400 tracking-tight uppercase">
            {lang === 'tr' ? 'UYKU VAKTİ GELDİ!' : 'TIME TO REST!'}
          </h2>
          <p className="text-xs font-bold text-indigo-200 mt-2 leading-relaxed px-4">
            {lang === 'tr' 
              ? 'Bugün harika şeyler öğrendin! Şimdi gözlerini dinlendirme zamanı. Dino dostun da uykulu...'
              : 'You learned amazing things today! Now it is time to rest your eyes. Your Dino friend is sleepy too...'}
          </p>
        </div>

        {unlockStep === 'pin' && (
          <form onSubmit={handleUnlockSubmit} className="w-full bg-white/10 border-2 border-indigo-500/50 rounded-3xl p-5 flex flex-col gap-4">
            <h4 className="text-xs font-black text-indigo-200 uppercase tracking-wider flex items-center justify-center gap-2">
              <Shield size={14} className="text-yellow-400" />
              <span>{lang === 'tr' ? 'Veliler İçin Süre Uzatma' : 'For Parents Only - Extend Time'}</span>
            </h4>

            <div className="relative">
              <input
                type="password"
                maxLength={4}
                value={pin}
                disabled={lockoutSeconds > 0}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, ''));
                  if (pinError) setPinError('');
                }}
                placeholder="••••"
                className={`w-full text-center tracking-[1em] text-xl font-black py-2.5 rounded-xl border-2 text-white focus:outline-none ${
                  lockoutSeconds > 0
                    ? 'border-red-400 bg-red-950/40 text-red-300'
                    : 'border-indigo-400 bg-indigo-900/40 focus:border-yellow-400'
                }`}
              />
            </div>

            {lockoutSeconds > 0 && (
              <p className="text-xs font-bold text-red-400 text-center">
                ⚠️ {lang === 'tr' ? `Güvenlik Kilidi: ${lockoutSeconds} sn bekleyin` : `Rate limited: Wait ${lockoutSeconds}s`}
              </p>
            )}

            {pinError && lockoutSeconds === 0 && (
              <p className="text-xs font-bold text-red-400 text-center">
                ❌ {pinError}
              </p>
            )}

            <button
              type="submit"
              disabled={pin.length !== 4 || lockoutSeconds > 0}
              className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                pin.length === 4 && lockoutSeconds === 0
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-indigo-950 font-black'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              {lang === 'tr' ? 'Süreyi Aç' : 'Unlock Screen'}
            </button>

            <button
              type="button"
              onClick={() => {
                generatePuzzle();
                setUnlockStep('math');
              }}
              className="text-[10px] font-extrabold text-indigo-300 hover:text-indigo-100 underline cursor-pointer"
            >
              {lang === 'tr' ? 'Veli Şifremi Unuttum? (Matematik Çöz)' : 'Forgot Passcode? (Solve Math Challenge)'}
            </button>
          </form>
        )}

        {unlockStep === 'math' && (
          <form onSubmit={handleMathVerify} className="w-full bg-white/10 border-2 border-indigo-500/50 rounded-3xl p-5 flex flex-col gap-4">
            <h4 className="text-xs font-black text-indigo-200 uppercase tracking-wider">
              {lang === 'tr' ? 'Veli Doğrulaması (Matematik Sorusu)' : 'Parent Verification (Math Challenge)'}
            </h4>
            <div className="bg-indigo-950/60 p-4 rounded-2xl border border-indigo-500/30">
              <span className="text-2xl font-black font-mono text-yellow-300">{n1} × {n2} = ?</span>
            </div>

            <input
              type="number"
              value={ans}
              onChange={(e) => {
                setAns(e.target.value);
                if (err) setErr(false);
              }}
              placeholder="?"
              className="w-full text-center text-lg font-black py-2 rounded-xl border-2 border-indigo-400 bg-indigo-900/40 text-white focus:outline-none focus:border-yellow-400"
            />

            {err && (
              <p className="text-[11px] font-bold text-red-400">{lang === 'tr' ? 'Hatalı cevap, tekrar dene!' : 'Wrong answer, try again!'}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setUnlockStep('pin')}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                {lang === 'tr' ? 'Şifreye Dön' : 'Back to PIN'}
              </button>
              <button
                type="submit"
                disabled={!ans}
                className="flex-1 py-2.5 rounded-xl font-black text-xs bg-yellow-400 hover:bg-yellow-500 text-indigo-950 transition-colors cursor-pointer"
              >
                {lang === 'tr' ? 'Doğrula' : 'Verify'}
              </button>
            </div>
          </form>
        )}

        {unlockStep === 'success' && (
          <div className="w-full bg-white/10 border-2 border-emerald-500/50 rounded-3xl p-6 flex flex-col gap-4 animate-pulse">
            <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Award size={16} />
              <span>{lang === 'tr' ? 'VELİ KİLİDİ AÇILDI!' : 'PARENT ACCESS UNLOCKED!'}</span>
            </h4>
            <p className="text-xs font-bold text-emerald-100">
              {lang === 'tr' ? 'Miniğinize ne kadar ek süre eklemek istersiniz?' : 'How many minutes of extra playtime would you like to add?'}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {[5, 15, 30, 0].map((mins) => (
                <button
                  key={mins}
                  onClick={async () => {
                    onExtendPlaytime(mins);
                    // Also initialize a default encrypted PIN of 1234 if they had no PIN set
                    if (!parentPasscodeHash) {
                      const salt = generateSalt(16);
                      const hash = await hashParentPin('1234', salt);
                      onUpdateParentPasscode(hash, salt);
                    }
                  }}
                  className="py-3 rounded-2xl text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-md cursor-pointer border-b-4 border-emerald-700 active:translate-y-0.5 transition-transform"
                >
                  {mins === 0 
                    ? (lang === 'tr' ? 'Sınırsız Süre' : 'Unlimited Time') 
                    : (lang === 'tr' ? `+${mins} Dakika` : `+${mins} Minutes`)}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
