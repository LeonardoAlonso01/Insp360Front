"use client"

import { useState, useEffect, useCallback } from "react"
import {
  apiClient,
  type Inspection,
  type CreateInspectionApiRequest,
  type UpdateInspectionRequest,
  type ApiInspectionListItem,
} from "@/lib/api"
import { authService } from "@/lib/auth" // Importar authService

interface UseInspectionsOptions {
  page?: number
  limit?: number
  search?: string
  status?: string
  autoFetch?: boolean
}

export function useInspections(options?: UseInspectionsOptions) {
  const { page = 1, limit = 10, search = "", status = "", autoFetch = true } = options || {}

  const [inspections, setInspections] = useState<Inspection[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInspections = useCallback(async () => {
    setLoading(true)
    setError(null)

    const companyId = authService.getCompanyId()
    if (!companyId) {
      setError("Company ID não encontrado. Por favor, faça login novamente.")
      setLoading(false)
      return
    }

    try {
      const apiResponse = await apiClient.getInspections({ page, limit, search, status })

      // Mapear ApiInspectionListItem para Inspection
      const mappedInspections: Inspection[] = apiResponse.map((apiInsp: ApiInspectionListItem) => ({
        id: apiInsp.id,
        cliente: apiInsp.client,
        responsavel: apiInsp.responsible,
        data: apiInsp.inspectionDate,
        status: "pendente", // Status padrão, pois não vem na listagem
        observacoes: "", // Observações padrão, pois não vem na listagem
      }))

      setInspections(mappedInspections)
      setTotal(mappedInspections.length) // A API de listagem não retorna total, então usamos o length
      setTotalPages(1) // Assumindo 1 página se não houver paginação explícita na API
    } catch (err: any) {
      console.error("Erro ao carregar inspeções:", err)
      setError(err.message || "Erro ao carregar inspeções")
      setInspections([])
      setTotal(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, status])

  useEffect(() => {
    if (autoFetch) {
      fetchInspections()
    }
  }, [autoFetch, fetchInspections])

  const createInspection = async (data: CreateInspectionApiRequest) => {
    setLoading(true)
    try {
      const companyId = authService.getCompanyId() // Garantir que o companyId esteja definido

      if (!companyId) {
        throw new Error("Company ID não encontrado. Por favor, faça login novamente.")
      }

      // Adicionar companyId ao data antes de enviar
      const inspectionData: CreateInspectionApiRequest = {
        ...data,
        companyId,
      }

      const newInspection = await apiClient.createInspection(inspectionData)
      await fetchInspections() // Recarregar a lista após a criação
      return newInspection
    } catch (err) {
      setError("Erro ao criar inspeção")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateInspection = async (id: string, data: UpdateInspectionRequest) => {
    setLoading(true)
    try {
      const updatedInspection = await apiClient.updateInspection(id, data)
      await fetchInspections() // Recarregar a lista após a atualização
      return updatedInspection
    } catch (err) {
      setError("Erro ao atualizar inspeção")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteInspection = async (id: string) => {
    setLoading(true)
    try {
      await apiClient.deleteInspection(id)
      await fetchInspections() // Recarregar a lista após a exclusão
    } catch (err) {
      setError("Erro ao excluir inspeção")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const submitEtapa1 = async (data: {
  idInspection: string
  marcaDutoFlexivel: string
  marcaUniao: string
  diametro: number
  comprimentoNominal: number
}) => {
  setLoading(true)
  try {
    const token = authService.getToken() // Se precisar de autenticação
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inspection/item/etapa1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      let errorMsg = "Erro ao enviar os dados da Etapa 1"
      try {
        const errorData = await response.json()
        errorMsg = errorData.message || errorMsg
      } catch (e) {
        // Se não for JSON, mantém a mensagem padrão
      }
      throw new Error(errorMsg)
    }

    // Tenta ler o corpo da resposta, se houver
    let result = null
    try {
      result = await response.json()
    } catch (e) {
      // Se não houver corpo JSON, retorna null
    }
    return result
  } catch (err: any) {
    setError(err.message || "Erro ao enviar os dados da Etapa 1")
    throw err
  } finally {
    setLoading(false)
  }
}

  return {
    inspections,
    total,
    totalPages,
    loading,
    error,
    refetch: fetchInspections,
    createInspection,
    updateInspection,
    deleteInspection,
    submitEtapa1,
  }
}
