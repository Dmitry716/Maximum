"use client";

import { EditorContent } from "novel"
import { defaultExtensions } from "./tailwind/extensions";
import { normalizeEditorValue } from "@/lib/normalize-conten-block";

export const RenderNovel = ({ contentFromDB }: { contentFromDB: string }) => {

  const parseJsonSafely = (input: string): any | undefined => {
    try {
      const parsed = JSON.parse(input);
      return typeof parsed === "object" && parsed !== null ? parsed : undefined;
    } catch {
      return undefined;
    }
  };  
  return (
    <EditorContent
      initialContent={normalizeEditorValue(contentFromDB)}
      editable={false}
      extensions={defaultExtensions}
    />
  )
}
