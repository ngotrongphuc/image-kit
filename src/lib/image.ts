/**
 * Load an image file into an HTMLImageElement.
 */
export const loadImage = (file: File | Blob): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(err)
    }
    img.src = url
  })

/**
 * Draw an image to a canvas at the requested size and export as a Blob.
 */
export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas export failed'))
          return
        }
        resolve(blob)
      },
      type,
      quality,
    )
  })

/**
 * Render a File into a resized canvas. If width/height omitted, uses natural size.
 */
export const renderToCanvas = async (
  file: File,
  targetWidth?: number,
  targetHeight?: number,
): Promise<HTMLCanvasElement> => {
  const img = await loadImage(file)
  const canvas = document.createElement('canvas')
  canvas.width = targetWidth ?? img.naturalWidth
  canvas.height = targetHeight ?? img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas
}
