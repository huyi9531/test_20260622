"use client"

import Image from "next/image"
import { Download } from "lucide-react"

interface ResultDisplayProps {
  resultImageUrl: string | null
  isLoading: boolean
}

export default function ResultDisplay({
  resultImageUrl,
  isLoading,
}: ResultDisplayProps) {
  const handleDownload = () => {
    if (!resultImageUrl) return
    const a = document.createElement("a")
    a.href = resultImageUrl
    a.target = "_blank"
    a.rel = "noopener noreferrer"
    a.download = `证照优化_${Date.now()}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4" role="status" aria-label="AI 正在优化中">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-body-muted/30" />
          <div className="absolute inset-0 rounded-full border-2 border-primary-on-dark border-t-transparent animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-body-on-dark font-body text-caption-strong">
            AI 正在优化
          </p>
          <p className="text-body-muted font-body text-fine mt-1">
            预计需要 15-30 秒，请耐心等待
          </p>
        </div>
      </div>
    )
  }

  if (!resultImageUrl) return null

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative rounded-lg shadow-product overflow-hidden">
        <Image
          src={resultImageUrl}
          alt="优化后的证件照"
          width={480}
          height={640}
          className="w-auto h-auto max-h-[calc(100vh-260px)] object-contain"
          unoptimized={true}
          priority
        />
      </div>
      <button
        onClick={handleDownload}
        aria-label="下载优化后的证件照"
        className="
          inline-flex items-center gap-2
          bg-primary-on-dark text-white
          px-5 py-2.5 rounded-pill
          font-body text-caption
          active:scale-95 transition-transform duration-150
          cursor-pointer hover:brightness-110
        "
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        下载图片
      </button>
    </div>
  )
}
