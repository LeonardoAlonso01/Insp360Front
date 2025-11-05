"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, PlusCircle, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Step5Data } from "@/types/inspection-steps"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { SearchSelect } from "@/components/ui/search-select"
import { OPTIONS_APROVADO_CONDENADO, OPTIONS_APROVADO_REPROVADO, OPTIONS_SIM_NAO } from "@/lib/form-options"
import { CopyItemModal } from "@/components/ui/copy-item-modal"
import { PostCopyModal } from "@/components/ui/post-copy-modal"

interface Step5FormProps {
  inspectionId: string
  initialData: Partial<Step5Data>
  onAddNewItem: (data: Step5Data) => void
  onFinalize: (data: Step5Data) => void
  onBack: () => void
  loading: boolean
}

export function Step5Form({ inspectionId, initialData, onAddNewItem, onFinalize, onBack, loading }: Step5FormProps) {
  const [formData, setFormData] = useState<Step5Data>({
    idInspection: inspectionId,
    substituicoesAneis: "Não", // Default value
    novoEnsaioHidrostatico: "Aprovado", // Default value
    secagem: "Sim", // Default value
    limpeza: "Sim", // Default value
    resultadoFinal: "Aprovado", // Default value
    observacoesFinais: "",
    ...initialData,
  })

  const [showCopyModal, setShowCopyModal] = useState(false)
  const [showPostCopyModal, setShowPostCopyModal] = useState(false)
  const [copyLoading, setCopyLoading] = useState(false)

  const { toast } = useToast();

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialData, idInspection: inspectionId }))
  }, [initialData, inspectionId])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSelectChange = (id: keyof Step5Data, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value as any, // Type assertion for select values
    }))
  }



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFinalize(formData)
  }

  const handleAddNewItem = async () => {
    onAddNewItem(formData)
  }

  const handlePostCopyAddNewItem = () => {
    setShowPostCopyModal(false)
    onAddNewItem(formData)
  }

  const handlePostCopyFinalize = () => {
    setShowPostCopyModal(false)
    onFinalize(formData)
  }

  const handleCopyItem = async (copies: number) => {
    setCopyLoading(true)
    try {
      // 1. Primeiro, salvar o item atual (etapa 5)
      console.log("Salvando item atual para copiar:", formData)
      await apiClient.saveStep5(inspectionId, { ...formData, idInspection: inspectionId })
      
      // 2. Finalizar o item atual para que ele seja salvo no sistema
      const itemId = await apiClient.finalizeInspectionItem(inspectionId)
      
      // 3. Enviar requisição para a API criar as cópias
      // Usando o inspectionId como itemId temporário, a API deve identificar o item mais recente
      await apiClient.copyInspectionItem(itemId, itemId, copies)
      
      toast({
        title: "Sucesso!",
        description: `Item salvo e ${copies} cópia(s) solicitada(s) com sucesso.`,
        variant: "success",
      })
      
      setShowCopyModal(false)
      // Mostrar o modal de escolha após a cópia
      setShowPostCopyModal(true)
    } catch (error: any) {
      toast({
        title: "Erro!",
        description: error?.message || "Erro ao copiar o item.",
        variant: "destructive",
      })
    } finally {
      setCopyLoading(false)
    }
  }

  const isFormValid =
    formData.substituicoesAneis.trim() !== "" &&
    formData.novoEnsaioHidrostatico.trim() !== "" &&
    formData.secagem.trim() !== "" &&
    formData.limpeza.trim() !== "" &&
    formData.resultadoFinal.trim() !== ""

  return (
    <>
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mx-2 sm:mx-0">
        <CardHeader className="space-y-1 pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Etapa 5: Finalização e Resultado</CardTitle>
          <CardDescription className="text-sm">Conclua a inspeção e registre o resultado final.</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Campo Substituições de Anéis */}
            <div className="space-y-2">

              <Label htmlFor="substituicoesAneis" className="text-sm font-medium flex items-center">
                Substituições de Anéis
                <Badge variant="destructive" className="ml-2 text-xs">
                  Obrigatório
                </Badge>
              </Label>

              <SearchSelect
                options={OPTIONS_SIM_NAO.map((opt) => ({
                  label: opt.label,
                  value: opt.value,
                }))}
                value={formData.substituicoesAneis}
                onValueChange={(value) => handleSelectChange("substituicoesAneis", value)}
                placeholder="Selecione"
                className="h-11"
              />
            </div>

            {/* Campo Novo Ensaio Hidrostático */}
            <div className="space-y-2">

              <Label htmlFor="novoEnsaioHidrostatico" className="text-sm font-medium flex items-center">
                Novo Ensaio Hidrostático
                <Badge variant="destructive" className="ml-2 text-xs">
                  Obrigatório
                </Badge>
              </Label>

              <SearchSelect
                options={OPTIONS_APROVADO_REPROVADO.map((opt) => ({
                  label: opt.label,
                  value: opt.value,
                }))}
                value={formData.novoEnsaioHidrostatico}
                onValueChange={(value) => handleSelectChange("novoEnsaioHidrostatico", value)}
                placeholder="Selecione"
                className="h-11"
              />
            </div>

            {/* Campo Secagem */}
            <div className="space-y-2">

              <Label htmlFor="secagem" className="text-sm font-medium flex items-center">
                Secagem
                <Badge variant="destructive" className="ml-2 text-xs">
                  Obrigatório
                </Badge>
              </Label>

              <SearchSelect
                options={OPTIONS_SIM_NAO.map((opt) => ({
                  label: opt.label,
                  value: opt.value,
                }))}
                value={formData.secagem}
                onValueChange={(value) => handleSelectChange("secagem", value)}
                placeholder="Selecione"
                className="h-11"
              />

            </div>

            {/* Campo Limpeza */}
            <div className="space-y-2">

              <Label htmlFor="limpeza" className="text-sm font-medium flex items-center">
                Limpeza
                <Badge variant="destructive" className="ml-2 text-xs">
                  Obrigatório
                </Badge>
              </Label>
              
              <SearchSelect
                options={OPTIONS_SIM_NAO.map((opt) => ({
                  label: opt.label,
                  value: opt.value,
                }))}
                value={formData.limpeza}
                onValueChange={(value) => handleSelectChange("limpeza", value)}
                placeholder="Selecione"
                className="h-11"
              />

            </div>

            {/* Campo Resultado Final */}
            <div className="space-y-2">

              <Label htmlFor="resultadoFinal" className="text-sm font-medium flex items-center">
                Resultado Final
                <Badge variant="destructive" className="ml-2 text-xs">
                  Obrigatório
                </Badge>
              </Label>

              <SearchSelect
                options={OPTIONS_APROVADO_CONDENADO.map((opt) => ({
                  label: opt.label,
                  value: opt.value,
                }))}
                value={formData.resultadoFinal}
                onValueChange={(value) => handleSelectChange("resultadoFinal", value)}
                placeholder="Selecione"
                className="h-11"
              />
              
            </div>

            {/* Campo Observações Finais */}
            <div className="space-y-2">
              <Label htmlFor="observacoesFinais" className="text-sm font-medium flex items-center">
                Observações Finais
                <Badge variant="secondary" className="ml-2 text-xs">
                  Opcional
                </Badge>
              </Label>
              <Textarea
                id="observacoesFinais"
                placeholder="Digite observações adicionais sobre a finalização..."
                value={formData.observacoesFinais}
                onChange={handleChange}
                className="min-h-[120px] sm:min-h-[100px] resize-none transition-all duration-200 focus:ring-2 focus:ring-red-500/20 text-base sm:text-sm"
                rows={5}
              />
              <p className="text-xs text-slate-500">{formData.observacoesFinais?.length || 0}/500 caracteres</p>
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
                    Finalizando Inspeção...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizar Inspeção
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 sm:h-11 font-medium text-base sm:text-sm"
                disabled={loading}
                onClick={handleAddNewItem}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Novo Item
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 sm:h-11 font-medium text-base sm:text-sm"
                disabled={loading}
                onClick={() => setShowCopyModal(true)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Item
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

      <CopyItemModal
        isOpen={showCopyModal}
        onClose={() => setShowCopyModal(false)}
        onCopy={handleCopyItem}
        loading={copyLoading}
      />
      
      <PostCopyModal
        isOpen={showPostCopyModal}
        onClose={() => setShowPostCopyModal(false)}
        onFinalize={handlePostCopyFinalize}
        onAddNewItem={handlePostCopyAddNewItem}
      />
    </>
  )
}
