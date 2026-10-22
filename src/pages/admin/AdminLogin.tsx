import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAdminStore(s => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const ok = login(email, password, remember)
    setLoading(false)
    if (ok) {
      navigate('/admin/panel')
    } else {
      setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0e1014 0%, #1a1a1a 50%, #1a0a0a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background blobs */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(230,27,35,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(230,27,35,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', left: '10%', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '48px 40px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: 84, height: 84, borderRadius: '50%',
            background: 'linear-gradient(135deg, #fff 0%, #fdf0f0 100%)',
            border: '2px solid #f5e6e6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 20px rgba(230,27,35,0.15)',
          }}>
            <img src="/image/logo.png" alt="Logo" style={{ height: '60px', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a', marginBottom: '4px' }}>
            Yönetici Girişi
          </h1>
          <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
            Yarasa Araştırmaları Derneği — Yönetim Paneli
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* E-posta */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#555', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              E-posta veya Kullanıcı Adı
            </label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-person" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#bbb', fontSize: '15px', pointerEvents: 'none' }} />
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@yarasaarastirma.com"
                required
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: '1.5px solid #e8e8e8',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                  background: '#fafafa',
                  color: '#1a1a1a',
                }}
                onFocus={e => { e.target.style.borderColor = '#e61b23'; e.target.style.boxShadow = '0 0 0 3px rgba(230,27,35,0.1)'; e.target.style.background = '#fff' }}
                onBlur={e => { e.target.style.borderColor = '#e8e8e8'; e.target.style.boxShadow = 'none'; e.target.style.background = '#fafafa' }}
              />
            </div>
          </div>

          {/* Şifre */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#555', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Şifre
            </label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-lock" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#bbb', fontSize: '15px', pointerEvents: 'none' }} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 40px',
                  border: '1.5px solid #e8e8e8',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                  background: '#fafafa',
                  color: '#1a1a1a',
                }}
                onFocus={e => { e.target.style.borderColor = '#e61b23'; e.target.style.boxShadow = '0 0 0 3px rgba(230,27,35,0.1)'; e.target.style.background = '#fff' }}
                onBlur={e => { e.target.style.borderColor = '#e8e8e8'; e.target.style.boxShadow = 'none'; e.target.style.background = '#fafafa' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}
              >
                <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`} style={{ fontSize: '16px' }} />
              </button>
            </div>
          </div>

          {/* Beni Hatırla */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#e61b23', cursor: 'pointer' }}
            />
            <label htmlFor="remember" style={{ fontSize: '13px', color: '#666', cursor: 'pointer' }}>
              Bu cihazda oturumu açık tut
            </label>
          </div>

          {/* Hata */}
          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #fcc', borderRadius: '10px', padding: '12px 14px', marginBottom: '18px', fontSize: '13px', color: '#c0392b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="bi bi-exclamation-circle-fill" />
              {error}
            </div>
          )}

          {/* Giriş Butonu */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#e8e8e8' : 'linear-gradient(135deg, #e61b23 0%, #c0392b 100%)',
              color: loading ? '#aaa' : '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(230,27,35,0.3)',
            }}
          >
            {loading ? (
              <><i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }} /> Doğrulanıyor...</>
            ) : (
              <><i className="bi bi-shield-lock" /> Güvenli Giriş Yap</>
            )}
          </button>
        </form>

        {/* Security note */}
        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: '#bbb' }}>
          <i className="bi bi-lock-fill" style={{ color: '#ddd', fontSize: '11px' }} />
          Bu alan yalnızca yetkili yöneticiler için ayrılmıştır.
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
