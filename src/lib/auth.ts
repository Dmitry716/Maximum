import { jwtVerify } from 'jose'
import axios from 'axios'
import { toast } from 'sonner'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log(error, "XATOLIK");

      toast.error("Сессия истекла. Пожалуйста, войдите снова.");
    }
    if (error.response?.status === 409) {
      toast.error(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!)

    const { payload } = await jwtVerify(token, secret)

    return payload
  } catch (error) {
    console.log("❌ JWT verify failed:", error)
    return null
  }
}

