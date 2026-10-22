import { create } from 'zustand'

export type Lang = 'tr' | 'en'

export interface TranslationDictionary {
  navHome: string
  navAbout: string
  navBats: string
  navFieldWork: string
  navJoin: string
  navVolunteer: string
  navSubmitData: string
  navNews: string
  navResources: string
  navContact: string
  searchPlaceholder: string
  joinUs: string
  volunteerNow: string
  exploreStudies: string
  contactUs: string
  designedBy: string
  allRightsReserved: string
  supportingInstitutions: string
  completedProjects: string
  activeProjects: string
  observe: string
  protect: string
  report: string
  membershipTitle: string
}

const translations: Record<Lang, TranslationDictionary> = {
  tr: {
    navHome: 'Ana Sayfa',
    navAbout: 'Hakkımızda',
    navBats: 'Yarasalar Hakkında',
    navFieldWork: 'Saha Çalışmaları',
    navJoin: 'Üye Ol',
    navVolunteer: 'Gönüllü Ol',
    navSubmitData: 'Veri Gönder',
    navNews: 'Haberler / Blog',
    navResources: 'Kaynaklar',
    navContact: 'İletişim',
    searchPlaceholder: 'Ara…',
    joinUs: 'Üye Olun',
    volunteerNow: 'Gönüllü Olun',
    exploreStudies: 'Çalışmalarımızı İnceleyin',
    contactUs: 'İletişime Geçin',
    designedBy: 'Designed by Kadir Çakır',
    allRightsReserved: 'Tüm Hakları Saklıdır',
    supportingInstitutions: 'DESTEKLEYEN KURUMLAR & PAYDAŞLAR',
    completedProjects: 'Biten & Tamamlanan Projeler',
    activeProjects: 'Aktif Projeler',
    observe: 'Gözlemle',
    protect: 'Koru',
    report: 'Haber Ver',
    membershipTitle: 'Dernek Üyeliği',
  },
  en: {
    navHome: 'Home',
    navAbout: 'About Us',
    navBats: 'About Bats',
    navFieldWork: 'Field Studies',
    navJoin: 'Join Us',
    navVolunteer: 'Volunteer',
    navSubmitData: 'Submit Data',
    navNews: 'News / Blog',
    navResources: 'Resources',
    navContact: 'Contact',
    searchPlaceholder: 'Search…',
    joinUs: 'Become a Member',
    volunteerNow: 'Become a Volunteer',
    exploreStudies: 'Explore Our Studies',
    contactUs: 'Contact Us',
    designedBy: 'Designed by Kadir Çakır',
    allRightsReserved: 'All Rights Reserved',
    supportingInstitutions: 'SUPPORTING INSTITUTIONS & PARTNERS',
    completedProjects: 'Completed Projects',
    activeProjects: 'Active Projects',
    observe: 'Observe',
    protect: 'Protect',
    report: 'Report',
    membershipTitle: 'Association Membership',
  },
}

interface LangStore {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  t: (key: keyof TranslationDictionary) => string
}

export const useLangStore = create<LangStore>((set, get) => {
  const initialLang: Lang = (typeof window !== 'undefined' && (localStorage.getItem('yad-lang') as Lang)) || 'tr'
  return {
    lang: initialLang,
    setLang: (lang: Lang) => {
      try { localStorage.setItem('yad-lang', lang) } catch { /* ignore */ }
      set({ lang })
    },
    toggleLang: () => {
      const next: Lang = get().lang === 'tr' ? 'en' : 'tr'
      try { localStorage.setItem('yad-lang', next) } catch { /* ignore */ }
      set({ lang: next })
    },
    t: (key: keyof TranslationDictionary) => {
      const current = get().lang
      return translations[current]?.[key] || translations.tr[key] || ''
    },
  }
})
