import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import AOS from 'aos'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Header from './components/Header'
import Footer from './components/Footer'
import AdminGuard from './components/AdminGuard'
import ScrollTop from './components/ScrollTop'
import PageLoader from './components/PageLoader'

// Lazy-loaded pages for fast initial page load and code splitting
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Yarasalar = lazy(() => import('./pages/Yarasalar'))
const SahaCalismalari = lazy(() => import('./pages/SahaCalismalari'))
const GonulluOl = lazy(() => import('./pages/GonulluOl'))
const VeriGonder = lazy(() => import('./pages/VeriGonder'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogDetay = lazy(() => import('./pages/BlogDetay'))
const Kaynaklar = lazy(() => import('./pages/Kaynaklar'))
const Iletisim = lazy(() => import('./pages/Iletisim'))
const UyeOl = lazy(() => import('./pages/UyeOl'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'))

function initAOS() {
  AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false, disable: false })
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppContent() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    initAOS()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      AOS.refresh()
    }, 150)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      <ScrollToTop />
      <Header />
      <div className={isHome ? 'index-page' : ''} style={isHome ? { paddingTop: 0 } : { paddingTop: '80px' }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hakkimizda" element={<About />} />
            <Route path="/yarasalar" element={<Yarasalar />} />
            <Route path="/saha-calismalari" element={<SahaCalismalari />} />
            <Route path="/uye-ol" element={<UyeOl />} />
            <Route path="/gonullu-ol" element={<GonulluOl />} />
            <Route path="/veri-gonder" element={<VeriGonder />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetay />} />
            <Route path="/kaynaklar" element={<Kaynaklar />} />
            <Route path="/iletisim" element={<Iletisim />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
      <ScrollTop />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Admin rotaları — header/footer yok, izole */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/panel" element={<AdminGuard><AdminPanel /></AdminGuard>} />
          {/* Site rotaları */}
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
