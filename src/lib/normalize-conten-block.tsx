"use client"

import { StarterKit } from "novel"
import { generateJSON } from "@tiptap/react"

export function normalizeEditorValue(value: any) {
  if (!value) return { type: "doc", content: [] }

  if (typeof value === "string") {
    try {
      return JSON.parse(value)
    } catch {
      // Только в клиентской среде пытаемся использовать generateJSON
      if (typeof window !== "undefined") {
        try {
          return generateJSON(value, [StarterKit])
        } catch (error) {
          console.error('Error generating JSON from HTML:', error);
          return { type: "doc", content: [] }
        }
      }
      return { type: "doc", content: [] } // server fallback
    }
  }

  if (typeof value === "object") {
    return value
  }

  return { type: "doc", content: [] }
}
