'use client';

import { useEffect } from 'react';

export function DebugMetaTags() {
  useEffect(() => {
    // Логируем все мета-теги
    const allMetas = document.querySelectorAll('meta[property], meta[name], title');
    const headMetas = document.head.querySelectorAll('meta[property], meta[name], title');
    const bodyMetas = document.body.querySelectorAll('meta[property], meta[name], title');
    
    console.log('===== META TAGS DEBUG =====');
    console.log('Total meta tags:', allMetas.length);
    console.log('In HEAD:', headMetas.length);
    console.log('In BODY:', bodyMetas.length);
    
    console.log('\n--- HEAD META TAGS ---');
    headMetas.forEach(meta => {
      const name = meta.getAttribute('property') || meta.getAttribute('name') || 'title';
      const content = meta.getAttribute('content') || meta.textContent?.substring(0, 50) || '';
      console.log(`${name}:`, content);
    });
    
    console.log('\n--- BODY META TAGS ---');
    bodyMetas.forEach(meta => {
      const name = meta.getAttribute('property') || meta.getAttribute('name') || 'title';
      const content = meta.getAttribute('content') || meta.textContent?.substring(0, 50) || '';
      console.log(`${name}:`, content);
    });
    
    console.log('========================\n');
  }, []);
  
  return null;
}
