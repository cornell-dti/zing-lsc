import React, { useContext } from 'react'
import { User } from 'firebase/auth'
const AuthContext = React.createContext<User | null>(null)

export function AuthProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: User | null
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthValue() {
  return useContext(AuthContext)
}
