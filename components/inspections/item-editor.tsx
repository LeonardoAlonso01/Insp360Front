"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, X, FileText, Building2, Ruler, Calendar, Settings, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Toast } from "@/components/ui/toast"
import { SearchSelect } from "@/components/ui/search-select"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import {
  OPTIONS_MARCA_DUTO,
  OPTIONS_MARCA_UNIAO,
  OPTIONS_DIAMETROS,
  OPTIONS_COMPRIMENTO_NOMINAL,
  OPTIONS_TIPO,
  OPTIONS_SIM_NAO,
  OPTIONS_APROVADO_REPROVADO,
} from "@/lib/form-options"

interface InspectionItemEditorProps {
  inspectionId: string
  item: any
  onBack: () => void
  onSave: () => void
}

export function InspectionItemEditor({ inspectionId, item, onBack, onSave }: InspectionItemEditorProps) {
  const [formData, setFormData] = useState<any>({
    inspectionId: "",
    item: "",
    pipeBrand: "",
    unionBrand: "",
    diameter: "",
    nominalLength: "",
    type: "",
    manufactureYear: "",
    testPressure: "",
    nextInspectionDate: "",
    nextMaintenanceDate: "",
    actualLength: "",
    coatingShell: "",
    unions: "",
    sleeveLength: "",
    rubberSealing: "",
    marking: "",
    hydrostaticTest: "",
    rewelding: "",
    finalLength: "",
    unionReplacement: "",
    sealingReplacement: "",
    ringReplacements: "",
    newHydrostaticTest: "",
    cleaning: "",
    drying: "",
    finalResult: "",
  })
  
  const [saving, setSaving] = useState(false)
  const { toasts, toast, removeToast } = useToast()

  // Função para converter data ISO para formato do input (yyyy-MM-dd)
  const formatISOToInputDate = (isoDate: string | null | undefined): string => {
    if (!isoDate) return ""
    try {
      const date = new Date(isoDate)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch (error) {
      console.error("Erro ao converter data ISO:", isoDate)
      return ""
    }
  }

  // Função para extrair apenas o ano de uma data ISO
  const extractYearFromISO = (isoDate: string | null | undefined): string => {
    if (!isoDate) return ""
    try {
      const date = new Date(isoDate)
      return date.getFullYear().toString()
    } catch (error) {
      console.error("Erro ao extrair ano:", isoDate)
      return ""
    }
  }

  // Função para converter ano para ISO (primeiro dia do ano)
  const formatYearToISO = (year: string | null): string | null => {
    if (!year) return null
    try {
      const yearNum = parseInt(year)
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) return null
      const date = new Date(`${yearNum}-01-01T00:00:00.000Z`)
      return date.toISOString()
    } catch (error) {
      console.error("Erro ao formatar ano:", year)
      return null
    }
  }

  useEffect(() => {
    console.log("🔍 [ITEM-EDITOR] Item recebido:", item)
    console.log("🔍 [ITEM-EDITOR] Dados específicos:")
    console.log("   - rubberSealing:", item.rubberSealing)
    console.log("   - marking:", item.marking)
    console.log("   - hydrostaticTest:", item.hydrostaticTest)
    console.log("   - item completo:", JSON.stringify(item, null, 2))
    
    // Inicializa o formulário com os campos do item
    const initialData = {
      inspectionId: item.inspectionId ?? inspectionId,
      item: item.item ?? item.id,
      pipeBrand: item.pipeBrand ?? "",
      unionBrand: item.unionBrand ?? "",
      diameter: item.diameter ?? "",
      nominalLength: item.nominalLength ?? "",
      type: item.type?.toString() ?? "",
      manufactureYear: extractYearFromISO(item.manufactureYear),
      testPressure: item.testPressure ?? "",
      nextInspectionDate: formatISOToInputDate(item.nextInspectionDate),
      nextMaintenanceDate: formatISOToInputDate(item.nextMaintenanceDate),
      actualLength: item.actualLength ?? "",
      coatingShell: item.coatingShell ?? "",
      unions: item.unions ?? "",
      sleeveLength: item.sleeveLength ?? "",
      rubberSealing: item.rubberSealing ?? "",
      marking: item.marking ?? "",
      hydrostaticTest: item.hydrostaticTest ?? "",
      rewelding: item.rewelding ?? "",
      finalLength: item.finalLength ?? "",
      unionReplacement: item.unionReplacement ?? "",
      sealingReplacement: item.sealingReplacement ?? "",
      ringReplacements: item.ringReplacements ?? "",
      newHydrostaticTest: item.newHydrostaticTest ?? "",
      cleaning: item.cleaning ?? "",
      drying: item.drying ?? "",
      finalResult: item.finalResult ?? "",
    }
    
    console.log("🔧 [ITEM-EDITOR] FormData inicializado:", initialData)
    console.log("🔧 [ITEM-EDITOR] Valores específicos no formData:")
    console.log("   - rubberSealing:", initialData.rubberSealing)
    console.log("   - marking:", initialData.marking)
    console.log("   - hydrostaticTest:", initialData.hydrostaticTest)
    
    setFormData(initialData)
  }, [item, inspectionId])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  // Função para converter data do input para ISO com timezone UTC
  const formatDateToISO = (dateString: string | null): string | null => {
    if (!dateString) return null
    try {
      const date = new Date(dateString)
      return date.toISOString()
    } catch (error) {
      console.error("Erro ao formatar data:", dateString)
      return null
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const itemId = item.item || item.id
      const body = {
        inspectionId: formData.inspectionId,
        item: itemId,
        pipeBrand: formData.pipeBrand,
        unionBrand: formData.unionBrand,
        diameter: formData.diameter,
        nominalLength: formData.nominalLength,
        type: formData.type ? Number(formData.type) : undefined,
        manufactureYear: formatYearToISO(formData.manufactureYear),
        testPressure: formData.testPressure,
        nextInspectionDate: formatDateToISO(formData.nextInspectionDate),
        nextMaintenanceDate: formatDateToISO(formData.nextMaintenanceDate),
        actualLength: formData.actualLength,
        coatingShell: formData.coatingShell,
        unions: formData.unions,
        sleeveLength: formData.sleeveLength,
        rubberSealing: formData.rubberSealing,
        marking: formData.marking,
        hydrostaticTest: formData.hydrostaticTest,
        rewelding: formData.rewelding,
        finalLength: formData.finalLength,
        unionReplacement: formData.unionReplacement,
        sealingReplacement: formData.sealingReplacement,
        ringReplacements: formData.ringReplacements,
        newHydrostaticTest: formData.newHydrostaticTest,
        cleaning: formData.cleaning,
        drying: formData.drying,
        finalResult: formData.finalResult,
      }

      console.log("📤 [ITEM-EDITOR] Enviando dados para API:", body)
      console.log("📤 [ITEM-EDITOR] InspectionId:", formData.inspectionId)
      console.log("📤 [ITEM-EDITOR] ItemId:", itemId)
      
      const response = await apiClient.saveInspectionItem(body)
      
      console.log("✅ [ITEM-EDITOR] Resposta da API:", response)
      console.log("✅ [ITEM-EDITOR] Tipo da resposta:", typeof response)
      console.log("✅ [ITEM-EDITOR] Resposta completa:", JSON.stringify(response, null, 2))
      
      toast({
        title: "Sucesso!",
        description: "Item atualizado com sucesso",
        variant: "success",
      })
      
      setTimeout(() => {
        onSave()
      }, 500)
    } catch (error: any) {
      console.error("❌ [ITEM-EDITOR] Erro ao salvar item:", error)
      console.error("❌ [ITEM-EDITOR] Erro detalhado:", {
        message: error?.message,
        response: error?.response,
        status: error?.status,
        data: error?.data,
      })
      
      toast({
        title: "Erro!",
        description: error?.message || "Não foi possível atualizar o item.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
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
                <span className="font-semibold text-slate-900 text-sm sm:text-base">Editar Item</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <button onClick={onBack} className="hover:text-slate-900 transition-colors text-sm">
            Itens da Inspeção
          </button>
          <span>/</span>
          <span className="text-slate-900 font-medium text-sm">Editar Item #{formData.item}</span>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="space-y-6">
          {/* Header da página */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Editar Item da Inspeção</h1>
            <p className="text-slate-600 max-w-md mx-auto">Atualize os dados do item selecionado</p>
          </div>

          {/* Etapa 1: Dados do Duto */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-red-600" />
                Dados do Duto Flexível
              </CardTitle>
              <CardDescription>Informações básicas do duto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pipeBrand" className="text-sm font-medium">
                    Marca do Duto
                    <Badge variant="destructive" className="ml-2 text-xs">Obrigatório</Badge>
                  </Label>
                  <SearchSelect
                    options={OPTIONS_MARCA_DUTO}
                    value={formData.pipeBrand}
                    onValueChange={(value) => handleInputChange("pipeBrand", value)}
                    placeholder="Selecione a marca"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unionBrand" className="text-sm font-medium">
                    Marca da União
                    <Badge variant="destructive" className="ml-2 text-xs">Obrigatório</Badge>
                  </Label>
                  <SearchSelect
                    options={OPTIONS_MARCA_UNIAO}
                    value={formData.unionBrand}
                    onValueChange={(value) => handleInputChange("unionBrand", value)}
                    placeholder="Selecione a marca"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diameter" className="text-sm font-medium">
                    Diâmetro
                    <Badge variant="destructive" className="ml-2 text-xs">Obrigatório</Badge>
                  </Label>
                  <SearchSelect
                    options={OPTIONS_DIAMETROS}
                    value={formData.diameter}
                    onValueChange={(value) => handleInputChange("diameter", value)}
                    placeholder="Selecione o diâmetro"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nominalLength" className="text-sm font-medium">
                    Comprimento Nominal
                    <Badge variant="destructive" className="ml-2 text-xs">Obrigatório</Badge>
                  </Label>
                  <SearchSelect
                    options={OPTIONS_COMPRIMENTO_NOMINAL}
                    value={formData.nominalLength}
                    onValueChange={(value) => handleInputChange("nominalLength", value)}
                    placeholder="Selecione o comprimento"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Etapa 2: Dados de Fabricação/Ensaio */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-red-600" />
                Dados de Fabricação e Ensaio
              </CardTitle>
              <CardDescription>Informações técnicas e datas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <SearchSelect
                    options={OPTIONS_TIPO}
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                    placeholder="Selecione o tipo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufactureYear">Ano de Fabricação</Label>
                  <Input
                    id="manufactureYear"
                    type="number"
                    inputMode="numeric"
                    min="1900"
                    max="2100"
                    value={formData.manufactureYear}
                    onChange={(e) => handleInputChange("manufactureYear", e.target.value)}
                    placeholder="Ex: 2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testPressure">Pressão de Ensaio (bar)</Label>
                  <Input
                    id="testPressure"
                    type="text"
                    inputMode="decimal"
                    value={formData.testPressure}
                    onChange={(e) => handleInputChange("testPressure", e.target.value)}
                    placeholder="Ex: 20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextInspectionDate">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Próxima Inspeção
                  </Label>
                  <Input
                    id="nextInspectionDate"
                    type="date"
                    value={formData.nextInspectionDate}
                    onChange={(e) => handleInputChange("nextInspectionDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextMaintenanceDate">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Próxima Manutenção
                  </Label>
                  <Input
                    id="nextMaintenanceDate"
                    type="date"
                    value={formData.nextMaintenanceDate}
                    onChange={(e) => handleInputChange("nextMaintenanceDate", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Etapa 3: Inspeção Visual */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ruler className="h-5 w-5 text-red-600" />
                Inspeção Visual
              </CardTitle>
              <CardDescription>Medidas e características visuais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="actualLength">Comprimento Real (m)</Label>
                  <Input
                    id="actualLength"
                    type="text"
                    inputMode="decimal"
                    value={formData.actualLength}
                    onChange={(e) => handleInputChange("actualLength", e.target.value)}
                    placeholder="Ex: 15.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coatingShell">Carcaça/Revestimento</Label>
                  <Input
                    id="coatingShell"
                    type="text"
                    value={formData.coatingShell}
                    onChange={(e) => handleInputChange("coatingShell", e.target.value)}
                    placeholder="Estado do revestimento"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unions">Uniões</Label>
                  <Input
                    id="unions"
                    type="text"
                    value={formData.unions}
                    onChange={(e) => handleInputChange("unions", e.target.value)}
                    placeholder="Estado das uniões"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sleeveLength">Comp. Luva Empatamento (m)</Label>
                  <Input
                    id="sleeveLength"
                    type="text"
                    inputMode="decimal"
                    value={formData.sleeveLength}
                    onChange={(e) => handleInputChange("sleeveLength", e.target.value)}
                    placeholder="Ex: 0.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marking">Marcação</Label>
                  <SearchSelect
                    options={OPTIONS_APROVADO_REPROVADO}
                    value={formData.marking}
                    onValueChange={(value) => handleInputChange("marking", value)}
                    placeholder="Selecione"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hydrostaticTest">Ensaio Hidrostático</Label>
                  <SearchSelect
                    options={OPTIONS_APROVADO_REPROVADO}
                    value={formData.hydrostaticTest}
                    onValueChange={(value) => handleInputChange("hydrostaticTest", value)}
                    placeholder="Selecione"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rewelding">Reempatacao</Label>
                  <SearchSelect
                    options={OPTIONS_SIM_NAO}
                    value={formData.rewelding}
                    onValueChange={(value) => handleInputChange("rewelding", value)}
                    placeholder="Selecione"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Etapa 4 & 5: Manutenção e Resultado */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Manutenção e Resultado Final
              </CardTitle>
              <CardDescription>Procedimentos realizados e resultado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="finalLength">Comprimento Final (m)</Label>
                  <Input
                    id="finalLength"
                    type="text"
                    inputMode="decimal"
                    value={formData.finalLength}
                    onChange={(e) => handleInputChange("finalLength", e.target.value)}
                    placeholder="Ex: 15.2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unionReplacement">Substituição de Uniões</Label>
                  <SearchSelect
                    options={OPTIONS_SIM_NAO}
                    value={formData.unionReplacement}
                    onValueChange={(value) => handleInputChange("unionReplacement", value)}
                    placeholder="Selecione"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sealingReplacement">Substituição de Vedação</Label>
                  <SearchSelect
                    options={OPTIONS_SIM_NAO}
                    value={formData.sealingReplacement}
                    onValueChange={(value) => handleInputChange("sealingReplacement", value)}
                    placeholder="Selecione"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ringReplacements">Substituições de Anéis</Label>
                  <SearchSelect
                    options={OPTIONS_SIM_NAO}
                    value={formData.ringReplacements}
                    onValueChange={(value) => handleInputChange("ringReplacements", value)}
                    placeholder="Selecione"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newHydrostaticTest">Novo Ensaio Hidrostático</Label>
                  <SearchSelect
                    options={OPTIONS_SIM_NAO}
                    value={formData.newHydrostaticTest}
                    onValueChange={(value) => handleInputChange("newHydrostaticTest", value)}
                    placeholder="Selecione"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cleaning">Limpeza</Label>
                  <SearchSelect
                    options={OPTIONS_SIM_NAO}
                    value={formData.cleaning}
                    onValueChange={(value) => handleInputChange("cleaning", value)}
                    placeholder="Selecione"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drying">Secagem</Label>
                  <SearchSelect
                    options={OPTIONS_SIM_NAO}
                    value={formData.drying}
                    onValueChange={(value) => handleInputChange("drying", value)}
                    placeholder="Selecione"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finalResult">
                    Resultado Final
                    <Badge variant="destructive" className="ml-2 text-xs">Obrigatório</Badge>
                  </Label>
                  <SearchSelect
                    options={OPTIONS_APROVADO_REPROVADO}
                    value={formData.finalResult}
                    onValueChange={(value) => handleInputChange("finalResult", value)}
                    placeholder="Selecione o resultado"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
