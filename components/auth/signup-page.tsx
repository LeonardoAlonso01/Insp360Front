"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Lock, Mail, User, Building2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"

interface SignUpPageProps {
  onSignUpSuccess: () => void
  onBack: () => void
}

export default function SignUpPage({ onSignUpSuccess, onBack }: SignUpPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toasts, toast, removeToast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro!",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro!",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Aqui você pode adicionar a lógica de cadastro quando a API estiver disponível
      // Por enquanto, vamos apenas simular um sucesso
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Sucesso!",
        description: "Cadastro realizado com sucesso. Você pode fazer login agora.",
        variant: "success",
      })

      setTimeout(() => {
        onSignUpSuccess()
      }, 2000)
    } catch (error) {
      toast({
        title: "Erro!",
        description: error instanceof Error ? error.message : "Erro ao realizar cadastro",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.password.trim() &&
    formData.confirmPassword.trim() &&
    formData.companyName.trim()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
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

      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Criar Conta</h1>
          <p className="text-slate-600">Preencha os dados para começar</p>
        </div>

        {/* Formulário de Cadastro */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Cadastro</CardTitle>
            <CardDescription>Preencha seus dados para criar sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Nome */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-2 text-slate-500" />
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
                  required
                />
              </div>

              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-slate-500" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12 transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
                  required
                />
              </div>

              {/* Campo Empresa */}
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-slate-500" />
                  Nome da Empresa
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Nome da sua empresa"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="h-12 transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
                  required
                />
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-slate-500" />
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-12 pr-12 transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Campo Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-slate-500" />
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="h-12 pr-12 transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Botão de Cadastro */}
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Criando conta...
                  </>
                ) : (
                  "Criar Conta"
                )}
              </Button>

              {/* Botão Voltar */}
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                className="w-full text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

