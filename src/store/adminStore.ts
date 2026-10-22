import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'

const safeStorage: StateStorage = {
  getItem: (name) => {
    try { return localStorage.getItem(name) ?? null } catch { return null }
  },
  setItem: (name, value) => {
    try { localStorage.setItem(name, value) } catch { /* ignore */ }
  },
  removeItem: (name) => {
    try { localStorage.removeItem(name) } catch { /* ignore */ }
  },
}

export interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  category: string
  date: string
  image: string
  images?: string[]
  published: boolean
}

export interface UyeBasvuru {
  id: string
  ad_soyad: string
  tc_no?: string
  email: string
  telefon: string
  sehir: string
  meslek: string
  ogrenim: string
  uye_tipi: string
  uzmanlik_alanlari: string[]
  motivasyon: string
  tarih: string
  durum: 'beklemede' | 'onaylandi' | 'reddedildi'
}

export interface GonulluItem {
  id: string
  ad_soyad: string
  email: string
  telefon?: string
  kurum?: string
  katilim_amaci: string[]
  uygun_gunler: string[]
  onceki_deneyim: boolean
  deneyim_notu?: string
  tarih: string
}

export interface GozlemItem {
  id: string
  tarih: string
  saat: string
  konum: string
  gozlem_turu: string
  aciklama: string
  email: string
  fotograf_yolu?: string
  ses_yolu?: string
  bildirim_tarihi: string
}

export interface MesajItem {
  id: string
  name: string
  email: string
  subject: string
  message: string
  tarih: string
}

interface AdminStore {
  isLoggedIn: boolean
  remember: boolean
  posts: BlogPost[]
  uyeler: UyeBasvuru[]
  gonulluler: GonulluItem[]
  gozlemler: GozlemItem[]
  mesajlar: MesajItem[]
  login: (email: string, password: string, remember: boolean) => boolean
  logout: () => void
  addPost: (post: Omit<BlogPost, 'id'>) => void
  updatePost: (id: string, post: Partial<BlogPost>) => void
  deletePost: (id: string) => void
  addUyeBasvuru: (basvuru: Omit<UyeBasvuru, 'id' | 'tarih' | 'durum'>) => void
  updateUyeDurum: (id: string, durum: 'beklemede' | 'onaylandi' | 'reddedildi') => void
  deleteUyeBasvuru: (id: string) => void
  addGonullu: (g: Omit<GonulluItem, 'id' | 'tarih'>) => void
  deleteGonullu: (id: string) => void
  addGozlem: (g: Omit<GozlemItem, 'id' | 'bildirim_tarihi'>) => void
  deleteGozlem: (id: string) => void
  addMesaj: (m: Omit<MesajItem, 'id' | 'tarih'>) => void
  deleteMesaj: (id: string) => void
  importAllData: (data: Partial<AdminStore>) => void
}

const ADMIN_EMAILS = ['admin@yarasaarastirma.com', 'admin@yarasagozlem.com', 'admin']
const ADMIN_PASSWORD = 'YGT2026!'

const initialPosts: BlogPost[] = [
  {
    id: 'kirsehir-fauna-2026',
    title: 'Kırşehir Yarasa Faunasının Belirlenmesi Projesi Tamamlandı',
    content: `Yarasa Araştırmaları Derneği ve Kırşehir Ahi Evran Üniversitesi BAP desteğiyle yürütülen "Kırşehir İl Geneli Yarasa Faunasının Belirlenmesi ve Ekolojik Haritalandırma" projesinin ilk fazı başarıyla sonuçlandırıldı.\n\nAraştırma kapsamında Kırşehir merkez nehir havzası, tarihi yapılar, Seyfe Gölü havzası ve kırsal kaya formasyonları dahil olmak üzere 8 ana habitat zonunda 40'ı aşkın transekt surveyi gerçekleştirilmiştir. Elekon Batlogger S2 ultrasonik cihazları ve termal optik sistemlerle elde edilen kayıtlar neticesinde, İç Anadolu faunasına yönelik önemli tür dağılım kayıtları elde edilmiştir.\n\nElde edilen bulgular doğrultusunda, Kırşehir kentsel dokusunda özellikle Pipistrellus pipistrellus, Pipistrellus kuhlii, Eptesicus serotinus ve Myotis cinsi türlerin yoğun aktivite gösterdiği tespit edilmiştir. Tarihi köprü derzleri ve kâgir taş binalarda kritik anne kolonileri ve yazlık tünek alanları haritalanarak koruma önerileri DKMP ile paylaşılmıştır.\n\nBu çalışma, İç Anadolu'da kentsel ve yarı-doğal habitatlarda yürütülmüş en kapsamlı metodolojik fauna tespiti olma niteliği taşımaktadır.`,
    author: 'Dr. Emin Seyfi',
    category: 'Araştırma',
    date: '15 Ekim 2026',
    image: '/image/cacabey.png',
    images: ['/image/cacabey.png', '/image/lazım2.png', '/image/hayat.png'],
    published: true,
  },
  {
    id: 'derneklesme-duyuru-2026',
    title: 'Yarasa Araştırmaları Derneği Kuruluş Bildirgesi',
    content: `Akademik bir çalışma grubu ve öğrenci topluluğu olarak başlayan yolculuğumuz, kurumsal ve tüzel bir kimlik kazanarak "Yarasa Araştırmaları Derneği" adıyla resmileşti.\n\nDerneğimizin temel kuruluş amaçları:\n1. Türkiye ve İç Anadolu başta olmak üzere yarasa biyoçeşitliliğinin korunması ve araştırılması,\n2. Akustik izleme ve tünek alanı kontrollerinde modern bilimsel yöntemlerin yaygınlaştırılması,\n3. Sivil bilim (citizen science) ve halk farkındalığı oluşturarak yarasalar hakkındaki asılsız korkuların giderilmesi,\n4. Koruma statüsündeki kritik habitatların tespiti ve yasal koruma süreçlerinin izlenmesi.\n\nTüm doğaseverleri, akademisyenleri, öğrencileri ve çevreye duyarlı vatandaşlarımızı derneğimize üye olmaya ve araştırmalarımıza güç katmaya davet ediyoruz.`,
    author: 'Yönetim Kurulu',
    category: 'Duyuru',
    date: '1 Ekim 2026',
    image: '/image/hayat.png',
    images: ['/image/hayat.png', '/image/Hizmetler.png'],
    published: true,
  },
  {
    id: 'saha-2026-mart',
    title: 'Kırşehir Kentsel Alanda Akustik İzleme ve Tünek Alanı Taramaları',
    content: `Yarasa Araştırmaları Derneği olarak Kırşehir il merkezinde kapsamlı kentsel yarasa izleme çalışmalarımıza devam ediyoruz. Kırşehir Ahi Evran Üniversitesi BAP desteğiyle yürütülen bu proje, İç Anadolu'da kentsel alanda gerçekleştirilen ilk sistematik yarasa araştırmalarındandır.\n\nİlk saha çıkışlarımızda nehir koridoru, tarihi yapılar, köprü altları ve kentsel sokak dokusu boyunca belirlediğimiz güzergâhlarda gözlemler gerçekleştirdik. Elekon Batlogger S2 ultrasonik dedektörlerimizle kayıt altına aldığımız veriler, BatExplorer yazılımıyla analiz edilmektedir.\n\nEkibimiz üç aktif gözlemci grubundan oluşmakta olup her grup kendi güzergâhından sorumludur. Gün batımından yaklaşık 20 dakika önce başlayan çalışmalar, şafak öncesi yuva dönüş kontrollerini de kapsamaktadır.\n\nÇalışmalarımız; HADYEK onayı ve DKMP araştırma izni kapsamında non-invasif yöntemlerle sürdürülmektedir.`,
    author: 'Dr. Emin Seyfi',
    category: 'Saha',
    date: '28 Mart 2026',
    image: '/image/saha1.png',
    images: ['/image/saha1.png', '/image/saha2.png', '/image/saha3.png', '/image/saha4.png', '/image/saha5.png', '/image/saha6.png', '/image/saha7.png', '/image/saha8.png', '/image/saha9.png', '/image/saha10.png'],
    published: true,
  },
]

const initialUyeler: UyeBasvuru[] = [
  {
    id: 'demo-1',
    ad_soyad: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@ornek.com',
    telefon: '0542 111 22 33',
    sehir: 'Kırşehir',
    meslek: 'Biyolog',
    ogrenim: 'Yüksek Lisans',
    uye_tipi: 'Asil Üye',
    uzmanlik_alanlari: ['Saha Araştırmaları', 'Akustik İzleme'],
    motivasyon: 'İç Anadolu yarasa faunasının korunması ve arazi çalışmalarında aktif görev almak istiyorum.',
    tarih: '2026-10-18',
    durum: 'beklemede',
  },
]

const initialGonulluler: GonulluItem[] = [
  {
    id: 'gonullu-1',
    ad_soyad: 'Zeynep Kaya',
    email: 'zeynep.kaya@ornek.com',
    telefon: '0535 222 33 44',
    kurum: 'Kırşehir Ahi Evran Ünv. Biyoloji Blm.',
    katilim_amaci: ['Arazi Çalışmaları', 'Akustik İzleme'],
    uygun_gunler: ['Cumartesi', 'Pazar'],
    onceki_deneyim: true,
    deneyim_notu: 'Lisans bitirme tezi kapsamında kuş halkalama ve habitat gözlem tecrübem var.',
    tarih: '2026-10-17',
  },
  {
    id: 'gonullu-2',
    ad_soyad: 'Canberk Demir',
    email: 'canberk.demir@ornek.com',
    telefon: '0555 444 11 22',
    kurum: 'Doğa Koruma Gönüllüsü',
    katilim_amaci: ['Halk Eğitimi / Farkındalık', 'Fotoğrafçılık'],
    uygun_gunler: ['Hafta sonu'],
    onceki_deneyim: false,
    deneyim_notu: 'Doğa fotoğrafçılığı yapıyorum, etkinliklerde görsel arşiv desteği sağlayabilirim.',
    tarih: '2026-10-15',
  },
]

const initialGozlemler: GozlemItem[] = [
  {
    id: 'gozlem-1',
    tarih: '2026-10-16',
    saat: '20:15',
    konum: 'Kırşehir Merkez, Tarihi Cacabey Medresesi batı cephesi',
    gozlem_turu: 'sighting',
    aciklama: 'Gün batımından 25 dakika sonra tarihi taş duvarların saçak altından yaklaşık 8-10 bireylik hızlı uçuş yapan bir koloni çıkışı gözlendi.',
    email: 'vatandas.gozlem@ornek.com',
    fotograf_yolu: '/image/cacabey.png',
    bildirim_tarihi: '2026-10-16 20:45',
  },
  {
    id: 'gozlem-2',
    tarih: '2026-10-12',
    saat: '19:50',
    konum: 'Kılıçözü Deresi kıyı koridoru, Kent Park civarı',
    gozlem_turu: 'acoustic',
    aciklama: 'Su yüzeyi üzerinde alçak uçuşla beslenen yarasalar görüldü, cep telefonu ses kayıt uygulamasıyla ultrasonik tıklama benzeri ritmik sesler alındı.',
    email: 'park.ziyaretci@ornek.com',
    bildirim_tarihi: '2026-10-12 20:10',
  },
]

const initialMesajlar: MesajItem[] = [
  {
    id: 'mesaj-1',
    name: 'Mehmet Özkan',
    email: 'mehmet.ozkan@ornek.com',
    subject: 'Çatı katında yarasa kolonisi hakkında',
    message: 'Kırşehir merkeze yakın bağ evimizin ahşap çatı derzinde bir grup yarasa tünemiş durumda. Onlara zarar vermeden nasıl koruyabileceğimizi ve gözlemleyebileceğimizi öğrenmek istiyorum.',
    tarih: '2026-10-18',
  },
]

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      remember: false,
      posts: initialPosts,
      uyeler: initialUyeler,
      gonulluler: initialGonulluler,
      gozlemler: initialGozlemler,
      mesajlar: initialMesajlar,

      login: (email, password, remember) => {
        const cleanEmail = email.trim().toLowerCase()
        if (ADMIN_EMAILS.includes(cleanEmail) && password === ADMIN_PASSWORD) {
          set({ isLoggedIn: true, remember })
          return true
        }
        return false
      },

      logout: () => set({ isLoggedIn: false, remember: false }),

      addPost: (post) => {
        const newPost: BlogPost = { ...post, id: Date.now().toString() }
        set(state => ({ posts: [newPost, ...(state.posts || [])] }))
      },

      updatePost: (id, updated) => {
        set(state => ({
          posts: (state.posts || []).map(p => p.id === id ? { ...p, ...updated } : p)
        }))
      },

      deletePost: (id) => {
        set(state => ({ posts: (state.posts || []).filter(p => p.id !== id) }))
      },

      addUyeBasvuru: (basvuru) => {
        const yeni: UyeBasvuru = {
          ...basvuru,
          id: Date.now().toString(),
          tarih: new Date().toISOString().split('T')[0],
          durum: 'beklemede',
        }
        set(state => ({ uyeler: [yeni, ...(state.uyeler || [])] }))
      },

      updateUyeDurum: (id, durum) => {
        set(state => ({
          uyeler: (state.uyeler || []).map(u => u.id === id ? { ...u, durum } : u)
        }))
      },

      deleteUyeBasvuru: (id) => {
        set(state => ({
          uyeler: (state.uyeler || []).filter(u => u.id !== id)
        }))
      },

      addGonullu: (g) => {
        const yeni: GonulluItem = {
          ...g,
          id: Date.now().toString(),
          tarih: new Date().toISOString().split('T')[0],
        }
        set(state => ({ gonulluler: [yeni, ...(state.gonulluler || [])] }))
      },

      deleteGonullu: (id) => {
        set(state => ({
          gonulluler: (state.gonulluler || []).filter(x => x.id !== id)
        }))
      },

      addGozlem: (g) => {
        const d = new Date()
        const yeni: GozlemItem = {
          ...g,
          id: Date.now().toString(),
          bildirim_tarihi: `${d.toISOString().split('T')[0]} ${d.toTimeString().slice(0, 5)}`,
        }
        set(state => ({ gozlemler: [yeni, ...(state.gozlemler || [])] }))
      },

      deleteGozlem: (id) => {
        set(state => ({
          gozlemler: (state.gozlemler || []).filter(x => x.id !== id)
        }))
      },

      addMesaj: (m) => {
        const yeni: MesajItem = {
          ...m,
          id: Date.now().toString(),
          tarih: new Date().toISOString().split('T')[0],
        }
        set(state => ({ mesajlar: [yeni, ...(state.mesajlar || [])] }))
      },

      deleteMesaj: (id) => {
        set(state => ({
          mesajlar: (state.mesajlar || []).filter(x => x.id !== id)
        }))
      },

      importAllData: (data) => {
        set(state => ({
          posts: Array.isArray(data.posts) ? data.posts : state.posts,
          uyeler: Array.isArray(data.uyeler) ? data.uyeler : state.uyeler,
          gonulluler: Array.isArray(data.gonulluler) ? data.gonulluler : state.gonulluler,
          gozlemler: Array.isArray(data.gozlemler) ? data.gozlemler : state.gozlemler,
          mesajlar: Array.isArray(data.mesajlar) ? data.mesajlar : state.mesajlar,
        }))
      },
    }),
    {
      name: 'yad-admin-v9',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        posts: state.posts,
        uyeler: state.uyeler,
        gonulluler: state.gonulluler,
        gozlemler: state.gozlemler,
        mesajlar: state.mesajlar,
        isLoggedIn: state.isLoggedIn,
        remember: state.remember,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (!Array.isArray(state.posts) || state.posts.length === 0) state.posts = initialPosts
          if (!Array.isArray(state.uyeler)) state.uyeler = initialUyeler
          if (!Array.isArray(state.gonulluler)) state.gonulluler = initialGonulluler
          if (!Array.isArray(state.gozlemler)) state.gozlemler = initialGozlemler
          if (!Array.isArray(state.mesajlar)) state.mesajlar = initialMesajlar
          if (state.remember === false) {
            state.isLoggedIn = false
          }
        }
      },
    }
  )
)
