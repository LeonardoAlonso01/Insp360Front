"use client"

import { useState } from "react"
import {
  User,
  Settings,
  Bell,
  Shield,
  Activity,
  LogOut,
  Edit,
  Save,
  X,
  FileText,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Download,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Toast } from "@/components/ui/toast"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface UserProfileProps {
  onBack: () => void
}

export default function UserProfile({ onBack }: UserProfileProps) {
  const { user, logout } = useAuth()
  const { toasts, toast, removeToast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [profileData, setProfileData] = useState({
    name: user?.name || "Administrador",
    email: user?.email || "admin@teste.com",
    phone: "(11) 99999-9999",
    company: "Empresa de Inspeções Ltda",
    position: "Inspetor Técnico",
    address: "São Paulo, SP",
    bio: "Especialista em inspeções técnicas com mais de 10 anos de experiência.",
  })

  const [preferences, setPreferences] = useState({
    notifications: true,
    emailReports: true,
    autoSave: true,
    darkMode: false,
  })

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePreferenceChange = (field: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso",
        variant: "success",
      })

      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair do sistema?")) {
      logout()
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
        variant: "success",
      })
    }
  }

  const recentActivities = [
    {
      id: 1,
      action: "Inspeção finalizada",
      description: "Empresa ABC Ltda - 3 itens aprovados",
      time: "2 horas atrás",
      icon: FileText,
    },
    {
      id: 2,
      action: "PDF gerado",
      description: "Certificado NBR 12779 baixado",
      time: "3 horas atrás",
      icon: Download,
    },
    {
      id: 3,
      action: "Nova inspeção criada",
      description: "Construtora XYZ - Em andamento",
      time: "1 dia atrás",
      icon: FileText,
    },
    {
      id: 4,
      action: "Login realizado",
      description: "Acesso ao sistema",
      time: "2 dias atrás",
      icon: Shield,
    },
  ]

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
                <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="text-sm">Voltar</span>
              </Button>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-slate-900 text-sm sm:text-base">Perfil do Usuário</span>
              </div>
            </div>

            <nav className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm px-2 sm:px-3"
                onClick={onBack}
              >
                <Building2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Inspeções</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="bg-red-50 text-red-700 hover:bg-red-100 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Users className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Usuário</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <button onClick={onBack} className="hover:text-slate-900 transition-colors text-sm">
            Sistema
          </button>
          <span>/</span>
          <span className="text-slate-900 font-medium text-sm">Perfil do Usuário</span>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="space-y-6">
          {/* Header da página */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <User className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Perfil do Usuário</h1>
            <p className="text-slate-600">Gerencie suas informações pessoais e preferências do sistema</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna Principal - Perfil */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informações Pessoais */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-red-600" />
                      Informações Pessoais
                    </CardTitle>
                    <CardDescription>Suas informações básicas e de contato</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
                  >
                    {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? "Cancelar" : "Editar"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nome */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium flex items-center">
                        <User className="h-4 w-4 mr-2 text-slate-500" />
                        Nome Completo
                      </Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="h-11"
                        />
                      ) : (
                        <p className="text-slate-900 font-medium">{profileData.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-slate-500" />
                        Email
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="h-11"
                        />
                      ) : (
                        <p className="text-slate-900 font-medium">{profileData.email}</p>
                      )}
                    </div>

                    {/* Telefone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-slate-500" />
                        Telefone
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="h-11"
                        />
                      ) : (
                        <p className="text-slate-900 font-medium">{profileData.phone}</p>
                      )}
                    </div>

                    {/* Empresa */}
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-slate-500" />
                        Empresa
                      </Label>
                      {isEditing ? (
                        <Input
                          id="company"
                          value={profileData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="h-11"
                        />
                      ) : (
                        <p className="text-slate-900 font-medium">{profileData.company}</p>
                      )}
                    </div>

                    {/* Cargo */}
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-sm font-medium flex items-center">
                        <User className="h-4 w-4 mr-2 text-slate-500" />
                        Cargo
                      </Label>
                      {isEditing ? (
                        <Input
                          id="position"
                          value={profileData.position}
                          onChange={(e) => handleInputChange("position", e.target.value)}
                          className="h-11"
                        />
                      ) : (
                        <p className="text-slate-900 font-medium">{profileData.position}</p>
                      )}
                    </div>

                    {/* Localização */}
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                        Localização
                      </Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          value={profileData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="h-11"
                        />
                      ) : (
                        <p className="text-slate-900 font-medium">{profileData.address}</p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-slate-500" />
                      Sobre
                    </Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        className="min-h-[100px] resize-none"
                        rows={4}
                      />
                    ) : (
                      <p className="text-slate-700">{profileData.bio}</p>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isSaving ? (
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
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preferências */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-red-600" />
                    Preferências do Sistema
                  </CardTitle>
                  <CardDescription>Configure como o sistema funciona para você</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {/* Notificações */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-900">Notificações</p>
                          <p className="text-sm text-slate-600">Receber notificações do sistema</p>
                        </div>
                      </div>
                      <Button
                        variant={preferences.notifications ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePreferenceChange("notifications", !preferences.notifications)}
                      >
                        {preferences.notifications ? "Ativado" : "Desativado"}
                      </Button>
                    </div>

                    <Separator />

                    {/* Relatórios por Email */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-900">Relatórios por Email</p>
                          <p className="text-sm text-slate-600">Receber relatórios semanais por email</p>
                        </div>
                      </div>
                      <Button
                        variant={preferences.emailReports ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePreferenceChange("emailReports", !preferences.emailReports)}
                      >
                        {preferences.emailReports ? "Ativado" : "Desativado"}
                      </Button>
                    </div>

                    <Separator />

                    {/* Auto Save */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Save className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-900">Salvamento Automático</p>
                          <p className="text-sm text-slate-600">Salvar automaticamente durante preenchimento</p>
                        </div>
                      </div>
                      <Button
                        variant={preferences.autoSave ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePreferenceChange("autoSave", !preferences.autoSave)}
                      >
                        {preferences.autoSave ? "Ativado" : "Desativado"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna Lateral */}
            <div className="space-y-6">
              {/* Estatísticas */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-red-600" />
                    Suas Estatísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Inspeções Realizadas</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        47
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">PDFs Gerados</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        32
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Itens Aprovados</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        89%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Tempo no Sistema</span>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                        6 meses
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Atividades Recentes */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-red-600" />
                    Atividades Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <activity.icon className="h-4 w-4 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                          <p className="text-xs text-slate-600 truncate">{activity.description}</p>
                          <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ações Rápidas */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-red-600" />
                    Ações Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Dados
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Backup
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Alterar Senha
                  </Button>
                  <Separator />
                  <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair do Sistema
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
