import { useMemo, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import PostCard from '../components/PostCard'
import { useAdminStore } from '../store/adminStore'
import NewsletterForm from '../components/NewsletterForm'

const CATEGORIES = ['Tümü', 'Araştırma', 'Ekoloji', 'Topluluk', 'Teknoloji', 'Saha', 'Duyuru']

export default function Blog() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const rawQuery = searchParams.get('arama') ?? ''
  const arama = rawQuery.trim().toLowerCase()
  const kategoriParam = searchParams.get('kategori') ?? 'Tümü'

  const [activeKat, setActiveKat] = useState(
    CATEGORIES.includes(kategoriParam) ? kategoriParam : 'Tümü'
  )

  const allPosts = useAdminStore(s => s.posts).filter(p => p.published)

  const posts = useMemo(() => {
    let result = allPosts
    // Kategori filtresi
    if (activeKat !== 'Tümü') {
      result = result.filter(p => p.category === activeKat)
    }
    // Metin araması
    if (arama) {
      const q = arama
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q)
      )
    }
    return result
  }, [allPosts, arama, activeKat])

  const hasPosts = posts.length > 0

  const handleKatClick = (kat: string) => {
    setActiveKat(kat)
    // URL'yi güncelle ama arama sıfırlanmasın
    const params = new URLSearchParams()
    if (kat !== 'Tümü') params.set('kategori', kat)
    if (rawQuery.trim()) params.set('arama', rawQuery.trim())
    navigate(`/blog${params.toString() ? '?' + params.toString() : ''}`)
  }

  return (
    <main className="main">
      <PageTitle
        title="Haberler / Blog"
        subtitle="Derneğimizden en son araştırmalar, saha haberleri ve güncellemeler"
        crumb="Blog"
        bg="/image/haberler.webp"
      />

      <section className="section">
        <div className="container" data-aos="fade-up">

          {/* ── Kategori filtre tabları ── */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <i className="bi bi-funnel" style={{ color: '#e61b23', fontSize: '14px' }} />
              {CATEGORIES.map(kat => {
                const count = kat === 'Tümü'
                  ? allPosts.length
                  : allPosts.filter(p => p.category === kat).length
                const isActive = activeKat === kat
                return (
                  <button
                    key={kat}
                    type="button"
                    onClick={() => handleKatClick(kat)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '50px',
                      border: isActive ? '1.5px solid #e61b23' : '1.5px solid #e0e0e0',
                      background: isActive ? '#e61b23' : '#fff',
                      color: isActive ? '#fff' : '#555',
                      fontSize: '13px',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = '#e61b23'
                        e.currentTarget.style.color = '#e61b23'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = '#e0e0e0'
                        e.currentTarget.style.color = '#555'
                      }
                    }}
                  >
                    {kat}
                    {count > 0 && (
                      <span style={{
                        background: isActive ? 'rgba(255,255,255,0.25)' : '#f0f0f0',
                        color: isActive ? '#fff' : '#888',
                        borderRadius: '50px',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '1px 7px',
                        minWidth: '20px',
                        textAlign: 'center',
                      }}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Arama durumu çubuğu */}
          {arama && (
            <div className="d-flex align-items-center justify-content-between mb-4" style={{ fontSize: '15px', color: '#666', background: '#fafafa', padding: '12px 16px', borderRadius: '10px', border: '1px solid #f0e0e0' }}>
              <p className="mb-0 d-flex align-items-center">
                <i className="bi bi-search me-2" style={{ color: '#e61b23' }} />
                &quot;{rawQuery.trim()}&quot; için{' '}
                <strong style={{ color: '#1a1a1a', marginLeft: '4px' }}>{posts.length}</strong>
                &nbsp;sonuç
                {posts.length === 0 && <span className="ms-1" style={{ color: '#e61b23' }}>bulunamadı</span>}
              </p>
              <Link to="/blog" className="btn btn-sm btn-outline-secondary" style={{ borderColor: '#ddd', color: '#666', fontSize: '13px' }}>
                <i className="bi bi-x-lg me-1" /> Aramayı Temizle
              </Link>
            </div>
          )}

          {/* Sonuç yok */}
          {!hasPosts ? (
            <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: 100, height: 100, background: '#f5e6e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                <i className={`bi ${arama ? 'bi-search' : 'bi-newspaper'}`} style={{ fontSize: '44px', color: '#e61b23' }} />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>
                {arama ? 'Sonuç bulunamadı' : activeKat !== 'Tümü' ? `"${activeKat}" kategorisinde yazı yok` : 'Haberler Yakında Burada!'}
              </h2>
              <p style={{ color: '#888', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px' }}>
                {arama
                  ? 'Farklı bir anahtar kelime deneyebilir veya tüm yazıları görmek için aramayı temizleyebilirsiniz.'
                  : activeKat !== 'Tümü'
                  ? 'Bu kategoride henüz yazı yayınlanmamıştır. Tüm yazılar için "Tümü" filtresini seçin.'
                  : 'Saha günlükleri, yeni tür tespitleri, bilimsel yayın duyuruları ve etkinlik haberleri çok yakında bu sayfada yayınlanacak.'}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {(arama || activeKat !== 'Tümü') && (
                  <button
                    type="button"
                    onClick={() => { setActiveKat('Tümü'); navigate('/blog') }}
                    className="btn-cta"
                    style={{ background: 'transparent', border: '2px solid #e61b23', color: '#e61b23' }}
                  >
                    <i className="bi bi-arrow-left me-2" />Tüm Yazılar
                  </button>
                )}
                <div style={{ background: '#1a1a1a', borderRadius: '16px', padding: '28px 32px', width: '100%', maxWidth: '480px', textAlign: 'left' }}>
                  <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '8px' }}>
                    <i className="bi bi-bell me-2" style={{ color: '#e61b23' }} />Haberdar Olun
                  </h4>
                  <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '16px' }}>Yeni yazılar yayınlandığında e-posta ile bildirim alın.</p>
                  <NewsletterForm placeholder="E-posta adresiniz" />
                </div>
              </div>
            </div>
          ) : (
            /* ── Yazılar ızgarası ── */
            <div className="row gy-4">
              {/* Öne çıkan — ilk yazı büyük */}
              {posts[0] && (
                <div className="col-12" data-aos="fade-up">
                  <PostCard post={posts[0]} featured />
                </div>
              )}
              {/* Diğer yazılar */}
              {posts.slice(posts[0] ? 1 : 0).map((p, i) => (
                <div key={p.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={`${(i + 1) * 100}`}>
                  <PostCard post={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
