"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Step2Data } from "@/types/inspection-steps"
import { SearchSelect } from "@/components/ui/search-select"
import { OPTIONS_TIPO } from "@/lib/form-options"

interface Step2FormProps {
  inspectionId: string
  initialData: Partial<Step2Data>
  onNext: (data: Step2Data) => void
  onBack: () => void
  loading: boolean
}

export function Step2Form({ inspectionId, initialData, onNext, onBack, loading }: Step2FormProps) {
  const [formData, setFormData] = useState<Step2Data>({
    idInspection: inspectionId,
    pressaoEnsaio: "",
    tipo: 0, // Inicializado como número
    anoFabricacao: "",
    dataProximaInspecao: "",
    dataProximaManutencao: "",
    ...initialData,
  })
  
  // Estado local para mês e ano separados (não enviado para API)
  const [inspectionMonth, setInspectionMonth] = useState<string>("")
  const [inspectionYear, setInspectionYear] = useState<string>("")
  const [maintenanceMonth, setMaintenanceMonth] = useState<string>("")
  const [maintenanceYear, setMaintenanceYear] = useState<string>("")

  // Função para extrair mês e ano de uma data ISO
  const extractMonthYearFromISO = (isoDate: string | null | undefined): { month: string; year: string } | null => {
    if (!isoDate) return null
    try {
      const date = new Date(isoDate)
      const year = date.getFullYear().toString()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      return { month, year }
    } catch (error) {
      console.error("Erro ao extrair mês/ano:", isoDate)
      return null
    }
  }

  // Função para converter mês/ano para ISO (primeiro dia do mês)
  const formatMonthYearToISO = (month: string | null, year: string | null): string | null => {
    if (!month || !year) return null
    try {
      const monthNum = parseInt(month)
      const yearNum = parseInt(year)
      if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > 2100) return null
      const date = new Date(`${yearNum}-${month.padStart(2, '0')}-01T00:00:00.000Z`)
      return date.toISOString()
    } catch (error) {
      console.error("Erro ao formatar mês/ano:", month, year)
      return null
    }
  }

  // Nomes dos meses em português
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialData, idInspection: inspectionId }))
    
    // Inicializar mês e ano a partir das datas ISO
    const inspectionMonthYear = extractMonthYearFromISO(initialData.dataProximaInspecao)
    const maintenanceMonthYear = extractMonthYearFromISO(initialData.dataProximaManutencao)
    
    if (inspectionMonthYear) {
      setInspectionMonth(inspectionMonthYear.month)
      setInspectionYear(inspectionMonthYear.year)
    } else {
      setInspectionMonth("")
      setInspectionYear("")
    }
    
    if (maintenanceMonthYear) {
      setMaintenanceMonth(maintenanceMonthYear.month)
      setMaintenanceYear(maintenanceMonthYear.year)
    } else {
      setMaintenanceMonth("")
      setMaintenanceYear("")
    }
  }, [initialData, inspectionId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: id === "tipo" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSelectChange = (id: keyof Step2Data, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: id === "tipo" ? Number.parseInt(value) : value,
    }))
  }

  const handleDateChange = (id: keyof Step2Data, date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [id]: date ? date.toISOString() : "", // Salva como string ISO
    }))
  }

  const handleMonthYearChange = (type: 'inspection' | 'maintenance', month: string, year: string) => {
    if (type === 'inspection') {
      setInspectionMonth(month)
      setInspectionYear(year)
      const isoDate = formatMonthYearToISO(month, year)
      setFormData((prev) => ({
        ...prev,
        dataProximaInspecao: isoDate || "",
      }))
    } else {
      setMaintenanceMonth(month)
      setMaintenanceYear(year)
      const isoDate = formatMonthYearToISO(month, year)
      setFormData((prev) => ({
        ...prev,
        dataProximaManutencao: isoDate || "",
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  const isFormValid =
    formData.pressaoEnsaio.trim() !== "" &&
    formData.tipo > 0 &&
    formData.anoFabricacao.trim() !== "" &&
    formData.dataProximaInspecao.trim() !== "" &&
    formData.dataProximaManutencao.trim() !== ""

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mx-2 sm:mx-0">
      <CardHeader className="space-y-1 pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Etapa 2: Dados de Ensaio e Fabricação</CardTitle>
        <CardDescription className="text-sm">Informe os detalhes de ensaio e fabricação do duto.</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Campo Pressão de Ensaio */}
          <div className="space-y-2">
            <Label htmlFor="pressaoEnsaio" className="text-sm font-medium flex items-center">
              Pressão de Ensaio
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <Input
              id="pressaoEnsaio"
              type="text"
              inputMode="decimal"
              placeholder="Ex: 10 bar"
              value={formData.pressaoEnsaio}
              onChange={handleChange}
              className="h-12 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 text-base sm:text-sm"
              required
            />
          </div>

          {/* Campo Tipo */}
          <div className="space-y-2">
            <Label htmlFor="tipo" className="text-sm font-medium flex items-center">
              Tipo
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <SearchSelect
              options={OPTIONS_TIPO}
              value={formData.tipo.toString()}
              onValueChange={(value) => handleSelectChange("tipo", value)}
              placeholder="Selecione o tipo"
              className="h-11"
            />
          </div>

          {/* Campo Ano de Fabricação */}
          <div className="space-y-2">
            <Label htmlFor="anoFabricacao" className="text-sm font-medium flex items-center">
              Ano de Fabricação
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <Select
              value={formData.anoFabricacao ? formData.anoFabricacao.substring(0, 4) : ""}
              onValueChange={(year) => handleDateChange("anoFabricacao", new Date(Number(year), 0, 1))}
            >
              <SelectTrigger className="h-12 sm:h-11 text-base sm:text-sm">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campo Data Próxima Inspeção */}
          <div className="space-y-2">
            <Label htmlFor="dataProximaInspecao" className="text-sm font-medium flex items-center">
              Data da Próxima Inspeção
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={inspectionMonth}
                onValueChange={(value) => handleMonthYearChange("inspection", value, inspectionYear)}
              >
                <SelectTrigger className="h-12 sm:h-11 text-base sm:text-sm">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((month, index) => (
                    <SelectItem key={index + 1} value={String(index + 1).padStart(2, '0')}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={inspectionYear}
                onValueChange={(value) => handleMonthYearChange("inspection", inspectionMonth, value)}
              >
                <SelectTrigger className="h-12 sm:h-11 text-base sm:text-sm">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Campo Data Próxima Manutenção */}
          <div className="space-y-2">
            <Label htmlFor="dataProximaManutencao" className="text-sm font-medium flex items-center">
              Data da Próxima Manutenção
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={maintenanceMonth}
                onValueChange={(value) => handleMonthYearChange("maintenance", value, maintenanceYear)}
              >
                <SelectTrigger className="h-12 sm:h-11 text-base sm:text-sm">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((month, index) => (
                    <SelectItem key={index + 1} value={String(index + 1).padStart(2, '0')}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={maintenanceYear}
                onValueChange={(value) => handleMonthYearChange("maintenance", maintenanceMonth, value)}
              >
                <SelectTrigger className="h-12 sm:h-11 text-base sm:text-sm">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full h-12 sm:h-11 bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 disabled:opacity-50 text-base sm:text-sm"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar e Próximo
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 sm:h-11 font-medium text-base sm:text-sm"
              disabled={loading}
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>

          {!isFormValid && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">Preencha todos os campos obrigatórios para continuar.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
