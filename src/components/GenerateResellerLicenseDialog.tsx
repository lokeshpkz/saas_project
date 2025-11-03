import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useResellerLicenses } from '@/hooks/useResellerLicenses';
import { useResellerAuth } from '@/contexts/ResellerAuthContext';
import { toast } from 'sonner';
import { CreateResellerLicenseRequest } from '@/lib/api';

export function GenerateResellerLicenseDialog() {
    const { createLicenses } = useResellerLicenses();
    const { reseller, fetchResellerProfile } = useResellerAuth();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateResellerLicenseRequest>({
        count: 1,
        date_expired: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const success = await createLicenses(formData);
            if (success) {
                // Refresh reseller profile to update remaining licenses
                await fetchResellerProfile();
                setFormData({
                    count: 1,
                    date_expired: '',
                });
                setOpen(false);
                toast.success("Licenses generated successfully!");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof CreateResellerLicenseRequest, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const remainingLicenses = reseller?.remaining_licenses || 0;
    // Remove the artificial 10-license limit and use the actual remaining licenses
    const maxCount = remainingLicenses;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2" disabled={remainingLicenses <= 0}>
                    <Plus className="h-4 w-4" />
                    Generate License
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Generate License Keys</DialogTitle>
                    <DialogDescription>
                        Create new license keys for your clients. You have {remainingLicenses} licenses remaining.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="count">Number of Licenses</Label>
                            <Input
                                id="count"
                                type="number"
                                min="1"
                                max={maxCount}
                                value={formData.count}
                                onChange={(e) => handleInputChange('count', parseInt(e.target.value) || 1)}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Maximum: {maxCount} licenses
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date_expired">Expiration Date</Label>
                            <Input
                                id="date_expired"
                                type="date"
                                value={formData.date_expired}
                                onChange={(e) => handleInputChange('date_expired', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                When should these licenses expire?
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || remainingLicenses <= 0}>
                            {loading ? 'Generating...' : 'Generate Licenses'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}