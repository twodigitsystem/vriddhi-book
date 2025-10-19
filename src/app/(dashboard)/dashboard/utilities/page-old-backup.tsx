"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Upload,
  Download,
  QrCode,
  Barcode,
  Database,
  RefreshCw,
  Shield,
  Activity,
  FileText,
  PackageCheck,
  AlertCircle,
  CheckCircle2,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { saveAs } from "file-saver";
import { exportData, importData, getTemplate } from "@/lib/actions/utility.actions";

type DataType = "items" | "suppliers" | "customers";
type FileFormat = "xlsx" | "csv" | "json";

export default function UtilitiesPage() {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importDataType, setImportDataType] = useState<DataType>("items");
  const [exportDataType, setExportDataType] = useState<DataType>("items");
  const [exportFileFormat, setExportFileFormat] = useState<FileFormat>("xlsx");
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImportFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error("Please select a file to import.");
      return;
    }
    setIsImporting(true);
    toast.info(`Importing ${importDataType}...`);

    const reader = new FileReader();
    reader.readAsDataURL(importFile);
    reader.onload = async () => {
      try {
        const base64 = reader.result?.toString().split(',')[1];
        if (!base64) {
          toast.error("Could not read the file. Please try again.");
          setIsImporting(false);
          return;
        }

        const result = await importData(importDataType, base64);

        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.message);
        }
      } catch (error) {
        console.error("Import failed:", error);
        toast.error("An unexpected error occurred during the import.");
      } finally {
        setIsImporting(false);
        setImportFile(null);
        const fileInput = document.getElementById('import-file') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
      setIsImporting(false);
    };
  };

  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    toast.info(`Downloading template for ${importDataType}...`);
    try {
      const result = await getTemplate(importDataType);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success && result.data) {
        const blob = new Blob([
          Buffer.from(result.data, 'base64')
        ], { type: result.fileType });
        saveAs(blob, `${importDataType}-template.xlsx`);
        toast.success("Template downloaded successfully!");
      }
    } catch (error) {
      console.error("Template download failed:", error);
      toast.error("An unexpected error occurred during the download.");
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    toast.info(`Exporting ${exportDataType} as ${exportFileFormat}...`);

    try {
      const result = await exportData(exportDataType, exportFileFormat);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success && result.data && result.fileType) {
        const getBlob = () => {
          // JSON is returned as a string, not base64
          if (result.fileType === "application/json") {
            return new Blob([result.data], { type: result.fileType });
          }
          // For xlsx and csv, data is base64
          const byteCharacters = atob(result.data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          return new Blob([byteArray], { type: result.fileType });
        };

        const blob = getBlob();
        saveAs(blob, `vriddhi-book-${exportDataType}.${exportFileFormat}`);

        toast.success(
          `${exportDataType} exported successfully as ${exportFileFormat}!`
        );
      } else {
        toast.error("Failed to export data. The server returned an empty response.");
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("An unexpected error occurred during the export.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container max-w-7xl p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Utilities</h1>
        <p className="text-muted-foreground">
          Powerful tools to manage, maintain, and optimize your business data
        </p>
      </div>

      <Tabs defaultValue="import-export" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="import-export" className="gap-2">
            <ArrowUpCircle className="h-4 w-4" />
            Import/Export
          </TabsTrigger>
          <TabsTrigger value="generators" className="gap-2">
            <QrCode className="h-4 w-4" />
            Generators
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Database className="h-4 w-4" />
            System Tools
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* Import/Export Tab */}
        <TabsContent value="import-export" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Import Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  <CardTitle>Import Data</CardTitle>
                  <Badge variant="secondary" className="ml-auto">Bulk Upload</Badge>
                </div>
                <CardDescription>
                  Upload Excel, CSV, or JSON files to bulk-add records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Data Type</Label>
                  <Select
                    value={importDataType}
                    onValueChange={(value) => setImportDataType(value as DataType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="items">📦 Items/Products</SelectItem>
                      <SelectItem value="suppliers">🏭 Suppliers</SelectItem>
                      <SelectItem value="customers">👥 Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="import-file">Upload File</Label>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={handleDownloadTemplate}
                      disabled={isDownloadingTemplate}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      {isDownloadingTemplate ? "Downloading..." : "Template"}
                    </Button>
                  </div>
                  <Input
                    id="import-file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".xlsx, .csv, .json"
                  />
                  {importFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {importFile.name}
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleImport}
                  disabled={!importFile || isImporting}
                  className="w-full"
                  size="lg"
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Export Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  <CardTitle>Export Data</CardTitle>
                  <Badge variant="secondary" className="ml-auto">Bulk Download</Badge>
                </div>
                <CardDescription>
                  Download your business data in multiple formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Data Type</Label>
                  <Select
                    value={exportDataType}
                    onValueChange={(value) => setExportDataType(value as DataType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="items">📦 Items/Products</SelectItem>
                      <SelectItem value="suppliers">🏭 Suppliers</SelectItem>
                      <SelectItem value="customers">👥 Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Select File Format</Label>
                  <Select
                    value={exportFileFormat}
                    onValueChange={(value) => setExportFileFormat(value as FileFormat)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select file format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xlsx">📊 XLSX (Excel)</SelectItem>
                      <SelectItem value="csv">📄 CSV</SelectItem>
                      <SelectItem value="json">💻 JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full"
                  size="lg"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Records</p>
                    <p className="text-2xl font-bold">—</p>
                  </div>
                  <PackageCheck className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Last Import</p>
                    <p className="text-2xl font-bold">—</p>
                  </div>
                  <ArrowDownCircle className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Last Export</p>
                    <p className="text-2xl font-bold">—</p>
                  </div>
                  <ArrowUpCircle className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Generators Tab */}
        <TabsContent value="generators" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Barcode className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Barcode Generator</CardTitle>
                </div>
                <CardDescription>
                  Generate barcodes for your products (CODE128, EAN13, UPC)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => toast.info("Barcode generator coming soon!")}>
                  Open Generator
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">QR Code Generator</CardTitle>
                </div>
                <CardDescription>
                  Create QR codes for invoices, payments, and product info
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => toast.info("QR code generator coming soon!")}>
                  Open Generator
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Label Generator</CardTitle>
                </div>
                <CardDescription>
                  Print custom labels with barcodes and product details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => toast.info("Label generator coming soon!")}>
                  Open Generator
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tools Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle>Database Health</CardTitle>
                </div>
                <CardDescription>
                  View database statistics and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Items</span>
                    <span className="font-medium">—</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Customers</span>
                    <span className="font-medium">—</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Suppliers</span>
                    <span className="font-medium">—</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Invoices</span>
                    <span className="font-medium">—</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => toast.info("Database health check coming soon!")}>
                  <Activity className="h-4 w-4 mr-2" />
                  Run Health Check
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Backup & Restore</CardTitle>
                  <Badge variant="destructive" className="ml-auto">Admin</Badge>
                </div>
                <CardDescription>
                  Create database backups and restore from previous backups
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => toast.info("Backup functionality coming soon!")}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Backup
                </Button>
                <Button variant="outline" className="w-full" onClick={() => toast.info("Restore functionality coming soon!")}>
                  <Upload className="h-4 w-4 mr-2" />
                  Restore from Backup
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Audit Logs</CardTitle>
              </div>
              <CardDescription>
                View system activity and user actions for security monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => toast.info("Audit logs viewer coming soon!")}>
                <FileText className="h-4 w-4 mr-2" />
                View Audit Logs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Bulk Price Update</CardTitle>
                <CardDescription>
                  Update prices for multiple items at once
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => toast.info("Bulk price update coming soon!")}>
                  Open Tool
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Data Cleanup</CardTitle>
                <CardDescription>
                  Remove duplicate records and orphaned data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => toast.info("Data cleanup coming soon!")}>
                  Open Tool
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Bulk Status Change</CardTitle>
                <CardDescription>
                  Activate/deactivate multiple items or accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => toast.info("Bulk status change coming soon!")}>
                  Open Tool
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Category Assignment</CardTitle>
                <CardDescription>
                  Assign categories to multiple items in bulk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => toast.info("Bulk category assignment coming soon!")}>
                  Open Tool
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Image Optimization</CardTitle>
                <CardDescription>
                  Compress and optimize product images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => toast.info("Image optimization coming soon!")}>
                  Open Tool
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Cache Management</CardTitle>
                <CardDescription>
                  Clear application cache and temporary data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => toast.info("Cache management coming soon!")}>
                  Open Tool
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-amber-900 dark:text-amber-100">Maintenance Mode</p>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Some operations may require putting your application in maintenance mode. Always create a backup before performing bulk operations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

