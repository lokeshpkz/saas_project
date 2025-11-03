import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateApp } from '@/hooks/useApps';
import { App, UpdateAppRequest } from '@/lib/api';

interface EditAppDialogProps {
    app: App | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditAppDialog({ app, open, onOpenChange }: EditAppDialogProps) {
    const updateApp = useUpdateApp();
    const [formData, setFormData] = useState<UpdateAppRequest>({
        name: '',
        version: '',
    });

    useEffect(() => {
        if (app) {
            setFormData({
                name: app.name,
                version: app.version,
            });
        }
    }, [app]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!app) return;

        updateApp.mutate({ appId: app._id, data: formData }, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    };

    const handleInputChange = (field: keyof UpdateAppRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!app) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit App</DialogTitle>
                    <DialogDescription>
                        Update the application details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_app_name">App Name</Label>
                            <Input
                                id="edit_app_name"
                                value={formData.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter app name"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_app_version">App Version</Label>
                            <Input
                                id="edit_app_version"
                                value={formData.version || ''}
                                onChange={(e) => handleInputChange('version', e.target.value)}
                                placeholder="e.g., 1.0.0"
                                pattern="^\d+\.\d+\.\d+$"
                                title="Version must be in format x.y.z (e.g., 1.0.0)"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_app_id">App ID</Label>
                            <Input
                                id="edit_app_id"
                                value={app?.appId || ''}
                                placeholder="Unique app identifier"
                                readOnly
                                className="bg-muted cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">
                                App ID cannot be changed after creation
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={updateApp.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateApp.isPending}>
                            {updateApp.isPending ? 'Updating...' : 'Update App'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}