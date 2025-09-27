'use client'
import { useEffect, useState } from "react"

export const ReachTextView = ({ text, className }: { text: string, className?: string }) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <p className={className} dangerouslySetInnerHTML={{ __html: text }} />
  );
}