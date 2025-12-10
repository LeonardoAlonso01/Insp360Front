// Sistema de autenticação com cookies HTTP-only
export interface LoginRequest {
  email: string
  password: string
}

// Interface de resposta de login - tokens vêm via cookie HTTP-only
// Os tokens no JSON são ignorados, pois são enviados via cookie
export interface LoginResponse {
  token?: string // Ignorado - token vem via cookie HTTP-only
  refreshToken?: string // Ignorado - refresh token vem via cookie HTTP-only
  user: {
    id: string
    name: string
    email: string
    isActive: boolean
    companyId: string
    role?: number | string // Role pode ser número (0, 1) ou string ("Admin", "User")
  }
  requiresChangePassword?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  isActive?: boolean // Pode ser opcional se nem sempre vier
  companyId?: string // Pode ser opcional se nem sempre vier
  role?: number | string // Role do usuário (ex: 0, 1 ou "Admin", "User")
}

class AuthService {
  private readonly USER_KEY = "inspection_user"
  private readonly TOKEN_KEY = "inspection_token" // Armazenar token para usar no header Authorization
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

  // Fazer login - access token vem no JSON, refresh token vem via cookie HTTP-only
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const loginUrl = `${this.API_BASE_URL}/Auth/login`
      console.log(`[Auth] Iniciando login para: ${credentials.email}`)
      console.log(`[Auth] URL: ${loginUrl}`)
      console.log(`[Auth] Enviando requisição de login...`)

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Importante: envia cookies
        body: JSON.stringify(credentials),
      })

      console.log(`[Auth] Resposta do login: ${response.status} ${response.statusText}`)
      console.log(`[Auth] Headers da resposta:`, Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        // Tentar ler a mensagem de erro do corpo da resposta
        const errorText = await response.text().catch(() => "Erro desconhecido")
        console.error(`[Auth] ❌ Erro no login: ${response.status}`, errorText)
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText }
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data: LoginResponse = await response.json()
      console.log(`[Auth] ✅ Login bem-sucedido`)
      console.log(`[Auth] Dados do usuário recebidos:`, {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        companyId: data.user.companyId,
        role: data.user.role,
      })
      console.log(`[Auth] Access token no JSON:`, data.token ? "presente" : "ausente")
      console.log(`[Auth] Refresh token vem via cookie HTTP-only (não armazenado)`)

      // Armazenar dados do usuário
      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        isActive: data.user.isActive,
        companyId: data.user.companyId,
        role: data.user.role,
      }
      this.setUser(user)
      
      // Armazenar access token no localStorage para usar no header Authorization
      // Refresh token fica apenas nos cookies HTTP-only (não armazenado)
      if (data.token) {
        this.setToken(data.token)
        console.log(`[Auth] Access token armazenado no localStorage para uso no header Authorization`)
      }
      
      console.log(`[Auth] Usuário armazenado no localStorage`)

      return data
    } catch (error) {
      console.error(`[Auth] ❌ Erro no login:`, error)
      if (error instanceof Error) {
        console.error(`[Auth] Mensagem:`, error.message)
        console.error(`[Auth] Stack:`, error.stack)
      }
      throw error instanceof Error ? error : new Error("Erro ao tentar fazer login")
    }
  }

  // Refresh token - solicita novo access token usando o refresh token do cookie
  async refreshToken(): Promise<boolean> {
    try {
      console.log(`[Auth] Iniciando refresh token...`)
      
      // Obter userId do usuário atual
      const user = this.getUser()
      if (!user || !user.id) {
        console.error(`[Auth] ❌ Usuário não encontrado para refresh token`)
        return false
      }

      console.log(`[Auth] Usuário encontrado: ${user.id} (${user.email})`)
      const refreshUrl = `${this.API_BASE_URL}/Auth/refresh`
      const requestBody = { userId: user.id }
      
      console.log(`[Auth] Enviando requisição de refresh para: ${refreshUrl}`)
      console.log(`[Auth] Body:`, requestBody)

      const response = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Envia cookies (incluindo refresh token)
        body: JSON.stringify(requestBody),
      })

      console.log(`[Auth] Resposta do refresh: ${response.status} ${response.statusText}`)
      console.log(`[Auth] Headers da resposta:`, Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Erro ao ler resposta")
        console.error(`[Auth] ❌ Refresh token falhou: ${response.status}`, errorText)
        return false
      }

      // O novo access token deve vir no JSON da resposta
      // Refresh token continua nos cookies HTTP-only
      try {
        const responseData = await response.json().catch(() => null)
        if (responseData?.token) {
          this.setToken(responseData.token)
          console.log(`[Auth] Novo access token armazenado do JSON da resposta`)
        } else {
          console.warn(`[Auth] ⚠️ Novo access token não veio no JSON da resposta`)
        }
      } catch (e) {
        console.error(`[Auth] Erro ao processar resposta do refresh:`, e)
        // Se não conseguir obter o token, retornar false
        return false
      }
      
      console.log(`[Auth] ✅ Refresh token realizado com sucesso`)
      return true
    } catch (error) {
      console.error(`[Auth] ❌ Erro ao fazer refresh do token:`, error)
      if (error instanceof Error) {
        console.error(`[Auth] Mensagem:`, error.message)
        console.error(`[Auth] Stack:`, error.stack)
      }
      return false
    }
  }

  // Verificar autenticação atual - busca dados do usuário da API
  // NOTA: Endpoint /Auth/me não existe no backend, método desabilitado
  // A validação da autenticação será feita automaticamente quando uma requisição retornar 401
  // async verifyAuth(): Promise<User | null> {
  //   try {
  //     const response = await fetch(`${this.API_BASE_URL}/Auth/me`, {
  //       method: "GET",
  //       credentials: "include", // Envia cookies
  //     })

  //     if (!response.ok) {
  //       return null
  //     }

  //     const user: User = await response.json()
  //     this.setUser(user)
  //     return user
  //   } catch (error) {
  //     console.error("Erro ao verificar autenticação:", error)
  //     return null
  //   }
  // }

  // Fazer logout
  async logout(): Promise<void> {
    try {
      // Chamar endpoint de logout para limpar cookies no servidor
      await fetch(`${this.API_BASE_URL}/Auth/logout`, {
        method: "POST",
        credentials: "include", // Envia cookies para o servidor limpar
      })
    } catch (error) {
      console.error("Erro ao fazer logout no servidor:", error)
    } finally {
      // Limpar dados locais
      if (typeof window !== "undefined") {
        localStorage.removeItem(this.USER_KEY)
        localStorage.removeItem(this.TOKEN_KEY)
        window.location.href = "/" // Redirecionar para a página de login
      }
    }
  }

  // Obter usuário do localStorage
  getUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(this.USER_KEY)
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  // Definir usuário no localStorage
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

  // Verificar se está autenticado (verifica se há usuário)
  // Para verificação real, use verifyAuth()
  isAuthenticated(): boolean {
    return !!this.getUser()?.companyId
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

  // Headers de autenticação - envia access token no header Authorization
  // Refresh token é enviado automaticamente via cookies HTTP-only (credentials: "include")
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}
  }

  // Helper para normalizar role (converte número para string)
  // 0 = "admin", 1 = "supervisor", 2 = "inspector"
  normalizeRole(role?: number | string): string {
    if (typeof role === "number") {
      if (role === 0) return "admin"
      if (role === 1) return "supervisor"
      if (role === 2) return "inspector"
      return "inspector" // Default
    }
    if (typeof role === "string") {
      return role.toLowerCase()
    }
    return "inspector" // Default
  }

  // Obter nome da role formatado
  getRoleName(role?: number | string): string {
    const normalized = this.normalizeRole(role)
    if (normalized === "admin") return "Administrador"
    if (normalized === "supervisor") return "Supervisor"
    if (normalized === "inspector") return "Inspetor"
    return "Inspetor"
  }

  // Verificar se o usuário é admin
  isAdmin(user?: User | null): boolean {
    if (!user) return false
    if (typeof user.role === "number") {
      return user.role === 0
    }
    const normalizedRole = this.normalizeRole(user.role)
    return normalizedRole === "admin"
  }

  // Verificar se o usuário é admin ou supervisor
  isAdminOrSupervisor(user?: User | null): boolean {
    if (!user) return false
    if (typeof user.role === "number") {
      return user.role === 0 || user.role === 1
    }
    const normalizedRole = this.normalizeRole(user.role)
    return normalizedRole === "admin" || normalizedRole === "supervisor"
  }
}

export const authService = new AuthService()

// Helper utilitário para normalizar role (pode ser usado nos componentes)
// 0 = "admin", 1 = "supervisor", 2 = "inspector"
export function normalizeRole(role?: number | string): string {
  if (typeof role === "number") {
    if (role === 0) return "admin"
    if (role === 1) return "supervisor"
    if (role === 2) return "inspector"
    return "inspector" // Default
  }
  if (typeof role === "string") {
    return role.toLowerCase()
  }
  return "inspector" // Default
}

// Obter nome da role formatado
export function getRoleName(role?: number | string): string {
  const normalized = normalizeRole(role)
  if (normalized === "admin") return "Administrador"
  if (normalized === "supervisor") return "Supervisor"
  if (normalized === "inspector") return "Inspetor"
  return "Inspetor"
}

// Helper para verificar se role é admin
export function isAdminRole(role?: number | string): boolean {
  if (typeof role === "number") {
    return role === 0
  }
  return normalizeRole(role) === "admin"
}

// Helper para verificar se role é admin ou supervisor
export function isAdminOrSupervisorRole(role?: number | string): boolean {
  if (typeof role === "number") {
    return role === 0 || role === 1
  }
  const normalized = normalizeRole(role)
  return normalized === "admin" || normalized === "supervisor"
}
