import { useState, useEffect } from "react"
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
import { AlertTriangle, Trash2, Loader2 } from "lucide-react"
import { App, apiClient } from "@/lib/api"

interface DeleteAppConfirmDialogProps {
  app: App | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isDeleting?: boolean
}

export function DeleteAppConfirmDialog({ 
  app, 
  open, 
  onOpenChange, 
  onConfirm, 
  isDeleting = false 
}: DeleteAppConfirmDialogProps) {
  const [confirmText, setConfirmText] = useState("")
  const [deletionPreview, setDeletionPreview] = useState<{
    resellers: number;
    licenses: number;
    endUsers: number;
  } | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

  useEffect(() => {
    if (app && open) {
      setLoadingPreview(true)
      apiClient.getAppDeletionPreview(app._id)
        .then(response => {
          if (response.success && response.data) {
            setDeletionPreview(response.data.willDelete)
          }
        })
        .catch(error => {
          console.error('Failed to load deletion preview:', error)
          // Fallback to showing generic message
          setDeletionPreview({ resellers: 0, licenses: 0, endUsers: 0 })
        })
        .finally(() => {
          setLoadingPreview(false)
        })
    }
  }, [app, open])
  
  if (!app) return null

  const expectedText = app.name
  const isConfirmValid = confirmText === expectedText

  const handleConfirm = () => {
    if (isConfirmValid) {
      onConfirm()
      setConfirmText("")
    }
  }

  const handleClose = () => {
    setConfirmText("")
    setDeletionPreview(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Application
          </DialogTitle>
          <DialogDescription>
            This action will permanently delete the application and all associated data.
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
            {loadingPreview ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading deletion preview...</span>
              </div>
            ) : (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                  <span>Application: <strong className="text-foreground">{app.name}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                  <span>
                    {deletionPreview?.resellers || 0} reseller{deletionPreview?.resellers !== 1 ? 's' : ''} associated with this app
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                  <span>
                    {deletionPreview?.licenses || 0} license key{deletionPreview?.licenses !== 1 ? 's' : ''} for this app
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                  <span>
                    {deletionPreview?.endUsers || 0} end user{deletionPreview?.endUsers !== 1 ? 's' : ''} registered with this app's licenses
                  </span>
                </li>
              </ul>
            )}
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
                Delete Application
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}