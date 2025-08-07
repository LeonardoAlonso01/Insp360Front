"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, FileText, Users, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Toast } from "@/components/ui/toast"
import { StepProgress } from "@/components/inspection-steps/step-progress"
import { Step1Form } from "@/components/inspection-steps/step1-form"
import { Step2Form } from "@/components/inspection-steps/step2-form"
import { Step5Form } from "@/components/inspection-steps/step5-form"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { Step3Form } from "@/components/inspection-steps/step3-form"
import { Step4Form } from "@/components/inspection-steps/step4-form"
import type {
  InspectionStepsState,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  Step5Data,
} from "@/types/inspection-steps"

interface InspectionStepsProps {
  inspectionId: string
  onBack: () => void
  onFinalize: (inspectionId: string) => void
}

const STEP_TITLES = ["Dados do Duto", "Ensaio/Fabricação", "Inspeção Visual", "Ensaio/Manutenção", "Finalização"]

export default function InspectionSteps({ inspectionId, onBack, onFinalize }: InspectionStepsProps) {
  const [state, setState] = useState<InspectionStepsState>({
    currentStep: 1,
    inspectionId,
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
  })

  const [loading, setLoading] = useState(false)
  const { toasts, toast, removeToast } = useToast()

  // Carregar dados existentes ao montar o componente
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        // Tentar carregar dados de cada etapa
        for (let step = 1; step <= 5; step++) {
          try {
            const response = await apiClient.getStepData(inspectionId, step)
            if (response) {
              // A API agora retorna o objeto diretamente, não um { success: true, data: ... }
              setState((prev) => ({
                ...prev,
                [`step${step}`]: response,
              }))
            }
          } catch (error) {
            // Ignorar erros de etapas não encontradas (e.g., 404)
            console.log(`Step ${step} data not found or error, continuing...`, error)
          }
        }
      } catch (error) {
        console.error("Error loading existing data:", error)
      }
    }

    loadExistingData()
  }, [inspectionId])

  const handleStep1Next = async (data: Step1Data) => {
    setLoading(true)
    try {
      // A API espera idInspection no corpo, não no path
      await apiClient.saveStep1(inspectionId, data)

      setState((prev) => ({
        ...prev,
        step1: data,
        currentStep: 2,
      }))

      toast({
        title: "Sucesso!",
        description: "Dados do duto salvos com sucesso",
        variant: "success",
      })
    } catch (error) {
      console.error("Erro ao salvar dados da Etapa 1:", error)
      toast({
        title: "Erro!",
        description: `Não foi possível salvar os dados do duto: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStep2Next = async (data: Step2Data) => {
    setLoading(true)
    try {
      await apiClient.saveStep2(inspectionId, data)

      setState((prev) => ({
        ...prev,
        step2: data,
        currentStep: 3,
      }))

      toast({
        title: "Sucesso!",
        description: "Dados de ensaio e fabricação salvos com sucesso",
        variant: "success",
      })
    } catch (error) {
      console.error("Erro ao salvar dados da Etapa 2:", error)
      toast({
        title: "Erro!",
        description: `Não foi possível salvar os dados de ensaio e fabricação: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStep3Next = async (data: Step3Data) => {
    setLoading(true)
    try {
      await apiClient.saveStep3(inspectionId, data)

      setState((prev) => ({
        ...prev,
        step3: data,
        currentStep: 4,
      }))

      toast({
        title: "Sucesso!",
        description: "Dados de inspeção visual salvos com sucesso",
        variant: "success",
      })
    } catch (error) {
      console.error("Erro ao salvar dados da Etapa 3:", error)
      toast({
        title: "Erro!",
        description: `Não foi possível salvar os dados de inspeção visual: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStep4Next = async (data: Step4Data) => {
    setLoading(true)
    try {
      await apiClient.saveStep4(inspectionId, data)

      setState((prev) => ({
        ...prev,
        step4: data,
        currentStep: 5,
      }))

      toast({
        title: "Sucesso!",
        description: "Dados de ensaio e manutenção salvos com sucesso",
        variant: "success",
      })
    } catch (error) {
      console.error("Erro ao salvar dados da Etapa 4:", error)
      toast({
        title: "Erro!",
        description: `Não foi possível salvar os dados de ensaio e manutenção: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStep5Finalize = async (data: Step5Data) => {
    setLoading(true)
    try {
      console.log(inspectionId);
      // 1. Salvar dados da etapa 5
      await apiClient.saveStep5(inspectionId, data)

      // 2. Finalizar o ITEM da inspeção
      await apiClient.finalizeInspectionItem(inspectionId)

      // 3. Finalizar a INSPEÇÃO PRINCIPAL
      await apiClient.completeInspection(inspectionId)

      toast({
        title: "Sucesso!",
        description: "Inspeção finalizada com sucesso",
        variant: "success",
      })
      
      // Chamar a função de callback para finalizar a inspeção
      // Isso pode ser usado para redirecionar ou atualizar o estado no componente pai
      setTimeout(() => {
        onFinalize(inspectionId)
      }, 1000);

    } catch (error) {
      console.error("Erro ao finalizar inspeção:", error)
      toast({
        title: "Erro!",
        description: `Não foi possível finalizar a inspeção: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddNewItem = async (data: Step5Data) => {
    setLoading(true)
    try {
      // 1. Salvar dados da etapa 5
      await apiClient.saveStep5(inspectionId, data);

      // 2. Finalizar o ITEM da inspeção
      await apiClient.finalizeInspectionItem(inspectionId)

      // 3. Resetar para etapa 1 para novo item, igual ao step 4
      setState((prev) => ({
        ...prev,
        currentStep: 1,
        step1: {},
        step2: {},
        step3: {},
        step4: {},
        step5: {},
      }))

      toast({
        title: "Item Salvo!",
        description: "Iniciando novo item da inspeção",
        variant: "success",
      });

    } catch (error) {
      console.error("Erro ao adicionar novo item:", error)
      toast({
        title: "Erro!",
        description: `Não foi possível adicionar novo item: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStepBack = (targetStep: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: targetStep,
    }))
  }

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <Step1Form
            inspectionId={inspectionId}
            initialData={state.step1}
            onNext={handleStep1Next}
            onBack={onBack}
            loading={loading}
          />
        )
      case 2:
        return (
          <Step2Form
            inspectionId={inspectionId}
            initialData={state.step2}
            onNext={handleStep2Next}
            onBack={() => handleStepBack(1)}
            loading={loading}
          />
        )
      case 3:
        return (
          <Step3Form
            inspectionId={inspectionId}
            initialData={state.step3}
            onNext={handleStep3Next}
            onBack={() => handleStepBack(2)}
            loading={loading}
          />
        )
      case 4:
        return (
          <Step4Form
            inspectionId={inspectionId}
            initialData={state.step4}
            onNext={handleStep4Next}
            onBack={() => handleStepBack(3)}
            loading={loading}
          />
        )
      case 5:
        return (
          <Step5Form
            inspectionId={inspectionId}
            initialData={state.step5}
            onAddNewItem={handleAddNewItem}
            onFinalize={handleStep5Finalize}
            onBack={() => handleStepBack(4)}
            loading={loading}
          />
        )
      default:
        return null
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
          <span className="text-slate-900 font-medium text-sm">Detalhes da Inspeção</span>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="space-y-6">
          {/* Header da página */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full mb-3 sm:mb-4">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Detalhes da Inspeção</h1>
            <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base px-4 sm:px-0">
              Complete as etapas para cada item da inspeção
            </p>
          </div>

          {/* Progress Indicator */}
          <StepProgress currentStep={state.currentStep} totalSteps={5} stepTitles={STEP_TITLES} />

          {/* Step Content */}
          <div className="mx-2 sm:mx-0">{renderCurrentStep()}</div>
        </div>
      </main>
    </div>
  )
}
