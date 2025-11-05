import { Badge } from "@/components/ui/badge"
import type { Inspection } from "@/lib/api"

/**
 * Formata uma data para o padrão brasileiro (dd/mm/yyyy)
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

/**
 * Retorna um componente Badge estilizado baseado no status da inspeção
 */
export function getStatusBadge(status: Inspection["result"] | string | null | undefined) {
  const normalizedStatus = status || "desconhecido"
  
  switch (normalizedStatus) {
    case "Pending":
    case "pendente":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Pendente
        </Badge>
      )
    case "Completed":
    case "completed":
    case "Concluída":
    case "concluída":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Concluída
        </Badge>
      )
    case "InProgress":
    case "Em Andamento":
    case "em andamento":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Em Andamento
        </Badge>
      )
    default:
      return <Badge variant="secondary">Desconhecido</Badge>
  }
}

