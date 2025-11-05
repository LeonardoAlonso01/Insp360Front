"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SearchSelect } from "@/components/ui/search-select"
import type { Step4Data } from "@/types/inspection-steps"
import { OPTIONS_APROVADO_REPROVADO, OPTIONS_SIM_NAO } from "@/lib/form-options"

interface Step4FormProps {
  inspectionId: string
  initialData: Partial<Step4Data>
  onNext: (data: Step4Data) => void
  onBack: () => void
  loading: boolean
}

export function Step4Form({ inspectionId, initialData, onNext, onBack, loading }: Step4FormProps) {
  const [formData, setFormData] = useState<Step4Data>({
    idInspection: inspectionId,
    ensaioHidrostatico: "Aprovado", // Default value
    reempatacao: "Não", // Default value
    comprimentoFinal: "",
    substituicaoUnioes: "Não", // Default value
    substituicaoVedacoes: "Não", // Default value
    ...initialData,
  })

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialData, idInspection: inspectionId }))
  }, [initialData, inspectionId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: id === "comprimentoFinal" ? value || 0 : value,
    }))
  }

  const handleSelectChange = (id: keyof Step4Data, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value as any, // Type assertion for select values
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  const isFormValid =
    String(formData.ensaioHidrostatico).trim() !== "" &&
    String(formData.reempatacao).trim() !== "" &&
    String(formData.comprimentoFinal).trim() !== "" &&
    String(formData.substituicaoUnioes).trim() !== "" &&
    String(formData.substituicaoVedacoes).trim() !== ""

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mx-2 sm:mx-0">
      <CardHeader className="space-y-1 pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Etapa 4: Ensaio e Manutenção</CardTitle>
        <CardDescription className="text-sm">
          Registre os resultados dos ensaios e manutenções realizadas.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Ensaio Hidrostático */}
          <div className="space-y-2">
            <Label htmlFor="ensaioHidrostatico" className="text-sm font-medium flex items-center">
              Ensaio Hidrostático
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <SearchSelect
              options={OPTIONS_APROVADO_REPROVADO.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
              value={formData.ensaioHidrostatico}
              onValueChange={(value) => handleSelectChange("ensaioHidrostatico", value)}
              placeholder="Selecione o status"
              className="h-11"
            />
          </div>

          {/* Reempatamento */}
          <div className="space-y-2">
            <Label htmlFor="reempatacao" className="text-sm font-medium flex items-center">
              Reempatamento
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <SearchSelect
              options={OPTIONS_SIM_NAO.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
              value={formData.reempatacao}
              onValueChange={(value) => handleSelectChange("reempatacao", value)}
              placeholder="Selecione"
              className="h-11"
            />
          </div>

          {/* Campo Comprimento Final */}
          <div className="space-y-2">
            <Label htmlFor="comprimentoFinal" className="text-sm font-medium flex items-center">
              Comprimento Final (m)
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <Input
              id="comprimentoFinal"
              type="number"
              inputMode="decimal"
              step="0.1"
              placeholder="Ex: 9.5"
              value={formData.comprimentoFinal === "" ? "" : formData.comprimentoFinal}
              onChange={handleChange}
              className="h-12 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 text-base sm:text-sm"
              required
            />
          </div>

          {/* Substituição de Uniões */}
          <div className="space-y-2">
            <Label htmlFor="substituicaoUnioes" className="text-sm font-medium flex items-center">
              Substituição de Uniões
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <SearchSelect
              options={OPTIONS_SIM_NAO.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
              value={formData.substituicaoUnioes}
              onValueChange={(value) => handleSelectChange("substituicaoUnioes", value)}
              placeholder="Selecione"
              className="h-11"
            />
          </div>

          {/* Substituição de Vedações */}
          <div className="space-y-2">
            <Label htmlFor="substituicaoVedacoes" className="text-sm font-medium flex items-center">
              Substituição de Vedações
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <SearchSelect
              options={OPTIONS_SIM_NAO.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
              value={formData.substituicaoVedacoes}
              onValueChange={(value) => handleSelectChange("substituicaoVedacoes", value)}
              placeholder="Selecione"
              className="h-11"
            />
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
