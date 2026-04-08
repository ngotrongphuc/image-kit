import JSZip from 'jszip'
import { saveAs } from 'file-saver'

/**
 * Download a single blob with the given filename.
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  saveAs(blob, filename)
}

/**
 * Bundle multiple blobs into a ZIP and download.
 */
export const downloadZip = async (
  files: Array<{ blob: Blob; name: string }>,
  zipName = 'image-kit.zip',
): Promise<void> => {
  const zip = new JSZip()
  for (const { blob, name } of files) {
    zip.file(name, blob)
  }
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, zipName)
}
