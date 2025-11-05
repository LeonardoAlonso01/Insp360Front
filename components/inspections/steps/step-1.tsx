"use client"

import type React from "react"
import { useState, useEffect } from "react" // Importar useEffect
import { Building2, Settings, Ruler, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { Step1Data } from "@/types/inspection-steps"
import {
  OPTIONS_MARCA_DUTO,
  OPTIONS_MARCA_UNIAO,
  OPTIONS_DIAMETROS,
  OPTIONS_COMPRIMENTO_NOMINAL,
} from "@/lib/form-options"
import { SearchSelect } from "@/components/ui/search-select"
import { useInspections } from "@/hooks/use-inspections"

interface Step1FormProps {
  inspectionId: string
  initialData?: Partial<Step1Data>
  onNext: (data: Step1Data) => void
  onBack: () => void
  loading?: boolean
}

export function Step1Form({ inspectionId, initialData, onNext, onBack, loading }: Step1FormProps) {
  // Inicializa o estado com base em initialData ou valores padrão
  const [formData, setFormData] = useState<Omit<Step1Data, "idInspection">>(() => ({
    marcaDutoFlexivel: initialData?.marcaDutoFlexivel || "",
    marcaUniao: initialData?.marcaUniao || "",
    diametro: initialData?.diametro || "", // Garante que seja um número
    comprimentoNominal: initialData?.comprimentoNominal || "", // Garante que seja um número
  }))

  const { submitEtapa1 } = useInspections();

  // Atualiza o formData quando initialData ou inspectionId mudam (ex: ao carregar dados existentes)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      marcaDutoFlexivel: initialData?.marcaDutoFlexivel || "",
      marcaUniao: initialData?.marcaUniao || "",
      diametro: initialData?.diametro || "",
      comprimentoNominal: initialData?.comprimentoNominal || "",
    }))
  }, [initialData, inspectionId]) // Adicionado inspectionId como dependência

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data: Step1Data = {
      ...formData,
      idInspection: inspectionId,
    };
    try {
      const response = await submitEtapa1(data)
      if (response === null || response === undefined || response?.ok) {
        console.log("Dados do Duto Flexível salvos com sucesso:", data);
        onNext(data) // Chama a função onNext com os dados preenchidos;
      }

    } catch (err) {
      console.error(err);
    }
  }

  

  // Validação: campos de texto não vazios e campos numéricos maiores que zero
  const isFormValid =
    formData.marcaDutoFlexivel.trim() !== "" &&
    formData.marcaUniao.trim() !== "" &&
    formData.diametro.trim() !== "" &&
    formData.comprimentoNominal.trim() !== "" 

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl flex items-center gap-2">
          <Settings className="h-5 w-5 text-red-600" />
          Dados do Duto Flexível
        </CardTitle>
        <CardDescription>Preencha as informações técnicas do duto flexível</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Marca do Duto Flexível */}
          <div className="space-y-2">
            <Label htmlFor="marcaDutoFlexivel" className="text-sm font-medium flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-slate-500" />
              Marca do Duto Flexível
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <SearchSelect
              options={OPTIONS_MARCA_DUTO}
              value={formData.marcaDutoFlexivel}
              onValueChange={(value) => handleInputChange("marcaDutoFlexivel", value)}
              placeholder="Selecione a marca do duto"
              searchPlaceholder="Buscar marca..."
              className="h-11"
            />
          </div>

          {/* Marca da União */}
          <div className="space-y-2">
            <Label htmlFor="marcaUniao" className="text-sm font-medium flex items-center">
              <Settings className="h-4 w-4 mr-2 text-slate-500" />
              Marca da União
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <SearchSelect
              options={OPTIONS_MARCA_UNIAO}
              value={formData.marcaUniao}
              onValueChange={(value) => handleInputChange("marcaUniao", value)}
              placeholder="Selecione a marca da união"
              searchPlaceholder="Buscar marca..."
              className="h-11"
            />
          </div>

          {/* Diâmetro */}
          <div className="space-y-2">
            <Label htmlFor="diametro" className="text-sm font-medium flex items-center">
              <Ruler className="h-4 w-4 mr-2 text-slate-500" />
              Diâmetro
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <SearchSelect
              options={OPTIONS_DIAMETROS}
              value={formData.diametro.toString()} // Converte número para string para o SearchSelect
              onValueChange={(value) => handleInputChange("diametro", value)} // Converte de volta para número
              placeholder="Selecione o diâmetro"
              className="h-11"
            />
          </div>

          {/* Comprimento Nominal */}
          <div className="space-y-2">
            <Label htmlFor="comprimentoNominal" className="text-sm font-medium flex items-center">
              <Ruler className="h-4 w-4 mr-2 text-slate-500" />
              Comprimento Nominal (m)
              <Badge variant="destructive" className="ml-2 text-xs">
                Obrigatório
              </Badge>
            </Label>
            <SearchSelect
              options={OPTIONS_COMPRIMENTO_NOMINAL}
              value={formData.comprimentoNominal.toString()} // Converte número para string para o SearchSelect
              onValueChange={(value) => handleInputChange("comprimentoNominal", value)} // Converte de volta para número
              placeholder="Selecione o comprimento"
              className="h-11"
            />
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
              Voltar
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

