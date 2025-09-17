import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus, ShoppingCart, Trash2, Search } from 'lucide-react';
import { InvoiceItem } from '@/app/(dashboard)/dashboard/sales/create-invoice/page';
import { AiFillThunderbolt } from 'react-icons/ai';
import { FaRunning } from 'react-icons/fa';

interface ItemsTableProps {
    items: InvoiceItem[];
    onItemsChange: (items: InvoiceItem[]) => void;
    quickEntry: boolean;
}

// Enhanced mock items with more details
const mockItems = [
    {
        id: '1',
        name: 'AEROCORT ROTACAPS 30\'S',
        unit: 'PAC',
        mrp: 256,
        salePrice: 204,
        purchasePrice: 180,
        stock: 25,
        location: 'A-01',
        taxRate: 12
    },
    {
        id: '6',
        name: 'AEROCORT ROTACAPS 30\'S',
        unit: 'PAC',
        mrp: 256,
        salePrice: 204,
        purchasePrice: 180,
        stock: 25,
        location: 'A-01',
        taxRate: 12
    },
    {
        id: '7',
        name: 'AEROCORT ROTACAPS 30\'S',
        unit: 'PAC',
        mrp: 256,
        salePrice: 204,
        purchasePrice: 180,
        stock: 25,
        location: 'A-01',
        taxRate: 12
    },
    {
        id: '8',
        name: 'AEROCORT ROTACAPS 30\'S',
        unit: 'PAC',
        mrp: 256,
        salePrice: 204,
        purchasePrice: 180,
        stock: 25,
        location: 'A-01',
        taxRate: 12
    },
    {
        id: '9',
        name: 'AEROCORT ROTACAPS 30\'S',
        unit: 'PAC',
        mrp: 256,
        salePrice: 204,
        purchasePrice: 180,
        stock: 25,
        location: 'A-01',
        taxRate: 12
    },
    {
        id: '10',
        name: 'AEROCORT ROTACAPS 30\'S',
        unit: 'PAC',
        mrp: 256,
        salePrice: 204,
        purchasePrice: 180,
        stock: 25,
        location: 'A-01',
        taxRate: 12
    },
    {
        id: '11',
        name: 'AEROCORT ROTACAPS 30\'S',
        unit: 'PAC',
        mrp: 256,
        salePrice: 204,
        purchasePrice: 180,
        stock: 25,
        location: 'A-01',
        taxRate: 12
    },
    {
        id: '2',
        name: 'AMLOKIND-AT 10\'S TAB',
        unit: 'STRIP',
        mrp: 25.58,
        salePrice: 18.93,
        purchasePrice: 15.50,
        stock: 150,
        location: 'B-12',
        taxRate: 12
    },
    {
        id: '3',
        name: '10ML DISPO VAN SYRINGE',
        unit: 'PCS',
        mrp: 8.50,
        salePrice: 6.80,
        purchasePrice: 5.20,
        stock: 500,
        location: 'C-05',
        taxRate: 18
    },
    {
        id: '4',
        name: '2ML DISPO VAN',
        unit: 'PCS',
        mrp: 2.05,
        salePrice: 1.65,
        purchasePrice: 1.20,
        stock: 1000,
        location: 'C-06',
        taxRate: 18
    },
    {
        id: '5',
        name: '2ML SYRINGE ROMOJET',
        unit: 'PCS',
        mrp: 2,
        salePrice: 1.60,
        purchasePrice: 1.10,
        stock: 800,
        location: 'C-07',
        taxRate: 18
    }
];

const units = ['NONE', 'PAC', 'BOX', 'BOTTLE', 'STRIP', 'TABLET', 'PCS', 'KG', 'LITRE'];
const taxRates = [0, 5, 12, 18, 28];

export function EnhancedItemsTable({ items, onItemsChange, quickEntry }: ItemsTableProps) {
    const [quickEntryItem, setQuickEntryItem] = useState<Partial<InvoiceItem>>({
        itemName: '',
        quantity: 1,
        freeQuantity: 0,
        unit: 'NONE',
        discountPercent: 0,
        taxPercent: 12
    });

    const [itemSearchTerm, setItemSearchTerm] = useState('');

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
            setItemSearchTerm('');
        }
    };

    const selectItemFromMaster = (itemName: string) => {
        const masterItem = mockItems.find(item => item.name === itemName);
        if (masterItem) {
            setQuickEntryItem({
                ...quickEntryItem,
                itemName: masterItem.name,
                mrp: masterItem.mrp,
                pricePerUnit: masterItem.salePrice,
                unit: masterItem.unit,
                taxPercent: masterItem.taxRate
            });
            setItemSearchTerm(masterItem.name);
        }
    };

    const handleItemSearch = (searchValue: string) => {
        setItemSearchTerm(searchValue);
        setQuickEntryItem({
            ...quickEntryItem,
            itemName: searchValue
        });
    };

    const filteredItems = mockItems.filter(item =>
        item.name.toLowerCase().includes(itemSearchTerm.toLowerCase())
    );

    return (
        <Card>
            <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-base">
                    <ShoppingCart className="h-4 w-4" />
                    Items
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto min-h-72">
                    <table className="w-full border-collapse">
                        <thead className="bg-gradient-to-r from-slate-300 via-stone-400 to-gray-200">
                            <tr className="">
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">#</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700 min-w-[300px]">ITEM</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">EXP. DATE</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">MRP</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">QTY</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">FREE</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">UNIT</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">PRICE</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">DISC %</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">TAX %</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">AMOUNT</th>
                                <th className="w-8 "></th>
                            </tr>
                        </thead>
                        <tbody>
                            {quickEntry && (
                                <tr className="border border-dashed border-green-300 bg-green-50/30 hover:bg-green-50/50">
                                    <td className="p-0.5">
                                        <div className="flex items-center justify-center rounded  ">
                                            <FaRunning className='text-green-500 size-4' />
                                        </div>
                                    </td>
                                    <td className="p-0.5">
                                        <div className="relative">
                                            <Input
                                                value={itemSearchTerm}
                                                onChange={(e) => handleItemSearch(e.target.value)}
                                                placeholder="Search items..."
                                                className="h-8 text-xs pr-8"
                                            />
                                            {/* <Search className="absolute right-2 top-2 h-4 w-4 text-muted-foreground" /> */}
                                            {itemSearchTerm && filteredItems.length > 0 && (
                                                <div className="absolute top-full left-0 -right-24 z-50 bg-white border border-gray-300 mt-2 rounded-md shadow-md max-h-48 overflow-y-auto">
                                                    {filteredItems.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="p-3 hover:bg-blue-100 cursor-pointer border-b last:border-b-0"
                                                            onClick={() => selectItemFromMaster(item.name)}
                                                        >
                                                            <div className="font-medium text-xs">{item.name}</div>
                                                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                                <span>Sale: ₹{item.salePrice}</span>
                                                                <span>Purchase: ₹{item.purchasePrice}</span>
                                                                <span>Stock: {item.stock}</span>
                                                                <span>Loc: {item.location}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-0.5">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-8 w-full text-xs">
                                                    <CalendarIcon className="h-3 w-3" />
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
                                    <td className="p-0.5">
                                        <Input
                                            type="number"
                                            value={quickEntryItem.mrp || ''}
                                            onChange={(e) => setQuickEntryItem({ ...quickEntryItem, mrp: parseFloat(e.target.value) || 0 })}
                                            className="h-8  text-xs"
                                        />
                                    </td>
                                    <td className="p-0.5">
                                        <Input
                                            type="number"
                                            value={quickEntryItem.quantity || ''}
                                            onChange={(e) => setQuickEntryItem({ ...quickEntryItem, quantity: parseInt(e.target.value) || 0 })}
                                            className="h-8  text-xs"
                                        />
                                    </td>
                                    <td className="p-0.5">
                                        <Input
                                            type="number"
                                            value={quickEntryItem.freeQuantity || ''}
                                            onChange={(e) => setQuickEntryItem({ ...quickEntryItem, freeQuantity: parseInt(e.target.value) || 0 })}
                                            className="h-8 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </td>
                                    <td className="p-0.5">
                                        <Select
                                            value={quickEntryItem.unit}
                                            onValueChange={(value) => setQuickEntryItem({ ...quickEntryItem, unit: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {units.map((unit) => (
                                                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-0.5">
                                        <Input
                                            type="number"
                                            inputMode='decimal'
                                            value={quickEntryItem.pricePerUnit || ''}
                                            onChange={(e) => setQuickEntryItem({ ...quickEntryItem, pricePerUnit: parseFloat(e.target.value) || 0 })}
                                            className=" text-xs "

                                        />
                                    </td>
                                    <td className="p-0.5">
                                        <div className="flex gap-1 items-center">
                                            <Input
                                                type="number"
                                                value={quickEntryItem.discountPercent || ''}
                                                onChange={(e) => setQuickEntryItem({ ...quickEntryItem, discountPercent: parseFloat(e.target.value) || 0 })}
                                                className=""
                                            />
                                            {quickEntryItem.discountPercent && quickEntryItem.quantity && quickEntryItem.pricePerUnit && (
                                                <div className="text-xs text-red-600">
                                                    ₹{calculateItemTotal(quickEntryItem).discountAmount.toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-0.5">
                                        <div className="flex gap-1 items-center">
                                            <Select
                                                value={quickEntryItem.taxPercent?.toString()}
                                                onValueChange={(value) => setQuickEntryItem({ ...quickEntryItem, taxPercent: parseFloat(value) })}
                                            >
                                                <SelectTrigger className="h-8  text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {taxRates.map((rate) => (
                                                        <SelectItem key={rate} value={rate.toString()}>{rate}%</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {quickEntryItem.taxPercent && quickEntryItem.quantity && quickEntryItem.pricePerUnit && (
                                                <div className="text-xs text-green-600">
                                                    ₹{calculateItemTotal(quickEntryItem).taxAmount.toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-0.5 ">
                                        <Input className="text-sm font-semibold text-right"
                                            value={`₹${calculateItemTotal(quickEntryItem).amount.toFixed(2)}`}
                                            readOnly
                                        />
                                    </td>
                                    <td className="p-0.5 text-right">
                                        <Button
                                            size="sm"
                                            onClick={handleQuickEntrySubmit}
                                            disabled={!quickEntryItem.itemName || !quickEntryItem.quantity}
                                            className="h-8 w-8 p-0 bg-primary hover:bg-primary/90"
                                        >
                                            ✓
                                        </Button>
                                    </td>
                                </tr>
                            )}

                            {items.map((item, index) => (
                                <tr key={item.id} className="border-b hover:bg-muted/30 group">
                                    <td className="px-2 py-1 text-xs">{index + 1}</td>
                                    <td className="px-2 py-1">
                                        <Input
                                            value={item.itemName}
                                            onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                                            className="h-8 text-xs border-0 bg-transparent hover:bg-background focus:bg-background"
                                        />
                                    </td>
                                    <td className="px-2 py-1 text-xs">
                                        {item.expiryDate ? format(item.expiryDate, 'MM/yy') : '-'}
                                    </td>
                                    <td className="px-2 py-1">
                                        <Input
                                            type="number"
                                            value={item.mrp}
                                            onChange={(e) => updateItem(index, 'mrp', parseFloat(e.target.value) || 0)}
                                            className="h-8 w-16 text-xs border-0 bg-transparent hover:bg-background focus:bg-background"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                            className="h-8 w-12 text-xs border-0 bg-transparent hover:bg-background focus:bg-background"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <Input
                                            type="number"
                                            value={item.freeQuantity}
                                            onChange={(e) => updateItem(index, 'freeQuantity', parseInt(e.target.value) || 0)}
                                            className="h-8 w-12 text-xs border-0 bg-transparent hover:bg-background focus:bg-background"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <Select
                                            value={item.unit}
                                            onValueChange={(value) => updateItem(index, 'unit', value)}
                                        >
                                            <SelectTrigger className="h-8 w-16 text-xs border-0 bg-transparent hover:bg-background">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {units.map((unit) => (
                                                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="px-2 py-1">
                                        <Input
                                            type="number"
                                            value={item.pricePerUnit}
                                            onChange={(e) => updateItem(index, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                                            className="h-8 w-16 text-xs border-0 bg-transparent hover:bg-background focus:bg-background"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <div className="space-y-1">
                                            <Input
                                                type="number"
                                                value={item.discountPercent}
                                                onChange={(e) => updateItem(index, 'discountPercent', parseFloat(e.target.value) || 0)}
                                                className="h-8 w-12 text-xs border-0 bg-transparent hover:bg-background focus:bg-background"
                                            />
                                            {item.discountAmount > 0 && (
                                                <div className="text-xs text-red-600">
                                                    -₹{item.discountAmount.toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-2 py-1">
                                        <div className="space-y-1">
                                            <Select
                                                value={item.taxPercent.toString()}
                                                onValueChange={(value) => updateItem(index, 'taxPercent', parseFloat(value))}
                                            >
                                                <SelectTrigger className="h-8 w-12 text-xs border-0 bg-transparent hover:bg-background">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {taxRates.map((rate) => (
                                                        <SelectItem key={rate} value={rate.toString()}>{rate}%</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {item.taxAmount > 0 && (
                                                <div className="text-xs text-green-600">
                                                    +₹{item.taxAmount.toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-2 py-1 text-right text-xs font-medium">₹{item.amount.toFixed(2)}</td>
                                    <td className="px-2 py-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeItem(index)}
                                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center p-4 border-t">
                    <Button
                        variant="outline"
                        size="sm"
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