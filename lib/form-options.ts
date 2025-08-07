// Opções pré-definidas para os formulários de inspeção - VERSÃO COMPLETA

export const OPTIONS_MARCA_DUTO = [
  { label: "Superflex", value: "Superflex" },
  { label: "Bucka", value: "Bucka" },
  { label: "Kidde", value: "Kidde" },
  { label: "Flexcasty", value: "Flexcasty" },
  { label: "Lacerfire", value: "Lacerfire" },
  { label: "Resmat", value: "Resmat" },
  { label: "Recol", value: "Recol" },
  { label: "Outros", value: "Outros" },
]

export const OPTIONS_MARCA_UNIAO = [
  { label: "CTX", value: "CTX" },
  { label: "CMC", value: "CMC" },
  { label: "Nairi", value: "Nairi" },
  { label: "Bucka", value: "Bucka" },
  { label: "Kinusi", value: "Kinusi" },
  { label: "MGS", value: "MGS" },
  { label: "KRP", value: "KRP" },
  { label: "GPM", value: "GPM" },
  { label: "Metalcasty", value: "Metalcasty" },
  { label: "Lacerfire", value: "Lacerfire" },
  { label: "Outros", value: "Outros" },
]

export const OPTIONS_COMPRIMENTO_NOMINAL = [
  { label: "15 metros", value: "15" },
  { label: "20 metros", value: "20" },
  { label: "25 metros", value: "25" },
  { label: "30 metros", value: "30" },
  { label: "Outro", value: "Outro" },
]

export const OPTIONS_TIPO = [
  { label: "Tipo 1", value: "1" },
  { label: "Tipo 2", value: "2" },
  { label: "Tipo 3", value: "3" },
  { label: "Tipo 4", value: "4" },
  { label: "Tipo 5", value: "5" },
]

export const OPTIONS_DIAMETROS = [
  { label: '1 1/2"', value: '1 1/2"' },
  { label: '2 1/2"', value: '2 1/2"' },
]

export const OPTIONS_APROVADO_REPROVADO = [
  { label: "Aprovado", value: "A" },
  { label: "Reprovado", value: "R" },
]

export const OPTIONS_SIM_NAO = [
  { label: "Sim", value: "S" },
  { label: "Não", value: "N" },
]

export const OPTIONS_APROVADO_CONDENADO = [
  { label: "Aprovado", value: "A" },
  { label: "Condenada", value: "C" },
]

// Opções para tipos de instalação (Step 2)
export const OPTIONS_TIPO_INSTALACAO = [
  { label: "Aérea", value: "aerea" },
  { label: "Subterrânea", value: "subterranea" },
  { label: "Submarina", value: "submarina" },
  { label: "Mista", value: "mista" },
]

// Opções para condições ambientais
export const OPTIONS_CONDICOES_AMBIENTAIS = [
  { label: "Normal", value: "normal" },
  { label: "Agressiva", value: "agressiva" },
  { label: "Marinha", value: "marinha" },
  { label: "Industrial", value: "industrial" },
  { label: "Química", value: "quimica" },
]

// Opções para frequência de uso
export const OPTIONS_FREQUENCIA_USO = [
  { label: "Baixa (< 1x/mês)", value: "baixa" },
  { label: "Média (1-4x/mês)", value: "media" },
  { label: "Alta (> 4x/mês)", value: "alta" },
  { label: "Contínua", value: "continua" },
]

// Opções para resultado final expandido
export const OPTIONS_RESULTADO_FINAL = [
  { label: "✅ Aprovado", value: "A" },
  { label: "❌ Reprovado", value: "R" },
  { label: "⛔ Condenado", value: "C" },
  { label: "⚠️ Aprovado com Ressalvas", value: "AR" },
]

// Opções para motivos de reprovação
export const OPTIONS_MOTIVOS_REPROVACAO = [
  { label: "Vazamento na união", value: "vazamento_uniao" },
  { label: "Desgaste da carcaça", value: "desgaste_carcaca" },
  { label: "Falha no teste de pressão", value: "falha_pressao" },
  { label: "Vedação danificada", value: "vedacao_danificada" },
  { label: "Marcação ilegível", value: "marcacao_ilegivel" },
  { label: "Comprimento inadequado", value: "comprimento_inadequado" },
  { label: "Outros", value: "outros" },
]

// Opções para prioridade de manutenção
export const OPTIONS_PRIORIDADE = [
  { label: "🔴 Urgente", value: "urgente" },
  { label: "🟡 Alta", value: "alta" },
  { label: "🟢 Normal", value: "normal" },
  { label: "🔵 Baixa", value: "baixa" },
]
