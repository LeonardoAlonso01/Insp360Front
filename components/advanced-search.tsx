"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  X,
  Calendar,
  User,
  Building2,
  FileText,
  Star,
  Clock,
  ChevronDown,
  Download,
  Bookmark,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchSelect } from "@/components/ui/search-select"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"

export interface AdvancedSearchFilters {
  searchTerm: string
  cliente: string
  responsavel: string
  status: string[]
  dataInicio: string
  dataFim: string
  observacoes: string
  hasObservacoes: boolean | null
}

interface SavedSearch {
  id: string
  name: string
  filters: AdvancedSearchFilters
  createdAt: string
  isFavorite: boolean
}

interface AdvancedSearchProps {
  filters: AdvancedSearchFilters
  onFiltersChange: (filters: AdvancedSearchFilters) => void
  totalResults: number
  isLoading: boolean
}

const STATUS_OPTIONS = [
  { label: "Pendente", value: "pendente" },
  { label: "Em Andamento", value: "em_andamento" },
  { label: "Concluída", value: "concluida" },
]

const RESPONSAVEL_OPTIONS = [
  { label: "João Silva", value: "João Silva" },
  { label: "Maria Santos", value: "Maria Santos" },
  { label: "Pedro Costa", value: "Pedro Costa" },
  { label: "Ana Oliveira", value: "Ana Oliveira" },
  { label: "Carlos Lima", value: "Carlos Lima" },
]

const QUICK_FILTERS = [
  { label: "Hoje", value: "today" },
  { label: "Esta Semana", value: "week" },
  { label: "Este Mês", value: "month" },
  { label: "Pendentes", value: "pending" },
  { label: "Concluídas", value: "completed" },
]

export function AdvancedSearch({ filters, onFiltersChange, totalResults, isLoading }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>("saved-searches", [])
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>("search-history", [])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { toast } = useToast()

  // Filtros rápidos
  const applyQuickFilter = (filterType: string) => {
    const today = new Date()
    const newFilters = { ...filters }

    switch (filterType) {
      case "today":
        newFilters.dataInicio = today.toISOString().split("T")[0]
        newFilters.dataFim = today.toISOString().split("T")[0]
        break
      case "week":
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
        const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6))
        newFilters.dataInicio = weekStart.toISOString().split("T")[0]
        newFilters.dataFim = weekEnd.toISOString().split("T")[0]
        break
      case "month":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        newFilters.dataInicio = monthStart.toISOString().split("T")[0]
        newFilters.dataFim = monthEnd.toISOString().split("T")[0]
        break
      case "pending":
        newFilters.status = ["pendente"]
        break
      case "completed":
        newFilters.status = ["concluida"]
        break
    }

    onFiltersChange(newFilters)
  }

  // Salvar busca
  const saveSearch = () => {
    const name = prompt("Nome para esta busca:")
    if (!name) return

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
      isFavorite: false,
    }

    setSavedSearches((prev) => [newSearch, ...prev])
    toast({
      title: "Busca salva!",
      description: `Busca "${name}" foi salva com sucesso`,
      variant: "success",
    })
  }

  // Carregar busca salva
  const loadSavedSearch = (search: SavedSearch) => {
    onFiltersChange(search.filters)
    setIsOpen(false)
    toast({
      title: "Busca carregada!",
      description: `Filtros de "${search.name}" aplicados`,
      variant: "success",
    })
  }

  // Favoritar busca
  const toggleFavorite = (searchId: string) => {
    setSavedSearches((prev) =>
      prev.map((search) => (search.id === searchId ? { ...search, isFavorite: !search.isFavorite } : search)),
    )
  }

  // Deletar busca salva
  const deleteSavedSearch = (searchId: string) => {
    setSavedSearches((prev) => prev.filter((search) => search.id !== searchId))
    toast({
      title: "Busca removida",
      description: "Busca salva foi removida",
      variant: "success",
    })
  }

  // Limpar todos os filtros
  const clearAllFilters = () => {
    const emptyFilters: AdvancedSearchFilters = {
      searchTerm: "",
      cliente: "",
      responsavel: "",
      status: [],
      dataInicio: "",
      dataFim: "",
      observacoes: "",
      hasObservacoes: null,
    }
    onFiltersChange(emptyFilters)
  }

  // Contar filtros ativos
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.searchTerm) count++
    if (filters.cliente) count++
    if (filters.responsavel) count++
    if (filters.status.length > 0) count++
    if (filters.dataInicio || filters.dataFim) count++
    if (filters.observacoes) count++
    if (filters.hasObservacoes !== null) count++
    return count
  }

  // Adicionar ao histórico
  useEffect(() => {
    if (filters.searchTerm && filters.searchTerm.length > 2) {
      setSearchHistory((prev) => {
        const newHistory = [filters.searchTerm, ...prev.filter((term) => term !== filters.searchTerm)].slice(0, 10)
        return newHistory
      })
    }
  }, [filters.searchTerm, setSearchHistory])

  const activeFiltersCount = getActiveFiltersCount()
  const favoriteSearches = savedSearches.filter((search) => search.isFavorite)

  return (
    <div className="space-y-4">
      {/* Busca Principal */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar inspeções..."
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
          />

          {/* Sugestões de busca */}
          {showSuggestions && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div className="p-2">
                <p className="text-xs font-medium text-slate-500 mb-2">Buscas recentes</p>
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full text-left px-2 py-1 text-sm hover:bg-slate-100 rounded flex items-center gap-2"
                    onClick={() => onFiltersChange({ ...filters, searchTerm: term })}
                  >
                    <Clock className="h-3 w-3 text-slate-400" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botão Filtros Avançados */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-11 px-4">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Busca Avançada
              </DialogTitle>
              <DialogDescription>Use os filtros abaixo para encontrar exatamente o que você procura</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Buscas Favoritas */}
              {favoriteSearches.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Buscas Favoritas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {favoriteSearches.map((search) => (
                        <Button
                          key={search.id}
                          variant="outline"
                          size="sm"
                          onClick={() => loadSavedSearch(search)}
                          className="h-8"
                        >
                          <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                          {search.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Filtros Rápidos */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Filtros Rápidos</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {QUICK_FILTERS.map((filter) => (
                      <Button
                        key={filter.value}
                        variant="outline"
                        size="sm"
                        onClick={() => applyQuickFilter(filter.value)}
                        className="h-8"
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Filtros Detalhados */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Filtros Detalhados</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cliente */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-slate-500" />
                        Cliente
                      </Label>
                      <Input
                        placeholder="Nome do cliente..."
                        value={filters.cliente}
                        onChange={(e) => onFiltersChange({ ...filters, cliente: e.target.value })}
                        className="h-10"
                      />
                    </div>

                    {/* Responsável */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <User className="h-4 w-4 mr-2 text-slate-500" />
                        Responsável
                      </Label>
                      <SearchSelect
                        options={RESPONSAVEL_OPTIONS}
                        value={filters.responsavel}
                        onValueChange={(value) => onFiltersChange({ ...filters, responsavel: value })}
                        placeholder="Selecione o responsável"
                        className="h-10"
                      />
                    </div>

                    {/* Data Início */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                        Data Início
                      </Label>
                      <Input
                        type="date"
                        value={filters.dataInicio}
                        onChange={(e) => onFiltersChange({ ...filters, dataInicio: e.target.value })}
                        className="h-10"
                      />
                    </div>

                    {/* Data Fim */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                        Data Fim
                      </Label>
                      <Input
                        type="date"
                        value={filters.dataFim}
                        onChange={(e) => onFiltersChange({ ...filters, dataFim: e.target.value })}
                        className="h-10"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTIONS.map((status) => (
                        <Button
                          key={status.value}
                          variant={filters.status.includes(status.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newStatus = filters.status.includes(status.value)
                              ? filters.status.filter((s) => s !== status.value)
                              : [...filters.status, status.value]
                            onFiltersChange({ ...filters, status: newStatus })
                          }}
                          className="h-8"
                        >
                          {status.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Observações */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-slate-500" />
                      Observações
                    </Label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Buscar nas observações..."
                        value={filters.observacoes}
                        onChange={(e) => onFiltersChange({ ...filters, observacoes: e.target.value })}
                        className="h-10"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant={filters.hasObservacoes === true ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            onFiltersChange({
                              ...filters,
                              hasObservacoes: filters.hasObservacoes === true ? null : true,
                            })
                          }
                          className="h-8"
                        >
                          Com observações
                        </Button>
                        <Button
                          variant={filters.hasObservacoes === false ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            onFiltersChange({
                              ...filters,
                              hasObservacoes: filters.hasObservacoes === false ? null : false,
                            })
                          }
                          className="h-8"
                        >
                          Sem observações
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Buscas Salvas */}
              {savedSearches.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Bookmark className="h-4 w-4" />
                      Buscas Salvas ({savedSearches.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {savedSearches.map((search) => (
                        <div
                          key={search.id}
                          className="flex items-center justify-between p-2 border border-slate-200 rounded-lg hover:bg-slate-50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => loadSavedSearch(search)}
                                className="font-medium text-slate-900 hover:text-red-600 transition-colors"
                              >
                                {search.name}
                              </button>
                              {search.isFavorite && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                            </div>
                            <p className="text-xs text-slate-500">
                              {new Date(search.createdAt).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(search.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Star
                                className={`h-3 w-3 ${search.isFavorite ? "text-yellow-500 fill-current" : "text-slate-400"}`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSavedSearch(search.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ações */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={saveSearch} disabled={activeFiltersCount === 0}>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Salvar Busca
                  </Button>
                  <Button variant="outline" onClick={clearAllFilters} disabled={activeFiltersCount === 0}>
                    <X className="h-4 w-4 mr-2" />
                    Limpar Tudo
                  </Button>
                </div>
                <Button onClick={() => setIsOpen(false)} className="bg-red-600 hover:bg-red-700">
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Menu de Ações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-11 px-3">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={saveSearch} disabled={activeFiltersCount === 0}>
              <Bookmark className="h-4 w-4 mr-2" />
              Salvar Busca
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Exportar Resultados
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearAllFilters} disabled={activeFiltersCount === 0}>
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filtros Ativos */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-600">Filtros ativos:</span>

          {filters.searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Busca: {filters.searchTerm}
              <button
                onClick={() => onFiltersChange({ ...filters, searchTerm: "" })}
                className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.cliente && (
            <Badge variant="secondary" className="gap-1">
              Cliente: {filters.cliente}
              <button
                onClick={() => onFiltersChange({ ...filters, cliente: "" })}
                className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.responsavel && (
            <Badge variant="secondary" className="gap-1">
              Responsável: {filters.responsavel}
              <button
                onClick={() => onFiltersChange({ ...filters, responsavel: "" })}
                className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.status.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status.join(", ")}
              <button
                onClick={() => onFiltersChange({ ...filters, status: [] })}
                className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {(filters.dataInicio || filters.dataFim) && (
            <Badge variant="secondary" className="gap-1">
              Data: {filters.dataInicio || "..."} até {filters.dataFim || "..."}
              <button
                onClick={() => onFiltersChange({ ...filters, dataInicio: "", dataFim: "" })}
                className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.observacoes && (
            <Badge variant="secondary" className="gap-1">
              Observações: {filters.observacoes}
              <button
                onClick={() => onFiltersChange({ ...filters, observacoes: "" })}
                className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.hasObservacoes !== null && (
            <Badge variant="secondary" className="gap-1">
              {filters.hasObservacoes ? "Com observações" : "Sem observações"}
              <button
                onClick={() => onFiltersChange({ ...filters, hasObservacoes: null })}
                className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 px-2 text-xs">
            Limpar todos
          </Button>
        </div>
      )}

      {/* Resultados */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          {isLoading ? (
            "Buscando..."
          ) : (
            <>
              {totalResults} resultado{totalResults !== 1 ? "s" : ""} encontrado{totalResults !== 1 ? "s" : ""}
              {activeFiltersCount > 0 && ` com ${activeFiltersCount} filtro${activeFiltersCount !== 1 ? "s" : ""}`}
            </>
          )}
        </span>

        {totalResults > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                Exportar <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Exportar como CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Exportar como PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Exportar como Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
