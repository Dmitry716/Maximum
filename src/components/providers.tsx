"use client"

import React, { useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthContext } from "@/hooks/auth-context"
import { setAuthToken } from "@/lib/auth"
import * as CookieConsent from "vanilla-cookieconsent";

export function Providers({ children, user, token }: { children: React.ReactNode, user: any, token?: string }) {
  let theme = null;

  if (typeof window !== "undefined") {
    theme = localStorage.getItem("theme");
  }
  
  if (token) {
    setAuthToken(token)
  } else {
    setAuthToken(undefined)
  }

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add('cc--darkmode');
    }
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: "box",
          position: "bottom left",
          equalWeightButtons: true,
          flipButtons: false
        },
        preferencesModal: {
          layout: "box",
          position: "right",
          equalWeightButtons: true,
          flipButtons: false
        }
      },
      categories: {
        necessary: {
          readOnly: true
        },
        analytics: {}
      },
      language: {
        default: "en",
        autoDetect: "browser",
        translations: {
          en: {
            consentModal: {
              title: "Обработка файлов cookie",
              description: "Наш сайт использует файлы cookie для улучшения пользовательского опыта, сбора статистики и представления персонализированных рекомендаций. Нажав «Принять», вы даете согласие на обработку файлов cookie в соответствии с Политикой обработки файлов cookie.",
              closeIconLabel: "",
              acceptAllBtn: "Принять",
              acceptNecessaryBtn: "Отклонить",
              showPreferencesBtn: "Подробнее",
            },
            preferencesModal: {
              title: "Настройте параметры использования файлов cookie",
              closeIconLabel: "Close modal",
              acceptAllBtn: "Принять",
              acceptNecessaryBtn: "Отклонить",
              savePreferencesBtn: "Сохранить настройки",
              serviceCounterLabel: "Service|Services",
              sections: [
                {
                  title: "Использование файлов cookie",
                  description: "Вы можете настроить использование каждой категории файлов cookie, за исключением категории «технические (обязательные) cookie», без которых невозможно функционирование сайта.\n\nСайт запоминает ваш выбор настроек на 1 год. По окончании этого периода сайт снова запросит ваше согласие. Вы вправе изменить свой выбор настроек cookie (в т.ч. отозвать согласие) в любое время в интерфейсе сайта путем перехода по ссылке в нижней части страницы сайта «Настройки Cookie»."
                },
                {
                  title: "Технические/функциональные (обязательные) cookie-файлы <span class=\"pm__badge\">Всегда включено</span>",
                  description: "Данный тип cookie-файлов требуется для обеспечения функционирования сайта и не подлежит отключению. Эти сookie-файлы не сохраняют какую-либо информацию о пользователе, которая может быть использована в маркетинговых целях или для учета посещаемых сайтов в сети Интернет.",
                  linkedCategory: "necessary"
                },
                {
                  title: "Аналитические cookie-файлы",
                  description: "Данные cookie-файлы необходимы в статистических целях, позволяют подсчитывать количество и длительность посещений Сайта, анализировать как посетители используют Сайт, что помогает улучшать его производительность и сделать более удобным для использования. Запретить хранение данного типа cookie-файлов можно непосредственно на интернет-сайте либо в настройках браузера.",
                  linkedCategory: "analytics"
                },
                {
                  title: "Рекламные cookie-файлы",
                  description: "Рекламные cookie-файлы используются для целей маркетинга и улучшения качества рекламы (предоставление более актуального и подходящего контента и персонализированного рекламного материала). Запретить хранение данного типа cookie-файлов можно непосредственно на Сайте либо в настройках браузера.",
                  linkedCategory: "analytics"
                },
                {
                  title: "Дополнительная информация",
                  description: "По любым вопросам, касающимся моей политики в отношении файлов cookie и вашего выбора, пожалуйста, <a class=\"cc__link\" href=\"https://maxximum.by/contact\">свяжитесь со мной</a>"
                }
              ]
            }
          }
        }
      }
    });
  }, []);

  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AuthContext.Provider>
  )
}
