export type Language = 'tr' | 'en';

export interface LetterItem {
  letter: string;
  word: {
    tr: string;
    en: string;
  };
  emoji: string;
  exampleImage?: string; // fallback or supplementary
}

export interface NumberItem {
  value: number;
  word: {
    tr: string;
    en: string;
  };
  emoji: string;
}

export interface ColorItem {
  id: string;
  name: {
    tr: string;
    en: string;
  };
  hex: string;
  textColor: string; // for high-contrast on color pills
  bgClass: string;   // Tailwind class
  borderClass: string;
  emojis: string[];
  items: {
    tr: string[];
    en: string[];
  };
}

export type ActiveTab = 'alphabet' | 'numbers' | 'colors' | 'writing' | 'body_parts' | 'animals' | 'opposites' | 'routines' | 'nature' | 'transport' | 'emotions' | 'coloring' | 'puzzle';
