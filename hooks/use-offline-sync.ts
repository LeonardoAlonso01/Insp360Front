"use client"

import { useState, useEffect } from "react"
import { useLocalStorage } from "./use-local-storage"
import { apiClient } from "@/lib/api"
import type { Inspection, InspectionItem } from "@/lib/api"
import { authService } from "@/lib/auth"

interface OfflineData {
  inspections: Inspection[]
  inspectionItems: Record<string, InspectionItem[]>
  pendingSync: {
    inspections: Inspection[]
    items: InspectionItem[]
  }
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [offlineData, setOfflineData] = useLocalStorage<OfflineData>("offline-data", {
    inspections: [],
    inspectionItems: {},
    pendingSync: {
      inspections: [],
      items: [],
    },
  })

  // Detectar status de conexão
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  // Sincronizar quando voltar online
  useEffect(() => {
    if (isOnline && offlineData.pendingSync.inspections.length > 0) {
      syncPendingData()
    }
  }, [isOnline])

  const syncPendingData = async () => {
    if (!isOnline || isSyncing) return

    setIsSyncing(true)

    try {
      // Sincronizar inspeções pendentes
      for (const inspection of offlineData.pendingSync.inspections) {
        try {
          await apiClient.createInspection({
            client: inspection.client,
            responsible: inspection.responsible,
            obs: "",
            result: "Aprovado",
            companyId: authService.getCompanyId() || "",
          })
        } catch (error) {
          console.error("Erro ao sincronizar inspeção:", error)
        }
      }

      // Sincronizar itens pendentes
      for (const item of offlineData.pendingSync.items) {
        try {
          // Aqui você implementaria a sincronização dos itens
          // await apiClient.saveStepData(item.inspectionId, item.stepData)
        } catch (error) {
          console.error("Erro ao sincronizar item:", error)
        }
      }

      // Limpar dados pendentes após sincronização
      setOfflineData((prev) => ({
        ...prev,
        pendingSync: {
          inspections: [],
          items: [],
        },
      }))
    } catch (error) {
      console.error("Erro na sincronização:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  const addOfflineInspection = (inspection: Inspection) => {
    setOfflineData((prev) => ({
      ...prev,
      inspections: [...prev.inspections, inspection],
      pendingSync: {
        ...prev.pendingSync,
        inspections: [...prev.pendingSync.inspections, inspection],
      },
    }))
  }

  const addOfflineItem = (inspectionId: string, item: InspectionItem) => {
    setOfflineData((prev) => ({
      ...prev,
      inspectionItems: {
        ...prev.inspectionItems,
        [inspectionId]: [...(prev.inspectionItems[inspectionId] || []), item],
      },
      pendingSync: {
        ...prev.pendingSync,
        items: [...prev.pendingSync.items, item],
      },
    }))
  }

  const getOfflineInspections = (): Inspection[] => {
    return offlineData.inspections
  }

  const getOfflineItems = (inspectionId: string): InspectionItem[] => {
    return offlineData.inspectionItems[inspectionId] || []
  }

  const clearOfflineData = () => {
    setOfflineData({
      inspections: [],
      inspectionItems: {},
      pendingSync: {
        inspections: [],
        items: [],
      },
    })
  }

  return {
    isOnline,
    isSyncing,
    syncPendingData,
    addOfflineInspection,
    addOfflineItem,
    getOfflineInspections,
    getOfflineItems,
    clearOfflineData,
    pendingCount: offlineData.pendingSync.inspections.length + offlineData.pendingSync.items.length,
  }
}
