import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cookie, Info, X } from 'lucide-react';
import { secureStorage } from '../utils/security';
import { Language } from '../types';

interface CookieConsentProps {
  lang: Language;
  onOpenPrivacyModal: () => void;
}

export default function CookieConsent({ lang, onOpenPrivacyModal }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted or acknowledged cookie consent
    const consent = secureStorage.get('cookie_consent_status');
    if (!consent) {
      // Delay display slightly for smooth page entry
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    secureStorage.set('cookie_consent_status', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md bg-white/95 backdrop-blur-md border-3 border-amber-300 rounded-3xl p-4 shadow-2xl z-40 text-gray-800"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
            <Cookie size={22} className="text-amber-700" />
          </div>

          <div className="flex-1">
            <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5 uppercase tracking-tight">
              <span>{lang === 'tr' ? 'Çerez & Gizlilik Bilgilendirmesi' : 'Cookie & Privacy Notice'}</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                2026 KVKK
              </span>
            </h4>
            <p className="text-[11px] font-semibold text-gray-600 mt-1 leading-relaxed">
              {lang === 'tr' 
                ? 'Minik Akademi, güvenli oturum yönetimi ve çocuk dostu (kişiselleştirilmemiş) Google reklamları için zorunlu ve işlevsel çerezler kullanır.' 
                : 'Minik Akademi uses essential and functional cookies for secure sessions and child-safe (non-personalized) Google advertisements.'}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer text-center"
              >
                {lang === 'tr' ? 'Kabul Ediyorum' : 'I Understand'}
              </button>
              <button
                onClick={onOpenPrivacyModal}
                className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-colors cursor-pointer flex items-center gap-1"
                title={lang === 'tr' ? 'Aydınlatma Metni' : 'Privacy Details'}
              >
                <Info size={13} />
                <span>{lang === 'tr' ? 'Detaylar' : 'Policy'}</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 p-1 -mr-1 -mt-1 cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
