import { LetterItem, NumberItem, ColorItem } from './types';

export const TURKISH_ALPHABET: LetterItem[] = [
  { letter: 'A', word: { tr: 'Araba', en: 'Car' }, emoji: '🚗' },
  { letter: 'B', word: { tr: 'Balık', en: 'Fish' }, emoji: '🐟' },
  { letter: 'C', word: { tr: 'Civciv', en: 'Chick' }, emoji: '🐥' },
  { letter: 'Ç', word: { tr: 'Çilek', en: 'Strawberry' }, emoji: '🍓' },
  { letter: 'D', word: { tr: 'Dinozor', en: 'Dinosaur' }, emoji: '🦖' },
  { letter: 'E', word: { tr: 'Elma', en: 'Apple' }, emoji: '🍎' },
  { letter: 'F', word: { tr: 'Fil', en: 'Elephant' }, emoji: '🐘' },
  { letter: 'G', word: { tr: 'Güneş', en: 'Sun' }, emoji: '☀️' },
  { letter: 'Ğ', word: { tr: 'Ağaç (Yumuşak G)', en: 'Tree' }, emoji: '🌳' }, // Ğ is inside words
  { letter: 'H', word: { tr: 'Havuç', en: 'Carrot' }, emoji: '🥕' },
  { letter: 'I', word: { tr: 'Ispanak', en: 'Spinach' }, emoji: '🥬' },
  { letter: 'İ', word: { tr: 'İnek', en: 'Cow' }, emoji: '🐄' },
  { letter: 'J', word: { tr: 'Jet', en: 'Jet' }, emoji: '🛩️' },
  { letter: 'K', word: { tr: 'Köpek', en: 'Dog' }, emoji: '🐶' },
  { letter: 'L', word: { tr: 'Limon', en: 'Lemon' }, emoji: '🍋' },
  { letter: 'M', word: { tr: 'Maymun', en: 'Monkey' }, emoji: '🐒' },
  { letter: 'N', word: { tr: 'Nar', en: 'Pomegranate' }, emoji: '🍎' },
  { letter: 'O', word: { tr: 'Otobüs', en: 'Bus' }, emoji: '🚌' },
  { letter: 'Ö', word: { tr: 'Ördek', en: 'Duck' }, emoji: '🦆' },
  { letter: 'P', word: { tr: 'Papatya', en: 'Daisy' }, emoji: '🌼' },
  { letter: 'R', word: { tr: 'Radyo', en: 'Radio' }, emoji: '📻' },
  { letter: 'S', word: { tr: 'Sincap', en: 'Squirrel' }, emoji: '🐿️' },
  { letter: 'Ş', word: { tr: 'Şemsiye', en: 'Umbrella' }, emoji: '☂️' },
  { letter: 'T', word: { tr: 'Tavşan', en: 'Rabbit' }, emoji: '🐇' },
  { letter: 'U', word: { tr: 'Uçak', en: 'Airplane' }, emoji: '✈️' },
  { letter: 'Ü', word: { tr: 'Üzüm', en: 'Grapes' }, emoji: '🍇' },
  { letter: 'V', word: { tr: 'Vazo', en: 'Vase' }, emoji: '🏺' },
  { letter: 'Y', word: { tr: 'Yıldız', en: 'Star' }, emoji: '⭐' },
  { letter: 'Z', word: { tr: 'Zebra', en: 'Zebra' }, emoji: '🦓' }
];

export const ENGLISH_ALPHABET: LetterItem[] = [
  { letter: 'A', word: { tr: 'Elma', en: 'Apple' }, emoji: '🍎' },
  { letter: 'B', word: { tr: 'Muz', en: 'Banana' }, emoji: '🍌' },
  { letter: 'C', word: { tr: 'Kedi', en: 'Cat' }, emoji: '🐱' },
  { letter: 'D', word: { tr: 'Köpek', en: 'Dog' }, emoji: '🐶' },
  { letter: 'E', word: { tr: 'Fil', en: 'Elephant' }, emoji: '🐘' },
  { letter: 'F', word: { tr: 'Kurbağa', en: 'Frog' }, emoji: '🐸' },
  { letter: 'G', word: { tr: 'Zürafa', en: 'Giraffe' }, emoji: '🦒' },
  { letter: 'H', word: { tr: 'Şapka', en: 'Hat' }, emoji: '🎩' },
  { letter: 'I', word: { tr: 'Buz Evi', en: 'Igloo' }, emoji: '⛺' },
  { letter: 'J', word: { tr: 'Deniz Anası', en: 'Jellyfish' }, emoji: '🪼' },
  { letter: 'K', word: { tr: 'Kanguru', en: 'Kangaroo' }, emoji: '🦘' },
  { letter: 'L', word: { tr: 'Aslan', en: 'Lion' }, emoji: '🦁' },
  { letter: 'M', word: { tr: 'Maymun', en: 'Monkey' }, emoji: '🐒' },
  { letter: 'N', word: { tr: 'Kuş Yuvası', en: 'Nest' }, emoji: '🪹' },
  { letter: 'O', word: { tr: 'Ahtapot', en: 'Octopus' }, emoji: '🐙' },
  { letter: 'P', word: { tr: 'Penguen', en: 'Penguin' }, emoji: '🐧' },
  { letter: 'Q', word: { tr: 'Kraliçe', en: 'Queen' }, emoji: '👸' },
  { letter: 'R', word: { tr: 'Tavşan', en: 'Rabbit' }, emoji: '🐇' },
  { letter: 'S', word: { tr: 'Güneş', en: 'Sun' }, emoji: '☀️' },
  { letter: 'T', word: { tr: 'Kaplan', en: 'Tiger' }, emoji: '🐯' },
  { letter: 'U', word: { tr: 'Şemsiye', en: 'Umbrella' }, emoji: '☂️' },
  { letter: 'V', word: { tr: 'Keman', en: 'Violin' }, emoji: '🎻' },
  { letter: 'W', word: { tr: 'Karpuz', en: 'Watermelon' }, emoji: '🍉' },
  { letter: 'X', word: { tr: 'Ksilofon', en: 'Xylophone' }, emoji: '🎹' },
  { letter: 'Y', word: { tr: 'Yat', en: 'Yacht' }, emoji: '⛵' },
  { letter: 'Z', word: { tr: 'Zebra', en: 'Zebra' }, emoji: '🦓' }
];

export const NUMBERS: NumberItem[] = [
  { value: 1, word: { tr: 'Bir', en: 'One' }, emoji: '🎈' },
  { value: 2, word: { tr: 'İki', en: 'Two' }, emoji: '🦆' },
  { value: 3, word: { tr: 'Üç', en: 'Three' }, emoji: '🐝' },
  { value: 4, word: { tr: 'Dört', en: 'Four' }, emoji: '🍀' },
  { value: 5, word: { tr: 'Beş', en: 'Five' }, emoji: '⭐' },
  { value: 6, word: { tr: 'Altı', en: 'Six' }, emoji: '🐞' },
  { value: 7, word: { tr: 'Yedi', en: 'Seven' }, emoji: '🍎' },
  { value: 8, word: { tr: 'Sekiz', en: 'Eight' }, emoji: '🐙' },
  { value: 9, word: { tr: 'Dokuz', en: 'Nine' }, emoji: '🐠' },
  { value: 10, word: { tr: 'On', en: 'Ten' }, emoji: '🍒' },
  { value: 11, word: { tr: 'On Bir', en: 'Eleven' }, emoji: '🍄' },
  { value: 12, word: { tr: 'On İki', en: 'Twelve' }, emoji: '🍭' },
  { value: 13, word: { tr: 'On Üç', en: 'Thirteen' }, emoji: '🦖' },
  { value: 14, word: { tr: 'On Dört', en: 'Fourteen' }, emoji: '🚗' },
  { value: 15, word: { tr: 'On Beş', en: 'Fifteen' }, emoji: '🧁' },
  { value: 16, word: { tr: 'On Altı', en: 'Sixteen' }, emoji: '⚽' },
  { value: 17, word: { tr: 'On Yedi', en: 'Seventeen' }, emoji: '🦋' },
  { value: 18, word: { tr: 'On Sekiz', en: 'Eighteen' }, emoji: '🍪' },
  { value: 19, word: { tr: 'On Dokuz', en: 'Nineteen' }, emoji: '🚀' },
  { value: 20, word: { tr: 'Yirmi', en: 'Twenty' }, emoji: '🌟' }
];

export const COLORS: ColorItem[] = [
  {
    id: 'red',
    name: { tr: 'Kırmızı', en: 'Red' },
    hex: '#FF4D4D',
    textColor: 'text-white',
    bgClass: 'bg-red-500',
    borderClass: 'border-red-600',
    emojis: ['🍎', '🍓', '🍒', '🚗', '🦀'],
    items: {
      tr: ['Elma', 'Çilek', 'Kiraz', 'Oyuncak Araba', 'Yengeç'],
      en: ['Apple', 'Strawberry', 'Cherry', 'Toy Car', 'Crab']
    }
  },
  {
    id: 'blue',
    name: { tr: 'Mavi', en: 'Blue' },
    hex: '#3B82F6',
    textColor: 'text-white',
    bgClass: 'bg-blue-500',
    borderClass: 'border-blue-600',
    emojis: ['🐳', '🐬', '🐦', '👖', '⛵'],
    items: {
      tr: ['Balina', 'Yunus', 'Mavi Kuş', 'Kot Pantolon', 'Yelkenli'],
      en: ['Whale', 'Dolphin', 'Blue Bird', 'Jeans', 'Sailboat']
    }
  },
  {
    id: 'yellow',
    name: { tr: 'Sarı', en: 'Yellow' },
    hex: '#FBBF24',
    textColor: 'text-yellow-950',
    bgClass: 'bg-yellow-400',
    borderClass: 'border-yellow-500',
    emojis: ['☀️', '🍌', '🍋', '🐥', '🧀'],
    items: {
      tr: ['Güneş', 'Muz', 'Limon', 'Civciv', 'Peynir'],
      en: ['Sun', 'Banana', 'Lemon', 'Chick', 'Cheese']
    }
  },
  {
    id: 'green',
    name: { tr: 'Yeşil', en: 'Green' },
    hex: '#10B981',
    textColor: 'text-white',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-600',
    emojis: ['🐸', '🐢', '🥦', '🍏', '🌲'],
    items: {
      tr: ['Kurbağa', 'Kaplumbağa', 'Brokoli', 'Yeşil Elma', 'Ağaç'],
      en: ['Frog', 'Turtle', 'Broccoli', 'Green Apple', 'Tree']
    }
  },
  {
    id: 'orange',
    name: { tr: 'Turuncu', en: 'Orange' },
    hex: '#F97316',
    textColor: 'text-white',
    bgClass: 'bg-orange-500',
    borderClass: 'border-orange-600',
    emojis: ['🍊', '🥕', '🦊', '🎃', '🏀'],
    items: {
      tr: ['Portakal', 'Havuç', 'Tilki', 'Balkabağı', 'Basketbol Topu'],
      en: ['Orange', 'Carrot', 'Fox', 'Pumpkin', 'Basketball']
    }
  },
  {
    id: 'purple',
    name: { tr: 'Mor', en: 'Purple' },
    hex: '#8B5CF6',
    textColor: 'text-white',
    bgClass: 'bg-purple-500',
    borderClass: 'border-purple-600',
    emojis: ['🍇', '🍆', 'octopus', '🔮', '🐙'],
    items: {
      tr: ['Üzüm', 'Patlıcan', 'Ahtapot', 'Sihirli Küre', 'Ahtapot'],
      en: ['Grapes', 'Eggplant', 'Octopus', 'Magic Orb', 'Octopus']
    }
  },
  {
    id: 'pink',
    name: { tr: 'Pembe', en: 'Pink' },
    hex: '#EC4899',
    textColor: 'text-white',
    bgClass: 'bg-pink-500',
    borderClass: 'border-pink-600',
    emojis: ['🦩', '🐷', '🌸', '🍩', '🎈'],
    items: {
      tr: ['Flamingo', 'Domuzcuk', 'Çiçek', 'Donut', 'Pembe Balon'],
      en: ['Flamingo', 'Piggy', 'Flower', 'Donut', 'Pink Balloon']
    }
  },
  {
    id: 'brown',
    name: { tr: 'Kahverengi', en: 'Brown' },
    hex: '#78350F',
    textColor: 'text-white',
    bgClass: 'bg-amber-800',
    borderClass: 'border-amber-900',
    emojis: ['🐻', '🐒', '🪵', '🍫', '🥔'],
    items: {
      tr: ['Ayıcık', 'Maymun', 'Odun', 'Çikolata', 'Patates'],
      en: ['Teddy Bear', 'Monkey', 'Wood Log', 'Chocolate', 'Potato']
    }
  },
  {
    id: 'black',
    name: { tr: 'Siyah', en: 'Black' },
    hex: '#111827',
    textColor: 'text-white',
    bgClass: 'bg-gray-900',
    borderClass: 'border-gray-950',
    emojis: ['🐈‍⬛', '🕷️', '🛞', '🐼', '🎩'],
    items: {
      tr: ['Kara Kedi', 'Örümcek', 'Tekerlek', 'Panda', 'Sihirbaz Şapkası'],
      en: ['Black Cat', 'Spider', 'Wheel', 'Panda', 'Magician Hat']
    }
  },
  {
    id: 'white',
    name: { tr: 'Beyaz', en: 'White' },
    hex: '#FFFFFF',
    textColor: 'text-gray-800',
    bgClass: 'bg-white',
    borderClass: 'border-gray-200',
    emojis: ['⛄', '🐇', '🥛', '☁️', '🦢'],
    items: {
      tr: ['Kardan Adam', 'Beyaz Tavşan', 'Süt', 'Bulut', 'Kuğu'],
      en: ['Snowman', 'White Rabbit', 'Milk', 'Cloud', 'Swan']
    }
  }
];
