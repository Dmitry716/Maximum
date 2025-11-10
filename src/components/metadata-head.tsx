'use client';

import { useEffect } from 'react';

export function MetadataHead() {
  useEffect(() => {
    // Удаляем дублирующиеся мета-теги из body если они есть
    const head = document.head;
    const body = document.body;
    
    if (!body || !head) return;
    
    // Получаем все существующие мета-теги в head
    const headMetas = new Map<string, Element>();
    head.querySelectorAll('meta[property], meta[name], title').forEach(meta => {
      const prop = meta.getAttribute('property') || meta.getAttribute('name') || 'title';
      headMetas.set(prop, meta);
    });
    
    // Ищем дублирующиеся в body и удаляем их
    body.querySelectorAll('meta[property], meta[name], title').forEach(meta => {
      const prop = meta.getAttribute('property') || meta.getAttribute('name') || 'title';
      if (headMetas.has(prop)) {
        // Это дубль, удаляем из body
        meta.remove();
      }
    });
  }, []);
  
  return null;
}
