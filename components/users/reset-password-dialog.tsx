"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Key, Copy, Check, Eye, EyeOff } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"

interface ResetPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
  userName?: string
  onSuccess: () => void
}

export default function ResetPasswordDialog({ open, onOpenChange, userId, userName, onSuccess }: ResetPasswordDialogProps) {
  const [isResetting, setIsResetting] = useState(false)
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  // Limpar estado quando o diálogo abrir
  useEffect(() => {
    if (open) {
      setTemporaryPassword(null)
      setCopied(false)
      setShowPassword(false)
      setIsResetting(false)
    }
  }, [open])

  const handleConfirm = async () => {
    if (!userId) {
      return
    }

    setIsResetting(true)
    setTemporaryPassword(null)
    setCopied(false)
    try {
      const response = await apiClient.resetUserPassword(userId)
      console.log("[ResetPasswordDialog] Resposta da API:", response)
      console.log("[ResetPasswordDialog] TemporaryPassword:", response.TemporaryPassword)
      console.log("[ResetPasswordDialog] temporaryPassword:", response.temporaryPassword)
      
      const password = response.TemporaryPassword || response.temporaryPassword || ""
      console.log("[ResetPasswordDialog] Senha extraída:", password)
      
      if (password) {
        setTemporaryPassword(password)
        toast({
          title: "Sucesso!",
          description: "Senha resetada com sucesso",
          variant: "success",
        })
      } else {
        throw new Error("Senha temporária não foi retornada pela API")
      }
    } catch (error) {
      toast({
        title: "Erro!",
        description: error instanceof Error ? error.message : "Não foi possível resetar a senha",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }

  const handleCopy = async () => {
    if (!temporaryPassword) return

    try {
      await navigator.clipboard.writeText(temporaryPassword)
      setCopied(true)
      toast({
        title: "Copiado!",
        description: "Senha temporária copiada para a área de transferência",
        variant: "success",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível copiar a senha",
        variant: "destructive",
      })
    }
  }

  const handleClose = () => {
    if (temporaryPassword) {
      onSuccess()
    }
    setTemporaryPassword(null)
    setCopied(false)
    setShowPassword(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-red-600" />
            Resetar Senha
          </DialogTitle>
          <DialogDescription>
            {temporaryPassword 
              ? "Senha temporária gerada com sucesso. Copie e compartilhe com o usuário."
              : userName 
                ? `Deseja resetar a senha do usuário "${userName}"?` 
                : "Deseja resetar a senha deste usuário?"}
          </DialogDescription>
        </DialogHeader>

        {!temporaryPassword ? (
          <div className="py-4">
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Atenção!</p>
                <p>Esta ação irá resetar a senha do usuário. Uma nova senha será gerada automaticamente pelo sistema.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Senha Resetada!</p>
                <p>A senha temporária foi gerada. Certifique-se de copiá-la antes de fechar este diálogo.</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tempPassword">Senha Temporária</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="tempPassword"
                    type={showPassword ? "text" : "password"}
                    value={temporaryPassword}
                    readOnly
                    className="font-mono pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="flex-shrink-0"
                  title="Copiar senha"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {temporaryPassword ? (
            <Button 
              type="button" 
              onClick={handleClose} 
              className="bg-red-600 hover:bg-red-700 w-full"
            >
              Fechar
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isResetting}>
                Cancelar
              </Button>
              <Button 
                type="button" 
                onClick={handleConfirm} 
                disabled={isResetting} 
                className="bg-red-600 hover:bg-red-700"
              >
                {isResetting ? "Resetando..." : "Confirmar Reset"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

