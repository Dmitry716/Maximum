"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Полностью клиентский компонент для рендеринга Novel контента
const NovelRenderer = dynamic(
  () => import("./render-novel").then(mod => ({ default: mod.RenderNovel })),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 text-center text-gray-500 min-h-[100px] flex items-center justify-center">
        <div className="animate-pulse">Загрузка контента...</div>
      </div>
    ),
  }
);

export function ClientOnlyRenderNovel({ contentFromDB }: { contentFromDB: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Проверяем, что мы находимся в браузере
  if (!mounted || typeof window === 'undefined') {
    return (
      <div className="p-4 text-center text-gray-500 min-h-[100px] flex items-center justify-center">
        <div className="animate-pulse">Загрузка контента...</div>
      </div>
    );
  }

  return <NovelRenderer contentFromDB={contentFromDB} />;
}