import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
    Settings,
    Zap,
    Link,
    Eye,
    EyeOff,
    Truck,
    Calendar,
    DollarSign,
    Printer
} from 'lucide-react';

interface SettingsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quickEntry: boolean;
    linkPayment: boolean;
    showShippingAddress: boolean;
    onQuickEntryChange: (enabled: boolean) => void;
    onLinkPaymentChange: (enabled: boolean) => void;
    onShowShippingAddressChange: (enabled: boolean) => void;
}

export function SettingsSheet({
    open,
    onOpenChange,
    quickEntry,
    linkPayment,
    showShippingAddress,
    onQuickEntryChange,
    onLinkPaymentChange,
    onShowShippingAddressChange
}: SettingsSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-80">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Settings
                    </SheetTitle>
                    <SheetDescription>
                        Configure your invoice settings and display options.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Entry Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-foreground">Entry Options</h3>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                <Label htmlFor="quick-entry" className="text-sm">
                                    Quick Entry Row
                                </Label>
                            </div>
                            <Switch
                                id="quick-entry"
                                checked={quickEntry}
                                onCheckedChange={onQuickEntryChange}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Link className="h-4 w-4 text-primary" />
                                <Label htmlFor="link-payment" className="text-sm">
                                    Link Payment
                                </Label>
                            </div>
                            <Switch
                                id="link-payment"
                                checked={linkPayment}
                                onCheckedChange={onLinkPaymentChange}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Display Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-foreground">Display Options</h3>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-primary" />
                                <Label htmlFor="shipping-address" className="text-sm">
                                    Shipping Address
                                </Label>
                            </div>
                            <Switch
                                id="shipping-address"
                                checked={showShippingAddress}
                                onCheckedChange={onShowShippingAddressChange}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Column Visibility */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-foreground">Table Columns</h3>

                        <div className="space-y-3">
                            {[
                                { label: 'Expiry Date', id: 'expiry-date', checked: true },
                                { label: 'MRP', id: 'mrp', checked: true },
                                { label: 'Free Quantity', id: 'free-qty', checked: true },
                                { label: 'Unit', id: 'unit', checked: true },
                                { label: 'Discount %', id: 'discount', checked: true },
                                { label: 'Tax %', id: 'tax', checked: true }
                            ].map((column) => (
                                <div key={column.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {column.checked ? (
                                            <Eye className="h-4 w-4 text-primary" />
                                        ) : (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <Label htmlFor={column.id} className="text-sm">
                                            {column.label}
                                        </Label>
                                    </div>
                                    <Switch
                                        id={column.id}
                                        checked={column.checked}
                                        onCheckedChange={() => { }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Advanced Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-foreground">Advanced</h3>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Payment Terms & Due Dates</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span>Additional Charges</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Printer className="h-4 w-4" />
                                <span>Print Settings</span>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};