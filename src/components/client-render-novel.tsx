"use client";

import dynamic from "next/dynamic";

const RenderNovel = dynamic(() => import("@/components/render-novel").then(mod => ({ default: mod.RenderNovel })), {
  ssr: false,
  loading: () => <div>Загрузка контента...</div>
});

export function ClientRenderNovel({ contentFromDB }: { contentFromDB: string }) {
  return <RenderNovel contentFromDB={contentFromDB} />;
}