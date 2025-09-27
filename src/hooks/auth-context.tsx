'use client'

import { UserRole } from '@/types/enum'
import { createContext, useContext } from 'react'

interface User {
  id: string
  email: string
  role: UserRole
  sub: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
})

export const useAuth = () => useContext(AuthContext)
