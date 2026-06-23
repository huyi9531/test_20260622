"use client"

import { useCallback, useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploaderProps {
  imageBase64: string | null
  onImageReady: (base64: string) => void
  onRemove: () => void
}

export default function ImageUploader({
  imageBase64,
  onImageReady,
  onRemove,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const readFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("请上传图片文件")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("文件大小不能超过10MB")
      return
    }

    setError(null)
    setIsReading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setIsReading(false)
      onImageReady(result)
    }
    reader.onerror = () => {
      setIsReading(false)
      setError("读取文件失败")
    }
    reader.readAsDataURL(file)
  }, [onImageReady])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) readFile(file)
    },
    [readFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) readFile(file)
    },
    [readFile]
  )

  if (imageBase64) {
    return (
      <div className="relative inline-flex flex-col items-center">
        <img
          src={imageBase64}
          alt="已上传的原始照片"
          className="max-h-[calc(100vh-220px)] max-w-full rounded-lg object-contain shadow-product"
        />
        <button
          onClick={onRemove}
          aria-label="移除已上传照片"
          className="absolute -top-2 -right-2 w-7 h-7 bg-surface-chip-translucent text-white rounded-full flex items-center justify-center active:scale-95 transition-transform cursor-pointer backdrop-blur-sm"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`block
          relative border border-dashed rounded-lg p-12
          flex flex-col items-center justify-center gap-4
          transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? "border-primary-on-dark bg-primary-on-dark/5"
              : "border-body-muted/30 hover:border-primary-on-dark/50"
          }
          ${isReading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        {isReading ? (
          <>
            <Loader2 className="w-8 h-8 text-primary-on-dark animate-spin" aria-hidden="true" />
            <p className="text-body-muted font-body text-caption">读取中...</p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-body-muted" aria-hidden="true" />
            <div className="text-center">
              <p className="text-body-on-dark font-body text-caption-strong">
                拖拽照片到此处
              </p>
              <p className="text-body-muted font-body text-fine mt-1">
                或点击选择（JPG/PNG，≤10MB）
              </p>
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isReading}
          aria-label="选择照片文件"
        />
      </label>
      {error && (
        <p className="text-red-400 font-body text-fine mt-2 text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
