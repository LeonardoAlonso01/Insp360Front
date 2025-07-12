"use client"

import { Wifi, WifiOff, Cloud, CloudOff, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useOfflineSync } from "@/hooks/use-offline-sync"

export function OfflineIndicator() {
  const { isOnline, isSyncing, syncPendingData, pendingCount } = useOfflineSync()

  if (isOnline && pendingCount === 0) {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
        <Wifi className="h-3 w-3 mr-1" />
        Online
      </Badge>
    )
  }

  if (!isOnline) {
    return (
      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
        <WifiOff className="h-3 w-3 mr-1" />
        Offline
      </Badge>
    )
  }

  if (pendingCount > 0) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <CloudOff className="h-3 w-3 mr-1" />
          {pendingCount} pendente{pendingCount > 1 ? "s" : ""}
        </Badge>
        <Button size="sm" variant="outline" onClick={syncPendingData} disabled={isSyncing} className="h-6 px-2 text-xs">
          {isSyncing ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <Cloud className="h-3 w-3 mr-1" />
              Sincronizar
            </>
          )}
        </Button>
      </div>
    )
  }

  return null
}
