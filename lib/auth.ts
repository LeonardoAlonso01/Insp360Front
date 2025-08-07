// Sistema de autenticação
export interface LoginRequest {
  email: string
  password: string
}

// Nova interface de resposta de login conforme o modelo fornecido
export interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    isActive: boolean
    companyId: string
  }
}

export interface User {
  id: string
  name: string
  email: string
  isActive?: boolean // Pode ser opcional se nem sempre vier
  companyId?: string // Pode ser opcional se nem sempre vier
}

class AuthService {
  private readonly TOKEN_KEY = "inspection_token"
  private readonly USER_KEY = "inspection_user"

  // Fazer login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        // Tentar ler a mensagem de erro do corpo da resposta
        const errorData = await response.json().catch(() => ({ message: "Erro desconhecido" }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data: LoginResponse = await response.json()

      // Armazenar token e dados do usuário
      this.setToken(data.token)
      this.setUser(data.user)

      return data
    } catch (error) {
      console.error("Erro no login:", error)
      throw error instanceof Error ? error : new Error("Erro ao tentar fazer login")
    }
  }

  // Fazer logout
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)

      window.location.href = "/" // Redirecionar para a página de login
    }
  }

  // Obter token
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY)
    }
    return null
  }

  // Definir token
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token)
    }
  }

  // Obter usuário
  getUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(this.USER_KEY)
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  // Definir usuário
  setUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    }
  }

  // Obter CompanyId
  getCompanyId(): string | null {
    const user = this.getUser()
    return user?.companyId || null
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser()?.companyId
  }

  // Obter headers com autorização
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}
  }
}

export const authService = new AuthService()
