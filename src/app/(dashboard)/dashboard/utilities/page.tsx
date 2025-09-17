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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Download } from "lucide-react";
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
    <div className="container max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Utilities</h1>
        <p className="text-muted-foreground">
          Bulk import and export your business data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Import Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              <CardTitle>Import Data</CardTitle>
            </div>
            <CardDescription>
              Upload a file to bulk-add data to your records.
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
                  <SelectItem value="items">Items</SelectItem>
                  <SelectItem value="suppliers">Suppliers</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="import-file">Upload File</Label>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={handleDownloadTemplate}
                  disabled={isDownloadingTemplate}
                >
                  {isDownloadingTemplate ? "Downloading..." : "Download Template"}
                </Button>
              </div>
              <Input
                id="import-file"
                type="file"
                onChange={handleFileChange}
                accept=".xlsx, .csv, .json"
              />
              {importFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {importFile.name}
                </p>
              )}
            </div>
            <Button
              onClick={handleImport}
              disabled={!importFile || isImporting}
              className="w-full"
            >
              {isImporting ? "Importing..." : "Import Data"}
            </Button>
          </CardContent>
        </Card>

        {/* Export Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              <CardTitle>Export Data</CardTitle>
            </div>
            <CardDescription>
              Download your business data in various formats.
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
                  <SelectItem value="items">Items</SelectItem>
                  <SelectItem value="suppliers">Suppliers</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
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
                  <SelectItem value="xlsx">XLSX (Excel)</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

