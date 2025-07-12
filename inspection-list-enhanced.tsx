"use client"
import {
  Plus,
  Building2,
  User,
  Calendar,
  Eye,
  Edit,
  Trash2,
  FileText,
  Users,
  MoreVertical,
  RefreshCw,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Toast } from "@/components/ui/toast"
import { AdvancedSearch } from "@/components/advanced-search"
import { useInspections } from "@/hooks/use-inspections"
import { useAdvancedSearch } from "@/hooks/use-advanced-search"
import { useToast } from "@/hooks/use-toast"
import type { Inspection } from "@/lib/api"

interface InspectionListEnhancedProps {
  onCreateNew: () => void
  onEdit?: (inspection: Inspection) => void
  onShowProfile?: () => void
}

export default function InspectionListEnhanced({ onCreateNew, onEdit, onShowProfile }: InspectionListEnhancedProps) {
  const { toasts, toast, removeToast } = useToast()

  // Hook para buscar todas as inspeções (sem paginação para filtros locais)
  const { inspections, loading, error, deleteInspection, refetch } = useInspections({
    limit: 1000, // Buscar todas para filtros locais
    autoFetch: true,
  })

  // Hook para busca avançada
  const {
    filters,
    updateFilters,
    clearFilters,
    filteredInspections,
    searchStats,
    suggestions,
    hasActiveFilters,
    exportResults,
  } = useAdvancedSearch({
    inspections,
  })

  const handleDelete = async (id: string, clienteName: string) => {
    if (!confirm(`Tem certeza que deseja excluir a inspeção de "${clienteName}"?`)) {
      return
    }

    try {
      await deleteInspection(id)
      toast({
        title: "Sucesso!",
        description: "Inspeção excluída com sucesso",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível excluir a inspeção",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: Inspection["status"]) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pendente
          </Badge>
        )
      case "concluida":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Concluída
          </Badge>
        )
      case "em_andamento":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Em Andamento
          </Badge>
        )
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
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
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-slate-900 text-sm sm:text-base">Sistema de Inspeções</span>
              </div>
            </div>

            <nav className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="bg-red-50 text-red-700 hover:bg-red-100 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Building2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Inspeções</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm px-2 sm:px-3"
                //onClick={onShowProfile}
              >
                <Users className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Usuário</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header da página */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-slate-900">Inspeções</h1>
              <p className="text-slate-600">Gerencie todas as inspeções com busca avançada e filtros inteligentes</p>
              {error && <p className="text-blue-600 text-sm">💡 Modo offline - dados de demonstração</p>}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
              <Button onClick={onCreateNew} className="bg-red-600 hover:bg-red-700 text-white font-medium">
                <Plus className="h-4 w-4 mr-2" />
                Nova Inspeção
              </Button>
            </div>
          </div>

          {/* Estatísticas dos Resultados */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{searchStats.total}</p>
                    <p className="text-sm text-slate-600">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{searchStats.pendentes}</p>
                    <p className="text-sm text-slate-600">Pendentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{searchStats.emAndamento}</p>
                    <p className="text-sm text-slate-600">Em Andamento</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{searchStats.concluidas}</p>
                    <p className="text-sm text-slate-600">Concluídas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{searchStats.percentualConcluidas}%</p>
                    <p className="text-sm text-slate-600">Taxa Conclusão</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Busca Avançada */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-red-600" />
                Busca Avançada
              </CardTitle>
              <CardDescription>Use filtros inteligentes para encontrar exatamente o que você procura</CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedSearch
                filters={filters}
                onFiltersChange={updateFilters}
                totalResults={searchStats.total}
                isLoading={loading}
              />
            </CardContent>
          </Card>

          {/* Lista de inspeções */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Resultados da Busca
                {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                {hasActiveFilters && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    Filtrado
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {searchStats.total} de {inspections.length} inspeções
                {hasActiveFilters && " (filtradas)"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Versão Desktop - Tabela */}
              <div className="hidden md:block">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4" />
                            <span>Cliente</span>
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Responsável</span>
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Data</span>
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInspections.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <div className="flex flex-col items-center space-y-2">
                              <BarChart3 className="h-8 w-8 text-slate-400" />
                              <p className="text-slate-500">
                                {loading ? "Carregando..." : "Nenhuma inspeção encontrada"}
                              </p>
                              {!loading && hasActiveFilters && (
                                <div className="space-y-2">
                                  <p className="text-sm text-slate-400">Tente ajustar os filtros de busca</p>
                                  <Button variant="outline" size="sm" onClick={clearFilters}>
                                    Limpar Filtros
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInspections.map((inspection) => (
                          <TableRow key={inspection.id} className="hover:bg-slate-50/50">
                            <TableCell className="font-medium">
                              <div>
                                <p className="font-semibold text-slate-900">{inspection.cliente}</p>
                                {inspection.observacoes && (
                                  <p className="text-sm text-slate-500 truncate max-w-xs">{inspection.observacoes}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-slate-600" />
                                </div>
                                <span className="font-medium text-slate-700">{inspection.responsavel}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-slate-600">{formatDate(inspection.data)}</span>
                            </TableCell>
                            <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => onEdit?.(inspection)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {/* <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                  onClick={() => handleDelete(inspection.id, inspection.cliente)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button> */}
                              </div>
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
                {filteredInspections.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg font-medium">
                      {loading ? "Carregando..." : "Nenhuma inspeção encontrada"}
                    </p>
                    {!loading && hasActiveFilters && (
                      <div className="space-y-2 mt-4">
                        <p className="text-sm text-slate-400">Tente ajustar os filtros de busca</p>
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                          Limpar Filtros
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  filteredInspections.map((inspection) => (
                    <Card key={inspection.id} className="border border-slate-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 text-lg leading-tight">{inspection.cliente}</h3>
                            <div className="flex items-center space-x-2 mt-2">
                              <User className="h-4 w-4 text-slate-500" />
                              <span className="text-slate-600 text-sm">{inspection.responsavel}</span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onEdit?.(inspection)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(inspection.id, inspection.cliente)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-slate-500" />
                            <span className="text-sm text-slate-600">{formatDate(inspection.data)}</span>
                          </div>
                          {getStatusBadge(inspection.status)}
                        </div>

                        {inspection.observacoes && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <p className="text-sm text-slate-600 line-clamp-2">{inspection.observacoes}</p>
                          </div>
                        )}
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
