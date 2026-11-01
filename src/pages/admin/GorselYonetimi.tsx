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
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* ── Üst Bilgi Başlığı ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="bi bi-images" style={{ color: '#e61b23' }} />
              Fotoğraf &amp; Görsel Yönetimi
            </h1>
            <p style={{ color: '#666', fontSize: '14px', margin: '6px 0 0' }}>
              Bilgisayarınızdaki fotoğrafları seçin veya sürükleyin. Sistem otomatik optimize eder ve tek tıkla doğrudan GitHub'a pushlar; Vercel 20-30 saniyede sitenizi yayına alır.
            </p>
          </div>

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
              <span>GitHub Bağlı: <strong>@{tokenUser}</strong> (main)</span>
            ) : (
              <span>GitHub Token Gerekli (Canlıya Alma İçin)</span>
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
            Yüklediğiniz görsellerin doğrudan <strong>kadircakir-rgb/yarasa-react</strong> deposundaki <code>main</code> dalına commit edilmesi ve Vercel'in otomatik olarak yayına alması için <strong>repo</strong> veya <strong>contents:write</strong> yetkisine sahip bir GitHub token'ı giriniz. Token tarayıcınızın <code>localStorage</code> alanında güvenle saklanır.
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
                }}
              >
                {page}
              </button>
            )
          })}
        </div>

        {/* Arama Kutusu */}
        <div style={{ position: 'relative', width: '280px' }}>
          <i className="bi bi-search" style={{ position: 'absolute', left: '12px', top: '10px', color: '#999', fontSize: '13px' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Görsel veya bölüm ara..."
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
                      // Fallback if webp not available yet
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
