import jsPDF from "jspdf"
import html2canvas from "html2canvas"

// Interface para mapear os dados do item para o formato esperado pelo template
export interface InspectionItemForPDF {
  PipeBrand?: string
  UnionBrand?: string
  Diameter?: string
  NominalLength?: string
  Type?: string | number
  ManufactureYear?: string | null
  TestPressure?: string
  NextInspectionDate?: string | null
  NextMaintenanceDate?: string | null
  ActualLength?: string
  CoatingShell?: string
  Unions?: string
  SleeveLength?: string
  Marking?: string
  HydrostaticTest?: string
  Rewelding?: string
  FinalLength?: string
  UnionReplacement?: string
  SealingReplacement?: string
  RingReplacements?: string
  NewHydrostaticTest?: string
  Cleaning?: string
  FinalResult?: string
}

export interface InspectionForPDF {
  Client: string
  InspectionDate: string
}

// Função para extrair dados do item (pode vir de stepData ou diretamente)
function extractItemData(item: any): InspectionItemForPDF {
  if (!item || typeof item !== 'object') {
    console.warn("[extractItemData] Item inválido ou nulo:", item)
    // Retornar objeto vazio mas válido
    return {
      PipeBrand: "",
      UnionBrand: "",
      Diameter: "",
      NominalLength: "",
      Type: "",
      ManufactureYear: null,
      TestPressure: "",
      NextInspectionDate: null,
      NextMaintenanceDate: null,
      ActualLength: "",
      CoatingShell: "",
      Unions: "",
      SleeveLength: "",
      Marking: "",
      HydrostaticTest: "",
      Rewelding: "",
      FinalLength: "",
      UnionReplacement: "",
      SealingReplacement: "",
      RingReplacements: "",
      NewHydrostaticTest: "",
      Cleaning: "",
      FinalResult: "",
    }
  }

  // Tenta extrair dos campos diretos primeiro
  if (item.pipeBrand !== undefined || item.PipeBrand !== undefined) {
    return {
      PipeBrand: item.pipeBrand || item.PipeBrand || "",
      UnionBrand: item.unionBrand || item.UnionBrand || "",
      Diameter: item.diameter || item.Diameter || "",
      NominalLength: item.nominalLength || item.NominalLength || "",
      Type: item.type || item.Type ? String(item.type || item.Type) : "",
      ManufactureYear: item.manufactureYear || item.ManufactureYear || null,
      TestPressure: item.testPressure || item.TestPressure || "",
      NextInspectionDate: item.nextInspectionDate || item.NextInspectionDate || null,
      NextMaintenanceDate: item.nextMaintenanceDate || item.NextMaintenanceDate || null,
      ActualLength: item.actualLength || item.ActualLength || "",
      CoatingShell: item.coatingShell || item.CoatingShell || "",
      Unions: item.unions || item.Unions || "",
      SleeveLength: item.sleeveLength || item.SleeveLength || "",
      Marking: item.marking || item.Marking || "",
      HydrostaticTest: item.hydrostaticTest || item.HydrostaticTest || "",
      Rewelding: item.rewelding || item.Rewelding || "",
      FinalLength: item.finalLength || item.FinalLength || "",
      UnionReplacement: item.unionReplacement || item.UnionReplacement || "",
      SealingReplacement: item.sealingReplacement || item.SealingReplacement || "",
      RingReplacements: item.ringReplacements || item.RingReplacements || "",
      NewHydrostaticTest: item.newHydrostaticTest || item.NewHydrostaticTest || "",
      Cleaning: item.cleaning || item.Cleaning || "",
      FinalResult: item.finalResult || item.FinalResult || "",
    }
  }

  // Se não, tenta extrair dos stepData
  const step1 = item.step1Data || {}
  const step2 = item.step2Data || {}
  const step3 = item.step3Data || {}
  const step4 = item.step4Data || {}
  const step5 = item.step5Data || {}

  return {
    PipeBrand: step1.pipeBrand || step1.marcaDuto || step1.PipeBrand || "",
    UnionBrand: step1.unionBrand || step1.marcaUniao || step1.UnionBrand || "",
    Diameter: step1.diameter || step1.diametro || step1.Diameter || "",
    NominalLength: step1.nominalLength || step1.comprimentoNominal || step1.NominalLength || "",
    Type: step1.type ? String(step1.type) : (step1.Type ? String(step1.Type) : ""),
    ManufactureYear: step1.manufactureYear || step1.anoFabricacao || step1.ManufactureYear || null,
    TestPressure: step1.testPressure || step1.pressaoEnsaio || step1.TestPressure || "",
    NextInspectionDate: step1.nextInspectionDate || step1.NextInspectionDate || null,
    NextMaintenanceDate: step1.nextMaintenanceDate || step1.NextMaintenanceDate || null,
    ActualLength: step2.actualLength || step2.comprimentoReal || step2.ActualLength || "",
    CoatingShell: step2.coatingShell || step2.carcaca || step2.CoatingShell || "",
    Unions: step2.unions || step2.unioes || step2.Unions || "",
    SleeveLength: step2.sleeveLength || step2.comprimentoLuva || step2.SleeveLength || "",
    Marking: step2.marking || step2.marcacao || step2.Marking || "",
    HydrostaticTest: step2.hydrostaticTest || step2.ensaioHidrostatico || step2.HydrostaticTest || "",
    Rewelding: step3.rewelding || step3.reempatacao || step3.Rewelding || "",
    FinalLength: step3.finalLength || step3.comprimentoFinal || step3.FinalLength || "",
    UnionReplacement: step3.unionReplacement || step3.substituicaoUnioes || step3.UnionReplacement || "",
    SealingReplacement: step3.sealingReplacement || step3.substituicaoVedacoes || step3.SealingReplacement || "",
    RingReplacements: step3.ringReplacements || step3.substituicaoAneis || step3.RingReplacements || "",
    NewHydrostaticTest: step3.newHydrostaticTest || step3.novoEnsaioHidrostatico || step3.NewHydrostaticTest || "",
    Cleaning: step3.cleaning || step3.limpeza || step3.Cleaning || "",
    FinalResult: step5.finalResult || step5.resultadoFinal || step5.FinalResult || "",
  }
}

// Função para formatar data ISO para MM/yyyy
function formatMonthYear(dateString: string | null | undefined): string {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${month}/${year}`
  } catch {
    return ""
  }
}

// Função para formatar data ISO para dd/MM/yyyy
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return ""
  }
}

// Função para formatar ano de uma data ISO
function formatYear(dateString: string | null | undefined): string {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    return String(date.getFullYear())
  } catch {
    return ""
  }
}

function getHtmlInitial(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificado de Inspeção e Manutenção de Mangueiras de Incêndio</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            min-height: 100vh;
            padding: 20px;
            flex-direction: column;
        }
        .report-container {
            width: 297mm; /* A4 landscape width */
            padding: 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 0.75rem; /* Smaller base font for density */
        }
        .header-section, .main-table-container, .footer-section {
            border: 1px solid #d1d5db;
            border-radius: 6px;
            overflow: hidden;
        }
        .table-header-cell {
            background-color: #f9fafb;
            font-weight: 500;
            font-size: 10px;
            text-align: center;
            padding: 0;
            border-bottom: 1px solid #d1d5db;
            border-right: 1px solid #d1d5db;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 150px;
            max-height: 150px;
            height: 150px;
            position: relative;
            box-sizing: border-box;
        }
        .table-header-cell span {
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: normal;
            word-break: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            transform: rotate(-90deg);
            transform-origin: center center;
            position: absolute;
            left: 50%;
            top: 50%;
            width: 100%;
            height: auto;
            max-width: 150px;
            max-height: 100%;
            line-height: 1.3;
            padding: 4px;
            text-align: center;
            box-sizing: border-box;
            font-size: 9px;
            margin-left: -50%;
            margin-top: -50%;
        }
        .table-header-primary-cell {
            background-color: #f9fafb;
            font-weight: 500;
            font-size: 10px;
            text-align: center;
            padding: 4px 2px; /* Reduced padding for more density */
            border-bottom: 1px solid #d1d5db;
            border-right: 1px solid #d1d5db;
            white-space: normal; /* permite quebra de linha */
            word-break: break-word; /* quebra palavras longas se necessário */
            hyphens: auto; /* opcional: insere hífen automaticamente */
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .table-rows {
            font-size: 10px;
            text-align: center;
            padding: 4px; /* Reduced padding for more density */
            border-bottom: 1px solid #d1d5db;
            border-left: 1px solid #d1d5db;
            white-space: normal; /* permite quebra de linha */
            word-break: break-word; /* quebra palavras longas se necessário */
            hyphens: auto; /* opcional: insere hífen automaticamente */
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .table-header-cell.vertical-text {
            writing-mode: vertical-rl;
            transform: rotate(180deg);
            white-space: nowrap;
        }
        .table-cell {
            padding: 4px 2px; /* Reduced padding */
            border-right: 1px solid #d1d5db;
            border-bottom: 1px solid #d1d5db;
            text-align: center;
            font-size: 0.7rem; /* Smaller font for data cells */
            min-height: 25px; /* Consistent height for data cells */
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .table-cell:last-child, .table-header-cell:last-child {
            border-right: none;
        }
        .table-row:last-child .table-cell {
            border-bottom: none;
        }
        .nested-header-group {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }
        .nested-header-group .top-header {
            border-bottom: 1px solid #d1d5db;
            padding: 4px 2px;
            text-align: center;
            font-weight: 600;
            background-color: #f9fafb;
            min-height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .nested-header-group .sub-headers {
            display: flex;
            flex-grow: 1;
        }
        .nested-header-group .sub-headers .sub-header-cell {
            flex-grow: 1;
            padding: 4px 2px;
            text-align: center;
            font-weight: 600;
            border-right: 1px solid #d1d5db;
            background-color: #f9fafb;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .nested-header-group .sub-headers .sub-header-cell:last-child {
            border-right: none;
        }
        .data-row-flex {
            display: flex;
            border-bottom: 1px solid #d1d5db;
        }
        .data-row-flex:last-child {
            border-bottom: none;
        }
        .data-cell-fixed-width {
            font-size: 10px;
            text-align: center;
            padding: 4px 2px; /* Reduced padding for more density */
            border-bottom: 1px solid #d1d5db;
            border-right: 1px solid #d1d5db;
            white-space: normal; /* permite quebra de linha */
            word-break: break-word; /* quebra palavras longas se necessário */
            hyphens: auto; /* opcional: insere hífen automaticamente */
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .data-cell-flex-grow {
            flex-grow: 1;
            border-right: 1px solid #d1d5db;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 25px;
            font-size: 0.7rem;
        }
        .data-cell-sub-column {
            flex-grow: 1;
            border-right: 1px solid #d1d5db;
            min-height: 25px;
        }
        .data-cell-sub-column:last-child {
            border-right: none;
        }
        .col-item { width: 25px; min-width: 25px; }
        .col-identificacao { width: 20px; min-width: 20px; }
        .col-marca-duto { width: 70px; min-width: 70px; }
        .col-marca-uniao { width: 70px; min-width: 70px; }
        .col-diametro { width: 50px; min-width: 50px; }
        .col-comprimento-nominal { width: 40px; min-width: 40px; }
        .col-tipo { width: 25px; min-width: 25px; }
        .col-fabricacao { width: 80px; min-width: 80px; }
        .col-pressao { width: 60px; min-width: 60px; }
        .col-proxima-inspecao { width: 81px; min-width: 81px; }
        .col-proxima-manutencao { width: 81px; min-width: 81px; }
        .col-comprimento-real { width: 80px; min-width: 80px; }
        .col-carcaca { width: 35px; min-width: 35px; }
        .col-unioes { width: 35px; min-width: 35px; }
        .col-luva { width: 40px; min-width: 40px; }
        .col-marcacao { width: 30px; min-width: 30px; }
        .col-hidro { width: 30px; min-width: 30px; }
        .col-reempatacao { width: 30px; min-width: 30px; }
        .col-comp-final { width: 30px; min-width: 30px; }
        .col-subst-uniao { width: 30px; min-width: 30px; }
        .col-subst-vedacao { width: 35px; min-width: 35px; }
        .col-subst-aneis { width: 30px; min-width: 30px; }
        .col-novo-hidro { width: 35px; min-width: 35px; }
        .col-limpeza { width: 30px; min-width: 30px; }
        .col-resultado { width: 30px; min-width: 30px; }
        /* Tailwind utility classes */
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .flex-grow { flex-grow: 1; }
        .flex-1 { flex: 1 1 0%; }
        .justify-between { justify-content: space-between; }
        .justify-center { justify-content: center; }
        .items-center { align-items: center; }
        .items-start { align-items: flex-start; }
        .p-2 { padding: 0.5rem; }
        .p-3 { padding: 0.75rem; }
        .mb-1 { margin-bottom: 0.25rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .ml-4 { margin-left: 1rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-normal { font-weight: 400; }
        .text-center { text-align: center; }
        .text-red-800 { color: #991b1b; }
        .text-gray-600 { color: #4b5563; }
        .text-gray-700 { color: #374151; }
        .text-gray-800 { color: #1f2937; }
        .border { border-width: 1px; border-style: solid; border-color: #e5e7eb; }
        .border-r { border-right-width: 1px; border-right-style: solid; border-right-color: #e5e7eb; }
        .border-t { border-top-width: 1px; border-top-style: solid; border-top-color: #e5e7eb; }
        .border-gray-300 { border-color: #d1d5db; }
        .rounded-md { border-radius: 0.375rem; }
        .gap-3 { gap: 0.75rem; }
    </style>
</head>
<body>`
}

function getTableHeaders(): string {
  return `<!--Second Level Headers and Sub-headers -->
<div class="flex">
    <!-- DADOS GERAIS Headers -->
    <div class="flex flex-col border-r border-gray-300">
        <div class="flex flex-grow">
            <div class="table-header-cell col-item"><span>ITEM</span></div>
            <div class="table-header-cell col-marca-duto"><span>MARCA DO DUTO FLEXÍVEL</span></div>
            <div class="table-header-cell col-marca-uniao"><span>MARCA DA UNIÃO</span></div>
            <div class="table-header-cell col-diametro"><span>DIÂMETRO(mm)</span></div>
            <div class="table-header-cell col-comprimento-nominal"><span>COMPRIMENTO NOMINAL(m)</span></div>
            <div class="table-header-cell col-tipo"><span>TIPO</span></div>
            <div class="table-header-cell col-fabricacao"><span>MÊS/ANO FABRICAÇÃO</span></div>
            <div class="table-header-cell col-pressao"><span>PRESSÃO ENSAIO(kPa)</span></div>
            <div class="table-header-cell col-proxima-inspecao"><span>DATA DA PRÓXIMA INSPEÇÃO</span></div>
            <div class="table-header-cell col-proxima-manutencao"><span>DATA DA PRÓXIMA MANUTENÇÃO</span></div>
            <div class="table-header-cell col-comprimento-real"><span>COMPRIMENTO REAL(m)</span></div>
            <div class="table-header-cell col-carcaca"><span>CARCAÇA TEXTIL E REVESTIMENTO</span></div>
            <div class="table-header-cell col-unioes"><span>UNIÕES</span></div>
            <div class="table-header-cell col-luva"><span>COMP.LUVA EMPATAMENTO</span></div>
            <div class="table-header-cell col-marcacao"><span>MARCAÇÃO</span></div>
            <div class="table-header-cell col-hidro"><span>ENSAIO HIDROSTÁTICO</span></div>
            <div class="table-header-cell col-reempatacao"><span>REEMPATAÇÃO</span></div>
            <div class="table-header-cell col-comp-final"><span>COMP.FINAL</span></div>
            <div class="table-header-cell col-subst-uniao"><span>SUBSTITUIÇÃO DE UNIÕES</span></div>
            <div class="table-header-cell col-subst-vedacao"><span>SUBSTITUIÇÃO DE VEDAÇÕES</span></div>
            <div class="table-header-cell col-subst-aneis"><span>SUBSTITUIÇÃO DE ANÉIS</span></div>
            <div class="table-header-cell col-novo-hidro"><span>NOVO ENSAIO HIDROSTÁTICO</span></div>
            <div class="table-header-cell col-limpeza"><span>LIMPEZA</span></div>
            <div class="table-header-cell col-resultado"><span>RESULTADO FINAL</span></div>
        </div>
    </div>
</div>`
}

function insertTableRows(items: InspectionItemForPDF[], pagina: number, itensPorPagina: number): string {
  let html = ""
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const numeroGlobal = pagina * itensPorPagina + i + 1

    html += `
<div class="data-row-flex">
    <div class="flex flex-grow">
        <div class="flex flex-col border-r border-gray-300" style="flex-basis: 22.22%;">
            <div class="flex flex-grow">
                <div class="table-rows col-item">${numeroGlobal}</div>
                <div class="table-rows col-marca-duto">${item.PipeBrand || ""}</div>
                <div class="table-rows col-marca-uniao">${item.UnionBrand || ""}</div>
                <div class="table-rows col-diametro">${item.Diameter || ""}</div>
                <div class="table-rows col-comprimento-nominal">${item.NominalLength || ""}</div>
                <div class="table-rows col-tipo">${item.Type || ""}</div>
                <div class="table-rows col-fabricacao">${formatYear(item.ManufactureYear)}</div>
                <div class="table-rows col-pressao">${item.TestPressure || ""}</div>
                <div class="table-rows col-proxima-inspecao">${formatMonthYear(item.NextInspectionDate)}</div>
                <div class="table-rows col-proxima-manutencao">${formatMonthYear(item.NextMaintenanceDate)}</div>
                <div class="table-rows col-comprimento-real">${item.ActualLength || ""}</div>
                <div class="table-rows col-carcaca">${item.CoatingShell || ""}</div>
                <div class="table-rows col-unioes">${item.Unions || ""}</div>
                <div class="table-rows col-luva">${item.SleeveLength || ""}</div>
                <div class="table-rows col-marcacao">${item.Marking || ""}</div>
                <div class="table-rows col-hidro">${item.HydrostaticTest || ""}</div>
                <div class="table-rows col-reempatacao">${item.Rewelding || ""}</div>
                <div class="table-rows col-comp-final">${item.FinalLength || ""}</div>
                <div class="table-rows col-subst-uniao">${item.UnionReplacement || ""}</div>
                <div class="table-rows col-subst-vedacao">${item.SealingReplacement || ""}</div>
                <div class="table-rows col-subst-aneis">${item.RingReplacements || ""}</div>
                <div class="table-rows col-novo-hidro">${item.NewHydrostaticTest || ""}</div>
                <div class="table-rows col-limpeza">${item.Cleaning || ""}</div>
                <div class="table-rows col-resultado">${item.FinalResult || ""}</div>
            </div>
        </div>
    </div>
</div>`
  }
  return html
}

function getReportContainer(
  inspection: InspectionForPDF,
  items: InspectionItemForPDF[],
  pagina: number,
  itensPorPagina: number
): string {
  return `
<div class="report-container">
    <!-- Header Section -->
    <div class="header-section p-3 flex justify-between items-start border">
        <div class="flex flex-col items-center">
            <div class="flex items-center mb-1">
                <span class="text-xl font-bold text-red-800">JUND EXTINTORES</span>
            </div>
            <div class="text-xs text-gray-600 text-center">
                <p>Av. São João, 619 - Ponte São João</p>
                <p>Jundiaí - SP - CEP 13.216-000</p>
                <p>Tel./Fax: (11) 4587-4441 / 4587-7673</p>
            </div>
        </div>
        <div class="flex-1 ml-4">
            <div class="text-sm font-semibold text-gray-800 mb-2 text-center">
                CERTIFICADO DE INSPEÇÃO E MANUTENÇÃO DE MANGUEIRAS DE INCÊNDIO - NBR 12779
            </div>
            <div class="flex justify-between text-xs mb-2">
                <p>CLIENTE: ${inspection.Client}</p>
                <p>DATA: ${formatDate(inspection.InspectionDate)}</p>
            </div>
            <div class="border border-gray-300 p-2 text-xs text-gray-700 rounded-md">
                <p>Declaramos que as mangueiras de incêndio objetos relacionadas foram inspecionadas e/ou mantidas conforme NBR 12779 e que elas obtiveram aprovação / condenação de acordo com o resultado apresentado. Este certificado deve ser mantido pelo usuário até a próxima inspeção / manutenção.</p>
            </div>
        </div>
    </div>
    <!-- Header Section -->
    <!-- Main Content Table -->
    <div class="main-table-container flex flex-col">
        <!-- Top Level Headers -->
        <div class="flex">
            <div class="table-header-primary-cell flex-grow" style="flex-basis: 55%;">DADOS GERAIS</div>
            <div class="table-header-primary-cell flex-grow" style="flex-basis: 19.5%;">INSPEÇÃO</div>
            <div class="table-header-primary-cell flex-grow" style="flex-basis: 24.5%;">MANUTENÇÃO</div>
        </div>
        ${getTableHeaders()}
        <!-- Data Rows -->
        <div class="flex flex-col border-t border-gray-300">
            ${insertTableRows(items, pagina, itensPorPagina)}
        </div>
    </div>
    <!-- Main Content Table -->
    <!-- Footer Section -->
    <div class="footer-section p-3 flex flex-col gap-3">
        <div class="text-xs font-semibold">
            <p>Legenda: <span class="font-normal">A (Aprovado) R (Reprovado) S (Sim) N (Não) C (Condenada) NC (Não Consta)</span></p>
        </div>
    </div>
    <!-- Footer Section -->
</div>`
}

function getHtmlContent(inspection: InspectionForPDF, items: InspectionItemForPDF[]): string {
  const itensPorPagina = 8
  const totalPaginas = Math.ceil(items.length / itensPorPagina)
  let htmlFinal = getHtmlInitial()

  for (let pagina = 0; pagina < totalPaginas; pagina++) {
    const itensDaPagina = items.slice(pagina * itensPorPagina, (pagina + 1) * itensPorPagina)
    htmlFinal += getReportContainer(inspection, itensDaPagina, pagina, itensPorPagina)
    if (pagina < totalPaginas - 1) {
      htmlFinal += '<div style="page-break-after: always;"></div>'
    }
  }

  htmlFinal += "</body>\r\n</html>"
  return htmlFinal
}

export class PDFGenerator {
  static async generateAndDownload(data: {
    inspection: { client: string; inspectionDate: string }
    items: any[]
  }): Promise<void> {
    const blob = await this.generateBlob(data)
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio-inspecao-${data.inspection.client}-${new Date().getTime()}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  static async generateBlob(data: {
    inspection: { client: string; inspectionDate: string }
    items: any[]
  }): Promise<Blob> {
    try {
      console.log("[PDFGenerator] Iniciando geração de PDF...")
      console.log("[PDFGenerator] Dados recebidos:", {
        inspection: data.inspection,
        itemsCount: data.items?.length || 0,
      })

      // Validar dados
      if (!data.inspection) {
        throw new Error("Dados da inspeção não fornecidos")
      }

      if (!data.items || !Array.isArray(data.items)) {
        throw new Error("Lista de itens inválida ou não fornecida")
      }

      if (data.items.length === 0) {
        throw new Error("Nenhum item encontrado para gerar o relatório")
      }

      // Mapear dados
      const inspectionForPDF: InspectionForPDF = {
        Client: data.inspection.client || "N/A",
        InspectionDate: data.inspection.inspectionDate || new Date().toISOString(),
      }

      console.log("[PDFGenerator] Mapeando itens...")
      const itemsForPDF: InspectionItemForPDF[] = data.items.map((item, index) => {
        try {
          return extractItemData(item)
        } catch (error) {
          console.error(`[PDFGenerator] Erro ao mapear item ${index}:`, error)
          throw new Error(`Erro ao processar item ${index + 1}: ${error instanceof Error ? error.message : String(error)}`)
        }
      })

      if (itemsForPDF.length === 0) {
        throw new Error("Nenhum item válido encontrado após mapeamento")
      }

      console.log(`[PDFGenerator] ${itemsForPDF.length} itens mapeados com sucesso`)

      const itensPorPagina = 8
      const totalPaginas = Math.ceil(itemsForPDF.length / itensPorPagina)

      console.log(`Gerando PDF com ${itemsForPDF.length} itens em ${totalPaginas} página(s)`)

      // Criar PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      // Gerar cada página separadamente
      for (let pagina = 0; pagina < totalPaginas; pagina++) {
        console.log(`[PDFGenerator] Gerando página ${pagina + 1} de ${totalPaginas}...`)
        
        if (pagina > 0) {
          pdf.addPage()
        }

        const itensDaPagina = itemsForPDF.slice(
          pagina * itensPorPagina,
          (pagina + 1) * itensPorPagina
        )

        console.log(`[PDFGenerator] Página ${pagina + 1}: ${itensDaPagina.length} itens`)

        // Gerar HTML para esta página
        const htmlInitial = getHtmlInitial()
        const reportContainer = getReportContainer(
          inspectionForPDF,
          itensDaPagina,
          pagina,
          itensPorPagina
        )
        const html = htmlInitial + reportContainer + "</body>\r\n</html>"

        // Criar elemento temporário para renderizar HTML
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = html
        tempDiv.style.position = "absolute"
        tempDiv.style.left = "-9999px"
        tempDiv.style.top = "0"
        tempDiv.style.width = "1123px"
        tempDiv.style.backgroundColor = "#f0f2f5"
        tempDiv.style.overflow = "hidden"
        document.body.appendChild(tempDiv)

        try {
          console.log(`[PDFGenerator] Aguardando renderização do HTML...`)
          // Aguardar para garantir que o HTML foi renderizado e fontes carregadas
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Aguardar fontes carregarem
          if (document.fonts && document.fonts.ready) {
            console.log(`[PDFGenerator] Aguardando fontes carregarem...`)
            await document.fonts.ready
          }
          await new Promise((resolve) => setTimeout(resolve, 300))
          
          console.log(`[PDFGenerator] Capturando canvas da página ${pagina + 1}...`)

          // Capturar como canvas com callback para garantir transformações
          const canvas = await html2canvas(tempDiv, {
            scale: 2,
            useCORS: true,
            logging: false,
            width: 1123, // 297mm em pixels a 96 DPI
            height: tempDiv.scrollHeight || 794, // Altura dinâmica baseada no conteúdo
            backgroundColor: "#f0f2f5",
            allowTaint: false,
            removeContainer: false,
            onclone: (clonedDoc) => {
              // Garantir que as transformações CSS sejam aplicadas no clone
              const clonedElements = clonedDoc.querySelectorAll('.table-header-cell span')
              clonedElements.forEach((el) => {
                const htmlEl = el as HTMLElement
                const parentCell = htmlEl.closest('.table-header-cell') as HTMLElement
                if (parentCell) {
                  const cellWidth = parentCell.offsetWidth || parentCell.clientWidth || 0
                  const cellHeight = parentCell.offsetHeight || parentCell.clientHeight || 150
                  
                  // Quando rotacionado -90deg, a largura da célula vira a altura disponível para o texto
                  // A altura da célula vira a largura disponível para o texto
                  // Usar a largura da célula como altura máxima do texto rotacionado (com margem de segurança)
                  const maxTextHeight = Math.max(cellWidth - 8, 20)
                  // Usar a altura da célula como largura máxima do texto rotacionado
                  const maxTextWidth = Math.max(cellHeight - 8, 50)
                  
                  // Forçar aplicação de estilos inline para garantir renderização
                  htmlEl.style.display = 'flex'
                  htmlEl.style.alignItems = 'center'
                  htmlEl.style.justifyContent = 'center'
                  htmlEl.style.transform = 'rotate(-90deg)'
                  htmlEl.style.transformOrigin = 'center center'
                  htmlEl.style.position = 'absolute'
                  htmlEl.style.left = '50%'
                  htmlEl.style.top = '50%'
                  htmlEl.style.width = `${maxTextHeight}px`
                  htmlEl.style.height = 'auto'
                  htmlEl.style.maxWidth = `${maxTextHeight}px`
                  htmlEl.style.maxHeight = `${maxTextWidth}px`
                  htmlEl.style.marginLeft = `-${maxTextHeight / 2}px`
                  htmlEl.style.marginTop = '-50%'
                  htmlEl.style.textAlign = 'center'
                  htmlEl.style.whiteSpace = 'normal'
                  htmlEl.style.wordBreak = 'break-word'
                  htmlEl.style.overflowWrap = 'break-word'
                  htmlEl.style.hyphens = 'auto'
                  htmlEl.style.lineHeight = '1.3'
                  htmlEl.style.fontSize = '9px'
                  htmlEl.style.padding = '4px'
                  htmlEl.style.boxSizing = 'border-box'
                  htmlEl.style.overflow = 'hidden'
                }
              })
            },
          })

          const imgData = canvas.toDataURL("image/png", 0.95)
          const imgWidth = 297 // A4 landscape width in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          console.log(`[PDFGenerator] Imagem gerada: ${imgWidth}mm x ${imgHeight}mm`)

          // Adicionar imagem à página
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, 210))

          console.log(`[PDFGenerator] Página ${pagina + 1} adicionada ao PDF com sucesso`)

          // Limpar elemento temporário
          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv)
          }
        } catch (error) {
          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv)
          }
          console.error(`[PDFGenerator] Erro ao gerar página ${pagina + 1}:`, error)
          throw new Error(`Erro ao gerar página ${pagina + 1}: ${error instanceof Error ? error.message : String(error)}`)
        }
      }

      console.log("[PDFGenerator] PDF gerado com sucesso!")
      const blob = pdf.output("blob")
      console.log("[PDFGenerator] Blob criado, tamanho:", blob.size, "bytes")
      return blob
    } catch (error) {
      console.error("[PDFGenerator] Erro ao gerar PDF:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error(
        `Erro ao gerar PDF: ${String(error)}`
      )
    }
  }
}

