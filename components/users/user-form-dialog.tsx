"use client"

import { useState, useEffect } from "react"
import { User, Mail, Lock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type CompanyUser, type CreateUserRequest, type UpdateUserRequest } from "@/lib/api"
import { authService } from "@/lib/auth"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: CompanyUser | null
  onSuccess: () => void
}

export default function UserFormDialog({ open, onOpenChange, user, onSuccess }: UserFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "2", // Inspector = 2 (default)
    isActive: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      // Converter role para string se for número
      const userRole = typeof user.role === "number" ? user.role.toString() : (user.role || "2")
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: userRole,
        isActive: user.isActive,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "2", // Inspector = 2 (default)
        isActive: true,
      })
    }
  }, [user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const companyId = authService.getCompanyId()
      if (!companyId) {
        throw new Error("Company ID não encontrado")
      }

      if (user) {
        // Atualizar usuário - manter role como string (API espera string ou número)
        const updateData: UpdateUserRequest = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive,
        }
        await apiClient.updateUser(user.id, updateData)
        toast({
          title: "Sucesso!",
          description: "Usuário atualizado com sucesso",
          variant: "success",
        })
      } else {
        // Criar novo usuário
        if (!formData.password) {
          throw new Error("Senha é obrigatória para novos usuários")
        }
        // Criar usuário - role como string (API aceita string ou número)
        const createData: CreateUserRequest = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          companyId,
        }
        await apiClient.createUser(createData)
        toast({
          title: "Sucesso!",
          description: "Usuário criado com sucesso",
          variant: "success",
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erro!",
        description: error instanceof Error ? error.message : "Não foi possível salvar o usuário",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{user ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            <DialogDescription>
              {user ? "Atualize as informações do usuário" : "Preencha os dados para criar um novo usuário"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Nome Completo
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {!user && (
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="role" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Perfil
              </Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Administrador</SelectItem>
                  <SelectItem value="1">Supervisor</SelectItem>
                  <SelectItem value="2">Inspetor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {user && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Usuário ativo
                </Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-700">
              {isSaving ? "Salvando..." : user ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

