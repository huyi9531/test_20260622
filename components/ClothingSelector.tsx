"use client"

import { clothingData } from "@/lib/clothing-data"
import type { ClothingItem } from "@/types"

interface ClothingSelectorProps {
  selected: ClothingItem | null
  onSelect: (clothing: ClothingItem | null) => void
}

const groups = [
  { key: "通用", label: "通用" },
  { key: "男", label: "男款" },
  { key: "女", label: "女款" },
]

export default function ClothingSelector({
  selected,
  onSelect,
}: ClothingSelectorProps) {
  return (
    <fieldset>
      <legend className="text-ink font-display text-tagline mb-4">服装选择</legend>
      <div className="space-y-4">
        {groups.map((group) => {
          const items = clothingData.filter((c) => c.gender === group.key)
          return (
            <div key={group.key}>
              <p className="text-ink-muted-48 font-body text-fine mb-2 tracking-[-0.12px]">
                {group.label}
              </p>
              <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label={group.label + "服装选项"}>
                {group.key === "通用" && (
                  <button
                    onClick={() => onSelect(null)}
                    role="radio"
                    aria-checked={selected === null}
                    aria-label="原始服装"
                    className={`
                      text-left border rounded-md px-3 py-2 transition-all duration-200 cursor-pointer
                      active:scale-[0.97]
                      ${selected === null
                        ? "border-primary ring-1 ring-primary bg-primary/5"
                        : "border-hairline hover:border-primary/40 hover:bg-canvas-parchment"
                      }
                    `}
                  >
                    <p className={`font-body text-caption-strong ${selected === null ? "text-primary" : "text-ink"}`}>
                      原始服装
                    </p>
                  </button>
                )}
                {items.map((item) => {
                  const isSelected = selected?.id === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelect(item)}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={item.name}
                      className={`
                        text-left border rounded-md px-3 py-2 transition-all duration-200 cursor-pointer
                        active:scale-[0.97]
                        ${isSelected
                          ? "border-primary ring-1 ring-primary bg-primary/5"
                          : "border-hairline hover:border-primary/40 hover:bg-canvas-parchment"
                        }
                      `}
                    >
                      <p className={`font-body text-caption-strong ${isSelected ? "text-primary" : "text-ink"}`}>
                        {item.name}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
