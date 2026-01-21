"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import InvoiceRenderer from "./_components/InvoiceRenderer";
import { ThemeSelector } from "./_components/ThemeSelector";
import { ColorPicker } from "./_components/ColorPicker";
import { PrintSettingsSections } from "./_components/PrintSettingsSections";
import {
  sampleInvoiceData,
  defaultInvoiceSettings,
} from "./_data/sample_invoice";
import {
  InvoiceSettings,
  InvoiceTemplate,
  PrintSettings,
  PrinterType,
  SettingsTab,
} from "./_types/invoice.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function InvoiceCustomize() {
  const [settings, setSettings] = useState<InvoiceSettings>(
    defaultInvoiceSettings
  );
  const [invoiceData, setInvoiceData] = useState(sampleInvoiceData);
  const [printerType, setPrinterType] = useState<PrinterType>("regular");
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("layout");

  const [companyInfo, setCompanyInfo] = useState({
    companyName: invoiceData.company.name,
    address: invoiceData.company.address || "",
    email: invoiceData.company.email || "",
    phone: invoiceData.company.phone || "",
  });

  const updateSettings = (key: keyof InvoiceSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updatePrintSettings = (key: keyof PrintSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      printSettings: { ...prev.printSettings, [key]: value },
    }));
  };

  const handleCompanyInfoChange = (key: string, value: string) => {
    setCompanyInfo((prev) => ({ ...prev, [key]: value }));
    setInvoiceData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        [key === "companyName" ? "name" : key]: value,
      },
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateSettings("logoUrl", url);
      toast.success("Logo uploaded", {
        description: "Your logo has been updated.",
      });
    }
  };

  const fontOptions = [
    { name: "Inter", value: "Inter" },
    { name: "Roboto", value: "Roboto" },
    { name: "Open Sans", value: "Open Sans" },
    { name: "Lato", value: "Lato" },
    { name: "Montserrat", value: "Montserrat" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      {/* Settings Panel */}
      <div className="w-full md:w-[520px] md:min-w-[520px] border-b md:border-r bg-background flex flex-col h-[100dvh] md:h-screen overflow-x-hidden">
        {/* Printer Type Tabs */}
        <div className="border-b border-border shrink-0">
          <div className="flex">
            <button
              onClick={() => setPrinterType("regular")}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
                printerType === "regular"
                  ? "text-primary border-primary bg-primary/5"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              REGULAR PRINTER
            </button>
            <button
              onClick={() => setPrinterType("thermal")}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
                printerType === "thermal"
                  ? "text-primary border-primary bg-primary/5"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              THERMAL PRINTER
            </button>
          </div>
        </div>

        {/* Layout / Colors Tabs */}
        <div className="border-b border-border bg-muted/30 shrink-0">
          <div className="flex gap-1 p-2">
            <Button
              variant={settingsTab === "layout" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSettingsTab("layout")}
              className="px-4"
            >
              CHANGE LAYOUT
            </Button>
            <Button
              variant={settingsTab === "colors" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSettingsTab("colors")}
              className="px-4"
            >
              CHANGE COLORS
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="py-4 pl-4 pr-12 overflow-x-hidden">
            {settingsTab === "layout" ? (
              <div className="space-y-6">
                {/* Theme Selector */}
                <div className="mb-4">
                  <ThemeSelector
                    selectedTheme={settings.templateId}
                    onThemeChange={(theme: InvoiceTemplate) =>
                      updateSettings("templateId", theme)
                    }
                  />
                </div>
                <PrintSettingsSections
                  settings={settings.printSettings}
                  companyName={companyInfo.companyName}
                  address={companyInfo.address}
                  email={companyInfo.email}
                  phone={companyInfo.phone}
                  onSettingsChange={updatePrintSettings}
                  onCompanyInfoChange={handleCompanyInfoChange}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Company Logo
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Label
                        htmlFor="logo-upload"
                        className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">Upload Logo</span>
                      </Label>
                    </div>
                    {settings.logoUrl && (
                      <img
                        src={settings.logoUrl}
                        alt="Logo preview"
                        className="h-12 w-auto border border-border rounded"
                      />
                    )}
                  </div>
                </div>
                <ColorPicker
                  label="Primary Color"
                  value={settings.primaryColor}
                  onChange={(value) => updateSettings("primaryColor", value)}
                />
                <ColorPicker
                  label="Secondary Color"
                  value={settings.secondaryColor || "#06b6d4"}
                  onChange={(value) => updateSettings("secondaryColor", value)}
                />
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Font Family
                  </Label>
                  <Select
                    value={settings.fontFamily}
                    onValueChange={(value) =>
                      updateSettings("fontFamily", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Tax Label
                  </Label>
                  <Input
                    value={settings.taxLabel}
                    onChange={(e) => updateSettings("taxLabel", e.target.value)}
                    placeholder="e.g., GST, VAT"
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t shrink-0">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSettings(defaultInvoiceSettings);
                setCompanyInfo({
                  companyName: sampleInvoiceData.company.name,
                  address: sampleInvoiceData.company.address || "",
                  email: sampleInvoiceData.company.email || "",
                  phone: sampleInvoiceData.company.phone || "",
                });
                setInvoiceData(sampleInvoiceData);
              }}
            >
              Reset to Default
            </Button>
          </div>
        </div>
      </div>

      {/* Full Width Preview Panel */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <InvoiceRenderer data={invoiceData} settings={settings} />
          </div>
        </div>
      </div>
    </div>
  );
}
