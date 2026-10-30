import { useState, useMemo } from 'react'
import PageTitle from '../components/PageTitle'
import ImageLightbox, { type LightboxImage } from '../components/ImageLightbox'

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
  padding: '28px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
}

export interface BatSpeciesItem {
  id: number
  family: string
  scientificName: string
  turkishName: string
  diet: 'Meyve' | 'Böcekçil'
  iucnGlobal: string
  iucnEurope: string
  iucnMediterranean: string
}

export const ALL_BAT_SPECIES: BatSpeciesItem[] = [
  // 1. Pteropodidae
  { id: 1, family: 'Pteropodidae', scientificName: 'Rousettus aegyptiacus (É. Geoffroy, 1810)', turkishName: 'Mısır Meyve Yarasası', diet: 'Meyve', iucnGlobal: 'LC', iucnEurope: 'CR', iucnMediterranean: 'NT' },
  // 2. Rhinolophidae
  { id: 2, family: 'Rhinolophidae', scientificName: 'Rhinolophus blasii Peters, 1866', turkishName: 'Blasius Nalburunlu Yarasası', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'VU', iucnMediterranean: 'NT' },
  { id: 3, family: 'Rhinolophidae', scientificName: 'Rhinolophus mehelyi Matschie, 1901', turkishName: 'Akdeniz Nalburunlu Yarasası', diet: 'Böcekçil', iucnGlobal: 'VU', iucnEurope: 'EN', iucnMediterranean: 'VU' },
  { id: 4, family: 'Rhinolophidae', scientificName: 'Rhinolophus euryale Blasius, 1853', turkishName: 'Mehely Nalburunlu Yarasası', diet: 'Böcekçil', iucnGlobal: 'NT', iucnEurope: 'VU', iucnMediterranean: 'VU' },
  { id: 5, family: 'Rhinolophidae', scientificName: 'Rhinolophus ferrumequinum (Schreber, 1774)', turkishName: 'Büyük Nalburunlu Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'NT' },
  { id: 6, family: 'Rhinolophidae', scientificName: 'Rhinolophus hipposideros (Bechstein, 1800)', turkishName: 'Küçük Nalburunlu Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'NT' },
  // 3. Vespertilionidae (Tabloda Vespertilionidae bitene kadar devam ediyor)
  { id: 7, family: 'Vespertilionidae', scientificName: 'Nyctalus lasiopterus (Schreber, 1780)', turkishName: 'Büyük Akşamcı Yarasa', diet: 'Böcekçil', iucnGlobal: 'VU', iucnEurope: 'VU', iucnMediterranean: 'NT' },
  { id: 8, family: 'Vespertilionidae', scientificName: 'Nyctalus leisleri (Kuhl, 1817)', turkishName: 'Küçük Akşamcı Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'LC' },
  { id: 9, family: 'Vespertilionidae', scientificName: 'Nyctalus noctula (Schreber, 1774)', turkishName: 'Akşamcı Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'LC' },
  { id: 10, family: 'Vespertilionidae', scientificName: 'Pipistrellus pipistrellus (Schreber, 1774)', turkishName: 'Cüce Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'LC' },
  { id: 11, family: 'Vespertilionidae', scientificName: 'Pipistrellus pygmaeus (Leach, 1825)', turkishName: 'Akdeniz Cüce Yarasası', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'LC' },
  { id: 12, family: 'Vespertilionidae', scientificName: 'Pipistrellus nathusii (Keyserling & Blasius, 1839)', turkishName: 'Sertderili Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'LC' },
  { id: 13, family: 'Vespertilionidae', scientificName: 'Pipistrellus kuhlii (Kuhl, 1817)', turkishName: 'Beyazşeritli Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'LC' },
  { id: 14, family: 'Vespertilionidae', scientificName: 'Hypsugo savii (Bonaparte, 1837)', turkishName: 'Savi’nin Cüce Yarasası', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'LC' },
  { id: 15, family: 'Vespertilionidae', scientificName: 'Vespertilio murinus Linnaeus, 1758', turkishName: 'Çiftrenkli Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'NA' },
  { id: 16, family: 'Vespertilionidae', scientificName: 'Cnephaeus anatolicus Felten 1971', turkishName: 'Akdeniz Genişkanatlı Yarasası', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'DD', iucnMediterranean: '—' },
  { id: 17, family: 'Vespertilionidae', scientificName: 'Cnephaeus serotinus (Schreber, 1774)', turkishName: 'Geniş kanatlı Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'LC' },
  { id: 18, family: 'Vespertilionidae', scientificName: 'Barbastella barbastellus (Schreber, 1774)', turkishName: 'Basıkburunlu Yarasa', diet: 'Böcekçil', iucnGlobal: 'NT', iucnEurope: 'VU', iucnMediterranean: 'NT' },
  { id: 19, family: 'Vespertilionidae', scientificName: 'Plecotus austriacus (Fischer, 1829)', turkishName: 'Gri Uzunkulaklı Yarasa', diet: 'Böcekçil', iucnGlobal: 'NT', iucnEurope: '—', iucnMediterranean: 'NT' },
  { id: 20, family: 'Vespertilionidae', scientificName: 'Plecotus kolombatovici Đulić, 1980', turkishName: 'Balkan Uzunkulaklı Yarasası', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'VU', iucnMediterranean: '—' },
  { id: 21, family: 'Vespertilionidae', scientificName: 'Plecotus macrobullaris Kuzjakin, 1965', turkishName: 'Uzunkulaklı Kafkas Yarasası', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'NT', iucnMediterranean: 'NT' },
  { id: 22, family: 'Vespertilionidae', scientificName: 'Plecotus auritus (Linnaeus, 1758)', turkishName: 'Kahverengi Uzunkulaklı Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'LC' },
  { id: 23, family: 'Vespertilionidae', scientificName: 'Otonycteris hemprichii Peters, 1859', turkishName: 'Uzunkulaklı Çöl Yarasası', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: '—', iucnMediterranean: '—' },
  { id: 24, family: 'Vespertilionidae', scientificName: 'Myotis mystacinus (Kuhl, 1817)', turkishName: 'Bıyıklı Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'LC' },
  { id: 25, family: 'Vespertilionidae', scientificName: 'Myotis brandti (Eversmann, 1845)', turkishName: 'Sakallı Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: '—' },
  { id: 26, family: 'Vespertilionidae', scientificName: 'Myotis emarginatus (É. Geoffroy, 1806)', turkishName: 'Kirpikli Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'LC' },
  { id: 27, family: 'Vespertilionidae', scientificName: 'Myotis nattereri (Kuhl, 1817)', turkishName: 'Saçaklı Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: '—' },
  { id: 28, family: 'Vespertilionidae', scientificName: 'Myotis hoveli Harrison, 1964', turkishName: 'Hovelin Myotis', diet: 'Böcekçil', iucnGlobal: 'DD', iucnEurope: '—', iucnMediterranean: '—' },
  { id: 29, family: 'Vespertilionidae', scientificName: 'Myotis tschuliensis Kuzyakin, 1935', turkishName: 'Tschuli Myotis', diet: 'Böcekçil', iucnGlobal: 'DD', iucnEurope: '—', iucnMediterranean: '—' },
  { id: 30, family: 'Vespertilionidae', scientificName: 'Myotis bechsteini (Kuhl, 1817)', turkishName: 'Büyükkulaklı Yarasa', diet: 'Böcekçil', iucnGlobal: 'NT', iucnEurope: 'VU', iucnMediterranean: 'NT' },
  { id: 31, family: 'Vespertilionidae', scientificName: 'Myotis myotis (Borkhausen, 1797)', turkishName: 'Farekulaklı Büyük Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'LC' },
  { id: 32, family: 'Vespertilionidae', scientificName: 'Myotis blythii (Tomes, 1857)', turkishName: 'Farekulaklı Küçük Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'VU', iucnMediterranean: 'NT' },
  { id: 33, family: 'Vespertilionidae', scientificName: 'Myotis daubentoni (Kuhl, 1817)', turkishName: 'Farekulaklı Su Yarasası', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'LC' },
  { id: 34, family: 'Vespertilionidae', scientificName: 'Myotis alcathoe Von Helversen & Heller, 2001', turkishName: 'Balkan Bıyıklı Yarasası', diet: 'Böcekçil', iucnGlobal: 'DD', iucnEurope: 'NT', iucnMediterranean: 'DD' },
  { id: 35, family: 'Vespertilionidae', scientificName: 'Myotis schaubi Kormos, 1934', turkishName: 'İran Saçaklı Yarasası', diet: 'Böcekçil', iucnGlobal: 'DD', iucnEurope: '—', iucnMediterranean: 'DD' },
  { id: 36, family: 'Vespertilionidae', scientificName: 'Myotis nipalensis (Dobson, 1871)', turkishName: 'Nepal Bıyıklı Yarasası', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: '—', iucnMediterranean: 'NA' },
  { id: 37, family: 'Vespertilionidae', scientificName: 'Myotis capaccinii (Bonaparte, 1837)', turkishName: 'Uzunparmaklı Yarasa', diet: 'Böcekçil', iucnGlobal: 'VU', iucnEurope: 'VU', iucnMediterranean: 'VU' },
  // 4. Emballonuridae
  { id: 38, family: 'Emballonuridae', scientificName: 'Taphozous nudiventris (Cretzschmar, 1830)', turkishName: 'Çıplakkarınlı Mezar Yarasası', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: '—', iucnMediterranean: 'LC' },
  // 5. Miniopteridae
  { id: 39, family: 'Miniopteridae', scientificName: 'Miniopterus schreibersii (Kuhl, 1817)', turkishName: 'Uzunkanatlı Yarasa', diet: 'Böcekçil', iucnGlobal: 'VU', iucnEurope: 'VU', iucnMediterranean: 'VU' },
  // 6. Molossidae
  { id: 40, family: 'Molossidae', scientificName: 'Tadarida teniotis (Rafinesque, 1814)', turkishName: 'Kuyruklu Yarasa', diet: 'Böcekçil', iucnGlobal: 'LC', iucnEurope: 'LC', iucnMediterranean: 'LC' },
]


const batGallery: LightboxImage[] = [
  {
    src: '/image/yarasalar/yarasa-morfoloji-inceleme.webp',
    title: 'Morfolojik Yapı & Uçuş Zarı (Patagium) İncelemesi',
    tag: 'Morfoloji',
    date: '15 Mayıs 2026',
    caption: 'Araştırmacımız tarafından eldivenli, non-invasif protokollerle gerçekleştirilen kanat, başparmak ve kulak yapısı incelemesi.',
  },
  {
    src: '/image/yarasalar/gece-ucan-yarasalar.webp',
    title: 'Gece Uçuş Aktivitesi & Ekolokasyon',
    tag: 'Ekoloji',
    date: '29 Temmuz 2026',
    caption: 'Gün batımı sonrası avlanma rotasına çıkan böcekçil yarasa bireylerinin gece gökyüzündeki aktif hareketi.',
  },
  {
    src: '/image/yarasalar/magara-tunek-girisi.webp',
    title: 'Doğal Karstik Mağara Tünek Girişi',
    tag: 'Tünek Alanı',
    date: '19 Mayıs 2026',
    caption: 'Kırşehir çevresinde tespit edilen, yarasa kolonilerinin gündüz dinlenme ve kış uykusu için kullandığı mağara kanyonu.',
  },
  {
    src: '/image/yarasalar/magara-tunek-detay.webp',
    title: 'Mağara Tavanı Kaya Çatlağı Tünek Yuvası',
    tag: 'Mikrohabitat',
    date: '19 Mayıs 2026',
    caption: 'Mağara tavanındaki korunaklı kaya yarıkları; sabit sıcaklık ve nem dengesiyle koloni için hayati önem taşır.',
  },
  {
    src: '/image/yarasalar/yarasa-tunek-yakindan.webp',
    title: 'Doğal Tünekte Dinlenen Yarasa Bireyi',
    tag: 'Tür Gözlemi',
    date: '10 Şubat 2026',
    caption: 'Kış uykusu / gündüz dinlenmesi sırasında baş aşağı tutunmuş bireyin yakın çekim tünek kaydı.',
  },
  {
    src: '/image/yarasalar/yarasa-habitat-panoramik.webp',
    title: 'Beslenme ve Avlanma Sahası Panoraması',
    tag: 'Habitat',
    date: '28 Nisan 2026',
    caption: 'Yarasaların açık alan böcek avı gerçekleştirdiği nehir ve bozkır kesişim hattı geniş panoramik görünümü.',
  },
]


function renderIucnBadge(status: string) {
  const s = status.trim().toUpperCase()
  let bg = '#f0f0f0'
  let color = '#555'
  let isColored = false

  if (s === 'CR') {
    bg = '#fde8e8'
    color = '#e61b23'
    isColored = true
  } else if (s === 'EN') {
    bg = '#fdecd8'
    color = '#d9534f'
    isColored = true
  } else if (s === 'VU') {
    bg = '#fef3e2'
    color = '#f0ad4e'
    isColored = true
  } else if (s === 'NT') {
    bg = '#fef9e7'
    color = '#b78103'
    isColored = true
  } else if (s === 'LC') {
    bg = '#e8f5e9'
    color = '#27ae60'
    isColored = true
  } else {
    // DD, NA, — (renk vermene gerek yok)
    bg = '#f5f5f5'
    color = '#777'
  }

  return (
    <span
      style={{
        display: 'inline-block',
        minWidth: '32px',
        textAlign: 'center',
        padding: '2px 7px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: isColored ? 700 : 500,
        background: bg,
        color: color,
        border: isColored ? `1px solid ${color}33` : '1px solid #e0e0e0',
      }}
      title={s === 'CR' ? 'Kritik (CR)' : s === 'EN' ? 'Tehlikede (EN)' : s === 'VU' ? 'Hassas (VU)' : s === 'NT' ? 'Tehdide Yakın (NT)' : s === 'LC' ? 'Düşük Risk (LC)' : s === 'DD' ? 'Yetersiz Veri (DD)' : s === 'NA' ? 'Değerlendirmeye Uygun Değil (NA)' : 'Veri Yok'}
    >
      {status}
    </span>
  )
}

export default function Yarasalar() {
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null)
  const [speciesSearch, setSpeciesSearch] = useState('')
  const [showAllSpecies, setShowAllSpecies] = useState(false)

  const filteredSpecies = useMemo(() => {
    const q = speciesSearch.trim().toLowerCase()
    if (!q) return ALL_BAT_SPECIES
    return ALL_BAT_SPECIES.filter(s =>
      s.family.toLowerCase().includes(q) ||
      s.scientificName.toLowerCase().includes(q) ||
      s.turkishName.toLowerCase().includes(q)
    )
  }, [speciesSearch])

  const displayedSpecies = showAllSpecies ? filteredSpecies : filteredSpecies.slice(0, 5)

  return (
    <main className="main">
      <PageTitle
        title="Yarasalar Hakkında"
        subtitle="Ekolojik önemi, Türkiye faunası, tehditler ve yaygın yanılgılar"
        crumb="Yarasalar Hakkında"
        bg="/image/yarasalar/yarasa-habitat-panoramik.webp"
      />

      {/* ── GENEL BİYOLOJİ ── */}
      <section className="section">
        <div className="container" data-aos="fade-up">
          <div className="row gy-4 align-items-start">
            <div className="col-lg-8">
              <h2 className="content-title mb-4" style={{ color: '#e61b23' }}>
                Yarasalar — Gecenin Sessiz Memelileri
              </h2>
              <p>
                Yarasalar (Ordo: <em>Chiroptera</em>), aktif uçuş yeteneğine sahip tek memeli grubudur. Ön ekstremitelerin uzamış metakarp ve falanks kemikleri arasında gerilmiş ince bir uçuş zarının (<em>patagium</em>) oluşturduğu kanat yapısı, bu gruba özgü temel adaptasyondur. <em>Chiroptera</em> takımı, günümüzde tanımlanmış yaklaşık <strong>1.400 tür</strong> ile kemirgenlerden sonra en kalabalık ikinci memeli takımını oluşturmaktadır (Simmons, 2005). Bu tür zenginliği, yarasaların kutuplar ve bazı izole adalar dışında dünyanın her kıtasında yayılış göstermesini mümkün kılmaktadır.
              </p>
              <p>
                Beslenme ekolojisi açısından değerlendirildiğinde, dünya genelindeki yarasa türlerinin yaklaşık <strong>%70'i böcekçildir</strong>; geri kalan türler meyve, nektar, çiçek tozu, balık ve küçük omurgalılarla beslenmektedir (Simmons, 2005). Türkiye faunasındaki türlerin ise biri (<em>Rousettus aegyptiacus</em>) dışında tamamı böcekçildir. Tünek ekolojisi bakımından yarasalar yüksek esneklik sergilemekte; mağara, kaya yarığı, ağaç kovuğu ve bina çatılarını tünek alanı olarak kullanabilmektedir (Benda &amp; Horáček, 1998).
              </p>
              <p className="mb-0">
                Hibernasyon döneminde metabolizma hızı belirgin biçimde düşmekte, vücut sıcaklığı ortam sıcaklığına yaklaşmakta ve kalp atış hızı birkaç atım/dakikaya gerilemektedir. Bu fizyolojik adaptasyon, kış dönemini yetersiz enerji rezerviyle geçirebilmelerine olanak tanımaktadır.
              </p>
              <div className="mt-4">
                <div
                  className="rounded-4 overflow-hidden position-relative shadow hover-card"
                  onClick={() => setLightboxImage(batGallery[0])}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={batGallery[0].src}
                    alt={batGallery[0].title}
                    loading="lazy"
                    decoding="async"
                    className="img-fluid w-100"
                    style={{ maxHeight: '420px', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '14px 20px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)',
                      color: '#fff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span className="badge bg-danger me-2">Anatomik Yapı</span>
                      <strong style={{ fontSize: '14px' }}>Uçuş Zarı (Patagium) ve Morfoloji İncelemesi</strong>
                    </div>
                    <span className="text-danger small fw-semibold"><i className="bi bi-zoom-in" /> Büyüt</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="hover-card" style={card}>
                <h3 className="h5 mb-3" style={{ color: '#e61b23' }}>
                  <i className="bi bi-list-ul me-2" />Bu Sayfada
                </h3>
                <ul className="list-unstyled mb-0">
                  {[
                    { href: '#ekolojik', label: 'Ekosistem Hizmetleri' },
                    { href: '#turkiye', label: 'Türkiye Faunası' },
                    { href: '#tehditler', label: 'Tehditler ve Koruma' },
                    { href: '#yanilgilar', label: 'Yaygın Yanılgılar' },
                    { href: '#kaynakca', label: 'Kaynakça' },
                  ].map((item, i) => (
                    <li key={i}>
                      <a href={item.href}
                        style={{ color: '#1a1a1a', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f5e6e6', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#e61b23')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#1a1a1a')}>
                        <i className="bi bi-chevron-right mt-1" style={{ color: '#e61b23', fontSize: '12px', flexShrink: 0 }} />
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EKOSİSTEM HİZMETLERİ ── */}
      <section className="section light-background" id="ekolojik">
        <div className="container" data-aos="fade-up">
          <h2 className="content-title mb-2" style={{ color: '#e61b23' }}>Ekosistem Hizmetleri ve Koruma Biyolojisi</h2>
          <p className="text-muted mb-4">
            Yarasalar, insanlığa pek çok kritik ekosistem hizmeti sağlayan işlevsel bir memeli grubudur. Kunz ve ark. (2011), bu hizmetleri böcek baskısı, tozlaşma ve tohum dağılımı olmak üzere üç ana kategoride kapsamlı biçimde ele almıştır.
          </p>
          <div className="row gy-4">
            {[
              {
                icon: 'bi-bug',
                title: 'Biyolojik Böcek Kontrolü',
                text: 'Böcekçil yarasa türleri, tarımsal ve kentsel alanlarda önemli birer doğal zararlı düzenleyicisi olarak işlev görmektedir. Kunz ve ark. (2011), böcekçil yarasaların bir gecede vücut ağırlıklarının %70–100\'ü kadar böcek tüketebildiğini ortaya koymuştur. Bu biyolojik süpresyon, kimyasal pestisit kullanımını azaltma potansiyeli taşıması bakımından tarımsal sürdürülebilirlik açısından ekonomik değer taşımaktadır.'
              },
              {
                icon: 'bi-activity',
                title: 'Biyoindikatör Değeri',
                // GERİ BİLDİRİM 2: Detaylandırıldı
                text: 'Yarasalar; tür zenginliği, popülasyon yapısı ve aktivite düzeylerindeki değişimler aracılığıyla habitatın ekolojik kalitesinin güvenilir göstergesi niteliğindedir. Jones ve ark. (2009), yarasaların taksonomik kararlılıkları, izleme kolaylıkları ve geniş coğrafi dağılımları nedeniyle biyoindikatör olarak son derece uygun bir grup oluşturduğunu vurgulamıştır. Bu özellikler yarasaları; iklim değişikliğinin, habitat bozulmasının ve kentleşmenin biyotik topluluklara etkilerini uzun vadeli izlemede en güvenilir araçlardan biri hâline getirmektedir.'
              },
              {
                icon: 'bi-buildings',
                title: 'Kentsel Ekoloji Bağlamındaki Rolü',
                text: 'Russo & Ancillotto (2015), kentleşmenin yarasalar üzerindeki etkilerinin son derece türe özgü olduğunu; bazı türlerin kentsel habitatlarda tünek ve av alanı olanaklarından yararlanırken, pek çoğunun habitat kaybı, parçalanma ve kentsel kirlilikten olumsuz etkilendiğini göstermiştir. Kentsel alanlarda azalan tür zenginliği ve değişen topluluk yapısı, bu habitatları yarasalar için önemli bir izleme ve koruma önceliği hâline getirmektedir.'
              },
            ].map((item, i) => (
              <div key={i} className="col-lg-4">
                <div className="hover-card h-100" style={card}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div style={{ width: 44, height: 44, background: '#f5e6e6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`bi ${item.icon} fs-4`} style={{ color: '#e61b23' }} />
                    </div>
                    <h5 className="mb-0" style={{ color: '#1a1a1a' }}>{item.title}</h5>
                  </div>
                  <p className="mb-0 text-muted" style={{ fontSize: '14px', lineHeight: '1.7' }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div
              className="rounded-4 overflow-hidden position-relative shadow hover-card"
              onClick={() => setLightboxImage(batGallery[1])}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={batGallery[1].src}
                alt={batGallery[1].title}
                loading="lazy"
                decoding="async"
                className="img-fluid w-100"
                style={{ maxHeight: '380px', objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '14px 20px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)',
                  color: '#fff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span className="badge bg-danger me-2">Ekolojik Rol</span>
                  <strong style={{ fontSize: '14px' }}>Gece Uçuş Aktivitesi &amp; Biyolojik Zararlı Böcek Avı</strong>
                </div>
                <span className="text-danger small fw-semibold"><i className="bi bi-zoom-in" /> Büyüt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TÜRKİYE FAUNASI ── */}
      <section className="section" id="turkiye">
        <div className="container" data-aos="fade-up">
          <h2 className="content-title mb-2" style={{ color: '#e61b23' }}>Türkiye Chiroptera Faunası</h2>

          {/* Üst — açıklama + istatistik kartları */}
          <div className="row gy-4 mb-4">
            <div className="col-lg-8">
              <p>
                Türkiye, Palearktik, Etyopik ve Orta Doğu faunalarının kesişim noktasındaki biyocoğrafi konumu sayesinde zengin bir <em>Chiroptera</em> çeşitliliğine sahiptir. Benda &amp; Horáček (1998), Doğu Akdeniz yarasalarına ilişkin kapsamlı revizyonlarında Türkiye'nin bu bölge içindeki faunistik önemini detaylı biçimde ortaya koymuştur.
              </p>
              <div className="p-3 rounded-3 mb-3" style={{ background: '#f5e6e6', borderLeft: '4px solid #e61b23' }}>
                <p className="mb-0" style={{ fontSize: '14px' }}>
                  <i className="bi bi-info-circle me-2" style={{ color: '#e61b23' }} />
                  Güncel değerlendirmelere göre ülkemizde <strong>40 yarasa türü</strong> yayılış göstermekte olup bu türlerin büyük çoğunluğu Rhinolophidae ve Vespertilionidae familyalarına aittir (Özkurt ve Bulut, 2020).
                </p>
              </div>
              <div className="p-3 rounded-3" style={{ background: '#fff', border: '1px solid #f0e0e0' }}>
                <h6 className="mb-2" style={{ color: '#1a1a1a', fontWeight: 600 }}>
                  <i className="bi bi-geo-alt me-2" style={{ color: '#e61b23' }} />İç Anadolu'da Yarasa Araştırmaları
                </h6>
                <p className="mb-0 text-muted" style={{ fontSize: '14px', lineHeight: '1.7' }}>
                  İç Anadolu Bölgesi yarasa faunasına yönelik sınırlı sayıda çalışma mevcuttur. Karataş &amp; Sözen (2006), Orta Anadolu'daki Kızılırmak havzasının orta ve yukarı kesimlerinde yürüttükleri araştırmada <strong>İç Anadolu'nun yarasa çeşitliliği açısından yeterince araştırılmadığına</strong> dikkat çekmiştir. Kırşehir ili de bu coğrafi ve literatür boşluğu içinde yer almakta olup topluluğumuzun kentsel izleme çalışmaları bu eksikliğin giderilmesine sistematik bir katkı sağlamayı hedeflemektedir.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="d-flex flex-column gap-3 h-100">
                {[
                  { num: '40', label: 'Kayıtlı Tür', sub: 'Türkiye Chiroptera Faunası', icon: 'bi-collection' },
                  { num: '6', label: 'Familya', sub: 'Pteropodidae, Rhinolophidae, Vespertilionidae, Emballonuridae, Miniopteridae, Molossidae', icon: 'bi-diagram-3' },
                  { num: '%97', label: 'Böcekçil', sub: <>Yalnızca 1 tür meyve yer (<em>Rousettus aegyptiacus</em>)</>, icon: 'bi-bug' },
                  { num: '5', label: 'Koruma Altında', sub: 'EN + VU + NT statüsünde tür', icon: 'bi-shield-check' },
                ].map((item, i) => (
                  <div key={i} className="hover-card d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: '#1a1a1a', flex: 1 }}>
                    <div style={{ width: 48, height: 48, background: '#e61b23', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`bi ${item.icon}`} style={{ color: '#fff', fontSize: '20px' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{item.num}</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#f5e6e6' }}>{item.label}</div>
                      <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Familya kartları */}
          <div className="row gy-3 mb-4">
            {[
              { fam: 'Pteropodidae', icon: 'bi-flower1', renk: '#8e44ad', ozellik: 'Meyve ve nektar beslenimi; gündüz görüşü', turler: 'Rousettus aegyptiacus (tek meyve yarasası)' },
              { fam: 'Rhinolophidae', icon: 'bi-soundwave', renk: '#e61b23', ozellik: 'Geniş bantlı CF ekolokasyon; karakteristik burun çıkıntısı', turler: 'R. ferrumequinum, R. hipposideros, R. euryale, R. mehelyi, R. blasii' },
              { fam: 'Vespertilionidae', icon: 'bi-collection-fill', renk: '#2d6a2d', ozellik: 'En geniş familya; farklı habitat tercihleri (31 tür)', turler: 'Myotis spp., Pipistrellus spp., Nyctalus spp., Plecotus spp.' },
              { fam: 'Emballonuridae', icon: 'bi-shield', renk: '#16a085', ozellik: 'Çıplak kuyruk ucu; tarihi yapılar ve çatlaklar', turler: 'Taphozous nudiventris' },
              { fam: 'Miniopteridae', icon: 'bi-wind', renk: '#e67e22', ozellik: 'Uzun kanat; mağaralarda büyük koloniler', turler: 'Miniopterus schreibersii' },
              { fam: 'Molossidae', icon: 'bi-lightning', renk: '#2980b9', ozellik: 'Serbest kuyruk; yüksek irtifada hızlı uçuş', turler: 'Tadarida teniotis' },
            ].map((item, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="hover-card h-100 p-3 rounded-3" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: `3px solid ${item.renk}` }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className={`bi ${item.icon}`} style={{ color: item.renk, fontSize: '18px' }} />
                    <span style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '14px' }}>{item.fam}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px', lineHeight: '1.5' }}>{item.ozellik}</p>
                  <p style={{ fontSize: '12px', color: '#555', fontStyle: 'italic', margin: 0 }}>{item.turler}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tam tür listesi — Arama & 5'li Gösterim / Hepsini Gör */}
          <div className="hover-card" style={card}>
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-3">
              <div>
                <h5 className="mb-1" style={{ color: '#e61b23', fontWeight: 700 }}>
                  <i className="bi bi-list-ul me-2" />Türkiye'nin Tüm Yarasa Türleri
                </h5>
                <span style={{ fontSize: '12px', color: '#888' }}>Özkurt ve Bulut (2020)</span>
              </div>

              {/* Arama Kutusu */}
              <div className="position-relative" style={{ minWidth: '280px', maxWidth: '360px', width: '100%' }}>
                <i
                  className="bi bi-search position-absolute"
                  style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '14px', pointerEvents: 'none' }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tür adı veya familya ara..."
                  value={speciesSearch}
                  onChange={(e) => setSpeciesSearch(e.target.value)}
                  style={{
                    paddingLeft: '38px',
                    paddingRight: speciesSearch ? '38px' : '14px',
                    borderRadius: '50px',
                    fontSize: '13px',
                    borderColor: '#ddd',
                    background: '#fcfcfc',
                  }}
                />
                {speciesSearch && (
                  <button
                    type="button"
                    className="btn btn-link position-absolute p-0 text-secondary"
                    onClick={() => setSpeciesSearch('')}
                    title="Temizle"
                    style={{ right: '12px', top: '50%', transform: 'translateY(-50%)', textDecoration: 'none' }}
                  >
                    <i className="bi bi-x-circle-fill" style={{ fontSize: '15px', color: '#888' }} />
                  </button>
                )}
              </div>
            </div>

            {/* Arama veya Liste Durum Bilgisi */}
            <div className="d-flex align-items-center justify-content-between mb-2 px-1" style={{ fontSize: '12px', color: '#666' }}>
              <span>
                {speciesSearch ? (
                  <>
                    <strong>"{speciesSearch}"</strong> araması için <strong>{filteredSpecies.length}</strong> tür bulundu.
                  </>
                ) : (
                  <>
                    Türkiye'de kayıtlı toplam <strong>{ALL_BAT_SPECIES.length}</strong> tür bulunmaktadır.
                  </>
                )}
              </span>
              <span>
                Gösterilen: <strong>{displayedSpecies.length}</strong> / {filteredSpecies.length}
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0" style={{ fontSize: '13px' }}>
                <thead style={{ background: '#1a1a1a', color: '#fff' }}>
                  <tr>
                    <th style={{ padding: '10px 10px', width: '40px', textAlign: 'center' }}>#</th>
                    <th style={{ padding: '10px 12px' }}>Familya</th>
                    <th style={{ padding: '10px 12px' }}>Bilimsel Adı</th>
                    <th style={{ padding: '10px 12px' }}>Türkçe Adı</th>
                    <th style={{ padding: '10px 10px', textAlign: 'center' }}>Beslenme</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center' }}>Global</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center' }}>Avrupa</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center' }}>Akdeniz</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedSpecies.length > 0 ? (
                    displayedSpecies.map((row, i) => (
                      <tr key={row.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding: '9px 10px', textAlign: 'center', color: '#aaa', fontSize: '12px', fontWeight: 600 }}>{row.id}</td>
                        <td style={{ padding: '9px 12px', color: '#777', fontSize: '12px', fontWeight: 600 }}>{row.family}</td>
                        <td style={{ padding: '9px 12px', fontStyle: 'italic', color: '#1a1a1a', fontWeight: 500 }}>{row.scientificName}</td>
                        <td style={{ padding: '9px 12px', color: '#333' }}>{row.turkishName}</td>
                        <td style={{ padding: '9px 10px', textAlign: 'center' }}>
                          <span style={{ background: row.diet === 'Meyve' ? '#f5e6e6' : '#e8f5e9', color: row.diet === 'Meyve' ? '#e61b23' : '#27ae60', padding: '3px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 600 }}>
                            {row.diet}
                          </span>
                        </td>
                        <td style={{ padding: '9px 8px', textAlign: 'center' }}>{renderIucnBadge(row.iucnGlobal)}</td>
                        <td style={{ padding: '9px 8px', textAlign: 'center' }}>{renderIucnBadge(row.iucnEurope)}</td>
                        <td style={{ padding: '9px 8px', textAlign: 'center' }}>{renderIucnBadge(row.iucnMediterranean)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-4">
                        <div className="d-flex flex-column align-items-center justify-content-center text-muted">
                          <i className="bi bi-search mb-2" style={{ fontSize: '24px', color: '#bbb' }} />
                          <p className="mb-2" style={{ fontSize: '14px', color: '#555' }}>
                            "{speciesSearch}" aramasıyla eşleşen yarasa türü bulunamadı.
                          </p>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setSpeciesSearch('')}
                            style={{ borderRadius: '50px', fontSize: '12px', padding: '4px 16px' }}
                          >
                            Aramayı Temizle
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* IUCN Sıralama & Açıklama Notu */}
            <div className="p-3 mt-3 rounded-2" style={{ background: '#fdf8f8', border: '1px solid #f0e0e0', fontSize: '12px', color: '#555' }}>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <strong style={{ color: '#1a1a1a' }}>IUCN Tehdit Sıralaması:</strong>
                <span className="badge bg-danger">CR (Kritik)</span>
                <span>&gt;</span>
                <span className="badge" style={{ background: '#d9534f', color: '#fff' }}>EN (Tehlikede)</span>
                <span>&gt;</span>
                <span className="badge" style={{ background: '#f0ad4e', color: '#fff' }}>VU (Hassas)</span>
                <span>&gt;</span>
                <span className="badge" style={{ background: '#b78103', color: '#fff' }}>NT (Tehdide Yakın)</span>
                <span>&gt;</span>
                <span className="badge" style={{ background: '#27ae60', color: '#fff' }}>LC (Düşük Risk)</span>
              </div>
              <div className="text-muted" style={{ fontSize: '11.5px', marginTop: '4px' }}>
                DD (Data Deficient): Yetersiz Veri · NA (Not Applicable): Değerlendirmeye Uygun Değil · —: Veri Yok
              </div>
            </div>

            {/* Hepsini Gör / Daha Az Göster Butonu */}
            {filteredSpecies.length > 5 && (
              <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 pt-3 mt-2 border-top">
                <span style={{ fontSize: '13px', color: '#666' }}>
                  {showAllSpecies
                    ? `Tüm ${filteredSpecies.length} tür listeleniyor.`
                    : `${filteredSpecies.length} tür arasından ilk 5 tanesi listeleniyor.`}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllSpecies(!showAllSpecies)}
                  className="btn d-inline-flex align-items-center gap-2 fw-semibold px-4 py-2"
                  style={{
                    borderRadius: '50px',
                    fontSize: '13px',
                    transition: 'all 0.25s ease',
                    border: '1.5px solid #e61b23',
                    background: showAllSpecies ? 'transparent' : '#e61b23',
                    color: showAllSpecies ? '#e61b23' : '#ffffff',
                  }}
                  onMouseEnter={(e) => {
                    if (showAllSpecies) {
                      e.currentTarget.style.background = '#e61b23'
                      e.currentTarget.style.color = '#fff'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (showAllSpecies) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#e61b23'
                    }
                  }}
                >
                  <span>{showAllSpecies ? 'Daha Az Göster (İlk 5 Tür)' : `Hepsini Gör (${filteredSpecies.length} Tür)`}</span>
                  <i className={`bi ${showAllSpecies ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                </button>
              </div>
            )}

            {/* IUCN Açıklamaları */}
            <div className="d-flex flex-wrap gap-3 mt-3 p-3 rounded-2" style={{ background: '#f8f8f8', fontSize: '12px' }}>
              <span><strong>IUCN:</strong></span>
              {[['LC','#2d6a2d','#e8f5e9','En Az Endişe'],['NT','#f39c12','#fef9e7','Tehdide Yakın'],['VU','#e67e22','#fef3e2','Hassas'],['EN','#c0392b','#fdecea','Tehlikede']].map(([code,color,bg,label])=>(
                <span key={code} style={{ background:bg,color:color,padding:'2px 10px',borderRadius:'50px',fontWeight:600 }}>
                  {code} = {label}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── TEHDİTLER      {/* ── TEHDİTLER VE KORUMA ── */}
      <section className="section light-background" id="tehditler">
        <div className="container" data-aos="fade-up">
          <h2 className="content-title mb-4" style={{ color: '#e61b23' }}>Yarasa Popülasyonlarını Tehdit Eden Etkenler</h2>
          <div className="row gy-4">
            {[
              {
                icon: 'bi-buildings',
                title: 'Habitat Kaybı ve Kentsel Dönüşüm',
                text: 'Kentleşme süreci, yarasaların tünek alanlarını ve av alanlarını doğrudan etkilemektedir. Russo & Ancillotto (2015), kentleşmenin genel örüntüsünün kentsel alana duyarlı türlerin azalması ile sınırlı sayıda kentsel toleranslı türün baskın hale gelmesi biçiminde tezahür ettiğini ortaya koymuştur. Bu dönüşüm topluluk çeşitliliğini önemli ölçüde azaltmaktadır.'
              },
              {
                icon: 'bi-lightbulb',
                title: 'Yapay Aydınlatma',
                text: 'Gece aktif böceklerin ve yarasaların ekolojisini doğrudan etkileyen yapay aydınlatma, kentsel habitatlarda giderek artan bir tehdit unsuru hâline gelmiştir. Stone ve ark. (2009), sokak aydınlatmasının yarasaların günlük hareket güzergâhlarını bozduğunu deneysel olarak kanıtlamıştır. Işıktan kaçınan türlerin beslenme ve dolaşım davranışları ciddi ölçüde sekteye uğrayabilmektedir.'
              },
              {
                icon: 'bi-shield-check',
                title: 'Yasal Koruma Çerçevesi',
                // GERİ BİLDİRİM 3: Yasal yaptırım ifadesi eklendi
                text: 'Türkiye\'de tüm yarasa türleri; 2872 sayılı Çevre Kanunu ve 4915 sayılı Kara Avcılığı Kanunu kapsamında koruma altındadır. Kasıtlı yakalama, öldürme ve tünek alanlarının tahrip edilmesi yasal yaptırıma tabidir. Bilimsel araştırmalar için T.C. Tarım ve Orman Bakanlığı DKMP Genel Müdürlüğü\'nden izin alınması zorunludur. Uluslararası alanda ise pek çok Avrupa yarasa türü, Avrupa Yarasa Koruma Anlaşması (EUROBATS) kapsamında güvence altındadır.'
              },
            ].map((item, i) => (
              <div key={i} className="col-lg-4">
                <div className="hover-card h-100" style={card}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div style={{ width: 44, height: 44, background: '#f5e6e6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`bi ${item.icon} fs-4`} style={{ color: '#e61b23' }} />
                    </div>
                    <h5 className="mb-0" style={{ color: '#1a1a1a' }}>{item.title}</h5>
                  </div>
                  <p className="mb-0 text-muted" style={{ fontSize: '14px', lineHeight: '1.7' }}>{item.text}</p>
                </div>
              </div>
            ))}
            <div className="col-12">
              <img src="/image/slider2.webp" alt="Tehditler" loading="lazy" decoding="async" className="img-fluid rounded-4 shadow-sm w-100" />
            </div>
          </div>
        </div>
      </section>

      {/* ── YAYGIN YANILGILAR ── */}
      <section className="section" id="yanilgilar">
        <div className="container" data-aos="fade-up">
          <h2 className="content-title mb-2" style={{ color: '#e61b23' }}>Yarasalar Hakkında Bilimsel Gerçekler</h2>
          <p className="text-muted mb-2">
            Yarasalar tarihsel süreçte pek çok kültürde yanlış algılanmış; bu durum tür ve habitat koruma çabalarını olumsuz etkilemiştir. Jones ve ark. (2009), yanlış kamusal algının koruma politikaları üzerindeki olumsuz etkisine dikkat çekerek bilimsel iletişimin önemine vurgu yapmıştır.
          </p>

          {/* Neden zarar vermez — giriş */}
          <div className="p-4 rounded-3 mb-4" style={{ background: '#f5e6e6', borderLeft: '4px solid #e61b23' }}>
            <h5 style={{ color: '#e61b23', marginBottom: '8px' }}>Yarasalar Neden Bize Zarar Vermez?</h5>
            <p className="mb-2" style={{ fontSize: '14px', color: '#1a1a1a' }}>
              Yarasalar hakkında en yaygın endişe, bize zarar verecekleri, kan emdikleri korkusudur. Bu endişe büyük ölçüde yanlış bilgilere ve eski inanışlara dayanır. <strong>Türkiye'de yaşayan hiçbir yarasa türü kan emmez.</strong> Bilimsel veriler bize başka bir şey söylüyor: Yarasalar bir gecede 3.000 ila 4.000 adet böcek yiyerek ekolojik kontrolörlerdir. Ayrıca doğru anlaşıldığında insanlardan kaçınan, son derece hassas ekolojik paydaşlarımızdır.
            </p>
            <p className="mb-0" style={{ fontSize: '14px', color: '#555' }}>
              Halk arasında yarasaların kan emdiğine dair yaygın bir inanış vardır. Bu, Hollywood ve yabancı film ve dizi kaynaklı bir yanılgıdır. Dünyada gerçekten kanla beslenen yalnızca <strong>3 yarasa türü</strong> vardır, hepsi de Orta ve Güney Amerika'da yaşar (vampir yarasaları — <em>Desmodontinae</em>). Türkiye'deki 40 türün hiçbiri kan emmez; 39'u böcek yer, 1'i (<em>Rousettus aegyptiacus</em>) meyve yer (Özkurt ve Bulut, 2020).
            </p>
          </div>

          {/* Hastalık riskleri */}
          <div className="row gy-4 mb-4">
            <div className="col-lg-6">
              <div className="hover-card h-100" style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h5 style={{ color: '#e61b23', marginBottom: '12px' }}>
                  <i className="bi bi-shield-exclamation me-2" />Hastalık: Riskler ve Gerçekler
                </h5>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '12px' }}>
                  Tüm yabani memeli hayvanlar gibi (kedi-köpek-sincap vb.) yarasalar da bazı patojenleri taşıyabilir. Ancak iki şeyi netleştirmek önemlidir:
                </p>
                <div className="d-flex align-items-start gap-2 mb-3">
                  <span style={{ background: '#e61b23', color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>1</span>
                  <p style={{ fontSize: '14px', color: '#555', margin: 0, lineHeight: '1.6' }}>
                    <strong>Yarasalar agresif değildir.</strong> Sağlıklı bir yarasa insandan kaçar; saldırmaz. Bir yarasanın size çarpması veya eve girmesi, yön kaybetmiş olduğu anlamına gelir, saldırı değil.
                  </p>
                </div>
                <div className="d-flex align-items-start gap-2">
                  <span style={{ background: '#e61b23', color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>2</span>
                  <p style={{ fontSize: '14px', color: '#555', margin: 0, lineHeight: '1.6' }}>
                    Sadece bir yarasaya <strong>çıplak elle dokunmak veya ısırılmak</strong> risk oluşturur. Yarasayı görmek, üstünüzden uçması, evinizin çatısında olması — bunlar hastalık riski yaratmaz (Calisher ve ark., 2006; Rocha ve ark., 2021).
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hover-card h-100" style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h5 style={{ color: '#e61b23', marginBottom: '12px' }}>
                  <i className="bi bi-soundwave me-2" />Echolocation: Saçınıza Takılmaları İmkânsız
                </h5>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '12px' }}>
                  Yarasalar, çevrelerini görmek için ultrasonik ses dalgaları yayan ve yansıyan sesleri analiz eden bir sistem kullanır: <strong>echolocation</strong> (yankıyla yer bulma). Bu sistem o kadar hassastır ki bir yarasa karanlıkta uçan bir sineği veya <strong>0,1 mm kalınlığındaki bir teli</strong> ayırt edebilir (Griffin, 1958; Boyles vd., 2011).
                </p>
                <div style={{ background: '#f5e6e6', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#1a1a1a' }}>
                  <i className="bi bi-info-circle me-2" style={{ color: '#e61b23' }} />
                  Saçınızdaki bir telden <strong>bin kat daha küçük</strong> cisimleri fark eden bir canlının saçınıza takılması fizyolojik olarak imkânsızdır.
                </div>
              </div>
            </div>
          </div>

          {/* Yanılgılar tablosu — 7 yanılgı */}
          <h5 className="mb-3" style={{ color: '#1a1a1a' }}>Doğru Bilinen Yanlışlar</h5>
          <div className="row gy-3">
            {[
              {
                yanilgi: '"Saçınıza takılır, ısırır"',
                gercek: 'Yarasalar mükemmel echolocation yeteneğine sahiptir; bir saç telinden çok daha küçük cisimleri ayırt edebilirler. Saçınıza takılmaları fiziksel olarak mümkün değildir (Griffin, 1958).'
              },
              {
                yanilgi: '"Hepsi kuduz taşır"',
                gercek: 'Yabani yarasa popülasyonlarında kuduz taşıma ihtimali söz konusu olabilir. Ancak kuduz teması ancak doğrudan ısırılma veya tırmalanma ile oluşur. Yarasayı görmek, üstünüzden uçması veya evinizin çatısında yaşaması risk oluşturmaz (Calisher ve ark., 2006; Constantine, 2009). Evinize girdiğinde ışıkları kapatın, pencereleri açın; dış aydınlığa doğru kendiliğinden çıkış yolunu bulur.'
              },
              {
                yanilgi: '"Kanla beslenir"',
                gercek: 'Türkiye\'de yaşayan 40 yarasa türünden hiçbiri kan emmez. 39\'u böcekçil, 1\'i (Mısır meyve yarasası) meyve yer. Dünyada gerçekten kanla beslenen sadece 3 tür vardır — hepsi Latin Amerika\'ya özgü Desmodontinae alt familyasına aittir: Desmodus rotundus, Diphylla ecaudata ve Diaemus youngi (Greenhall & Schmidt, 1988; Brown & Escobar, 2023).'
              },
              {
                yanilgi: '"Görmezler, kördürler"',
                gercek: 'Yarasaların görmesi gayet iyidir. Hatta meyve yarasaları gündüz görüşüne sahiptir. Echolocation ek bir yetenektir, görmemenin telafisi değildir. "Yarasa kadar kör" deyimi bilimsel temele dayanmaz (Eklöf, 2003).'
              },
              {
                yanilgi: '"Saldırgan ve agresiftir"',
                gercek: 'Yarasalar son derece çekingen hayvanlardır. İnsandan kaçarlar; saldırmazlar. Yarasanın evinize girmesi yön kaybetmesinden kaynaklanır — bir tehdit değil, kazadır.'
              },
              {
                yanilgi: '"Pis ve zararlıdır"',
                gercek: 'Yarasalar günde saatlerce tüylerini temizler — kediler kadar titiz hayvanlardır. Tarım zararlılarını kontrol ederek tarım sektörüne yıllık milyarlarca dolar değerinde hizmet sağlarlar (Boyles ve ark., 2011).'
              },
              {
                yanilgi: '"Şeytani / uğursuzdur"',
                gercek: 'Bu inanış kültürel ve folklorik bir miras olup bilimsel hiçbir karşılığı yoktur. Birçok kültürde yarasa uzun ömür, bilgelik ve şansın simgesidir (örn. Çin geleneği).'
              },
            ].map((row, i) => (
              <div key={i} className="col-12">
                <div className="hover-card d-flex align-items-start gap-4 p-4 rounded-3" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-2"
                    style={{ width: 44, height: 44, background: '#f5e6e6', minWidth: 44 }}>
                    <i className="bi bi-x-circle fs-5" style={{ color: '#e61b23' }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold mb-1" style={{ color: '#1a1a1a' }}>
                      <span style={{ color: '#e61b23', marginRight: 6 }}>Yanılgı:</span>{row.yanilgi}
                    </div>
                    <div style={{ color: '#555', fontSize: '14px' }}>
                      <i className="bi bi-check-circle me-2" style={{ color: '#2d6a2d' }} />
                      <strong>Bilimsel Gerçek:</strong> {row.gercek}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KARŞILAŞTIĞINIZDA NE YAPMALI ── */}
      <section className="section light-background">
        <div className="container" data-aos="fade-up">
          <h2 className="content-title mb-4" style={{ color: '#e61b23' }}>
            <i className="bi bi-question-circle me-2" />Yarasa ile Karşılaştığınızda Ne Yapmalısınız?
          </h2>
          <div className="row gy-4">
            <div className="col-lg-6">
              <div className="hover-card p-4 rounded-3 h-100" style={{ background: '#d4edda', border: '1px solid #c3e6cb' }}>
                <h5 className="mb-3" style={{ color: '#2d6a2d' }}>
                  <i className="bi bi-check-circle-fill me-2" />Yapılması Gerekenler ✓
                </h5>
                <ul className="list-unstyled mb-0">
                  {[
                    'Sakin olun. Yarasalar saldırgan değildir. Çoğu zaman size değil, yön kaybetmiş kendine bir çıkış arar.',
                    'Pencereleri açın. Eve giren bir yarasanın çıkmasına izin verin. Işıkları söndürün; dış aydınlığa doğru yönelir.',
                    'Tünek alanı gördüyseniz konumu not edin ve bizimle iletişime geçin. Bu çok değerli bilimsel veridir.',
                    'Yaralı veya yere düşmüş yarasa için kalın eldiven kullanın, yarasayı kapaklı bir kutuya alın ve veteriner ya da yetkili kuruma ulaştırın.',
                  ].map((item, i) => (
                    <li key={i} className="d-flex align-items-start gap-2 mb-3">
                      <i className="bi bi-check2 mt-1 flex-shrink-0" style={{ color: '#2d6a2d', fontWeight: 700 }} />
                      <span style={{ fontSize: '14px', color: '#1a1a1a' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hover-card p-4 rounded-3 h-100" style={{ background: '#fff5f5', border: '1px solid #fcc' }}>
                <h5 className="mb-3" style={{ color: '#e61b23' }}>
                  <i className="bi bi-x-circle-fill me-2" />Yapılmaması Gerekenler ✗
                </h5>
                <ul className="list-unstyled mb-0">
                  {[
                    'Çıplak elle dokunmayın. Tüm yabani memeliler gibi yarasaya da eldivensiz dokunulmaz.',
                    'Tüneği bozmayın, kapatmayın. Çatı arası, baca veya ağaç kovuğundaki tüneklere müdahale etmek yasal yaptırıma tabidir (4915 sayılı Kanun).',
                    'Su veya kimyasal sıkmayın. Yarasayı korkutmaya, uzaklaştırmaya çalışmayın.',
                    'Öldürmeyin. Türkiye\'de tüm yarasa türleri yasalarla koruma altındadır. Öldürmek cezai yaptırıma tabidir.',
                  ].map((item, i) => (
                    <li key={i} className="d-flex align-items-start gap-2 mb-3">
                      <i className="bi bi-x-lg mt-1 flex-shrink-0" style={{ color: '#e61b23', fontWeight: 700 }} />
                      <span style={{ fontSize: '14px', color: '#1a1a1a' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tünek fotoğrafları */}
          <div className="row gy-3 mt-2">
            <div className="col-12">
              <p className="text-muted small mb-3">
                <i className="bi bi-camera me-1" style={{ color: '#e61b23' }} />
                Kırşehir'de tespit edilen tünek alanlarından örnekler:
              </p>
            </div>
            {[
              { item: batGallery[2], title: 'Eski Yapılarda Tünek Kontrolü', loc: 'Eski yapılarda tünek kontrolü' },
              { item: batGallery[3], title: 'Tarihi Yapılarda Tünek ve Koloni Kontrolleri', loc: 'Tarihi yapılarda tünek ve koloni kontrolleri' },
              { item: batGallery[4], title: 'Doğal Mağara Tüneği – Kış Kolonisi', loc: 'Doğal Mağara Tüneği – Kış Kolonisi' },
            ].map((p, i) => (
              <div key={i} className="col-lg-4">
                <div
                  className="hover-card rounded-3 overflow-hidden position-relative shadow-sm"
                  onClick={() => setLightboxImage(p.item)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={p.item.src} alt={p.title} loading="lazy" decoding="async" className="img-fluid w-100" style={{ height: '220px', objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '10px 14px', background: '#1a1a1a', color: '#fff', fontSize: '12px' }} className="d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-geo-alt me-1 text-danger" />{p.loc}</span>
                    <span className="text-danger fw-semibold"><i className="bi bi-zoom-in" /> Büyüt</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOĞAL HABİTAT VE TÜR İNCELEME GALERİSİ ── */}
      <section className="section" style={{ background: '#0e1014', color: '#fff', padding: '80px 0' }}>
        <div className="container" data-aos="fade-up">
          <div className="text-center mb-5">
            <span className="badge bg-danger px-3 py-1 mb-2 text-uppercase fw-semibold" style={{ letterSpacing: '1px' }}>
              <i className="bi bi-camera-fill me-1" />FOTOĞRAF ARŞİVİ
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#fff' }}>
              Yarasa Biyolojisi ve Doğal Habitat Görselleri
            </h2>
            <p className="text-white-50" style={{ maxWidth: '640px', margin: '0 auto', fontSize: '15px' }}>
              Morfolojik incelemelerden doğal mağara tünellerine, gece uçuşlarından açık alan beslenme sahalarına kadar tür ve yaşam alanı kayıtları.
            </p>
          </div>

          <div className="row g-4">
            {batGallery.map((item, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <div
                  className="rounded-4 overflow-hidden position-relative hover-card"
                  onClick={() => setLightboxImage(item)}
                  style={{
                    cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: '#161920',
                    height: '260px',
                    position: 'relative',
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '20px',
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-danger text-uppercase" style={{ fontSize: '10px' }}>{item.tag}</span>
                      <span className="text-white-50 small"><i className="bi bi-calendar3 me-1" />{item.date}</span>
                    </div>
                    <h5 style={{ color: '#fff', fontSize: '15px', fontWeight: 600, margin: '2px 0 0' }}>
                      {item.title}
                    </h5>
                    <div className="mt-2 text-danger small fw-semibold d-flex align-items-center gap-1">
                      <i className="bi bi-zoom-in" /> Büyüt &amp; İncele
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KAYNAKÇA ── */}
      <section className="section light-background" id="kaynakca">
        <div className="container" data-aos="fade-up">
          <h2 className="content-title mb-4" style={{ color: '#e61b23' }}>
            <i className="bi bi-journal-bookmark me-2" />Kaynakça
          </h2>
          <div className="hover-card p-4 rounded-3" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <ul className="list-unstyled mb-0">
              {[
                { ref: 'Albayrak, I. (2003).', title: 'The bats of the eastern Black Sea region in Turkey (Mammalia: Chiroptera).', journal: 'Turkish Journal of Zoology', detail: '27(4): 269–273.' },
                { ref: 'Benda, P. & Horáček, I. (1998).', title: 'Bats (Mammalia: Chiroptera) of the Eastern Mediterranean. Part 1: Review of distribution and taxonomy of bats in Turkey.', journal: 'Acta Societatis Zoologicae Bohemicae', detail: '62: 255–313.' },
                { ref: 'Boyles, J.G., Cryan, P.M., McCracken, G.F. & Kunz, T.H. (2011).', title: 'Economic importance of bats in agriculture.', journal: 'Science', detail: '332(6025): 41–42.' },
                { ref: 'Brown, N. & Escobar, L.E. (2023).', title: 'A review of the diet of the common vampire bat (Desmodus rotundus) in the context of anthropogenic change.', journal: 'Mammalian Biology', detail: '103(4): 433–453.' },
                { ref: 'Calisher, C.H., Childs, J.E., Field, H.E., Holmes, K.V. & Schountz, T. (2006).', title: 'Bats: important reservoir hosts of emerging viruses.', journal: 'Clinical Microbiology Reviews', detail: '19(3): 531–545.', doi: 'https://doi.org/10.1128/CMR.00017-06' },
                { ref: 'Constantine, D.G. (2009).', title: 'Bat rabies and other lyssavirus infections.', journal: 'U.S. Geological Survey Circular', detail: '1329, Reston, Virginia, 68 pp.' },
                { ref: 'Eklöf, J. (2003).', title: 'Vision in Echolocating Bats.', journal: 'PhD Thesis', detail: 'Göteborg University, Sweden.' },
                { ref: 'Fırat, M. (2023).', title: 'Yarasa kaynaklı zoonotik viruslar.', journal: 'Etlik Veteriner Mikrobiyoloji Dergisi', detail: '34(2): 211–218.' },
                { ref: 'Greenhall, A.M. & Schmidt, U. (Eds.) (1988).', title: 'Natural History of Vampire Bats.', journal: 'CRC Press', detail: 'Boca Raton, FL, 246 pp.' },
                { ref: 'Griffin, D.R. & Lindsay, R.B. (1959).', title: 'Listening in the dark.', journal: 'Physics Today', detail: '12(1): 42–42.' },
                { ref: 'Jones, G., Jacobs, D.S., Kunz, T.H., Willig, M.R. & Racey, P.A. (2009).', title: 'Carpe noctem: the importance of bats as bioindicators.', journal: 'Endangered Species Research', detail: '8: 93–115.', doi: 'https://doi.org/10.3354/esr00182' },
                { ref: 'Karataş, A. & Sözen, M. (2006).', title: 'Bats of the middle and upper Kızılırmak regions, Central Anatolia, Turkey (Chiroptera).', journal: 'Mammalian Biology', detail: '71: 151–159.', doi: 'https://doi.org/10.1016/j.mambio.2005.11.008' },
                { ref: 'Kunz, T.H., Braun de Torrez, E., Bauer, D., Lobova, T. & Fleming, T.H. (2011).', title: 'Ecosystem services provided by bats.', journal: 'Annals of the New York Academy of Sciences', detail: '1223: 1–38.', doi: 'https://doi.org/10.1111/j.1749-6632.2011.06004.x' },
                { ref: 'Özkurt, Ş.Ö. & Bulut, Ş. (2020).', title: 'Türkiye Memelileri.', journal: 'Panama Yayıncılık', detail: 'Ankara.' },
                { ref: 'Rocha, R., Aziz, S.A., Brook, C.E. ve ark. (2021).', title: 'Bat conservation and zoonotic disease risk: a research agenda to prevent misguided persecution in the aftermath of COVID-19.', journal: 'Animal Conservation', detail: '24(3): 303–311.', doi: 'https://doi.org/10.1111/acv.12636' },
                { ref: 'Russo, D. & Ancillotto, L. (2015).', title: 'Sensitivity of bats to urbanization: a review.', journal: 'Mammalian Biology', detail: '80: 205–212.', doi: 'https://doi.org/10.1016/j.mambio.2014.10.003' },
                { ref: 'Simmons, N.B. (2005).', title: 'Order Chiroptera. In: Wilson, D.E. & Reeder, D.M. (Eds.) Mammal Species of the World (3rd ed., pp. 312–529).', journal: 'Johns Hopkins University Press', detail: 'Baltimore.' },
                { ref: 'Stone, E.L., Jones, G. & Harris, S. (2009).', title: 'Street lighting disturbs commuting bats.', journal: 'Current Biology', detail: '19: 1123–1127.', doi: 'https://doi.org/10.1016/j.cub.2009.05.058' },
                { ref: 'Toyran, K. & Gencer, F. (2023).', title: 'New Data on the Bat Fauna (Mammalia: Chiroptera) from the Eastern Anatolia (Bitlis, Turkey).', journal: 'Kahramanmaraş Sütçü İmam Üniversitesi Tarım ve Doğa Dergisi', detail: '26(2): 254–262.' },
                { ref: 'Wilson, D.E. & Reeder, D.M. (Eds.) (2005).', title: 'Mammal Species of the World: A Taxonomic and Geographic Reference (3rd ed.).', journal: 'Johns Hopkins University Press', detail: 'Baltimore.' },
                { ref: 'Yorulmaz, T. & Arslan, N. (2020).', title: 'Current status of the bats in Turkey with their ecogeographic distributions and recommendations for national conservation status (Mammalia: Chiroptera).', journal: 'Fresenius Environmental Bulletin', detail: '29: 6691–6706.' },
              ].map((item, i, arr) => (
                <li key={i} className="d-flex align-items-start gap-3 py-3" style={{ borderBottom: i < arr.length - 1 ? '1px solid #f5e6e6' : 'none' }}>
                  <i className="bi bi-journal-text mt-1 flex-shrink-0" style={{ color: '#e61b23' }} />
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <span style={{ color: '#1a1a1a', fontWeight: 600 }}>{item.ref}</span>{' '}
                    {item.title}{' '}
                    <em style={{ color: '#555' }}>{item.journal}</em>, {item.detail}
                    {item.doi && <> <a href={item.doi} target="_blank" rel="noreferrer" style={{ color: '#e61b23', fontSize: '12px', marginLeft: 4 }}>DOI ↗</a></>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── İLETİŞİM ── */}
      <section className="section">
        <div className="container" data-aos="fade-up">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="p-5 rounded-3 text-center" style={{ background: '#1a1a1a' }}>
                <i className="bi bi-envelope-heart fs-1 mb-3 d-block" style={{ color: '#e61b23' }} />
                <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '12px' }}>Bizimle İletişime Geçin</h3>
                <p style={{ color: '#aaa', fontSize: '15px', marginBottom: '28px' }}>
                  Tünek alanı gördüyseniz, sorunuz varsa veya projemize katkı sunmak isterseniz bize ulaşın.
                </p>
                <div className="row g-3 justify-content-center">
                  {[
                    { icon: 'bi-envelope', label: 'E-posta', val: 'yarasaarastirmalari@gmail.com', href: 'mailto:yarasaarastirmalari@gmail.com' },
                    { icon: 'bi-telephone', label: 'Telefon', val: '0531 030 66 93', href: 'tel:+905310306693' },
                    { icon: 'bi-instagram', label: 'Instagram', val: '@yarasagzlem', href: 'https://instagram.com/yarasagzlem' },
                  ].map((item, i) => (
                    <div key={i} className="col-md-4">
                      <a href={item.href} target="_blank" rel="noreferrer"
                        style={{ display: 'block', padding: '16px', background: '#222', borderRadius: '10px', textDecoration: 'none', transition: 'background 0.2s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#e61b23' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#222' }}>
                        <i className={`bi ${item.icon} d-block mb-2`} style={{ color: '#e61b23', fontSize: '22px' }} />
                        <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{item.val}</div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Görsel Lightbox Modal */}
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />

    </main>
  )
}


