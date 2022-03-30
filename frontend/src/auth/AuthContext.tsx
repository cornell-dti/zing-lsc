import React, { useContext } from 'react'
import { User } from 'firebase/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  token: string
}

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: AuthContextType
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthValue() {
  return useContext(AuthContext)
}
