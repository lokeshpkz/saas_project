import React, { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { App, apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { Settings, MessageSquare, Loader2, Info } from 'lucide-react';

interface AppSettingsDialogProps {
    app: App | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface ErrorMessages {
    appDisabled: string;
    usernameTaken: string;
    keyNotFound: string;
    keyUsed: string;
    usernameNotFound: string;
    passMismatch: string;
    hwidMismatch: string;
    noActiveSubs: string;
    hwidBlacklisted: string;
    pausedSub: string;
    vpnBlocked: string;
    keyBanned: string;
    userBanned: string;
    sessionUnauthed: string;
    hashCheckFail: string;
    loggedInMsg: string;
    pausedApp: string;
    unTooShort: string;
    pwLeaked: string;
}

const defaultErrorMessages: ErrorMessages = {
    appDisabled: "Application is currently disabled",
    usernameTaken: "Username is already taken",
    keyNotFound: "License key not found",
    keyUsed: "License key is already in use",
    usernameNotFound: "Username not found",
    passMismatch: "Password does not match",
    hwidMismatch: "Hardware ID mismatch",
    noActiveSubs: "No active subscription found",
    hwidBlacklisted: "Hardware ID is blacklisted",
    pausedSub: "Subscription is paused",
    vpnBlocked: "VPN usage is not allowed",
    keyBanned: "License key is banned",
    userBanned: "User account is banned",
    sessionUnauthed: "Session is not authenticated",
    hashCheckFail: "Hash verification failed",
    loggedInMsg: "Successfully logged in",
    pausedApp: "Application is currently paused",
    unTooShort: "Username is too short",
    pwLeaked: "Password has been compromised"
};

export function AppSettingsDialog({ app, open, onOpenChange, onSuccess }: AppSettingsDialogProps) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        hwidLock: true,
        allowCustomLicenseKey: false
    });
    const [errorMessages, setErrorMessages] = useState<ErrorMessages>(defaultErrorMessages);

    // Load app settings and error messages when dialog opens
    useEffect(() => {
        if (app && open) {
            loadAppData();
        }
    }, [app, open]);

    const loadAppData = async () => {
        if (!app) return;
        
        setLoading(true);
        try {
            // Load app settings from the app object
            setSettings({
                hwidLock: app.settings?.hwidLock ?? true,
                allowCustomLicenseKey: app.settings?.allowCustomLicenseKey ?? false
            });

            // Load error messages from API
            const response = await apiClient.getAppErrorMessages(app._id);
            if (response.success && response.data) {
                setErrorMessages({ ...defaultErrorMessages, ...response.data.errorMessages });
            }
        } catch (error) {
            console.error('Failed to load app data:', error);
            toast.error('Failed to load app settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        if (!app) return;
        
        setSaving(true);
        try {
            // Update app settings
            await apiClient.updateApp(app._id, { settings });
            
            toast.success('App settings updated successfully');
            onSuccess?.();
        } catch (error: any) {
            console.error('Failed to update app settings:', error);
            toast.error(error.message || 'Failed to update app settings');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveErrorMessages = async () => {
        if (!app) return;
        
        setSaving(true);
        try {
            // Update error messages
            await apiClient.updateAppErrorMessages(app._id, errorMessages);
            
            toast.success('Error messages updated successfully');
            onSuccess?.();
        } catch (error: any) {
            console.error('Failed to update error messages:', error);
            toast.error(error.message || 'Failed to update error messages');
        } finally {
            setSaving(false);
        }
    };

    const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleErrorMessageChange = (key: keyof ErrorMessages, value: string) => {
        setErrorMessages(prev => ({ ...prev, [key]: value }));
    };

    const resetErrorMessages = () => {
        setErrorMessages(defaultErrorMessages);
        toast.info('Error messages reset to defaults');
    };

    if (!app) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        App Settings - {app.name}
                    </DialogTitle>
                    <DialogDescription>
                        Configure application settings and customize error messages
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Loading app settings...
                    </div>
                ) : (
                    <Tabs defaultValue="settings" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="settings" className="flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                Settings
                            </TabsTrigger>
                            <TabsTrigger value="messages" className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Error Messages
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="settings" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Application Settings</CardTitle>
                                    <CardDescription>
                                        Configure security and functionality settings for your application
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label className="text-sm font-medium">Hardware ID Lock</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Require hardware ID verification for license validation
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.hwidLock}
                                            onCheckedChange={(checked) => handleSettingChange('hwidLock', checked)}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label className="text-sm font-medium">Allow Custom License Keys</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Allow custom license key format instead of auto-generated ones
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.allowCustomLicenseKey}
                                            onCheckedChange={(checked) => handleSettingChange('allowCustomLicenseKey', checked)}
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <Button onClick={handleSaveSettings} disabled={saving}>
                                            {saving ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Settings'
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="messages" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg">Error Messages</CardTitle>
                                            <CardDescription>
                                                Customize error messages displayed to your users
                                            </CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={resetErrorMessages}>
                                            Reset to Defaults
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(errorMessages).map(([key, value]) => (
                                            <div key={key} className="space-y-2">
                                                <Label className="text-sm font-medium capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </Label>
                                                <Textarea
                                                    value={value}
                                                    onChange={(e) => handleErrorMessageChange(key as keyof ErrorMessages, e.target.value)}
                                                    placeholder={`Enter custom message for ${key}`}
                                                    className="min-h-[60px] text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4">
                                        <Button onClick={handleSaveErrorMessages} disabled={saving}>
                                            {saving ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Error Messages'
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    );
}