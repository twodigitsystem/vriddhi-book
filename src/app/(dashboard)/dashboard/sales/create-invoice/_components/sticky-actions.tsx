import React from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Save,
    Plus,
    ChevronDown,
    Printer,
    Share2,
    FileText,
    Send
} from 'lucide-react';

interface StickyActionsProps {
    onSave: () => void;
    onSaveAndNew: () => void;
    onPrint: () => void;
    onShare: () => void;
    onEInvoice: () => void;
}

export function StickyActions({
    onSave,
    onSaveAndNew,
    onPrint,
    onShare,
    onEInvoice
}: StickyActionsProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0  bg-green-200 border-t shadow-lg">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-end gap-3">
                    <Button onClick={onSave} className="">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                    </Button>

                    <Button onClick={onSaveAndNew} variant="outline" className="">
                        <Plus className="h-4 w-4 mr-2" />
                        Save & New
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="">
                                More Actions
                                <ChevronDown className="h-4 w-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={onPrint}>
                                <Printer className="h-4 w-4 mr-2" />
                                Print Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onShare}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onEInvoice}>
                                <FileText className="h-4 w-4 mr-2" />
                                E-Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Send className="h-4 w-4 mr-2" />
                                Send via Email
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};