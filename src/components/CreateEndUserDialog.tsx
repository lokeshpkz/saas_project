import React, { useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { User, Lock, Smartphone, Monitor, CalendarIcon, Calendar as CalendarIconLucide } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CreateEndUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    username: string
    password: string
    appId: string
    hwid?: string | null
    expiresAt: string
  }) => void
  apps: Array<{ _id: string; name: string }>
  isLoading?: boolean
}

export const CreateEndUserDialog: React.FC<CreateEndUserDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  apps,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    appId: "",
    hwid: "",
  })
  const [expiryDate, setExpiryDate] = useState<Date>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username || !formData.password || !formData.appId || !expiryDate) {
      return
    }

    onSubmit({
      ...formData,
      hwid: formData.hwid || null, // Send null if empty
      expiresAt: expiryDate.toISOString(),
    })
  }

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      appId: "",
      hwid: "",
    })
    setExpiryDate(undefined)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Create End User
          </DialogTitle>
          <DialogDescription>
            Create a new end user account directly without requiring a license key. 
            Set the expiry date and hardware ID as needed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter username (min 3 characters)"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                minLength={3}
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password (min 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                minLength={6}
                required
              />
            </div>

            {/* Application Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Application
              </Label>
              <Select
                value={formData.appId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, appId: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an application" />
                </SelectTrigger>
                <SelectContent>
                  {apps.map((app) => (
                    <SelectItem key={app._id} value={app._id}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* HWID Field */}
            <div className="space-y-2">
              <Label htmlFor="hwid" className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Hardware ID (Optional)
              </Label>
              <Input
                id="hwid"
                placeholder="Enter hardware ID (leave empty for null)"
                value={formData.hwid}
                onChange={(e) => setFormData(prev => ({ ...prev, hwid: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to allow the user to login from any device (recommended)
              </p>
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIconLucide className="w-4 h-4" />
                Expiry Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "PPP") : "Pick expiry date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.username ||
                !formData.password ||
                !formData.appId ||
                !expiryDate ||
                formData.username.length < 3 ||
                formData.password.length < 6
              }
            >
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}