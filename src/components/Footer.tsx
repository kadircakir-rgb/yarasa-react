import { Link } from 'react-router-dom'
import { useLangStore } from '../store/langStore'

const SOCIAL = [
  { icon: 'bi-instagram', href: 'https://www.instagram.com/yarasaarastirma/', label: 'Instagram' },
  { icon: 'bi-envelope', href: 'mailto:yarasagozlemtoplulugu@gmail.com', label: 'E-posta' },
]

export default function Footer() {
  const { lang, t } = useLangStore()
  const isTr = lang === 'tr'

  return (
    <footer id="footer" className="footer dark-background" style={{ background: '#111' }}>
      <div className="footer-top" style={{ padding: '60px 0 40px' }}>
        <div className="container">
          <div className="row gy-4">

            <div className="col-lg-4 col-md-6">
              <Link to="/" className="logo d-flex align-items-center mb-3">
                <img
                  src="/image/logo.png"
                  alt="Yarasa Araştırmaları Derneği"
                  style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
                />
              </Link>
              <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
                {isTr
                  ? 'Kırşehir Ahi Evran Üniversitesi paydaşlığında ve BAP desteğiyle yürütülen; yarasa biyolojisi, akustik tür tanımlama ve kentsel ekoloji alanında bilimsel araştırmalar yapan resmi dernek.'
                  : 'Official association conducting scientific research in bat biology, acoustic identification, and urban ecology in partnership with Kırşehir Ahi Evran University.'}
              </p>
              <div className="d-flex gap-2">
                {SOCIAL.map(s => (
                  <a
                    key={s.href}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={s.label}
                    className="footer-social-link"
                  >
                    <i className={`bi ${s.icon}`} style={{ fontSize: '15px' }} />
                  </a>
                ))}
              </div>
            </div>

            <div className="col-lg-2 col-md-3 col-6">
              <h4 className="footer-heading">{isTr ? 'Sayfalar' : 'Pages'}</h4>
              <ul className="list-unstyled mb-0 footer-link-list">
                {[
                  { to: '/', label: t('navHome') },
                  { to: '/hakkimizda', label: t('navAbout') },
                  { to: '/yarasalar', label: t('navBats') },
                  { to: '/saha-calismalari', label: t('navFieldWork') },
                  { to: '/kaynaklar', label: t('navResources') },
                ].map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className="footer-link">
                      <i className="bi bi-chevron-right" style={{ fontSize: '10px' }} />{l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-2 col-md-3 col-6">
              <h4 className="footer-heading">{isTr ? 'Katılım' : 'Get Involved'}</h4>
              <ul className="list-unstyled mb-0 footer-link-list">
                {[
                  { to: '/uye-ol', label: t('navJoin') },
                  { to: '/gonullu-ol', label: t('navVolunteer') },
                  { to: '/veri-gonder', label: t('navSubmitData') },
                  { to: '/blog', label: t('navNews') },
                  { to: '/iletisim', label: t('navContact') },
                ].map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className="footer-link">
                      <i className="bi bi-chevron-right" style={{ fontSize: '10px' }} />{l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-4 col-md-6">
              <h4 className="footer-heading">{isTr ? 'İletişim & Sosyal Medya' : 'Contact & Social'}</h4>
              {[
                { icon: 'bi-geo-alt', text: 'Kırşehir Ahi Evran Üniversitesi, Kırşehir, Türkiye' },
                { icon: 'bi-envelope', text: 'yarasagozlemtoplulugu@gmail.com', href: 'mailto:yarasagozlemtoplulugu@gmail.com' },
                { icon: 'bi-telephone', text: '0531 030 66 93', href: 'tel:+905310306693' },
                { icon: 'bi-instagram', text: '@yarasaarastirma', href: 'https://www.instagram.com/yarasaarastirma/' },
              ].map((item, i) => (
                <div key={i} className="d-flex align-items-start gap-3 mb-3">
                  <i className={`bi ${item.icon} flex-shrink-0 mt-1`} style={{ color: '#e61b23', fontSize: '15px' }} />
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="footer-contact-link">{item.text}</a>
                  ) : (
                    <span style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.5' }}>{item.text}</span>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #222', padding: '24px 0', background: '#0b0b0b' }}>
        <div className="container">
          <div className="row align-items-center gy-2">
            <div className="col-md-6 text-center text-md-start">
              <div style={{ color: '#777', fontSize: '13px' }}>
                © {new Date().getFullYear()} <strong style={{ color: '#fff' }}>Yarasa Araştırmaları Derneği</strong> · {isTr ? 'Kırşehir Ahi Evran Üniversitesi' : 'Kırşehir Ahi Evran University'}
              </div>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div style={{ color: '#999', fontSize: '13px' }}>
                <span className="badge bg-dark border border-secondary text-light px-2 py-1 me-2" style={{ fontWeight: 500 }}>
                  <i className="bi bi-code-slash text-danger me-1" />{t('designedBy')}
                </span>
                <span style={{ color: '#666' }}>• {t('allRightsReserved')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
