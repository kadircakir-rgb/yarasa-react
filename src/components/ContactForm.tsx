import { useState } from 'react'
import { useAdminStore } from '../store/adminStore'

const inputStyle: React.CSSProperties = {
  borderColor: '#e0c0c0',
  borderRadius: '8px',
  padding: '12px 16px',
  fontSize: '14px',
}

export default function ContactForm() {
  const addMesaj = useAdminStore(s => s.addMesaj)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    await new Promise(r => setTimeout(r, 400))
    addMesaj({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    })
    setStatus('success')
    setFeedback('Mesajınız başarıyla iletildi! Yönetim ekibimiz en kısa sürede dönüş yapacaktır.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  if (status === 'success') {
    return (
      <div className="p-4 rounded-3 text-center" style={{ background: '#d4edda', color: '#2d6a2d' }}>
        <i className="bi bi-check-circle-fill fs-3 d-block mb-2" />
        <p className="mb-0 fw-semibold">{feedback}</p>
        <button type="button" className="btn btn-link mt-2 p-0" style={{ color: '#2d6a2d' }} onClick={() => setStatus('idle')}>
          Yeni mesaj gönder
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === 'error' && (
        <div className="alert alert-danger py-2 small mb-3" role="alert">
          <i className="bi bi-exclamation-circle me-1" />{feedback}
        </div>
      )}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label small fw-semibold" style={{ color: '#1a1a1a' }}>
            <i className="bi bi-person me-1" style={{ color: '#e61b23' }} />Adınız Soyadınız
          </label>
          <input type="text" name="name" className="form-control" placeholder="Ad Soyad" required style={inputStyle}
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} disabled={status === 'loading'} />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold" style={{ color: '#1a1a1a' }}>
            <i className="bi bi-envelope me-1" style={{ color: '#e61b23' }} />E-posta Adresiniz
          </label>
          <input type="email" name="email" className="form-control" placeholder="ornek@email.com" required style={inputStyle}
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} disabled={status === 'loading'} />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold" style={{ color: '#1a1a1a' }}>
          <i className="bi bi-tag me-1" style={{ color: '#e61b23' }} />Konu
        </label>
        <input type="text" name="subject" className="form-control" placeholder="Mesajınızın konusu" required style={inputStyle}
          value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} disabled={status === 'loading'} />
      </div>
      <div className="mb-4">
        <label className="form-label small fw-semibold" style={{ color: '#1a1a1a' }}>
          <i className="bi bi-chat-text me-1" style={{ color: '#e61b23' }} />Mesajınız
        </label>
        <textarea name="message" className="form-control" rows={5} placeholder="Mesajınızı buraya yazın..." required
          style={{ ...inputStyle, resize: 'vertical' }}
          value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} disabled={status === 'loading'} />
      </div>
      <button type="submit" disabled={status === 'loading'} className="w-100 py-3 fw-bold"
        style={{ background: status === 'loading' ? '#ccc' : '#e61b23', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px' }}>
        {status === 'loading'
          ? <><i className="bi bi-arrow-repeat me-2" />Gönderiliyor...</>
          : <><i className="bi bi-send me-2" />Mesaj Gönder</>}
      </button>
    </form>
  )
}
