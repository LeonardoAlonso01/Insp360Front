// Tipos para as etapas da inspeção
export interface InspectionStepData {
  idInspection: string
}

// Etapa 1 - Dados do Duto
export interface Step1Data extends InspectionStepData {
  marcaDutoFlexivel: string
  marcaUniao: string
  diametro: string // Mantido como string
  comprimentoNominal: string // Mantido como string
}

// Etapa 2 - Dados de Ensaio e Fabricação
export interface Step2Data extends InspectionStepData {
  pressaoEnsaio: string
  tipo: number
  anoFabricacao: string
  dataProximaInspecao: string
  dataProximaManutencao: string
}

// Etapa 3 - Dados de Inspeção Visual
export interface Step3Data extends InspectionStepData {
  comprimentoReal: string
  carcacaRevestimento: string
  unioes: string
  compLuvaEmpatamento: string
  vedacaoBorracha: string
  marcacao: string
}

// Etapa 4 - Dados de Ensaio e Manutenção
export interface Step4Data extends InspectionStepData {
  ensaioHidrostatico: string
  reempatacao: string
  comprimentoFinal: string
  substituicaoUnioes: string
  substituicaoVedacoes: string
}

// Etapa 5 - Finalização e Resultado
export interface Step5Data extends InspectionStepData {
  substituicoesAneis: string
  novoEnsaioHidrostatico: string
  secagem:string
  limpeza: string
  resultadoFinal: string
  observacoesFinais?: string
}

export type StepData = Step1Data | Step2Data | Step3Data | Step4Data | Step5Data

export interface InspectionStepsState {
  currentStep: number
  inspectionId: string
  step1: Partial<Step1Data>
  step2: Partial<Step2Data>
  step3: Partial<Step3Data>
  step4: Partial<Step4Data>
  step5: Partial<Step5Data>
}
