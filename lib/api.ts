// Configuração da API com autenticação
import { authService } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Tipos para as requisições
export interface Inspection {
  id: string
  client: string // Corresponde a 'client' na API
  responsible: string // Corresponde a 'responsible' na API
  inspectionDate: string // Corresponde a 'inspectionDate' na API
  result: string 
}

export interface CreateInspectionResponse {
  id: string
}

// Nova interface para o formato de resposta da listagem de inspeções
export interface  ApiInspectionListItem {
  id: string
  inspectionDate: string
  client: string
  responsible: string
  result: string
}

// Novo tipo para a criação de inspeção principal
export interface CreateInspectionApiRequest {
  companyId: string
  client: string
  responsible: string
  result: string // "Aprovado", "Reprovado", "Em Andamento", etc.
  obs?: string
}

// Tipo para a requisição de atualização (mantido como antes, se a API de PUT for diferente)
export interface UpdateInspectionRequest extends Partial<CreateInspectionApiRequest> {
  result?: Inspection["result"] // Mantido para compatibilidade interna
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean // Manter success para compatibilidade com outros endpoints se necessário
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Tipos para as etapas (sem idInspection)
export interface StepRequest {
  [key: string]: any
}

// Tipos para finalização
export interface InspectionItem {
  id: string
  inspectionId: string
  step1Data: any
  step2Data: any
  step3Data: any
  step4Data: any
  step5Data: any
  createdAt: string
}

// Tipo para a requisição de finalização de ITEM
export interface FinalizeInspectionItemRequest {
  idInspection: string,
  key?: string, // Opcional, se necessário para identificar o item
}

// Tipo para a requisição de finalização de INSPEÇÃO PRINCIPAL (se ainda existir)
export interface FinalizeInspectionRequest {
  inspectionId: string
  status: "concluida"
}

// Tipos para gerenciamento de usuários
export interface CompanyUser {
  id: string
  name: string
  email: string
  isActive: boolean
  role: number
  companyId: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role?: string
  companyId: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: string
  isActive?: boolean
}

export interface ResetPasswordRequest {
  userId: string
  newPassword: string
}

// Classe para gerenciar requisições da API
class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    if (!baseURL) {
      console.warn("NEXT_PUBLIC_API_URL não está definido. As requisições da API podem falhar.")
    }
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, isRetry: boolean = false): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const method = options.method || "GET"
    
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...authService.getAuthHeaders(), // Adicionar token no header Authorization
        ...options.headers,
      },
      credentials: "include", // Importante: envia refresh token via cookies HTTP-only automaticamente
      ...options,
    }

    console.log(`[API Request] ${isRetry ? "[RETRY] " : ""}${method} ${url}`)
    console.log(`[API Request] Options:`, {
      method,
      hasBody: !!options.body,
      headers: config.headers,
      credentials: config.credentials,
    })

    try {
      console.log(`[API Request] Enviando requisição para: ${url}`)
      const response = await fetch(url, config)
      
      console.log(`[API Response] Status: ${response.status} ${response.statusText}`)
      console.log(`[API Response] Headers:`, Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        console.log(`[API Response] Erro na resposta: ${response.status}`)
        
        // Nunca fazer refresh em endpoints de autenticação (login, refresh, logout)
        const isAuthEndpoint = endpoint.includes("/Auth/login") || 
                               endpoint.includes("/Auth/refresh") || 
                               endpoint.includes("/Auth/logout")
        
        // Só fazer refresh token se for 401, não for uma tentativa de retry e não for endpoint de auth
        if (response.status === 401 && !isRetry && !isAuthEndpoint) {
          console.log(`[API Request] Token expirado (401), tentando refresh token...`)
          // Token expirado, tentar refresh token
          const refreshed = await authService.refreshToken()
          
          console.log(`[API Request] Refresh token ${refreshed ? "sucesso" : "falhou"}`)
          
          if (refreshed) {
            // Tentar novamente a requisição após refresh (marcar como retry)
            console.log(`[API Request] Refazendo requisição após refresh token`)
            return this.request<T>(endpoint, options, true)
          } else {
            // Refresh falhou, fazer logout
            console.log(`[API Request] Refresh falhou, fazendo logout`)
            await authService.logout()
            throw new Error("Sessão expirada")
          }
        } else if (response.status === 401 && isRetry) {
          // Se ainda for 401 após refresh, fazer logout
          console.log(`[API Request] Ainda recebendo 401 após refresh, fazendo logout`)
          await authService.logout()
          throw new Error("Sessão expirada")
        } else if (response.status === 401 && isAuthEndpoint) {
          // Se for 401 em endpoint de auth, não tentar refresh (erro de credenciais)
          console.log(`[API Request] 401 em endpoint de autenticação, não tentando refresh`)
        }
        
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const text = await response.text();
          console.log(`[API Response] Corpo do erro:`, text)
          if (text) {
            const errorData = JSON.parse(text);
            errorMsg = errorData.message || errorMsg;
            console.error('[API Response] Detalhes do erro:', errorData);
          }
        } catch (e) {
          console.log(`[API Response] Erro ao parsear resposta de erro:`, e)
          // Se não for JSON, mantém a mensagem padrão
        }
        throw new Error(errorMsg);
      }

      // Só tenta fazer .json() se houver corpo
      let data = null;
      const text = await response.text();
      console.log(`[API Response] Texto bruto recebido:`, text)
      console.log(`[API Response] Tamanho do texto:`, text?.length)
      
      if (text) {
        try {
          data = JSON.parse(text);
          console.log(`[API Response] Resposta parseada com sucesso:`, data)
          console.log(`[API Response] Tipo da resposta parseada:`, typeof data, Array.isArray(data))
        } catch (e) {
          console.log(`[API Response] Erro ao parsear JSON:`, e)
          data = text
        }
      } else {
        console.log(`[API Response] Resposta sem corpo`)
      }
      
      console.log(`[API Request] ✅ Requisição concluída com sucesso: ${method} ${url}`)
      return data
    } catch (error) {
      console.error(`[API Request] ❌ Erro na requisição ${method} ${url}:`, error)
      if (error instanceof Error) {
        console.error(`[API Request] Mensagem de erro:`, error.message)
        console.error(`[API Request] Stack:`, error.stack)
      }
      throw {
        message: error instanceof Error ? error.message : "Erro de conexão ou API indisponível",
        status: "offline",
      }
    }
  }

  // Métodos para Inspeções
  async getInspections(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }): Promise<ApiInspectionListItem[]> {
    const companyId = authService.getCompanyId()
    if (!companyId) {
      throw new Error("Company ID não encontrado. Usuário não autenticado ou dados incompletos.")
    }

    const userId = authService.getUser()?.id;

    if (!userId) {
      throw new Error("User ID não encontrado. Usuário não autenticado ou dados incompletos.")
    }

    const searchParams = new URLSearchParams()
    searchParams.append("companyId", companyId)
    searchParams.append("userId", userId)

    if (params?.search){
      searchParams.append("query", params.search)
    }

    const queryString = searchParams.toString()
    const endpoint = `/inspection${queryString ? `?${queryString}` : ""}`

    console.log("Buscando inspeções com endpoint:", endpoint) 

    return this.request<ApiInspectionListItem[]>(endpoint)
  }

  async getInspection(id: string): Promise<Inspection> {
    // Este endpoint pode precisar de ajuste se o formato de retorno for diferente
    // Por enquanto, assume-se que retorna o formato 'Inspection' completo
    return this.request<Inspection>(`/inspection/${id}`)
  }

  // Novo método para criar inspeção principal com o formato da API
  async createInspection(data: {
    companyId: string
    client: string
    responsible: string
    result: string // "Aprovado", "Reprovado", "Em Andamento", etc.
    obs?: string
  }): Promise<CreateInspectionResponse> {
    const companyId = authService.getCompanyId()
    if (!companyId) {
      throw new Error("Company ID não encontrado. Usuário não autenticado ou dados incompletos.")
    }

    const requestBody: CreateInspectionApiRequest = {
      companyId: companyId,
      client: data.client,
      responsible: data.responsible,
      result: "Pendente", // Valor padrão para o início da inspeção
      obs: data.obs,
    }

    // A API de criação retorna um objeto com 'id', 'inspectionDate', 'client', 'responsible'
    // Precisamos mapear isso para o nosso tipo 'Inspection'
    const apiResponse = await this.request<ApiInspectionListItem>("/inspection", {
      method: "POST",
      body: JSON.stringify(requestBody),
    })

    return {
      id: apiResponse.id
    }
  }

  async updateInspection(id: string, data: UpdateInspectionRequest): Promise<Inspection> {
    // Assumindo que o backend ainda espera 'cliente', 'responsavel', 'status'
    console.log(`[API] updateInspection - Atualizando inspeção: ${id}`)
    console.log(`[API] updateInspection - Body sendo enviado:`, JSON.stringify(data, null, 2))
    return this.request<Inspection>(`/inspections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteInspection(id: string): Promise<void> {
    return this.request<void>(`/inspections/${id}`, {
      method: "DELETE",
    })
  }

  // Métodos para estatísticas
  async getStats(): Promise<{
    total: number
    pendentes: number
    em_andamento: number
    concluidas: number
  }> {
    const companyId = authService.getCompanyId()
    if (!companyId) {
      throw new Error("Company ID não encontrado. Usuário não autenticado ou dados incompletos.")
    }
    return this.request<{
      total: number
      pendentes: number
      em_andamento: number
      concluidas: number
    }>(`/inspection/dashboard?companyId=${companyId}`)
  }

  // Métodos para as etapas da inspeção
  async saveStep1(inspectionId: string, data: Omit<StepRequest, "idInspection">): Promise<any> {
    const requestBody = {
      idInspection: inspectionId,
      ...data,
    }
    return this.request(`/inspection/item/etapa1`, {
      method: "POST",
      body: JSON.stringify(requestBody),
    })
  }

  async saveStep2(inspectionId: string, data: Omit<StepRequest, "idInspection">): Promise<any> {
    const requestBody = {
      idInspection: inspectionId,
      ...data,
    }
    return this.request(`/inspection/item/etapa2`, {
      method: "POST",
      body: JSON.stringify(requestBody),
    })
  }

  async saveStep3(inspectionId: string, data: Omit<StepRequest, "idInspection">): Promise<any> {
    const requestBody = {
      idInspection: inspectionId,
      ...data,
    }
    return this.request(`/inspection/item/etapa3`, {
      method: "POST",
      body: JSON.stringify(requestBody),
    })
  }

  async saveStep4(inspectionId: string, data: Omit<StepRequest, "idInspection">): Promise<any> {
    const requestBody = {
      idInspection: inspectionId,
      ...data,
    }
    return this.request(`/inspection/item/etapa4`, {
      method: "POST",
      body: JSON.stringify(requestBody),
    })
  }

  async saveStep5(inspectionId: string, data: Omit<StepRequest, "idInspection">): Promise<any> {
    const requestBody = {
      idInspection: inspectionId,
      ...data,
    }

    console.log("Salvando dados da etapa 5:", requestBody)
    return this.request(`/inspection/item/etapa5`, {
      method: "POST",
      body: JSON.stringify(requestBody),
    })
  }

  // Buscar dados de uma etapa específica
  async getStepData(inspectionId: string, step: number): Promise<any> {
    // Este endpoint pode precisar de ajuste se o formato de retorno for diferente
    return this.request(`/inspections/${inspectionId}/step${step}`)
  }

  // Buscar todos os itens de uma inspeção
  async getInspectionItems(inspectionId: string): Promise<InspectionItem[]> {
    console.log(`[API] getInspectionItems - Buscando itens para inspeção: ${inspectionId}`)
    const result = await this.request<InspectionItem[]>(`/inspection/items/${inspectionId}`)
    console.log(`[API] getInspectionItems - Resultado:`, result)
    return result
  }

  // Atualizar um item de inspeção (ajuste a rota conforme seu backend)
  async updateInspectionItem(itemId: string, data: Partial<InspectionItem>): Promise<void> {
    console.log(`[API] updateInspectionItem - Atualizando item: ${itemId}`)
    console.log(`[API] updateInspectionItem - Body sendo enviado:`, JSON.stringify(data, null, 2))
    await this.request<void>(`/inspection/item/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Salvar/atualizar item com o contrato exato do backend (PUT /api/inspection/item/update)
  async saveInspectionItem(payload: {
    inspectionId: string
    item: string
    pipeBrand?: string
    unionBrand?: string
    diameter?: string
    nominalLength?: string
    type?: number
    manufactureYear?: string | null
    testPressure?: string
    nextInspectionDate?: string | null
    nextMaintenanceDate?: string | null
    actualLength?: string
    coatingShell?: string
    unions?: string
    sleeveLength?: string
    rubberSealing?: string
    marking?: string
    hydrostaticTest?: string
    rewelding?: string
    finalLength?: string
    unionReplacement?: string
    sealingReplacement?: string
    ringReplacements?: string
    newHydrostaticTest?: string
    cleaning?: string
    drying?: string
    finalResult?: string
  }): Promise<void> {
    console.log(`[API] saveInspectionItem - Salvando item de inspeção`)
    console.log(`[API] saveInspectionItem - Body sendo enviado:`, JSON.stringify(payload, null, 2))
    await this.request<void>(`/inspection/item/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }

  // NOVO: Método para finalizar um ITEM da inspeção
  async finalizeInspectionItem(inspectionId: string): Promise<string> {
    // Validação simples de GUID (UUID v4)
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!inspectionId || !guidRegex.test(inspectionId)) {
      console.error("inspectionId inválido para finalizar item:", inspectionId);
      throw new Error("O inspectionId enviado para finalizar o item não é um GUID válido.");
    }
    const requestBody: FinalizeInspectionItemRequest = {
      idInspection: inspectionId,
    }
    console.log("Finalizando item de inspeção:", requestBody)
    return this.request<string>(`/Inspection/item`, {
      method: "POST",
      body: JSON.stringify(requestBody),
    })
  }

  // Método para finalizar a INSPEÇÃO PRINCIPAL (mantido se ainda for usado)
  async finalizeInspection(data: FinalizeInspectionRequest): Promise<Inspection> {
    return this.request(`/inspections/${data.inspectionId}/finalize`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Gerar PDF da inspeção
  async generateInspectionPDF(inspectionId: string): Promise<Blob> {
    const url = `${this.baseURL}/inspections/${inspectionId}/pdf`
    console.log(`[API] generateInspectionPDF - Gerando PDF para inspeção: ${inspectionId}`)
    
    const response = await fetch(url, {
      headers: {
        ...authService.getAuthHeaders(), // Adicionar token no header Authorization
      },
      credentials: "include", // Envia refresh token via cookies
    })

    console.log(`[API] generateInspectionPDF - Status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Erro desconhecido")
      console.error(`[API] generateInspectionPDF - Erro: ${response.status}`, errorText)
      throw new Error(`Erro ao gerar PDF: ${response.status}`)
    }

    console.log(`[API] generateInspectionPDF - ✅ PDF gerado com sucesso`)
    return response.blob()
  }
  // Gerar relatório em PDF da inspeção (novo endpoint)
  async generateInspectionReport(inspectionId: string, isRetry: boolean = false): Promise<Blob> {
    const endpoint = `/inspection/gerarrelatorio?id=${inspectionId}`
    const url = `${this.baseURL}${endpoint}`
    
    console.log(`[API] generateInspectionReport - Gerando relatório para inspeção: ${inspectionId}`)
    
    const config: RequestInit = {
      headers: {
        ...authService.getAuthHeaders(),
      },
      credentials: "include",
    }
    
    console.log(`[API] generateInspectionReport - Fazendo requisição para: ${url}`)
    const response = await fetch(url, config)
    
    console.log(`[API] generateInspectionReport - Status: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      // Se for 401 e não for retry, tentar refresh token
      if (response.status === 401 && !isRetry) {
        console.log(`[API] generateInspectionReport - Token expirado, tentando refresh...`)
        const refreshed = await authService.refreshToken()
        
        if (refreshed) {
          console.log(`[API] generateInspectionReport - Refresh bem-sucedido, refazendo requisição...`)
          return this.generateInspectionReport(inspectionId, true)
        } else {
          await authService.logout()
          throw new Error("Sessão expirada")
        }
      }
      
      const errorText = await response.text().catch(() => "Erro desconhecido")
      console.error(`[API] generateInspectionReport - Erro: ${response.status}`, errorText)
      throw new Error(`Erro ao gerar relatório: ${response.status} - ${errorText}`)
    }
    
    console.log(`[API] generateInspectionReport - ✅ Relatório gerado com sucesso`)
    return response.blob()
  }

  // Tipos para gerenciamento de usuários
  async getCompanyUsers(): Promise<CompanyUser[]> {
    const companyId = authService.getCompanyId()
    if (!companyId) {
      throw new Error("Company ID não encontrado")
    }
    return this.request<CompanyUser[]>(`/users/company/${companyId}`)
  }

  // Buscar usuários usando o novo endpoint /user
  async getUsers(query: string = ""): Promise<CompanyUser[]> {
    const companyId = authService.getCompanyId()
    if (!companyId) {
      throw new Error("Company ID não encontrado")
    }

    const searchParams = new URLSearchParams()
    searchParams.append("query", query)
    searchParams.append("companyId", companyId)

    const endpoint = `/user?${searchParams.toString()}`
    
    console.log(`[API] getUsers - Endpoint: ${endpoint}`)
    console.log(`[API] getUsers - Query: ${query}, CompanyId: ${companyId}`)
    
    // O retorno da API vem em PascalCase, precisamos mapear para camelCase
    interface ApiUserResponse {
      Id: string
      Name: string
      Email: string
      IsActive: boolean
      Role: number
    }

    try {
      const response = await this.request<any>(endpoint)
      console.log(`[API] getUsers - Resposta bruta recebida:`, response)
      console.log(`[API] getUsers - Tipo da resposta:`, typeof response)
      console.log(`[API] getUsers - É array?:`, Array.isArray(response))
      
      // Se a resposta for null ou undefined
      if (!response) {
        console.warn(`[API] getUsers - Resposta é null ou undefined`)
        return []
      }
      
      // Verificar se a resposta é um array
      if (!Array.isArray(response)) {
        console.log(`[API] getUsers - Resposta não é um array direto, verificando wrappers...`)
        // Se não for array, pode estar dentro de um objeto wrapper
        if (response && typeof response === 'object') {
          // Tentar diferentes propriedades comuns
          const possibleArray = response.data || response.users || response.items || response.result || []
          console.log(`[API] getUsers - Array encontrado em wrapper:`, possibleArray)
          if (Array.isArray(possibleArray)) {
            return this.mapUsers(possibleArray, companyId)
          }
          // Se não encontrou array, pode ser que o objeto seja um único usuário
          if (response.Id || response.id) {
            console.log(`[API] getUsers - Resposta é um único usuário, convertendo para array`)
            return this.mapUsers([response], companyId)
          }
        }
        console.warn(`[API] getUsers - Não foi possível extrair array da resposta:`, response)
        return []
      }


      
      // Mapear de PascalCase para camelCase
      const mapped = this.mapUsers(response, companyId)
      console.log(`[API] getUsers - Usuários mapeados:`, mapped)
      return mapped
    } catch (error) {
      console.error(`[API] getUsers - Erro na requisição:`, error)
      throw error
    }
  }

  // Método auxiliar para mapear usuários
  private mapUsers(apiUsers: any[], companyId: string): CompanyUser[] {
    if (!Array.isArray(apiUsers) || apiUsers.length === 0) {
      console.log(`[API] mapUsers - Array vazio ou inválido:`, apiUsers)
      return []
    }
    
    return apiUsers.map((user, index) => {
      console.log(`[API] mapUsers - Mapeando usuário ${index}:`, user)
      
      if (!user) {
        console.warn(`[API] mapUsers - Usuário ${index} é null ou undefined`)
        return null
      }
      
      // Suportar tanto PascalCase quanto camelCase
      const mapped = {
        id: user.Id || user.id || '',
        name: user.Name || user.name || '',
        email: user.Email || user.email || '',
        isActive: user.IsActive !== undefined ? user.IsActive : (user.isActive !== undefined ? user.isActive : true),
        role: user.Role !== undefined ? user.Role : (user.role !== undefined ? (typeof user.role === 'number' ? user.role : parseInt(user.role || '2')) : 2),
        companyId: companyId
      }
      
      console.log(`[API] mapUsers - Usuário ${index} mapeado:`, mapped)
      
      // Validar se os campos obrigatórios estão presentes
      if (!mapped.id || !mapped.name || !mapped.email) {
        console.warn(`[API] mapUsers - Usuário ${index} tem campos faltando:`, mapped)
      }
      
      return mapped
    }).filter((user): user is CompanyUser => user !== null)
  }

  async createUser(data: CreateUserRequest): Promise<CompanyUser> {
    return this.request<CompanyUser>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateUser(userId: string, data: UpdateUserRequest): Promise<CompanyUser> {
    return this.request<CompanyUser>(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async resetUserPassword(userId: string): Promise<{ TemporaryPassword?: string; temporaryPassword?: string }> {
    console.log(`[API] resetUserPassword - Resetando senha para userId: ${userId}`)
    const response = await this.request<any>(`/user/resetpassword`, {
      method: "PUT",
      body: JSON.stringify({ userId }),
    })
    console.log(`[API] resetUserPassword - Resposta recebida:`, response)
    console.log(`[API] resetUserPassword - Tipo da resposta:`, typeof response)
    console.log(`[API] resetUserPassword - TemporaryPassword (PascalCase):`, response?.TemporaryPassword)
    console.log(`[API] resetUserPassword - temporaryPassword (camelCase):`, response?.temporaryPassword)
    
    // Normalizar para garantir que sempre retornamos TemporaryPassword
    const password = response?.TemporaryPassword || response?.temporaryPassword || ""
    console.log(`[API] resetUserPassword - Senha extraída:`, password ? "***" : "(vazia)")
    
    return {
      TemporaryPassword: password,
    }
  }

  async deleteUser(userId: string): Promise<void> {
    return this.request<void>(`/users/${userId}`, {
      method: "DELETE",
    })
  }

  // Buscar dados agregados do dashboard (novo endpoint)
  async getDashboardData(): Promise<{
    total: number
    pending: number
    inProgress: number
    completed: number
    completionRate: number
  }> {
    const companyId = authService.getCompanyId()
    const userId = authService.getUser()?.id // ajuste conforme seu authService
    if (!companyId || !userId) {
      throw new Error("CompanyId ou UserId não encontrado.")
    }
    return this.request(`/inspection/dashboarddata?companyId=${companyId}&userId=${userId}`)
  }

  // Completar inspeção (novo endpoint)
  async completeInspection(inspectionId: string): Promise<void> {
    return this.request<void>(`/inspection/complete/${inspectionId}`, {
      method: "PUT",
    })
  }

  // Copiar item de inspeção
  async copyInspectionItem(inspectionId: string, itemId: string, copies: number): Promise<{ item: string }> {
    const requestBody = {
      id: itemId,
      numberOfCopies: copies,
    }
    
    console.log("Copiando item de inspeção:", requestBody)
    return this.request<{ item: string }>(`/inspection/item/copyitem`, {
      method: "POST",
      body: JSON.stringify(requestBody),
    })
  }
}

// Instância singleton da API
export const apiClient = new ApiClient()

// Hook personalizado para usar a API
export const useApi = () => {
  return apiClient
}
