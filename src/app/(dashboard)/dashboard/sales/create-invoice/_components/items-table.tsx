import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { InvoiceItem } from '@/app/(dashboard)/dashboard/sales/create-invoice/page';

interface ItemsTableProps {
    items: InvoiceItem[];
    onItemsChange: (items: InvoiceItem[]) => void;
    quickEntry: boolean;
}

// Mock items data
const mockItems = [
    { id: '1', name: 'AEROCORT ROTACAPS 30\'S', unit: 'PAC', mrp: 256, price: 204, taxRate: 12 },
    { id: '2', name: 'AMLOKIND-AT 10\'S TAB', unit: 'NONE', mrp: 25.58, price: 18.93, taxRate: 12 },
    { id: '3', name: '10ML DISPO VAN SYRINGE', unit: 'NONE', mrp: 0, price: 0, taxRate: 12 },
    { id: '4', name: '2ML DISPO VAN', unit: 'NONE', mrp: 2.05, price: 0, taxRate: 12 },
    { id: '5', name: '2ML SYRINGE ROMOJET', unit: 'NONE', mrp: 2, price: 0, taxRate: 12 }
];

const units = ['NONE', 'PAC', 'BOX', 'BOTTLE', 'STRIP', 'TABLET'];
const taxRates = [0, 5, 12, 18, 28];

export function ItemsTable({ items, onItemsChange, quickEntry }: ItemsTableProps) {
    const [quickEntryItem, setQuickEntryItem] = useState<Partial<InvoiceItem>>({
        itemName: '',
        quantity: 1,
        freeQuantity: 0,
        unit: 'NONE',
        discountPercent: 0,
        taxPercent: 12
    });

    const calculateItemTotal = (item: Partial<InvoiceItem>) => {
        const qty = item.quantity || 0;
        const price = item.pricePerUnit || 0;
        const discountPercent = item.discountPercent || 0;
        const taxPercent = item.taxPercent || 0;

        const subtotal = qty * price;
        const discountAmount = (subtotal * discountPercent) / 100;
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = (taxableAmount * taxPercent) / 100;
        const amount = taxableAmount + taxAmount;

        return {
            discountAmount,
            taxAmount,
            amount
        };
    };

    const addItem = (itemData: Partial<InvoiceItem>) => {
        const calculated = calculateItemTotal(itemData);
        const newItem: InvoiceItem = {
            // amazonq-ignore-next-line
            id: Date.now().toString(),
            itemName: itemData.itemName || '',
            expiryDate: itemData.expiryDate || null,
            mrp: itemData.mrp || 0,
            quantity: itemData.quantity || 0,
            freeQuantity: itemData.freeQuantity || 0,
            unit: itemData.unit || 'NONE',
            pricePerUnit: itemData.pricePerUnit || 0,
            discountPercent: itemData.discountPercent || 0,
            discountAmount: calculated.discountAmount,
            taxPercent: itemData.taxPercent || 0,
            taxAmount: calculated.taxAmount,
            amount: calculated.amount
        };

        onItemsChange([...items, newItem]);
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };

        // Recalculate totals
        // amazonq-ignore-next-line
        const calculated = calculateItemTotal(updatedItems[index]);
        updatedItems[index] = {
            ...updatedItems[index],
            discountAmount: calculated.discountAmount,
            taxAmount: calculated.taxAmount,
            amount: calculated.amount
        };

        onItemsChange(updatedItems);
    };

    const removeItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        onItemsChange(updatedItems);
    };

    const handleQuickEntrySubmit = () => {
        if (quickEntryItem.itemName && quickEntryItem.quantity && quickEntryItem.pricePerUnit) {
            addItem(quickEntryItem);
            setQuickEntryItem({
                itemName: '',
                quantity: 1,
                freeQuantity: 0,
                unit: 'NONE',
                discountPercent: 0,
                taxPercent: 12
            });
        }
    };

    const selectItemFromMaster = (itemName: string) => {
        // amazonq-ignore-next-line
        const masterItem = mockItems.find(item => item.name === itemName);
        if (masterItem) {
            setQuickEntryItem({
                ...quickEntryItem,
                itemName: masterItem.name,
                mrp: masterItem.mrp,
                pricePerUnit: masterItem.price,
                unit: masterItem.unit,
                taxPercent: masterItem.taxRate
            });
        }
    };

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                    <ShoppingCart className="h-4 w-4" />
                    Items
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2 text-sm font-medium">#</th>
                                <th className="text-left p-2 text-sm font-medium min-w-[200px]">ITEM</th>
                                <th className="text-left p-2 text-sm font-medium">EXP. DATE</th>
                                <th className="text-left p-2 text-sm font-medium">MRP</th>
                                <th className="text-left p-2 text-sm font-medium">QTY</th>
                                <th className="text-left p-2 text-sm font-medium">FREE QTY</th>
                                <th className="text-left p-2 text-sm font-medium">UNIT</th>
                                <th className="text-left p-2 text-sm font-medium">PRICE/UNIT</th>
                                <th className="text-left p-2 text-sm font-medium">DISCOUNT %</th>
                                <th className="text-left p-2 text-sm font-medium">TAX %</th>
                                <th className="text-left p-2 text-sm font-medium">AMOUNT</th>
                                <th className="text-left p-2 text-sm font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {quickEntry && (
                                <tr className="border-b bg-invoice-primary-light">
                                    <td className="p-2">
                                        <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded text-xs">
                                            ⚡
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <Select
                                            value={quickEntryItem.itemName}
                                            onValueChange={(value) => selectItemFromMaster(value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select item..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mockItems.map((item) => (
                                                    <SelectItem key={item.id} value={item.name}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <CalendarIcon className="h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={quickEntryItem.expiryDate || undefined}
                                                    onSelect={(date) => setQuickEntryItem({ ...quickEntryItem, expiryDate: date || null })}
                                                    className="pointer-events-auto"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </td>
                                    <td className="p-2">
                                        <Input
                                            type="number"
                                            value={quickEntryItem.mrp || ''}
                                            onChange={(e) => setQuickEntryItem({ ...quickEntryItem, mrp: parseFloat(e.target.value) || 0 })}
                                            className="w-20"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <Input
                                            type="number"
                                            value={quickEntryItem.quantity || ''}
                                            // amazonq-ignore-next-line
                                            onChange={(e) => setQuickEntryItem({ ...quickEntryItem, quantity: parseInt(e.target.value) || 0 })}
                                            className="w-16"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <Input
                                            type="number"
                                            value={quickEntryItem.freeQuantity || ''}
                                            onChange={(e) => setQuickEntryItem({ ...quickEntryItem, freeQuantity: parseInt(e.target.value) || 0 })}
                                            className="w-16"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <Select
                                            value={quickEntryItem.unit}
                                            onValueChange={(value) => setQuickEntryItem({ ...quickEntryItem, unit: value })}
                                        >
                                            <SelectTrigger className="w-20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {units.map((unit) => (
                                                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-2">
                                        <Input
                                            type="number"
                                            value={quickEntryItem.pricePerUnit || ''}
                                            onChange={(e) => setQuickEntryItem({ ...quickEntryItem, pricePerUnit: parseFloat(e.target.value) || 0 })}
                                            className="w-20"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <Input
                                            type="number"
                                            value={quickEntryItem.discountPercent || ''}
                                            onChange={(e) => setQuickEntryItem({ ...quickEntryItem, discountPercent: parseFloat(e.target.value) || 0 })}
                                            className="w-16"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <Select
                                            value={quickEntryItem.taxPercent?.toString()}
                                            onValueChange={(value) => setQuickEntryItem({ ...quickEntryItem, taxPercent: parseFloat(value) })}
                                        >
                                            <SelectTrigger className="w-16">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {taxRates.map((rate) => (
                                                    <SelectItem key={rate} value={rate.toString()}>{rate}%</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-2">
                                        <div className="text-right font-medium">
                                            ₹{calculateItemTotal(quickEntryItem).amount.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <Button
                                            size="sm"
                                            onClick={handleQuickEntrySubmit}
                                            disabled={!quickEntryItem.itemName || !quickEntryItem.quantity}
                                            className="bg-primary hover:bg-primary/90"
                                        >
                                            ✓
                                        </Button>
                                    </td>
                                </tr>
                            )}

                            {items.map((item, index) => (
                                <tr key={item.id} className="border-b hover:bg-muted/50">
                                    <td className="p-2 text-sm">{index + 1}</td>
                                    <td className="p-2 text-sm">{item.itemName}</td>
                                    <td className="p-2 text-sm">
                                        {item.expiryDate ? format(item.expiryDate, 'MM/yyyy') : '-'}
                                    </td>
                                    <td className="p-2 text-sm">{item.mrp}</td>
                                    <td className="p-2">
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                            className="w-16 text-sm"
                                        />
                                    </td>
                                    <td className="p-2 text-sm">{item.freeQuantity || 0}</td>
                                    <td className="p-2 text-sm">{item.unit}</td>
                                    <td className="p-2">
                                        <Input
                                            type="number"
                                            value={item.pricePerUnit}
                                            onChange={(e) => updateItem(index, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                                            className="w-20 text-sm"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <Input
                                            type="number"
                                            value={item.discountPercent}
                                            onChange={(e) => updateItem(index, 'discountPercent', parseFloat(e.target.value) || 0)}
                                            className="w-16 text-sm"
                                        />
                                    </td>
                                    <td className="p-2 text-sm">{item.taxPercent}%</td>
                                    <td className="p-2 text-sm text-right font-medium">₹{item.amount.toFixed(2)}</td>
                                    <td className="p-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeItem(index)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <Button
                        variant="outline"
                        onClick={() => addItem({
                            itemName: '',
                            quantity: 1,
                            freeQuantity: 0,
                            unit: 'NONE',
                            pricePerUnit: 0,
                            discountPercent: 0,
                            taxPercent: 12
                        })}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        ADD ROW
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Total items: {items.length}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};