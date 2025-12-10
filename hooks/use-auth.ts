"use client"

import { useState, useEffect } from "react"
import { authService, type LoginRequest, type User } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    // A validação real da autenticação será feita quando a primeira requisição da API retornar 401
    const checkAuth = () => {
      const cachedUser = authService.getUser()
      if (cachedUser) {
        setUser(cachedUser)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    setLoading(true)
    try {
      const response = await authService.login(credentials)

      // Tokens vêm via cookie HTTP-only, apenas precisamos do usuário
      if (response.user) {
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

  const logout = async () => {
    setLoading(true)
    try {
      await authService.logout()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      // Mesmo com erro, limpar estado local
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  }
}
