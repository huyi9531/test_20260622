const API_URL = "http://plugin.aiconductor.fun/api/generate_image"
const TIMEOUT_MS = 90_000

interface GenerateResponse {
  success: boolean
  message: string
  images: { url?: string; b64_json?: string; size?: string }[]
  model: string
}

export async function generateImage(imageBase64: string, prompt: string): Promise<string> {
  const apiKey = process.env.IMAGE_API_KEY
  if (!apiKey) throw new Error("IMAGE_API_KEY not configured")

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        model: "doubao-seedream-4-5-251128",
        resolution: "2K",
        aspect_ratio: "3:4",
        image: [imageBase64],
        response_format: "url",
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`API error: ${res.status} ${text}`)
    }

    const data: GenerateResponse = await res.json()

    if (!data.success || !data.images?.[0]?.url) {
      throw new Error(data.message || "生成失败")
    }

    return data.images[0].url
  } finally {
    clearTimeout(timer)
  }
}
