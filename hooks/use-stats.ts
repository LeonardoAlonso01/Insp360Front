"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import { authService } from "@/lib/auth" // Importar authService

interface Stats {
  total: number
  pendentes: number
  em_andamento: number
  concluidas: number
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pendentes: 0,
    em_andamento: 0,
    concluidas: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    setError(null)

    const companyId = authService.getCompanyId()
    if (!companyId) {
      setError("Company ID não encontrado. Por favor, faça login novamente.")
      setLoading(false)
      return
    }

    try {
      const response = await apiClient.getStats()
      setStats(response) // A API agora retorna diretamente o objeto de stats
    } catch (err: any) {
      console.error("Erro ao carregar estatísticas:", err)
      setError(err.message || "Erro ao carregar estatísticas")
      // Não usar mock data, apenas mostrar erro ou estado vazio
      setStats({
        total: 0,
        pendentes: 0,
        em_andamento: 0,
        concluidas: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
