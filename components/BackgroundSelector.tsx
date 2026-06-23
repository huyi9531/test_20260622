"use client"

import { backgroundOptions } from "@/lib/clothing-data"
import type { BackgroundOption } from "@/types"

interface BackgroundSelectorProps {
  selected: BackgroundOption
  onSelect: (bg: BackgroundOption) => void
}

export default function BackgroundSelector({
  selected,
  onSelect,
}: BackgroundSelectorProps) {
  return (
    <fieldset>
      <legend className="text-ink font-display text-tagline mb-4">背景颜色</legend>
      <div className="flex items-center gap-5" role="radiogroup" aria-label="选择背景颜色">
        {backgroundOptions.map((bg) => {
          const isSelected = selected.id === bg.id
          return (
            <button
              key={bg.id}
              onClick={() => onSelect(bg)}
              role="radio"
              aria-checked={isSelected}
              aria-label={bg.name + "背景"}
              className="group flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-all duration-150"
            >
              <div
                className={`
                  w-11 h-11 rounded-full transition-all duration-200
                  ${
                    isSelected
                      ? "ring-[3px] ring-primary ring-offset-2 ring-offset-white scale-110"
                      : "ring-1 ring-black/[0.08] hover:ring-black/20 hover:scale-105"
                  }
                `}
                style={{ backgroundColor: bg.color }}
              />
              <span
                className={`
                  font-body text-caption transition-colors duration-150
                  ${isSelected ? "text-primary font-semibold" : "text-ink-muted-48"}
                `}
              >
                {bg.name}
              </span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
