import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAdminStore, type BlogPost } from '../store/adminStore'

export default function BlogDetay() {
  const { id } = useParams<{ id: string }>()
  const posts = useAdminStore(s => s.posts)
  const post: BlogPost | undefined = posts.find(p => p.id === id)
  const navigate = useNavigate()
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (!post) {
    return (
      <main className="main" style={{ paddingTop: '120px', textAlign: 'center', minHeight: '60vh' }}>
        <div className="container">
          <i className="bi bi-newspaper" style={{ fontSize: '64px', color: '#ddd', display: 'block', marginBottom: '20px' }} />
          <h2 style={{ color: '#1a1a1a', marginBottom: '12px' }}>Yazı bulunamadı</h2>
          <p style={{ color: '#888', marginBottom: '24px' }}>Bu yazı mevcut değil veya kaldırılmış olabilir.</p>
          <Link to="/blog" className="btn-cta">Blog'a Dön</Link>
        </div>
      </main>
    )
  }

  const images = post.images && post.images.length > 0 ? post.images : [post.image]

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightbox(images[index])
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newIndex = (lightboxIndex - 1 + images.length) % images.length
    setLightboxIndex(newIndex)
    setLightbox(images[newIndex])
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newIndex = (lightboxIndex + 1) % images.length
    setLightboxIndex(newIndex)
    setLightbox(images[newIndex])
  }

  return (
    <main className="main">
      {/* Hero fotoğraf */}
      <div style={{ position: 'relative', height: '420px', overflow: 'hidden', marginTop: '80px' }}>
        <img src={post.image} alt={post.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { (e.target as HTMLImageElement).src = '/image/saha1.png' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)' }} />
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '800px', padding: '0 24px', textAlign: 'center' }}>
          <span style={{ background: '#e61b23', color: '#fff', padding: '4px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600, marginBottom: '12px', display: 'inline-block' }}>
            {post.category}
          </span>
          <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 700, lineHeight: '1.3', marginBottom: '12px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            {post.title}
          </h1>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
            <i className="bi bi-person me-1" />{post.author}
            <span style={{ margin: '0 10px' }}>·</span>
            <i className="bi bi-calendar3 me-1" />{post.date}
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">

              {/* Geri butonu */}
              <button onClick={() => navigate('/blog')}
                style={{ background: 'none', border: 'none', color: '#e61b23', cursor: 'pointer', fontSize: '14px', fontWeight: 600, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}>
                <i className="bi bi-arrow-left" /> Blog'a Dön
              </button>

              {/* Yazı içeriği */}
              <div style={{ fontSize: '16px', lineHeight: '1.9', color: '#333' }}>
                {post.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} style={{ marginBottom: '20px' }}>{paragraph}</p>
                ))}
              </div>

              {/* Fotoğraf galerisi */}
              {images.length > 1 && (
                <div style={{ marginTop: '40px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>
                    <i className="bi bi-images me-2" style={{ color: '#e61b23' }} />Fotoğraf Galerisi
                    <span style={{ fontSize: '13px', color: '#aaa', fontWeight: 400, marginLeft: '8px' }}>({images.length} fotoğraf)</span>
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                    {images.map((img, i) => (
                      <div key={i} onClick={() => openLightbox(i)}
                        style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', cursor: 'pointer', aspectRatio: '1', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <img src={img} alt={`Fotoğraf ${i + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                          onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.08)' }}
                          onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }}
                          onError={e => { (e.target as HTMLImageElement).src = '/image/saha1.png' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.25)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0)' }}>
                          <i className="bi bi-zoom-in" style={{ color: '#fff', fontSize: '20px', opacity: 0, transition: 'opacity 0.2s' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Yazar kartı */}
              <div style={{ marginTop: '48px', padding: '24px', background: '#f5e6e6', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 56, height: 56, background: '#e61b23', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="bi bi-person-fill" style={{ color: '#fff', fontSize: '24px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '15px' }}>{post.author}</div>
                  <div style={{ color: '#888', fontSize: '13px' }}>Yarasa Gözlem Topluluğu · {post.date}</div>
                </div>
              </div>

              {/* Diğer yazılar */}
              <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #f5e6e6' }}>
                <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#e61b23', fontWeight: 600, textDecoration: 'none', fontSize: '15px' }}>
                  <i className="bi bi-arrow-left" /> Tüm Yazılara Dön
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Kapat */}
          <button onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: '18px', zIndex: 10 }}>
            ✕
          </button>

          {/* Sayaç */}
          <div style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', color: '#fff', fontSize: '14px', background: 'rgba(0,0,0,0.5)', padding: '4px 14px', borderRadius: '50px' }}>
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Sol ok */}
          {images.length > 1 && (
            <button onClick={prevImage}
              style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-chevron-left" />
            </button>
          )}

          {/* Fotoğraf */}
          <img src={lightbox} alt="" onClick={e => e.stopPropagation()}
            style={{ maxWidth: '88vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
            onError={e => { (e.target as HTMLImageElement).src = '/image/saha1.png' }} />

          {/* Sağ ok */}
          {images.length > 1 && (
            <button onClick={nextImage}
              style={{ position: 'absolute', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-chevron-right" />
            </button>
          )}

          {/* Küçük resimler */}
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '90vw' }}>
            {images.map((img, i) => (
              <img key={i} src={img} alt="" onClick={e => { e.stopPropagation(); openLightbox(i) }}
                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: i === lightboxIndex ? '2px solid #e61b23' : '2px solid rgba(255,255,255,0.2)', transition: 'border-color 0.2s', opacity: i === lightboxIndex ? 1 : 0.6 }}
                onError={e => { (e.target as HTMLImageElement).src = '/image/saha1.png' }} />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
