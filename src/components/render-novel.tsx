"use client";

import { EditorContent } from "novel"
import { defaultExtensions } from "./tailwind/extensions";
import { normalizeEditorValue } from "@/lib/normalize-conten-block";
import { useEffect, useState } from "react";

export const RenderNovel = ({ contentFromDB }: { contentFromDB: string }) => {
  const [content, setContent] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
      try {
        const normalizedContent = normalizeEditorValue(contentFromDB);
        setContent(normalizedContent);
      } catch (error) {
        console.error('Error normalizing content:', error);
        setContent({ type: "doc", content: [] });
      }
    }
  }, [contentFromDB, isMounted]);

  // Тройная проверка для предотвращения SSR
  if (typeof window === 'undefined' || !isMounted || !isClient || !content) {
    return <div className="p-4 text-center text-gray-500">Загрузка контента...</div>;
  }

  return (
    <EditorContent
      initialContent={content}
      editable={false}
      extensions={defaultExtensions}
      immediatelyRender={false}
    />
  )
}
