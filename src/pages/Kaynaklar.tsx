import { useState } from 'react'
import PageTitle from '../components/PageTitle'
import { useLangStore } from '../store/langStore'
import { useAdminStore, type YayinItem } from '../store/adminStore'

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
    title: 'Tünek Koruma Posteri',
    category: 'Resmi Dernek Posteri',
    desc: 'Yarasaların ekolojik önemi, tünek alanlarının korunması (2872 ve 4915 sayılı kanunlar) ve yuva tahribatının önlenmesi amacıyla derneğimizce hazırlanan resmi basılı afiş.',
    img: '/image/tunek-poster-preview.webp',
    fileUrl: '/image/tunek-poster.jpg',
    format: 'Yüksek Çözünürlüklü Görsel',
    size: '15.9 MB',
    badge: 'Resmi Afiş'
  },
  {
    id: 'brosur-on',
    title: 'Yarasa Bilgilendirme Broşürü',
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
    title: 'Yarasa Koruma ve Tür Rehberi Broşürü',
    category: 'Tür Bilgisi ve Koruma Protokolü',
    desc: 'Bölgesel yarasa türleri, tünek tespiti, yuva kontrolü kuralları ve evinize yarasa girdiğinde izlenmesi gereken adımlar.',
    img: '/image/brosur-2-preview.webp',
    fileUrl: '/image/brosur-2.jpg',
    format: 'Yüksek Çözünürlüklü Görsel',
    size: '16.8 MB',
    badge: 'Broşür İçerik'
  },
  {
    id: 'turkiye-yarasalari-bilgilendirme',
    title: 'Türkiye Yarasaları Bilgilendirme Dokümanı',
    category: 'Bilimsel Bilgilendirme Dosyası',
    desc: 'Türkiye Chiroptera faunası, 40 yarasa türünün taksonomik detayları, tünek ekolojisi ve yasal koruma protokollerini içeren resmi bilgilendirme metni.',
    img: '/image/cacabey.webp',
    fileUrl: '/docs/Turkiye_Yarasalari_Bilgilendirme.docx',
    format: 'Word Dokümanı (DOCX)',
    size: '1.2 MB',
    badge: 'Bilgilendirme Dosyası'
  },
]

export default function Kaynaklar() {
  const { lang } = useLangStore()
  const isTr = lang === 'tr'
  const [modalImg, setModalImg] = useState<string | null>(null)
  const yayinlar = useAdminStore(state => state.yayinlar) || []

  return (
    <main className="main">
      <PageTitle
        title={isTr ? "Kaynaklar & Bilimsel Çıktılar" : "Resources & Scientific Publications"}
        subtitle={isTr ? "Resmi afişler, bilgilendirme dokümanları ve bilimsel araştırma yayınları" : "Official posters, documents, and research publications"}
        crumb={isTr ? "Kaynaklar" : "Resources"}
        bg="/image/saha-calismalari/20260602_201650.webp"
      />

      {/* ── 1. RESMİ AFİŞ & BROŞÜRLER ── */}
      <section className="section pb-5">
        <div className="container" data-aos="fade-up">
          <div className="section-title text-center mb-5">
            <span className="badge bg-danger-subtle text-danger px-3 py-1 mb-2 fw-semibold">
              <i className="bi bi-file-earmark-arrow-down me-1" />{isTr ? 'BASILI VE RESMİ MATERYALLER' : 'PRINTED & OFFICIAL MATERIALS'}
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#1a1a1a', fontWeight: 700 }}>
              {isTr ? 'Resmi Bilgilendirme ve Koruma Materyalleri' : 'Official Awareness & Conservation Materials'}
            </h2>
            <p className="text-muted" style={{ maxWidth: '680px', margin: '0 auto', fontSize: '15px' }}>
              {isTr
                ? 'Derneğimiz tarafından hazırlanan resmi tünek afişleri, bilgilendirme broşürleri ve bilimsel kılavuz dosyalarını doğrudan inceleyebilir ve indirebilirsiniz.'
                : 'Browse and download official roost protection posters, brochures, and scientific documentation.'}
            </p>
          </div>

          <div className="row g-4">
            {officialDocs.map(doc => (
              <div key={doc.id} className="col-lg-6 col-md-6">
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
                        <span><i className="bi bi-file-earmark-text text-danger me-1" />{doc.format}</span>
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

      {/* ── 2. BİLİMSEL ÇIKTILAR VE YAYINLAR (YATAY GENİŞ FORMAT) ── */}
      <section className="section light-background pt-5 pb-5">
        <div className="container" data-aos="fade-up">
          <div className="section-title text-center mb-5">
            <span className="badge bg-danger-subtle text-danger px-3 py-1 mb-2 fw-semibold">
              <i className="bi bi-journal-text me-1" />{isTr ? 'BİLİMSEL LİTERATÜR' : 'SCIENTIFIC LITERATURE'}
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#1a1a1a', fontWeight: 700 }}>
              {isTr ? 'Bilimsel Çıktılar ve Yayınlar' : 'Scientific Outputs & Publications'}
            </h2>
            <p className="text-muted" style={{ maxWidth: '680px', margin: '0 auto', fontSize: '15px' }}>
              {isTr
                ? 'Kırşehir yarasa faunası, akustik izleme ve tünek araştırmalarına ilişkin SCI makaleler, teknik saha raporları ve bilimsel bildiriler.'
                : 'Peer-reviewed articles, technical field reports, and conference proceedings on bat fauna and acoustics.'}
            </p>
          </div>

          <div className="d-flex flex-column gap-3">
            {yayinlar.map((pub: YayinItem, idx: number) => (
              <div
                key={pub.id || idx}
                className="p-4 bg-white rounded-4 shadow-sm hover-card border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
                style={{ borderLeft: '5px solid #e61b23' }}
              >
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                    <span className="badge bg-danger" style={{ fontSize: '11px', fontWeight: 600 }}>
                      {pub.type}
                    </span>
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle" style={{ fontSize: '11px', fontWeight: 600 }}>
                      {pub.badge}
                    </span>
                    {pub.date && (
                      <span className="text-muted small">
                        <i className="bi bi-calendar3 me-1" />{pub.date}
                      </span>
                    )}
                  </div>
                  <h3 className="h5 fw-bold mb-2 text-dark" style={{ lineHeight: '1.4' }}>
                    {pub.title}
                  </h3>
                  {pub.authors && (
                    <div className="text-muted small mb-1">
                      <i className="bi bi-person me-1 text-danger" />
                      <strong>Yazarlar:</strong> {pub.authors}
                    </div>
                  )}
                  {pub.journal && (
                    <div className="text-muted small">
                      <i className="bi bi-journal-bookmark me-1 text-danger" />
                      <em>{pub.journal}</em>
                    </div>
                  )}
                </div>

                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                  {pub.fileUrl ? (
                    <a
                      href={pub.fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-3 py-2"
                      style={{ borderRadius: '8px', fontWeight: 600 }}
                    >
                      <i className="bi bi-download" /> {isTr ? 'Dokümanı İndir' : 'Download Document'}
                    </a>
                  ) : pub.doi ? (
                    <a
                      href={pub.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-3 py-2"
                      style={{ borderRadius: '8px', fontWeight: 600 }}
                    >
                      <i className="bi bi-box-arrow-up-right" /> DOI / İncele
                    </a>
                  ) : (
                    <span className="badge bg-light text-muted border px-3 py-2" style={{ fontSize: '12px' }}>
                      <i className="bi bi-check-circle me-1 text-success" /> Kurumsal Arşivde
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Turkiye Yarasalari Bilgilendirme Word Dosyası Özel İndirme Kartı */}
          <div className="mt-4 p-4 rounded-4 shadow-sm d-flex flex-column flex-md-row align-items-center justify-content-between gap-3" style={{ background: '#1a1a1a', color: '#fff' }}>
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: 50, height: 50, background: '#e61b23', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="bi bi-file-earmark-word fs-3 text-white" />
              </div>
              <div>
                <h5 className="mb-1 text-white fw-bold">Turkiye_Yarasalari_Bilgilendirme.docx</h5>
                <p className="mb-0 text-white-50 small">
                  Türkiye genelinde 40 yarasa türü, koruma statüleri, tünek ekolojisi ve mevzuat bilgilerini içeren resmi Word dokümanı.
                </p>
              </div>
            </div>
            <a
              href="/docs/Turkiye_Yarasalari_Bilgilendirme.docx"
              download
              className="btn btn-danger px-4 py-2 flex-shrink-0 d-flex align-items-center gap-2 fw-semibold"
              style={{ borderRadius: '8px' }}
            >
              <i className="bi bi-download" /> Word Dosyasını İndir
            </a>
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
