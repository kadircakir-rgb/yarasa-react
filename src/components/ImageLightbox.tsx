import { useEffect, useCallback } from 'react'

export interface LightboxImage {
  src: string
  title: string
  caption?: string
  tag?: string
  date?: string
}

interface ImageLightboxProps {
  image: LightboxImage | null
  onClose: () => void
}

export default function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!image) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [image, handleKeyDown])

  if (!image) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.title}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(10, 12, 16, 0.92)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      {/* Kapat butonu */}
      <button
        onClick={onClose}
        aria-label="Kapat"
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: '#fff',
          borderRadius: '50%',
          width: '46px',
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '22px',
          transition: 'all 0.2s ease',
          zIndex: 10001,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#e61b23'
          e.currentTarget.style.transform = 'scale(1.08)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        <i className="bi bi-x-lg" />
      </button>

      {/* İçerik kapsayıcısı (tıklanınca kapanmaması için stopPropagation) */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '92vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'relative',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(230,27,35,0.25)',
            border: '1px solid rgba(255,255,255,0.15)',
            background: '#000',
            maxHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={image.src}
            alt={image.title}
            style={{
              maxWidth: '100%',
              maxHeight: '78vh',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {/* Başlık ve detay çubuğu */}
        <div
          style={{
            marginTop: '14px',
            textAlign: 'center',
            color: '#fff',
            maxWidth: '800px',
            width: '100%',
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-1">
            {image.tag && (
              <span
                className="badge bg-danger px-2 py-1 text-uppercase"
                style={{ fontSize: '11px', letterSpacing: '0.5px' }}
              >
                {image.tag}
              </span>
            )}
            {image.date && (
              <span className="badge bg-dark border border-secondary px-2 py-1" style={{ fontSize: '11px' }}>
                <i className="bi bi-calendar3 me-1" />
                {image.date}
              </span>
            )}
            <strong style={{ fontSize: '16px', color: '#fff' }}>{image.title}</strong>
          </div>
          {image.caption && (
            <p className="mb-0 text-white-50" style={{ fontSize: '13.5px', lineHeight: '1.5' }}>
              {image.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
