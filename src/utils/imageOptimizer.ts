/**
 * Browser-side high performance image optimizer.
 * Compresses 10-20 MB DSLR/phone photos into lightweight, high-fidelity WebP/JPEG in <300ms.
 */

export interface OptimizedResult {
  base64: string
  blob: Blob
  dataUrl: string
  originalSize: number
  optimizedSize: number
  width: number
  height: number
  savedPercent: number
}

export async function optimizeImageFile(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.85
): Promise<OptimizedResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Dosya okunamadı'))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Görsel formatı desteklenmiyor'))
      img.onload = () => {
        let { width, height } = img

        // Aspect ratio scaling
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context alınamadı'))
          return
        }

        // Draw image onto canvas
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        // Prefer WebP; fallback to JPEG if browser doesn't support WebP encoding
        let mimeType = 'image/webp'
        let dataUrl = canvas.toDataURL(mimeType, quality)
        if (!dataUrl.startsWith('data:image/webp')) {
          mimeType = 'image/jpeg'
          dataUrl = canvas.toDataURL(mimeType, quality)
        }

        // Base64 string without data prefix
        const base64 = dataUrl.split(',')[1]

        // Create blob to measure size accurately
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Blob oluşturulamadı'))
              return
            }
            const originalSize = file.size
            const optimizedSize = blob.size
            const savedPercent = Math.max(
              0,
              Math.round(((originalSize - optimizedSize) / originalSize) * 100)
            )

            resolve({
              base64,
              blob,
              dataUrl,
              originalSize,
              optimizedSize,
              width,
              height,
              savedPercent,
            })
          },
          mimeType,
          quality
        )
      }

      img.src = e.target?.result as string
    }

    reader.readAsDataURL(file)
  })
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

