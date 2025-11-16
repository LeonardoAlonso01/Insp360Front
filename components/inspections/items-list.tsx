"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Edit, FileText, Calendar, User, Building2, Ruler, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { formatDate } from "@/components/inspections/utils"

interface InspectionItemsListProps {
  inspectionId: string
  inspectionData: {
    client: string
    responsible: string
    inspectionDate: string
    result: string
  }
  onBack: () => void
  onEditItem: (item: any) => void
  onAddNewItem?: () => void
}

export function InspectionItemsList({ 
  inspectionId, 
  inspectionData, 
  onBack, 
  onEditItem,
  onAddNewItem
}: InspectionItemsListProps) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toasts, toast, removeToast } = useToast()

  useEffect(() => {
    loadItems()
  }, [inspectionId])

  const getItemStorageKey = (inspectionId: string) => `inspection-items-order:${inspectionId}`

  const getItemKey = (item: any, fallback: number) => {
    if (item?.id !== undefined && item?.id !== null) return String(item.id)
    if (item?.item !== undefined && item?.item !== null) return String(item.item)
    return `fallback-${fallback}`
  }

  const sortItemsByStoredOrder = (itemsToSort: any[], inspectionId: string) => {
    if (itemsToSort.length === 0) {
      return { sorted: itemsToSort, order: [] as string[] }
    }

    const storageKey = getItemStorageKey(inspectionId)
    const storedOrderString = typeof window !== "undefined" ? sessionStorage.getItem(storageKey) : null
    const storedOrder = storedOrderString ? JSON.parse(storedOrderString) as string[] : []

    const sanitizedOrder = storedOrder.filter((key: string) =>
      itemsToSort.some((item, idx) => getItemKey(item, idx) === key),
    )

    const orderMap = new Map<string, number>()
    sanitizedOrder.forEach((key, index) => {
      orderMap.set(key, index)
    })

    const itemsWithOrder = itemsToSort.map((item, index) => {
      const key = getItemKey(item, index)
      const existingOrder = orderMap.get(key)
      const fallbackOrder = sanitizedOrder.length + index
      return {
        key,
        data: item,
        order: existingOrder !== undefined ? existingOrder : fallbackOrder,
      }
    })

    itemsWithOrder.sort((a, b) => a.order - b.order)

    const updatedOrder = itemsWithOrder.map((entry) => entry.key)

    if (typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, JSON.stringify(updatedOrder))
    }

    return {
      sorted: itemsWithOrder.map((entry) => entry.data),
      order: updatedOrder,
    }
  }

  const loadItems = async () => {
    try {
      setLoading(true)
      const itemsData = await apiClient.getInspectionItems(inspectionId)
      const normalizedItems = Array.isArray(itemsData) ? itemsData : []
      const { sorted } = sortItemsByStoredOrder(normalizedItems, inspectionId)
      setItems(sorted)
    } catch (error: any) {
      toast({
        title: "Erro!",
        description: error?.message || "Erro ao carregar os itens da inspeção.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 px-2" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="text-sm">Voltar</span>
              </Button>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-slate-900 text-sm sm:text-base">Itens da Inspeção</span>
              </div>
            </div>
            {onAddNewItem && (
              <Button
                size="sm"
                onClick={onAddNewItem}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Adicionar Item</span>
                <span className="sm:hidden">Adicionar</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header da página */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full mb-3 sm:mb-4">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Itens da Inspeção</h1>
            <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base px-4 sm:px-0">
              Gerencie todos os itens desta inspeção
            </p>
          </div>

          {/* Informações da inspeção */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Informações da Inspeção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Cliente</p>
                    <p className="font-medium text-slate-900">{inspectionData.client}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Responsável</p>
                    <p className="font-medium text-slate-900">{inspectionData.responsible}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Data</p>
                    <p className="font-medium text-slate-900">
                      {new Date(inspectionData.inspectionDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de itens */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Itens da Inspeção
                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent" />}
                  </CardTitle>
                  <CardDescription>
                    {items.length} item(s) encontrado(s)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Versão Desktop - Tabela */}
              <div className="hidden md:block">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Item</TableHead>
                        <TableHead className="font-semibold">Marca do Duto</TableHead>
                        <TableHead className="font-semibold">Diâmetro</TableHead>
                        <TableHead className="font-semibold">Resultado</TableHead>
                        <TableHead className="font-semibold">Próxima Inspeção</TableHead>
                        <TableHead className="font-semibold">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <div className="flex flex-col items-center space-y-2">
                              <FileText className="h-8 w-8 text-slate-400" />
                              <p className="text-slate-500">
                                {loading ? "Carregando..." : "Nenhum item encontrado"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        items.map((item: any, index: number) => (
                          <TableRow key={item.id ?? `${index}-item`} className="hover:bg-slate-50/50">
                            <TableCell className="font-medium">
                              <span className="text-sm text-slate-600">Item {index + 1}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-slate-600">{item.pipeBrand || "-"}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-slate-600">{item.diameter || "-"}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                {item.finalResult || "-"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-slate-600">{formatDate(item.nextInspectionDate)}</span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => onEditItem(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Versão Mobile - Cards */}
              <div className="md:hidden space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg font-medium">
                      {loading ? "Carregando..." : "Nenhum item encontrado"}
                    </p>
                  </div>
                ) : (
                  items.map((item: any, index: number) => (
                    <Card key={item.id ?? `${index}-item`} className="border border-slate-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Item</p>
                            <h3 className="font-semibold text-slate-900 text-xl leading-tight">#{index + 1}</h3>
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {item.finalResult || "-"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-slate-500" />
                            <div>
                              <p className="text-slate-500">Marca do Duto</p>
                              <p className="font-medium text-slate-900">{item.pipeBrand || "Não informado"}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Ruler className="h-4 w-4 text-slate-500" />
                            <div>
                              <p className="text-slate-500">Diâmetro</p>
                              <p className="font-medium text-slate-900">{item.diameter || "Indefinido"}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-slate-500" />
                            <div>
                              <p className="text-slate-500">Próxima inspeção</p>
                              <p className="font-medium text-slate-900">{formatDate(item.nextInspectionDate) || "-"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-4"
                            onClick={() => onEditItem(item)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

