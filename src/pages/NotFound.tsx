import { Link } from 'react-router-dom'
import { useLangStore } from '../store/langStore'

export default function NotFound() {
  const { lang } = useLangStore()
  const isTr = lang === 'tr'

  return (
    <main className="main" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0e1014 0%, #1a1a1a 50%, #1a0a0a 100%)', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', width: '100%' }}>

        {/* Big 404 */}
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <div style={{
            fontSize: 'clamp(100px, 20vw, 180px)',
            fontWeight: 900,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #e61b23 0%, #ff4d54 60%, #c0392b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-8px',
            userSelect: 'none',
            filter: 'drop-shadow(0 8px 32px rgba(230,27,35,0.4))',
          }}>
            404
          </div>
          {/* Bat icon overlay */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(48px, 8vw, 80px)',
            opacity: 0.15,
            filter: 'blur(2px)',
            userSelect: 'none',
          }}>
            🦇
          </div>
        </div>

        {/* Icon */}
        <div style={{
          width: 72,
          height: 72,
          background: 'rgba(230,27,35,0.15)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          border: '1.5px solid rgba(230,27,35,0.3)',
        }}>
          <i className="bi bi-question-lg" style={{ fontSize: '32px', color: '#e61b23' }} />
        </div>

        <h1 style={{ color: '#fff', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, marginBottom: '12px' }}>
          {isTr ? 'Sayfa Bulunamadı' : 'Page Not Found'}
        </h1>
        <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.7', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
          {isTr
            ? 'Aradığınız sayfa mevcut değil ya da taşınmış olabilir. Yarasalar gibi o da karanlıkta kayboldu olabilir 🦇'
            : 'The page you are looking for does not exist or may have been moved. Like a bat in the dark, it seems to have vanished 🦇'}
        </p>

        {/* Quick links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#e61b23', color: '#fff', textDecoration: 'none',
            padding: '12px 24px', borderRadius: '50px', fontWeight: 600, fontSize: '14px',
            transition: 'all 0.25s ease', boxShadow: '0 4px 16px rgba(230,27,35,0.35)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(230,27,35,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(230,27,35,0.35)' }}
          >
            <i className="bi bi-house-fill" />
            {isTr ? 'Ana Sayfaya Dön' : 'Go to Homepage'}
          </Link>
          <Link to="/yarasalar" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'transparent', color: '#fff', textDecoration: 'none',
            padding: '12px 24px', borderRadius: '50px', fontWeight: 600, fontSize: '14px',
            border: '1.5px solid rgba(255,255,255,0.2)',
            transition: 'all 0.25s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e61b23'; e.currentTarget.style.color = '#e61b23' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff' }}
          >
            <i className="bi bi-info-circle" />
            {isTr ? 'Yarasalar Hakkında' : 'About Bats'}
          </Link>
          <Link to="/iletisim" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'transparent', color: '#fff', textDecoration: 'none',
            padding: '12px 24px', borderRadius: '50px', fontWeight: 600, fontSize: '14px',
            border: '1.5px solid rgba(255,255,255,0.2)',
            transition: 'all 0.25s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e61b23'; e.currentTarget.style.color = '#e61b23' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff' }}
          >
            <i className="bi bi-envelope" />
            {isTr ? 'İletişim' : 'Contact'}
          </Link>
        </div>

        {/* Sitemap shortcut */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '20px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 20px',
          justifyContent: 'center',
        }}>
          <span style={{ color: '#555', fontSize: '12px', width: '100%', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {isTr ? 'Sayfa Haritası' : 'Sitemap'}
          </span>
          {[
            { to: '/hakkimizda', label: isTr ? 'Hakkımızda' : 'About' },
            { to: '/saha-calismalari', label: isTr ? 'Saha Çalışmaları' : 'Field Studies' },
            { to: '/uye-ol', label: isTr ? 'Üye Ol' : 'Join' },
            { to: '/gonullu-ol', label: isTr ? 'Gönüllü Ol' : 'Volunteer' },
            { to: '/veri-gonder', label: isTr ? 'Veri Gönder' : 'Submit Data' },
            { to: '/blog', label: isTr ? 'Blog' : 'Blog' },
            { to: '/kaynaklar', label: isTr ? 'Kaynaklar' : 'Resources' },
          ].map(link => (
            <Link key={link.to} to={link.to} style={{ color: '#666', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#e61b23' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#666' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
