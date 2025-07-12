"use client"

import { useState, useEffect } from "react"
import { Download, FileText, CheckCircle, Building2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { PDFGenerator } from "@/lib/pdf-generator"
import type { InspectionItem, Inspection } from "@/lib/api"

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
      // Carregar dados da inspeção
      const inspectionResponse = await apiClient.getInspection(inspectionId)
      if (inspectionResponse.success) {
        setInspection(inspectionResponse.data)
      }

      // Carregar itens da inspeção
      const itemsResponse = await apiClient.getInspectionItems(inspectionId)
      if (itemsResponse.success) {
        setItems(itemsResponse.data)
      }
    } catch (error) {
      console.log("Error loading inspection data:", error)

      // Mock data para desenvolvimento
      setInspection({
        id: inspectionId,
        cliente: "Empresa ABC Ltda",
        responsavel: "João Silva",
        data: "2024-06-14",
        status: "concluida",
        observacoes: "Inspeção finalizada com sucesso",
      })

      setItems([
        {
          id: "item-1",
          inspectionId,
          step1Data: {
            marcaDutoFlexivel: "Contitech FlexSteel",
            marcaUniao: "Parker Hannifin",
            diametro: 50.8,
            comprimentoNominal: 12.5,
          },
          step2Data: {
            dataInstalacao: "2024-06-01",
            localInstalacao: "Setor A - Linha de Produção 1",
            tipoInstalacao: "subterranea",
            profundidade: 2.5,
          },
          step3Data: {},
          step4Data: {},
          step5Data: {
            statusFinal: "aprovado",
            observacoesFinais:
              "Item aprovado sem ressalvas. Todas as especificações técnicas foram atendidas conforme normas vigentes.",
          },
          createdAt: "2024-06-14T10:00:00Z",
        },
        {
          id: "item-2",
          inspectionId,
          step1Data: {
            marcaDutoFlexivel: "Technip Flexibles",
            marcaUniao: "Cameron International",
            diametro: 76.2,
            comprimentoNominal: 8.0,
          },
          step2Data: {
            dataInstalacao: "2024-06-02",
            localInstalacao: "Setor B - Linha de Transferência",
            tipoInstalacao: "aerea",
            profundidade: 0,
          },
          step3Data: {},
          step4Data: {},
          step5Data: {
            statusFinal: "pendente",
            observacoesFinais: "Aguardando teste de pressão final. Instalação conforme especificações.",
          },
          createdAt: "2024-06-14T11:30:00Z",
        },
        {
          id: "item-3",
          inspectionId,
          step1Data: {
            marcaDutoFlexivel: "NOV Flexibles",
            marcaUniao: "FMC Technologies",
            diametro: 101.6,
            comprimentoNominal: 15.0,
          },
          step2Data: {
            dataInstalacao: "2024-06-03",
            localInstalacao: "Setor C - Manifold Principal",
            tipoInstalacao: "submarina",
            profundidade: 5.2,
          },
          step3Data: {},
          step4Data: {},
          step5Data: {
            statusFinal: "reprovado",
            observacoesFinais:
              "Identificada falha na vedação da união. Necessária substituição do componente antes da aprovação final.",
          },
          createdAt: "2024-06-14T14:15:00Z",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleGeneratePDF = async () => {
    if (!inspection || items.length === 0) {
      toast({
        title: "Erro!",
        description: "Dados da inspeção não disponíveis",
        variant: "destructive",
      })
      return
    }

    setGeneratingPDF(true)
    try {
      await PDFGenerator.generateAndDownload({
        inspection,
        items,
      })

      toast({
        title: "Sucesso!",
        description: "PDF gerado e baixado com sucesso",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível gerar o PDF",
        variant: "destructive",
      })
    } finally {
      setGeneratingPDF(false)
    }
  }

  const handlePreviewPDF = async () => {
    if (!inspection || items.length === 0) {
      toast({
        title: "Erro!",
        description: "Dados da inspeção não disponíveis",
        variant: "destructive",
      })
      return
    }

    setPreviewingPDF(true)
    try {
      const blob = await PDFGenerator.generateBlob({
        inspection,
        items,
      })

      // Abrir PDF em nova aba
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank")
      URL.revokeObjectURL(url)

      toast({
        title: "Sucesso!",
        description: "PDF aberto para visualização",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível visualizar o PDF",
        variant: "destructive",
      })
    } finally {
      setPreviewingPDF(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aprovado":
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Aprovado</Badge>
      case "reprovado":
        return <Badge className="bg-red-100 text-red-800 border-red-200">❌ Reprovado</Badge>
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⏳ Pendente</Badge>
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

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
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                Voltar à Lista
              </Button>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-slate-900">Sistema de Inspeções</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header da página */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Inspeção Finalizada</h1>
            <p className="text-slate-600">Relatório completo da inspeção realizada</p>
          </div>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{items.length}</p>
                    <p className="text-sm text-slate-600">Total de Itens</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.aprovados}</p>
                    <p className="text-sm text-slate-600">Aprovados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.pendentes}</p>
                    <p className="text-sm text-slate-600">Pendentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.reprovados}</p>
                    <p className="text-sm text-slate-600">Reprovados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações da Inspeção */}
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
                  <p className="font-semibold text-slate-900">{inspection?.cliente}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Responsável</p>
                  <p className="font-semibold text-slate-900">{inspection?.responsavel}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Data</p>
                  <p className="font-semibold text-slate-900">
                    {inspection?.data ? new Date(inspection.data).toLocaleDateString("pt-BR") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <Badge className="bg-green-100 text-green-800 border-green-200">✅ Concluída</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Itens
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-600" />
                  Itens Inspecionados ({items.length})
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={handlePreviewPDF}
                    disabled={previewingPDF}
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    {previewingPDF ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent mr-2" />
                        Abrindo...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar PDF
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleGeneratePDF}
                    disabled={generatingPDF}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {generatingPDF ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Gerando PDF...
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
              <CardDescription>Resumo de todos os itens inspecionados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <Card key={item.id} className="border border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-bold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-slate-900">Item {index + 1}</h3>
                            <p className="text-sm text-slate-600">
                              Criado em {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(item.step5Data?.statusFinal)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-slate-600 font-medium">Marca do Duto</p>
                          <p className="font-semibold text-slate-900">{item.step1Data?.marcaDutoFlexivel || "N/A"}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-slate-600 font-medium">Marca da União</p>
                          <p className="font-semibold text-slate-900">{item.step1Data?.marcaUniao || "N/A"}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-slate-600 font-medium">Diâmetro</p>
                          <p className="font-semibold text-slate-900">{item.step1Data?.diametro || "N/A"}mm</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-slate-600 font-medium">Comprimento</p>
                          <p className="font-semibold text-slate-900">{item.step1Data?.comprimentoNominal || "N/A"}m</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-slate-600 font-medium">Local de Instalação</p>
                          <p className="font-semibold text-slate-900">{item.step2Data?.localInstalacao || "N/A"}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-slate-600 font-medium">Tipo de Instalação</p>
                          <p className="font-semibold text-slate-900 capitalize">
                            {item.step2Data?.tipoInstalacao || "N/A"}
                          </p>
                        </div>
                      </div>

                      {item.step5Data?.observacoesFinais && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-blue-900 font-medium text-sm mb-1">Observações Finais</p>
                          <p className="text-blue-800 text-sm leading-relaxed">{item.step5Data.observacoesFinais}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {items.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">Nenhum item encontrado para esta inspeção</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card> */}
        </div>
      </main>
    </div>
  )
}
