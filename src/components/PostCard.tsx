import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type BlogPost } from '../store/adminStore'

interface PostCardProps {
  post: BlogPost
  featured?: boolean
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const [lightbox, setLightbox] = useState<string | null>(null)
  const navigate = useNavigate()
  const images = post.images && post.images.length > 0 ? post.images : [post.image]

  return (
    <>
      <div className="hover-card" style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

        {/* Fotoğraf galerisi */}
        {images.length === 1 ? (
          <div style={{ position: 'relative', overflow: 'hidden', height: featured ? '360px' : '220px' }}>
            <img src={images[0]} alt={post.title}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease', cursor: 'pointer' }}
              onClick={() => setLightbox(images[0])}
              onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.04)' }}
              onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }}
              onError={e => { (e.target as HTMLImageElement).src = '/image/saha1.png' }} />
            <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#e61b23', color: '#fff', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 600 }}>
              {post.category}
            </span>
          </div>
        ) : (
          <div>
            {/* Ana fotoğraf */}
            <div style={{ position: 'relative', overflow: 'hidden', height: featured ? '320px' : '200px' }}>
              <img src={images[0]} alt={post.title}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                onClick={() => setLightbox(images[0])}
                onError={e => { (e.target as HTMLImageElement).src = '/image/saha1.png' }} />
              <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#e61b23', color: '#fff', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 600 }}>
                {post.category}
              </span>
              <span style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', borderRadius: '50px', fontSize: '11px' }}>
                <i className="bi bi-images me-1" />{images.length} fotoğraf
              </span>
            </div>
            {/* Küçük fotoğraflar */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(images.length - 1, 4)}, 1fr)`, gap: '2px' }}>
              {images.slice(1, 5).map((img, i) => (
                <div key={i} style={{ position: 'relative', overflow: 'hidden', height: '80px', cursor: 'pointer' }}
                  onClick={() => setLightbox(img)}>
                  <img src={img} alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                    onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.08)' }}
                    onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }}
                    onError={e => { (e.target as HTMLImageElement).src = '/image/saha1.png' }} />
                  {/* +N overlay */}
                  {i === 3 && images.length > 5 && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '18px' }}>
                      +{images.length - 5}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* İçerik */}
        <div style={{ padding: featured ? '28px 32px' : '20px 24px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '10px' }}>
            <i className="bi bi-calendar3 me-1" />{post.date}
            <span style={{ margin: '0 8px', color: '#ddd' }}>·</span>
            <i className="bi bi-person me-1" />{post.author}
          </div>
          <h3 style={{ fontSize: featured ? '22px' : '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px', lineHeight: '1.4' }}>
            {post.title}
          </h3>
          <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>
            {post.content.substring(0, featured ? 280 : 120)}...
          </p>

          {/* Tüm fotoğraflar (featured için) */}
          {featured && images.length > 5 && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '8px' }}>
                <i className="bi bi-images me-1" />Tüm fotoğraflar ({images.length})
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {images.slice(5).map((img, i) => (
                  <img key={i} src={img} alt="" onClick={() => setLightbox(img)}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => { (e.target as HTMLImageElement).style.borderColor = '#e61b23' }}
                    onMouseLeave={e => { (e.target as HTMLImageElement).style.borderColor = 'transparent' }}
                    onError={e => { (e.target as HTMLImageElement).src = '/image/saha1.png' }} />
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #f5e6e6' }}>
            <span style={{ fontSize: '12px', color: '#aaa' }}>
              <i className="bi bi-images me-1" />{images.length} fotoğraf
            </span>
            <span onClick={() => navigate(`/blog/${post.id}`)}
              style={{ color: '#e61b23', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Devamını Oku <i className="bi bi-arrow-right" />
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <button onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>
            ✕
          </button>
          <img src={lightbox} alt="" style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px' }}
            onClick={e => e.stopPropagation()} />
          {/* Küçük resimler */}
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '90vw' }}>
            {images.map((img, i) => (
              <img key={i} src={img} alt="" onClick={e => { e.stopPropagation(); setLightbox(img) }}
                style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: lightbox === img ? '2px solid #e61b23' : '2px solid rgba(255,255,255,0.3)', transition: 'border-color 0.2s' }}
                onError={e => { (e.target as HTMLImageElement).src = '/image/saha1.png' }} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
