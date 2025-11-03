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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Edit, Calendar } from "lucide-react"
import { useUpdateLicense } from "@/hooks/useLicenses"
import { License } from "@/lib/api"
import { format } from "date-fns"

interface EditLicenseDialogProps {
  license: License
  trigger?: React.ReactNode
}

export function EditLicenseDialog({ license, trigger }: EditLicenseDialogProps) {
  const [open, setOpen] = useState(false)
  const [expiryUnit, setExpiryUnit] = useState("days")
  const [duration, setDuration] = useState("30")
  const updateLicense = useUpdateLicense()

  // Defensive check to prevent crashes
  if (!license || !license._id) {
    console.error('EditLicenseDialog: Invalid license data', license)
    return null
  }

  const expiryUnits = [
    { value: "hours", label: "Hours" },
    { value: "days", label: "Days" },
    { value: "months", label: "Months" },
  ]

  const calculateNewExpiryDate = () => {
    const now = new Date()
    const durationNum = parseInt(duration)
    
    switch (expiryUnit) {
      case "hours":
        now.setHours(now.getHours() + durationNum)
        break
      case "days":
        now.setDate(now.getDate() + durationNum)
        break
      case "months":
        now.setMonth(now.getMonth() + durationNum)
        break
    }
    
    return now.toLocaleDateString()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!duration || parseInt(duration) <= 0) {
      return
    }

    if (!license._id) {
      console.error('EditLicenseDialog: Missing license ID')
      return
    }

    const newExpiryDate = new Date()
    const durationNum = parseInt(duration)
    
    switch (expiryUnit) {
      case "hours":
        newExpiryDate.setHours(newExpiryDate.getHours() + durationNum)
        break
      case "days":
        newExpiryDate.setDate(newExpiryDate.getDate() + durationNum)
        break
      case "months":
        newExpiryDate.setMonth(newExpiryDate.getMonth() + durationNum)
        break
    }

    updateLicense.mutate(
      {
        licenseId: license._id,
        data: { expiresAt: newExpiryDate.toISOString() }
      },
      {
        onSuccess: () => {
          setOpen(false)
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Expiry
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Edit License Expiry
          </DialogTitle>
          <DialogDescription>
            Update the expiry date for license {license.key ? license.key.substring(0, 16) : 'Unknown'}...
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Current License</Label>
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-medium text-sm">{license.key ? license.key.substring(0, 16) : 'Unknown'}...</p>
                <p className="text-sm text-muted-foreground">{typeof license.app === 'string' ? 'Unknown App' : license.app?.name || 'Unknown App'}</p>
                <p className="text-xs text-muted-foreground">
                  Current expiry: {license.expiresAt ? format(new Date(license.expiresAt), 'MMM dd, yyyy') : 'Unknown'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiryUnit">Extend By Unit *</Label>
                <Select value={expiryUnit} onValueChange={setExpiryUnit} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {expiryUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  placeholder="Duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
            </div>

            {duration && parseInt(duration) > 0 && (
              <div className="grid gap-2">
                <Label>New Expiry Date</Label>
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium text-primary">
                    {calculateNewExpiryDate()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Extended by {duration} {expiryUnit}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateLicense.isPending}>
              {updateLicense.isPending ? "Updating..." : "Update Expiry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}