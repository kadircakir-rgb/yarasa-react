import { Link } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import GozlemForm from '../components/GozlemForm'
import { useLangStore } from '../store/langStore'

export default function VeriGonder() {
  const { lang } = useLangStore()
  const isTr = lang === 'tr'

  return (
    <main className="main">
      <PageTitle
        title={isTr ? "Veri Gönder / Gözlem Bildir" : "Submit Data / Report Observation"}
        subtitle={isTr ? "Gözleminizi tarih, saat ve konumla paylaşarak sivil bilime katkı sağlayın" : "Share your observation with date, time, and coordinates to support citizen science"}
        crumb={isTr ? "Veri Gönder" : "Submit Data"}
        bg="/image/haberler.webp"
      />

      {/* ── GÖZLEMLE - KORU - HABER VER (3 AŞAMALI VATANDAŞ BİLİMİ REHBERİ) ── */}
      <section className="section pb-0" style={{ background: '#fff' }}>
        <div className="container" data-aos="fade-up">
          <div className="text-center mb-5">
            <span className="badge bg-danger-subtle text-danger px-3 py-1 mb-2 fw-semibold" style={{ letterSpacing: '1px' }}>
              <i className="bi bi-compass me-1" />{isTr ? 'ÜÇ ADIMDA VATANDAŞ BİLİMİ' : 'CITIZEN SCIENCE IN THREE STEPS'}
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1a1a1a' }}>
              {isTr ? 'Gözlemle • Koru • Haber Ver' : 'Observe • Protect • Report'}
            </h2>
            <p className="text-muted" style={{ maxWidth: '640px', margin: '0 auto', fontSize: '15px' }}>
              {isTr
                ? 'Yarasaların korunması ve kentsel biyoçeşitliliğin haritalanması için her bireyin katkısı çok değerlidir.'
                : 'Every individual’s contribution is invaluable for bat conservation and mapping urban biodiversity.'}
            </p>
          </div>

          <div className="row g-4 mb-5">
            {/* 1. GÖZLEMLE */}
            <div className="col-lg-4">
              <div className="p-4 rounded-4 h-100 hover-card d-flex flex-column justify-content-between" style={{ background: '#fdf8f8', border: '1.5px solid #f2dede' }}>
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div style={{ width: 50, height: 50, background: '#e61b23', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px' }}>
                      <i className="bi bi-eye" />
                    </div>
                    <span className="badge bg-danger text-white px-3 py-1" style={{ fontSize: '12px' }}>
                      {isTr ? 'Adım 1' : 'Step 1'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>
                    {isTr ? '1. GÖZLEMLE' : '1. OBSERVE'}
                  </h3>
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>
                    {isTr
                      ? 'Çevrenizde, parkta veya binaların saçaklarında yarasa fark ettiğinizde paniklemeyin ve güvenli bir mesafeden izleyin. Uçuş saati, yönü, hava durumu ve yaklaşık birey sayısını not alın.'
                      : 'When you notice bats in parks or around buildings, keep a safe distance and observe calmly. Note the time, flight direction, weather, and estimated number of bats.'}
                  </p>
                </div>
                <div className="p-3 rounded-3" style={{ background: '#fff', border: '1px solid #eee' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#e61b23', marginBottom: '4px' }}>
                    <i className="bi bi-lightbulb me-1" />{isTr ? 'Gözlem İpuçları' : 'Observation Tips'}
                  </div>
                  <ul className="list-unstyled mb-0" style={{ fontSize: '12.5px', color: '#666' }}>
                    <li>• {isTr ? 'Gün batımından sonraki ilk 60–90 dakika' : 'First 60-90 minutes post-sunset'}</li>
                    <li>• {isTr ? 'Sokak lambaları etrafında böcek avı' : 'Feeding around streetlights'}</li>
                    <li>• {isTr ? 'Köprü altı ve çatlak geçişleri' : 'Bridge joints and rock crevices'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. KORU */}
            <div className="col-lg-4">
              <div className="p-4 rounded-4 h-100 hover-card d-flex flex-column justify-content-between" style={{ background: '#f5faf5', border: '1.5px solid #d4edda' }}>
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div style={{ width: 50, height: 50, background: '#2d6a2d', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px' }}>
                      <i className="bi bi-shield-check" />
                    </div>
                    <span className="badge bg-success text-white px-3 py-1" style={{ fontSize: '12px' }}>
                      {isTr ? 'Adım 2' : 'Step 2'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>
                    {isTr ? '2. KORU' : '2. PROTECT'}
                  </h3>
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>
                    {isTr
                      ? 'Türkiye\'deki tüm yarasa türleri yasal koruma altındadır. Tünek ve yuva alanlarını tahrip etmeyin, duman veya yüksek sesle rahatsız etmeyin. Asla çıplak elle dokunmayın. Evinize girdiyse ışıkları kapatıp pencereyi açın.'
                      : 'All bat species in Turkey are legally protected. Do not disturb or block roosts with smoke or noise. Never handle them with bare hands. If inside a room, turn off lights and open windows.'}
                  </p>
                </div>
                <div className="p-3 rounded-3" style={{ background: '#fff', border: '1px solid #eee' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#2d6a2d', marginBottom: '4px' }}>
                    <i className="bi bi-check-circle me-1" />{isTr ? 'Koruma Kuralları' : 'Protection Rules'}
                  </div>
                  <ul className="list-unstyled mb-0" style={{ fontSize: '12.5px', color: '#666' }}>
                    <li>• {isTr ? '2872 ve 4915 sayılı kanunlarla koruma altında' : 'Protected under laws No. 2872 & 4915'}</li>
                    <li>• {isTr ? 'Yuvaları kapatmayın, kış uykusunu bölmeyin' : 'Do not seal roosts during hibernation'}</li>
                    <li>• {isTr ? 'Çocukları ve evcil hayvanları uzak tutun' : 'Keep pets and children away'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. HABER VER */}
            <div className="col-lg-4">
              <div className="p-4 rounded-4 h-100 hover-card d-flex flex-column justify-content-between" style={{ background: '#fdf8f4', border: '1.5px solid #fbeed5' }}>
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div style={{ width: 50, height: 50, background: '#e67e22', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px' }}>
                      <i className="bi bi-broadcast-pin" />
                    </div>
                    <span className="badge bg-warning text-dark px-3 py-1" style={{ fontSize: '12px' }}>
                      {isTr ? 'Adım 3' : 'Step 3'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>
                    {isTr ? '3. HABER VER' : '3. REPORT'}
                  </h3>
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>
                    {isTr
                      ? 'Gözleminizi aşağıdaki formu doldurarak hemen araştırma ekibimize iletin. Çektiğiniz fotoğraf, video veya ses kaydını yükleyin. Paylaştığınız her veri ulusal biyoçeşitlilik haritasına işlenmektedir.'
                      : 'Submit your observation using the form below. Upload photos, videos, or sound recordings. Every submission directly updates the national biodiversity database.'}
                  </p>
                </div>
                <div className="p-3 rounded-3" style={{ background: '#fff', border: '1px solid #eee' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#e67e22', marginBottom: '4px' }}>
                    <i className="bi bi-send-check me-1" />{isTr ? 'Bildirim Faydaları' : 'Benefits of Reporting'}
                  </div>
                  <ul className="list-unstyled mb-0" style={{ fontSize: '12.5px', color: '#666' }}>
                    <li>• {isTr ? 'Yeni tür kayıtlarının tespitine doğrudan katkı' : 'Direct contribution to new species records'}</li>
                    <li>• {isTr ? 'Tünek haritalandırması ve koruma eylemleri' : 'Roost mapping and rapid conservation'}</li>
                    <li>• {isTr ? 'Akademik araştırmacılardan uzman desteği' : 'Expert feedback from researchers'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORM & BİLGİ KARTLARI ── */}
      <section className="section" style={{ background: '#fbf5f5' }}>
        <div className="container" data-aos="fade-up">
          <div className="row gy-4">

            {/* Sol — Neden önemli & Evinizde Yarasa mı Var? */}
            <div className="col-lg-5">
              <div className="hover-card p-4 rounded-3 mb-4" style={{ background: '#1a1a1a' }}>
                <h3 className="h5 mb-3" style={{ color: '#e61b23' }}>
                  <i className="bi bi-question-circle me-2" />{isTr ? 'Neden Bildirim Yapmalısınız?' : 'Why Submit Data?'}
                </h3>
                <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.7' }}>
                  {isTr
                    ? 'Yarasa gözlemleri, ses kayıtları ve potansiyel tünek alanı (yuva kontrolü) bildirimleri kentsel ekosistemlerde türlerin dağılımı ve aktivitesinin anlaşılması için kritik girdiler sağlar. Tek bir bildirim bile araştırmaya büyük katkıdır.'
                    : 'Bat observations, acoustic records, and roost reports provide critical inputs for understanding species distribution and activity in urban ecosystems.'}
                </p>
                <div className="mt-3">
                  {[
                    { icon: 'bi-eye', label: isTr ? 'Görsel Gözlem' : 'Visual Sighting', desc: isTr ? 'Yarasa gördüğünüzde tarih, saat ve konumu not edin.' : 'Note the date, time, and coordinates.' },
                    { icon: 'bi-soundwave', label: isTr ? 'Ses Kaydı (Ses Dinleme)' : 'Sound Recording', desc: isTr ? 'Akustik kayıtlar tür tespitinde kritik öneme sahiptir.' : 'Acoustic recordings are vital for species ID.' },
                    { icon: 'bi-house-check', label: isTr ? 'Tünek Alanı (Yuva Kontrolü)' : 'Roost Site (Roost Check)', desc: isTr ? 'Potansiyel tünek alanlarını bildirin, haritaya ekleyelim.' : 'Report potential roosts to map them.' },
                  ].map((item, i) => (
                    <div key={i} className="d-flex align-items-start gap-3 mb-3">
                      <div style={{ width: 36, height: 36, background: '#e61b23', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={`bi ${item.icon}`} style={{ color: '#fff', fontSize: '14px' }} />
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '13px' }}>{item.label}</div>
                        <div style={{ color: '#aaa', fontSize: '12px' }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hover-card p-4 rounded-3" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <h5 className="mb-3" style={{ color: '#e61b23' }}>
                  <i className="bi bi-house-exclamation me-2" />{isTr ? 'Evinize veya Balkonunuza Yarasa mı Girdi?' : 'Is There a Bat in Your House?'}
                </h5>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
                  {isTr ? 'Paniklemeyin! Yarasalar çekingen, zararsız canlılardır ve saldırmazlar.' : 'Do not panic! Bats are gentle, harmless creatures and will not attack.'}
                </p>
                <ul style={{ color: '#555', fontSize: '13px', paddingLeft: '18px', marginBottom: '16px', lineHeight: '1.7' }}>
                  <li>{isTr ? 'Odadaki ışıkları kapatın, dışarıya bakan pencereleri sonuna kadar açın.' : 'Turn off room lights, open windows wide facing outdoors.'}</li>
                  <li>{isTr ? 'Evcil hayvanları (kedi, köpek) odadan uzaklaştırın.' : 'Keep pets out of the room.'}</li>
                  <li>{isTr ? 'Yarasaya çıplak elle dokunmayın; kendiliğinden uçup gidecektir.' : 'Do not handle with bare hands; it will find its way out.'}</li>
                </ul>
                <Link to="/iletisim" style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#e61b23', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                  {isTr ? 'Bize Ulaşın / Destek Alın' : 'Contact Us for Assistance'}
                </Link>
              </div>
            </div>

            {/* Sağ — Form */}
            <div className="col-lg-7">
              <GozlemForm />
            </div>

          </div>
        </div>
      </section>

      {/* Platform bağlantıları */}
      <section className="section light-background">
        <div className="container" data-aos="fade-up">
          <div className="row gy-4">
            <div className="col-lg-6">
              <div className="p-4 bg-white rounded-3 shadow-sm hover-card h-100">
                <h5 className="mb-3" style={{ color: '#e61b23' }}>
                  <i className="bi bi-link-45deg me-2" />{isTr ? 'Ulusal & Uluslararası Platformlar' : 'National & Global Platforms'}
                </h5>
                {[
                  { icon: 'bi-globe', label: 'iNaturalist', sub: isTr ? 'Küresel Doğa Gözlem Ağı' : 'Global Nature Observation Network' },
                  { icon: 'bi-database', label: isTr ? 'Ulusal Biyoçeşitlilik Veri Tabanı (Noah\'s Ark)' : 'National Biodiversity Database', sub: isTr ? 'DKMP Biyoçeşitlilik Envanteri' : 'DKMP National Inventory' },
                ].map((p, i) => (
                  <div key={i} className="d-flex align-items-center gap-3 mb-3">
                    <div style={{ width: 40, height: 40, background: '#f5e6e6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`bi ${p.icon}`} style={{ color: '#e61b23' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#1a1a1a' }}>{p.label}</div>
                      <div style={{ color: '#aaa', fontSize: '12px' }}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="p-4 bg-white rounded-3 shadow-sm hover-card h-100">
                <h5 className="mb-3" style={{ color: '#e61b23' }}>
                  <i className="bi bi-shield-lock me-2" />{isTr ? 'Veri Güvenliği & Etik' : 'Data Privacy & Ethics'}
                </h5>
                <p style={{ fontSize: '13.5px', color: '#666', lineHeight: '1.7', marginBottom: '12px' }}>
                  {isTr
                    ? 'Gönderilen tünek koordinatları, hassas kolonilerin güvenliği amacıyla kamuya açık haritalarda filtrelenerek yalnızca bilimsel araştırmacılarımızın ve DKMP yetkililerinin erişimine sunulmaktadır.'
                    : 'Roost coordinates are protected to shield vulnerable colonies and accessible only to certified researchers and nature authorities.'}
                </p>
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <i className="bi bi-check-circle-fill text-success" />
                  <span>{isTr ? 'HADYEK ve DKMP Etik Yönergelerine Uygun' : 'Compliant with HADYEK and DKMP ethics'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
