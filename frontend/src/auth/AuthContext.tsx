import React, { useContext } from 'react'
import { User } from 'firebase/auth'

/*
 * 'loading' = state is currently loading (i.e. requests are currently being made, auth state currently unknown)
 * 'unauthenticated' = you are not logged in
 * 'unauthorized' = you are logged in but unauthorized/not in the allowed_users db
 * 'authorized' = you are authorized/in the allowed_users db/have full access to the application
 */
export type AuthState =
  | 'loading'
  | 'unauthenticated'
  | 'unauthorized'
  | 'authorized'

interface AuthContextType {
  user: User | null
  authState: AuthState
  authToken: string
  setAuthToken: React.Dispatch<React.SetStateAction<string>>
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
