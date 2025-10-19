"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Download, Printer } from "lucide-react";
import JsBarcode from "jsbarcode";

interface BarcodeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BarcodeGenerator({ isOpen, onClose }: BarcodeGeneratorProps) {
  const [barcodeText, setBarcodeText] = useState("");
  const [barcodeFormat, setBarcodeFormat] = useState("CODE128");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateBarcode = () => {
    if (!barcodeText) {
      toast.error("Please enter text for the barcode");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Clear canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Generate barcode using JsBarcode
      JsBarcode(canvas, barcodeText, {
        format: barcodeFormat,
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 14,
        margin: 10,
        background: "#ffffff",
        lineColor: "#000000",
      });

      toast.success("Barcode generated successfully!");
    } catch (error) {
      console.error("Barcode generation error:", error);
      toast.error("Failed to generate barcode. Please check the input format.");
    }
  };

  // Auto-generate barcode when text changes (optional)
  useEffect(() => {
    if (barcodeText && barcodeText.length > 0) {
      const timer = setTimeout(() => {
        generateBarcode();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [barcodeText, barcodeFormat]);

  const downloadBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `barcode-${barcodeText}.png`;
    link.href = url;
    link.click();

    toast.success("Barcode downloaded!");
  };

  const printBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print Barcode</title></head>
          <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
            <img src="${url}" onload="window.print();window.close()" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Barcode Generator</DialogTitle>
          <DialogDescription>
            Generate barcodes for your products in various formats
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="barcode-text">Barcode Text/Number</Label>
            <Input
              id="barcode-text"
              placeholder="Enter product code, SKU, or number"
              value={barcodeText}
              onChange={(e) => setBarcodeText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Barcode Format</Label>
            <Select value={barcodeFormat} onValueChange={setBarcodeFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CODE128">CODE128</SelectItem>
                <SelectItem value="EAN13">EAN13</SelectItem>
                <SelectItem value="UPC">UPC-A</SelectItem>
                <SelectItem value="CODE39">CODE39</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={generateBarcode} className="w-full">
            Generate Barcode
          </Button>

          {/* Canvas for barcode display */}
          <div className="border rounded-lg p-4 bg-white flex justify-center">
            <canvas
              ref={canvasRef}
              width={400}
              height={150}
              className="border"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={downloadBarcode}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" className="flex-1" onClick={printBarcode}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
