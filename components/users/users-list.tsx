"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, Plus, Edit, Trash2, Key, Search, Mail, User as UserIcon, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type CompanyUser } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { getRoleName, isAdminRole } from "@/lib/auth"
import UserFormDialog from "./user-form-dialog"
import ResetPasswordDialog from "./reset-password-dialog"

interface UsersListProps {
  onBack: () => void
}

export default function UsersList({ onBack }: UsersListProps) {
  const [users, setUsers] = useState<CompanyUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUser, setEditingUser] = useState<CompanyUser | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUserName, setSelectedUserName] = useState<string | undefined>(undefined)

  const { toasts, toast, removeToast } = useToast()
  const { user: currentUser } = useAuth()

  const loadUsers = useCallback(async (query: string = "") => {
    setLoading(true)
    try {
      console.log("[UsersList] Carregando usuários com query:", query)
      // Usar o novo endpoint /user com query e companyId
      const data = await apiClient.getUsers(query)
      console.log("[UsersList] Usuários recebidos:", data)
      console.log("[UsersList] Quantidade de usuários:", data?.length)
      setUsers(data || [])
    } catch (error) {
      console.error("[UsersList] Erro ao carregar usuários:", error)
      toast({
        title: "Erro!",
        description: error instanceof Error ? error.message : "Não foi possível carregar os usuários",
        variant: "destructive",
      })
      setUsers([]) // Garantir que o estado seja limpo em caso de erro
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Carregar usuários na inicialização
  useEffect(() => {
    loadUsers("")
  }, [loadUsers])

  // Recarregar usuários quando o termo de busca mudar (com debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadUsers(searchTerm)
    }, 300) // Debounce de 300ms

    return () => clearTimeout(timeoutId)
  }, [searchTerm, loadUsers])

  const handleCreate = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const handleEdit = (user: CompanyUser) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${userName}"?`)) {
      return
    }

    try {
      await apiClient.deleteUser(userId)
      toast({
        title: "Sucesso!",
        description: "Usuário excluído com sucesso",
        variant: "success",
      })
      loadUsers()
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível excluir o usuário",
        variant: "destructive",
      })
    }
  }

  const handleResetPassword = (userId: string, userName: string) => {
    setSelectedUserId(userId)
    setSelectedUserName(userName)
    setIsResetPasswordOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setEditingUser(null)
    loadUsers()
  }

  // Não precisa mais filtrar localmente, a busca é feita no servidor
  const filteredUsers = users

  const isAdmin = currentUser?.email === "leooalonso@gmail.com" || isAdminRole(currentUser?.role)

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você não tem permissão para acessar esta página.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onBack}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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
                ← Voltar
              </Button>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-red-600" />
                <h1 className="text-xl font-bold text-slate-900">Gerenciar Usuários</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Usuários da Empresa</h2>
              <p className="text-slate-600">Gerencie os usuários do sistema</p>
            </div>
            <Button onClick={handleCreate} className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>

          {/* Busca */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tabela de usuários */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>
                {filteredUsers.length} usuário(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent mx-auto mb-2" />
                  <p className="text-slate-600">Carregando usuários...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Nenhum usuário encontrado</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Perfil</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <UserIcon className="h-4 w-4 text-slate-500" />
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-slate-500" />
                              <span>{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const roleName = getRoleName(user.role)
                              const roleNum = typeof user.role === "number" ? user.role : parseInt(user.role || "2")
                              
                              if (roleNum === 0) {
                                return (
                                  <Badge className="bg-purple-100 text-purple-800">
                                    <Shield className="h-3 w-3 mr-1" />
                                    {roleName}
                                  </Badge>
                                )
                              } else if (roleNum === 1) {
                                return (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    <Shield className="h-3 w-3 mr-1" />
                                    {roleName}
                                  </Badge>
                                )
                              } else {
                                return (
                                  <Badge variant="secondary">
                                    {roleName}
                                  </Badge>
                                )
                              }
                            })()}
                          </TableCell>
                          <TableCell>
                            {user.isActive ? (
                              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                            ) : (
                              <Badge variant="secondary">Inativo</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(user)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleResetPassword(user.id, user.name)}
                                className="h-8 w-8 p-0"
                                title="Resetar Senha"
                              >
                                <Key className="h-4 w-4" />
                              </Button>
                              {user.id !== currentUser?.id && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(user.id, user.name)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialog de formulário */}
      <UserFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={editingUser}
        onSuccess={handleFormSuccess}
      />

      {/* Dialog de resetar senha */}
      <ResetPasswordDialog
        open={isResetPasswordOpen}
        onOpenChange={setIsResetPasswordOpen}
        userId={selectedUserId}
        userName={selectedUserName}
        onSuccess={() => {
          setIsResetPasswordOpen(false)
          setSelectedUserId(null)
          setSelectedUserName(undefined)
        }}
      />
    </div>
  )
}

