import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../store/adminStore'

const inputStyle: React.CSSProperties = {
  borderColor: '#e2e8f0',
  borderRadius: '10px',
  width: '100%',
  padding: '12px 16px',
  border: '1.5px solid #e2e8f0',
  fontSize: '14.5px',
  outline: 'none',
  boxSizing: 'border-box',
  background: '#ffffff',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

export default function GonulluForm() {
  const addGonullu = useAdminStore(s => s.addGonullu)
  const [form, setForm] = useState({
    ad_soyad: '',
    email: '',
    telefon: '',
    kurum: '',
    katilim_amaci: [] as string[],
    uygun_gunler: [] as string[],
    onceki_deneyim: false,
    deneyim_notu: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.ad_soyad.trim() || !form.email.trim()) {
      setStatus('error')
      setMessage('Lütfen zorunlu alanları (*) doldurunuz.')
      return
    }

    setStatus('loading')
    await new Promise(r => setTimeout(r, 600))
    addGonullu({
      ad_soyad: form.ad_soyad.trim(),
      email: form.email.trim(),
      telefon: form.telefon.trim(),
      kurum: form.kurum.trim(),
      katilim_amaci: form.katilim_amaci,
      uygun_gunler: form.uygun_gunler,
      onceki_deneyim: form.onceki_deneyim,
      deneyim_notu: form.deneyim_notu.trim(),
    })
    setStatus('success')
    setMessage('Gönüllü başvurunuz başarıyla alındı ve yönetim sistemimize kaydedildi!')
    setForm({ ad_soyad: '', email: '', telefon: '', kurum: '', katilim_amaci: [], uygun_gunler: [], onceki_deneyim: false, deneyim_notu: '' })
  }

  if (status === 'success') {
    return (
      <div className="container py-4">
        <div className="text-center p-5 rounded-4 shadow-sm" style={{ background: '#fff', maxWidth: 540, margin: '0 auto', border: '1px solid #eef2f6' }}>
          <div style={{ width: 72, height: 72, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <i className="bi bi-check-lg" style={{ fontSize: '34px', color: '#16a34a' }} />
          </div>
          <h4 style={{ color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>Başvurunuz Başarıyla Alındı!</h4>
          <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
            Yarasa Araştırmaları ekibimize gösterdiğiniz ilgi için teşekkür ederiz. Başvurunuz incelendikten sonra tarafınıza e-posta veya telefon ile geri dönüş yapılacaktır.
          </p>
          <button
            onClick={() => setStatus('idle')}
            style={{
              background: '#e61b23',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 28px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14.5px',
              boxShadow: '0 4px 12px rgba(230,27,35,0.25)',
            }}
          >
            <i className="bi bi-plus-circle me-2" />Yeni Bir Başvuru Yap
          </button>
        </div>
      </div>
    )
  }

  const amaciSecenekler = [
    'Bilimsel araştırmaya katkı',
    'Akademik staj / ders kapsamında',
    'Kişisel ilgi / doğa merakı',
    'Fotoğraf / belgesel dokümantasyonu',
  ]

  const gunler = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']

  return (
    <div className="container" data-aos="fade-up">
      <div className="row gy-4 align-items-stretch">
        {/* Sol Kolon - Başvuru Formu */}
        <div className="col-lg-7">
          <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light-subtle h-100">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-danger-subtle text-danger px-3 py-1 rounded-pill fw-semibold" style={{ fontSize: '12.5px' }}>
                <i className="bi bi-pencil-square me-1" /> Başvuru Formu
              </span>
            </div>
            <h2 className="content-title mb-2" style={{ color: '#0f172a', fontSize: '26px', fontWeight: 800 }}>
              Gönüllü Araştırmacı Olun
            </h2>
            <p style={{ color: '#64748b', fontSize: '14.5px', marginBottom: '28px' }}>
              Aşağıdaki formu eksiksiz doldurarak saha ve araştırma çalışmalarımıza dahil olabilirsiniz.
            </p>

            {status === 'error' && (
              <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#b91c1c', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-exclamation-triangle-fill" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: '#334155', fontSize: '13.5px' }}>
                    Ad Soyad <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Dr. Ahmet Yılmaz"
                    value={form.ad_soyad}
                    onChange={e => setForm({ ...form, ad_soyad: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: '#334155', fontSize: '13.5px' }}>
                    E-posta Adresi <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="adiniz@ornek.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: '#334155', fontSize: '13.5px' }}>
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    placeholder="05XX XXX XX XX"
                    value={form.telefon}
                    onChange={e => setForm({ ...form, telefon: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: '#334155', fontSize: '13.5px' }}>
                    Kurum / Bölüm (Varsa)
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Ahi Evran Ünv. Biyoloji"
                    value={form.kurum}
                    onChange={e => setForm({ ...form, kurum: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Katılım Amacı */}
              <div className="mb-4">
                <label className="form-label fw-semibold d-block" style={{ color: '#334155', fontSize: '13.5px' }}>
                  Katılım Amacınız <span className="text-muted fw-normal">(Birden fazla seçilebilir)</span>
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {amaciSecenekler.map(p => {
                    const isChecked = form.katilim_amaci.includes(p)
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setForm({ ...form, katilim_amaci: toggleArray(form.katilim_amaci, p) })}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          border: isChecked ? '1.5px solid #e61b23' : '1.5px solid #e2e8f0',
                          background: isChecked ? '#fef2f2' : '#ffffff',
                          color: isChecked ? '#e61b23' : '#475569',
                          fontWeight: isChecked ? 600 : 500,
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease-in-out',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <i className={`bi ${isChecked ? 'bi-check-circle-fill' : 'bi-circle'}`} style={{ fontSize: '14px' }} />
                        {p}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Uygun Günler */}
              <div className="mb-4">
                <label className="form-label fw-semibold d-block" style={{ color: '#334155', fontSize: '13.5px' }}>
                  Saha İçin Uygun Olduğunuz Günler
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {gunler.map(d => {
                    const isDaySelected = form.uygun_gunler.includes(d)
                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setForm({ ...form, uygun_gunler: toggleArray(form.uygun_gunler, d) })}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          border: isDaySelected ? '1.5px solid #e61b23' : '1.5px solid #e2e8f0',
                          background: isDaySelected ? '#e61b23' : '#f8fafc',
                          color: isDaySelected ? '#ffffff' : '#475569',
                          fontWeight: isDaySelected ? 600 : 500,
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease-in-out',
                        }}
                      >
                        {d}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Deneyim */}
              <div className="mb-4">
                <label className="form-label fw-semibold d-block" style={{ color: '#334155', fontSize: '13.5px' }}>
                  Daha önce doğa gözlemi veya saha çalışması deneyiminiz var mı?
                </label>
                <div className="d-flex gap-3">
                  {[
                    { val: true, label: 'Evet, saha deneyimim var' },
                    { val: false, label: 'Hayır, ilk defa katılacağım' },
                  ].map(v => (
                    <label
                      key={v.label}
                      style={{
                        cursor: 'pointer',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        border: form.onceki_deneyim === v.val ? '1.5px solid #e61b23' : '1.5px solid #e2e8f0',
                        background: form.onceki_deneyim === v.val ? '#fef2f2' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13.5px',
                        color: form.onceki_deneyim === v.val ? '#e61b23' : '#334155',
                        fontWeight: form.onceki_deneyim === v.val ? 600 : 500,
                        transition: 'all 0.15s',
                      }}
                    >
                      <input
                        type="radio"
                        name="onceki_deneyim"
                        checked={form.onceki_deneyim === v.val}
                        onChange={() => setForm({ ...form, onceki_deneyim: v.val })}
                        style={{ accentColor: '#e61b23' }}
                      />
                      {v.label}
                    </label>
                  ))}
                </div>
              </div>

              {form.onceki_deneyim && (
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#334155', fontSize: '13.5px' }}>
                    Deneyim Detayınız (İsteğe bağlı)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Önceki gözlem alanları, ilgilendiğiniz canlı grupları veya saha tecrübeleriniz..."
                    value={form.deneyim_notu}
                    onChange={e => setForm({ ...form, deneyim_notu: e.target.value })}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  background: status === 'loading' ? '#94a3b8' : 'linear-gradient(135deg, #e61b23 0%, #b91c1c 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px 28px',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: status === 'loading' ? 'none' : '0 4px 16px rgba(230,27,35,0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                {status === 'loading' ? (
                  <><i className="bi bi-arrow-repeat spin" /> Başvuru İletiliyor...</>
                ) : (
                  <><i className="bi bi-send-fill" /> Başvuruyu Gönder</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sağ Kolon - Bilgi ve İletişim Kartı */}
        <div className="col-lg-5">
          <div
            className="p-4 p-md-5 rounded-4 shadow-sm h-100 d-flex flex-column justify-content-between"
            style={{
              background: 'linear-gradient(145deg, #181b22 0%, #0d0f13 100%)',
              border: '1px solid #2d3340',
              color: '#ffffff',
            }}
          >
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-danger text-white px-3 py-1 rounded-pill fw-semibold" style={{ fontSize: '12px' }}>
                  <i className="bi bi-info-circle me-1" /> Bilgilendirme
                </span>
              </div>
              <h4 className="fw-bold text-white mb-3" style={{ fontSize: '22px' }}>
                Neden Gönüllü Olmalısınız?
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
                Biyoçeşitliliğin korunmasında bilim insanlarının yanında yer alarak hem teorik hem de pratik doğa araştırmaları tecrübesi kazanırsınız.
              </p>

              <div className="d-flex flex-column gap-3 mb-4">
                {[
                  {
                    icon: 'bi-soundwave',
                    title: 'Akustik Ekipman Eğitimi',
                    desc: 'Ultrasonik dedektörler ve spektrogram analizleri konusunda eğitim alın.',
                  },
                  {
                    icon: 'bi-geo-alt',
                    title: 'Gece Saha Çalışmaları',
                    desc: 'Mağara, gölet ve nehir kıyısı ekosistemlerinde doğrudan gözlem yapın.',
                  },
                  {
                    icon: 'bi-award',
                    title: 'Katılım Belgesi',
                    desc: 'Saha çalışmalarına aktif katılan gönüllülere dernek katılım belgesi verilir.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ width: 38, height: 38, borderRadius: '8px', background: 'rgba(230,27,35,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#e61b23', fontSize: '18px' }}>
                      <i className={`bi ${item.icon}`} />
                    </div>
                    <div>
                      <div className="fw-semibold text-white" style={{ fontSize: '14px' }}>{item.title}</div>
                      <div style={{ color: '#94a3b8', fontSize: '12.5px', marginTop: '2px', lineHeight: '1.5' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-top border-secondary-subtle" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <i className="bi bi-envelope-fill text-danger fs-5" />
                <div>
                  <div className="text-white small fw-semibold">Topluluk İletişim</div>
                  <div className="text-secondary small">yarasagozlemtoplulugu@gmail.com</div>
                </div>
              </div>
              <Link
                to="/veri-gonder"
                className="d-flex align-items-center justify-content-center gap-2 py-3 rounded-3 fw-bold w-100 text-decoration-none"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e61b23'; e.currentTarget.style.borderColor = '#e61b23' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
              >
                <i className="bi bi-camera-fill" /> Hızlı Gözlem Verisi Gönder
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
