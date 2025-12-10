"use client"

import { useState, useEffect } from "react"
import { Download, FileText, CheckCircle, Building2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import type { InspectionItem, Inspection } from "@/lib/api"
import { getStatusBadge } from "@/components/inspections/utils"

interface InspectionFinalizationProps {
  inspectionId: string
  onBack: () => void
}

export default function InspectionFinalization({ inspectionId, onBack }: InspectionFinalizationProps) {
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [items, setItems] = useState<InspectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const [previewingPDF, setPreviewingPDF] = useState(false)

  const { toasts, toast, removeToast } = useToast()

  useEffect(() => {
    loadInspectionData()
  }, [inspectionId])

  const loadInspectionData = async () => {
    setLoading(true)
    try {
      // Carregar dados da inspeção diretamente da API mockada
      const inspectionData = await apiClient.getInspection(inspectionId)
      setInspection(inspectionData)

      // Carregar itens da inspeção diretamente da API mockada
      const itemsData = await apiClient.getInspectionItems(inspectionId)
      setItems(itemsData)
    } catch (error) {
      console.error("Error loading MOCKED inspection data:", error)
      toast({
        title: "Erro de Mock!",
        description: "Não foi possível carregar os dados mockados da inspeção.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGeneratePDF = async () => {
    if (!inspection) {
      toast({
        title: "Erro!",
        description: "Dados da inspeção não disponíveis",
        variant: "destructive",
      })
      return
    }

    if (!inspectionId) {
      toast({
        title: "Erro!",
        description: "ID da inspeção não encontrado",
        variant: "destructive",
      })
      return
    }

    setGeneratingPDF(true)
    try {
      console.log("[InspectionFinalization] Iniciando geração de relatório para:", inspectionId)
      
      // Gerar relatório via API
      const blob = await apiClient.generateInspectionReport(inspectionId)
      
      if (!blob || blob.size === 0) {
        throw new Error("O arquivo PDF retornado está vazio")
      }
      
      console.log("[InspectionFinalization] Blob recebido, tamanho:", blob.size, "bytes")
      
      // Criar link de download
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `relatorio-inspecao-${inspectionId}-${new Date().getTime()}.pdf`
      document.body.appendChild(link)
      link.click()
      
      // Limpar após um pequeno delay
      setTimeout(() => {
        link.remove()
        URL.revokeObjectURL(url)
      }, 100)

      toast({
        title: "Sucesso!",
        description: "PDF gerado e baixado com sucesso",
        variant: "success",
      })
    } catch (error) {
      console.error("[InspectionFinalization] Erro ao gerar PDF:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao gerar o PDF"
      toast({
        title: "Erro!",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setGeneratingPDF(false)
    }
  }

  // const handlePreviewPDF = async () => {
  //   if (!inspection || items.length === 0) {
  //     toast({
  //       title: "Erro!",
  //       description: "Dados da inspeção não disponíveis",
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   setPreviewingPDF(true)
  //   try {
  //     const blob = await PDFGenerator.generateBlob({
  //       inspection,
  //       items,
  //     })

  //     const url = URL.createObjectURL(blob)
  //     window.open(url, "_blank")

  //     toast({
  //       title: "Sucesso!",
  //       description: "PDF aberto para visualização",
  //       variant: "success",
  //     })
  //   } catch (error) {
  //     console.error("PDF Preview Error:", error)
  //     toast({
  //       title: "Erro!",
  //       description: "Não foi possível visualizar o PDF",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setPreviewingPDF(false)
  //   }
  // }


  const getStatusStats = () => {
    const aprovados = items.filter((item) => item.step5Data?.statusFinal === "aprovado").length
    const reprovados = items.filter((item) => item.step5Data?.statusFinal === "reprovado").length
    const pendentes = items.filter((item) => item.step5Data?.statusFinal === "pendente").length

    return { aprovados, reprovados, pendentes }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-600">Carregando dados da inspeção...</p>
        </div>
      </div>
    )
  }

  const stats = getStatusStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                Voltar à Lista
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Inspeção Finalizada</h1>
            <p className="text-slate-600">Relatório completo da inspeção realizada</p>
          </div>

 
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-red-600" />
                Dados da Inspeção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Cliente</p>
                  <p className="font-semibold text-slate-900">{inspection?.client}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Responsável</p>
                  <p className="font-semibold text-slate-900">{inspection?.responsible}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Data</p>
                  <p className="font-semibold text-slate-900">
                    {inspection?.inspectionDate ? new Date(inspection.inspectionDate).toLocaleDateString("pt-BR") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  {getStatusBadge(inspection?.result)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">

                <div className="flex gap-2">
                  <Button
                    onClick={handleGeneratePDF}
                    disabled={generatingPDF}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {generatingPDF ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Baixando PDF...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar PDF
                      </>
                    )}
                  </Button>
                </div>
              </CardTitle>
              {/* <CardDescription>Resumo de todos os itens inspecionados</CardDescription> */}
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  )
}
