"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Copiar Item
          </DialogTitle>
          <DialogDescription>
            O item atual será salvo e depois serão criadas as cópias solicitadas.
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
              onChange={(e) => setCopies(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              disabled={loading}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Mínimo: 1, Máximo: 10
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCopy}
            disabled={loading || copies < 1}
            className="bg-red-600 hover:bg-red-700"
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

