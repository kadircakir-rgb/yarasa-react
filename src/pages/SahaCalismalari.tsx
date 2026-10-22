import { useState, useMemo } from 'react'
import PageTitle from '../components/PageTitle'
import ImageLightbox, { type LightboxImage } from '../components/ImageLightbox'
import { useLangStore } from '../store/langStore'

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
  padding: '28px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
}

const highlight: React.CSSProperties = {
  background: '#f5e6e6',
  borderLeft: '4px solid #e61b23',
  borderRadius: '0 8px 8px 0',
  padding: '16px 20px',
  marginBottom: '16px',
}

interface FieldPhoto extends LightboxImage {
  category: 'tunek' | 'akustik' | 'habitat'
}

const allFieldPhotos: FieldPhoto[] = [
  {
    src: '/image/saha-calismalari/20260407_192330.webp',
    title: 'Akşam Gözlem Hazırlığı & Transekt Başlangıcı',
    category: 'akustik',
    tag: 'Akustik Dinleme',
    date: '7 Nisan 2026',
    caption: 'Kırşehir kentsel güzergâhında gün batımı öncesinde gözlem noktası istasyonunun kurulması ve GPS kalibrasyonu.',
  },
  {
    src: '/image/saha-calismalari/20260421_164620.webp',
    title: 'Tarihi Kâgir Yapı Derz ve Çatlak Kontrolü',
    category: 'tunek',
    tag: 'Yuva Kontrolü',
    date: '21 Nisan 2026',
    caption: 'Cacabey ve tarihi yapılarda derin taş çatlaklarının endoskopik kamera ile incelenmesi ve tünek haritalaması.',
  },
  {
    src: '/image/saha-calismalari/20260421_164711_0.webp',
    title: 'Tarihi Bina Duvar Çatlakları & Koloni Yuvası',
    category: 'tunek',
    tag: 'Yuva Kontrolü',
    date: '21 Nisan 2026',
    caption: 'Yarasaların kolonileşme yuvası olarak kullandığı taş duvar genleşme boşluklarının incelenmesi.',
  },
  {
    src: '/image/saha-calismalari/20260428_194136.webp',
    title: 'Elekon Batlogger S2 ile Gün Batımı Transekti',
    category: 'akustik',
    tag: 'Akustik Dinleme',
    date: '28 Nisan 2026',
    caption: 'Gün batımı anında başlayan akustik dinleme transektinde ultrasonik ekolokasyon çağrılarının kaydı.',
  },
  {
    src: '/image/saha-calismalari/20260428_194815.webp',
    title: 'Kızılırmak Ripariyen Koridoru & Uçuş Hattı',
    category: 'habitat',
    tag: 'Doğal Habitat',
    date: '28 Nisan 2026',
    caption: 'Nehir vadisi boyunca yarasaların avlanma koridoru ve su kenarı vejetasyon dinamiklerinin izlenmesi.',
  },
  {
    src: '/image/saha-calismalari/20260513_133239.webp',
    title: 'Betonarme Köprü Genleşme Derzi Yuva Kontrolü',
    category: 'tunek',
    tag: 'Yuva Kontrolü',
    date: '13 Mayıs 2026',
    caption: 'Nehir üstü betonarme köprü genleşme derzlerinde gündüz tünek tespiti ve guano (dışkı) izi araması.',
  },
  {
    src: '/image/saha-calismalari/20260513_145101.webp',
    title: 'Ripariyen Sulak Alan ve Kıyı Habitat Taraması',
    category: 'habitat',
    tag: 'Doğal Habitat',
    date: '13 Mayıs 2026',
    caption: 'Sucul böcek popülasyonlarının yoğun olduğu sulak alanlarda potansiyel yarasa beslenme sahalarının tespiti.',
  },
  {
    src: '/image/saha-calismalari/20260513_145112.webp',
    title: 'Kızılırmak Kıyı Vejetasyonu & Av Alanı',
    category: 'habitat',
    tag: 'Doğal Habitat',
    date: '13 Mayıs 2026',
    caption: 'Kıyı boyu ağaç örtüsünün Pipistrellus ve Myotis türleri için korunaklı uçuş hattı sağlama analizi.',
  },
  {
    src: '/image/saha-calismalari/20260513_200047.webp',
    title: 'Köprü Altı Akşam Çıkış Sayımı & Gözlem',
    category: 'tunek',
    tag: 'Yuva Kontrolü',
    date: '13 Mayıs 2026',
    caption: 'Alacakaranlıkta köprü altı derzlerden çıkan yarasaların sayımı ve termal optik takibi.',
  },
  {
    src: '/image/saha-calismalari/20260519_104557.webp',
    title: 'Bozkır ve Kayalık Ziyaret Ekibi Transekti',
    category: 'habitat',
    tag: 'Doğal Habitat',
    date: '19 Mayıs 2026',
    caption: 'İç Anadolu bozkır ekosisteminde doğal kaya tünekleri ve çatlak araştırması yürüten ekibimiz.',
  },
  {
    src: '/image/saha-calismalari/20260519_104602.webp',
    title: 'Doğal Kaya Sığınakları ve Çatlak Morfolojisi',
    category: 'habitat',
    tag: 'Doğal Habitat',
    date: '19 Mayıs 2026',
    caption: 'Rhinolophus türlerinin gündüz dinlenme ve kış uykusu için tercih ettiği derin kaya kütleleri.',
  },
  {
    src: '/image/saha-calismalari/20260602_201629_1.webp',
    title: 'Kentsel Tünek Girişi ve Koloni Çıkışı',
    category: 'tunek',
    tag: 'Yuva Kontrolü',
    date: '2 Haziran 2026',
    caption: 'Kentsel binada aktif tünek girişinin gün batımında izlenmesi ve birey çıkış frekansı tespiti.',
  },
  {
    src: '/image/saha-calismalari/20260602_201650.webp',
    title: 'Gece Transekt Alanı Geniş Panoraması',
    category: 'akustik',
    tag: 'Akustik Dinleme',
    date: '2 Haziran 2026',
    caption: 'Gece saatlerinde akustik ses dinleme dedektörleriyle taranan açık alan ve habitat manzarası.',
  },
  {
    src: '/image/saha-calismalari/20260602_201813.webp',
    title: 'Alacakaranlıkta Ultrasonik Ses Dinleme',
    category: 'akustik',
    tag: 'Akustik Dinleme',
    date: '2 Haziran 2026',
    caption: 'İlk avlanma uçuşuna çıkan bireylerin tepe frekanslarının (Fpeak) dedektörle anlık tespiti.',
  },
  {
    src: '/image/saha-calismalari/20260602_203625.webp',
    title: 'Gece Ses Spektrogram Kaydı & Tür Ayrımı',
    category: 'akustik',
    tag: 'Akustik Dinleme',
    date: '2 Haziran 2026',
    caption: 'Kayıt altına alınan ekolokasyon çağrılarının frekans parametrelerine göre tür düzeyinde sınıflandırılması.',
  },
  {
    src: '/image/saha-calismalari/20260706_140935.webp',
    title: 'Karstik Kanyon ve Doğal Mağara Keşfi',
    category: 'habitat',
    tag: 'Doğal Habitat',
    date: '6 Temmuz 2026',
    caption: 'Bölgesel doğal mağara tüneklerinin ve kış uykusu (hibernasyon) potansiyelinin yerinde incelenmesi.',
  },
]

export default function SahaCalismalari() {
  const { lang } = useLangStore()
  const isTr = lang === 'tr'
  const [filter, setFilter] = useState<'all' | 'tunek' | 'akustik' | 'habitat'>('all')
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null)

  const filteredPhotos = useMemo(() => {
    if (filter === 'all') return allFieldPhotos
    return allFieldPhotos.filter(p => p.category === filter)
  }, [filter])

  return (
    <main className="main">
      <PageTitle
        title={isTr ? "Saha Çalışmaları" : "Field Studies"}
        subtitle={isTr ? "Kırşehir yarasa faunasının belirlenmesi, akustik izleme (ses dinleme) ve tünek araştırmaları (yuva kontrolü)" : "Determining Kırşehir bat fauna, acoustic monitoring (listening), and roost surveys"}
        crumb={isTr ? "Saha Çalışmaları" : "Field Studies"}
        bg="/image/saha-calismalari/20260602_201650.webp"
      />

      {/* ── GİRİŞ ── */}
      <section className="section">
        <div className="container" data-aos="fade-up">
          <div className="row gy-4 align-items-start">
            <div className="col-lg-7">
              <div className="hover-card" style={card}>
                <span className="badge bg-danger-subtle text-danger px-3 py-1 mb-2 fw-semibold">
                  <i className="bi bi-award me-1" />{isTr ? 'BAP Destekli Araştırma' : 'BAP Funded Research'}
                </span>
                <h2 className="content-title mb-3" style={{ color: '#e61b23' }}>
                  {isTr ? 'Kırşehir Yarasa Faunasının Belirlenmesi ve Kentsel İzleme Projesi' : 'Determining Kırşehir Bat Fauna & Urban Monitoring Project'}
                </h2>
                <p>
                  Kentsel ve yarı-doğal habitatlarda yürütülen yarasa araştırmaları, son on yılda koruma biyolojisinin öncelikli gündem maddelerinden biri hâline gelmiştir. Russo &amp; Ancillotto (2015), kentsel alandaki yarasa topluluklarının yapısının; habitat kalitesinin, parçalanmanın ve antropojenik kirlilik baskısının güvenilir bir göstergesi olduğunu vurgulamaktadır. Buna karşın İç Anadolu'daki kentsel merkezlere özgü sistematik yarasa araştırmaları literatürde büyük ölçüde eksik kalmaktadır (Karataş &amp; Sözen, 2006; Yorulmaz &amp; Arslan, 2020).
                </p>
                <p>
                  Bu bağlamda <strong>Yarasa Araştırmaları Derneği</strong>, Kırşehir Ahi Evran Üniversitesi BAP desteğiyle il genelinde kapsamlı bir kentsel ve bölgesel izleme çalışması yürütmektedir.
                </p>
                <div style={highlight}>
                  <p className="mb-0" style={{ fontStyle: 'italic', color: '#1a1a1a', fontWeight: 500 }}>
                    "Kırşehir yarasa faunası hangi türleri barındırmaktadır? Bu türler hangi mikro-habitatları tünek (yuva) ve avlanma alanı olarak kullanmaktadır?"
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hover-card" style={card}>
                <h3 className="h5 mb-3" style={{ color: '#e61b23' }}>
                  <i className="bi bi-speedometer2 me-2" />{isTr ? 'Hızlı Özet' : 'Quick Summary'}
                </h3>
                <ul className="list-unstyled list-check mb-3">
                  <li>3 aktif gözlemci ve araştırma grubu</li>
                  <li>6 Elekon Batlogger S2 ultrasonik ses dedektörü</li>
                  <li>Haftada düzenli yuva kontrolü ve ses dinleme çıkışları</li>
                  <li>Non-invasif (hayvana zarar vermeyen) bilimsel yöntemler</li>
                  <li>Kırşehir genelinde 41 tür çerçevesinde fauna tespiti</li>
                  <li>Mart 2026'dan bu yana aktif</li>
                </ul>
                <div
                  className="rounded-3 overflow-hidden position-relative shadow-sm mt-3"
                  onClick={() => setLightboxImage(allFieldPhotos[3])}
                  style={{ cursor: 'pointer', height: '175px' }}
                >
                  <img src="/image/saha-calismalari/20260428_194136.webp" alt="Saha Özet" loading="lazy" decoding="async" className="img-fluid w-100 h-100 object-fit-cover" />
                  <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-75 text-white small d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-calendar3 me-1" />Akustik Transekt</span>
                    <span className="text-danger fw-semibold"><i className="bi bi-zoom-in" /> Büyüt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BÖLÜM 1: HEDEFLER ── */}
      <section className="section light-background">
        <div className="container" data-aos="fade-up">
          <h2 className="content-title mb-2" style={{ color: '#e61b23' }}>{isTr ? 'Araştırmanın Amacı ve Metodolojisi' : 'Research Objectives & Methodology'}</h2>
          <p className="text-muted mb-4">{isTr ? 'Mevcut çalışma üç temel metodolojik hedef doğrultusunda yapılandırılmıştır:' : 'The research is structured around three core methodological objectives:'}</p>
          <div className="row gy-4">
            {[
              {
                num: '1',
                label: isTr ? 'Hedef 1' : 'Goal 1',
                title: isTr ? 'Tünek Araştırması (Yuva Kontrolü)' : 'Roost Research (Roost Inspection)',
                text: isTr
                  ? 'Tünek araştırması; yarasaların gündüz dinlendiği, kış uykusuna yattığı veya yavruladığı doğal ve yapay sığınakların (yuva alanlarının) tespit edilerek kontrol edilmesi anlamına gelir. Kırşehir il merkezinde köprü altları, tarihi kâgir binalar ve nehir koridoru boyunca aktif ve potansiyel tünek alanları sistematik olarak haritalanmaktadır. Endoskopik optik ve termal kameralarla yuvalara müdahale edilmeden sayım yapılmaktadır.'
                  : 'Roost research means inspecting natural and anthropogenic shelters where bats rest during daytime, hibernate, or rear young. Roosts along bridge joints and historical structures are mapped systematically using endoscopic and thermal tools without disturbance.'
              },
              {
                num: '2',
                label: isTr ? 'Hedef 2' : 'Goal 2',
                title: isTr ? 'Akustik İzleme (Ses Dinleme)' : 'Acoustic Monitoring (Sound Listening)',
                text: isTr
                  ? 'Akustik izleme; insan kulağının işitemediği yüksek frekanslı ultrasonik ekolokasyon seslerinin profesyonel dedektörlerle dinlenmesi ve spektral analize tabi tutulmasıdır. Elekon Batlogger S2 ile alınan kayıtlar; tür tespiti, uçuş koridorlarının belirlenmesi ve mevsimsel aktivite değişimlerinin ortaya çıkarılmasında altın standarttır (Jones ve ark., 2009).'
                  : 'Acoustic monitoring is the listening and spectral analysis of ultrasonic echolocation calls inaudible to human ears. Recordings with Batlogger S2 serve as the gold standard for species ID and activity evaluation.'
              },
              {
                num: '3',
                label: isTr ? 'Hedef 3' : 'Goal 3',
                title: isTr ? 'Kırşehir Yarasa Faunasının Belirlenmesi' : 'Determining Kırşehir Bat Fauna',
                text: isTr
                  ? 'Kızılırmak ripariyen koridoru, yarı-kurak bozkır zonu, tarihi kent merkezi ve Seyfe Gölü havzasındaki farklı habitat tipleri karşılaştırılarak Kırşehir il envanteri çıkarılmakta ve Türkiye genelindeki 41 tür dağılım haritasına işlenmektedir.'
                  : 'By comparing diverse habitats including the Kızılırmak river corridor, semi-arid steppe, and historical quarters, Kırşehir inventory is established within Turkey’s 41 species catalogue.'
              },
            ].map((item, i) => (
              <div key={i} className="col-lg-4">
                <div className="hover-card h-100" style={card}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div style={{ width: 44, height: 44, background: '#e61b23', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontWeight: 700, fontSize: '18px' }}>
                      {item.num}
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#e61b23', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                      <h5 className="mb-0" style={{ color: '#1a1a1a', fontSize: '15px' }}>{item.title}</h5>
                    </div>
                  </div>
                  <p className="mb-0 text-muted" style={{ fontSize: '14px', lineHeight: '1.7' }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BÖLÜM 2: ÇALIŞMA ALANI & GÜZERGAHLAR ── */}
      <section className="section">
        <div className="container" data-aos="fade-up">
          <h2 className="content-title mb-2" style={{ color: '#e61b23' }}>Kırşehir İl Merkezi — Araştırma Bölgesi ve Güzergâhlar</h2>
          <div className="row gy-4">
            <div className="col-lg-5">
              <p>
                Kırşehir, İç Anadolu'nun Kızılırmak havzasında yer alan, yarı kurak iklim koşullarına sahip zengin bir biyocoğrafi merkezdir. Orta Anadolu steplerinin fauna elemanları ile Kızılırmak vadisi ripariyen ekosisteminin kesişim noktası olması, yüksek yarasa tür zenginliğine zemin hazırlamaktadır.
              </p>
              <div
                className="rounded-3 overflow-hidden shadow-sm hover-card position-relative mt-2"
                onClick={() => setLightboxImage(allFieldPhotos[2])}
                style={{ cursor: 'pointer' }}
              >
                <img src="/image/saha-calismalari/20260421_164711_0.webp" alt="Cacabey ve Tarihi Yapı Tünekleri" loading="lazy" decoding="async" className="img-fluid rounded-3 shadow-sm w-100" />
                <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-75 text-white small d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-geo-alt me-1" />Cacabey &amp; Tarihi Yapı Transekti</span>
                  <span className="text-danger fw-semibold"><i className="bi bi-zoom-in" /> Büyüt</span>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="hover-card" style={card}>
                <h5 className="mb-3" style={{ color: '#e61b23' }}>
                  <i className="bi bi-map me-2" />{isTr ? 'Çalışma Güzergâhları ve Habitat Tipleri' : 'Study Transects & Habitat Types'}
                </h5>
                <p className="text-muted small mb-3">Çalışma kapsamında dört ana habitat tipi belirlenmiş ve sistematik transekt güzergâhları oluşturulmuştur:</p>
                
                {/* Tünek fotoğrafları */}
                <div className="row g-2 mb-3">
                  {[
                    { src: '/image/saha-calismalari/20260421_164620.webp', title: 'Tarihi Yapı Çatlağı', item: allFieldPhotos[1] },
                    { src: '/image/saha-calismalari/20260513_133239.webp', title: 'Köprü Derz Yuvası', item: allFieldPhotos[5] },
                    { src: '/image/saha-calismalari/20260513_200047.webp', title: 'Akşam Yuva Çıkışı', item: allFieldPhotos[8] },
                  ].map((p, i) => (
                    <div key={i} className="col-4">
                      <div
                        className="rounded-2 overflow-hidden position-relative shadow-sm"
                        onClick={() => setLightboxImage(p.item)}
                        style={{ cursor: 'pointer', height: '95px' }}
                      >
                        <img src={p.src} alt={p.title} className="w-100 h-100 object-fit-cover" />
                        <div className="position-absolute bottom-0 start-0 end-0 p-1 bg-dark bg-opacity-75 text-white text-center" style={{ fontSize: '10px' }}>
                          {p.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="table-responsive">
                  <table className="table align-middle mb-0" style={{ fontSize: '13px' }}>
                    <thead style={{ background: '#1a1a1a', color: '#fff' }}>
                      <tr>
                        <th style={{ padding: '10px 14px' }}>Güzergâh</th>
                        <th style={{ padding: '10px 14px' }}>Habitat Tipi</th>
                        <th style={{ padding: '10px 14px' }}>Özellikler &amp; Yuva Durumu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { g: 'G1 — Nehir Koridoru', tip: 'Ripariyen habitat', ozellik: 'Kızılırmak kolları; yoğun sucul böcek popülasyonu; su kenarı avlanma alanı' },
                        { g: 'G2 — Tarihi Yapılar & Cacabey', tip: 'Yapı tünekleri', ozellik: 'Kâgir taş boşlukları, ahşap çatı araları, kolonileşme yuvaları' },
                        { g: 'G3 — Köprü Altları', tip: 'Yapay tünek (Yuva)', ozellik: 'Beton derz boşlukları, korunaklı çatlaklar, periyodik yuva kontrolleri' },
                        { g: 'G4 — Kentsel Sokak Dokusu', tip: 'Açık alan av habitatı', ozellik: 'Yapay aydınlatma hatları; sokak lambası etrafı avlanma dinamikleri' },
                      ].map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fdf5f5' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#e61b23' }}>{row.g}</td>
                          <td style={{ padding: '10px 14px', color: '#555' }}>{row.tip}</td>
                          <td style={{ padding: '10px 14px', color: '#555' }}>{row.ozellik}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BÖLÜM 3: SAHA ARAŞTIRMALARI FOTOĞRAF ARŞİVİ (16 FOTOĞRAF) ── */}
      <section className="section" style={{ background: '#0e1014', color: '#fff', padding: '80px 0' }}>
        <div className="container" data-aos="fade-up">
          <div className="d-flex align-items-end justify-content-between mb-4 flex-wrap gap-3">
            <div>
              <span className="badge bg-danger px-3 py-1 mb-2 text-uppercase fw-semibold" style={{ letterSpacing: '1px' }}>
                <i className="bi bi-camera-fill me-1" />BELGESEL FOTOĞRAF ARŞİVİ
              </span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                {isTr ? 'Saha Çalışmalarımızdan Kesitler (16 Fotoğraf)' : 'Field Research Gallery (16 Photos)'}
              </h2>
              <p className="text-white-50 mt-2 mb-0" style={{ maxWidth: '640px', fontSize: '15px' }}>
                {isTr
                  ? 'Kırşehir ve çevresinde yürüttüğümüz tünek yuva kontrolleri, gün batımı akustik dinlemeleri ve nehir koridoru transektlerinden gerçek araştırma kareleri.'
                  : 'Authentic photos covering roost inspections, sunset acoustic sessions, and riparian corridor transects.'}
              </p>
            </div>

            {/* Kategori Filtre Butonları */}
            <div className="d-flex gap-2 flex-wrap">
              {[
                { id: 'all', label: isTr ? 'Tümü (16)' : 'All (16)' },
                { id: 'tunek', label: isTr ? 'Tünek & Yuva Kontrolü' : 'Roost Inspection' },
                { id: 'akustik', label: isTr ? 'Akustik & Gece' : 'Acoustic & Night' },
                { id: 'habitat', label: isTr ? 'Ripariyen & Doğal Habitat' : 'Riparian & Habitat' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`btn btn-sm px-3 py-2 ${filter === tab.id ? 'btn-danger' : 'btn-outline-light'}`}
                  style={{ borderRadius: '50px', fontSize: '13px', fontWeight: 500 }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fotoğraf Izgarası */}
          <div className="row g-4">
            {filteredPhotos.map((item, idx) => (
              <div key={idx} className="col-lg-3 col-md-6">
                <div
                  className="rounded-4 overflow-hidden position-relative hover-card"
                  onClick={() => setLightboxImage(item)}
                  style={{
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: '#161920',
                    height: '240px',
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
                      background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '16px',
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-danger text-uppercase" style={{ fontSize: '9.5px' }}>{item.tag}</span>
                      <span className="text-white-50 small" style={{ fontSize: '11px' }}><i className="bi bi-calendar3 me-1" />{item.date}</span>
                    </div>
                    <h6 style={{ color: '#fff', fontSize: '14.5px', fontWeight: 600, margin: '2px 0 0', lineHeight: 1.3 }}>
                      {item.title}
                    </h6>
                    <div className="mt-1 text-danger small fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                      <i className="bi bi-zoom-in" /> İncele
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BÖLÜM 4: EKİPMAN ── */}
      <section className="section light-background">
        <div className="container" data-aos="fade-up">
          <h2 className="content-title mb-4" style={{ color: '#e61b23' }}>{isTr ? 'Saha Ekipmanı ve Ultrasonik Ses Dinleme Altyapısı' : 'Field Equipment & Acoustic Setup'}</h2>
          <div className="row gy-4">
            {[
              {
                icon: 'bi-soundwave',
                title: 'Elekon Batlogger S2',
                subtitle: isTr ? 'Ultrasonik Ses Dinleme & Kayıt Cihazı' : 'Ultrasonic Sound Recording Detector',
                text: '10–192 kHz aralığında tam spektrum kayıt alabilen, GPS koordinatlı profesyonel dedektörümüz ile yarasaların yaydığı ultrasonik yankı sesleri anlık dinlenmekte ve XML metadata ile saklanmaktadır.',
                img: '/image/batlogger.jpg'
              },
              {
                icon: 'bi-bar-chart-line',
                title: 'BatExplorer & Analiz',
                subtitle: isTr ? 'Akustik Ses Analiz Yazılımı' : 'Acoustic Sound Analysis Software',
                text: 'Toplanan WAV kayıtları; time-expanded oynatma, tepe frekansı (Fpeak) tespiti ve Avrupa/Türkiye tür referans veri tabanına göre spektrogram analizlerine tabi tutularak tür tanımlaması kesinleştirilmektedir.',
                img: null
              },
              {
                icon: 'bi-camera-video',
                title: 'Endoskop Kamera & Fener',
                subtitle: isTr ? 'Yuva Kontrolü ve Tünek Tespiti' : 'Roost Inspection Camera',
                text: 'Tarihi binalardaki derin çatlaklar, köprü genleşme derzleri ve mağara boşluklarında bireyleri rahatsız etmeden yuva kontrolü ve koloni sayımı yapmak üzere optik endoskopik kamera kullanılmaktadır.',
                img: null
              },
            ].map((item, i) => (
              <div key={i} className="col-lg-4">
                <div className="hover-card h-100" style={card}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div style={{ width: 44, height: 44, background: '#f5e6e6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`bi ${item.icon} fs-4`} style={{ color: '#e61b23' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '15px' }}>{item.title}</div>
                      <div style={{ color: '#e61b23', fontSize: '12px' }}>{item.subtitle}</div>
                    </div>
                  </div>
                  <p className="text-muted mb-3" style={{ fontSize: '14px', lineHeight: '1.7' }}>{item.text}</p>
                  {item.img && <img src={item.img} alt={item.title} className="img-fluid rounded-3" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BÖLÜM 5: ÇALIŞMA TAKVİMİ ── */}
      <section className="section">
        <div className="container" data-aos="fade-up">
          <h2 className="content-title mb-4" style={{ color: '#e61b23' }}>
            {isTr ? 'Gözlem Grupları ve Çalışma Takvimi' : 'Observer Groups & Activity Schedule'}
          </h2>
          <div className="row gy-4">
            <div className="col-lg-5">
              <div className="hover-card h-100" style={card}>
                <h5 className="mb-3" style={{ color: '#e61b23' }}>
                  <i className="bi bi-people me-2" />{isTr ? 'Gözlemci & Araştırma Grupları' : 'Observer Teams'}
                </h5>
                <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.7' }}>
                  Çalışma; her biri belirlenmiş transekt güzergâhlarından sorumlu <strong>üç aktif gözlemci grubundan</strong> oluşmaktadır. Gruplar Kırşehir Ahi Evran Üniversitesi lisans, lisansüstü öğrencileri ve dernek gönüllülerimizden teşekkül etmektedir.
                </p>
                <div
                  className="rounded-3 overflow-hidden shadow-sm mt-3 position-relative"
                  onClick={() => setLightboxImage(allFieldPhotos[9])}
                  style={{ cursor: 'pointer', height: '175px' }}
                >
                  <img src="/image/saha-calismalari/20260519_104557.webp" alt="Saha Araştırma Grubu" loading="lazy" decoding="async" className="img-fluid w-100 h-100 object-fit-cover" />
                  <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-75 text-white small d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-geo-alt me-1" />Arazi Gözlemci Ekibi</span>
                    <span className="text-danger fw-semibold"><i className="bi bi-zoom-in" /> Büyüt</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="hover-card h-100" style={card}>
                <h5 className="mb-4" style={{ color: '#e61b23' }}>
                  <i className="bi bi-calendar-check me-2" />{isTr ? 'Çalışma Takvimi ve Protokolü' : 'Activity Schedule & Protocol'}
                </h5>
                <div className="row g-3 mb-4">
                  {[
                    { icon: 'bi-calendar3', label: isTr ? 'Saha Başlangıç & Sezon' : 'Season Start', val: 'Mart 2026 sonları itibarıyla aktif ve devam eden periyodik çıkışlar' },
                    { icon: 'bi-arrow-repeat', label: isTr ? 'Çalışma Sıklığı' : 'Frequency', val: 'Haftada en az iki kez planlı gece transektleri ve yuva kontrolleri' },
                    { icon: 'bi-sunset', label: isTr ? 'Çalışma Zamanı (Ses Dinleme & Çıkış)' : 'Survey Hours', val: 'Gün batımından 20 dakika önce başlanmakta; şafak öncesi yuva dönüş kontrolleri eklenmektedir' },
                    { icon: 'bi-cloud-sun', label: isTr ? 'Hava Koşulu Kriteri' : 'Weather Condition', val: 'Yağmursuz, rüzgâr hızı < 5 m/s, hava sıcaklığı > 10°C' },
                    { icon: 'bi-clipboard-data', label: isTr ? 'Veri Kaydı & Yuva Haritası' : 'Data Logging', val: 'GPS koordinatı, sıcaklık, akustik tepe frekansı ve yuva kontrol formu eş zamanlı işlenir' },
                  ].map((item, i) => (
                    <div key={i} className="col-12">
                      <div className="d-flex align-items-start gap-3 p-3 rounded-2" style={{ background: '#fdf5f5' }}>
                        <i className={`bi ${item.icon} fs-5 flex-shrink-0 mt-1`} style={{ color: '#e61b23' }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: '#1a1a1a' }}>{item.label}</div>
                          <div style={{ fontSize: '13px', color: '#666' }}>{item.val}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#f5e6e6', borderLeft: '4px solid #e61b23', padding: '12px 16px', borderRadius: '0 8px 8px 0', fontSize: '13px', color: '#555' }}>
                  Bu çalışma takvimi; gün batımı çıkış kontrolü ve şafak dönüş yuva sayımı standartlarıyla tam uyumludur (Froidevaux ve ark., 2020).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BÖLÜM 6: YASAL ÇERÇEVE ── */}
      <section className="section light-background">
        <div className="container" data-aos="fade-up">
          <h2 className="content-title mb-4" style={{ color: '#e61b23' }}>İzin ve Etik Onay Bilgileri</h2>
          <div className="row gy-4">
            <div className="col-lg-7">
              <div className="hover-card h-100" style={card}>
                <h5 className="mb-4" style={{ color: '#e61b23' }}>
                  <i className="bi bi-shield-check me-2" />Yasal İzinler &amp; Etik Standartlar
                </h5>
                <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
                  Yarasa Araştırmaları Derneği tarafından yürütülen tüm saha çalışmaları resmi izinler ve etik onaylar kapsamında gerçekleştirilmektedir:
                </p>
                {[
                  {
                    icon: 'bi-patch-check-fill',
                    title: 'Hayvan Deneyleri Yerel Etik Kurulu (HADYEK) Onayı',
                    detail: 'Kırşehir Ahi Evran Üniversitesi — Şubat 2026'
                  },
                  {
                    icon: 'bi-patch-check-fill',
                    title: 'Araştırma ve Veri Toplama İzni',
                    detail: 'T.C. Tarım ve Orman Bakanlığı, Doğa Koruma ve Milli Parklar Genel Müdürlüğü (DKMP) — Mart 2026'
                  },
                ].map((item, i) => (
                  <div key={i} className="d-flex align-items-start gap-3 mb-3 p-3 rounded-2" style={{ background: '#fdf5f5' }}>
                    <i className={`bi ${item.icon} fs-5 flex-shrink-0`} style={{ color: '#e61b23' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#1a1a1a' }}>{item.title}</div>
                      <div style={{ fontSize: '13px', color: '#666' }}>{item.detail}</div>
                    </div>
                  </div>
                ))}
                <div style={{ background: '#f5e6e6', borderLeft: '4px solid #e61b23', padding: '12px 16px', borderRadius: '0 8px 8px 0', fontSize: '13px', color: '#555', marginTop: '16px' }}>
                  Tüm gözlemler non-invasif yöntemlerle yapılmakta; hayvanlara müdahale edilmemektedir. Akustik ses dinleme ve yuva kontrolleri çevreye ve canlıya zarar vermez.
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hover-card h-100" style={card}>
                <h5 className="mb-3" style={{ color: '#e61b23' }}>
                  <i className="bi bi-journal-text me-2" />Bilimsel Çıktılar &amp; Yayınlar
                </h5>
                <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
                  Kırşehir yarasa faunası araştırma sonuçları, SCI makale ve teknik raporlar hâlinde derlenmekte olup ulusal veri tabanlarına işlenmektedir.
                </p>
                <div
                  className="rounded-3 overflow-hidden shadow-sm position-relative"
                  onClick={() => setLightboxImage(allFieldPhotos[12])}
                  style={{ cursor: 'pointer', height: '175px' }}
                >
                  <img src="/image/saha-calismalari/20260602_201650.webp" alt="Yayınlar ve Raporlama" loading="lazy" decoding="async" className="img-fluid w-100 h-100 object-fit-cover" />
                  <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-75 text-white small d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-journal-check me-1" />Fauna Envanter Sahası</span>
                    <span className="text-danger fw-semibold"><i className="bi bi-zoom-in" /> Büyüt</span>
                  </div>
                </div>
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
