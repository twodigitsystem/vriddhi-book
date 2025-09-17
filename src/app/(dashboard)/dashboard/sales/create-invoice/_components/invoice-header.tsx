import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Receipt, ToggleLeft, ToggleRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

interface InvoiceHeaderProps {
    invoiceNumber: string;
    invoiceDate: Date;
    invoiceType: 'credit' | 'cash';
    dueDate: Date | null;
    paymentTerms: string;
    onInvoiceNumberChange: (value: string) => void;
    onInvoiceDateChange: (date: Date) => void;
    onInvoiceTypeChange: (type: 'credit' | 'cash') => void;
    onDueDateChange: (date: Date | undefined) => void;
    onPaymentTermsChange: (terms: string) => void;
}

const paymentTermsOptions = [
    'Due on Receipt',
    'Net 15',
    'Net 30',
    'Net 45',
    'Net 60',
    '2/10, Net 30',
    'COD (Cash on Delivery)',
    'Prepaid'
];

export function InvoiceHeader({
    invoiceNumber,
    invoiceDate,
    invoiceType,
    dueDate,
    paymentTerms,
    onInvoiceNumberChange,
    onInvoiceDateChange,
    onInvoiceTypeChange,
    onDueDateChange,
    onPaymentTermsChange
}: InvoiceHeaderProps) {
    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Receipt className="h-4 w-4" />
                    Invoice Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                    <Label className="text-sm font-medium">Type:</Label>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={invoiceType === 'credit' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onInvoiceTypeChange('credit')}
                            className={cn(
                                "transition-all",
                                invoiceType === 'credit' && "bg-primary text-primary-foreground"
                            )}
                        >
                            Credit
                        </Button>
                        <Button
                            variant={invoiceType === 'cash' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onInvoiceTypeChange('cash')}
                            className={cn(
                                "transition-all",
                                invoiceType === 'cash' && "bg-primary text-primary-foreground"
                            )}
                        >
                            Cash
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="invoice-number">Invoice Number</Label>
                        <Input
                            id="invoice-number"
                            value={invoiceNumber}
                            onChange={(e) => onInvoiceNumberChange(e.target.value)}
                            className="font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Invoice Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !invoiceDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {invoiceDate ? format(invoiceDate, "dd/MM/yyyy") : "Pick a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={invoiceDate}
                                    onSelect={(date) => date && onInvoiceDateChange(date)}
                                    initialFocus
                                    className="pointer-events-auto"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Payment Terms & Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                    <div className="space-y-2">
                        <Label>Payment Terms</Label>
                        <Select value={paymentTerms} onValueChange={onPaymentTermsChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment terms" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentTermsOptions.map((term) => (
                                    <SelectItem key={term} value={term}>
                                        {term}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !dueDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dueDate ? format(dueDate, "dd/MM/yyyy") : "Select due date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    required={false}
                                    selected={dueDate || undefined}
                                    onSelect={onDueDateChange}
                                    initialFocus
                                    className="pointer-events-auto"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};