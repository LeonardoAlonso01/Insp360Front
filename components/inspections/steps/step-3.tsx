"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Step3Data } from "@/types/inspection-steps"
import { SearchSelect } from "@/components/ui/search-select"
import { OPTIONS_APROVADO_REPROVADO } from "@/lib/form-options"

interface Step3FormProps {
  inspectionId: string
  initialData: Partial<Step3Data>
  onNext: (data: Step3Data) => void
  onBack: () => void
  loading: boolean
}

export function Step3Form({ inspectionId, initialData, onNext, onBack, loading }: Step3FormProps) {
  const [formData, setFormData] = useState<Step3Data>({
    idInspection: inspectionId,
    comprimentoReal: "",
    carcacaRevestimento: "Aprovado", // Default value
    unioes: "Aprovado", // Default value
    compLuvaEmpatamento: "",
    vedacaoBorracha: "Aprovado", // Default value
    marcacao: "Aprovado", // Default value
    ...initialData,
  })

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialData, idInspection: inspectionId }))
  }, [initialData, inspectionId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: id === "comprimentoReal" || id === "compLuvaEmpatamento" ? value || 0 : value,
    }))
  }

  const handleSelectChange = (id: keyof Step3Data, value: string) => {
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
    String(formData.comprimentoReal).trim() !== "" &&
    String(formData.carcacaRevestimento).trim() !== "" &&
    String(formData.unioes).trim() !== "" &&
    String(formData.compLuvaEmpatamento).trim() !== "" &&
    String(formData.vedacaoBorracha).trim() !== "" &&
    String(formData.marcacao).trim() !== ""

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mx-2 sm:mx-0">
      <CardHeader className="space-y-1 pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Etapa 3: Inspeção Visual</CardTitle>
        <CardDescription className="text-sm">Avalie visualmente o duto e suas condições.</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Campo Comprimento Real */}
          <div className="space-y-2">
            <Label htmlFor="comprimentoReal" className="text-sm font-medium flex items-center">
              Comprimento Real (m)
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <Input
              id="comprimentoReal"
              type="number"
              inputMode="decimal"
              step="0.1"
              placeholder="Ex: 9.8"
              value={formData.comprimentoReal === "" ? "" : formData.comprimentoReal}
              onChange={handleChange}
              className="h-12 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 text-base sm:text-sm"
              required
            />
          </div>

          {/* Campo Carcaça/Revestimento */}
          <div className="space-y-2">
            <Label htmlFor="carcacaRevestimento" className="text-sm font-medium flex items-center">
              Carcaça/Revestimento
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <SearchSelect
              options={OPTIONS_APROVADO_REPROVADO.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
              value={formData.carcacaRevestimento}
              onValueChange={(value) => handleSelectChange("carcacaRevestimento", value)}
              placeholder="Selecione o status"
              className="h-11"
            />
          </div>

          {/* Campo Uniões */}
          <div className="space-y-2">
            <Label htmlFor="unioes" className="text-sm font-medium flex items-center">
              Uniões
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <SearchSelect
              options={OPTIONS_APROVADO_REPROVADO.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
              value={formData.unioes}
              onValueChange={(value) => handleSelectChange("unioes", value)}
              placeholder="Selecione o status"
              className="h-11"
            />
          </div>

          {/* Campo Comp. Luva Empatamento */}
          <div className="space-y-2">
            <Label htmlFor="compLuvaEmpatamento" className="text-sm font-medium flex items-center">
              Comp. Luva Empatamento (m)
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <Input
              id="compLuvaEmpatamento"
              type="number"
              inputMode="decimal"
              step="0.1"
              placeholder="Ex: 1.2"
              value={formData.compLuvaEmpatamento === "" ? "" : formData.compLuvaEmpatamento}
              onChange={handleChange}
              className="h-12 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 text-base sm:text-sm"
              required
            />
          </div>

          {/* Campo Vedação Borracha */}
          <div className="space-y-2">
            <Label htmlFor="vedacaoBorracha" className="text-sm font-medium flex items-center">
              Vedação Borracha
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <SearchSelect
              options={OPTIONS_APROVADO_REPROVADO.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
              value={formData.vedacaoBorracha}
              onValueChange={(value) => handleSelectChange("vedacaoBorracha", value)}
              placeholder="Selecione o status"
              className="h-11"
            />
          </div>

          {/* Campo Marcação */}
          <div className="space-y-2">
            <Label htmlFor="marcacao" className="text-sm font-medium flex items-center">
              Marcação
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <SearchSelect
              options={OPTIONS_APROVADO_REPROVADO.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
              value={formData.marcacao}
              onValueChange={(value) => handleSelectChange("marcacao", value)}
              placeholder="Selecione o status"
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
