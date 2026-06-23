import { NextRequest, NextResponse } from "next/server"
import { generateImage } from "@/lib/coze"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageBase64, prompt } = body

    if (!imageBase64 || !prompt) {
      return NextResponse.json(
        { error: "Missing imageBase64 or prompt" },
        { status: 400 }
      )
    }

    const resultImageUrl = await generateImage(imageBase64, prompt)

    return NextResponse.json({ resultImageUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    if (message.includes("aborted") || message.includes("AbortError")) {
      return NextResponse.json(
        { error: "生成超时，请重试" },
        { status: 504 }
      )
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
