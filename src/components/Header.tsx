import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLangStore } from '../store/langStore'

function isNavActive(pathname: string, to: string, end?: boolean) {
  if (end) return pathname === to
  return pathname === to || pathname.startsWith(`${to}/`)
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  const { lang, toggleLang, t } = useLangStore()

  const navLinks = [
    { to: '/', label: t('navHome'), end: true },
    { to: '/hakkimizda', label: t('navAbout') },
    { to: '/yarasalar', label: t('navBats') },
    { to: '/saha-calismalari', label: t('navFieldWork') },
    { to: '/uye-ol', label: t('navJoin'), highlight: true },
    { to: '/gonullu-ol', label: t('navVolunteer') },
    { to: '/veri-gonder', label: t('navSubmitData') },
    { to: '/blog', label: t('navNews') },
    { to: '/kaynaklar', label: t('navResources') },
    { to: '/iletisim', label: t('navContact') },
  ]

  /* Scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ⌘K / Ctrl+K → odağı arama çubuğuna ver */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  /* Enter → hemen git (debounce bekleme) */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const q = searchQuery.trim()
      if (q) navigate(`/blog?arama=${encodeURIComponent(q)}`)
      else navigate('/blog')
    }
  }, [searchQuery, navigate])

  /* Body class listener for mobile nav */
  useEffect(() => {
    document.body.classList.toggle('mobile-nav-active', mobileOpen)
    return () => {
      document.body.classList.remove('mobile-nav-active')
    }
  }, [mobileOpen])

  /* Sayfa değiştiğinde mobil menüyü otomatik kapat */
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleClear = useCallback(() => {
    setSearchQuery('')
    searchInputRef.current?.focus()
  }, [])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="mobile-nav-backdrop d-xl-none"
          aria-label="Menüyü kapat"
          onClick={closeMobile}
        />
      )}
      <header
        id="header"
        className={`header d-flex align-items-center${scrolled ? ' scrolled' : ''}`}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 997,
          background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.3s ease',
          borderTop: '3px solid #e61b23',
          borderBottom: scrolled ? '1px solid #f0e0e0' : '1px solid transparent',
        }}
      >
        <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
          <Link to="/" className="logo d-flex align-items-center" onClick={closeMobile} style={{ textDecoration: 'none' }}>
            <img
              src="/image/logo.png"
              alt="Yarasa Araştırmaları Derneği"
              style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          <nav id="navmenu" className={`navmenu${mobileOpen ? ' mobile-nav-active' : ''}`} aria-label="Ana menü">
            <ul>
              <li className="d-xl-none text-end p-2 border-bottom mb-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={closeMobile}
                  style={{ borderRadius: '50px', padding: '4px 12px', fontSize: '13px' }}
                >
                  <i className="bi bi-x-lg me-1" /> Kapat
                </button>
              </li>
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`${isNavActive(location.pathname, link.to, link.end) ? 'active' : ''} ${link.highlight ? 'nav-highlight-link' : ''}`}
                    style={{
                      textDecoration: 'none',
                      fontWeight: link.highlight ? 700 : undefined,
                      color: link.highlight && !isNavActive(location.pathname, link.to, link.end) ? '#e61b23' : undefined,
                    }}
                    onClick={closeMobile}
                  >
                    {link.label}
                    {link.highlight && (
                      <span className="badge bg-danger ms-1 text-white d-none d-xxl-inline-block" style={{ fontSize: '9px', verticalAlign: 'middle', padding: '2px 5px' }}>
                        YENİ
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions d-flex align-items-center gap-2">
            {/* Dil Değiştirici Buton */}
            <button
              type="button"
              onClick={toggleLang}
              className="btn btn-sm d-flex align-items-center gap-1"
              title={lang === 'tr' ? 'Switch to English' : 'Türkçe’ye geç'}
              style={{
                borderRadius: '50px',
                border: '1.5px solid #e0e0e0',
                background: '#fafafa',
                color: '#333',
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 8px',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#e61b23'
                e.currentTarget.style.color = '#e61b23'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0'
                e.currentTarget.style.color = '#333'
              }}
            >
              <i className="bi bi-globe2" style={{ color: '#e61b23', fontSize: '12px' }} />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Arama Kutusu */}
            <div className="header-search d-none d-sm-block">
              <input
                key={location.pathname}
                ref={searchInputRef}
                type="search"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Blogda ara"
                autoComplete="off"
                role="searchbox"
                style={{ width: '110px' }}
              />
              {searchQuery.trim().length > 0 && (
                <button
                  type="button"
                  aria-label="Aramayı temizle"
                  onClick={handleClear}
                  style={{
                    position: 'absolute', right: '28px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#999',
                    padding: '2px', display: 'flex', alignItems: 'center',
                    fontSize: '12px', lineHeight: 1,
                  }}
                >
                  <i className="bi bi-x-circle-fill" />
                </button>
              )}
              <button
                type="button"
                aria-label="Blog sayfasına git"
                onClick={() => {
                  const q = searchQuery.trim()
                  if (q) navigate(`/blog?arama=${encodeURIComponent(q)}`)
                  else navigate('/blog')
                }}
                style={{
                  position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'inherit',
                  padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <i className="bi bi-search" />
              </button>
            </div>

            {/* Hamburger Menü Butonu (Mobilde her zaman görünür) */}
            <button
              type="button"
              className={`mobile-nav-toggle d-xl-none bi ${mobileOpen ? 'bi-x' : 'bi-list'}`}
              aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                fontSize: '26px',
                border: 'none',
                background: 'none',
                color: mobileOpen ? '#e61b23' : '#1a1a1a',
                padding: '4px',
                cursor: 'pointer',
                lineHeight: 1,
                marginLeft: '4px',
              }}
            />
          </div>
        </div>
      </header>
    </>
  )
}
