// Configuração da API com autenticação
import { authService } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Tipos para as requisições
export interface Inspection {
  id: string
  cliente: string // Corresponde a 'client' na API
  responsavel: string // Corresponde a 'responsible' na API
  data: string // Corresponde a 'inspectionDate' na API
  result: string
  observacoes?: string // Não vem na listagem, será padrão
  createdAt?: string
  updatedAt?: string
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

// Classe para gerenciar requisições da API
class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    if (!baseURL) {
      console.warn("NEXT_PUBLIC_API_URL não está definido. As requisições da API podem falhar.")
    }
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...authService.getAuthHeaders(), // Adicionar token automaticamente
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado, fazer logout
          authService.logout()
          window.location.href = "/"
          throw new Error("Sessão expirada")
        }
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const text = await response.text();
          if (text) {
            const errorData = JSON.parse(text);
            errorMsg = errorData.message || errorMsg;
            console.error('API error details:', errorData);
          }
        } catch (e) {
          // Se não for JSON, mantém a mensagem padrão
        }
        throw new Error(errorMsg);
      }

      // Só tenta fazer .json() se houver corpo
      let data = null;
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
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
    return this.request<Inspection>(`/inspections/${id}`)
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
    return this.request(`/inspections/${inspectionId}/items`)
  }

  // NOVO: Método para finalizar um ITEM da inspeção
  async finalizeInspectionItem(inspectionId: string): Promise<void> {
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
    return this.request<void>(`/Inspection/item`, {
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
    const response = await fetch(`${this.baseURL}/inspections/${inspectionId}/pdf`, {
      headers: {
        ...authService.getAuthHeaders(),
      },
    })

    if (!response.ok) {
      throw new Error("Erro ao gerar PDF")
    }

    return response.blob()
  }
  // Gerar relatório em PDF da inspeção (novo endpoint)
  async generateInspectionReport(inspectionId: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/inspection/gerarrelatorio?id=${inspectionId}`, {
      headers: {
        ...authService.getAuthHeaders(),
      },
    })
    if (!response.ok) {
      throw new Error("Erro ao gerar relatório")
    }
    return response.blob()
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
}

// Instância singleton da API
export const apiClient = new ApiClient()

// Hook personalizado para usar a API
export const useApi = () => {
  return apiClient
}
