import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceTemplate } from "../_types/invoice.types";
import { Layout } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplate: InvoiceTemplate;
  onTemplateChange: (template: InvoiceTemplate) => void;
}

export default function TemplateSelector({
  selectedTemplate,
  onTemplateChange,
}: TemplateSelectorProps) {
  const templates = [
    {
      id: "template1" as InvoiceTemplate,
      name: "Classic Professional",
      description: "Clean and traditional business invoice design",
    },
    {
      id: "template2" as InvoiceTemplate,
      name: "Modern Minimalist",
      description: "Sleek design with accent sidebar and clean typography",
    },
    {
      id: "template3" as InvoiceTemplate,
      name: "Formal Business",
      description: "Traditional corporate style with structured layout",
    },
    {
      id: "template4" as InvoiceTemplate,
      name: "Creative Gradient",
      description: "Modern design with gradients and visual elements",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Layout className="h-5 w-5 text-invoice-accent" />
        <h3 className="text-lg font-semibold text-invoice-header">Template</h3>
      </div>

      <div>
        <Label>Invoice Template</Label>
        <Select value={selectedTemplate} onValueChange={onTemplateChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="py-1">
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {template.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Template Preview Thumbnails */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`p-2 rounded border-2 transition-all text-left ${
              selectedTemplate === template.id
                ? "border-invoice-accent bg-invoice-light"
                : "border-invoice-border hover:border-invoice-accent/50"
            }`}
          >
            <div className="text-xs font-medium text-invoice-header truncate">
              {template.name}
            </div>
            <div className="text-xs text-invoice-muted mt-1 line-clamp-2">
              {template.description}
            </div>

            {/* Mini Preview */}
            <div className="mt-2 h-12 bg-gradient-to-r from-gray-100 to-gray-50 rounded text-xs flex items-center justify-center">
              <div className="w-8 h-1 bg-gray-300 rounded"></div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
