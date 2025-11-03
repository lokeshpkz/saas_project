import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Package, Plus } from "lucide-react"
import { ReactNode } from "react"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = ""
}: EmptyStateProps) {
  return (
    <Card className={`border-dashed border-2 ${className}`}>
      <CardContent className="flex flex-col items-center justify-center text-center py-12 px-6">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          {icon || <Package className="w-8 h-8 text-muted-foreground" />}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {actionLabel && onAction && (
            <Button onClick={onAction} className="gap-2">
              <Plus className="h-4 w-4" />
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface NoAppEmptyStateProps {
  onCreateApp: () => void
  className?: string
}

export function NoAppEmptyState({ onCreateApp, className = "" }: NoAppEmptyStateProps) {
  return (
    <EmptyState
      icon={<Package className="w-8 h-8 text-muted-foreground" />}
      title="No Application Created"
      description="You need to create an application first before you can manage licenses, resellers, and users. Your app will serve as the foundation for your licensing system."
      actionLabel="Create Your First App"
      onAction={onCreateApp}
      secondaryActionLabel="Learn More"
      onSecondaryAction={() => window.open('https://docs.example.com/getting-started', '_blank')}
      className={className}
    />
  )
}