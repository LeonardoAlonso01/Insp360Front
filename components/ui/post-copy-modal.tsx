"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Item Copiado!
          </DialogTitle>
          <DialogDescription>
            Escolha o que fazer agora:
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-4">
          <Button
            onClick={onFinalize}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Finalizar Inspeção
          </Button>
          <Button
            onClick={onAddNewItem}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Novo Item
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
