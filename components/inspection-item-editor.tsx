"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"

interface InspectionItemEditorProps {
  inspectionId: string
  item: any
  onBack: () => void
  onSave: () => void
}

export function InspectionItemEditor({ inspectionId, item, onBack, onSave }: InspectionItemEditorProps) {
  const [formData, setFormData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const { toasts, toast, removeToast } = useToast()

  useEffect(() => {
    // Inicializa o formulário com os campos do item
    setFormData({
      inspectionId: item.inspectionId ?? inspectionId,
      item: item.item ?? item.id,
      pipeBrand: item.pipeBrand,
      unionBrand: item.unionBrand,
      diameter: item.diameter,
      nominalLength: item.nominalLength,
      type: item.type,
      manufactureYear: item.manufactureYear,
      testPressure: item.testPressure,
      nextInspectionDate: item.nextInspectionDate,
      nextMaintenanceDate: item.nextMaintenanceDate,
      actualLength: item.actualLength,
      coatingShell: item.coatingShell,
      unions: item.unions,
      sleeveLength: item.sleeveLength,
      rubberSealing: item.rubberSealing,
      marking: item.marking,
      hydrostaticTest: item.hydrostaticTest,
      rewelding: item.rewelding,
      finalLength: item.finalLength,
      unionReplacement: item.unionReplacement,
      sealingReplacement: item.sealingReplacement,
      ringReplacements: item.ringReplacements,
      newHydrostaticTest: item.newHydrostaticTest,
      cleaning: item.cleaning,
      drying: item.drying,
      finalResult: item.finalResult,
    })

    console.log("formData", formData);
  }, [item, inspectionId])

  const onChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const itemId = item.item || item.id
      // Monta o corpo exatamente como o backend espera
      const body = {
        inspectionId: formData.inspectionId,
        item: itemId,
        pipeBrand: formData.pipeBrand,
        unionBrand: formData.unionBrand,
        diameter: formData.diameter,
        nominalLength: formData.nominalLength,
        type: formData.type ? Number(formData.type) : undefined,
        manufactureYear: formData.manufactureYear || null,
        testPressure: formData.testPressure,
        nextInspectionDate: formData.nextInspectionDate || null,
        nextMaintenanceDate: formData.nextMaintenanceDate || null,
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

      await apiClient.saveInspectionItem(body)
      toast({
        title: "Sucesso!",
        description: "Item atualizado com sucesso",
        variant: "success",
      })
      onSave()
    } catch (error: any) {
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
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-slate-900 text-sm sm:text-base">Editar Item</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="text-slate-600 hover:text-slate-900"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
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
          <span className="text-slate-900 font-medium text-sm">Editar Item</span>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Editar Item da Inspeção</h1>
            <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base px-4 sm:px-0">Edite os dados do item selecionado</p>
          </div>

          {/* Formulário completo */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Dados do Item</CardTitle>
              <CardDescription>Atualize os campos necessários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Marca do Duto</label>
                  <input className="w-full border rounded px-3 py-2" value={formData.pipeBrand ?? ""} onChange={(e) => onChange("pipeBrand", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Marca da União</label>
                  <input className="w-full border rounded px-3 py-2" value={formData.unionBrand ?? ""} onChange={(e) => onChange("unionBrand", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Diâmetro</label>
                  <input className="w-full border rounded px-3 py-2" value={formData.diameter ?? ""} onChange={(e) => onChange("diameter", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Comprimento Nominal</label>
                  <input className="w-full border rounded px-3 py-2" value={formData.nominalLength ?? ""} onChange={(e) => onChange("nominalLength", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Tipo</label>
                  <input className="w-full border rounded px-3 py-2" value={formData.type ?? ""} onChange={(e) => onChange("type", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Ano de Fabricação</label>
                  <input type="date" className="w-full border rounded px-3 py-2" value={formData.manufactureYear ?? ""} onChange={(e) => onChange("manufactureYear", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Pressão de Ensaio</label>
                  <input className="w-full border rounded px-3 py-2" value={formData.testPressure ?? ""} onChange={(e) => onChange("testPressure", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Próxima Inspeção</label>
                  <input type="date" className="w-full border rounded px-3 py-2" value={formData.nextInspectionDate ?? ""} onChange={(e) => onChange("nextInspectionDate", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Próxima Manutenção</label>
                  <input type="date" className="w-full border rounded px-3 py-2" value={formData.nextMaintenanceDate ?? ""} onChange={(e) => onChange("nextMaintenanceDate", e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Comprimento Real</label>
                  <input className="w-full border rounded px-3 py-2" value={formData.actualLength ?? ""} onChange={(e) => onChange("actualLength", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Carcaça/Revestimento</label>
                  <input className="w-full border rounded px-3 py-2" value={formData.coatingShell ?? ""} onChange={(e) => onChange("coatingShell", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Uniões</label>
                  <input className="w-full border rounded px-3 py-2" value={formData.unions ?? ""} onChange={(e) => onChange("unions", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Comp. Luva Empatamento</label>
                  <input className="w-full border rounded px-3 py-2" value={formData.sleeveLength ?? ""} onChange={(e) => onChange("sleeveLength", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Vedação de Borracha (S/N)</label>
                  <select className="w-full border rounded px-3 py-2" value={formData.rubberSealing ?? ""} onChange={(e) => onChange("rubberSealing", e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="S">S</option>
                    <option value="N">N</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Marcação (S/N)</label>
                  <select className="w-full border rounded px-3 py-2" value={formData.marking ?? ""} onChange={(e) => onChange("marking", e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="S">S</option>
                    <option value="N">N</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Ensaio Hidrostático (S/N)</label>
                  <select className="w-full border rounded px-3 py-2" value={formData.hydrostaticTest ?? ""} onChange={(e) => onChange("hydrostaticTest", e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="S">S</option>
                    <option value="N">N</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Reempatacao (S/N)</label>
                  <select className="w-full border rounded px-3 py-2" value={formData.rewelding ?? ""} onChange={(e) => onChange("rewelding", e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="S">S</option>
                    <option value="N">N</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Comprimento Final</label>
                  <input className="w-full border rounded px-3 py-2" value={formData.finalLength || ""} onChange={(e) => onChange("finalLength", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Substituição de Uniões (S/N)</label>
                  <select className="w-full border rounded px-3 py-2" value={formData.unionReplacement ?? ""} onChange={(e) => onChange("unionReplacement", e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="S">S</option>
                    <option value="N">N</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Substituição de Vedação (S/N)</label>
                  <select className="w-full border rounded px-3 py-2" value={formData.sealingReplacement ?? ""} onChange={(e) => onChange("sealingReplacement", e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="S">S</option>
                    <option value="N">N</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Substituições de Anéis (S/N)</label>
                  <select className="w-full border rounded px-3 py-2" value={formData.ringReplacements ?? ""} onChange={(e) => onChange("ringReplacements", e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="S">S</option>
                    <option value="N">N</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Novo Ensaio Hidrostático (S/N)</label>
                  <select className="w-full border rounded px-3 py-2" value={formData.newHydrostaticTest ?? ""} onChange={(e) => onChange("newHydrostaticTest", e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="S">S</option>
                    <option value="N">N</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Limpeza (S/N)</label>
                  <select className="w-full border rounded px-3 py-2" value={formData.cleaning ?? ""} onChange={(e) => onChange("cleaning", e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="S">S</option>
                    <option value="N">N</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Secagem (S/N)</label>
                  <select className="w-full border rounded px-3 py-2" value={formData.drying ?? ""} onChange={(e) => onChange("drying", e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="S">S</option>
                    <option value="N">N</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Resultado Final (A/R)</label>
                  <select className="w-full border rounded px-3 py-2" value={formData.finalResult ?? ""} onChange={(e) => onChange("finalResult", e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="A">A</option>
                    <option value="R">R</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
