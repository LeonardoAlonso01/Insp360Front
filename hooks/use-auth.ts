"use client"

import { useState, useEffect } from "react"
import { authService, type LoginRequest, type User } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verificar se há usuário logado ao carregar
    const currentUser = authService.getUser()
    const authenticated = authService.isAuthenticated()

    setUser(currentUser)
    setIsAuthenticated(authenticated)
    setLoading(false)
  }, [])

  const login = async (credentials: LoginRequest) => {
    setLoading(true)
    try {
      const response = await authService.login(credentials)

      if (response.token !== null || response.token !== "") {
        setUser(response.user)
        setIsAuthenticated(true)
        return response
      } else {
        throw new Error("Erro no login")
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  }
}
