import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../store/adminStore'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid #e0c0c0', borderRadius: '8px',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff',
}

export default function GozlemForm() {
  const addGozlem = useAdminStore(s => s.addGozlem)
  const [form, setForm] = useState({
    tarih: '', saat: '', konum: '', gozlem_turu: '', aciklama: '', email: '',
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [audio, setAudio] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    await new Promise(r => setTimeout(r, 600))

    let photoUrl = ''
    if (photo) {
      photoUrl = URL.createObjectURL(photo)
    }

    addGozlem({
      tarih: form.tarih || new Date().toISOString().split('T')[0],
      saat: form.saat || '20:00',
      konum: form.konum,
      gozlem_turu: form.gozlem_turu || 'sighting',
      aciklama: form.aciklama,
      email: form.email,
      fotograf_yolu: photoUrl || '/image/cacabey.png',
    })

    setStatus('success')
    setMessage('Gözleminiz başarıyla kaydedildi ve araştırma ekibimizin paneline iletildi!')
    setForm({ tarih: '', saat: '', konum: '', gozlem_turu: '', aciklama: '', email: '' })
    setPhoto(null)
    setAudio(null)
  }

  if (status === 'success') {
    return (
      <div className="text-center p-5 rounded-3" style={{ background: '#fff', maxWidth: 500, margin: '0 auto', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ width: 72, height: 72, background: '#d4edda', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <i className="bi bi-check-lg" style={{ fontSize: '32px', color: '#2d6a2d' }} />
        </div>
        <h4 style={{ color: '#1a1a1a', fontWeight: 700, marginBottom: '12px' }}>Gözleminiz Kaydedildi!</h4>
        <p style={{ color: '#666', marginBottom: '24px' }}>Katkınız için teşekkürler. Ekibimiz inceleyecektir.</p>
        <button onClick={() => setStatus('idle')} style={{ background: '#e61b23', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: 600 }}>
          Yeni Bildirim
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 p-lg-5 rounded-3" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <h2 className="h4 mb-2" style={{ color: '#1a1a1a', fontWeight: 700 }}>
        <i className="bi bi-send me-2" style={{ color: '#e61b23' }} />Gözlem Bildirim Formu
      </h2>
      <p className="text-muted mb-4" style={{ fontSize: '14px' }}>Gözleminizi tarih, saat ve konumla paylaşın.</p>

      {status === 'error' && (
        <div style={{ background: '#fff5f5', border: '1px solid #fcc', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#e61b23', fontSize: '14px' }}>
          <i className="bi bi-exclamation-circle me-2" />{message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label small fw-semibold" style={{ color: '#1a1a1a' }}>
              <i className="bi bi-calendar3 me-1" style={{ color: '#e61b23' }} />Tarih *
            </label>
            <input type="date" required value={form.tarih}
              onChange={e => setForm({ ...form, tarih: e.target.value })} style={inputStyle} />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold" style={{ color: '#1a1a1a' }}>
              <i className="bi bi-clock me-1" style={{ color: '#e61b23' }} />Saat *
            </label>
            <input type="time" required value={form.saat}
              onChange={e => setForm({ ...form, saat: e.target.value })} style={inputStyle} />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-semibold" style={{ color: '#1a1a1a' }}>
            <i className="bi bi-geo-alt me-1" style={{ color: '#e61b23' }} />Konum *
          </label>
          <input type="text" required placeholder="Adres / mahalle + mümkünse koordinat"
            value={form.konum} onChange={e => setForm({ ...form, konum: e.target.value })} style={inputStyle} />
        </div>

        <div className="mb-3">
          <label className="form-label small fw-semibold" style={{ color: '#1a1a1a' }}>
            <i className="bi bi-list-ul me-1" style={{ color: '#e61b23' }} />Gözlem Türü *
          </label>
          <select required value={form.gozlem_turu}
            onChange={e => setForm({ ...form, gozlem_turu: e.target.value })} style={inputStyle}>
            <option value="">Seçin...</option>
            <option value="sighting">Görsel gözlem</option>
            <option value="acoustic">Ses kaydı</option>
            <option value="roost">Potansiyel tünek alanı</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-semibold" style={{ color: '#1a1a1a' }}>
            <i className="bi bi-chat-text me-1" style={{ color: '#e61b23' }} />Açıklama *
          </label>
          <textarea required rows={4} placeholder="Kaç birey, davranış, ortam, vb."
            value={form.aciklama} onChange={e => setForm({ ...form, aciklama: e.target.value })}
            style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label small fw-semibold" style={{ color: '#1a1a1a' }}>
              <i className="bi bi-image me-1" style={{ color: '#e61b23' }} />Fotoğraf <span className="text-muted fw-normal">(opsiyonel)</span>
            </label>
            <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} style={inputStyle} />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold" style={{ color: '#1a1a1a' }}>
              <i className="bi bi-mic me-1" style={{ color: '#e61b23' }} />Ses Kaydı <span className="text-muted fw-normal">(opsiyonel)</span>
            </label>
            <input type="file" accept="audio/*" onChange={e => setAudio(e.target.files?.[0] || null)} style={inputStyle} />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label small fw-semibold" style={{ color: '#1a1a1a' }}>
            <i className="bi bi-envelope me-1" style={{ color: '#e61b23' }} />E-posta * <span className="text-muted fw-normal">(geri dönüş için)</span>
          </label>
          <input type="email" required placeholder="ornek@email.com"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
        </div>

        <button type="submit" disabled={status === 'loading'}
          style={{ width: '100%', padding: '14px', background: status === 'loading' ? '#ccc' : '#e61b23', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
          {status === 'loading'
            ? <><i className="bi bi-arrow-repeat me-2" />Gönderiliyor...</>
            : <><i className="bi bi-send me-2" />Bildirimi Gönder</>}
        </button>
      </form>

      <div className="mt-4 pt-3" style={{ borderTop: '1px solid #f5e6e6', fontSize: '13px', color: '#888' }}>
        Acil durum için <Link to="/iletisim" style={{ color: '#e61b23' }}>İletişim</Link> sayfasından bize ulaşabilirsiniz.
      </div>
    </div>
  )
}
