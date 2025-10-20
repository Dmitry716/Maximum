"use client";

import { EditorContent } from "novel"
import { defaultExtensions } from "./tailwind/extensions";
import { normalizeEditorValue } from "@/lib/normalize-conten-block";
import { useEffect, useState } from "react";

export const RenderNovel = ({ contentFromDB }: { contentFromDB: string }) => {
  const [content, setContent] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const normalizedContent = normalizeEditorValue(contentFromDB);
      setContent(normalizedContent);
    } catch (error) {
      console.error('Error normalizing content:', error);
      setContent({ type: "doc", content: [] });
    }
  }, [contentFromDB]);

  if (!isClient || !content) {
    return <div>Загрузка контента...</div>;
  }

  return (
    <EditorContent
      initialContent={content}
      editable={false}
      extensions={defaultExtensions}
    />
  )
}
