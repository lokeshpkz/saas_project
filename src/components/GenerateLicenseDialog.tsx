import { useState, useEffect } from "react"
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
import { Plus, Loader2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

interface GenerateLicenseDialogProps {
  trigger?: React.ReactNode
}

export function GenerateLicenseDialog({ trigger }: GenerateLicenseDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("1")
  const [application, setApplication] = useState("")
  const [expiryUnit, setExpiryUnit] = useState("days")
  const [duration, setDuration] = useState("30")

  const queryClient = useQueryClient()

  // Fetch user's apps
  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      const response = await apiClient.getApps()
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch apps')
      }
      return response.data
    },
    enabled: open, // Only fetch when dialog is open
  })

  // Extract apps array from the response
  const apps = appsData?.apps || []

  // Create licenses mutation
  const createLicenses = useMutation({
    mutationFn: async ({ appId, count, expiresAt }: { appId: string; count: number; expiresAt: string }) => {
      // Create multiple licenses
      const licenses = []
      for (let i = 0; i < count; i++) {
        const response = await apiClient.createLicense({ app: appId, expiresAt })
        if (!response.success) {
          throw new Error('Failed to create license')
        }
        licenses.push(response.data?.license)
      }
      return licenses
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      // Force immediate refetch
      queryClient.refetchQueries({ queryKey: ['licenses'] })
      toast.success('Licenses Generated', {
        description: `Successfully generated ${data.length} license(s).`,
      })
      setOpen(false)
      // Reset form
      setAmount("1")
      setApplication("")
      setExpiryUnit("days")
      setDuration("30")
    },
    onError: (error: any) => {
      toast.error('Generation Failed', {
        description: error.message || 'Failed to generate licenses.',
      })
    },
  })

  const expiryUnits = [
    { value: "hours", label: "Hours" },
    { value: "days", label: "Days" },
    { value: "months", label: "Months" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !application || !expiryUnit || !duration) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields.",
      })
      return
    }

    // Calculate expiry date
    const expiryDate = new Date()
    const durationNum = parseInt(duration)

    switch (expiryUnit) {
      case "hours":
        expiryDate.setHours(expiryDate.getHours() + durationNum)
        break
      case "days":
        expiryDate.setDate(expiryDate.getDate() + durationNum)
        break
      case "months":
        expiryDate.setMonth(expiryDate.getMonth() + durationNum)
        break
    }

    createLicenses.mutate({
      appId: application,
      count: parseInt(amount),
      expiresAt: expiryDate.toISOString()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-glow">
            <Plus className="w-4 h-4 mr-2" />
            Generate License
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate New License</DialogTitle>
          <DialogDescription>
            Create new license keys for your applications.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                max="100"
                placeholder="Number of licenses to generate"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="application">Application *</Label>
              {appsLoading ? (
                <div className="flex items-center gap-2 p-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading apps...</span>
                </div>
              ) : (
                <Select value={application} onValueChange={setApplication} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select application" />
                  </SelectTrigger>
                  <SelectContent>
                    {apps && apps.length > 0 ? (
                      apps.map((app: any) => (
                        <SelectItem key={app._id} value={app._id}>
                          {app.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1 text-sm text-muted-foreground">
                        No apps available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              )}
              {apps && apps.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  You need to create an app first before generating licenses.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiryUnit">Expiry Unit *</Label>
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
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createLicenses.isPending || !apps || apps.length === 0}
            >
              {createLicenses.isPending ? "Generating..." : "Generate License"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}