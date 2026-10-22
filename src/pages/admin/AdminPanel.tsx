import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore, type BlogPost } from '../../store/adminStore'
import { apiUrl } from '../../lib/api'
import Modal from '../../components/Modal'

type Tab = 'dashboard' | 'posts' | 'new' | 'edit' | 'uyeler' | 'gonulluler' | 'gozlemler' | 'mesajlar' | 'yedek'

/* ── Export Utilities ────────────────────────────────── */
const exportCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const content = [
    headers.join(';'),
    ...rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';'))
  ].join('\r\n')
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const downloadJSON = (filename: string, data: unknown) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/* ── Styles ──────────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fafafa',
}

/* ── Constants ───────────────────────────────────────── */
const emptyForm: Omit<BlogPost, 'id'> = {
  title: '', content: '', author: '', category: 'Araştırma',
  date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
  image: '/assets/img/blog/blog-1.jpg', published: true,
}

const categories = ['Araştırma', 'Ekoloji', 'Topluluk', 'Teknoloji', 'Saha', 'Duyuru']

/* ═══════════════════════════════════════════════════════ */
export default function AdminPanel() {
  const {
    posts, uyeler, gonulluler, gozlemler, mesajlar,
    logout, addPost, updatePost, deletePost,
    updateUyeDurum, deleteUyeBasvuru,
    deleteGonullu, deleteGozlem, deleteMesaj, importAllData,
  } = useAdminStore()

  const postList = posts || []
  const uyeList = uyeler || []
  const gonulluList = gonulluler || []
  const gozlemList = gozlemler || []
  const mesajList = mesajlar || []
  const navigate = useNavigate()

  const [tab, setTab] = useState<Tab>('dashboard')
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [notifyPending, setNotifyPending] = useState<BlogPost | null>(null)
  const [notifyStatus, setNotifyStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [notifyMsg, setNotifyMsg] = useState('')
  const [backupMsg, setBackupMsg] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  /* ── Bildirim gönder ─────────────────────────────── */
  const sendNotification = async (post: BlogPost) => {
    setNotifyStatus('sending')
    try {
      const res = await fetch(apiUrl('/api/bildirim/yeni-yazi'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
      const data = (await res.json()) as { message: string }
      setNotifyMsg(data.message)
      setNotifyStatus('done')
    } catch {
      setNotifyMsg('Bildirim kaydedildi.')
      setNotifyStatus('done')
    }
    setTimeout(() => { setNotifyPending(null); setNotifyStatus('idle'); setNotifyMsg('') }, 3000)
  }

  /* ── Auth ────────────────────────────────────────── */
  const handleLogout = () => {
    localStorage.removeItem('ygt-remember')
    logout()
    navigate('/admin')
  }

  /* ── Yazı işlemleri ──────────────────────────────── */
  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim() || !form.author.trim()) return

    if (editId) {
      updatePost(editId, form)
    } else {
      addPost(form)
      /* Yeni yazı → abonelere bildirimi sor */
      if (form.published && !editId) {
        setNotifyPending({ ...form } as BlogPost)
      }
    }

    setForm(emptyForm)
    setEditId(null)
    setTab('posts')
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleEdit = (post: BlogPost) => {
    setForm({
      title: post.title, content: post.content, author: post.author,
      category: post.category, date: post.date, image: post.image, published: post.published,
    })
    setEditId(post.id)
    setTab('edit')
  }

  const handleDelete = (id: string) => {
    deletePost(id)
    setDeleteConfirm(null)
  }

  /* ── Sidebar item ────────────────────────────────── */
  const sidebarItem = (t: Tab, icon: string, label: string, onClick?: () => void) => (
    <button
      onClick={() => {
        if (onClick) onClick()
        else setTab(t)
        if (t === 'new') { setForm(emptyForm); setEditId(null) }
        setMobileNavOpen(false)
      }}
      style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px',
        border: 'none', borderRadius: '8px', cursor: 'pointer',
        background: tab === t ? '#e61b23' : 'transparent',
        color: tab === t ? '#fff' : '#ccc', fontSize: '14px',
        fontWeight: tab === t ? 600 : 400, transition: 'all 0.2s', textAlign: 'left' as const,
      }}
    >
      <i className={`bi ${icon}`} />
      {label}
    </button>
  )

  const tabLabels: Record<Tab, string> = {
    dashboard: 'Dashboard',
    posts: 'Yazılar',
    new: 'Yeni Yazı Ekle',
    edit: 'Yazı Düzenle',
    uyeler: 'Üyelik Başvuruları',
    gonulluler: 'Gönüllü Başvuruları',
    gozlemler: 'Gözlem Bildirimleri',
    mesajlar: 'Gelen Mesajlar',
    yedek: 'Veri Yedekleme & Arşiv',
  }

  /* ═══════════════════════════════════════════════════════ */
  return (
    <div className="admin-layout">

      {/* ── Mobil Üst Bar (Ekran < 992px) ── */}
      <header className="admin-mobile-topbar">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Menüyü aç"
          style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <i className="bi bi-list" />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/image/logo.png" alt="Logo" style={{ height: '32px', objectFit: 'contain' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#e61b23' }}>
            {tabLabels[tab]}
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Çıkış Yap"
          title="Çıkış Yap"
          style={{ background: 'transparent', border: 'none', color: '#aaa', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <i className="bi bi-box-arrow-left" />
        </button>
      </header>

      {/* ── Mobil Backdrop ── */}
      {mobileNavOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar (Masaüstü Sabit / Mobil Off-Canvas) ── */}
      <aside className={`admin-sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #333' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/image/logo.png" alt="Logo" style={{ height: '44px', objectFit: 'contain' }} />
            <div>
              <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700, lineHeight: 1.2 }}>YAD Admin</div>
              <div style={{ color: '#888', fontSize: '10px' }}>Yönetim Portalı</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Menüyü kapat"
            className="d-lg-none"
            style={{ background: '#262626', border: 'none', color: '#bbb', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <i className="bi bi-x-lg" style={{ fontSize: '14px' }} />
          </button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
          {sidebarItem('dashboard', 'bi-speedometer2', 'Dashboard')}
          <div style={{ borderTop: '1px solid #333', margin: '4px 0' }} />
          {sidebarItem('posts', 'bi-newspaper', `Yazılar (${postList.length})`)}
          {sidebarItem('new', 'bi-plus-circle', 'Yeni Yazı')}
          {sidebarItem('uyeler', 'bi-person-badge', `Üyelik Başvuruları (${uyeList.length})`)}
          {sidebarItem('gonulluler', 'bi-people', `Gönüllü Başvuruları (${gonulluList.length})`)}
          {sidebarItem('gozlemler', 'bi-binoculars', `Gözlem Bildirimleri (${gozlemList.length})`)}
          {sidebarItem('mesajlar', 'bi-envelope', `Gelen Mesajlar (${mesajList.length})`)}
          <div style={{ borderTop: '1px solid #333', margin: '8px 0' }} />
          {sidebarItem('yedek', 'bi-database-down', 'Veri Yedekleme & Arşiv')}
        </nav>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px',
          width: '100%', padding: '12px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer',
          background: 'transparent', color: '#888', fontSize: '14px', transition: 'all 0.2s', marginTop: '12px' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#e61b23' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#888' }}
        >
          <i className="bi bi-box-arrow-left" /> Çıkış Yap
        </button>
      </aside>

      {/* ── İçerik ── */}
      <main className="admin-content">

        {saved && (
          <div role="status" style={{ background: '#d4edda', border: '1px solid #c3e6cb',
            borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#155724',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <i className="bi bi-check-circle-fill" /> Yazı başarıyla kaydedildi!
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <>
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                <i className="bi bi-speedometer2" style={{ color: '#e61b23', marginRight: '8px' }} />Dashboard
              </h1>
              <p style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>
                {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} — Son durum özeti
              </p>
            </div>

            {/* İstatistik kartları */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Yayında Yazı', count: postList.filter(p => p.published).length, total: postList.length, icon: 'bi-newspaper', color: '#e61b23', to: 'posts' },
                { label: 'Üye Başvurusu', count: uyeList.filter(u => u.durum === 'beklemede').length, total: uyeList.length, icon: 'bi-person-badge', color: '#17a2b8', to: 'uyeler' },
                { label: 'Gönüllü', count: gonulluList.length, total: gonulluList.length, icon: 'bi-people', color: '#28a745', to: 'gonulluler' },
                { label: 'Gözlem Bildirimi', count: gozlemList.length, total: gozlemList.length, icon: 'bi-binoculars', color: '#fd7e14', to: 'gozlemler' },
                { label: 'Okunmamış Mesaj', count: mesajList.length, total: mesajList.length, icon: 'bi-envelope', color: '#6f42c1', to: 'mesajlar' },
              ].map((card, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTab(card.to as Tab)}
                  style={{
                    background: '#fff', borderRadius: '14px', padding: '20px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px',
                    border: `1px solid ${card.color}22`,
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
                    outline: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${card.color}22` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)' }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: '10px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, fontSize: '20px' }}>
                    <i className={`bi ${card.icon}`} />
                  </div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>{card.count}</div>
                    {card.count !== card.total && (
                      <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>/ {card.total} toplam</div>
                    )}
                    <div style={{ fontSize: '12px', color: '#777', marginTop: '4px' }}>{card.label}</div>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: card.color, fontWeight: 600 }}>
                    Görüntüle <i className="bi bi-arrow-right" style={{ fontSize: '11px' }} />
                  </div>
                </button>
              ))}
            </div>

            {/* Hızlı işlemler */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              {/* Son Üye Başvuruları */}
              <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                    <i className="bi bi-person-badge" style={{ color: '#e61b23', marginRight: '6px' }} />Son Başvurular
                  </h3>
                  <button type="button" onClick={() => setTab('uyeler')} style={{ background: 'none', border: 'none', color: '#e61b23', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Tümü →</button>
                </div>
                {uyeList.length === 0 ? (
                  <p style={{ color: '#bbb', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Henüz başvuru yok.</p>
                ) : (
                  uyeList.slice(0, 4).map(u => (
                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #f5f5f5' }}>
                      <div style={{ width: 36, height: 36, background: '#f5e6e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e61b23', flexShrink: 0, fontWeight: 700, fontSize: '14px' }}>
                        {u.ad_soyad.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.ad_soyad}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>{u.sehir} · {u.uye_tipi}</div>
                      </div>
                      <span style={{
                        background: u.durum === 'onaylandi' ? '#d4edda' : u.durum === 'reddedildi' ? '#f8d7da' : '#fff3cd',
                        color: u.durum === 'onaylandi' ? '#155724' : u.durum === 'reddedildi' ? '#721c24' : '#856404',
                        padding: '2px 8px', borderRadius: '50px', fontSize: '11px', fontWeight: 600, flexShrink: 0,
                      }}>
                        {u.durum === 'onaylandi' ? '✓' : u.durum === 'reddedildi' ? '✕' : '⏳'}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Son Gözlemler */}
              <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                    <i className="bi bi-binoculars" style={{ color: '#fd7e14', marginRight: '6px' }} />Son Gözlemler
                  </h3>
                  <button type="button" onClick={() => setTab('gozlemler')} style={{ background: 'none', border: 'none', color: '#e61b23', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Tümü →</button>
                </div>
                {gozlemList.length === 0 ? (
                  <p style={{ color: '#bbb', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Henüz gözlem yok.</p>
                ) : (
                  gozlemList.slice(0, 4).map(g => (
                    <div key={g.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #f5f5f5' }}>
                      <div style={{ width: 36, height: 36, background: '#fff3e0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fd7e14', flexShrink: 0, fontSize: '14px' }}>
                        <i className="bi bi-geo-alt" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.konum}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>{g.tarih} · {g.gozlem_turu === 'sighting' ? 'Görsel' : g.gozlem_turu === 'acoustic' ? 'Ses' : 'Tünek'}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Son Mesajlar */}
              <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                    <i className="bi bi-envelope" style={{ color: '#6f42c1', marginRight: '6px' }} />Son Mesajlar
                  </h3>
                  <button type="button" onClick={() => setTab('mesajlar')} style={{ background: 'none', border: 'none', color: '#e61b23', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Tümü →</button>
                </div>
                {mesajList.length === 0 ? (
                  <p style={{ color: '#bbb', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Henüz mesaj yok.</p>
                ) : (
                  mesajList.slice(0, 4).map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #f5f5f5' }}>
                      <div style={{ width: 36, height: 36, background: '#f3eeff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6f42c1', flexShrink: 0, fontSize: '14px' }}>
                        {m.name?.charAt(0) ?? '?'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '13px' }}>{m.name}</div>
                        <div style={{ fontSize: '11px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject || m.message?.slice(0, 40)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Hızlı Eylemler */}
            <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>
                <i className="bi bi-lightning-fill" style={{ color: '#e61b23', marginRight: '6px' }} />Hızlı Eylemler
              </h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => { setForm(emptyForm); setEditId(null); setTab('new') }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#e61b23', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  <i className="bi bi-plus-circle" /> Yeni Yazı Ekle
                </button>
                <button type="button" onClick={() => setTab('uyeler')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#f5e6e6', color: '#e61b23', border: '1.5px solid #f5d6d6', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  <i className="bi bi-person-check" /> Üye Başvurularını İncele
                </button>
                <button type="button" onClick={() => setTab('yedek')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#f0f0f0', color: '#555', border: '1.5px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  <i className="bi bi-cloud-arrow-down" /> Veri Yedekle
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── YAZILAR LİSTESİ ── */}
        {tab === 'posts' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                <i className="bi bi-newspaper" style={{ color: '#e61b23' }} />{" "}Yazılar ({postList.length})
              </h1>
              <div style={{ display: 'flex', gap: '10px' }}>
                {postList.length > 0 && (
                  <button
                    onClick={() => exportCSV(
                      `yad_yazilar_${new Date().toISOString().slice(0, 10)}.csv`,
                      ['ID', 'Başlık', 'Yazar', 'Kategori', 'Tarih', 'Durum'],
                      postList.map(p => [p.id, p.title, p.author, p.category, p.date, p.published ? 'Yayında' : 'Taslak'])
                    )}
                    style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className="bi bi-file-earmark-spreadsheet" /> CSV İndir
                  </button>
                )}
                <button onClick={() => { setForm(emptyForm); setEditId(null); setTab('new') }}
                  style={{ background: '#e61b23', color: '#fff', border: 'none', borderRadius: '8px',
                    padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="bi bi-plus-lg" /> Yeni Yazı
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {postList.map(post => (
                <div key={post.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src={post.image} alt={post.title} style={{ width: '64px', height: '64px',
                    objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/assets/img/blog/blog-1.jpg' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '15px', marginBottom: '4px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      <span style={{ background: '#f5e6e6', color: '#e61b23', padding: '2px 8px',
                        borderRadius: '4px', marginRight: '8px', fontWeight: 500 }}>{post.category}</span>
                      {post.author} · {post.date}
                      <span style={{ marginLeft: '8px', color: post.published ? '#2d6a2d' : '#888' }}>
                        <i className={`bi ${post.published ? 'bi-eye' : 'bi-eye-slash'}`} /> {" "}
                        {post.published ? 'Yayında' : 'Taslak'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => handleEdit(post)} style={{ background: '#f5e6e6',
                      color: '#e61b23', border: 'none', borderRadius: '6px', padding: '8px 14px',
                      cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                      <i className="bi bi-pencil" /> Düzenle
                    </button>
                    <button onClick={() => setDeleteConfirm(post.id)} style={{ background: '#fff0f0',
                      color: '#c0392b', border: 'none', borderRadius: '6px', padding: '8px 14px',
                      cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                      <i className="bi bi-trash" /> Sil
                    </button>
                  </div>
                </div>
              ))}
              {postList.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
                  <i className="bi bi-inbox" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }} />
                  Henüz yazı yok.
                </div>
              )}
            </div>
          </>
        )}

        {/* ── YENİ / DÜZENLE ── */}
        {(tab === 'new' || tab === 'edit') && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button onClick={() => setTab('posts')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888',
                  fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <i className="bi bi-arrow-left" /> Geri
              </button>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                {tab === 'edit' ? 'Yazıyı Düzenle' : 'Yeni Yazı'}
              </h1>
            </div>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Başlık *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Yazı başlığı" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Yazar *</label>
                  <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                    placeholder="Yazar adı" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Kategori</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    style={inputStyle}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Tarih</label>
                  <input value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    placeholder="15 Mart 2026" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Görsel URL veya Seçim</label>
                  <input value={form.image}
                    onChange={e => setForm({ ...form, image: e.target.value })}
                    placeholder="/image/cacabey.png" style={inputStyle} />
                  <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Cacabey', src: '/image/cacabey.png' },
                      { label: 'Hayat / Park', src: '/image/hayat.png' },
                      { label: 'Mağara Koloni', src: '/image/lazım2.png' },
                      { label: 'Tünek Yakın', src: '/image/lazım1.png' },
                      { label: 'Saha Ekip', src: '/image/Hizmetler.png' },
                      { label: 'Saha 1', src: '/image/saha1.png' },
                    ].map(img => (
                      <button
                        key={img.src}
                        type="button"
                        onClick={() => setForm({ ...form, image: img.src })}
                        style={{
                          fontSize: '11px', padding: '3px 8px', borderRadius: '4px',
                          border: form.image === img.src ? '1.5px solid #e61b23' : '1px solid #ddd',
                          background: form.image === img.src ? '#fdf2f2' : '#fff',
                          color: form.image === img.src ? '#e61b23' : '#555',
                          cursor: 'pointer', fontWeight: form.image === img.src ? 700 : 400,
                        }}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>İçerik *</label>
                  <textarea value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    placeholder="Yazı içeriği..." rows={8}
                    style={{ ...inputStyle, resize: 'vertical' as const }} />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" id="published" checked={form.published}
                    onChange={e => setForm({ ...form, published: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#e61b23', cursor: 'pointer' }} />
                  <label htmlFor="published" style={{ fontSize: '14px', color: '#1a1a1a', cursor: 'pointer' }}>
                    Hemen yayınla
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setTab('posts')}
                  style={{ padding: '12px 24px', border: '1.5px solid #e0e0e0', borderRadius: '8px',
                    background: '#fff', color: '#666', cursor: 'pointer', fontSize: '14px' }}>
                  İptal
                </button>
                <button onClick={handleSave}
                  style={{ padding: '12px 28px', background: '#e61b23', color: '#fff', border: 'none',
                    borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="bi bi-check-lg" /> {tab === 'edit' ? 'Güncelle' : 'Yayınla'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── ÜYELİK BAŞVURULARI ── */}
        {tab === 'uyeler' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                <i className="bi bi-person-badge" style={{ color: '#e61b23' }} />{" "}Üyelik Başvuruları ({uyeList.length})
              </h1>
              {uyeList.length > 0 && (
                <button
                  onClick={() => exportCSV(
                    `yad_uyeler_${new Date().toISOString().slice(0, 10)}.csv`,
                    ['ID', 'Ad Soyad', 'E-posta', 'Telefon', 'Şehir', 'Meslek', 'Öğrenim', 'Üye Tipi', 'İlgi Alanları', 'Motivasyon', 'Tarih', 'Durum'],
                    uyeList.map(u => [u.id, u.ad_soyad, u.email, u.telefon, u.sehir, u.meslek, u.ogrenim, u.uye_tipi, (u.uzmanlik_alanlari || []).join(', '), u.motivasyon, u.tarih, u.durum])
                  )}
                  style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="bi bi-file-earmark-spreadsheet" /> Excel / CSV İndir
                </button>
              )}
            </div>
            {uyeList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
                <i className="bi bi-inbox" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }} />
                Henüz üyelik başvurusu yok.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {uyeList.map((u) => (
                  <div key={u.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '260px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <div style={{ width: 40, height: 40, background: '#f5e6e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e61b23', fontWeight: 700 }}>
                            <i className="bi bi-person-fill" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '16px' }}>{u.ad_soyad}</div>
                            <div style={{ fontSize: '13px', color: '#777' }}>
                              {u.email} • {u.telefon} • {u.sehir}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0' }}>
                          <span style={{ background: '#fdf2f2', color: '#e61b23', padding: '2px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: 600 }}>
                            {u.uye_tipi}
                          </span>
                          {u.meslek && (
                            <span style={{ background: '#f0f0f0', color: '#444', padding: '2px 10px', borderRadius: '50px', fontSize: '12px' }}>
                              {u.meslek}
                            </span>
                          )}
                          <span style={{ background: '#eef2f7', color: '#2c3e50', padding: '2px 10px', borderRadius: '50px', fontSize: '12px' }}>
                            {u.ogrenim}
                          </span>
                          <span style={{
                            background: u.durum === 'onaylandi' ? '#d4edda' : u.durum === 'reddedildi' ? '#f8d7da' : '#fff3cd',
                            color: u.durum === 'onaylandi' ? '#155724' : u.durum === 'reddedildi' ? '#721c24' : '#856404',
                            padding: '2px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: 700
                          }}>
                            {u.durum === 'onaylandi' ? '✓ Onaylandı' : u.durum === 'reddedildi' ? '✕ Reddedildi' : '⏳ Beklemede'}
                          </span>
                        </div>

                        {u.uzmanlik_alanlari?.length > 0 && (
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                            <strong>İlgi Alanları:</strong> {u.uzmanlik_alanlari.join(', ')}
                          </div>
                        )}

                        {u.motivasyon && (
                          <div style={{ fontSize: '13px', color: '#555', background: '#fafafa', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #e61b23', fontStyle: 'italic', marginTop: '6px' }}>
                            "{u.motivasyon}"
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#aaa' }}>{u.tarih}</div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => updateUyeDurum(u.id, 'onaylandi')}
                            style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                            title="Onayla"
                          >
                            <i className="bi bi-check-lg me-1" />Onayla
                          </button>
                          <button
                            onClick={() => updateUyeDurum(u.id, 'reddedildi')}
                            style={{ background: '#ffc107', color: '#000', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                            title="Reddet"
                          >
                            <i className="bi bi-x-lg me-1" />Reddet
                          </button>
                          <button
                            onClick={() => deleteUyeBasvuru(u.id)}
                            style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}
                            title="Sil"
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── GÖNÜLLÜLER ── */}
        {tab === 'gonulluler' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                <i className="bi bi-people" style={{ color: '#e61b23' }} />{" "}Gönüllü Başvuruları ({gonulluList.length})
              </h1>
              {gonulluList.length > 0 && (
                <button
                  onClick={() => exportCSV(
                    `yad_gonulluler_${new Date().toISOString().slice(0, 10)}.csv`,
                    ['ID', 'Ad Soyad', 'E-posta', 'Telefon', 'Kurum', 'Katılım Amacı', 'Uygun Günler', 'Deneyim', 'Deneyim Notu', 'Tarih'],
                    gonulluList.map(g => [g.id, g.ad_soyad, g.email, g.telefon || '', g.kurum || '', (g.katilim_amaci || []).join(', '), (g.uygun_gunler || []).join(', '), g.onceki_deneyim ? 'Evet' : 'Hayır', g.deneyim_notu || '', g.tarih])
                  )}
                  style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="bi bi-file-earmark-spreadsheet" /> Excel / CSV İndir
                </button>
              )}
            </div>
            {gonulluList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
                <i className="bi bi-inbox" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }} />
                Henüz gönüllü başvurusu yok.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {gonulluList.map((g) => (
                  <div key={g.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <div style={{ width: 40, height: 40, background: '#f5e6e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <i className="bi bi-person" style={{ color: '#e61b23' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '15px' }}>{g.ad_soyad}</div>
                            <div style={{ fontSize: '13px', color: '#888' }}>{g.email}{g.telefon && ` · ${g.telefon}`}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                          {g.kurum && (
                            <span style={{ background: '#f0f0f0', color: '#555', padding: '2px 10px', borderRadius: '50px', fontSize: '12px' }}>{g.kurum}</span>
                          )}
                          {g.onceki_deneyim && (
                            <span style={{ background: '#d4edda', color: '#2d6a2d', padding: '2px 10px', borderRadius: '50px', fontSize: '12px' }}>Deneyimli</span>
                          )}
                          {(g.katilim_amaci || []).map((a) => (
                            <span key={a} style={{ background: '#f5e6e6', color: '#e61b23', padding: '2px 10px', borderRadius: '50px', fontSize: '12px' }}>{a}</span>
                          ))}
                        </div>
                        {g.uygun_gunler?.length > 0 && (
                          <div style={{ fontSize: '12px', color: '#888' }}>Uygun günler: {g.uygun_gunler.join(', ')}</div>
                        )}
                        {g.deneyim_notu && (
                          <div style={{ fontSize: '13px', color: '#666', marginTop: '6px', fontStyle: 'italic', background: '#fafafa', padding: '8px 12px', borderRadius: '6px' }}>
                            "{g.deneyim_notu}"
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#aaa' }}>{g.tarih}</div>
                        <button
                          onClick={() => deleteGonullu(g.id)}
                          style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}
                          title="Sil"
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── GÖZLEMLER ── */}
        {tab === 'gozlemler' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                <i className="bi bi-binoculars" style={{ color: '#e61b23' }} />{" "}Gözlem Bildirimleri ({gozlemList.length})
              </h1>
              {gozlemList.length > 0 && (
                <button
                  onClick={() => exportCSV(
                    `yad_gozlemler_${new Date().toISOString().slice(0, 10)}.csv`,
                    ['ID', 'Tarih', 'Saat', 'Konum', 'Gözlem Türü', 'Açıklama', 'E-posta', 'Bildirim Tarihi'],
                    gozlemList.map(g => [g.id, g.tarih, g.saat, g.konum, g.gozlem_turu, g.aciklama, g.email, g.bildirim_tarihi])
                  )}
                  style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="bi bi-file-earmark-spreadsheet" /> Excel / CSV İndir
                </button>
              )}
            </div>
            {gozlemList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
                <i className="bi bi-inbox" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }} />
                Henüz gözlem bildirimi yok.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {gozlemList.map((g) => (
                  <div key={g.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <span style={{ background: '#f5e6e6', color: '#e61b23', padding: '3px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 600 }}>
                            {g.gozlem_turu === 'sighting' ? 'Görsel Gözlem' : g.gozlem_turu === 'acoustic' ? 'Ses Kaydı' : 'Tünek Alanı'}
                          </span>
                          <span style={{ fontSize: '13px', color: '#888' }}>
                            {g.tarih} — {g.saat?.slice(0, 5)}
                          </span>
                        </div>
                        <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                          <i className="bi bi-geo-alt" style={{ color: '#e61b23' }} /> {g.konum}
                        </div>
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px', lineHeight: '1.5' }}>{g.aciklama}</p>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          <i className="bi bi-envelope me-1" />{g.email}
                          {g.fotograf_yolu && <span style={{ marginLeft: '12px' }}><i className="bi bi-image me-1" />Fotoğraf / Görsel eklendi</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#aaa' }}>{g.bildirim_tarihi}</div>
                        <button
                          onClick={() => deleteGozlem(g.id)}
                          style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}
                          title="Sil"
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── GELEN MESAJLAR ── */}
        {tab === 'mesajlar' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                <i className="bi bi-envelope" style={{ color: '#e61b23' }} />{" "}Gelen İletişim Mesajları ({mesajList.length})
              </h1>
              {mesajList.length > 0 && (
                <button
                  onClick={() => exportCSV(
                    `yad_mesajlar_${new Date().toISOString().slice(0, 10)}.csv`,
                    ['ID', 'Ad Soyad', 'E-posta', 'Konu', 'Mesaj', 'Tarih'],
                    mesajList.map(m => [m.id, m.name, m.email, m.subject, m.message, m.tarih])
                  )}
                  style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="bi bi-file-earmark-spreadsheet" /> Excel / CSV İndir
                </button>
              )}
            </div>
            {mesajList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
                <i className="bi bi-inbox" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }} />
                Henüz gelen mesaj yok.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mesajList.map((m) => (
                  <div key={m.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <div style={{ width: 36, height: 36, background: '#f5e6e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e61b23' }}>
                            <i className="bi bi-chat-text" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '15px' }}>{m.name}</div>
                            <div style={{ fontSize: '13px', color: '#777' }}>{m.email}</div>
                          </div>
                        </div>
                        {m.subject && (
                          <div style={{ fontWeight: 600, color: '#333', fontSize: '14px', marginTop: '8px', marginBottom: '4px' }}>
                            Konu: {m.subject}
                          </div>
                        )}
                        <p style={{ color: '#555', fontSize: '14px', background: '#fafafa', padding: '12px 14px', borderRadius: '8px', borderLeft: '3px solid #e61b23', margin: '8px 0 0', lineHeight: 1.5 }}>
                          {m.message}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#aaa' }}>{m.tarih}</div>
                        <button
                          onClick={() => deleteMesaj(m.id)}
                          style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}
                          title="Sil"
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── VERİ YEDEKLEME & ARŞİV ── */}
        {tab === 'yedek' && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                <i className="bi bi-database-down" style={{ color: '#e61b23' }} />{" "}Kalıcı Veri Arşivi & Yedekleme
              </h1>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '6px' }}>
                Tüm dernek veritabanını tek tıkla bilgisayarınıza indirebilir, güvenle yedekleyebilir veya başka bir cihaza yükleyebilirsiniz.
              </p>
            </div>

            {backupMsg && (
              <div style={{ background: '#d4edda', border: '1px solid #c3e6cb', color: '#155724', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-check-circle-fill" /> {backupMsg}
              </div>
            )}

            {/* İstatistik Kartları */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Haber / Blog', count: postList.length, icon: 'bi-newspaper', color: '#e61b23' },
                { label: 'Üye Başvuruları', count: uyeList.length, icon: 'bi-person-badge', color: '#17a2b8' },
                { label: 'Gönüllüler', count: gonulluList.length, icon: 'bi-people', color: '#28a745' },
                { label: 'Gözlem Bildirimleri', count: gozlemList.length, icon: 'bi-binoculars', color: '#fd7e14' },
                { label: 'Gelen Mesajlar', count: mesajList.length, icon: 'bi-envelope', color: '#6f42c1' },
              ].map((card, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '10px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, fontSize: '20px' }}>
                    <i className={`bi ${card.icon}`} />
                  </div>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a' }}>{card.count}</div>
                    <div style={{ fontSize: '12px', color: '#777' }}>{card.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* İşlem Kartları */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Dışa Aktar */}
              <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px' }}>
                  <i className="bi bi-cloud-arrow-down text-danger me-2" />Yedek Al (Bilgisayara İndir)
                </h3>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
                  Yazılar, üyelikler, gönüllü listeleri, saha gözlemleri ve gelen mesajların tamamını içeren tek bir JSON yedek dosyası oluşturur ve bilgisayarınıza indirir.
                </p>
                <button
                  onClick={() => {
                    const exportData = {
                      version: '1.0',
                      exportDate: new Date().toISOString(),
                      association: 'Yarasa Araştırmaları Derneği',
                      posts: postList,
                      uyeler: uyeList,
                      gonulluler: gonulluList,
                      gozlemler: gozlemList,
                      mesajlar: mesajList,
                    }
                    downloadJSON(`yad_veritabani_yedek_${new Date().toISOString().slice(0, 10)}.json`, exportData)
                    setBackupMsg('Tüm veritabanı başarıyla JSON dosyası olarak indirildi!')
                    setTimeout(() => setBackupMsg(''), 4000)
                  }}
                  style={{ background: '#e61b23', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <i className="bi bi-download" /> Tüm Veritabanını İndir (.JSON)
                </button>
              </div>

              {/* İçe Aktar / Geri Yükle */}
              <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px' }}>
                  <i className="bi bi-cloud-arrow-up text-primary me-2" />Yedekten Geri Yükle
                </h3>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
                  Daha önce indirdiğiniz bir <code>.json</code> yedek dosyasını seçerek tüm verileri sisteme geri yükleyebilirsiniz.
                </p>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1a1a1a', color: '#fff', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  <i className="bi bi-upload" /> Yedek Dosyası Seç (.JSON)
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = (evt) => {
                        try {
                          const parsed = JSON.parse(evt.target?.result as string)
                          importAllData(parsed)
                          setBackupMsg('Yedek dosyasındaki tüm veriler başarıyla geri yüklendi!')
                          setTimeout(() => setBackupMsg(''), 4000)
                        } catch {
                          alert('Geçersiz yedek dosyası formatı!')
                        }
                      }
                      reader.readAsText(file)
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Bilgilendirme Kutusu */}
            <div style={{ marginTop: '28px', background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '12px', padding: '20px 24px', fontSize: '13px', color: '#555', lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, color: '#1a1a1a', marginBottom: '6px', fontSize: '14px' }}>
                <i className="bi bi-shield-check text-success me-2" />Kalıcı Saklama Hakkında Bilgi
              </div>
              <div>
                Sistemimiz tarayıcınızın <strong>Yerel Depolama (HTML5 LocalStorage)</strong> teknolojisini kullanır. Bilgisayarınızı kapatsanız, tarayıcıyı yeniden başlatsanız dahi girdiğiniz tüm üyelikler, yazılar, gönüllüler ve mesajlar <strong>asla silinmez, kalıcı olarak korunur</strong>.
                Yukarıdaki "Tüm Veritabanını İndir" butonunu kullanarak verilerinizi istediğiniz zaman bilgisayarınıza arşiv dosyası olarak da kaydedebilirsiniz.
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── Silme onayı modal ── */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Yazıyı sil?"
        labelledById="delete-modal-title"
        panelClassName="delete-modal-panel"
      >
        <i className="bi bi-exclamation-triangle"
          style={{ fontSize: '40px', color: '#e61b23', display: 'block', marginBottom: '16px' }}
          aria-hidden="true" />
        <h3 id="delete-modal-title" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
          Yazıyı sil?
        </h3>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>Bu işlem geri alınamaz.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => setDeleteConfirm(null)}
            autoFocus
            style={{ padding: '10px 24px', border: '1.5px solid #e0e0e0', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '14px' }}
          >İptal</button>
          <button
            onClick={() => { if (deleteConfirm) handleDelete(deleteConfirm) }}
            style={{ padding: '10px 24px', background: '#e61b23', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
          >Evet, Sil</button>
        </div>
      </Modal>

      {/* ── Bildirim modalı ── */}
      {notifyPending && (
        <Modal
          open={!!notifyPending}
          onClose={() => { setNotifyPending(null); setNotifyStatus('idle'); setNotifyMsg('') }}
          title={notifyStatus === 'done' ? 'Gönderildi!' : notifyStatus === 'sending' ? 'Gönderiliyor…' : 'Abonelere Bildir?'}
        >
          {notifyStatus === 'done' ? (
            <>
              <i className="bi bi-check-circle-fill"
                style={{ fontSize: '48px', color: '#2d6a2d', display: 'block', marginBottom: '16px' }}
                aria-hidden="true" />
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Gönderildi!</h3>
              <p style={{ color: '#888', fontSize: '14px' }}>{notifyMsg}</p>
            </>
          ) : notifyStatus === 'sending' ? (
            <>
              <i className="bi bi-send"
                style={{ fontSize: '48px', color: '#e61b23', display: 'block', marginBottom: '16px',
                  animation: 'spin 1s linear infinite' }}
                aria-hidden="true" />
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Gönderiliyor…</h3>
              <p style={{ color: '#888', fontSize: '14px' }}>Abonelere bildirim e-postası gönderiliyor.</p>
            </>
          ) : (
            <>
              <i className="bi bi-bell"
                style={{ fontSize: '48px', color: '#e61b23', display: 'block', marginBottom: '16px' }}
                aria-hidden="true" />
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Abonelere Bildir?</h3>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>
                "<strong>{notifyPending?.title || ''}</strong>" yazısı yayınlandı.
              </p>
              <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '24px' }}>
                Tüm abonelere e-posta bildirimi göndermek ister misiniz?
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => { setNotifyPending(null); setNotifyStatus('idle') }}
                  autoFocus
                  style={{ padding: '10px 24px', border: '1.5px solid #e0e0e0', borderRadius: '8px',
                    background: '#fff', cursor: 'pointer', fontSize: '14px' }}>Hayır, Geç</button>
                <button
                  onClick={() => { if (notifyPending) sendNotification(notifyPending) }}
                  style={{ padding: '10px 24px', background: '#e61b23', color: '#fff', border: 'none',
                    borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="bi bi-send" /> Evet, Gönder
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  )
}

/* ── Global keyframes (injected once) ── */
const _styleId = 'admin-panel-keyframes'
if (typeof document !== 'undefined' && !document.getElementById(_styleId)) {
  const s = document.createElement('style')
  s.id = _styleId
  s.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
  document.head.appendChild(s)
}
