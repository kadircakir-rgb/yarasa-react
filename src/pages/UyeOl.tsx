import { useState } from 'react'
import PageTitle from '../components/PageTitle'
import { useAdminStore } from '../store/adminStore'
import { useLangStore } from '../store/langStore'
import Modal from '../components/Modal'

export default function UyeOl() {
  const { addUyeBasvuru } = useAdminStore()
  const { lang } = useLangStore()
  const isTr = lang === 'tr'

  const [formData, setFormData] = useState({
    ad_soyad: '',
    tc_no: '',
    email: '',
    telefon: '',
    sehir: 'Kırşehir',
    meslek: '',
    ogrenim: 'Lisans',
    uye_tipi: 'Asil Üye',
    uzmanlik_alanlari: [] as string[],
    motivasyon: '',
    tuzuk_onay: false,
    kvkk_onay: false,
  })

  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleCheckboxChange = (alan: string) => {
    setFormData(prev => {
      const exists = prev.uzmanlik_alanlari.includes(alan)
      return {
        ...prev,
        uzmanlik_alanlari: exists
          ? prev.uzmanlik_alanlari.filter(a => a !== alan)
          : [...prev.uzmanlik_alanlari, alan]
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.ad_soyad.trim() || !formData.email.trim() || !formData.telefon.trim()) {
      setErrorMsg(isTr ? 'Lütfen zorunlu alanları (*) eksiksiz doldurunuz.' : 'Please fill all required fields (*).')
      return
    }
    if (!formData.tuzuk_onay || !formData.kvkk_onay) {
      setErrorMsg(isTr ? 'Lütfen dernek tüzüğü ve KVKK onay kutularını işaretleyiniz.' : 'Please accept the association bylaws and data privacy terms.')
      return
    }

    addUyeBasvuru({
      ad_soyad: formData.ad_soyad.trim(),
      tc_no: formData.tc_no.trim(),
      email: formData.email.trim(),
      telefon: formData.telefon.trim(),
      sehir: formData.sehir.trim(),
      meslek: formData.meslek.trim(),
      ogrenim: formData.ogrenim,
      uye_tipi: formData.uye_tipi,
      uzmanlik_alanlari: formData.uzmanlik_alanlari,
      motivasyon: formData.motivasyon.trim(),
    })

    setErrorMsg('')
    setSubmitted(true)
  }

  const resetForm = () => {
    setFormData({
      ad_soyad: '',
      tc_no: '',
      email: '',
      telefon: '',
      sehir: 'Kırşehir',
      meslek: '',
      ogrenim: 'Lisans',
      uye_tipi: 'Asil Üye',
      uzmanlik_alanlari: [],
      motivasyon: '',
      tuzuk_onay: false,
      kvkk_onay: false,
    })
    setSubmitted(false)
  }

  const expertiseOptions = isTr ? [
    'Saha Araştırmaları & Transekt',
    'Akustik İzleme (Ses Dinleme)',
    'Tünek Araştırması (Yuva Kontrolü)',
    'Eğitim & Halk Farkındalığı',
    'Dijital Medya, Fotoğraf & Web',
    'Çevre Hukuku & Mevzuat',
    'Biyoistatistik & CBS Haritalama',
  ] : [
    'Field Surveys & Transects',
    'Acoustic Monitoring (Listening)',
    'Roost Surveys (Roost Inspection)',
    'Education & Public Awareness',
    'Digital Media, Photography & Web',
    'Environmental Law & Regulations',
    'Biostatistics & GIS Mapping',
  ]

  return (
    <main className="main">
      <PageTitle
        title={isTr ? 'Üye Ol / Dernek Üyeliği' : 'Join Us / Association Membership'}
        subtitle={isTr
          ? 'Yarasa Araştırmaları Derneği’ne katılarak doğa koruma, bilimsel araştırma ve sivil bilim projelerinin öncüsü olun.'
          : 'Join the Bat Research Association and lead nature conservation, scientific research, and citizen science.'}
        crumb={isTr ? 'Üye Ol' : 'Join Us'}
        bg="/image/hayat.webp"
      />

      {/* ── BİLGİ & ÜYELİK TÜRLERİ ── */}
      <section className="section">
        <div className="container" data-aos="fade-up">
          <div className="row gy-4 mb-5">
            <div className="col-lg-7">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 hover-card">
                <h2 className="content-title mb-3" style={{ color: '#e61b23' }}>
                  {isTr ? 'Neden Yarasa Araştırmaları Derneği?' : 'Why Bat Research Association?'}
                </h2>
                <p style={{ lineHeight: '1.8', color: '#444' }}>
                  {isTr
                    ? 'Yarasalar, ekosistemimizin dengesi ve biyolojik çeşitliliğimizin sürdürülebilirliği için vazgeçilmez memelilerdir. Derneğimiz; doğa ile uzlaşık bir yaşam felsefesiyle, yarasaların yaşam alanlarını tespit etmek, koruma politikaları geliştirmek ve toplumsal bilinci artırmak amacıyla kurulmuştur.'
                    : 'Bats are indispensable mammals for our ecosystem balance and sustainable biodiversity. Our association was established with the philosophy of living in harmony with nature, identifying bat habitats, developing conservation policies, and fostering public awareness.'}
                </p>
                <p style={{ lineHeight: '1.8', color: '#444' }}>
                  {isTr
                    ? 'Derneğimize üye olarak bilimsel saha çalışmalarına katılabilir, ultrasonik akustik dedektörlerle ses dinleme ve yuva kontrolü araştırmalarında görev alabilir, eğitim ve farkındalık kampanyalarımızda aktif rol üstlenebilirsiniz.'
                    : 'By becoming a member, you can participate in scientific field studies, take part in acoustic listening and roost inspection surveys with ultrasonic detectors, and play an active role in our educational campaigns.'}
                </p>
                <div className="d-flex flex-wrap gap-3 mt-4">
                  <div className="p-3 rounded-2" style={{ background: '#fdf2f2', borderLeft: '4px solid #e61b23', flex: '1 1 200px' }}>
                    <div style={{ fontWeight: 700, color: '#1a1a1a' }}><i className="bi bi-shield-check text-danger me-2" />{isTr ? 'Resmi & Bilimsel Statü' : 'Official & Scientific Status'}</div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{isTr ? 'HADYEK ve DKMP onaylı araştırma standartları' : 'IACUC and national permit approved standards'}</div>
                  </div>
                  <div className="p-3 rounded-2" style={{ background: '#fdf2f2', borderLeft: '4px solid #e61b23', flex: '1 1 200px' }}>
                    <div style={{ fontWeight: 700, color: '#1a1a1a' }}><i className="bi bi-mortarboard text-danger me-2" />{isTr ? 'Akademik Destek' : 'Academic Support'}</div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{isTr ? 'Kırşehir Ahi Evran Üniversitesi ve uzman danışmanlar' : 'Kırşehir Ahi Evran University & expert advisors'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 hover-card">
                <h3 className="h5 mb-3" style={{ color: '#e61b23' }}>
                  <i className="bi bi-card-checklist me-2" />{isTr ? 'Üyelik Süreci Nasıl İşler?' : 'Membership Process'}
                </h3>
                <div className="d-flex flex-column gap-3">
                  {[
                    { step: '1', title: isTr ? 'Başvuru Formu' : 'Application Form', desc: isTr ? 'Aşağıdaki formu eksiksiz doldurarak bilgilerinizi iletin.' : 'Fill out the form below with your details.' },
                    { step: '2', title: isTr ? 'Yönetim Kurulu Değerlendirmesi' : 'Board Review', desc: isTr ? 'Başvurunuz 5 iş günü içinde incelenir ve teyit edilir.' : 'Your application is evaluated within 5 business days.' },
                    { step: '3', title: isTr ? 'Oryantasyon & Katılım' : 'Orientation & Welcome', desc: isTr ? 'Üyelik belgeniz iletilir ve çalışma gruplarına dahil edilirsiniz.' : 'Your membership is confirmed and you join our working groups.' },
                  ].map((s, i) => (
                    <div key={i} className="d-flex gap-3 align-items-start">
                      <div style={{ width: 34, height: 34, background: '#e61b23', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                        {s.step}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#1a1a1a' }}>{s.title}</div>
                        <div style={{ fontSize: '13px', color: '#666' }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-2 text-center" style={{ background: '#1a1a1a', color: '#fff' }}>
                  <div style={{ fontSize: '13px', opacity: 0.9 }}>{isTr ? 'Sosyal Medyadan Takip Edin:' : 'Follow Us on Social Media:'}</div>
                  <a href="https://www.instagram.com/yarasaarastirma/" target="_blank" rel="noopener noreferrer" style={{ color: '#e61b23', fontWeight: 700, fontSize: '15px', textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}>
                    <i className="bi bi-instagram me-1" />@yarasaarastirma
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── ÜYELİK TÜRLERİ KARTLARI ── */}
          <div className="row g-4 mb-5">
            {[
              {
                title: isTr ? 'Asil Üye' : 'Full Member',
                badge: isTr ? 'Tavsiye Edilen' : 'Recommended',
                desc: isTr ? 'Dernek genel kurulunda oy kullanma, yönetim organlarına seçilme ve projeleri doğrudan yürütme yetkisi.' : 'Voting rights in the general assembly, eligibility for governance, and project lead access.',
                icon: 'bi-person-badge',
              },
              {
                title: isTr ? 'Öğrenci / Genç Üye' : 'Student / Youth Member',
                badge: isTr ? 'Öğrencilere Özel' : 'For Students',
                desc: isTr ? 'Lisans ve lisansüstü öğrencilerine yönelik, saha çalışmalarında uygulamalı eğitim ve staj olanakları sunan üyelik.' : 'For undergraduate and graduate students, offering practical field training and research credits.',
                icon: 'bi-mortarboard',
              },
              {
                title: isTr ? 'Gönüllü Destekçi' : 'Volunteer Supporter',
                badge: isTr ? 'Esnek Katılım' : 'Flexible',
                desc: isTr ? 'Saha surveyleri, yuva kontrolü ve etkinlik organizasyonlarında gönüllü görev alarak katkı sağlamak isteyenler için.' : 'For nature lovers who want to support field surveys, roost checks, and outreach events.',
                icon: 'bi-heart-pulse',
              },
            ].map((k, i) => (
              <div key={i} className="col-lg-4">
                <div className="p-4 bg-white rounded-3 shadow-sm h-100 hover-card" style={{ borderTop: '3px solid #e61b23' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div style={{ width: 44, height: 44, background: '#fdf2f2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`bi ${k.icon} text-danger fs-4`} />
                    </div>
                    <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-1" style={{ fontSize: '12px' }}>
                      {k.badge}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px' }}>{k.title}</h4>
                  <p style={{ fontSize: '13.5px', color: '#666', lineHeight: '1.6', marginBottom: 0 }}>{k.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── BAŞVURU FORMU ── */}
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="p-4 p-lg-5 bg-white rounded-4 shadow hover-card" style={{ borderTop: '4px solid #e61b23' }}>
                <div className="text-center mb-4">
                  <span className="badge bg-danger-subtle text-danger px-3 py-1 mb-2" style={{ fontSize: '13px', fontWeight: 600 }}>
                    <i className="bi bi-pen me-1" />{isTr ? 'Resmi Başvuru' : 'Official Application'}
                  </span>
                  <h3 style={{ fontSize: '26px', fontWeight: 700, color: '#1a1a1a' }}>
                    {isTr ? 'Dernek Üyelik Başvuru Formu' : 'Association Membership Application Form'}
                  </h3>
                  <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '14px' }}>
                    {isTr
                      ? 'Lütfen aşağıdaki bilgileri eksiksiz doldurunuz. Başvurunuz Dernek Yönetim Kurulu tarafından incelendikten sonra sizinle iletişime geçilecektir.'
                      : 'Please complete all required fields below. You will be contacted once the Board of Directors reviews your application.'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill" />
                    <div>{errorMsg}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{isTr ? 'Ad Soyad *' : 'Full Name *'}</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder={isTr ? 'Örn. Dr. Ayşe Yılmaz' : 'e.g. Jane Doe'}
                        value={formData.ad_soyad}
                        onChange={e => setFormData({ ...formData, ad_soyad: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{isTr ? 'T.C. Kimlik No (Opsiyonel / Resmi Kayıt İçin)' : 'ID Number (Optional)'}</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="11 haneli kimlik numarası"
                        maxLength={11}
                        value={formData.tc_no}
                        onChange={e => setFormData({ ...formData, tc_no: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{isTr ? 'E-posta Adresi *' : 'Email Address *'}</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        placeholder="ornek@alanadi.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{isTr ? 'Telefon Numarası *' : 'Phone Number *'}</label>
                      <input
                        type="tel"
                        className="form-control"
                        required
                        placeholder="05XX XXX XX XX"
                        value={formData.telefon}
                        onChange={e => setFormData({ ...formData, telefon: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">{isTr ? 'İl / Şehir *' : 'City *'}</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.sehir}
                        onChange={e => setFormData({ ...formData, sehir: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">{isTr ? 'Meslek / Görev' : 'Occupation'}</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={isTr ? 'Örn. Biyolog / Araştırmacı' : 'e.g. Biologist / Researcher'}
                        value={formData.meslek}
                        onChange={e => setFormData({ ...formData, meslek: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">{isTr ? 'Öğrenim Durumu' : 'Education Level'}</label>
                      <select
                        className="form-select"
                        value={formData.ogrenim}
                        onChange={e => setFormData({ ...formData, ogrenim: e.target.value })}
                      >
                        <option value="Ön Lisans">{isTr ? 'Ön Lisans' : 'Associate Degree'}</option>
                        <option value="Lisans">{isTr ? 'Lisans' : 'Bachelor’s Degree'}</option>
                        <option value="Yüksek Lisans">{isTr ? 'Yüksek Lisans' : 'Master’s Degree'}</option>
                        <option value="Doktora">{isTr ? 'Doktora' : 'PhD / Doctorate'}</option>
                        <option value="Diğer">{isTr ? 'Diğer' : 'Other'}</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">{isTr ? 'Başvurulan Üyelik Türü *' : 'Membership Category *'}</label>
                      <div className="d-flex flex-wrap gap-4 pt-1">
                        {[
                          { val: 'Asil Üye', label: isTr ? 'Asil Üye' : 'Full Member' },
                          { val: 'Öğrenci / Genç Üye', label: isTr ? 'Öğrenci / Genç Üye' : 'Student / Youth Member' },
                          { val: 'Gönüllü Destekçi', label: isTr ? 'Gönüllü Destekçi' : 'Volunteer Supporter' },
                        ].map(t => (
                          <div key={t.val} className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="uye_tipi"
                              id={`uye_${t.val}`}
                              checked={formData.uye_tipi === t.val}
                              onChange={() => setFormData({ ...formData, uye_tipi: t.val })}
                              style={{ accentColor: '#e61b23', cursor: 'pointer' }}
                            />
                            <label className="form-check-label small fw-semibold" htmlFor={`uye_${t.val}`} style={{ cursor: 'pointer' }}>
                              {t.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">
                        {isTr ? 'Katkı Sağlamak İstediğiniz Çalışma Başlıkları' : 'Areas You Would Like to Contribute'}
                      </label>
                      <div className="row g-2">
                        {expertiseOptions.map(opt => (
                          <div key={opt} className="col-md-6">
                            <div className="form-check p-2 rounded-2" style={{ background: '#fafafa', border: '1px solid #eee' }}>
                              <input
                                className="form-check-input ms-0 me-2"
                                type="checkbox"
                                id={`check_${opt}`}
                                checked={formData.uzmanlik_alanlari.includes(opt)}
                                onChange={() => handleCheckboxChange(opt)}
                                style={{ accentColor: '#e61b23', cursor: 'pointer' }}
                              />
                              <label className="form-check-label small" htmlFor={`check_${opt}`} style={{ cursor: 'pointer' }}>
                                {opt}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">
                        {isTr ? 'Motivasyonunuz & Kendinizi Tanıtın' : 'Motivation & Background'}
                      </label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder={isTr
                          ? 'Yarasa araştırmalarına ilginiz, daha önceki deneyimleriniz ve derneğimizden beklentileriniz hakkında kısa bilgi veriniz...'
                          : 'Tell us briefly about your interest in bat research, previous background, and expectations...'}
                        value={formData.motivasyon}
                        onChange={e => setFormData({ ...formData, motivasyon: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="tuzuk"
                          checked={formData.tuzuk_onay}
                          onChange={e => setFormData({ ...formData, tuzuk_onay: e.target.checked })}
                          required
                          style={{ accentColor: '#e61b23', cursor: 'pointer' }}
                        />
                        <label className="form-check-label small" htmlFor="tuzuk" style={{ cursor: 'pointer' }}>
                          {isTr
                            ? 'Yarasa Araştırmaları Derneği Tüzüğü’nü, amaç ve ilkelerini okudum; dernek tüzüğüne uymayı kabul ediyorum. *'
                            : 'I have read and accepted the Bylaws, goals and principles of the Bat Research Association. *'}
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="kvkk"
                          checked={formData.kvkk_onay}
                          onChange={e => setFormData({ ...formData, kvkk_onay: e.target.checked })}
                          required
                          style={{ accentColor: '#e61b23', cursor: 'pointer' }}
                        />
                        <label className="form-check-label small" htmlFor="kvkk" style={{ cursor: 'pointer' }}>
                          {isTr
                            ? '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca verdiğim bilgilerin dernek faaliyetleri kapsamında işlenmesini onaylıyorum. *'
                            : 'I consent to the processing of my personal data under Data Protection laws for association activities. *'}
                        </label>
                      </div>
                    </div>

                    <div className="col-12 text-end pt-3">
                      <button
                        type="submit"
                        className="btn-cta"
                        style={{ padding: '14px 36px', fontSize: '15px' }}
                      >
                        <i className="bi bi-send-check me-2" />
                        {isTr ? 'Üyelik Başvurusunu Gönder' : 'Submit Membership Application'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Başarı Modalı */}
      <Modal
        open={submitted}
        onClose={resetForm}
        title={isTr ? 'Başvurunuz Alındı!' : 'Application Received!'}
      >
        <div className="text-center py-3">
          <div style={{ width: 64, height: 64, background: '#d4edda', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#155724' }}>
            <i className="bi bi-check2-circle fs-1" />
          </div>
          <h4 style={{ fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>
            {isTr ? 'Teşekkür Ederiz, Başvurunuz Başarıyla Kaydedildi!' : 'Thank You, Application Submitted!'}
          </h4>
          <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
            {isTr
              ? 'Yarasa Araştırmaları Derneği ailemize katılmak üzere gösterdiğiniz ilgi için teşekkür ederiz. Başvurunuz Yönetim Kurulumuz tarafından incelenecek ve en kısa sürede e-posta / telefon yoluyla tarafınıza dönüş yapılacaktır.'
              : 'Thank you for your interest in joining the Bat Research Association. Your application will be reviewed by our board and we will get back to you shortly.'}
          </p>
          <button
            type="button"
            className="btn-cta"
            onClick={resetForm}
          >
            {isTr ? 'Tamam' : 'Done'}
          </button>
        </div>
      </Modal>
    </main>
  )
}
