'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  userId: string | null
  userName: string | null
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  userName: null,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
      return
    }

    setIsLoading(false)
  }, [status])

  const value = {
    isAuthenticated: !!session?.user,
    isLoading,
    userId: session?.user?.id as string || null,
    userName: session?.user?.name || null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Higher-order component to protect routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function ProtectedRoute(props: P) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/auth/signin')
      }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
      return <div>Loading...</div>
    }

    return isAuthenticated ? <Component {...props} /> : null
  }
}
