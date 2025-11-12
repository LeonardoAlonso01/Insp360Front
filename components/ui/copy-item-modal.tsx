"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Loader2 } from "lucide-react"

interface CopyItemModalProps {
  isOpen: boolean
  onClose: () => void
  onCopy: (copies: number) => Promise<void>
  loading?: boolean
}

export function CopyItemModal({ isOpen, onClose, onCopy, loading = false }: CopyItemModalProps) {
  const [copies, setCopies] = useState(1)

  const handleCopy = async () => {
    if (copies > 0) {
      await onCopy(copies)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setCopies(1)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Copiar Item
          </DialogTitle>
          <DialogDescription>
            O item será salvo e copiado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="copies">Número de cópias</Label>
            <Input
              id="copies"
              type="number"
              min="1"
              value={copies}
              disabled={loading}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleCopy}
              disabled={loading || copies < 1}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Copiando...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Item
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
