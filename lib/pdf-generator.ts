import jsPDF from "jspdf"
import "jspdf-autotable"
import type { Inspection, InspectionItem } from "./api"

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

interface PDFGeneratorOptions {
  inspection: Inspection
  items: InspectionItem[]
}

export class PDFGenerator {
  private doc: jsPDF
  private pageWidth: number
  private pageHeight: number
  private margin: number

  constructor() {
    // Orientação horizontal (landscape)
    this.doc = new jsPDF("l", "mm", "a4")
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
    this.margin = 10
  }

  private drawBorders() {
    // Borda externa principal
    this.doc.setDrawColor(0, 0, 0)
    this.doc.setLineWidth(0.5)
    this.doc.rect(this.margin, this.margin, this.pageWidth - this.margin * 2, this.pageHeight - this.margin * 2)
  }

  private addHeader(inspection: Inspection) {
    let currentY = this.margin + 5

    // Título principal
    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "bold")
    this.doc.text(
      "CERTIFICADO DE INSPEÇÃO E MANUTENÇÃO DE MANGUEIRAS DE INCÊNDIO - NBR 12779",
      this.pageWidth / 2,
      currentY,
      { align: "center" },
    )

    currentY += 10

    // Seção EMPRESA CAPACITADA e campos do usuário
    this.doc.rect(this.margin, currentY, 80, 25)
    this.doc.rect(this.margin + 80, currentY, this.pageWidth - this.margin * 2 - 80, 12.5)
    this.doc.rect(this.margin + 80, currentY + 12.5, this.pageWidth - this.margin * 2 - 80, 12.5)

    // EMPRESA CAPACITADA
    this.doc.setFontSize(10)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("EMPRESA CAPACITADA", this.margin + 40, currentY + 12, { align: "center" })

    // USUÁRIO
    this.doc.setFontSize(8)
    this.doc.text("RESPONSÁVEL", this.margin + 85, currentY + 5)
    this.doc.setFont("helvetica", "normal")
    this.doc.text(inspection.cliente, this.margin + 110, currentY + 5)

    // ENDEREÇO
    this.doc.setFont("helvetica", "bold")
    this.doc.text("ENDEREÇO", this.margin + 85, currentY + 18)

    currentY += 30

    // Declaração
    this.doc.rect(this.margin, currentY, this.pageWidth - this.margin * 2, 15)
    this.doc.setFontSize(7)
    this.doc.setFont("helvetica", "normal")
    const declaracao =
      "Declaramos que as mangueiras de incêndio abaixo relacionadas foram inspecionadas e/ou mantidas conforme NBR 12779 e que elas obtiveram aprovação / condenação de acordo com o resultado apresentado. Este certificado deve ser mantido pelo usuário das mangueiras durante toda a próxima inspeção / manutenção."

    const splitDeclaracao = this.doc.splitTextToSize(declaracao, this.pageWidth - this.margin * 2 - 10)
    this.doc.text(splitDeclaracao, this.margin + 5, currentY + 5)

    return currentY + 20
  }

  private addTableHeaders(startY: number) {
    const headerHeight = 25
    let currentX = this.margin

    // Definir larguras das colunas
    const colWidths = {
      item: 12,
      marcaDuto: 20,
      marcaUniao: 20,
      diametro: 12,
      comprimento: 15,
      tipo: 8,
      anoFab: 15,
      proxInsp: 15,
      proxManut: 15,
      // Inspeção
      compReal: 12,
      carcaca: 8,
      unioes: 8,
      compLuva: 12,
      vedacao: 8,
      marcacao: 8,
      // Manutenção
      ensaio: 8,
      reempat: 8,
      compFinal: 12,
      substUnioes: 8,
      substVed: 8,
      substAneis: 8,
      novoEnsaio: 8,
      secagem: 8,
      limpeza: 8,
      resultado: 10,
    }

    // Headers principais
    this.doc.setFontSize(8)
    this.doc.setFont("helvetica", "bold")

    // DADOS GERAIS
    const dadosGeraisWidth =
      colWidths.item +
      colWidths.marcaDuto +
      colWidths.marcaUniao +
      colWidths.diametro +
      colWidths.comprimento +
      colWidths.tipo +
      colWidths.anoFab +
      colWidths.proxInsp +
      colWidths.proxManut

    this.doc.setFillColor(220, 220, 220)
    this.doc.rect(currentX, startY, dadosGeraisWidth, 8, 'F')
    this.doc.setTextColor(0,0,0)
    this.doc.text("DADOS GERAIS", currentX + dadosGeraisWidth / 2, startY + 5, { align: "center" })

    // INSPEÇÃO
    const inspecaoWidth =
      colWidths.compReal +
      colWidths.carcaca +
      colWidths.unioes +
      colWidths.compLuva +
      colWidths.vedacao +
      colWidths.marcacao

    this.doc.setFillColor(200, 220, 255)
    this.doc.rect(currentX + dadosGeraisWidth, startY, inspecaoWidth, 8, 'F')
    this.doc.setTextColor(0,0,0)
    this.doc.text("INSPEÇÃO", currentX + dadosGeraisWidth + inspecaoWidth / 2, startY + 5, { align: "center" })

    // MANUTENÇÃO
    const manutencaoWidth =
      colWidths.ensaio +
      colWidths.reempat +
      colWidths.compFinal +
      colWidths.substUnioes +
      colWidths.substVed +
      colWidths.substAneis +
      colWidths.novoEnsaio +
      colWidths.secagem +
      colWidths.limpeza +
      colWidths.resultado

    this.doc.setFillColor(220, 200, 200)
    this.doc.rect(currentX + dadosGeraisWidth + inspecaoWidth, startY, manutencaoWidth, 8, 'F')
    this.doc.setTextColor(0,0,0)
    this.doc.text("MANUTENÇÃO", currentX + dadosGeraisWidth + inspecaoWidth + manutencaoWidth / 2, startY + 5, {
      align: "center",
    })

    // Headers detalhados
    currentX = this.margin
    const detailY = startY + 8

    this.doc.setFontSize(6)
    const headers = [
      { text: "ITEM", width: colWidths.item },
      { text: "MARCA DO DUTO FLEXÍVEL", width: colWidths.marcaDuto },
      { text: "MARCA DA UNIÃO", width: colWidths.marcaUniao },
      { text: "DIÂMETRO NOMINAL (mm)", width: colWidths.diametro },
      { text: "COMPRIMENTO NOMINAL (m)", width: colWidths.comprimento },
      { text: "TIPO", width: colWidths.tipo },
      { text: "ANO DE FABRICAÇÃO", width: colWidths.anoFab },
      { text: "DATA DA PRÓXIMA INSPEÇÃO", width: colWidths.proxInsp },
      { text: "DATA DA PRÓXIMA MANUTENÇÃO", width: colWidths.proxManut },
      { text: "COMPRIMENTO REAL (m)", width: colWidths.compReal },
      { text: "CARCAÇA REVESTIMENTO", width: colWidths.carcaca },
      { text: "UNIÕES", width: colWidths.unioes },
      { text: "COMP. LUVA EMPATAMENTO", width: colWidths.compLuva },
      { text: "VEDAÇÃO BORRACHA", width: colWidths.vedacao },
      { text: "MARCAÇÃO", width: colWidths.marcacao },
      { text: "ENSAIO HIDROSTÁTICO", width: colWidths.ensaio },
      { text: "REEMPATAÇÃO", width: colWidths.reempat },
      { text: "COMPRIMENTO FINAL", width: colWidths.compFinal },
      { text: "SUBSTITUIÇÃO UNIÕES", width: colWidths.substUnioes },
      { text: "SUBSTITUIÇÃO VEDAÇÕES", width: colWidths.substVed },
      { text: "SUBSTITUIÇÃO ANÉIS", width: colWidths.substAneis },
      { text: "NOVO ENSAIO HIDROSTÁTICO", width: colWidths.novoEnsaio },
      { text: "SECAGEM", width: colWidths.secagem },
      { text: "LIMPEZA", width: colWidths.limpeza },
      { text: "RESULTADO FINAL", width: colWidths.resultado },
    ]

    headers.forEach((header, idx) => {
      this.doc.setFillColor(240, 240, 240)
      this.doc.rect(currentX, detailY, header.width, 17, 'F')
      this.doc.setDrawColor(180,180,180)
      this.doc.rect(currentX, detailY, header.width, 17)
      this.doc.setTextColor(0,0,0)
      if (header.text.length > 12) {
        this.doc.saveGraphicsState();
        this.doc.text(
          header.text,
          currentX + header.width / 2 + 6,
          detailY + 16,
          {
            align: "center",
            angle: -60,
            baseline: "bottom"
          }
        );
        this.doc.restoreGraphicsState();
      } else {
        const splitText = this.doc.splitTextToSize(header.text, header.width - 2)
        const textHeight = splitText.length * 2
        const startTextY = detailY + (17 - textHeight) / 2 + 2
        splitText.forEach((line: string, index: number) => {
          this.doc.text(line, currentX + header.width / 2, startTextY + index * 2, { align: "center" })
        })
      }
      currentX += header.width
    })

    return startY + 25
  }

  private addDataRows(startY: number, items: InspectionItem[]) {
    const rowHeight = 8
    let currentY = startY
    let currentX = this.margin
    const colWidths = [12, 20, 20, 12, 15, 8, 15, 15, 15, 12, 8, 8, 12, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 10]
    this.doc.setFontSize(6)
    this.doc.setFont("helvetica", "normal")
    const maxRowsPerPage = 20
    let rowCount = 0
    for (let i = 0; i < Math.max(items.length, maxRowsPerPage); i++) {
      if (rowCount === maxRowsPerPage) {
        this.doc.addPage()
        this.drawBorders()
        let y = this.addHeader((this as any).inspection)
        y = this.addTableHeaders(y + 5)
        currentY = y
        rowCount = 0
      }
      currentX = this.margin
      const item = items[i]
      const rowData = [
        String(i + 1).padStart(3, "0"),
        item?.step1Data?.marcaDutoFlexivel || "",
        item?.step1Data?.marcaUniao || "",
        item?.step1Data?.diametro?.toString() || "",
        item?.step1Data?.comprimentoNominal?.toString() || "",
        item?.step2Data?.tipo?.toString() || "",
        item?.step2Data?.anoFabricacao ? item.step2Data.anoFabricacao.split("T")[0] : "",
        item?.step2Data?.dataProximaInspecao ? item.step2Data.dataProximaInspecao.split("T")[0] : "",
        item?.step2Data?.dataProximaManutencao ? item.step2Data.dataProximaManutencao.split("T")[0] : "",
        item?.step3Data?.comprimentoReal?.toString() || "",
        this.convertStatus(item?.step3Data?.carcacaRevestimento),
        this.convertStatus(item?.step3Data?.unioes),
        item?.step3Data?.compLuvaEmpatamento?.toString() || "",
        this.convertStatus(item?.step3Data?.vedacaoBorracha),
        this.convertStatus(item?.step3Data?.marcacao),
        this.convertStatus(item?.step4Data?.ensaioHidrostatico),
        this.convertYesNo(item?.step4Data?.reempatacao),
        item?.step4Data?.comprimentoFinal?.toString() || "",
        this.convertYesNo(item?.step4Data?.substituicaoUnioes),
        this.convertYesNo(item?.step4Data?.substituicaoVedacoes),
        this.convertYesNo(item?.step5Data?.substituicoesAneis),
        this.convertStatus(item?.step5Data?.novoEnsaioHidrostatico),
        this.convertYesNo(item?.step5Data?.secagem),
        this.convertYesNo(item?.step5Data?.limpeza),
        this.convertStatus(item?.step5Data?.resultadoFinal),
      ]
      // Linhas zebra
      if (rowCount % 2 === 1) {
        this.doc.setFillColor(245, 245, 245)
        this.doc.rect(currentX, currentY, colWidths.reduce((a,b)=>a+b,0), rowHeight, 'F')
      }
      rowData.forEach((data, colIndex) => {
        this.doc.setDrawColor(200,200,200)
        this.doc.rect(currentX, currentY, colWidths[colIndex], rowHeight)
        if (data) {
          this.doc.setTextColor(0,0,0)
          this.doc.text(data, currentX + colWidths[colIndex] / 2, currentY + rowHeight / 2 + 1, { align: "center" })
        }
        currentX += colWidths[colIndex]
      })
      currentY += rowHeight
      rowCount++
    }
    return currentY
  }

  private convertStatus(value: any): string {
    if (value === "Aprovado") return "A"
    if (value === "Reprovado") return "R"
    return ""
  }

  private convertYesNo(value: any): string {
    if (value === "Sim") return "S"
    if (value === "Não") return "N"
    return ""
  }

  private addFooter(startY: number, inspection: Inspection) {
    const footerY = startY + 5

    // Legenda
    this.doc.setFontSize(7)
    this.doc.setFont("helvetica", "normal")
    this.doc.text("Legenda:", this.margin, footerY)
    this.doc.text(
      "A (Aprovado)    R (Reprovado)    S (Sim)    N (Não)    C (Condenada)    NC (Não Conforme)",
      this.margin + 20,
      footerY,
    )

    // Seções de descrição de peças substituídas
    const sectionY = footerY + 10
    const sectionWidth = (this.pageWidth - this.margin * 2 - 10) / 2

    // Primeira seção
    this.doc.rect(this.margin, sectionY, sectionWidth, 25)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("QTDE", this.margin + 5, sectionY + 5)
    this.doc.text("DESCRIÇÃO DA PEÇA SUBSTITUÍDA", this.margin + 25, sectionY + 5)

    // Segunda seção
    this.doc.rect(this.margin + sectionWidth + 5, sectionY, sectionWidth, 25)
    this.doc.text("QTDE", this.margin + sectionWidth + 10, sectionY + 5)
    this.doc.text("DESCRIÇÃO DA PEÇA SUBSTITUÍDA", this.margin + sectionWidth + 30, sectionY + 5)

    // Data de execução
    const dateY = sectionY + 30
    this.doc.text(`Data da Execução: ${new Date().toLocaleDateString("pt-BR")}`, this.pageWidth - 80, dateY)

    // Assinatura
    this.doc.text("Responsável Técnico:", this.pageWidth - 80, dateY + 10)
    this.doc.text(inspection.responsavel, this.pageWidth - 80, dateY + 15)
  }

  public generate({ inspection, items }: PDFGeneratorOptions): jsPDF {
    // Desenhar bordas
    this.drawBorders()
    // Adicionar header
    let headerPosY = this.addHeader(inspection)
    // Adicionar headers da tabela
    let tableHeaderPosY = this.addTableHeaders(headerPosY + 5)
    // Adicionar linhas de dados (com paginação)
    (this as any).inspection = inspection
    let dataRowsEndY = this.addDataRows(tableHeaderPosY, items)
    // Adicionar footer
    this.addFooter(dataRowsEndY, inspection)
    return this.doc
  }

  public static async generateAndDownload(options: PDFGeneratorOptions): Promise<void> {
    const generator = new PDFGenerator()
    const doc = generator.generate(options)

    const fileName = `certificado-nbr12779-${options.inspection.id}-${new Date().toISOString().split("T")[0]}.pdf`
    doc.save(fileName)
  }

  public static async generateBlob(options: PDFGeneratorOptions): Promise<Blob> {
    const generator = new PDFGenerator()
    const doc = generator.generate(options)

    return doc.output("blob")
  }
}
