"use client"

import { useState } from "react"
import ImageUploader from "@/components/ImageUploader"
import BackgroundSelector from "@/components/BackgroundSelector"
import ClothingSelector from "@/components/ClothingSelector"
import ResultDisplay from "@/components/ResultDisplay"
import { assemblePrompt } from "@/lib/prompt"
import { backgroundOptions } from "@/lib/clothing-data"
import type { BackgroundOption, ClothingItem } from "@/types"

export default function Home() {
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [background, setBackground] = useState<BackgroundOption>(backgroundOptions[0])
  const [clothing, setClothing] = useState<ClothingItem | null>(null)
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canOptimize = imageBase64 && background && !isOptimizing

  const handleOptimize = async () => {
    if (!imageBase64 || !background) return

    setIsOptimizing(true)
    setError(null)
    setResultImageUrl(null)

    const prompt = assemblePrompt(background.promptColor, clothing)

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, prompt }),
      })

      setIsOptimizing(false)

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error || "优化失败，请重试")
        return
      }

      const data = await res.json()
      setResultImageUrl(data.resultImageUrl)
    } catch {
      setIsOptimizing(false)
      setError("网络错误，请检查连接后重试")
    }
  }

  const handleReset = () => {
    setImageBase64(null)
    setBackground(backgroundOptions[0])
    setClothing(null)
    setResultImageUrl(null)
    setError(null)
  }

  return (
    <div className="min-h-[calc(100vh-44px)] flex flex-col md:flex-row">
      {/* 左侧：暗色tile + 上传/结果展示 */}
      <div className="w-full md:w-[42%] bg-surface-tile-1 flex flex-col items-center justify-center p-6 md:p-10 relative min-h-[360px] md:min-h-0">
        {resultImageUrl ? (
          <ResultDisplay
            resultImageUrl={resultImageUrl}
            isLoading={isOptimizing}
          />
        ) : (
          <ImageUploader
            imageBase64={imageBase64}
            onImageReady={setImageBase64}
            onRemove={handleReset}
          />
        )}
      </div>

      {/* 右侧：白底配置区 */}
      <div className="w-full md:w-[58%] bg-canvas flex flex-col px-6 md:px-10 pt-6 pb-8 overflow-y-auto">
        {/* 背景色 */}
        <div className="mb-7">
          <BackgroundSelector selected={background} onSelect={setBackground} />
        </div>

        {/* 服装选择 */}
        <div className="mb-7">
          <ClothingSelector selected={clothing} onSelect={setClothing} />
        </div>

        {/* 分隔线 */}
        <div className="border-t border-divider-soft my-2" />

        {/* 操作按钮 */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handleOptimize}
            disabled={!canOptimize}
            aria-label={isOptimizing ? "优化中" : "开始优化证件照"}
            className={`
              inline-flex items-center justify-center
              px-8 py-3 rounded-pill
              font-body text-button-large font-light
              transition-all duration-200 cursor-pointer
              ${
                canOptimize
                  ? "bg-primary text-white active:scale-95 hover:bg-primary-focus"
                  : "bg-canvas-parchment text-ink-muted-48 cursor-not-allowed"
              }
            `}
          >
            {isOptimizing ? "优化中..." : "开始优化"}
          </button>

          {(imageBase64 || resultImageUrl) && (
            <button
              onClick={handleReset}
              className="text-primary font-body text-caption hover:underline cursor-pointer transition-colors"
              aria-label="重新开始"
            >
              重新开始
            </button>
          )}
        </div>

        {/* 错误信息 */}
        {error && (
          <p className="text-red-500 font-body text-caption mt-3" role="alert">{error}</p>
        )}

        {/* 底部信息 */}
        <p className="text-ink-muted-48 font-body text-fine mt-auto pt-6 tracking-[-0.12px]">
          上传正面人像 → 选择背景与服装 → AI 生成标准证件照
        </p>
      </div>
    </div>
  )
}
