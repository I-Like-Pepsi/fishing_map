// 压缩图片
export function compressImage(
  fileOrUrl: string | File,
  quality = 0.8,
  maxWidth = 1920
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      ctx?.drawImage(img, 0, 0, width, height)

      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = reject
    img.src = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl)
  })
}

// 裁剪图片
export function cropImage(
  image: string,
  options: {
    x: number
    y: number
    width: number
    height: number
    aspectRatio?: number
  }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      let { width, height } = options

      if (options.aspectRatio) {
        if (width / height > options.aspectRatio) {
          width = height * options.aspectRatio
        } else {
          height = width / options.aspectRatio
        }
      }

      canvas.width = width
      canvas.height = height

      ctx?.drawImage(
        img,
        options.x,
        options.y,
        width,
        height,
        0,
        0,
        width,
        height
      )

      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.onerror = reject
    img.src = image
  })
}

// 计算图片尺寸
export function calculateImageSize(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = originalWidth / originalHeight

  let width = originalWidth
  let height = originalHeight

  if (width > maxWidth) {
    width = maxWidth
    height = width / ratio
  }

  if (height > maxHeight) {
    height = maxHeight
    width = height * ratio
  }

  return { width: Math.round(width), height: Math.round(height) }
}

// Base64转Blob
export function base64ToBlob(base64: string): Blob {
  const arr = base64.split(',')
  const type = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type })
}

// Blob转File
export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type })
}
