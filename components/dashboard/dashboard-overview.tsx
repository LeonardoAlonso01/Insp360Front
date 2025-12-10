"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  Calendar,
  Eye,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Users,
  LogOut,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useAuth } from "@/hooks/use-auth"
import { isAdminRole } from "@/lib/auth"
import { apiClient } from "@/lib/api"
import { formatDate } from "@/components/inspections/utils"

interface DashboardOverviewProps {
  onCreateNew: () => void
  onEdit?: (inspection: any) => void
  onShowUsers?: () => void
  onShowList?: () => void
}

export default function DashboardOverview({ onCreateNew, onEdit, onShowUsers, onShowList }: DashboardOverviewProps) {
  const { user, logout } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    completionRate: 0,
  })
  const [recentInspections, setRecentInspections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const data = await apiClient.getDashboardData()
      setDashboardData(data)

      // Carregar inspeções recentes
      const inspections = await apiClient.getInspections({ limit: 5 })
      setRecentInspections(inspections)
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair do sistema?")) {
      logout()
    }
  }

  // Dados para gráfico de linha (últimos 6 meses)
  const monthlyData = [
    { month: "Jan", total: 12, completed: 8 },
    { month: "Fev", total: 15, completed: 10 },
    { month: "Mar", total: 18, completed: 14 },
    { month: "Abr", total: 22, completed: 18 },
    { month: "Mai", total: 25, completed: 20 },
    { month: "Jun", total: dashboardData.total, completed: dashboardData.completed },
  ]

  // Dados para gráfico de rosca (distribuição por status)
  const statusData = [
    { name: "Concluídas", value: dashboardData.completed, color: "#10b981" },
    { name: "Em Andamento", value: dashboardData.inProgress, color: "#3b82f6" },
    { name: "Pendentes", value: dashboardData.pending, color: "#f59e0b" },
  ]

  const chartConfig = {
    total: {
      label: "Total de Inspeções",
      color: "hsl(var(--chart-1))",
    },
    completed: {
      label: "Concluídas",
      color: "hsl(var(--chart-2))",
    },
  }

  const isAdmin = user?.email === "leooalonso@gmail.com" || isAdminRole(user?.role)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Bem-vindo de volta, {user?.name || "Usuário"}
              </h1>
              <p className="text-blue-100">Este é o seu relatório mensal de visão geral</p>
            </div>
            <nav className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-blue-500/20 font-medium border-b-2 border-white"
              >
                Overview
              </Button>
              {onShowList && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-blue-500/20"
                  onClick={onShowList}
                >
                  Inspeções
                </Button>
              )}
              {isAdmin && onShowUsers && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-blue-500/20"
                  onClick={onShowUsers}
                >
                  Usuários
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-blue-500/20"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </nav>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total de Inspeções */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Total de Inspeções</CardTitle>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-1">Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-slate-900">{dashboardData.total}</p>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+{dashboardData.completionRate}% Taxa de Conclusão</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inspeções Concluídas */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Inspeções Concluídas</CardTitle>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-1">Este mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-slate-900">{dashboardData.completed}</p>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>
                    +{dashboardData.total > 0 ? Math.round((dashboardData.completed / dashboardData.total) * 100) : 0}%
                    do Total
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inspeções Pendentes */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Inspeções Pendentes</CardTitle>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-1">Aguardando ação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-slate-900">{dashboardData.pending}</p>
                <div className="flex items-center text-red-600 text-sm font-medium">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>
                    {dashboardData.total > 0
                      ? Math.round((dashboardData.pending / dashboardData.total) * 100)
                      : 0}
                    % do Total
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Balance Overview - Line Chart */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">Visão Geral das Inspeções</CardTitle>
                  <CardDescription>Tendência dos últimos 6 meses</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="text-xs border-slate-200">
                  Últimos 6 meses
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} id="balance-overview" className="h-[300px]">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    name="Total"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                    name="Concluídas"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Status Distribution - Pie Chart */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Distribuição por Status</CardTitle>
              <CardDescription>Breakdown das inspeções</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative flex items-center justify-center h-[250px]">
                  <ChartContainer config={chartConfig} id="status-distribution" className="h-full w-full">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-slate-900">{dashboardData.total}</p>
                      <p className="text-sm text-slate-600">Total de Inspeções</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-slate-600">Concluídas</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {dashboardData.total > 0
                        ? Math.round((dashboardData.completed / dashboardData.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-slate-600">Em Andamento</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {dashboardData.total > 0
                        ? Math.round((dashboardData.inProgress / dashboardData.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm text-slate-600">Pendentes</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {dashboardData.total > 0 ? Math.round((dashboardData.pending / dashboardData.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Inspections Table */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">Inspeções Recentes</CardTitle>
                <CardDescription>Últimas inspeções realizadas</CardDescription>
              </div>
              <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Nova Inspeção
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-2" />
                <p className="text-slate-600">Carregando...</p>
              </div>
            ) : recentInspections.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Nenhuma inspeção encontrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentInspections.map((inspection) => (
                      <TableRow key={inspection.id}>
                        <TableCell className="font-medium">{inspection.client}</TableCell>
                        <TableCell>{inspection.responsible}</TableCell>
                        <TableCell>{formatDate(inspection.inspectionDate)}</TableCell>
                        <TableCell>
                          {inspection.result === "Aprovado" ? (
                            <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
                          ) : inspection.result === "Reprovado" ? (
                            <Badge className="bg-red-100 text-red-800">Reprovado</Badge>
                          ) : (
                            <Badge variant="secondary">{inspection.result}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(inspection)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Ver Detalhes
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

