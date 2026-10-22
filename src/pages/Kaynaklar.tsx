import { useState } from 'react'
import PageTitle from '../components/PageTitle'
import { useLangStore } from '../store/langStore'

interface DocItem {
  id: string
  title: string
  category: string
  desc: string
  img: string
  fileUrl: string
  format: string
  size: string
  badge: string
}

const officialDocs: DocItem[] = [
  {
    id: 'poster-tunek',
    title: 'Tünek Koruma Posteri (50x70 cm)',
    category: 'Resmi Dernek Posteri',
    desc: 'Yarasaların ekolojik önemi, tünek alanlarının korunması (2872 ve 4915 sayılı kanunlar) ve yuva tahribatının önlenmesi amacıyla derneğimizce hazırlanan resmi basılı afiş.',
    img: '/image/tunek-poster-preview.webp',
    fileUrl: '/image/tunek-poster.jpg',
    format: 'Yüksek Çözünürlüklü JPG (50x70)',
    size: '15.9 MB',
    badge: 'Resmi Afiş'
  },
  {
    id: 'brosur-on',
    title: 'Yarasa Bilgilendirme Broşürü — Kapak & Ön Yüz',
    category: 'Halk Eğitimi ve Farkındalık',
    desc: 'Yarasalar hakkında doğru bilinen yanlışlar, tarımsal biyolojik mücadeledeki rolleri ve vatandaş bilimi ilkelerini açıklayan resmi broşür.',
    img: '/image/brosur-1-preview.webp',
    fileUrl: '/image/brosur-1.png',
    format: 'Yüksek Çözünürlüklü PNG',
    size: '4.4 MB',
    badge: 'Broşür Kapak'
  },
  {
    id: 'brosur-arka',
    title: 'Yarasa Bilgilendirme Broşürü — İç & Arka Yüz',
    category: 'Tür Bilgisi ve Koruma Protokolü',
    desc: 'Bölgesel yarasa türleri, tünek tespiti, yuva kontrolü kuralları ve evinize yarasa girdiğinde izlenmesi gereken adımlar.',
    img: '/image/brosur-2-preview.webp',
    fileUrl: '/image/brosur-2.jpg',
    format: 'Yüksek Çözünürlüklü JPG',
    size: '16.8 MB',
    badge: 'Broşür İçerik'
  },
]

const cards = [
  {
    icon: 'bi-book',
    title: 'Rehberler & Tür Tanımlama',
    items: [
      { icon: 'bi-file-earmark-pdf', label: 'Türkiye Yarasa Türleri Teşhis Kılavuzu', badge: 'Hazırlanıyor' },
      { icon: 'bi-soundwave', label: 'Elekon Batlogger S2 ile Akustik İzleme Rehberi', badge: 'Saha Kılavuzu' },
      { icon: 'bi-file-earmark-code', label: 'BatExplorer Akustik Sinyal Analiz Protokolü', badge: 'Protokol' },
    ]
  },
  {
    icon: 'bi-journal-text',
    title: 'Araştırma & Mevzuat Kılavuzları',
    items: [
      { icon: 'bi-mortarboard', label: 'Non-İnvasif Yarasa Araştırma Metodolojisi', badge: 'Akademik' },
      { icon: 'bi-shield-check', label: '2872 ve 4915 Sayılı Koruma Mevzuatı Özeti', badge: 'Hukuki' },
      { icon: 'bi-globe', label: 'EUROBATS Standart Survey Protokolleri', badge: 'Uluslararası' },
    ]
  },
  {
    icon: 'bi-images',
    title: 'Fotoğraf & Akustik Veri Tabanı',
    items: [
      { icon: 'bi-camera', label: 'Kırşehir Kentsel ve Mağara Tünek Fotoğraf Arşivi', badge: 'Aktif Arşiv' },
      { icon: 'bi-mic', label: 'Örnek Ultrasonik Ekolokasyon Kayıtları (WAV)', badge: 'Yakında' },
    ]
  },
  {
    icon: 'bi-file-earmark-bar-graph',
    title: 'Yıllık Raporlar & Çıktılar',
    items: [
      { icon: 'bi-file-earmark-pdf', label: 'Kırşehir Yarasa Faunasının Belirlenmesi BAP Raporu', badge: 'Tamamlandı' },
      { icon: 'bi-file-earmark-pdf', label: '2026 Yılı Kentsel İzleme Raporu', badge: 'Hazırlanıyor' },
    ]
  },
]

export default function Kaynaklar() {
  const { lang } = useLangStore()
  const isTr = lang === 'tr'
  const [modalImg, setModalImg] = useState<string | null>(null)

  return (
    <main className="main">
      <PageTitle
        title={isTr ? "Kaynaklar & Yayınlar" : "Resources & Publications"}
        subtitle={isTr ? "Resmi afişler, bilgilendirme broşürleri, araştırma kılavuzları ve veri tabanı" : "Official posters, educational brochures, research manuals, and data repositories"}
        crumb={isTr ? "Kaynaklar" : "Resources"}
        bg="/image/slider-hero-1.jpg"
      />

      {/* ── 1. RESMİ AFİŞ & BROŞÜRLER ── */}
      <section className="section pb-4">
        <div className="container" data-aos="fade-up">
          <div className="section-title text-center mb-5">
            <span className="badge bg-danger-subtle text-danger px-3 py-1 mb-2 fw-semibold">
              <i className="bi bi-file-earmark-arrow-down me-1" />{isTr ? 'BASILI YAYINLAR & MATERYALLER' : 'PRINTED MATERIALS'}
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#1a1a1a', fontWeight: 700 }}>
              {isTr ? 'Resmi Bilgilendirme ve Koruma Materyalleri' : 'Official Awareness & Conservation Materials'}
            </h2>
            <p className="text-muted" style={{ maxWidth: '680px', margin: '0 auto', fontSize: '15px' }}>
              {isTr
                ? 'Derneğimiz tarafından hazırlanan resmi tünek afişleri ve bilgilendirme broşürlerini yüksek çözünürlükte görüntüleyebilir ve indirebilirsiniz.'
                : 'Browse and download high-resolution official roost protection posters and informative brochures produced by our association.'}
            </p>
          </div>

          <div className="row g-4">
            {officialDocs.map(doc => (
              <div key={doc.id} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm hover-card rounded-4 overflow-hidden d-flex flex-column" style={{ background: '#fff', border: '1px solid #f0e6e6' }}>
                  <div style={{ position: 'relative', height: '260px', overflow: 'hidden', background: '#222' }}>
                    <img
                      src={doc.img}
                      alt={doc.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', cursor: 'pointer', transition: 'transform 0.4s ease' }}
                      onClick={() => setModalImg(doc.img)}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      title="Büyütmek için tıklayın"
                    />
                    <span className="badge bg-danger position-absolute top-0 start-0 m-3 px-3 py-1" style={{ fontSize: '11px', borderRadius: '50px' }}>
                      {doc.badge}
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalImg(doc.img)}
                      className="btn btn-sm btn-light position-absolute bottom-0 end-0 m-3 d-flex align-items-center gap-1 shadow-sm"
                      style={{ fontSize: '12px', fontWeight: 600, borderRadius: '20px' }}
                    >
                      <i className="bi bi-arrows-fullscreen" /> {isTr ? 'Büyüt' : 'Zoom'}
                    </button>
                  </div>
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="text-danger small fw-bold text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>{doc.category}</div>
                      <h3 className="h6 fw-bold mb-2" style={{ color: '#1a1a1a' }}>{doc.title}</h3>
                      <p className="text-muted small mb-3" style={{ lineHeight: '1.6' }}>{doc.desc}</p>
                      <div className="d-flex align-items-center gap-2 mb-3 text-muted" style={{ fontSize: '12px' }}>
                        <span><i className="bi bi-filetype-jpg text-danger me-1" />{doc.format}</span>
                        <span>•</span>
                        <span><i className="bi bi-hdd me-1" />{doc.size}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-2 pt-2 border-top">
                      <button
                        type="button"
                        onClick={() => setModalImg(doc.img)}
                        className="btn btn-outline-danger btn-sm flex-grow-1"
                        style={{ borderRadius: '8px', fontWeight: 600 }}
                      >
                        <i className="bi bi-eye me-1" />{isTr ? 'İncele' : 'Preview'}
                      </button>
                      <a
                        href={doc.fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-danger btn-sm flex-grow-1"
                        style={{ borderRadius: '8px', fontWeight: 600 }}
                      >
                        <i className="bi bi-download me-1" />{isTr ? 'İndir' : 'Download'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. REHBERLER & BELGELER ── */}
      <section className="section light-background pt-5">
        <div className="container" data-aos="fade-up">
          <div className="section-title text-center mb-5">
            <span className="badge bg-danger-subtle text-danger px-3 py-1 mb-2 fw-semibold">
              <i className="bi bi-journal-bookmark me-1" />{isTr ? 'KILAVUZLAR & ARŞİV' : 'MANUALS & ARCHIVES'}
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#1a1a1a', fontWeight: 700 }}>
              {isTr ? 'Kılavuzlar ve Bilimsel Dokümantasyon' : 'Guides and Scientific Documentation'}
            </h2>
          </div>

          <div className="row gy-4">
            {cards.map((card, i) => (
              <div key={i} className="col-lg-6">
                <div className="p-4 bg-white rounded-4 shadow-sm h-100 hover-card" style={{ border: '1px solid #f0e6e6' }}>
                  {/* Başlık */}
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="rounded-3 d-flex align-items-center justify-content-center"
                      style={{ width: 44, height: 44, background: '#f5e6e6', flexShrink: 0 }}>
                      <i className={`bi ${card.icon} fs-4`} style={{ color: '#e61b23' }} />
                    </div>
                    <h3 className="h5 mb-0" style={{ color: '#1a1a1a', fontWeight: 700 }}>{card.title}</h3>
                  </div>

                  {/* Öğeler */}
                  <ul className="list-unstyled mb-0">
                    {card.items.map((item, j) => (
                      <li key={j} className="d-flex align-items-center justify-content-between py-2"
                        style={{ borderBottom: j < card.items.length - 1 ? '1px solid #f5e6e6' : 'none' }}>
                        <div className="d-flex align-items-center gap-2">
                          <i className={`bi ${item.icon}`} style={{ color: '#e61b23', fontSize: '16px' }} />
                          <span style={{ fontSize: '14px', color: '#444' }}>{item.label}</span>
                        </div>
                        <span className="badge rounded-pill"
                          style={{ background: '#f5e6e6', color: '#e61b23', fontSize: '11px', fontWeight: 600, padding: '4px 10px' }}>
                          {item.badge}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODAL LIGHTBOX FOR PREVIEW ── */}
      {modalImg && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setModalImg(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(5px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              background: '#000',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            }}
          >
            <button
              type="button"
              onClick={() => setModalImg(null)}
              aria-label="Kapat"
              className="btn btn-dark position-absolute top-0 end-0 m-3"
              style={{ zIndex: 10, borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="bi bi-x-lg" />
            </button>
            <img
              src={modalImg}
              alt="Önizleme"
              style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', display: 'block' }}
            />
            <div className="p-3 bg-dark text-white d-flex justify-content-between align-items-center">
              <span className="small text-light">Yarasa Araştırmaları Derneği Resmi Materyali</span>
              <a href={modalImg} download target="_blank" rel="noopener noreferrer" className="btn btn-danger btn-sm">
                <i className="bi bi-download me-1" /> Tam Boyutu İndir
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
