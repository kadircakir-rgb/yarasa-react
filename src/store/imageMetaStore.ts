import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'

export interface ImageMetaData {
  title?: string
  section?: string
  caption?: string
  tag?: string
  date?: string
}

interface ImageMetaState {
  metaMap: Record<string, ImageMetaData>
  updateMeta: (id: string, data: Partial<ImageMetaData>) => void
  getMeta: (id: string, fallback: { title: string; section?: string; caption?: string; tag?: string; date?: string }) => {
    title: string
    section?: string
    caption?: string
    tag?: string
    date?: string
  }
  loadServerMeta: () => Promise<void>
}

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

export const useImageMetaStore = create<ImageMetaState>()(
  persist(
    (set, get) => ({
      metaMap: {},

      updateMeta: (id, data) => {
        set((state) => ({
          metaMap: {
            ...state.metaMap,
            [id]: {
              ...state.metaMap[id],
              ...data,
            },
          },
        }))
      },

      getMeta: (id, fallback) => {
        const custom = get().metaMap[id]
        if (!custom) return fallback
        return {
          title: custom.title?.trim() ? custom.title : fallback.title,
          section: custom.section?.trim() ? custom.section : fallback.section,
          caption: custom.caption?.trim() ? custom.caption : fallback.caption,
          tag: custom.tag?.trim() ? custom.tag : fallback.tag,
          date: custom.date?.trim() ? custom.date : fallback.date,
        }
      },

      loadServerMeta: async () => {
        try {
          const res = await fetch(`/data/imageMeta.json?v=${Date.now()}`)
          if (res.ok) {
            const data = await res.json()
            if (data && typeof data === 'object') {
              set((state) => ({
                metaMap: {
                  ...state.metaMap,
                  ...data,
                },
              }))
            }
          }
        } catch {
          /* ignore fetch error */
        }
      },
    }),
    {
      name: 'yad-image-meta',
      storage: createJSONStorage(() => safeStorage),
    }
  )
)
