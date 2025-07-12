"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Settings, Gauge, ArrowRight, ArrowLeft, MapPin, Thermometer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { SearchSelect } from "@/components/ui/search-select"
import type { Step2Data } from "@/types/inspection-steps"
import {
  OPTIONS_TIPO,
  OPTIONS_TIPO_INSTALACAO,
  OPTIONS_CONDICOES_AMBIENTAIS,
  OPTIONS_FREQUENCIA_USO,
} from "@/lib/form-options"

interface Step2FormEnhancedProps {
  inspectionId: string
  initialData?: Partial<Step2Data>
  onNext: (data: Step2Data) => void
  onBack: () => void
  loading?: boolean
}

export function Step2FormEnhanced({ inspectionId, initialData, onNext, onBack, loading }: Step2FormEnhancedProps) {
  const [formData, setFormData] = useState<Omit<Step2Data, "idInspection">>({
    pressaoEnsaio: initialData?.pressaoEnsaio || "",
    tipo: initialData?.tipo || 1,
    anoFabricacao: initialData?.anoFabricacao || "",
    dataProximaInspecao: initialData?.dataProximaInspecao || "",
    dataProximaManutencao: initialData?.dataProximaManutencao || "",
    // Novos campos
    tipoInstalacao: initialData?.tipoInstalacao || "",
    localInstalacao: initialData?.localInstalacao || "",
    condicoesAmbientais: initialData?.condicoesAmbientais || "",
    frequenciaUso: initialData?.frequenciaUso || "",
    profundidade: initialData?.profundidade || 0,
  })

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({
      idInspection: inspectionId,
      ...formData,
    })
  }

  const isFormValid =
    formData.pressaoEnsaio.trim() &&
    formData.tipo > 0 &&
    formData.anoFabricacao &&
    formData.dataProximaInspecao &&
    formData.dataProximaManutencao &&
    formData.tipoInstalacao &&
    formData.localInstalacao

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl flex items-center gap-2">
          <Gauge className="h-5 w-5 text-red-600" />
          Dados de Ensaio e Instalação
        </CardTitle>
        <CardDescription>Preencha as informações técnicas e de instalação</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção 1: Dados Técnicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Dados Técnicos</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pressão de Ensaio */}
              <div className="space-y-2">
                <Label htmlFor="pressaoEnsaio" className="text-sm font-medium flex items-center">
                  <Gauge className="h-4 w-4 mr-2 text-slate-500" />
                  Pressão de Ensaio
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Obrigatório
                  </Badge>
                </Label>
                <Input
                  id="pressaoEnsaio"
                  type="text"
                  placeholder="Ex: 10 bar"
                  value={formData.pressaoEnsaio}
                  onChange={(e) => handleInputChange("pressaoEnsaio", e.target.value)}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
                  required
                />
              </div>

              {/* Tipo */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-slate-500" />
                  Tipo
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Obrigatório
                  </Badge>
                </Label>
                <SearchSelect
                  options={OPTIONS_TIPO}
                  value={formData.tipo.toString()}
                  onValueChange={(value) => handleInputChange("tipo", Number.parseInt(value))}
                  placeholder="Selecione o tipo"
                  searchPlaceholder="Buscar tipo..."
                  className="h-11"
                />
              </div>
            </div>

            {/* Ano de Fabricação */}
            <div className="space-y-2">
              <Label htmlFor="anoFabricacao" className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                Ano de Fabricação
                <Badge variant="destructive" className="ml-2 text-xs">
                  Obrigatório
                </Badge>
              </Label>
              <Input
                id="anoFabricacao"
                type="date"
                value={formData.anoFabricacao ? formData.anoFabricacao.split("T")[0] : ""}
                onChange={(e) =>
                  handleInputChange("anoFabricacao", e.target.value ? `${e.target.value}T00:00:00Z` : "")
                }
                className="h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
                required
              />
            </div>
          </div>

          {/* Seção 2: Dados de Instalação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Dados de Instalação</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de Instalação */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                  Tipo de Instalação
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Obrigatório
                  </Badge>
                </Label>
                <SearchSelect
                  options={OPTIONS_TIPO_INSTALACAO}
                  value={formData.tipoInstalacao}
                  onValueChange={(value) => handleInputChange("tipoInstalacao", value)}
                  placeholder="Selecione o tipo de instalação"
                  searchPlaceholder="Buscar tipo..."
                  className="h-11"
                />
              </div>

              {/* Condições Ambientais */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Thermometer className="h-4 w-4 mr-2 text-slate-500" />
                  Condições Ambientais
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Opcional
                  </Badge>
                </Label>
                <SearchSelect
                  options={OPTIONS_CONDICOES_AMBIENTAIS}
                  value={formData.condicoesAmbientais}
                  onValueChange={(value) => handleInputChange("condicoesAmbientais", value)}
                  placeholder="Selecione as condições"
                  searchPlaceholder="Buscar condições..."
                  className="h-11"
                />
              </div>
            </div>

            {/* Local de Instalação */}
            <div className="space-y-2">
              <Label htmlFor="localInstalacao" className="text-sm font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                Local de Instalação
                <Badge variant="destructive" className="ml-2 text-xs">
                  Obrigatório
                </Badge>
              </Label>
              <Input
                id="localInstalacao"
                type="text"
                placeholder="Ex: Setor A - Linha de Produção 1"
                value={formData.localInstalacao}
                onChange={(e) => handleInputChange("localInstalacao", e.target.value)}
                className="h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Frequência de Uso */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-slate-500" />
                  Frequência de Uso
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Opcional
                  </Badge>
                </Label>
                <SearchSelect
                  options={OPTIONS_FREQUENCIA_USO}
                  value={formData.frequenciaUso}
                  onValueChange={(value) => handleInputChange("frequenciaUso", value)}
                  placeholder="Selecione a frequência"
                  searchPlaceholder="Buscar frequência..."
                  className="h-11"
                />
              </div>

              {/* Profundidade (se aplicável) */}
              <div className="space-y-2">
                <Label htmlFor="profundidade" className="text-sm font-medium flex items-center">
                  <Gauge className="h-4 w-4 mr-2 text-slate-500" />
                  Profundidade (m)
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Se aplicável
                  </Badge>
                </Label>
                <Input
                  id="profundidade"
                  type="number"
                  placeholder="Ex: 2.5"
                  value={formData.profundidade || ""}
                  onChange={(e) => handleInputChange("profundidade", Number.parseFloat(e.target.value) || 0)}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Datas de Manutenção */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Cronograma de Manutenção</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data Próxima Inspeção */}
              <div className="space-y-2">
                <Label htmlFor="dataProximaInspecao" className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                  Data da Próxima Inspeção
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Obrigatório
                  </Badge>
                </Label>
                <Input
                  id="dataProximaInspecao"
                  type="date"
                  value={formData.dataProximaInspecao ? formData.dataProximaInspecao.split("T")[0] : ""}
                  onChange={(e) =>
                    handleInputChange("dataProximaInspecao", e.target.value ? `${e.target.value}T00:00:00Z` : "")
                  }
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
                  required
                />
              </div>

              {/* Data Próxima Manutenção */}
              <div className="space-y-2">
                <Label htmlFor="dataProximaManutencao" className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                  Data da Próxima Manutenção
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Obrigatório
                  </Badge>
                </Label>
                <Input
                  id="dataProximaManutencao"
                  type="date"
                  value={formData.dataProximaManutencao ? formData.dataProximaManutencao.split("T")[0] : ""}
                  onChange={(e) =>
                    handleInputChange("dataProximaManutencao", e.target.value ? `${e.target.value}T00:00:00Z` : "")
                  }
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
                  required
                />
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 font-medium"
              onClick={onBack}
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Etapa Anterior
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  Próxima Etapa
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Indicador de progresso */}
          {!isFormValid && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">Complete todos os campos obrigatórios para continuar</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
