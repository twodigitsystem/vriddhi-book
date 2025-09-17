import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface TotalsSectionProps {
    subtotal: number;
    totalDiscount: number;
    totalTax: number;
    grandTotal: number;
    roundOff: boolean;
    roundOffAmount: number;
    finalTotal: number;
    onRoundOffToggle: (enabled: boolean) => void;
}

export function TotalsSection({
    subtotal,
    totalDiscount,
    totalTax,
    grandTotal,
    roundOff,
    roundOffAmount,
    finalTotal,
    onRoundOffToggle
}: TotalsSectionProps) {
    const formatCurrency = (amount: number) => {
        return `₹${amount.toFixed(2)}`;
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex justify-end">
                    <div className="w-full max-w-md space-y-3">
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Subtotal:</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>

                        {/* Total Discount */}
                        {totalDiscount > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Discount:</span>
                                <span className="font-medium text-invoice-danger">
                                    -{formatCurrency(totalDiscount)}
                                </span>
                            </div>
                        )}

                        {/* Total Tax */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Tax:</span>
                            <span className="font-medium">{formatCurrency(totalTax)}</span>
                        </div>

                        <Separator />

                        {/* Grand Total */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Grand Total:</span>
                            <span className="font-semibold">{formatCurrency(grandTotal)}</span>
                        </div>

                        {/* Round Off */}
                        <div className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="round-off"
                                    checked={roundOff}
                                    onCheckedChange={onRoundOffToggle}
                                />
                                <Label htmlFor="round-off" className="text-sm">
                                    Round Off
                                </Label>
                            </div>
                            <span className="font-medium text-sm">
                                {roundOffAmount !== 0 && (
                                    <span className={roundOffAmount > 0 ? 'text-invoice-success' : 'text-invoice-danger'}>
                                        {roundOffAmount > 0 ? '+' : ''}{formatCurrency(Math.abs(roundOffAmount))}
                                    </span>
                                )}
                            </span>
                        </div>

                        <Separator />

                        {/* Final Total */}
                        <div className="flex justify-between items-center py-2">
                            <span className="text-lg font-bold">Total:</span>
                            <span className="text-lg font-bold text-primary">
                                {formatCurrency(finalTotal)}
                            </span>
                        </div>

                        {/* Balance Info */}
                        <div className="bg-muted p-3 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Received:</span>
                                <span>₹0.00</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium">
                                <span>Balance:</span>
                                <span className="text-primary">{formatCurrency(finalTotal)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};