import { useState } from 'react'
import PageTitle from '../components/PageTitle'
import GonulluForm from '../components/GonulluForm'
import ImageLightbox, { type LightboxImage } from '../components/ImageLightbox'

const faq = [
  { q: 'Katılım ücretli mi?', a: 'Hayır. Tüm saha aktiviteleri gönüllülük esasıyla yürütülmekte olup herhangi bir katılım ücreti alınmamaktadır. Saha ekipmanı dernek tarafından karşılanmaktadır.' },
  { q: 'Ne sıklıkla katılmam gerekir?', a: 'Belirlenmiş bir zorunluluk yoktur. Haftada bir çıkışa katılım yeterli olmakla birlikte daha sık katılım memnuniyetle karşılanmaktadır.' },
  { q: 'Saha çalışmaları yılın hangi döneminde yapılıyor?', a: 'Ana survey dönemi Mart–Ekim arasındadır. Kış döneminde (Kasım–Şubat) hibernasyon alanı gözlemleri ve ofis bazlı veri analizleri sürdürülmektedir.' },
  { q: 'Katılımım bilimsel yayına katkı sağlar mı?', a: 'Veri toplama sürecine aktif katkıda bulunan gönüllüler, ilgili yayınlarda teşekkür bölümünde ya da katkı düzeyine göre yazar listesinde yer alabilmektedir.' },
  { q: 'Evinize veya çevrenize yarasa girdi mi?', a: 'Paniklemeyiniz. Yarasalar zararsız canlılardır. Bize ulaşın; gerekirse yerinde değerlendirme yapmak üzere sizi yönlendirebiliriz.' },
]

const volunteerGallery: LightboxImage[] = [
  {
    src: '/image/gonullu-ol/gonullu-gece-gozlemi.webp',
    title: 'Gece Transektinde Aktif Ses Kaydı',
    tag: 'Saha Gözlemi',
    date: '18 Mayıs 2026',
    caption: 'Gönüllülerimizle birlikte Kırşehir güzergâhında Elekon Batlogger ile gün batımı sonrası ultrasonik ekolokasyon kaydı.',
  },
  {
    src: '/image/gonullu-ol/gonullu-saha-egitimi-1.webp',
    title: 'Alacakaranlıkta Cihaz & Transekt Eğitimi',
    tag: 'Saha Eğitimi',
    date: '12 Mayıs 2026',
    caption: 'Saha çıkışı öncesinde gönüllülere GPS doğrulama ve dedektör kullanım protokolünün aktarılması.',
  },
  {
    src: '/image/gonullu-ol/gonullu-saha-egitimi-2.webp',
    title: 'Dedektör ile Canlı Ekolokasyon Takibi',
    tag: 'Akustik Uygulama',
    date: '12 Mayıs 2026',
    caption: 'Gönüllü ekibimizin canlı ses frekansı izleme ve anlık veri formu doldurma pratiği.',
  },
  {
    src: '/image/gonullu-ol/gonullu-universite-stant.webp',
    title: 'Ahi Evran Üniversitesi Tanıtım Standı',
    tag: 'Toplum Bilimi',
    date: '12 Mayıs 2026',
    caption: 'Fakülte fuaye alanında kurulan bilgilendirme standımız, posterlerimiz ve broşürlerimizle yeni gönüllü kayıtları.',
  },
  {
    src: '/image/gonullu-ol/gonullu-oryantasyon-1.webp',
    title: 'Gönüllü Oryantasyon & Bilgilendirme Semineri',
    tag: 'Oryantasyon',
    date: '23 Şubat 2026',
    caption: 'Yeni katılan gönüllülerimize Türkiye yarasa biyolojisi ve koruma mevzuatı üzerine verilen teorik seminer.',
  },
  {
    src: '/image/gonullu-ol/gonullu-oryantasyon-2.webp',
    title: 'Saha Çalışma Planlama Atölyesi',
    tag: 'Atölye',
    date: '23 Şubat 2026',
    caption: 'Gözlem güzergâhlarının belirlenmesi ve ekip koordinasyonu üzerine gönüllü çalışma grubu toplantısı.',
  },
  {
    src: '/image/gonullu-ol/gonullu-toplanti-gunduz.webp',
    title: 'Öğrenci Gözlemciler Kampüs Buluşması',
    tag: 'Topluluk',
    date: '20 Nisan 2026',
    caption: 'Saha haftası öncesinde üniversite kampüsünde toplanan gönüllü öğrenci araştırma ekibimiz.',
  },
]

export default function GonulluOl() {
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null)

  return (
    <main className="main">
      <PageTitle
        title="Gönüllü Ol"
        subtitle="Bilime katkı sağlayın — Yarasa gözlemcisi olun"
        crumb="Gönüllü Ol"
        bg="/image/gonullu-ol/gonullu-gece-gozlemi.webp"
      />

      {/* ── GİRİŞ BÖLÜMÜ ── */}
      <section className="section">
        <div className="container" data-aos="fade-up">
          <div className="row gy-4 align-items-center">
            <div className="col-lg-7">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 hover-card">
                <span className="badge bg-danger-subtle text-danger px-3 py-1 mb-2 fw-semibold">
                  <i className="bi bi-people-fill me-1" />Toplum Bilimi & Sivil Katılım
                </span>
                <h2 className="content-title mb-3" style={{ color: '#e61b23' }}>Bilime Birlikte Katkı Sağlayalım</h2>
                <p style={{ lineHeight: '1.8' }}>
                  Yarasa Araştırmaları Derneği, Kırşehir kentsel alanında ve doğal yaşam alanlarında yürütülen bilimsel saha çalışmalarına katkı sağlamak isteyen doğaseverleri ve öğrencileri davet ediyor. Sivil bilim (citizen science) yaklaşımı, hem veri toplama kapasitesini genişletmekte hem de toplumun biyoçeşitlilik koruma süreçlerine doğrudan dahil olmasını mümkün kılmaktadır.
                </p>
                <p className="mb-0" style={{ lineHeight: '1.8' }}>
                  Gönüllü olarak programımıza katılmak için biyoloji veya ekoloji geçmişine sahip olmanız <strong>zorunlu değildir</strong>. Saha çalışmalarına başlamadan önce ekipman kullanımı, tür tanıma ve veri kayıt protokolleri konularında kapsamlı bir oryantasyon ve pratik eğitim verilmektedir.
                </p>
              </div>
            </div>

            <div className="col-lg-5">
              <div
                className="rounded-3 overflow-hidden shadow-sm hover-card position-relative"
                onClick={() => setLightboxImage(volunteerGallery[3])}
                style={{ cursor: 'pointer', background: '#fff' }}
              >
                <img
                  src="/image/gonullu-ol/gonullu-universite-stant.webp"
                  alt="Ahi Evran Üniversitesi Gönüllü Standı"
                  className="img-fluid w-100"
                  style={{ maxHeight: '260px', objectFit: 'cover' }}
                />
                <div className="p-3 bg-white">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="badge bg-danger">Kampüs Standı</span>
                    <span className="text-muted small"><i className="bi bi-calendar3 me-1" />Mayıs 2026</span>
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: '#1a1a1a' }}>Ahi Evran Üniversitesi Bilgilendirme Standımız</h6>
                  <p className="text-muted small mb-0">Öğrencilerin ve doğaseverlerin yoğun katılımıyla gerçekleşen gönüllü buluşmamız.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KİMLER KATILABİLİR & GÖNÜLLÜLER NE YAPAR ── */}
      <section className="section light-background">
        <div className="container" data-aos="fade-up">
          <div className="row gy-4">
            <div className="col-lg-5">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 hover-card">
                <h3 className="h5 mb-3" style={{ color: '#e61b23' }}>
                  <i className="bi bi-person-check me-2" />Kimler Katılabilir?
                </h3>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead className="table-light"><tr><th>Profil</th><th>Açıklama</th></tr></thead>
                    <tbody>
                      <tr><td><strong>Üniversite Öğrencileri</strong></td><td>Tüm bölümlerden lisans ve lisansüstü</td></tr>
                      <tr><td><strong>Akademisyenler</strong></td><td>İlgili alanlardaki araştırmacılar</td></tr>
                      <tr><td><strong>Doğa Meraklıları</strong></td><td>Biyoloji bilgisi olmaksızın katılabilir</td></tr>
                      <tr><td><strong>Fotoğrafçılar</strong></td><td>Saha dokümantasyonuna katkı</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-muted small mb-0"><strong>⚠️ Not:</strong> 18 yaş altı bireyler için veli onayı gerekmektedir.</p>

                <div className="mt-4 pt-3 border-top">
                  <h6 className="fw-bold text-dark mb-2">Hızlı Başlangıç Bilgisi</h6>
                  <ul className="list-unstyled list-check small mb-0">
                    <li>Gün batımından 1 saat boyunca gözlem</li>
                    <li>Temel veri formu doldurma</li>
                    <li>İsteğe bağlı: ses kaydı analizi</li>
                    <li>Ekipman dernek tarafından sağlanır</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 hover-card">
                <h3 className="h5 mb-3" style={{ color: '#e61b23' }}>
                  <i className="bi bi-compass me-2" />Gönüllüler Ne Yapar?
                </h3>
                <div className="row g-3 mb-4">
                  {[
                    { icon: 'bi-moon-stars', title: 'Gün Batımı Surveyleri', desc: 'Belirlenmiş kentsel güzergâhlarda gün batımından itibaren ~90 dakika boyunca yarasa aktivitesinin gözlemlenmesi.' },
                    { icon: 'bi-soundwave', title: 'Akustik Kayıt Desteği', desc: 'Elekon Batlogger S2 dedektörü ile ultrasonik ses kayıtlarının gerçekleştirilmesi. Ekipman eğitimi verilmektedir.' },
                    { icon: 'bi-clipboard-check', title: 'Veri Formu Doldurma', desc: 'Her gözlem noktası için tarih, saat, hava koşulları ve aktivite yoğunluğuna ilişkin standart veri formunun doldurulması.' },
                    { icon: 'bi-camera', title: 'Saha Fotoğraflaması', desc: 'Potansiyel tünek alanlarının, yapıların ve saha koşullarının fotoğraflanarak belgelenmesi.' },
                    { icon: 'bi-laptop', title: 'Ofis Destekleri (İsteğe Bağlı)', desc: 'BatExplorer yazılımında ses kayıtlarının ön incelemesi, veri girişi ve literatür taraması.' },
                  ].map((item, i) => (
                    <div key={i} className="col-md-6">
                      <div className="d-flex gap-3 p-2 rounded-2" style={{ background: '#fdf7f7' }}>
                        <i className={`bi ${item.icon} fs-4 flex-shrink-0`} style={{ color: '#e61b23' }} />
                        <div>
                          <div className="fw-semibold small">{item.title}</div>
                          <div className="text-muted small">{item.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sahadan Mini Görseller */}
                <div className="row g-2">
                  <div className="col-6">
                    <div
                      className="rounded-2 overflow-hidden position-relative"
                      onClick={() => setLightboxImage(volunteerGallery[1])}
                      style={{ cursor: 'pointer', height: '110px' }}
                    >
                      <img src="/image/gonullu-ol/gonullu-saha-egitimi-1.webp" alt="Saha Eğitimi" loading="lazy" decoding="async" className="w-100 h-100 object-fit-cover" />
                      <div className="position-absolute bottom-0 start-0 end-0 p-1 bg-dark bg-opacity-75 text-white small text-center" style={{ fontSize: '11px' }}>
                        <i className="bi bi-zoom-in me-1" />Saha Eğitimi
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className="rounded-2 overflow-hidden position-relative"
                      onClick={() => setLightboxImage(volunteerGallery[2])}
                      style={{ cursor: 'pointer', height: '110px' }}
                    >
                      <img src="/image/gonullu-ol/gonullu-saha-egitimi-2.webp" alt="Cihaz Kullanımı" loading="lazy" decoding="async" className="w-100 h-100 object-fit-cover" />
                      <div className="position-absolute bottom-0 start-0 end-0 p-1 bg-dark bg-opacity-75 text-white small text-center" style={{ fontSize: '11px' }}>
                        <i className="bi bi-zoom-in me-1" />Dedektör Pratiği
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EĞİTİM & SSS ── */}
      <section className="section">
        <div className="container" data-aos="fade-up">
          <div className="row gy-4">
            <div className="col-lg-6">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 hover-card">
                <h3 className="h5 mb-4" style={{ color: '#e61b23' }}>
                  <i className="bi bi-mortarboard me-2" />Oryantasyon ve Eğitim Programı
                </h3>
                {[
                  { num: '1', title: 'Temel Yarasa Biyolojisi Semineri', time: '≈2 saat', desc: 'Türkiye\'de yaşayan başlıca yarasa türleri, ekolojik özellikleri ve korunma durumları hakkında teorik bilgi.' },
                  { num: '2', title: 'Ekipman Kullanımı Eğitimi', time: '≈1 saat', desc: 'Elekon Batlogger S2\'nin sahada kullanımı; kayıt modu seçimi, GPS doğrulama ve veri aktarımı.' },
                  { num: '3', title: 'Saha Protokolü Eğitimi', time: 'İlk saha çıkışında', desc: 'Aktif bir gözlem grubuna eşlik ederek survey protokolünün uygulamalı olarak öğrenilmesi.' },
                ].map((step, i) => (
                  <div key={i} className="d-flex gap-3 mb-3 p-2 rounded-2" style={{ background: '#fdf8f8' }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                      style={{ width: 36, height: 36, background: '#e61b23', color: '#fff', fontSize: '14px' }}>
                      {step.num}
                    </div>
                    <div>
                      <div className="fw-semibold">{step.title} <span className="badge ms-1" style={{ background: '#f5e6e6', color: '#e61b23', fontSize: '11px' }}>{step.time}</span></div>
                      <div className="text-muted small">{step.desc}</div>
                    </div>
                  </div>
                ))}

                {/* Oryantasyon Atölyesi Fotoğrafı */}
                <div
                  className="rounded-3 overflow-hidden shadow-sm mt-3 position-relative"
                  onClick={() => setLightboxImage(volunteerGallery[4])}
                  style={{ cursor: 'pointer', height: '150px' }}
                >
                  <img src="/image/gonullu-ol/gonullu-oryantasyon-1.webp" alt="Oryantasyon Atölyesi" loading="lazy" decoding="async" className="w-100 h-100 object-fit-cover" />
                  <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-75 text-white small d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-calendar3 me-1" />Şubat 2026 • Gönüllü Semineri</span>
                    <span className="text-danger fw-semibold"><i className="bi bi-zoom-in" /> Büyüt</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="col-lg-6">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 hover-card">
                <h3 className="h5 mb-4" style={{ color: '#e61b23' }}>
                  <i className="bi bi-question-circle me-2" />Sık Sorulan Sorular
                </h3>
                {faq.map((item, i) => (
                  <div key={i} className="mb-3 pb-3" style={{ borderBottom: i < faq.length - 1 ? '1px solid #f0e0e0' : 'none' }}>
                    <div className="fw-semibold small mb-1"><i className="bi bi-question-circle me-2" style={{ color: '#e61b23' }} />{item.q}</div>
                    <div className="text-muted small">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GÖNÜLLÜLERİMİZ SAHADA FOTOĞRAF GALERİSİ ── */}
      <section className="section" style={{ background: '#0e1014', color: '#fff', padding: '80px 0' }}>
        <div className="container" data-aos="fade-up">
          <div className="text-center mb-5">
            <span className="badge bg-danger px-3 py-1 mb-2 text-uppercase fw-semibold" style={{ letterSpacing: '1px' }}>
              <i className="bi bi-camera-fill me-1" />GÖNÜLLÜ ARŞİVİ
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#fff' }}>
              Gönüllülerimiz Sahada &amp; Eğitimde
            </h2>
            <p className="text-white-50" style={{ maxWidth: '640px', margin: '0 auto', fontSize: '15px' }}>
              Teorik seminerlerden gece transektlerine, kampüs stantlarından ekipman eğitimlerine kadar gönüllü topluluğumuzun aktif anları.
            </p>
          </div>

          <div className="row g-4">
            {volunteerGallery.map((item, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div
                  className="rounded-4 overflow-hidden position-relative hover-card"
                  onClick={() => setLightboxImage(item)}
                  style={{
                    cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: '#161920',
                    height: '250px',
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
                      padding: '18px',
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-danger text-uppercase" style={{ fontSize: '10px' }}>{item.tag}</span>
                      <span className="text-white-50 small"><i className="bi bi-calendar3 me-1" />{item.date}</span>
                    </div>
                    <h5 style={{ color: '#fff', fontSize: '15.5px', fontWeight: 600, margin: '2px 0 0' }}>
                      {item.title}
                    </h5>
                    <div className="mt-1 text-danger small fw-semibold d-flex align-items-center gap-1">
                      <i className="bi bi-zoom-in" /> İncele
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BAŞVURU FORMU ── */}
      <section className="section" id="basvuru-formu" style={{ background: '#f8fafc', padding: '80px 0', borderTop: '1px solid #edf2f7' }}>
        <GonulluForm />
      </section>

      {/* Görsel Lightbox Modal */}
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </main>
  )
}
