import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import * as auth from '../lib/auth'

type AuthState = {
  isAuthenticated: boolean
  isLoading: boolean
  userEmail: string | null
}

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userEmail: null,
  })

  const refreshAuth = useCallback(async () => {
    try {
      const user = await auth.getCurrentUser()
      if (user) {
        setState({
          isAuthenticated: true,
          isLoading: false,
          userEmail: user.signInDetails?.loginId ?? user.username,
        })
      } else {
        setState({ isAuthenticated: false, isLoading: false, userEmail: null })
      }
    } catch {
      setState({ isAuthenticated: false, isLoading: false, userEmail: null })
    }
  }, [])

  useEffect(() => {
    refreshAuth()
  }, [refreshAuth])

  const login = async (email: string, password: string) => {
    await auth.signIn(email, password)
    await refreshAuth()
  }

  const logout = async () => {
    await auth.signOut()
    setState({ isAuthenticated: false, isLoading: false, userEmail: null })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
