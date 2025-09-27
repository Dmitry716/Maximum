"use client"

import { StarterKit } from "novel"
import { generateJSON } from "@tiptap/react"

export function normalizeEditorValue(value: any) {
  if (!value) return { type: "doc", content: [] }

  if (typeof value === "string") {
    try {
      return JSON.parse(value)
    } catch {
      if (typeof window !== "undefined") {
        return generateJSON(value, [StarterKit])
      }
      return { type: "doc", content: [] } // server fallback
    }
  }

  if (typeof value === "object") {
    return value
  }

  return { type: "doc", content: [] }
}
