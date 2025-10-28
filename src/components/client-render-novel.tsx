"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const RenderNovel = dynamic(() => import("@/components/render-novel").then(mod => ({ default: mod.RenderNovel })), {
  ssr: false,
  loading: () => <div className="p-4 text-center text-gray-500">Загрузка контента...</div>
});

export function ClientRenderNovel({ contentFromDB }: { contentFromDB: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Предотвращаем рендеринг на сервере
  if (!isMounted || typeof window === 'undefined') {
    return <div className="p-4 text-center text-gray-500">Загрузка контента...</div>;
  }

  return <RenderNovel contentFromDB={contentFromDB} />;
}