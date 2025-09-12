"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, PlusCircle } from "lucide-react"

interface PostCopyModalProps {
  isOpen: boolean
  onClose: () => void
  onFinalize: () => void
  onAddNewItem: () => void
}

export function PostCopyModal({ isOpen, onClose, onFinalize, onAddNewItem }: PostCopyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Item Copiado com Sucesso!
          </DialogTitle>
          <DialogDescription>
            O item foi salvo e copiado com sucesso. O que você gostaria de fazer agora?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Escolha uma das opções abaixo para continuar:
          </p>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={onAddNewItem}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Novo Item
          </Button>
          <Button
            onClick={onFinalize}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Finalizar Inspeção
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
