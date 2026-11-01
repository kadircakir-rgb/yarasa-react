import { useState, useEffect } from 'react'
import { SITE_IMAGES, type SiteImageItem } from '../../config/siteImages'
import { optimizeImageFile, formatBytes, type OptimizedResult } from '../../utils/imageOptimizer'
import {
  getStoredGitHubToken,
  storeGitHubToken,
  verifyGitHubToken,
  uploadFileToGitHub,
  type UploadResult
} from '../../services/githubService'

type PageFilter = 'Tümü' | 'Ana Sayfa' | 'Hakkımızda' | 'Yarasalar' | 'Saha Çalışmaları' | 'Gönüllü Ol'

interface ActiveUploadState {
  optimizing: boolean
  optimized?: OptimizedResult
  uploading: boolean
  result?: UploadResult
  error?: string
}

export default function GorselYonetimi() {
  const [selectedPage, setSelectedPage] = useState<PageFilter>('Tümü')
  const [searchQuery, setSearchQuery] = useState('')
  const [githubToken, setGithubToken] = useState('')
  const [tokenStatus, setTokenStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked')
  const [tokenUser, setTokenUser] = useState<string | null>(null)
  const [tokenEditing, setTokenEditing] = useState(false)
  const [tokenInput, setTokenInput] = useState('')

  // Track upload state for each image card
  const [uploadStates, setUploadStates] = useState<Record<string, ActiveUploadState>>({})

  // Cache buster for live preview images
  const [cacheBuster, setCacheBuster] = useState<number>(Date.now())

  // Custom new image upload state
  const [showCustomUpload, setShowCustomUpload] = useState(false)
  const [customPath, setCustomPath] = useState('public/image/')
  const [customOptimizing, setCustomOptimizing] = useState(false)
  const [customOptimized, setCustomOptimized] = useState<OptimizedResult | null>(null)
  const [customUploading, setCustomUploading] = useState(false)
  const [customResult, setCustomResult] = useState<UploadResult | null>(null)
  const [customError, setCustomError] = useState<string | null>(null)

  useEffect(() => {
    const existing = getStoredGitHubToken()
    if (existing) {
      setGithubToken(existing)
      setTokenInput(existing)
      checkToken(existing)
    }
  }, [])

  const checkToken = async (tok: string) => {
    if (!tok.trim()) {
      setTokenStatus('unchecked')
      setTokenUser(null)
      return
    }
    const res = await verifyGitHubToken(tok)
    if (res.valid) {
      setTokenStatus('valid')
      setTokenUser(res.user || null)
    } else {
      setTokenStatus('invalid')
      setTokenUser(null)
    }
  }

  const handleSaveToken = async () => {
    storeGitHubToken(tokenInput)
    setGithubToken(tokenInput)
    setTokenEditing(false)
    await checkToken(tokenInput)
  }

  const handleFileSelect = async (item: SiteImageItem, file: File) => {
    setUploadStates(prev => ({
      ...prev,
      [item.id]: { optimizing: true, uploading: false }
    }))

    try {
      // 1. Optimize image client-side to WebP max 1920x1920
      const optimized = await optimizeImageFile(file, 1920, 1920, 0.88)

      setUploadStates(prev => ({
        ...prev,
        [item.id]: { optimizing: false, optimized, uploading: false }
      }))
    } catch (err: any) {
      setUploadStates(prev => ({
        ...prev,
        [item.id]: {
          optimizing: false,
          uploading: false,
          error: err?.message || 'Görsel sıkıştırılamadı'
        }
      }))
    }
  }

  const handlePushToGithub = async (item: SiteImageItem) => {
    const st = uploadStates[item.id]
    if (!st?.optimized) return

    setUploadStates(prev => ({
      ...prev,
      [item.id]: { ...st, uploading: true, error: undefined }
    }))

    try {
      const commitMsg = `feat(assets): ${item.title} görseli güncellendi [admin panel]`
      const res = await uploadFileToGitHub({
        path: item.repoPath,
        contentBase64: st.optimized.base64,
        message: commitMsg,
        token: githubToken,
      })

      if (res.success) {
        setUploadStates(prev => ({
          ...prev,
          [item.id]: {
            ...st,
            uploading: false,
            result: res,
          }
        }))
        // Refresh cache buster to show new live image
        setCacheBuster(Date.now())
      } else {
        setUploadStates(prev => ({
          ...prev,
          [item.id]: {
            ...st,
            uploading: false,
            error: res.error || 'GitHub yükleme hatası',
          }
        }))
      }
    } catch (err: any) {
      setUploadStates(prev => ({
        ...prev,
        [item.id]: {
          ...st,
          uploading: false,
          error: err?.message || 'Bilinmeyen hata',
        }
      }))
    }
  }

  const handleCustomFileSelect = async (file: File) => {
    setCustomOptimizing(true)
    setCustomError(null)
    setCustomResult(null)
    try {
      const opt = await optimizeImageFile(file, 1920, 1920, 0.88)
      setCustomOptimized(opt)
      // Suggest filename based on selected file name
      const cleanName = file.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-')
      const baseName = cleanName.substring(0, cleanName.lastIndexOf('.')) || cleanName
      setCustomPath(`public/image/${baseName}.webp`)
    } catch (err: any) {
      setCustomError(err?.message || 'Görsel optimize edilemedi')
    } finally {
      setCustomOptimizing(false)
    }
  }

  const handleCustomPush = async () => {
    if (!customOptimized || !customPath.trim()) return
    setCustomUploading(true)
    setCustomError(null)
    try {
      const res = await uploadFileToGitHub({
        path: customPath.trim(),
        contentBase64: customOptimized.base64,
        message: `feat(assets): Yeni görsel yüklendi (${customPath}) [admin panel]`,
        token: githubToken,
      })
      if (res.success) {
        setCustomResult(res)
        setCacheBuster(Date.now())
      } else {
        setCustomError(res.error || 'GitHub yükleme hatası')
      }
    } catch (err: any) {
      setCustomError(err?.message || 'Bilinmeyen hata')
    } finally {
      setCustomUploading(false)
    }
  }

  const filteredImages = SITE_IMAGES.filter(img => {
    const pageMatch = selectedPage === 'Tümü' || img.page === selectedPage
    const queryMatch =
      !searchQuery.trim() ||
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.repoPath.toLowerCase().includes(searchQuery.toLowerCase())
    return pageMatch && queryMatch
  })

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
      {/* ── Üst Bilgi Başlığı ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="bi bi-images" style={{ color: '#e61b23' }} />
              Fotoğraf &amp; Görsel Yönetimi ({SITE_IMAGES.length} Görsel)
            </h1>
            <p style={{ color: '#666', fontSize: '14px', margin: '6px 0 0' }}>
              Sitedeki tüm fotoğraflar (manşetler, galeriler, saha fotoğrafları, ekipmanlar) aşağıda listelenmiştir. Bilgisayarınızdan yeni fotoğrafı seçtiğinizde sistem otomatik olarak WebP formatına sıkıştırır ve doğrudan GitHub'a pushlar.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Özel Dosya Yükleme Aç/Kapa Butonu */}
            <button
              type="button"
              onClick={() => setShowCustomUpload(!showCustomUpload)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: showCustomUpload ? '#1a1a1a' : '#fff',
                color: showCustomUpload ? '#fff' : '#1a1a1a',
                border: '1.5px solid #1a1a1a',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <i className={`bi ${showCustomUpload ? 'bi-dash-circle' : 'bi-plus-circle'}`} />
              {showCustomUpload ? 'Özel Yükleyiciyi Kapat' : 'Yeni / Özel Fotoğraf Yükle'}
            </button>

            {/* GitHub Durum Rozeti */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '50px',
              background: tokenStatus === 'valid' ? '#e6f7ec' : '#fff3cd',
              border: `1px solid ${tokenStatus === 'valid' ? '#c3e6cb' : '#ffeeba'}`,
              fontSize: '13px',
              fontWeight: 600,
              color: tokenStatus === 'valid' ? '#155724' : '#856404',
            }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50px',
                background: tokenStatus === 'valid' ? '#28a745' : '#ffc107',
                display: 'inline-block'
              }} />
              {tokenStatus === 'valid' ? (
                <span>GitHub Bağlı: <strong>@{tokenUser}</strong></span>
              ) : (
                <span>GitHub Token Gerekli</span>
              )}
              <button
                type="button"
                onClick={() => setTokenEditing(!tokenEditing)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#555',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textDecoration: 'underline',
                  marginLeft: '4px',
                  padding: 0,
                }}
              >
                {tokenEditing ? 'Kapat' : 'Yapılandır'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── GitHub Token Yapılandırma Paneli ── */}
      {tokenEditing && (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px',
          border: '1.5px solid #e0e0e0',
          marginBottom: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
        }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-github" /> GitHub Personal Access Token (PAT)
          </h4>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, margin: '0 0 14px' }}>
            Yüklediğiniz fotoğrafların doğrudan <strong>kadircakir-rgb/yarasa-react</strong> deposundaki <code>main</code> dalına commit edilmesi ve Vercel'in otomatik olarak yayına alması için <strong>repo</strong> veya <strong>contents:write</strong> yetkisine sahip bir GitHub token'ı giriniz. Token tarayıcınızın <code>localStorage</code> alanında güvenle saklanır.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="password"
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx..."
              style={{
                flex: 1,
                minWidth: '280px',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '13px',
                fontFamily: 'monospace'
              }}
            />
            <button
              type="button"
              onClick={handleSaveToken}
              style={{
                padding: '9px 18px',
                background: '#e61b23',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Kaydet &amp; Doğrula
            </button>
          </div>
        </div>
      )}

      {/* ── Özel / Yeni Fotoğraf Yükleyici ── */}
      {showCustomUpload && (
        <div style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '24px',
          border: '2px dashed #e61b23',
          marginBottom: '28px',
          boxShadow: '0 4px 20px rgba(230,27,35,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="bi bi-cloud-arrow-up-fill" style={{ color: '#e61b23' }} />
              Yeni / Serbest Fotoğraf Yükleme (İstediğiniz Konuma)
            </h3>
            <span style={{ fontSize: '12px', color: '#888' }}>
              Arşivinizden dilediğiniz fotoğrafı seçip sitenin herhangi bir dizinine yükleyebilirsiniz.
            </span>
          </div>

          <div className="row gy-3">
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                1. Bilgisayarınızdan Fotoğraf Seçin
              </label>
              <label style={{
                display: 'block',
                border: '2px dashed #ccc',
                borderRadius: '10px',
                padding: '28px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                background: '#fafafa',
                transition: 'background 0.2s',
              }}>
                <i className="bi bi-images" style={{ fontSize: '32px', color: '#e61b23', display: 'block', marginBottom: '8px' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', display: 'block' }}>
                  {customOptimized ? 'Fotoğraf Seçildi (Değiştirmek için tıklayın)' : 'Fotoğrafı buraya tıklayarak seçin'}
                </span>
                <span style={{ fontSize: '11px', color: '#888' }}>Otomatik WebP sıkıştırma uygulanır</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) handleCustomFileSelect(f)
                  }}
                />
              </label>

              {customOptimizing && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                  <i className="bi bi-arrow-repeat me-1" style={{ animation: 'spin 1s linear infinite' }} />
                  Görsel sıkıştırılıyor...
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                2. Depo Dosya Yolu (Repo Path)
              </label>
              <input
                type="text"
                value={customPath}
                onChange={e => setCustomPath(e.target.value)}
                placeholder="public/image/yeni-foto.webp"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #ddd',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  marginBottom: '10px',
                }}
              />
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#888', alignSelf: 'center' }}>Hızlı Klasör:</span>
                {[
                  'public/image/saha-calismalari/',
                  'public/image/yarasalar/',
                  'public/image/gonullu-ol/',
                  'public/image/hakkimizda/',
                ].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCustomPath(`${p}yeni-foto.webp`)}
                    style={{
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      background: '#f5f5f5',
                      cursor: 'pointer',
                    }}
                  >
                    {p.replace('public/image/', '')}
                  </button>
                ))}
              </div>

              {customOptimized && (
                <div style={{
                  background: '#f8fdf9',
                  border: '1px solid #d4edda',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  marginBottom: '14px',
                  fontSize: '12px',
                  color: '#155724'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Orijinal: <strong>{formatBytes(customOptimized.originalSize)}</strong></span>
                    <span>Optimize: <strong>{formatBytes(customOptimized.optimizedSize)}</strong></span>
                  </div>
                  <div style={{ fontWeight: 700, color: '#28a745' }}>
                    ⚡ %{customOptimized.savedPercent} Tasarruf Sağlandı ({customOptimized.width}x{customOptimized.height}px WebP)
                  </div>
                </div>
              )}

              {customError && (
                <div style={{ background: '#fdf2f2', border: '1px solid #f8d7da', color: '#721c24', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }}>
                  {customError}
                </div>
              )}

              {customResult?.success && (
                <div style={{ background: '#d4edda', border: '1px solid #c3e6cb', color: '#155724', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }}>
                  ✅ <strong>Başarıyla yüklendi!</strong> Vercel 20-30 saniye içinde canlıya alıyor.
                </div>
              )}

              <button
                type="button"
                disabled={!customOptimized || customUploading || tokenStatus !== 'valid'}
                onClick={handleCustomPush}
                style={{
                  width: '100%',
                  padding: '11px',
                  background: customOptimized && tokenStatus === 'valid' ? '#e61b23' : '#aaa',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: customOptimized && tokenStatus === 'valid' && !customUploading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {customUploading ? (
                  <>
                    <i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }} />
                    GitHub'a Gönderiliyor...
                  </>
                ) : (
                  <>
                    <i className="bi bi-cloud-arrow-up-fill" />
                    Bu Görseli GitHub'a Yükle &amp; Canlıya Al
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Filtreler & Arama ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {/* Sayfa Seçici Haplar */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(['Tümü', 'Ana Sayfa', 'Hakkımızda', 'Yarasalar', 'Saha Çalışmaları', 'Gönüllü Ol'] as PageFilter[]).map(page => {
            const active = selectedPage === page
            const count = page === 'Tümü'
              ? SITE_IMAGES.length
              : SITE_IMAGES.filter(i => i.page === page).length

            return (
              <button
                key={page}
                type="button"
                onClick={() => setSelectedPage(page)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '50px',
                  border: active ? '1.5px solid #e61b23' : '1px solid #ddd',
                  background: active ? '#e61b23' : '#fff',
                  color: active ? '#fff' : '#555',
                  fontSize: '13px',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{page}</span>
                <span style={{
                  background: active ? 'rgba(255,255,255,0.3)' : '#f0f0f0',
                  color: active ? '#fff' : '#777',
                  padding: '1px 7px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700,
                }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Arama Kutusu */}
        <div style={{ position: 'relative', width: '300px' }}>
          <i className="bi bi-search" style={{ position: 'absolute', left: '12px', top: '10px', color: '#999', fontSize: '13px' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Fotoğraf, bölüm veya dosya adı ara..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '50px',
              border: '1px solid #ddd',
              fontSize: '13px',
              outline: 'none',
              background: '#fff'
            }}
          />
        </div>
      </div>

      {/* ── Görseller Izgarası ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {filteredImages.map(item => {
          const st = uploadStates[item.id] || { optimizing: false, uploading: false }
          const liveUrl = `${item.currentUrl}?v=${cacheBuster}`

          return (
            <div
              key={item.id}
              style={{
                background: '#fff',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
                border: '1px solid #eee',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              {/* Kart Üst Bilgisi */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f2f2f2' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#e61b23',
                    background: '#fdf2f2',
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}>
                    {item.page}
                  </span>
                  {item.recommendedRatio && (
                    <span style={{ fontSize: '11px', color: '#888', fontWeight: 500 }}>
                      <i className="bi bi-aspect-ratio me-1" />{item.recommendedRatio}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px', lineHeight: 1.3 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#777', margin: 0, lineHeight: 1.4 }}>
                  {item.section}
                </p>
              </div>

              {/* Görsel Önizleme / Sürükle Bırak Alanı */}
              <div style={{ position: 'relative', height: '220px', background: '#0e1014', overflow: 'hidden' }}>
                {st.optimized ? (
                  <img
                    src={st.optimized.dataUrl}
                    alt="Yeni optimize edilmiş önizleme"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={liveUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      if (item.altPath) {
                        (e.target as HTMLImageElement).src = item.altPath
                      }
                    }}
                  />
                )}

                {/* Rozet: Canlı vs Yeni */}
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  {st.optimized ? (
                    <span style={{
                      background: '#28a745',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '50px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}>
                      <i className="bi bi-check-circle me-1" />Yeni Görsel Hazır
                    </span>
                  ) : (
                    <span style={{
                      background: 'rgba(0,0,0,0.65)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '50px',
                      backdropFilter: 'blur(4px)'
                    }}>
                      Canlı Sitedeki Görsel
                    </span>
                  )}
                </div>

                {/* Sıkıştırma İlerleme Göstergesi */}
                {st.optimizing && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.75)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    gap: '10px'
                  }}>
                    <i className="bi bi-arrow-repeat" style={{ fontSize: '28px', animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Fotoğraf Sıkıştırılıyor &amp; WebP Yapılıyor...</span>
                  </div>
                )}
              </div>

              {/* Alt Kontroller & Bilgi */}
              <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {st.optimized ? (
                  // Optimize edilmiş boyut istatistiği
                  <div style={{
                    background: '#f8fdf9',
                    border: '1px solid #d4edda',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: '#155724'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Orijinal: <strong>{formatBytes(st.optimized.originalSize)}</strong></span>
                      <span>Yeni: <strong>{formatBytes(st.optimized.optimizedSize)}</strong></span>
                    </div>
                    <div style={{ fontWeight: 700, color: '#28a745' }}>
                      ⚡ %{st.optimized.savedPercent} Boyut Tasarrufu Sağlandı!
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '12px', wordBreak: 'break-all' }}>
                    <i className="bi bi-folder2-open me-1" />Repo Yolu: <code>{item.repoPath}</code>
                  </div>
                )}

                {/* Hata veya Başarı Bildirimi */}
                {st.error && (
                  <div style={{
                    background: '#fdf2f2',
                    border: '1px solid #f8d7da',
                    color: '#721c24',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    marginBottom: '12px',
                  }}>
                    <i className="bi bi-exclamation-triangle-fill me-1" />{st.error}
                  </div>
                )}

                {st.result?.success && (
                  <div style={{
                    background: '#d4edda',
                    border: '1px solid #c3e6cb',
                    color: '#155724',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    marginBottom: '12px',
                  }}>
                    <i className="bi bi-check-circle-fill me-1" />
                    <strong>GitHub'a pushlandı!</strong> Vercel 20-30 sn içinde canlıya alıyor.
                    {st.result.commitUrl && (
                      <div style={{ marginTop: '4px' }}>
                        <a href={st.result.commitUrl} target="_blank" rel="noreferrer" style={{ color: '#155724', textDecoration: 'underline' }}>
                          Commit'i Gör ({st.result.commitSha?.substring(0, 7)})
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Eylem Butonları */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {/* Dosya Seç Input */}
                  <label style={{
                    flex: 1,
                    minWidth: '130px',
                    padding: '8px 12px',
                    background: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}>
                    <i className="bi bi-folder-plus" />
                    <span>{st.optimized ? 'Farklı Fotoğraf Seç' : 'Bilgisayardan Seç'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileSelect(item, file)
                      }}
                    />
                  </label>

                  {/* Push Butonu */}
                  {st.optimized && (
                    <button
                      type="button"
                      disabled={st.uploading || tokenStatus !== 'valid'}
                      onClick={() => handlePushToGithub(item)}
                      style={{
                        padding: '8px 16px',
                        background: tokenStatus === 'valid' ? '#e61b23' : '#aaa',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: tokenStatus === 'valid' && !st.uploading ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {st.uploading ? (
                        <>
                          <i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }} />
                          Pushlanıyor...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cloud-arrow-up-fill" />
                          GitHub'a Yükle &amp; Canlıya Al
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
