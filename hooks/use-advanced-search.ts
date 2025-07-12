"use client"

import { useState, useMemo } from "react"
import { useLocalStorage } from "./use-local-storage"
import type { AdvancedSearchFilters } from "@/components/advanced-search"
import type { Inspection } from "@/lib/api"

interface UseAdvancedSearchOptions {
  inspections: Inspection[]
  initialFilters?: Partial<AdvancedSearchFilters>
}

export function useAdvancedSearch({ inspections, initialFilters }: UseAdvancedSearchOptions) {
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    searchTerm: "",
    cliente: "",
    responsavel: "",
    status: [],
    dataInicio: "",
    dataFim: "",
    observacoes: "",
    hasObservacoes: null,
    ...initialFilters,
  })

  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>("recent-searches", [])

  // Filtrar inspeções baseado nos filtros
  const filteredInspections = useMemo(() => {
    return inspections.filter((inspection) => {
      // Busca geral (cliente, responsável, observações)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const matchesGeneral =
          inspection.cliente.toLowerCase().includes(searchLower) ||
          inspection.responsavel.toLowerCase().includes(searchLower) ||
          (inspection.observacoes && inspection.observacoes.toLowerCase().includes(searchLower))

        if (!matchesGeneral) return false
      }

      // Filtro por cliente específico
      if (filters.cliente) {
        if (!inspection.cliente.toLowerCase().includes(filters.cliente.toLowerCase())) {
          return false
        }
      }

      // Filtro por responsável específico
      if (filters.responsavel) {
        if (inspection.responsavel !== filters.responsavel) {
          return false
        }
      }

      // Filtro por status
      if (filters.status.length > 0) {
        if (!filters.status.includes(inspection.status)) {
          return false
        }
      }

      // Filtro por data
      if (filters.dataInicio || filters.dataFim) {
        const inspectionDate = new Date(inspection.data)

        if (filters.dataInicio) {
          const startDate = new Date(filters.dataInicio)
          if (inspectionDate < startDate) return false
        }

        if (filters.dataFim) {
          const endDate = new Date(filters.dataFim)
          endDate.setHours(23, 59, 59, 999) // Incluir o dia inteiro
          if (inspectionDate > endDate) return false
        }
      }

      // Filtro por observações específicas
      if (filters.observacoes) {
        if (
          !inspection.observacoes ||
          !inspection.observacoes.toLowerCase().includes(filters.observacoes.toLowerCase())
        ) {
          return false
        }
      }

      // Filtro por presença de observações
      if (filters.hasObservacoes !== null) {
        const hasObs = Boolean(inspection.observacoes && inspection.observacoes.trim())
        if (filters.hasObservacoes !== hasObs) {
          return false
        }
      }

      return true
    })
  }, [inspections, filters])

  // Estatísticas dos resultados
  const searchStats = useMemo(() => {
    const total = filteredInspections.length
    const pendentes = filteredInspections.filter((i) => i.status === "pendente").length
    const emAndamento = filteredInspections.filter((i) => i.status === "em_andamento").length
    const concluidas = filteredInspections.filter((i) => i.status === "concluida").length

    return {
      total,
      pendentes,
      emAndamento,
      concluidas,
      percentualConcluidas: total > 0 ? Math.round((concluidas / total) * 100) : 0,
    }
  }, [filteredInspections])

  // Sugestões baseadas nos dados existentes
  const suggestions = useMemo(() => {
    const clientes = [...new Set(inspections.map((i) => i.cliente))].slice(0, 10)
    const responsaveis = [...new Set(inspections.map((i) => i.responsavel))].slice(0, 10)

    return {
      clientes,
      responsaveis,
      recentSearches: recentSearches.slice(0, 5),
    }
  }, [inspections, recentSearches])

  // Adicionar busca ao histórico
  const addToSearchHistory = (searchTerm: string) => {
    if (searchTerm.trim() && searchTerm.length > 2) {
      setRecentSearches((prev) => {
        const newHistory = [searchTerm, ...prev.filter((term) => term !== searchTerm)].slice(0, 10)
        return newHistory
      })
    }
  }

  // Atualizar filtros
  const updateFilters = (newFilters: Partial<AdvancedSearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))

    // Adicionar ao histórico se for busca por termo
    if (newFilters.searchTerm !== undefined) {
      addToSearchHistory(newFilters.searchTerm)
    }
  }

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      cliente: "",
      responsavel: "",
      status: [],
      dataInicio: "",
      dataFim: "",
      observacoes: "",
      hasObservacoes: null,
    })
  }

  // Verificar se há filtros ativos
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchTerm ||
      filters.cliente ||
      filters.responsavel ||
      filters.status.length > 0 ||
      filters.dataInicio ||
      filters.dataFim ||
      filters.observacoes ||
      filters.hasObservacoes !== null
    )
  }, [filters])

  // Exportar resultados
  const exportResults = (format: "csv" | "json") => {
    const data = filteredInspections.map((inspection) => ({
      id: inspection.id,
      cliente: inspection.cliente,
      responsavel: inspection.responsavel,
      data: inspection.data,
      status: inspection.status,
      observacoes: inspection.observacoes || "",
    }))

    if (format === "csv") {
      const headers = ["ID", "Cliente", "Responsável", "Data", "Status", "Observações"]
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          [row.id, row.cliente, row.responsavel, row.data, row.status, row.observacoes]
            .map((field) => `"${field}"`)
            .join(","),
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `inspecoes-${new Date().toISOString().split("T")[0]}.csv`
      link.click()
    } else if (format === "json") {
      const jsonContent = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `inspecoes-${new Date().toISOString().split("T")[0]}.json`
      link.click()
    }
  }

  return {
    filters,
    updateFilters,
    clearFilters,
    filteredInspections,
    searchStats,
    suggestions,
    hasActiveFilters,
    exportResults,
  }
}
