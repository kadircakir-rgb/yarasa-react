/**
 * GitHub API service to directly commit & push optimized image assets to the repository.
 * Triggers Vercel automatic deployment without any third-party image hosting service.
 */

const REPO_OWNER = 'kadircakir-rgb'
const REPO_NAME = 'yarasa-react'
const TARGET_BRANCH = 'main'
const TOKEN_KEY = 'yad-github-token'

export interface GitHubUploadParams {
  path: string // e.g. "public/image/1.webp"
  contentBase64: string
  message: string
  token?: string
}

export interface UploadResult {
  success: boolean
  commitSha?: string
  commitUrl?: string
  error?: string
}

export function getStoredGitHubToken(): string {
  try {
    const fromStorage = localStorage.getItem(TOKEN_KEY)
    if (fromStorage && fromStorage.trim()) return fromStorage.trim()
  } catch {
    /* ignore */
  }
  return (import.meta.env.VITE_GITHUB_TOKEN as string) || ''
}

export function storeGitHubToken(token: string): void {
  try {
    if (token.trim()) {
      localStorage.setItem(TOKEN_KEY, token.trim())
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    /* ignore */
  }
}

/**
 * Validates a GitHub Personal Access Token and returns the authenticated user info.
 */
export async function verifyGitHubToken(token: string): Promise<{ valid: boolean; user?: string; error?: string }> {
  if (!token || !token.trim()) {
    return { valid: false, error: 'Token girilmedi' }
  }

  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!res.ok) {
      if (res.status === 401) return { valid: false, error: 'Geçersiz veya süresi dolmuş token.' }
      if (res.status === 403) return { valid: false, error: 'GitHub API hız sınırı veya yetki hatası.' }
      return { valid: false, error: `GitHub Hatası (${res.status})` }
    }

    const data = await res.json()
    return { valid: true, user: data.login || 'GitHub Kullanıcısı' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { valid: false, error: `Bağlantı hatası: ${msg}` }
  }
}

/**
 * Retrieves the current SHA of a file in the repo to allow overwriting.
 */
export async function getFileSha(path: string, token: string): Promise<string | null> {
  try {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${cleanPath}?ref=${TARGET_BRANCH}`

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (res.ok) {
      const data = await res.json()
      return data.sha || null
    }
    return null
  } catch {
    return null
  }
}

/**
 * Uploads (creates or updates) a file in the repository using GitHub REST API.
 */
export async function uploadFileToGitHub({
  path,
  contentBase64,
  message,
  token,
}: GitHubUploadParams): Promise<UploadResult> {
  const activeToken = (token || getStoredGitHubToken()).trim()

  if (!activeToken) {
    return {
      success: false,
      error: 'GitHub Token bulunamadı. Lütfen panel ayarlarından kişisel erişim tokeninizi kaydedin.',
    }
  }

  try {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path

    // 1. Get existing file SHA if any
    const existingSha = await getFileSha(cleanPath, activeToken)

    // 2. Prepare PUT payload
    const body: Record<string, unknown> = {
      message: message || `fix(media): update ${cleanPath}`,
      content: contentBase64,
      branch: TARGET_BRANCH,
    }
    if (existingSha) {
      body.sha = existingSha
    }

    const putUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${cleanPath}`
    const res = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${activeToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      const errMsg = errData.message || `HTTP ${res.status}`
      return {
        success: false,
        error: `GitHub Yükleme Hatası: ${errMsg}`,
      }
    }

    const data = await res.json()
    const commitSha = data.commit?.sha?.substring(0, 7) || ''
    const commitUrl = data.commit?.html_url || `https://github.com/${REPO_OWNER}/${REPO_NAME}/commits/${TARGET_BRANCH}`

    return {
      success: true,
      commitSha,
      commitUrl,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return {
      success: false,
      error: `İstek sırasında hata oluştu: ${msg}`,
    }
  }
}
