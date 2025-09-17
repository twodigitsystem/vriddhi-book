import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StickyHeaderProps {
    invoiceType: 'credit' | 'cash';
    onSettingsClick: () => void;
    onCloseClick: () => void;
}

export function StickyHeader({ invoiceType, onSettingsClick, onCloseClick }: StickyHeaderProps) {
    return (
        <div className=" sticky top-13 h-16 bg-white mb-2">
            <div className="flex items-center justify-between ">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-semibold text-foreground">Create Invoice</h1>
                    <div className="flex items-center gap-2">
                        <Badge variant="default" className="px-2 py-1  rounded text-xs">
                            {invoiceType === 'credit' ? 'Credit' : 'Cash'}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onSettingsClick}
                        className="h-9 w-9"
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onCloseClick}
                        className="h-9 w-9"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>

    );
};