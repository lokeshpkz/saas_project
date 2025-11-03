import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Trash2 } from "lucide-react"

interface DeleteResellerConfirmDialogProps {
  reseller: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isDeleting?: boolean
}

export function DeleteResellerConfirmDialog({ 
  reseller, 
  open, 
  onOpenChange, 
  onConfirm, 
  isDeleting = false 
}: DeleteResellerConfirmDialogProps) {
  const [confirmText, setConfirmText] = useState("")

  if (!reseller) return null

  const expectedText = reseller.email
  const isConfirmValid = confirmText === expectedText

  const handleConfirm = () => {
    if (isConfirmValid) {
      onConfirm()
      setConfirmText("")
    }
  }

  const handleClose = () => {
    setConfirmText("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Reseller
          </DialogTitle>
          <DialogDescription>
            This action will permanently delete the reseller account and all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              <strong>Warning:</strong> This action cannot be undone.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">The following will be permanently deleted:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                <span>Reseller account: <strong className="text-foreground">{reseller.email}</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                <span>All licenses created by this reseller</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                <span>All end users registered with this reseller's licenses</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-text" className="text-sm font-medium text-foreground">
              Type <strong>{expectedText}</strong> to confirm deletion:
            </label>
            <input
              id="confirm-text"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type "${expectedText}" here`}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              disabled={isDeleting}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmValid || isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Reseller
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}