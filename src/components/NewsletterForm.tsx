import { useState } from 'react'
import { apiUrl } from '../lib/api'

export default function NewsletterForm({ placeholder = 'E-posta adresinizi girin' }: { placeholder?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(apiUrl('/api/abone'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.message)
      }
    } catch {
      setStatus('error')
      setMessage('Sunucuya bağlanılamadı.')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#d4edda', borderRadius: '8px', color: '#2d6a2d', fontSize: '14px' }}>
        <i className="bi bi-check-circle-fill" />
        {message}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group d-flex align-items-stretch gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-control h-100"
          placeholder={placeholder}
          required
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn btn-secondary px-4"
          style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          {status === 'loading' ? <i className="bi bi-arrow-repeat" /> : 'Abone Ol'}
        </button>
      </div>
      {status === 'error' && (
        <div style={{ color: '#e61b23', fontSize: '13px', marginTop: '6px' }}>
          <i className="bi bi-exclamation-circle me-1" />{message}
        </div>
      )}
    </form>
  )
}
