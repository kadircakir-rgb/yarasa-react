import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import NewsletterForm from '../components/NewsletterForm'
import ImageLightbox, { type LightboxImage } from '../components/ImageLightbox'
import { useLangStore } from '../store/langStore'

function teamInitials(name: string) {
  return name.split(' ').filter(w => w.length > 2 && /^[A-ZÇĞİÖŞÜ]/.test(w)).slice(0, 2).map(w => w[0]).join('')
}

const team = [
  {
    name: 'Prof. Dr. Şakir Önder Özkurt',
    role: 'Danışman & Bilimsel Yönlendirici',
    desc: 'Mammaloji ve Türkiye fauna araştırmaları alanındaki uzun soluklu akademik birikimiyle derneğimizin bilimsel yönlendiricisidir.'
  },
  {
    name: 'Dr. Emin Seyfi',
    role: 'Dernek Başkanı & Proje Yürütücüsü',
    desc: 'Kentsel yarasa ekolojisi, akustik tür tanımlama ve tünek alanı ekolojisi üzerine çalışmaktadır. Saha koordinasyonunu ve araştırmaları yönetmektedir.'
  },
  {
    name: 'Müh. Kadir Çakır',
    role: 'Teknik Altyapı & Dijital Sistemler Sorumlusu',
    desc: 'Derneğin dijital altyapısının sürdürülebilirliği ve etkin yönetiminden sorumludur. Web mimarisi, veri tabanı ve saha kayıtlarının dijitalleşmesini yürütmektedir.'
  },
  {
    name: 'Emre Seyfi',
    role: 'Lojistik & Saha Operasyonları Sorumlusu',
    desc: 'Yarasa tünek alanlarının düzenli yuva kontrolü, akustik kayıt cihazlarının kurulumu ve saha ekiplerinin lojistik koordinasyonunu sağlamaktadır.'
  },
]

const officialPublications: LightboxImage[] = [
  {
    src: '/image/hakkimizda/tunek-posteri.webp',
    title: 'Tünek Alanları İçin Bilgilendirme ve Koruma Posteri (50x70 cm)',
    tag: 'Resmi Poster',
    date: '2026',
    caption: 'Derneğimiz tarafından hazırlanan, tünek alanlarının ekolojik önemi ve yasal koruma statüsünü anlatan resmi 50x70 poster çalışması.',
  },
  {
    src: '/image/hakkimizda/yarasa-brosuru-1.webp',
    title: 'Yarasa Bilgilendirme ve Farkındalık Broşürü — Ön Yüz',
    tag: 'Eğitim Yayını',
    date: '2026',
    caption: 'Halk sağlığı, ekolojik faydalar ve yarasalar hakkındaki doğru bilinen yanlışları ele alan resmi broşürümüzün birinci sayfası.',
  },
  {
    src: '/image/hakkimizda/yarasa-brosuru-2.webp',
    title: 'Yarasa Bilgilendirme ve Farkındalık Broşürü — Arka Yüz',
    tag: 'Eğitim Yayını',
    date: '2026',
    caption: 'Yarasa türleri, tünek koruma kuralları ve vatandaş bilimi iletişim kanallarını içeren resmi broşürümüzün ikinci sayfası.',
  },
]

export default function About() {
  const { lang, t } = useLangStore()
  const isTr = lang === 'tr'
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null)

  return (
    <main className="main">
      <PageTitle
        title={isTr ? "Hakkımızda" : "About Us"}
        subtitle={isTr ? "Yarasa Araştırmaları Derneği — Bilimsel araştırma, koruma ve toplumsal farkındalık" : "Bat Research Association — Scientific research, conservation, and awareness"}
        crumb={isTr ? "Hakkımızda" : "About Us"}
        bg="/image/hakkimizda/ekip-arazi-calismasi.webp"
      />

      {/* ── TANITIM ── */}
      <section className="about-3 section">
        <div className="container">
          <div className="row gy-4 justify-content-between align-items-center">
            <div className="col-lg-6 order-lg-2" data-aos="zoom-out">
              <div
                className="position-relative rounded-4 overflow-hidden shadow-lg hover-card"
                onClick={() => setLightboxImage({
                  src: '/image/hakkimizda/ekip-tarihi-yapi.webp',
                  title: isTr ? 'Araştırma Ekibimiz Tarihi Yapı Tünek İncelemesinde' : 'Research Team Inspecting Historic Roost Sites',
                  caption: isTr ? 'Kırşehir merkezinde tarihi kâgir yapılar ve Cacabey çevresinde gerçekleştirilen tünek tespit çalışması.' : 'Roost survey at historic masonry buildings in central Kırşehir.',
                  tag: 'Kurumsal Saha',
                  date: 'Nisan 2026'
                })}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src="/image/hakkimizda/ekip-tarihi-yapi.webp"
                  alt="Yarasa Araştırmaları Derneği Ekibi"
                  loading="lazy"
                  decoding="async"
                  className="img-fluid w-100 rounded-4"
                  style={{ maxHeight: '430px', objectFit: 'cover', display: 'block' }}
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
                  <span className="badge bg-danger mb-1 me-2">{isTr ? 'Saha Ekibi' : 'Field Team'}</span>
                  <span className="small text-white-50">{isTr ? 'Büyütmek için tıklayın' : 'Click to enlarge'} <i className="bi bi-zoom-in ms-1" /></span>
                </div>
              </div>
            </div>

            <div className="col-lg-5 order-lg-1" data-aos="fade-up" data-aos-delay="100">
              <span className="badge bg-danger-subtle text-danger px-3 py-1 mb-2 fw-semibold">
                {isTr ? 'Kurumsal & Akademik Kimlik' : 'Institutional & Academic Identity'}
              </span>
              <h2 className="content-title mb-3" style={{ color: '#e61b23' }}>
                {isTr ? 'Derneğimizin Tanıtımı' : 'About Our Association'}
              </h2>
              <p className="mb-3" style={{ lineHeight: '1.8' }}>
                {isTr
                  ? 'Yarasa Araştırmaları Derneği, Kırşehir Ahi Evran Üniversitesi öğretim üyeleri, doğa araştırmacıları ve öğrencilerinin öncülüğünde kurulmuş; yarasa biyolojisi, akustik tür tanımlama ve kentsel ekoloji alanında bilimsel faaliyet yürüten resmi bir sivil toplum kuruluşudur.'
                  : 'The Bat Research Association is an official scientific body founded by faculty members of Kırşehir Ahi Evran University, nature researchers, and student scientists.'}
              </p>
              <p className="mb-4" style={{ lineHeight: '1.8' }}>
                {isTr
                  ? 'Derneğimizin temel hedefi; Kırşehir yarasa faunasının belirlenmesi başta olmak üzere İç Anadolu ve Türkiye genelinde tünek araştırması (yuva kontrolleri) yapmak, akustik ses dinleme yöntemleriyle tür aktivitesini haritalamak ve yarasalar hakkındaki yanlış inanışları ortadan kaldırmaktır.'
                  : 'Our primary objective is to determine regional bat fauna, conduct roost inspections, monitor acoustic sound patterns, and dispel prevailing myths about bats.'}
              </p>
              <ul className="list-unstyled list-check mb-4">
                <li>{isTr ? 'Akademik Paydaş: Kırşehir Ahi Evran Üniversitesi' : 'Academic Partner: Kırşehir Ahi Evran University'}</li>
                <li>{isTr ? 'Finansman & Destek: Ahi Evran Üniversitesi BAP Koordinatörlüğü' : 'Funding: Ahi Evran University BAP Projects'}</li>
                <li>{isTr ? 'Bilimsel İlke: Non-invasif izleme + Sivil bilim katılımı' : 'Principles: Non-invasive surveys + Citizen science'}</li>
              </ul>
              <div className="d-flex gap-3">
                <Link to="/uye-ol" className="btn-cta">{t('joinUs')}</Link>
                <Link to="/iletisim" className="btn-cta" style={{ background: '#1a1a1a', border: '2px solid #1a1a1a' }}>{t('contactUs')}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MİSYON & VİZYON ── */}
      <section className="section light-background">
        <div className="container" data-aos="fade-up">
          <div className="row gy-4">
            <div className="col-lg-6">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 hover-card">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: '#f5e6e6', flexShrink: 0 }}>
                    <i className="bi bi-bullseye fs-4" style={{ color: '#e61b23' }} />
                  </div>
                  <h3 className="h5 mb-0">{isTr ? 'Misyonumuz' : 'Our Mission'}</h3>
                </div>
                <p className="mb-0 text-muted" style={{ lineHeight: '1.8' }}>
                  {isTr
                    ? 'Türkiye\'nin kentsel ve doğal ekosistemlerinde yaşayan yarasa türlerini bilimsel yöntemlerle belgelemek, tünek alanlarını (yuvalarını) koruma altına almak ve elde edilen faunistik verileri ulusal ve uluslararası biyoçeşitlilik literatürüne kazandırmak.'
                    : 'To systematically document bat species inhabiting urban and natural habitats, protect their roosts, and contribute faunistic data to national and international conservation archives.'}
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 hover-card">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: '#f5e6e6', flexShrink: 0 }}>
                    <i className="bi bi-eye fs-4" style={{ color: '#e61b23' }} />
                  </div>
                  <h3 className="h5 mb-0">{isTr ? 'Vizyonumuz' : 'Our Vision'}</h3>
                </div>
                <p className="mb-0 text-muted" style={{ lineHeight: '1.8' }}>
                  {isTr
                    ? 'Bölgesel ve ulusal biyoçeşitlilik politikalarına güvenilir bilimsel veri sağlayan, toplum bilimini teşvik eden, doğa ile uzlaşık yaşam kültürünü toplumun her kesimine aşılayan öncü bir referans sivil toplum kuruluşu olmak.'
                    : 'To be a pioneering reference association providing robust scientific data for biodiversity policies, inspiring citizen science, and fostering harmonious coexistence with wildlife.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EKİP (Şimdilik gizlendi) ── */}
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      {false && (
      <section className="team-15 team section" id="team">
        <div className="container section-title" data-aos="fade-up">
          <h2 style={{ color: '#e61b23' }}>{isTr ? 'Yönetim & Araştırma Ekibi' : 'Management & Research Team'}</h2>
          <p>{isTr ? 'Bilim insanları, uzmanlar ve saha koordinatörleri' : 'Scientists, specialists, and field coordinators'}</p>
        </div>
        <div className="content">
          <div className="container">
            <div className="row">
              {team.map((m, i) => (
                <div key={i} className="col-lg-3 col-md-6 mb-4">
                  <div className="person hover-card">
                    <figure>
                      <div
                        className="team-avatar d-flex align-items-center justify-content-center"
                        style={{
                          aspectRatio: '1',
                          background: 'linear-gradient(135deg, #1a1a1a 0%, #3d1518 100%)',
                          color: '#fff',
                          fontSize: '2rem',
                          fontWeight: 700,
                          fontFamily: 'var(--heading-font)',
                        }}
                        aria-hidden
                      >
                        {teamInitials(m.name)}
                      </div>
                    </figure>
                    <div className="person-contents">
                      <h3>{m.name}</h3>
                      <span className="position">{m.role}</span>
                      <p className="small text-muted mt-2 px-2" style={{ lineHeight: '1.6' }}>{m.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Öğrenci Grupları & Gönüllüler */}
            <div className="row mt-2 gy-4 align-items-center">
              <div className="col-lg-7">
                <div className="p-4 bg-white rounded-3 shadow-sm hover-card" data-aos="fade-up">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: '#f5e6e6', flexShrink: 0 }}>
                      <i className="bi bi-people-fill fs-4" style={{ color: '#e61b23' }} />
                    </div>
                    <h3 className="h5 mb-0">{isTr ? 'Öğrenci Gözlemciler & Dernek Üyeleri' : 'Student Observers & Association Members'}</h3>
                  </div>
                  <p className="mb-0 text-muted" style={{ lineHeight: '1.8' }}>
                    {isTr
                      ? 'Üç aktif gözlemci grubundan oluşan öğrenci ve gönüllü ekiplerimiz, kentsel ve yarı-doğal habitatlarda düzenli transekt çıkışları yürütmektedir. Yarasalara yönelik doğrudan yuva gözlemleri, Elekon Batlogger S2 ile ultrasonik ses dinleme kayıtlarının alınması ve tür düzeyinde veri üretimi süreçlerine doğrudan katkı sunmaktadırlar.'
                      : 'Our student and volunteer groups conduct systematic surveys across urban and semi-natural transects, performing roost inspections and ultrasonic recordings with Batlogger S2.'}
                  </p>
                </div>
              </div>
              <div className="col-lg-5">
                <div
                  className="rounded-3 overflow-hidden shadow-sm hover-card position-relative"
                  onClick={() => setLightboxImage({
                    src: '/image/hakkimizda/dernek-etkinlik-toplanti.webp',
                    title: isTr ? 'Dernek Toplantısı ve Gönüllü Semineri' : 'Association Meeting & Volunteer Seminar',
                    caption: isTr ? 'Dernek yönetim kurulu, akademisyenler ve öğrenci gözlemcilerimizin katıldığı ortak çalışma toplantısı.' : 'Joint committee meeting with academics and observers.',
                    tag: 'Dernek Faaliyeti',
                    date: 'Mayıs 2026'
                  })}
                  style={{ cursor: 'pointer', height: '170px' }}
                >
                  <img
                    src="/image/hakkimizda/dernek-etkinlik-toplanti.webp"
                    alt="Dernek Etkinlik ve Toplantısı"
                    loading="lazy"
                    decoding="async"
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-75 text-white small d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-calendar3 me-1" />Mayıs 2026 • Kurul ve Gözlemciler</span>
                    <span className="text-danger fw-semibold"><i className="bi bi-zoom-in" /> Büyüt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── RESMİ YAYINLAR, POSTER VE BROŞÜRLERİMİZ ── */}
      <section className="section" style={{ background: '#0e1014', color: '#fff', padding: '80px 0' }}>
        <div className="container" data-aos="fade-up">
          <div className="text-center mb-5">
            <span className="badge bg-danger px-3 py-1 mb-2 text-uppercase fw-semibold" style={{ letterSpacing: '1px' }}>
              <i className="bi bi-file-earmark-pdf-fill me-1" />BASILI MATERYALLER &amp; YAYINLAR
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#fff' }}>
              {isTr ? 'Resmi Koruma Posteri ve Bilgilendirme Broşürlerimiz' : 'Official Posters & Educational Brochures'}
            </h2>
            <p className="text-white-50" style={{ maxWidth: '680px', margin: '0 auto', fontSize: '15px' }}>
              {isTr
                ? 'Yarasa Araştırmaları Derneği tarafından kamu kurumları, okullar ve vatandaşlarımız için tasarlanıp basılan resmi materyaller.'
                : 'Official printed materials developed for public awareness, municipal offices, and educational institutions.'}
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {officialPublications.map((item, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <div
                  className="rounded-4 overflow-hidden position-relative hover-card h-100 d-flex flex-column"
                  style={{
                    background: '#161920',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
                  }}
                >
                  <div
                    className="position-relative overflow-hidden"
                    onClick={() => setLightboxImage(item)}
                    style={{
                      height: '320px',
                      cursor: 'pointer',
                      background: '#0a0b0e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        padding: '12px',
                        transition: 'transform 0.4s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(0,0,0,0.7)',
                        borderRadius: '50px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        color: '#fff',
                      }}
                    >
                      <i className="bi bi-arrows-fullscreen me-1" /> {isTr ? 'Büyüt' : 'Zoom'}
                    </div>
                  </div>

                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-danger text-uppercase" style={{ fontSize: '10px' }}>{item.tag}</span>
                      <span className="text-white-50 small"><i className="bi bi-calendar3 me-1" />{item.date}</span>
                    </div>
                    <h5 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
                      {item.title}
                    </h5>
                    <p className="text-white-50 small flex-grow-1 mb-3" style={{ lineHeight: '1.6' }}>
                      {item.caption}
                    </p>
                    <button
                      onClick={() => setLightboxImage(item)}
                      className="btn btn-sm btn-outline-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                      style={{ borderRadius: '8px', fontWeight: 600 }}
                    >
                      <i className="bi bi-eye-fill" /> {isTr ? 'Tam Boyutta İncele' : 'View Full Size'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YASAL ÇERÇEVE ── */}
      <section className="section light-background" id="permits">
        <div className="container" data-aos="fade-up">
          <div className="row gy-4">
            <div className="col-lg-6">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 hover-card">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: '#f5e6e6', flexShrink: 0 }}>
                    <i className="bi bi-shield-check fs-4" style={{ color: '#e61b23' }} />
                  </div>
                  <h3 className="h5 mb-0">Yasal Çerçeve &amp; İzinler</h3>
                </div>
                <p className="text-muted mb-3">Yarasa Araştırmaları Derneği tarafından yürütülen tüm saha çalışmaları resmi yasal izinler kapsamındadır:</p>
                <ul className="mb-0">
                  <li className="mb-2">
                    <strong>Hayvan Deneyleri Yerel Etik Kurulu (HADYEK) Onayı</strong><br />
                    <span className="text-muted small">Kırşehir Ahi Evran Üniversitesi — Şubat 2026</span>
                  </li>
                  <li>
                    <strong>T.C. Tarım ve Orman Bakanlığı, DKMP Genel Müdürlüğü Araştırma İzni</strong><br />
                    <span className="text-muted small">Mart 2026 ve devam eden izin protokolleri</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 hover-card">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: '#f5e6e6', flexShrink: 0 }}>
                    <i className="bi bi-building fs-4" style={{ color: '#e61b23' }} />
                  </div>
                  <h3 className="h5 mb-0">Kurumsal &amp; Akademik Bağlantılar</h3>
                </div>
                <p className="mb-0 text-muted" style={{ lineHeight: '1.8' }}>
                  Çalışmalarımız <strong>Kırşehir Ahi Evran Üniversitesi</strong> bünyesinde yürütülmekte; üniversitenin <strong>Bilimsel Araştırma Projeleri (BAP) Koordinatörlüğü</strong> aracılığıyla desteklenmekte ve denetlenmektedir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HİZMETLER ── */}
      <section id="services" className="services section">
        <div className="container section-title" data-aos="fade-up">
          <h2>HİZMETLER &amp; ÇALIŞMA ALANLARI</h2>
          <p>Yarasa Araştırmaları Derneği’nin temel çalışma başlıkları</p>
        </div>
        <div className="content">
          <div className="container">
            <div className="row g-0">
              {[
                { num: '01', icon: 'bi-search', title: 'Arazi Çalışması', desc: 'Mercek altında kentsel güzergâhlarda sistematik transekt, habitat analizi ve fauna tespiti.' },
                { num: '02', icon: 'bi-soundwave', title: 'Akustik İzleme (Ses Dinleme)', desc: 'Elekon Batlogger S2 ile ultrasonik ekolokasyon ses dinleme ve BatExplorer ile tür analizi.' },
                { num: '03', icon: 'bi-house-check-fill', title: 'Tünek Araştırması (Yuva Kontrolü)', desc: 'Köprü altları, kâgir tarihi yapılar ve nehir koridorunda yuva kontrolleri ve tünek haritalama.' },
                { num: '04', icon: 'bi-eye-fill', title: 'Farkındalık', desc: 'Halk bilinci artırma seminerleri ve yarasalar hakkındaki yanlış korkuların giderilmesi.' },
                { num: '05', icon: 'bi-book-fill', title: 'Eğitim', desc: 'Üye oryantasyonu, tür tanıma kılavuzları ve akustik dedektör kullanım atölyeleri.' },
                { num: '06', icon: 'bi-database-fill', title: 'Veri Yönetimi', desc: 'Ulusal biyoçeşitlilik veri tabanlarına (DKMP) katkı ve uzun dönemli arşivleme.' },
                { num: '07', icon: 'bi-people-fill', title: 'Dernek Üyeliği & Gönüllülük', desc: 'Sivil bilim katılımı ile vatandaşların doğa koruma süreçlerine doğrudan dahil edilmesi.' },
                { num: '08', icon: 'bi-share-fill', title: 'Bilimsel Yayın', desc: 'Hakemli SCI makaleler, araştırma raporları ve kamuoyu bilgilendirme bültenleri.' },
              ].map(s => (
                <div key={s.num} className="col-lg-3 col-md-6">
                  <div className="service-item">
                    <div className="service-item-icon"><i className={`bi ${s.icon}`} /></div>
                    <div className="service-item-content">
                      <h3 className="service-heading">{s.title}</h3>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BÜLTENİ ── */}
      <section className="call-to-action section light-background">
        <div className="content">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h3>Bültenimize Abone Olun</h3>
                <p className="opacity-75">Duyurular, yeni araştırmalar ve dernek faaliyetleri için e-posta adresinizi bırakabilirsiniz.</p>
              </div>
              <div className="col-lg-6">
                <NewsletterForm placeholder="E-posta adresiniz" />
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
