/** Backend API kök adresi — `.env` içinde `VITE_API_URL` ile özelleştirilebilir */
export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export function apiUrl(path: string): string {
  const base = API_BASE.replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
