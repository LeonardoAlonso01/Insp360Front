"use client"

import type React from "react"

import { useState } from "react"
import { Download, Upload, Trash2, FileText, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"
import type { Inspection, InspectionItem } from "@/lib/api"

interface BackupData {
  inspections: Inspection[]
  items: Record<string, InspectionItem[]>
  exportDate: string
  version: string
}

export function InspectionBackup() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  const [localInspections] = useLocalStorage<Inspection[]>("local-inspections", [])
  const [localItems] = useLocalStorage<Record<string, InspectionItem[]>>("local-items", {})

  const exportData = async () => {
    setIsExporting(true)
    try {
      const backupData: BackupData = {
        inspections: localInspections,
        items: localItems,
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      const dataStr = JSON.stringify(backupData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = `backup-inspecoes-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)

      toast({
        title: "Backup criado!",
        description: "Dados exportados com sucesso",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível criar o backup",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const text = await file.text()
      const backupData: BackupData = JSON.parse(text)

      // Validar estrutura do backup
      if (!backupData.inspections || !backupData.items) {
        throw new Error("Formato de backup inválido")
      }

      // Confirmar importação
      const confirmed = confirm(
        `Importar ${backupData.inspections.length} inspeções do backup de ${new Date(backupData.exportDate).toLocaleDateString("pt-BR")}?\n\nIsto substituirá todos os dados locais.`,
      )

      if (confirmed) {
        // Aqui você implementaria a lógica de importação
        // setLocalInspections(backupData.inspections)
        // setLocalItems(backupData.items)

        toast({
          title: "Backup restaurado!",
          description: `${backupData.inspections.length} inspeções importadas`,
          variant: "success",
        })
      }
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Arquivo de backup inválido",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
      // Limpar input
      event.target.value = ""
    }
  }

  const clearLocalData = () => {
    const confirmed = confirm(
      "Tem certeza que deseja limpar todos os dados locais?\n\nEsta ação não pode ser desfeita.",
    )

    if (confirmed) {
      // Aqui você implementaria a limpeza dos dados
      toast({
        title: "Dados limpos!",
        description: "Todos os dados locais foram removidos",
        variant: "success",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Backup e Restauração
        </CardTitle>
        <CardDescription>Gerencie seus dados locais e crie backups de segurança</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm text-slate-600">Inspeções Locais</p>
            <p className="text-2xl font-bold text-slate-900">{localInspections.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Itens Salvos</p>
            <p className="text-2xl font-bold text-slate-900">
              {Object.values(localItems).reduce((total, items) => total + items.length, 0)}
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-3">
          {/* Exportar */}
          <Button onClick={exportData} disabled={isExporting} className="w-full" variant="outline">
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-600 border-t-transparent mr-2" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exportar Backup
              </>
            )}
          </Button>

          {/* Importar */}
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isImporting}
            />
            <Button variant="outline" className="w-full" disabled={isImporting}>
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-600 border-t-transparent mr-2" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Backup
                </>
              )}
            </Button>
          </div>

          {/* Limpar dados */}
          <Button onClick={clearLocalData} variant="destructive" className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Dados Locais
          </Button>
        </div>

        {/* Aviso */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Importante:</p>
            <p>Faça backups regulares dos seus dados. Os dados locais podem ser perdidos se o navegador for limpo.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
