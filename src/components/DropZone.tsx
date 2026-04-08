import { useDropzone, type Accept } from 'react-dropzone'
import { UploadCloud } from 'lucide-react'
import { cn } from '@/lib/cn'

type DropZoneProps = {
  onFiles: (files: File[]) => void
  accept?: Accept
  multiple?: boolean
}

export const DropZone = ({ onFiles, accept, multiple = true }: DropZoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => onFiles(files),
    accept: accept ?? { 'image/*': [] },
    multiple,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition',
        isDragActive
          ? 'border-brand-500 bg-brand-50'
          : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50',
      )}
    >
      <input {...getInputProps()} />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <UploadCloud className="h-7 w-7" />
      </div>
      <div className="text-base font-medium">
        {isDragActive ? 'Drop images here' : 'Drag & drop images, or click to browse'}
      </div>
      <div className="text-xs text-slate-500">
        PNG, JPG, WebP, GIF — processed entirely in your browser
      </div>
    </div>
  )
}
