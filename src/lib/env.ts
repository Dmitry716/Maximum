import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  // Схема для серверных переменных (без NEXT_PUBLIC_)
  server: {
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    API_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
  },

  // Схема для клиентских переменных (обязательно NEXT_PUBLIC_)
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_SITE_URL: z.string().url(),
  },

  // Прокидываем значения из process.env (важно для клиентской части)
  runtimeEnv: {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
  },

  emptyStringAsUndefined: true,
});
