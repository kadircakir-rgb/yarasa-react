import PageTitle from '../components/PageTitle'
import NewsletterForm from '../components/NewsletterForm'
import ContactForm from '../components/ContactForm'

export default function Iletisim() {
  return (
    <main className="main">
      <PageTitle title="İletişim" subtitle="Bizimle iletişime geçin" crumb="İletişim" bg="/image/haberler.webp" />

      <section id="contact" className="contact section" style={{ background: '#f5e6e6' }}>
        <div className="container" data-aos="fade">
          <div className="row gy-4 gx-lg-5">

            {/* Sol — İletişim Bilgileri */}
            <div className="col-lg-4">
              <div className="p-4 rounded-3 h-100" style={{ background: '#1a1a1a' }}>
                <h3 className="h5 mb-4" style={{ color: '#e61b23' }}>
                  <i className="bi bi-chat-dots me-2" />İletişime Geçin
                </h3>
                <p style={{ color: '#aaa', fontSize: '14px' }}>
                  Yarasa Araştırmaları Derneği hakkında daha fazla bilgi almak, projelerimize katılmak veya sorularınız için bizimle iletişime geçebilirsiniz.
                </p>
                <hr style={{ borderColor: '#333' }} />
                {[
                  { icon: 'bi-geo-alt', label: 'Adres', val: 'Kırşehir Ahi Evran Üniversitesi, Kırşehir, Türkiye' },
                  { icon: 'bi-envelope', label: 'E-posta', val: 'yarasaarastirmalari@gmail.com' },
                  { icon: 'bi-phone', label: 'Telefon', val: '0531 030 66 93' },
                  { icon: 'bi-instagram', label: 'Instagram', val: '@yarasaarastirma' },
                  { icon: 'bi-twitter-x', label: 'Twitter/X', val: '@yarasaarastirma' },
                ].map((item, i) => (
                  <div key={i} className="d-flex align-items-start gap-3 mb-3">
                    <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 36, height: 36, background: '#e61b23' }}>
                      <i className={`bi ${item.icon}`} style={{ color: '#fff', fontSize: '14px' }} />
                    </div>
                    <div>
                      <div style={{ color: '#f5e6e6', fontSize: '12px', fontWeight: 600 }}>{item.label}</div>
                      <div style={{ color: '#aaa', fontSize: '13px' }}>{item.val}</div>
                    </div>
                  </div>
                ))}

                {/* Sosyal Medya Linkleri */}
                <hr style={{ borderColor: '#333' }} />
                <div className="d-flex gap-2 mt-3">
                  {[
                    { icon: 'bi-instagram', href: 'https://www.instagram.com/yarasaarastirma/', label: 'Instagram' },
                    { icon: 'bi-envelope-fill', href: 'mailto:yarasaarastirmalari@gmail.com', label: 'E-posta' },
                    { icon: 'bi-telephone-fill', href: 'tel:+905310306693', label: 'Telefon' },
                  ].map(s => (
                    <a
                      key={s.href}
                      href={s.href}
                      target={s.href.startsWith('http') ? '_blank' : undefined}
                      rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      aria-label={s.label}
                      title={s.label}
                      style={{
                        width: 38, height: 38, background: '#2a2a2a', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#aaa', textDecoration: 'none',
                        transition: 'background 0.2s, color 0.2s',
                        fontSize: '16px',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#e61b23'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.color = '#aaa' }}
                    >
                      <i className={`bi ${s.icon}`} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ — Form */}
            <div className="col-lg-8">
              <div className="p-4 p-lg-5 rounded-3" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <h3 className="h5 mb-4" style={{ color: '#1a1a1a' }}>
                  <i className="bi bi-send me-2" style={{ color: '#e61b23' }} />Mesaj Gönderin
                </h3>
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Google Maps / OpenStreetMap ── */}
      <section id="map" className="section" style={{ padding: '0', background: '#fff' }}>
        <div data-aos="fade-up">
          <div style={{ position: 'relative' }}>
            {/* Map header overlay */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
              background: 'linear-gradient(to bottom, rgba(26,26,26,0.85) 0%, transparent 100%)',
              padding: '16px 24px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{
                width: 36, height: 36, background: '#e61b23', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(230,27,35,0.4)',
              }}>
                <i className="bi bi-geo-alt-fill" style={{ color: '#fff', fontSize: '18px' }} />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>Kırşehir Ahi Evran Üniversitesi</div>
                <div style={{ color: '#aaa', fontSize: '12px' }}>Kırşehir, Türkiye — Araştırma Merkezi</div>
              </div>
              <a
                href="https://maps.google.com/maps?q=K%C4%B1r%C5%9Fehir+Ahi+Evran+%C3%9Cniversitesi"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginLeft: 'auto', background: '#e61b23', color: '#fff', textDecoration: 'none',
                  padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}
              >
                <i className="bi bi-box-arrow-up-right" />
                Google Maps'te Aç
              </a>
            </div>

            {/* OpenStreetMap iframe */}
            <iframe
              title="Kırşehir Ahi Evran Üniversitesi Haritası"
              src="https://www.openstreetmap.org/export/embed.html?bbox=33.97%2C39.07%2C34.03%2C39.13&layer=mapnik&marker=39.0963%2C34.0000"
              style={{
                width: '100%',
                height: '420px',
                border: 'none',
                display: 'block',
                filter: 'grayscale(20%) contrast(1.05)',
              }}
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section id="call-to-action" className="call-to-action section light-background">
        <div className="content">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h3>Bültenimize Abone Olun</h3>
                <p className="opacity-50">Yarasa gözlem çalışmalarımız ve etkinliklerimizden haberdar olmak için e-bültenimize abone olun.</p>
              </div>
              <div className="col-lg-6">
                <NewsletterForm placeholder="E-posta adresinizi girin" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

