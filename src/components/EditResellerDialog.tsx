import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from "lucide-react"
import { useUpdateReseller } from "@/hooks/useResellers"
import { Reseller } from "@/lib/api"
import { toast } from "sonner"

interface EditResellerDialogProps {
  reseller: any  // Using any to handle inconsistent data structure
  trigger?: React.ReactNode
}

export function EditResellerDialog({ reseller, trigger }: EditResellerDialogProps) {
  const [open, setOpen] = useState(false)
  // Get license limit from either field structure
  const getLicenseLimit = () => reseller.licenseLimit || reseller.allowed_license_keys || 0
  const getUsedLicenses = () => reseller.usedLicenses || reseller.created_licenses || 0
  const getResellerEmail = () => reseller.user?.email || reseller.email || 'Unknown'
  const getAppName = () => reseller.app?.name || reseller.app_id?.name || 'Unknown App'
  
  const [allowedLicenseKeys, setAllowedLicenseKeys] = useState(getLicenseLimit().toString())

  const updateReseller = useUpdateReseller()

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      setAllowedLicenseKeys(getLicenseLimit().toString())
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newLimit = parseInt(allowedLicenseKeys)
    
    // Validation
    if (!allowedLicenseKeys || isNaN(newLimit) || newLimit < 0) {
      toast.error('Please enter a valid license limit (0 or greater)')
      return
    }

    if (newLimit > 10000) {
      toast.error('License limit cannot exceed 10,000')
      return
    }

    // Warn if setting limit below current usage
    if (newLimit < getUsedLicenses()) {
      if (!window.confirm(
        `Warning: This reseller has already created ${getUsedLicenses()} licenses. ` +
        `Setting the limit to ${newLimit} will prevent them from creating more licenses until some are deleted. Continue?`
      )) {
        return
      }
    }

    updateReseller.mutate(
      {
        resellerId: reseller._id,
        data: { licenseLimit: newLimit }
      },
      {
        onSuccess: (updatedReseller) => {
          setOpen(false)
          toast.success(`License limit updated to ${newLimit} for ${getResellerEmail()}`, {
            description: `Remaining licenses: ${Math.max(0, newLimit - getUsedLicenses())}`
          })
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to update reseller license limit')
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit License Limit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle>Edit Reseller License Limit</DialogTitle>
          <DialogDescription>
            Update the maximum number of license keys this reseller can create.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Current Reseller</Label>
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-medium text-sm">{getResellerEmail()}</p>
                <p className="text-sm text-muted-foreground">{getAppName()}</p>
                <p className="text-xs text-muted-foreground">
                  Currently used: {getUsedLicenses()} / {getLicenseLimit()} licenses
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="allowedLicenseKeys">License Key Limit *</Label>
              <Input
                id="allowedLicenseKeys"
                type="number"
                min="0"
                max="10000"
                placeholder="Number of licenses they can create"
                value={allowedLicenseKeys}
                onChange={(e) => setAllowedLicenseKeys(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !updateReseller.isPending) {
                    handleSubmit(e as any)
                  }
                }}
                disabled={updateReseller.isPending}
                required
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Current usage: {getUsedLicenses()} licenses created</span>
                <span>Max: 10,000</span>
              </div>
              {allowedLicenseKeys && parseInt(allowedLicenseKeys) < getUsedLicenses() && (
                <div className="p-2 rounded-md bg-yellow-50 border border-yellow-200">
                  <p className="text-xs text-yellow-800 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Warning: Setting limit below current usage ({getUsedLicenses()}) will prevent new license creation</span>
                  </p>
                </div>
              )}
            </div>

            {allowedLicenseKeys && parseInt(allowedLicenseKeys) >= 0 && parseInt(allowedLicenseKeys) !== getLicenseLimit() && (
              <div className="grid gap-2">
                <Label>Preview Changes</Label>
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-primary">New Limit:</span>
                    <span className="text-sm font-bold text-primary">{allowedLicenseKeys}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Currently Used:</span>
                    <span className="text-xs text-muted-foreground">{getUsedLicenses()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">New Remaining:</span>
                    <span className="text-xs font-medium text-primary">
                      {Math.max(0, parseInt(allowedLicenseKeys) - getUsedLicenses())}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAllowedLicenseKeys(getLicenseLimit().toString())
                setOpen(false)
              }}
              disabled={updateReseller.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateReseller.isPending}>
              {updateReseller.isPending ? "Updating..." : "Update Limit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}  