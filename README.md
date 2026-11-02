# 🎓 Minik Akademi (Kids Learning & Writing App)

[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38b2ac?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v12-ffca28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![KVKK 2026 Compliant](https://img.shields.io/badge/KVKK_2026-Uyumlu-10b981?style=flat-square)](https://www.kvkk.gov.tr/)
[![COPPA & Child Safe](https://img.shields.io/badge/COPPA-Child_Safe-blue?style=flat-square)](#-bilgi-güvenliği-ve-2026-kvkk-uyumluluğu)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

> **Minik Akademi**, 3-8 yaş okul öncesi ve ilkokul çağı çocukları için tasarlanmış; Türk Alfabesi, el yazısı çizim tahtası, sayılar, renkler, hayvanlar, duygular ve zeka oyunlarını bir araya getiren **%100 ücretsiz, güvenli ve reklamsız/kişiselleştirilmemiş çocuk dostu** web uygulamasıdır.

---

## 🌟 Öne Çıkan Özellikler

### 1. 📚 13 Eğitici ve İnteraktif Modül
- 🔤 **Türk Alfabesi:** 29 harfin sesli telaffuzu, örnek kelimeler ve görsel kartlar.
- ✍️ **El Yazısı & Çizim Laboratuvarı:** Kesik çizgili kılavuzlar, gökkuşağı ve neon fırçalar, silgi, geri alma geçmişi (bellek sızıntı korumalı) ve PNG indirme desteği.
- 🔢 **Sayılar & Sayma:** 1-20 arası sayılar, dinamik nesne saydırma ve parmakla sayma görselleştirmesi.
- 🎨 **Renkler & Şekiller:** Renk eşleştirme ve sürükle-bırak geometrik şekil algılama testleri.
- 🦁 **Hayvanlar Alemi & Sesler:** Çiftlik, orman ve deniz canlıları; gerçekçi ses efektleri ve Türkçe telaffuzlar.
- 👁️ **Vücudumuz & Organlar:** İnteraktif anatomi keşfi ve organların görevleri.
- ⚖️ **Zıt Kavramlar:** Büyük/Küçük, Sıcak/Soğuk, Hızlı/Yavaş gibi temel kavramların karşılaştırmalı eğitimi.
- ☀️ **Günlük Rutinler:** Diş fırçalama, el yıkama, uyku ve kitap okuma alışkanlık takipçisi.
- 🌦️ **Doğa & Hava Durumu:** Mevsimler, hava olayları ve doğa bilinci animasyonları.
- 🚗 **Taşıtlar & Trafik:** Kara, hava ve deniz taşıtları ile temel trafik ışığı kuralları.
- 😊 **Duygular & Empati:** Mutlu, üzgün, şaşkın duyguları tanıma ve empati geliştirme etkinlikleri.
- 🖍️ **İnteraktif Boyama Kitabı:** Şablonlu boyama sayfaları ve yaratıcı serbest tuval.
- 🧩 **Zeka & Hafıza Bulmacaları:** 4x4 hafıza eşleştirme kartları ve yapbozlar.

### 2. 🎮 Oyunlaştırma ve Öğrenme Yoldaşları
- **Dinamik XP ve Rozet Sistemi:** Tamamlanan her etkinlikte tebrik sesleri ve yıldız puanları.
- **Sevimli Maskotlar:** Kartal Kaan 🦅, Aslan Leo 🦁 ve Dino T-Rex 🦖 çocukların öğrenme sürecine eşlik eder.
- **İki Dilli Telaffuz Desteği:** Web Speech API kullanılarak Türkçe ve İngilizce net telaffuz motoru.

### 3. 🛡️ Ebeveyn Kapısı & Ekran Süresi Kontrolü
- **PBKDF2 Şifreli 4 Haneli PIN:** Ebeveyn paneline çocukların erişimini engelleyen kriptografik güvenlik.
- **Akıllı Süre Kısıtı (Ekran Zamanlayıcısı):** 15, 30, 45 veya 60 dakikalık oturumlar; süre dolduğunda otomatik uyku/kilit ekranı.
- **Yedek Doğrulama:** PIN unutulması durumunda rastgele üretilen 2 basamaklı matematiksel işlem doğrulaması.

---

## 🔒 Bilgi Güvenliği ve 2026 KVKK Uyumluluğu

Uygulama, **2026 yılı Türkiye Kişisel Verilerin Korunması Kanunu (KVKK)** çocuk hakları düzenlemeleri ve küresel **COPPA/GDPR-K** standartlarına tam uyumlu olarak geliştirilmiştir:

1. **Sıfır Biyometrik ve Özel Nitelikli Veri:** Çocukların kimliğini belirtebilecek hiçbir ses kaydı, kamera görüntüsü veya PII (Kişisel Tanımlanabilir Bilgi) sunucularda saklanmaz.
2. **Kişiselleştirilmemiş Çocuk Güvenli Reklam (NPA):** Google AdSense entegrasyonu `googletag.pubads().setRequestNonPersonalizedAds(1)` ve `pagead2.googlesyndication.com` çocuk koruma direktifleriyle yapılandırılmıştır. Davranışsal hedefleme ve çerez takibi kesinlikle engellenmiştir.
3. **Kriptografik Güvenlik (PBKDF2):** Ebeveyn PIN'leri salt + 100.000 iterasyonlu Web Crypto API PBKDF2-SHA256 ile şifrelenir; açık metin olarak asla tutulmaz.
4. **Brute-Force & Bot Koruması:** 5 başarısız PIN denemesinde sistem 30 saniyelik zaman aşımı (rate-limiting) uygular.
5. **Satır Düzeyi Güvenlik (Row-Level Security - RLS):** Firestore güvenlik kuralları (`firestore.rules`) ile her ebeveyn sadece kendi hesabına ait ilerleme verilerine erişebilir; genel veri tabanı okumaları kısıtlıdır.
6. **İçerik Güvenlik Politikası (CSP) & XSS Koruması:** Tüm SVG ve metin girdileri sanitize edilir, `eval()` ve riskli inline betikler engellenir.
7. **Hata Yakalama (React 19 Error Boundary):** Beklenmedik durumlarda ekranın çökmesini engelleyen çocuk dostu hata kurtarma mekanizması.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

| Alan | Teknoloji | Açıklama |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Yüksek performanslı ve modern bileşen mimarisi |
| **Derleyici & Sunucu** | Vite 6.0 | Anında HMR ve optimize edilmiş üretim derlemesi |
| **Stil & Tasarım** | Tailwind CSS v4 + Motion | Modern renk paletleri ve akıcı animasyonlar |
| **İkon Seti** | Lucide React | Çocuk dostu, net ve hafif vektörel ikonlar |
| **Ses Motoru** | Web Speech API & HTML5 Audio | Tarayıcı tabanlı sıfır maliyetli seslendirme |
| **Çizim Motoru** | HTML5 Canvas 2D | Dokunmatik uyumlu, basınç duyarlı el yazısı tuvali |
| **Kimlik & Bulut Eşitleme** | Firebase 12 (Auth & Firestore) | İsteğe bağlı Google ile güvenli giriş ve ilerleme kaydetme |

---

## 🚀 Hızlı Başlangıç & Kurulum

### Gereksinimler
- Node.js (v18.0.0 veya üzeri)
- npm (v9.0.0 veya üzeri)

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/ersinozbucak/kids-learning-writing-app.git
cd kids-learning-writing-app
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Ortam Değişkenlerini Tanımlayın
`.env.example` dosyasını `.env` olarak kopyalayın:
```bash
cp .env.example .env
```
Gereken Firebase ortam değişkenlerini (isteğe bağlıdır, bulut eşitleme istenmezse uygulama yerel depolama ile %100 çevrimdışı ve ücretsiz çalışır) doldurun:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda `http://localhost:3000` adresine gidin.

### 5. Üretim İçin Derleyin
```bash
npm run build
```

---

## 📁 Proje Dizin Yapısı

```text
├── index.html                  # HTML5 giriş noktası & Google AdSense NPA yapılandırması
├── metadata.json               # AI Studio & Applet meta veri tanımları
├── package.json                # Bağımlılıklar ve derleme betikleri
├── firestore.rules             # Firestore Satır Düzeyi Güvenlik (RLS) kuralları
├── src/
│   ├── main.tsx                # React kök renderleyici
│   ├── App.tsx                 # Ana uygulama yöneticisi, navigasyon ve durum yönetimi
│   ├── index.css               # Tailwind CSS v4 temel yönergeleri
│   ├── components/
│   │   ├── WritingCanvas.tsx   # El yazısı ve boyama tuvali (bellek korumalı)
│   │   ├── AlphabetModule.tsx  # Türk alfabesi modülü
│   │   ├── NumbersModule.tsx   # Sayılar ve sayma modülü
│   │   ├── ColorsModule.tsx    # Renkler ve şekiller modülü
│   │   ├── AnimalsModule.tsx   # Hayvanlar alemi ve sesler
│   │   ├── BodyPartsModule.tsx # Vücudumuz modülü
│   │   ├── OppositesModule.tsx # Zıt kavramlar
│   │   ├── RoutinesModule.tsx  # Günlük rutinler
│   │   ├── NatureModule.tsx    # Doğa ve hava durumu
│   │   ├── TransportModule.tsx # Taşıtlar ve trafik
│   │   ├── EmotionsModule.tsx  # Duygular ve empati
│   │   ├── ColoringBook.tsx    # İnteraktif boyama kitabı
│   │   ├── PuzzleGame.tsx      # Hafıza ve eşleştirme oyunu
│   │   ├── ParentControl.tsx   # Ebeveyn kapısı, süre sayacı ve PIN yönetimi
│   │   ├── CookieConsent.tsx   # 2026 KVKK uyumlu çerez ve gizlilik onay paneli
│   │   └── ErrorBoundary.tsx   # React 19 hata yakalayıcı ve kurtarma arayüzü
│   ├── data/
│   │   └── curriculumData.ts   # 13 modül için müfredat ve kelime veri tabanı
│   └── utils/
│       ├── security.ts         # PBKDF2 şifreleme, rate-limiter, XSS temizleme
│       └── speak.ts            # Web Speech API sentezleyicisi (TR/EN)
└── README.md                   # Proje dokümantasyonu
```

---

## 📬 İletişim, Öneri ve Görüşler

Uygulama hakkındaki her türlü öneri, hata bildirimi, müfredat talebi veya KVKK veri sorumlusu başvuruları için:

- **Yetkili / Geliştirici:** Ersin ÖZBUCAK
- **E-Posta:** [ersin@ozbucak.com.tr](mailto:ersin@ozbucak.com.tr)
- **Yedek İletişim:** [ersinozbucak@gmail.com](mailto:ersinozbucak@gmail.com)

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Eğitim kurumları, öğretmenler, ebeveynler ve çocuklar tarafından tamamen ücretsiz olarak kullanılabilir ve geliştirilebilir.
