"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Download } from "lucide-react";
import QRCode from "qrcode";

interface QRGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRGenerator({ isOpen, onClose }: QRGeneratorProps) {
  const [qrText, setQrText] = useState("");
  const [qrSize, setQrSize] = useState("200");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!qrText) {
      toast.error("Please enter text for the QR code");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const size = parseInt(qrSize);
      await QRCode.toCanvas(canvas, qrText, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: errorLevel
      });

      toast.success("QR code generated successfully!");
    } catch (error) {
      console.error("QR code generation error:", error);
      toast.error("Failed to generate QR code. Please check the input.");
    }
  };

  // Auto-generate QR code when text changes (optional)
  useEffect(() => {
    if (qrText && qrText.length > 0) {
      const timer = setTimeout(() => {
        generateQR();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [qrText, qrSize, errorLevel]);

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `qrcode-${Date.now()}.png`;
    link.href = url;
    link.click();

    toast.success("QR code downloaded!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>QR Code Generator</DialogTitle>
          <DialogDescription>
            Generate QR codes for invoices, payments, and products
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="qr-text">QR Code Content</Label>
            <Textarea
              id="qr-text"
              placeholder="Enter URL, text, or data"
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Size</Label>
              <Select value={qrSize} onValueChange={setQrSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">150x150</SelectItem>
                  <SelectItem value="200">200x200</SelectItem>
                  <SelectItem value="300">300x300</SelectItem>
                  <SelectItem value="400">400x400</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Error Correction</Label>
              <Select value={errorLevel} onValueChange={(value: "L" | "M" | "Q" | "H") => setErrorLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={generateQR} className="w-full">
            Generate QR Code
          </Button>

          <div className="border rounded-lg p-4 bg-white flex justify-center">
            <canvas ref={canvasRef} className="border" />
          </div>

          <Button variant="outline" className="w-full" onClick={downloadQR}>
            <Download className="h-4 w-4 mr-2" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
