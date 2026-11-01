export interface SiteImageItem {
  id: string
  page: 'Ana Sayfa' | 'Hakkımızda' | 'Yarasalar' | 'Saha Çalışmaları' | 'Gönüllü Ol'
  title: string
  section: string
  repoPath: string // Dosyanın GitHub repo içindeki tam konumu
  currentUrl: string // Tarayıcıda gösterilen URL
  recommendedRatio?: string
  altPath?: string // İsteğe bağlı .jpg versiyonu
}

export const SITE_IMAGES: SiteImageItem[] = [
  // ── ANA SAYFA ──
  {
    id: 'home-gallery-1',
    page: 'Ana Sayfa',
    title: 'Doğal Mağara ve Kaya Tünekleri (Görsel 1)',
    section: 'Ana Sayfa Belgesel Fotoğraf Galerisi (Kart 3)',
    repoPath: 'public/image/1.webp',
    currentUrl: '/image/1.webp',
    recommendedRatio: '16:9 Yatay',
    altPath: 'public/image/1.jpg',
  },
  {
    id: 'home-gallery-2',
    page: 'Ana Sayfa',
    title: 'Mağara Koloni Tespiti (Görsel 2)',
    section: 'Ana Sayfa Galeri Kartı 6 & Hero Slider',
    repoPath: 'public/image/2.webp',
    currentUrl: '/image/2.webp',
    recommendedRatio: '16:9 Yatay',
    altPath: 'public/image/2.jpg',
  },
  {
    id: 'home-hero-1',
    page: 'Ana Sayfa',
    title: 'Ana Sayfa Gece Gözlemleri (Slayt 1)',
    section: 'Üst Manşet Slider (Hero Slayt 1)',
    repoPath: 'public/image/ana-sayfa/hero-1.webp',
    currentUrl: '/image/ana-sayfa/hero-1.webp',
    recommendedRatio: '16:9 Geniş Açı',
  },
  {
    id: 'home-morfoloji',
    page: 'Ana Sayfa',
    title: 'Yarasa Morfolojisi ve Tür İncelemesi',
    section: 'Hakkımızda Bölümü Görseli (Doğa İle Uzlaşık Yaşam)',
    repoPath: 'public/image/yarasalar/yarasa-morfoloji-inceleme.webp',
    currentUrl: '/image/yarasalar/yarasa-morfoloji-inceleme.webp',
    recommendedRatio: '4:3',
  },

  // ── HAKKIMIZDA ──
  {
    id: 'about-sahaekibi',
    page: 'Hakkımızda',
    title: 'Saha Ekibi Fotoğrafı (sahaekibi.jpg)',
    section: 'Derneğimizin Tanıtımı Yanındaki Kurumsal Kart',
    repoPath: 'public/image/sahaekibi.webp',
    currentUrl: '/image/sahaekibi.webp',
    recommendedRatio: '4:3 veya 16:9 Dik/Yatay',
    altPath: 'public/image/sahaekibi.jpg',
  },
  {
    id: 'about-logo',
    page: 'Hakkımızda',
    title: 'Resmi Dernek Logosu',
    section: 'Header ve Hakkımızda Başlık Alanı Logosu',
    repoPath: 'public/image/logo.png',
    currentUrl: '/image/logo.png',
    recommendedRatio: 'Şeffaf PNG / Kare',
  },

  // ── YARASALAR HAKKINDA ──
  {
    id: 'bat-tarihi-yapilar',
    page: 'Yarasalar',
    title: 'Tarihi Yapılarda Tünek ve Koloni Kontrolleri (Görsel 4)',
    section: 'Tünek Alanları Örnekleri (2. Kart)',
    repoPath: 'public/image/4.webp',
    currentUrl: '/image/4.webp',
    recommendedRatio: '4:3 veya 16:9 Yatay',
    altPath: 'public/image/4.jpg',
  },
  {
    id: 'bat-kis-kolonisi',
    page: 'Yarasalar',
    title: 'Doğal Mağara Tüneği – Kış Kolonisi (Görsel 5)',
    section: 'Tünek Alanları Örnekleri (3. Kart)',
    repoPath: 'public/image/5.webp',
    currentUrl: '/image/5.webp',
    recommendedRatio: '4:3 veya 16:9 Yatay',
    altPath: 'public/image/5.jpg',
  },
  {
    id: 'bat-gece-ucan',
    page: 'Yarasalar',
    title: 'Gece Uçuş Aktivitesi & Ekolokasyon',
    section: 'Biyoindikatör Değeri Altındaki Geniş Görsel',
    repoPath: 'public/image/yarasalar/gece-ucan-yarasalar.webp',
    currentUrl: '/image/yarasalar/gece-ucan-yarasalar.webp',
    recommendedRatio: '16:9 Geniş',
  },

  // ── SAHA ÇALIŞMALARI ──
  {
    id: 'saha-kagir-derz',
    page: 'Saha Çalışmaları',
    title: 'Tarihi Kâgir Yapı Derz ve Çatlak Kontrolü',
    section: '16 Fotoğraflık Arşiv (2. Kart)',
    repoPath: 'public/image/saha-calismalari/tarihi-kagir-derz-kontrol.webp',
    currentUrl: '/image/saha-calismalari/tarihi-kagir-derz-kontrol.webp',
    recommendedRatio: '16:9',
    altPath: 'public/image/saha-calismalari/tarihi-kagir-derz-kontrol.jpg',
  },
  {
    id: 'saha-kopru-alti',
    page: 'Saha Çalışmaları',
    title: 'Köprü Altı Akşam Çıkış Sayımı & Gözlem',
    section: '16 Fotoğraflık Arşiv (9. Kart)',
    repoPath: 'public/image/saha-calismalari/kopru-alti-cikis-sayimi.webp',
    currentUrl: '/image/saha-calismalari/kopru-alti-cikis-sayimi.webp',
    recommendedRatio: '16:9',
    altPath: 'public/image/saha-calismalari/kopru-alti-cikis-sayimi.jpg',
  },
  {
    id: 'saha-alacakaranlik',
    page: 'Saha Çalışmaları',
    title: 'Alacakaranlıkta Ultrasonik Ses Dinleme',
    section: '16 Fotoğraflık Arşiv (14. Kart)',
    repoPath: 'public/image/saha-calismalari/alacakaranlikta-ultrasonik-dinleme.webp',
    currentUrl: '/image/saha-calismalari/alacakaranlikta-ultrasonik-dinleme.webp',
    recommendedRatio: '16:9',
    altPath: 'public/image/saha-calismalari/alacakaranlikta-ultrasonik-dinleme.jpg',
  },
  {
    id: 'saha-kilicozu',
    page: 'Saha Çalışmaları',
    title: 'Kılıçözü Deresi Ripariyen Koridoru & Uçuş Hattı',
    section: '16 Fotoğraflık Arşiv (5. Kart)',
    repoPath: 'public/image/saha-calismalari/kilicozu-deresi-ripariyen-koridoru.webp',
    currentUrl: '/image/saha-calismalari/kilicozu-deresi-ripariyen-koridoru.webp',
    recommendedRatio: '16:9',
    altPath: 'public/image/saha-calismalari/kilicozu-deresi-ripariyen-koridoru.jpg',
  },
  {
    id: 'saha-batlogger',
    page: 'Saha Çalışmaları',
    title: 'Elekon Batlogger S2 Cihaz Görseli',
    section: 'Ekipman ve Akustik Altyapı Bölümü (1. Cihaz)',
    repoPath: 'public/image/batlogger.jpg',
    currentUrl: '/image/batlogger.jpg',
    recommendedRatio: '4:3',
  },
  {
    id: 'saha-batexplorer',
    page: 'Saha Çalışmaları',
    title: 'BatExplorer & Endoskop Kamera Cihaz Görseli',
    section: 'Ekipman ve Akustik Altyapı Bölümü (2. & 3. Cihaz)',
    repoPath: 'public/image/batexplorer.webp',
    currentUrl: '/image/batexplorer.webp',
    recommendedRatio: '4:3',
    altPath: 'public/image/batexplorer.jpg',
  },

  // ── GÖNÜLLÜ OL ──
  {
    id: 'gonullu-stand',
    page: 'Gönüllü Ol',
    title: 'Ahi Evran Üniversitesi Tanıtım Standı',
    section: 'Gönüllü Ol Giriş Bölümü Yan Kartı',
    repoPath: 'public/image/gonullu-ol/gonullu-universite-stant.webp',
    currentUrl: '/image/gonullu-ol/gonullu-universite-stant.webp',
    recommendedRatio: '16:9 Yatay',
  },
  {
    id: 'gonullu-gece',
    page: 'Gönüllü Ol',
    title: 'Gönüllü Saha Gece Gözlemi',
    section: 'Gönüllülük Formu Yanındaki Mini Galeri',
    repoPath: 'public/image/gonullu-ol/gonullu-gece-gozlemi.webp',
    currentUrl: '/image/gonullu-ol/gonullu-gece-gozlemi.webp',
    recommendedRatio: '16:9',
  },
]
