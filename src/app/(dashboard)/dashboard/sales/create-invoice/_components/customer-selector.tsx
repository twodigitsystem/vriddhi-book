import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, User, MapPin, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Customer } from '@/app/(dashboard)/dashboard/sales/create-invoice/page';

interface CustomerSelectorProps {
    selectedCustomer: Customer | null;
    onCustomerSelect: (customer: Customer | null) => void;
    showShippingAddress: boolean;
    billingAddress?: string;
    shippingAddress?: string;
    onBillingAddressChange?: (address: string) => void;
    onShippingAddressChange?: (address: string) => void;
}

// Mock customer data
const mockCustomers: Customer[] = [
    {
        id: '1',
        name: 'DR. PRADIP SAMUI',
        phone: '9833234567',
        address: 'BORJO',
        balance: 178407
    },
    {
        id: '2',
        name: 'MAA CHANDI MEDICO',
        phone: '9833765432',
        address: 'GOURHATI BAZAR',
        balance: 265587
    },
    {
        id: '3',
        name: 'ANNAPURNA DISPENCERY',
        phone: '9833876543',
        address: 'Medical Center Road',
        balance: 32936
    },
    {
        id: '4',
        name: 'BEERA MEDICAL',
        phone: '9833987654',
        address: 'Hospital Street',
        balance: 15935
    }
];

export function CustomerSelector({
    selectedCustomer,
    onCustomerSelect,
    showShippingAddress,
    billingAddress: externalBillingAddress,
    shippingAddress: externalShippingAddress,
    onBillingAddressChange,
    onShippingAddressChange
}: CustomerSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');

    // Update billing address when customer changes or external prop changes
    React.useEffect(() => {
        const newAddress = externalBillingAddress ?? selectedCustomer?.address ?? '';
        setBillingAddress(newAddress);
    }, [selectedCustomer, externalBillingAddress]);

    // Update shipping address when external prop changes
    React.useEffect(() => {
        setShippingAddress(externalShippingAddress ?? '');
    }, [externalShippingAddress]);

    const handleBillingAddressChange = (address: string) => {
        setBillingAddress(address);
        onBillingAddressChange?.(address);
    };

    const handleShippingAddressChange = (address: string) => {
        setShippingAddress(address);
        onShippingAddressChange?.(address);
    };

    const filteredCustomers = mockCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    const handleCustomerSelect = (customerId: string) => {
        const customer = mockCustomers.find(c => c.id === customerId);
        onCustomerSelect(customer || null);
    };

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4" />
                    Customer Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="customer">Customer *</Label>
                    <div className="flex gap-2">
                        <Select onValueChange={handleCustomerSelect} value={selectedCustomer?.id || ''}>
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Search by Name/Phone" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <Input
                                        placeholder="Search customers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="mb-2"
                                    />
                                </div>
                                {filteredCustomers.map((customer) => (
                                    <SelectItem key={customer.id} value={customer.id}>
                                        <div className="flex justify-between items-start w-full">
                                            <div className="flex-1">
                                                <div className="font-medium">{customer.name}</div>
                                                <div className="text-xs text-muted-foreground">{customer.phone}</div>
                                            </div>
                                            <span className="text-xs font-medium text-green-600 ml-3">
                                                ₹{customer.balance.toLocaleString()}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {selectedCustomer && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Balance:</span>
                            <span className="font-medium text-green-600">
                                ₹{selectedCustomer.balance.toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Address Section */}
                <div className="space-y-4 mt-6 pt-4 border-t">
                    <div className="flex items-center gap-2 text-base font-medium">
                        <MapPin className="h-4 w-4" />
                        Address Details
                    </div>

                    <div className={cn(
                        "grid gap-4",
                        showShippingAddress ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                    )}>
                        {/* Billing Address */}
                        <div className="space-y-2">
                            <Label htmlFor="billing-address">Billing Address *</Label>
                            <Textarea
                                id="billing-address"
                                value={billingAddress}
                                onChange={(e) => handleBillingAddressChange(e.target.value)}
                                placeholder="Enter billing address"
                                className="min-h-[80px] resize-none"
                            />
                        </div>

                        {/* Shipping Address - Conditional */}
                        {showShippingAddress && (
                            <div className="space-y-2">
                                <Label htmlFor="shipping-address" className="flex items-center gap-2">
                                    <Truck className="h-4 w-4" />
                                    Shipping Address
                                </Label>
                                <Textarea
                                    id="shipping-address"
                                    value={shippingAddress}
                                    onChange={(e) => handleShippingAddressChange(e.target.value)}
                                    placeholder="Enter shipping address (leave blank to use billing address)"
                                    className="min-h-[80px] resize-none"
                                />
                            </div>
                        )}
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};