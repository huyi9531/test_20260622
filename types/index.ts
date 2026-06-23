export interface ClothingItem {
  id: string
  name: string
  gender: "通用" | "男" | "女"
  description: string
}

export interface BackgroundOption {
  id: string
  name: string
  color: string
  promptColor: string
}
