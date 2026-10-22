import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Swiper from 'swiper'
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules'
import NewsletterForm from '../components/NewsletterForm'
import ImageLightbox, { type LightboxImage } from '../components/ImageLightbox'
import { useLangStore } from '../store/langStore'

const slides = [
  {
    img: '/image/ana-sayfa/hero-1.webp',
    title: 'Yarasa Araştırmaları Derneği',
    desc: 'Kentsel Ekosistemlerde ve Doğal Yaşam Alanlarında Yarasaları Keşfediyoruz',
    extra: true,
  },
  {
    img: '/image/ana-sayfa/hero-3.webp',
    title: 'Doğal Tünek Alanları ve Yuva Kontrolü',
    desc: 'Mağaralar, kaya çatlakları, eski yapılar ve nehir koridorunda sistematik yuva kontrolleri ve koruma haritalandırması.',
  },
  {
    img: '/image/ana-sayfa/hero-4.webp',
    title: 'Akustik İzleme (Ses Dinleme)',
    desc: 'Elekon Batlogger S2 ultrasonik ses dinleme dedektörleriyle insan kulağının duyamadığı ses frekanslarını kaydediyor ve analiz ediyoruz.',
  },
  {
    img: '/image/ana-sayfa/hero-2.webp',
    title: 'Bilimsel Arazi Çalışmaları',
    desc: 'Akademisyenler, uzman biyologlar ve eğitimli gözlemcilerle İç Anadolu biyoçeşitliliği için gece transektleri gerçekleştiriyoruz.',
  },
  {
    img: '/image/ana-sayfa/hero-5.webp',
    title: 'Toplum Bilimi & Doğayı Birlikte Koruyoruz',
    desc: 'Yarasalar ekosistemin doğal dengesini sağlar. Gönüllü veya dernek üyesi olarak araştırmalarımıza güç katın!',
  },
]

const services2Slides = [
  { title: 'Arazi Çalışması', icon: 'bi-search', img: '/image/saha-calismalari/20260519_104557.webp', to: '/saha-calismalari' },
  { title: 'Akustik İzleme (Ses Dinleme)', icon: 'bi-soundwave', img: '/image/ana-sayfa/hero-4.webp', to: '/saha-calismalari' },
  { title: 'Tünek Araştırması (Yuva Kontrolü)', icon: 'bi-house-check', img: '/image/yarasalar/magara-tunek-girisi.webp', to: '/saha-calismalari' },
  { title: 'Farkındalık & Eğitim', icon: 'bi-lightbulb', img: '/image/hakkimizda/tunek-posteri.webp', to: '/yarasalar' },
  { title: 'Veri Gönder & Bildir', icon: 'bi-cloud-arrow-up', img: '/image/saha-calismalari/20260513_145101.webp', to: '/veri-gonder' },
  { title: 'Dernek Üyeliği', icon: 'bi-person-badge', img: '/image/gonullu-ol/gonullu-universite-stant.webp', to: '/uye-ol' },
  { title: 'Gönüllülük', icon: 'bi-people', img: '/image/gonullu-ol/gonullu-gece-gozlemi.webp', to: '/gonullu-ol' },
]

const homeGalleryItems = [
  {
    src: '/image/ana-sayfa/hero-1.webp',
    title: 'Akşam Alacakaranlık ve Gece Transekt Ekibi',
    tag: 'Saha Çalışması',
    date: 'Haziran 2026',
    caption: 'Araştırma ekibimizin gün batımı sonrasında Elekon Batlogger S2 dedektörleriyle yürüttüğü gece surveyi.',
  },
  {
    src: '/image/yarasalar/yarasa-morfoloji-inceleme.webp',
    title: 'Tür Tanımı & Morfolojik İnceleme',
    tag: 'Biyolojik İnceleme',
    date: 'Mayıs 2026',
    caption: 'Uzman araştırmacımız tarafından eldivenle, non-invasif protokollerle gerçekleştirilen kanat ve kulak incelemesi.',
  },
  {
    src: '/image/yarasalar/magara-tunek-girisi.webp',
    title: 'Doğal Mağara ve Kaya Tünekleri',
    tag: 'Tünek Araştırması',
    date: 'Mayıs 2026',
    caption: 'Kırşehir ve çevresindeki doğal karstik mağaralarda koloni büyüklüğü ve mikroklima tespiti.',
  },
  {
    src: '/image/ana-sayfa/hero-4.webp',
    title: 'Elekon Batlogger S2 ile Ultrasonik Ses Dinleme',
    tag: 'Akustik İzleme',
    date: 'Haziran 2026',
    caption: 'GPS koordinatlı tam spektrum dedektörle kentsel alanda yüksek frekanslı ekolokasyon seslerinin kaydedilmesi.',
  },
  {
    src: '/image/gonullu-ol/gonullu-saha-egitimi-1.webp',
    title: 'Gönüllü Gözlemci Oryantasyonu',
    tag: 'Toplum Bilimi',
    date: 'Mayıs 2026',
    caption: 'Üniversite öğrencileri ve doğa gönüllüleri ile sahada ekipman ve tür tanıma eğitimi.',
  },
  {
    src: '/image/ana-sayfa/hero-3.webp',
    title: 'Kanyon ve Ripariyen Koridoru',
    tag: 'Habitat Tespiti',
    date: 'Temmuz 2026',
    caption: 'Kızılırmak havzasında yarasa kolonilerinin avlanma ve uçuş güzergâhı olan doğal vadi habitatı.',
  },
]

export default function Home() {
  const heroSwiperRef = useRef<HTMLDivElement>(null)
  const servicesSwiperRef = useRef<HTMLDivElement>(null)
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null)
  const { lang, t } = useLangStore()
  const isTr = lang === 'tr'

  useEffect(() => {
    let heroSwiper: Swiper | null = null
    let servicesSwiper: Swiper | null = null

    if (heroSwiperRef.current) {
      heroSwiper = new Swiper(heroSwiperRef.current, {
        modules: [Autoplay, Navigation, Pagination, EffectFade],
        effect: 'fade',
        loop: true,
        speed: 800,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.hero-pagination', clickable: true },
        navigation: { nextEl: '.hero-next', prevEl: '.hero-prev' },
      })
    }
    if (servicesSwiperRef.current) {
      servicesSwiper = new Swiper(servicesSwiperRef.current, {
        modules: [Autoplay, Navigation, Pagination],
        loop: true,
        speed: 600,
        autoplay: { delay: 4500 },
        pagination: { el: '.services-pagination', clickable: true },
        navigation: { nextEl: '.services-next', prevEl: '.services-prev' },
        breakpoints: {
          320: { slidesPerView: 1, spaceBetween: 24 },
          768: { slidesPerView: 2, spaceBetween: 30 },
          1200: { slidesPerView: 3, spaceBetween: 36 },
        },
      })
    }
    return () => { heroSwiper?.destroy(); servicesSwiper?.destroy() }
  }, [])

  return (
    <main className="main">

      {/* ── HERO ── */}
      <section id="hero" className="hero section dark-background">
        <div ref={heroSwiperRef} className="swiper hero-swiper">
          <div className="swiper-wrapper">
            {slides.map((s, i) => (
              <div key={i} className="swiper-slide">
                <img
                  src={s.img}
                  alt={s.title}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding={i === 0 ? 'sync' : 'async'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                />
                <div
                  className="carousel-container"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.45) 100%)',
                  }}
                >
                  {s.extra ? (
                    <>
                      <div className="badge bg-danger mb-2 px-3 py-2 text-uppercase" style={{ letterSpacing: '1.5px', fontSize: '13px' }}>
                        {isTr ? 'Resmi Bilim ve Koruma Kuruluşu' : 'Official Science & Conservation Body'}
                      </div>
                      <h2>{isTr ? 'Yarasa Araştırmaları Derneği' : 'Bat Research Association'}</h2>
                      <p className="mb-3 fs-5 text-light">{s.desc}</p>
                      <p className="opacity-90 mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.8', maxWidth: '780px', margin: '0 auto' }}>
                        {isTr ? (
                          <>
                            Bu dernek, ekolojik paydaşlarımız olan yarasaların sürdürülebilirliği ve biyoçeşitliliğin korunması için faaliyet göstermektedir.<br />
                            Doğa ile uzlaşık yaşama becerilerinin kazandırılabilmesi için:<br />
                            <strong>Kim Misafir – Kim Ev Sahibi?</strong>
                          </>
                        ) : (
                          <>
                            Dedicated to the sustainability of bats and regional biodiversity conservation.<br />
                            For harmonious coexistence with nature:<br />
                            <strong>Who is the Guest – Who is the Host?</strong>
                          </>
                        )}
                      </p>
                      <div className="d-flex gap-3 flex-wrap justify-content-center">
                        <Link to="/saha-calismalari" className="btn-cta">{t('exploreStudies')}</Link>
                        <Link to="/uye-ol" className="btn-cta" style={{ background: '#fff', color: '#1a1a1a', border: '2px solid #fff' }}>{t('joinUs')}</Link>
                        <Link to="/gonullu-ol" className="btn-cta" style={{ background: 'transparent', border: '2px solid #e61b23' }}>{t('volunteerNow')}</Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2>{s.title}</h2>
                      <p style={{ maxWidth: '720px', margin: '0 auto 24px', fontSize: '1.1rem', lineHeight: '1.7' }}>{s.desc}</p>
                      <div className="d-flex gap-3 flex-wrap justify-content-center">
                        <Link to="/saha-calismalari" className="btn-cta">{isTr ? 'Detayları İnceleyin' : 'Explore Details'}</Link>
                        <Link to="/uye-ol" className="btn-cta" style={{ background: 'transparent', border: '2px solid #fff' }}>{isTr ? 'Aramıza Katılın' : 'Join Us'}</Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="hero-pagination swiper-pagination" />
          <button className="hero-prev carousel-control-prev" style={{ background: 'none', border: 'none' }} aria-label="Önceki Slayt">
            <span className="carousel-control-prev-icon bi bi-chevron-left" />
          </button>
          <button className="hero-next carousel-control-next" style={{ background: 'none', border: 'none' }} aria-label="Sonraki Slayt">
            <span className="carousel-control-next-icon bi bi-chevron-right" />
          </button>
        </div>
      </section>

      {/* ── ÖNE ÇIKANLAR ── */}
      <section id="services" className="services section">
        <div className="container section-title" data-aos="fade-up">
          <h2 style={{ fontSize: '2.4rem' }}>{isTr ? 'ÖNE ÇIKANLAR' : 'HIGHLIGHTS'}</h2>
          <p>{isTr ? 'Biyoçeşitlilik araştırmaları, aktif saha projeleri ve toplum bilimi' : 'Biodiversity research, active field projects, and citizen science'}</p>
        </div>
        <div className="content">
          <div className="container">
            <div className="row g-4">
              {[
                {
                  num: '01', icon: 'bi-search', title: isTr ? 'Ekosistem Hizmetleri' : 'Ecosystem Services',
                  desc: isTr
                    ? 'Neden Yarasa? Yarasalar böcek popülasyonlarının doğal düzenlenmesinde, tozlaşmada ve tohum dağılımında kritik rol üstlenen memelilerdir. Kentsel ve doğal alanlardaki popülasyon dinamiklerinin mercek altına alınması, biyolojik çeşitlilik yönetimi açısından büyük önem taşımaktadır.'
                    : 'Why Bats? Bats play an essential role in biological pest control, pollination, and seed dispersal. Studying population dynamics in urban and natural habitats is paramount for biodiversity.'
                },
                {
                  num: '02', icon: 'bi-soundwave', title: isTr ? 'Aktif Proje: Kentsel İzleme' : 'Active Project: Urban Monitoring',
                  desc: isTr
                    ? 'Kırşehir Kentsel İzleme Projesi: Nehir koridoru, tarihi yapılar ve köprü altları dahil olmak üzere belirlenmiş güzergâhlarda haftalık tünek alanı (yuva kontrolü) ve akustik aktivite (ses dinleme) araştırmaları yürütülmektedir.'
                    : 'Kırşehir Urban Monitoring Project: Weekly roost inspection and acoustic listening surveys along river corridors, historical sites, and bridge spans.'
                },
                {
                  num: '03', icon: 'bi-people-fill', title: isTr ? 'Topluluk Bilimi & Üyelik' : 'Community Science & Membership',
                  desc: isTr
                    ? 'Araştırma ekibimiz akademisyenler, lisans ve lisansüstü öğrencilerden oluşmaktadır. Eğitimli gönüllülerimiz ve dernek üyelerimizle birlikte her hafta saha çalışmaları gerçekleştirilmektedir. Siz de üye olun, birlikte araştıralım.'
                    : 'Our team comprises academics, undergraduate and graduate students. With our volunteers and members, we conduct weekly field surveys.'
                },
              ].map(s => (
                <div key={s.num} className="col-lg-4 col-md-6">
                  <div className="service-item h-100">
                    <div className="service-item-icon"><i className={`bi ${s.icon}`} /></div>
                    <div className="service-item-content">
                      <h3 className="service-heading">{s.title}</h3>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── BİTEN & TAMAMLANAN PROJELER (Öne Çıkanların Altında) ── */}
            <div className="mt-5 pt-4" data-aos="fade-up">
              <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <div>
                  <span className="badge bg-success-subtle text-success px-3 py-1 mb-2 fw-semibold">
                    <i className="bi bi-check2-circle me-1" />{isTr ? 'Bilimsel Çıktılar' : 'Scientific Outputs'}
                  </span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                    {isTr ? 'Biten & Tamamlanan Projeler' : 'Completed Research Projects'}
                  </h3>
                </div>
                <Link to="/saha-calismalari" className="btn btn-sm btn-outline-danger px-3 py-2" style={{ borderRadius: '50px' }}>
                  {isTr ? 'Tüm Çalışmaları Gör' : 'View All Studies'} <i className="bi bi-arrow-right ms-1" />
                </Link>
              </div>

              <div className="row g-4">
                {[
                  {
                    title: isTr ? 'Kırşehir Yarasa Faunasının Belirlenmesi Projesi' : 'Determining the Bat Fauna of Kırşehir',
                    badge: isTr ? 'Tamamlandı • 2026' : 'Completed • 2026',
                    lead: isTr ? 'İç Anadolu Biyoçeşitlilik Envanteri' : 'Central Anatolia Biodiversity Inventory',
                    desc: isTr
                      ? 'Kırşehir il merkezi ve kırsal alanlarında 8 farklı habitat tipinde yürütülen ve Türkiye genelinde kayıtlı 41 yarasa türü çerçevesinde bölgesel tür çeşitliliğini ortaya koyan kapsamlı BAP araştırma projesi başarıyla tamamlanmıştır.'
                      : 'Comprehensive BAP research project investigating 8 habitat zones in Kırşehir, reporting regional species richness within Turkey’s 41 bat species catalogue.',
                    icon: 'bi-geo-alt-fill',
                    img: '/image/cacabey.webp',
                    tag: isTr ? 'BAP Destekli' : 'BAP Funded',
                  },
                  {
                    title: isTr ? 'Kentsel Köprü ve Tarihi Yapı Tünek Alanı Envanteri' : 'Urban Bridges & Historic Roosts Inventory',
                    badge: isTr ? 'Tamamlandı • Raporlandı' : 'Completed • Reported',
                    lead: isTr ? 'Yuva Kontrolleri ve Koruma Haritası' : 'Roost Inspection & Conservation Map',
                    desc: isTr
                      ? 'Cacabey Meydanı, tarihi kâgir binalar ve nehir üstü betonarme köprü derzlerindeki yarasa tünekleri endoskopik kamera ve akustik izleme ile haritalandırılmış, koruma önerileri kamu kurumlarıyla paylaşılmıştır.'
                      : 'Roosts in historical stone buildings and bridge joints surveyed with endoscopic cameras and acoustic listening; conservation guidelines submitted to authorities.',
                    icon: 'bi-house-check-fill',
                    img: '/image/saha-calismalari/20260421_164711_0.webp',
                    tag: isTr ? 'Yuva Kontrolü' : 'Roost Check',
                  },
                  {
                    title: isTr ? 'Kızılırmak Ripariyen Koridoru Akustik Aktivite Analizi' : 'Kızılırmak Riparian Corridor Acoustic Analysis',
                    badge: isTr ? 'Tamamlandı • Yayınlandı' : 'Completed • Published',
                    lead: isTr ? 'Ultrasonik Ses Kaydı ve Tür Tespiti' : 'Ultrasonic Recording & Species ID',
                    desc: isTr
                      ? 'Kızılırmak havzası boyunca Elekon Batlogger S2 dedektörleri ile transekt surveyleri gerçekleştirilmiş; sucul avlanma bölgeleri ve kentsel ışık kirliliğinin aktiviteye etkileri sayısal olarak analiz edilmiştir.'
                      : 'Transect surveys along the Kızılırmak basin with Elekon Batlogger S2 detectors; aquatic foraging sites and light pollution impacts quantitatively analyzed.',
                    icon: 'bi-soundwave',
                    img: '/image/saha-calismalari/20260428_194136.webp',
                    tag: isTr ? 'Akustik Analiz' : 'Acoustic Analysis',
                  },
                ].map((p, i) => (
                  <div key={i} className="col-lg-4 col-md-6">
                    <div className="card h-100 border-0 shadow-sm hover-card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                      <div style={{ position: 'relative', height: '180px' }}>
                        <img src={p.img} alt={p.title} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span className="badge bg-danger position-absolute top-0 start-0 m-3 px-3 py-1" style={{ fontSize: '11px', borderRadius: '50px' }}>
                          {p.tag}
                        </span>
                        <span className="badge bg-dark bg-opacity-75 position-absolute bottom-0 end-0 m-3 px-2 py-1" style={{ fontSize: '11px' }}>
                          <i className="bi bi-calendar3 me-1" />{p.badge}
                        </span>
                      </div>
                      <div className="card-body p-4 d-flex flex-column">
                        <div className="text-danger small fw-bold text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>{p.lead}</div>
                        <h4 className="card-title h6 fw-bold text-dark mb-2">{p.title}</h4>
                        <p className="card-text text-muted small flex-grow-1" style={{ lineHeight: '1.6' }}>{p.desc}</p>
                        <div className="pt-2 border-top mt-2">
                          <Link to="/saha-calismalari" className="text-danger fw-semibold small text-decoration-none d-flex align-items-center gap-1">
                            {isTr ? 'Rapor & Saha Detayları' : 'Report & Field Details'} <i className="bi bi-chevron-right" style={{ fontSize: '11px' }} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── İSTATİSTİK ── */}
      <section id="stats" className="section light-background">
        <div className="container" data-aos="fade-up">
          <div className="p-4 bg-white rounded-3 shadow-sm hover-card text-center">
            <div className="d-flex gap-3 justify-content-center flex-wrap mb-2">
              <span><i className="bi bi-geo-alt" style={{ color: '#e61b23' }} /> <strong>3</strong> {isTr ? 'Gözlemci Grubu' : 'Observer Groups'}</span>
              <span className="text-black-50">·</span>
              <span><i className="bi bi-soundwave" style={{ color: '#e61b23' }} /> <strong>6</strong> {isTr ? 'Elekon Batlogger S2 Dedektörü' : 'Batlogger S2 Detectors'}</span>
              <span className="text-black-50">·</span>
              <span><i className="bi bi-calendar3" style={{ color: '#e61b23' }} /> <strong>Mart 2026</strong>{isTr ? '\'dan Bu Yana Aktif' : ' Active Since'}</span>
              <span className="text-black-50">·</span>
              <span><i className="bi bi-check-all" style={{ color: '#e61b23' }} /> <strong>41</strong> {isTr ? 'Türkiye’de Kayıtlı Tür' : 'Species in Turkey'}</span>
              <span className="text-black-50">·</span>
              <span><i className="bi bi-mortarboard" style={{ color: '#e61b23' }} /> <strong>1</strong> {isTr ? 'Tamamlanan Kırşehir BAP Projesi' : 'Completed BAP Project'}</span>
            </div>
            <div className="text-muted small">
              {isTr
                ? 'Yarasa Ekolojisi, Yaşayan Ekolojik Miras ve Sürdürülebilir Biyoçeşitlilik; Vatandaş Bilimi ile Doğa ile Uzlaşık Yaşam Becerilerinin Kazanımı'
                : 'Bat Ecology, Living Ecological Heritage and Sustainable Biodiversity; Citizen Science for Living in Harmony with Nature'}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT 3 (YARASALAR HAYATI DAHA İYİ KILAR) ── */}
      <section id="about-3" className="about-3 section">
        <div className="container">
          <div className="row gy-4 justify-content-between align-items-center">
            <div className="col-lg-6 order-lg-2 position-relative" data-aos="zoom-out">
              <div
                className="position-relative rounded-4 overflow-hidden shadow-lg hover-card"
                onClick={() => setLightboxImage({
                  src: '/image/yarasalar/yarasa-morfoloji-inceleme.webp',
                  title: isTr ? 'Yarasa Morfolojisi ve Tür İncelemesi' : 'Bat Morphology & Species Examination',
                  caption: isTr ? 'Araştırmacımız tarafından eldivenle, non-invasif protokoller çerçevesinde yapılan kanat, kulak ve morfoloji incelemesi.' : 'Non-invasive morphological examination by certified researcher.',
                  tag: 'Fauna İncelemesi',
                  date: 'Mayıs 2026'
                })}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src="/image/yarasalar/yarasa-morfoloji-inceleme.webp"
                  alt="Yarasa Morfolojik İncelemesi"
                  loading="lazy"
                  decoding="async"
                  className="img-fluid w-100"
                  style={{ maxHeight: '420px', objectFit: 'cover', display: 'block' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '14px 20px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                    color: '#fff',
                  }}
                >
                  <span className="badge bg-danger mb-1 me-2">{isTr ? 'Biyolojik İnceleme' : 'Biological Study'}</span>
                  <span className="small text-white-50">{isTr ? 'Fotoğrafı büyütmek için tıklayın' : 'Click to enlarge'} <i className="bi bi-zoom-in ms-1" /></span>
                </div>
              </div>
            </div>
            <div className="col-lg-5 order-lg-1" data-aos="fade-up" data-aos-delay="100">
              <span className="badge bg-danger-subtle text-danger px-3 py-1 mb-2 fw-semibold">
                <i className="bi bi-heart-fill me-1" />{isTr ? 'Doğa İle Uzlaşık Yaşam' : 'Harmony with Nature'}
              </span>
              <h2 className="mb-4" style={{ fontFamily: 'var(--heading-font)', fontSize: '2.2rem', fontWeight: 600, color: 'var(--heading-color)' }}>
                {isTr ? 'Yarasalar Hayatı Daha İyi Kılar' : 'Bats Make Life Better'}
              </h2>
              <p className="mb-3" style={{ lineHeight: '1.8' }}>
                {isTr
                  ? 'Yarasalar doğal ekosisteminin en kritik parçalarından biridir. Bir tek böcekçil yarasa gecede binlerce zararlı böceği tüketerek tarımı ve insan sağlığını kimyasal pestisitlere ihtiyaç duymadan korur.'
                  : 'Bats are among the most critical components of our natural ecosystem. A single insectivorous bat consumes thousands of pests per night, protecting agriculture and public health naturally.'}
              </p>
              <p className="mb-4 text-muted" style={{ lineHeight: '1.7', fontSize: '14.5px' }}>
                {isTr
                  ? 'Onları korumak, gelecek nesiller için daha sağlıklı bir çevre sağlamak anlamına gelir. Araştırmalarımız, yarasaların kentsel alanlardaki rolünü anlamaya, yuva alanlarını güvenceye almaya ve koruma stratejileri geliştirmeye adanmıştır.'
                  : 'Protecting them means securing a healthier environment for future generations. Our research focuses on understanding urban bat dynamics and safeguarding roost sites.'}
              </p>
              <ul className="list-unstyled list-check mb-4">
                <li>{isTr ? 'Yarasalar hakkında bilim temelli ve tarafsız bilgi' : 'Science-based, objective knowledge about bats'}</li>
                <li>{isTr ? 'Akustik izleme teknolojileri ve ultrasonik ses dinleme' : 'Acoustic monitoring and ultrasonic listening'}</li>
                <li>{isTr ? 'Tünek araştırması ve düzenli yuva kontrolü' : 'Roost research and periodic roost inspection'}</li>
                <li>{isTr ? 'Toplum bilimi ve dernek üyeliği girişimleri' : 'Citizen science and association membership'}</li>
              </ul>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/uye-ol" className="btn-cta">{t('joinUs')}</Link>
                <Link to="/iletisim" className="btn-cta" style={{ background: '#1a1a1a', border: '2px solid #1a1a1a' }}>{t('contactUs')}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVİCES 2 (Swiper) ── */}
      <section id="services-2" className="services-2 section dark-background">
        <div className="container section-title" data-aos="fade-up">
          <h2>{isTr ? 'ÇALIŞMA BAŞLIKLARIMIZ' : 'OUR WORKING FIELDS'}</h2>
          <p>{isTr ? 'Derneğimizin ve araştırma ekibimizin temel faaliyet alanları' : 'Core fields of activity of our association'}</p>
        </div>
        <div className="services-carousel-wrap">
          <div className="container">
            <div ref={servicesSwiperRef} className="swiper init-swiper">
              <button className="navigation-prev services-prev" aria-label="Önceki"><i className="bi bi-arrow-left-short" /></button>
              <button className="navigation-next services-next" aria-label="Sonraki"><i className="bi bi-arrow-right-short" /></button>
              <div className="swiper-wrapper">
                {services2Slides.map((s, i) => (
                  <div key={i} className="swiper-slide">
                    <div className="service-item">
                      <div className="service-item-contents">
                        <Link to={s.to}>
                          <h2 className="service-item-title">
                            <i className={`bi ${s.icon} me-2 text-danger`} />{s.title}
                          </h2>
                        </Link>
                      </div>
                      <img src={s.img} alt={s.title} loading="lazy" decoding="async" className="img-fluid" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="services-pagination swiper-pagination" />
            </div>
          </div>
        </div>
      </section>

      {/* ── SAHA VE ARAŞTIRMA GÖRSEL GALERİSİ ── */}
      <section id="field-gallery" className="section" style={{ background: '#0e1014', color: '#fff', padding: '80px 0' }}>
        <div className="container" data-aos="fade-up">
          <div className="d-flex align-items-end justify-content-between mb-5 flex-wrap gap-3">
            <div>
              <span className="badge bg-danger px-3 py-1 mb-2 text-uppercase fw-semibold" style={{ letterSpacing: '1px' }}>
                <i className="bi bi-camera-fill me-1" />{isTr ? 'GÖRSEL ARŞİV' : 'VISUAL ARCHIVE'}
              </span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                {isTr ? 'Saha Çalışmalarımızdan Kesitler' : 'Field Studies Highlights'}
              </h2>
              <p className="text-white-50 mt-2 mb-0" style={{ maxWidth: '620px', fontSize: '15px' }}>
                {isTr
                  ? 'Kırşehir ve çevresinde yürüttüğümüz kentsel tünek araştırmaları, gece akustik transektleri ve mağara incelemelerinden gerçek belgesel anlar.'
                  : 'Authentic moments from our urban roost inspections, night acoustic transects, and cave expeditions.'}
              </p>
            </div>
            <Link to="/saha-calismalari" className="btn btn-outline-danger px-4 py-2" style={{ borderRadius: '50px' }}>
              {isTr ? 'Tüm Arşivi İncele' : 'View Full Archive'} <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>

          <div className="row g-4">
            {homeGalleryItems.map((item, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <div
                  className="rounded-4 overflow-hidden position-relative hover-card"
                  onClick={() => setLightboxImage(item)}
                  style={{
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: '#161920',
                    height: '280px',
                    position: 'relative',
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '22px',
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-danger text-uppercase" style={{ fontSize: '10.5px' }}>{item.tag}</span>
                      <span className="text-white-50 small"><i className="bi bi-calendar3 me-1" />{item.date}</span>
                    </div>
                    <h5 style={{ color: '#fff', fontSize: '16.5px', fontWeight: 600, margin: '4px 0 0' }}>
                      {item.title}
                    </h5>
                    <div className="mt-2 text-danger small fw-semibold d-flex align-items-center gap-1">
                      <i className="bi bi-zoom-in" /> {isTr ? 'Büyüt & İncele' : 'Click to View'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTEKLEYEN KURUMLAR (EN ALTTA VE ÜNİVERSİTE EN DİPTE) ── */}
      <section id="partners" className="section" style={{ background: '#fdfcfc', padding: '70px 0 50px' }}>
        <div className="container" data-aos="fade-up">
          <div className="text-center mb-5">
            <span className="badge bg-danger-subtle text-danger px-3 py-1 mb-2 fw-semibold" style={{ letterSpacing: '1px' }}>
              <i className="bi bi-buildings me-1" />{isTr ? 'İŞ BİRLİKLERİ' : 'PARTNERSHIPS'}
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1a1a1a' }}>
              {t('supportingInstitutions')}
            </h2>
            <p className="text-muted" style={{ maxWidth: '640px', margin: '0 auto', fontSize: '14.5px' }}>
              {isTr
                ? 'Yarasa Araştırmaları Derneği projeleri, ulusal ve uluslararası bilim ve çevre kuruluşlarının desteğiyle yürütülmektedir.'
                : 'Bat Research Association projects are conducted with the support of national and international scientific and environmental institutions.'}
            </p>
          </div>

          {/* Üst partnerler gridi */}
          <div className="row g-4 justify-content-center mb-5">
            {[
              {
                name: 'T.C. Tarım ve Orman Bakanlığı',
                sub: 'Doğa Koruma ve Milli Parklar (DKMP) Genel Müdürlüğü',
                role: isTr ? 'Araştırma ve İzin Makamı' : 'Permit & Research Authority',
                icon: 'bi-tree',
              },
              {
                name: 'TÜBİTAK',
                sub: 'Türkiye Bilimsel ve Teknolojik Araştırma Kurumu',
                role: isTr ? 'Bilimsel Araştırma Desteği' : 'Scientific Research Support',
                icon: 'bi-cpu',
              },
              {
                name: 'EUROBATS',
                sub: 'Avrupa Yarasa Popülasyonlarını Koruma Anlaşması',
                role: isTr ? 'Uluslararası Koruma Standartları' : 'International Conservation Standards',
                icon: 'bi-globe-europe-africa',
              },
              {
                name: 'Türkiye Biyoçeşitlilik Ağı',
                sub: 'Ulusal Fauna & Flora İzleme Veri Tabanı',
                role: isTr ? 'Veri Paylaşım Paydaşı' : 'Data Sharing Partner',
                icon: 'bi-database-check',
              },
            ].map((p, i) => (
              <div key={i} className="col-lg-3 col-md-6">
                <div className="p-4 bg-white rounded-3 shadow-sm hover-card text-center h-100 d-flex flex-column justify-content-between" style={{ border: '1px solid #f0e6e6' }}>
                  <div>
                    <div style={{ width: 54, height: 54, background: '#fdf2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#e61b23', fontSize: '24px' }}>
                      <i className={`bi ${p.icon}`} />
                    </div>
                    <h5 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>{p.name}</h5>
                    <p style={{ fontSize: '13px', color: '#777', marginBottom: '12px', lineHeight: '1.5' }}>{p.sub}</p>
                  </div>
                  <div>
                    <span className="badge bg-light text-muted border px-2 py-1" style={{ fontSize: '11px' }}>
                      {p.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── EN ALTTA: KIRŞEHİR AHİ EVRAN ÜNİVERSİTESİ (BAP DESTEĞİ VE AKADEMİK EV SAHİBİ) ── */}
          <div className="row justify-content-center" data-aos="zoom-in">
            <div className="col-lg-10">
              <div
                className="p-4 p-md-5 rounded-4 shadow-sm text-center position-relative overflow-hidden hover-card"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #fdf8f8 100%)',
                  border: '2.5px solid #e61b23',
                }}
              >
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(230,27,35,0.05)', borderRadius: '50%' }} />
                <div className="d-flex align-items-center justify-content-center gap-3 mb-3 flex-wrap">
                  <div style={{ width: 68, height: 68, background: '#e61b23', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '32px', boxShadow: '0 4px 16px rgba(230,27,35,0.3)' }}>
                    <i className="bi bi-mortarboard-fill" />
                  </div>
                  <div className="text-md-start">
                    <span className="badge bg-danger text-white px-3 py-1 mb-1 text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                      {isTr ? 'ANA AKADEMİK DESTEKLEYİCİ VE PROJE SAHİBİ' : 'MAIN ACADEMIC HOST & PROJECT SPONSOR'}
                    </span>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                      KIRŞEHİR AHİ EVRAN ÜNİVERSİTESİ
                    </h3>
                  </div>
                </div>

                <div className="text-muted mb-3" style={{ fontSize: '14.5px', maxWidth: '780px', margin: '0 auto', lineHeight: '1.7' }}>
                  {isTr
                    ? 'Yarasa araştırmalarımız, Kırşehir Ahi Evran Üniversitesi bünyesinde yürütülmekte olup Ahi Evran Üniversitesi Bilimsel Araştırma Projeleri (BAP) Koordinatörlüğü ve Hayvan Deneyleri Yerel Etik Kurulu (HADYEK) desteğiyle finanse edilmektedir.'
                    : 'Our bat research is conducted under Kırşehir Ahi Evran University, supported and funded by the Scientific Research Projects (BAP) Coordination Unit and the Animal Experiments Local Ethics Committee (HADYEK).'}
                </div>

                <div className="d-flex justify-content-center flex-wrap gap-2 pt-2">
                  <span className="badge bg-white text-dark border px-3 py-2 shadow-sm" style={{ fontSize: '12.5px' }}>
                    <i className="bi bi-award-fill text-danger me-1" /> Ahi Evran BAP Proje Desteği
                  </span>
                  <span className="badge bg-white text-dark border px-3 py-2 shadow-sm" style={{ fontSize: '12.5px' }}>
                    <i className="bi bi-patch-check-fill text-danger me-1" /> HADYEK Etik Kurul Onaylı
                  </span>
                  <span className="badge bg-white text-dark border px-3 py-2 shadow-sm" style={{ fontSize: '12.5px' }}>
                    <i className="bi bi-building-check text-danger me-1" /> Kırşehir İl Geneli Araştırma Merkezi
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── BÜLTENİ ── */}
      <section id="call-to-action" className="call-to-action section light-background">
        <div className="content">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h3>{isTr ? 'Bültenimize Abone Olun' : 'Subscribe to Our Newsletter'}</h3>
                <p className="opacity-75">{isTr ? 'Yeni araştırmalar, saha duyuruları ve dernek gelişmeleri için e-posta adresinizi bırakabilirsiniz.' : 'Leave your email address for new research, field announcements, and news.'}</p>
              </div>
              <div className="col-lg-6">
                <NewsletterForm placeholder={isTr ? 'E-posta adresiniz' : 'Your email address'} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Görsel Lightbox Modal */}
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />

    </main>
  )
}
