"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Building2, CheckCircle, FileText, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Toast } from "@/components/ui/toast"
import { useInspections } from "@/hooks/use-inspections"
import { useToast } from "@/hooks/use-toast"
import type { Inspection } from "@/lib/api"

interface InspectionFormProps {
  onBack: () => void
  onInspectionCreated: (inspectionId: string) => void
  editingInspection?: Inspection | null
}

export default function InspectionForm({ onBack, onInspectionCreated, editingInspection }: InspectionFormProps) {
  const [formData, setFormData] = useState({
    cliente: editingInspection?.cliente || "",
    responsavel: editingInspection?.responsavel || "",
    observacoes: editingInspection?.observacoes || "",
  })

  const { toasts, toast, removeToast } = useToast()
  const { createInspection, updateInspection } = useInspections({ autoFetch: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!editingInspection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // if (isEditing) {
      //   // A API de update pode ter um formato diferente, mantendo o original por enquanto
      //   await updateInspection(editingInspection.id, formData)
      //   toast({
      //     title: "Sucesso!",
      //     description: "Inspeção atualizada com sucesso",
      //     variant: "success",
      //   })

      //   setTimeout(() => {
      //     onBack()
      //   }, 1000)
      // } else {
        // Usando o novo formato de request para createInspection
        console.log("Attempting to create new inspection with data:", formData)
        const newInspection = await createInspection({
          client: formData.cliente,
          responsible: formData.responsavel,
          obs: formData.observacoes,
          companyId: "default", // Substitua pelo ID da empresa real se necessário
          result: "pendente", // Status padrão, pode ser alterado conforme necessário
        })
        console.log("New inspection created:", newInspection)

        if (newInspection && newInspection.id) {
          toast({
            title: "Sucesso!",
            description: "Inspeção criada com sucesso. Redirecionando para as etapas...",
            variant: "success",
          })

          setTimeout(() => {
            console.log("Redirecting to steps with ID:", newInspection.id)
            onInspectionCreated(newInspection.id)
          }, 1500)
        } else {
          console.error("New inspection object or ID is invalid:", newInspection)
          toast({
            title: "Erro!",
            description: "Inspeção criada, mas ID inválido para redirecionamento.",
            variant: "destructive",
          })
        }
      // }
    } catch (error) {
      console.error("Erro ao criar/atualizar inspeção:", error)
      toast({
        title: "Erro!",
        description: `Não foi possível ${isEditing ? "atualizar" : "criar"} a inspeção: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = formData.cliente.trim() && formData.responsavel.trim()

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
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
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
              >
                <Users className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Usuário</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <button onClick={onBack} className="hover:text-slate-900 transition-colors text-sm">
            Inspeções
          </button>
          <span>/</span>
          <span className="text-slate-900 font-medium text-sm">{isEditing ? "Editar Inspeção" : "Nova Inspeção"}</span>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="space-y-4 sm:space-y-6">
          {/* Header da página */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full mb-3 sm:mb-4">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {isEditing ? "Editar Inspeção" : "Criar Nova Inspeção"}
            </h1>
            <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base px-4 sm:px-0">
              {isEditing
                ? "Atualize as informações da inspeção abaixo"
                : "Preencha as informações básicas. Após salvar, você será direcionado para as etapas detalhadas."}
            </p>
          </div>

          {/* Formulário */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mx-2 sm:mx-0">
            <CardHeader className="space-y-1 pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Informações Básicas da Inspeção</CardTitle>
              <CardDescription className="text-sm">
                {isEditing
                  ? "Todos os campos marcados com * são obrigatórios"
                  : "Após salvar, você poderá preencher os detalhes técnicos em 5 etapas"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Campo Cliente */}
                <div className="space-y-2">
                  <Label htmlFor="cliente" className="text-sm font-medium flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-slate-500" />
                    Cliente
                    <Badge variant="destructive" className="ml-2 text-xs">
                      Obrigatório
                    </Badge>
                  </Label>
                  <Input
                    id="cliente"
                    type="text"
                    placeholder="Digite o nome do cliente"
                    value={formData.cliente}
                    onChange={(e) => handleInputChange("cliente", e.target.value)}
                    className="h-12 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 text-base sm:text-sm"
                    required
                  />
                </div>

                {/* Campo Responsável */}
                <div className="space-y-2">
                  <Label htmlFor="responsavel" className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-2 text-slate-500" />
                    Responsável
                    <Badge variant="destructive" className="ml-2 text-xs">
                      Obrigatório
                    </Badge>
                  </Label>
                  <Input
                    id="responsavel"
                    type="text"
                    placeholder="Digite o nome do responsável"
                    value={formData.responsavel}
                    onChange={(e) => handleInputChange("responsavel", e.target.value)}
                    className="h-12 sm:h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 text-base sm:text-sm"
                    required
                  />
                </div>

                {/* Campo Observações */}
                <div className="space-y-2">
                  <Label htmlFor="observacoes" className="text-sm font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-slate-500" />
                    Observações
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Opcional
                    </Badge>
                  </Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Digite observações adicionais sobre a inspeção..."
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange("observacoes", e.target.value)}
                    className="min-h-[120px] sm:min-h-[100px] resize-none transition-all duration-200 focus:ring-2 focus:ring-red-500/20 text-base sm:text-sm"
                    rows={5}
                  />
                  <p className="text-xs text-slate-500">{formData.observacoes.length}/500 caracteres</p>
                </div>

                {/* Botões de ação */}
                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full h-12 sm:h-11 bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 disabled:opacity-50 text-base sm:text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        {isEditing ? "Atualizando..." : "Salvando..."}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isEditing ? "Atualizar Inspeção" : "Salvar e Continuar"}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 sm:h-11 font-medium text-base sm:text-sm"
                    disabled={isSubmitting}
                    onClick={onBack}
                  >
                    Cancelar
                  </Button>
                </div>

                {/* Indicador de progresso */}
                {!isFormValid && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">Complete os campos obrigatórios para continuar</p>
                  </div>
                )}

                {/* Informação sobre próximas etapas */}
                {!isEditing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">Próximas etapas:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Dados do Duto Flexível</li>
                      <li>• Dados de Instalação</li>
                      <li>• Dados de Pressão</li>
                      <li>• Dados de Segurança</li>
                      <li>• Finalização</li>
                    </ul>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
