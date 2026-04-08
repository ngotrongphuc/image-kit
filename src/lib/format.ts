/**
 * Format a byte count as a human-readable string (e.g. 1.4 MB).
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}

/**
 * Replace the file extension of a filename.
 */
export const replaceExtension = (name: string, newExt: string): string => {
  const dot = name.lastIndexOf('.')
  const base = dot === -1 ? name : name.slice(0, dot)
  return `${base}.${newExt.replace(/^\./, '')}`
}
