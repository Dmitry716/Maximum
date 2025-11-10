'use client';

import { useEffect } from 'react';

export function MetadataHead() {
  useEffect(() => {
    console.log('[MetadataHead] Component mounted, cleaning duplicates...');
    
    const head = document.head;
    const body = document.body;
    
    if (!body || !head) return;
    
    // Функция для перемещения и очистки
    const cleanupMetas = () => {
      // Создаем Map всех мета-тегов в head для быстрой проверки
      const headMetasMap = new Map<string, Element>();
      
      // Добавляем существующие head мета-теги
      head.querySelectorAll('meta[property], meta[name]').forEach(meta => {
        const key = meta.getAttribute('property') || meta.getAttribute('name');
        if (key) {
          headMetasMap.set(key, meta);
        }
      });
      
      console.log('[MetadataHead] Head metas found:', headMetasMap.size);
      
      let moved = 0;
      let removed = 0;
      
      // Ищем все мета-теги в body
      const bodyMetas = Array.from(body.querySelectorAll('meta[property], meta[name], title'));
      
      bodyMetas.forEach(meta => {
        const tagName = meta.tagName.toLowerCase();
        const key = meta.getAttribute('property') || meta.getAttribute('name');
        
        // Если это title или мета-тег с property/name, и его нет в head
        if (tagName === 'title' || (key && !headMetasMap.has(key))) {
          // Перемещаем в head
          head.appendChild(meta);
          moved++;
          console.log('[MetadataHead] Moved to head:', key || 'title');
        } else if (key && headMetasMap.has(key)) {
          // Это дубль, удаляем из body
          meta.remove();
          removed++;
          console.log('[MetadataHead] Removed duplicate:', key);
        }
      });
      
      console.log('[MetadataHead] Moved:', moved, 'Removed:', removed);
    };
    
    // Первый проход
    cleanupMetas();
    
    // Второй проход через небольшую задержку
    setTimeout(cleanupMetas, 100);
    
    // Третий проход для верности
    setTimeout(cleanupMetas, 500);
    
  }, []);
  
  return null;
}
