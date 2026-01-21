"use client";

import { useEffect } from "react";

export function ScrollIosHtml() {
  useEffect(() => {
    // Проверка на iPhone / iPad / iPod
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);

    // Дополнительная проверка для новых iPad на чипах M1/M2/M3
    const isMacWithTouch =
      navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);

    if (!(ios || isMacWithTouch)) {
      document.getElementsByTagName("html")[0].classList.add("scroll-smooth");
    }
  }, []);

  return <></>;
}
