import React, { useState } from 'react';
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
import { useCreateApp } from '@/hooks/useApps';
import { CreateAppRequest } from '@/lib/api';

interface AddAppDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddAppDialog({ open, onOpenChange }: AddAppDialogProps) {
    const createApp = useCreateApp();
    const [formData, setFormData] = useState<CreateAppRequest>({
        name: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        createApp.mutate(formData, {
            onSuccess: () => {
                setFormData({
                    name: '',
                });
                onOpenChange(false);
            }
        });
    };

    const handleInputChange = (field: keyof CreateAppRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New App</DialogTitle>
                    <DialogDescription>
                        Create a new application. App ID, App Secret, and version will be generated automatically.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">App Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter app name"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                A friendly name for your application
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-muted/50 border">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <span className="text-sm font-medium">Auto-Generated</span>
                                </div>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <p>• <strong>App ID:</strong> Unique 8-character identifier</p>
                                    <p>• <strong>App Secret:</strong> 32-character secret key</p>
                                    <p>• <strong>Version:</strong> Starts at 1.0.0</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={createApp.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createApp.isPending}>
                            {createApp.isPending ? 'Creating...' : 'Create App'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}