import { InvoiceData, InvoiceSettings } from "../_types/invoice.types";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface InvoiceTemplate2Props {
  data: InvoiceData;
  settings: InvoiceSettings;
}

export default function InvoiceTemplate2({
  data,
  settings,
}: InvoiceTemplate2Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-background print:shadow-none">
      <Card className="overflow-hidden print:border-0 print:shadow-none">
        {/* Header with Accent Sidebar */}
        <div className="flex">
          {/* Accent Sidebar */}
          <div
            className="w-2 flex-shrink-0"
            style={{ backgroundColor: settings.primaryColor }}
          />

          {/* Main Content */}
          <div className="flex-1 p-8">
            {/* Top Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center space-x-6">
                {settings.logoUrl && (
                  <img
                    src={settings.logoUrl}
                    alt="Company Logo"
                    className="h-12 w-auto object-contain"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-light text-invoice-header">
                    {data.company.name}
                  </h1>
                  <p className="text-sm text-invoice-muted mt-1">
                    {data.company.website}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extralight text-invoice-muted mb-2">
                  INVOICE
                </div>
                <Badge
                  variant="secondary"
                  className={getStatusColor(data.status)}
                >
                  {data.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Invoice Info Bar */}
            <div
              className="rounded-lg p-4 mb-8 text-white"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs opacity-90 uppercase tracking-wide">
                    Invoice Number
                  </div>
                  <div className="font-semibold text-lg">
                    {data.invoiceNumber}
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-90 uppercase tracking-wide">
                    Issue Date
                  </div>
                  <div className="font-semibold">
                    {formatDate(data.issueDate)}
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-90 uppercase tracking-wide">
                    Due Date
                  </div>
                  <div className="font-semibold">
                    {formatDate(data.dueDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Company and Customer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* From */}
              <div>
                <div
                  className="text-xs uppercase tracking-wider font-semibold mb-3 pb-1 border-b-2"
                  style={{
                    color: settings.primaryColor,
                    borderColor: settings.primaryColor,
                  }}
                >
                  From
                </div>
                <div className="text-invoice-text space-y-1 leading-relaxed">
                  <div className="font-medium">{data.company.name}</div>
                  {data.company.address && (
                    <div className="text-sm">{data.company.address}</div>
                  )}
                  {(data.company.city ||
                    data.company.state ||
                    data.company.zipCode) && (
                    <div className="text-sm">
                      {[
                        data.company.city,
                        data.company.state,
                        data.company.zipCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                  {data.company.country && (
                    <div className="text-sm">{data.company.country}</div>
                  )}
                  {data.company.phone && (
                    <div className="text-sm">{data.company.phone}</div>
                  )}
                  {data.company.email && (
                    <div className="text-sm">{data.company.email}</div>
                  )}
                  {data.company.taxId && (
                    <div className="text-sm">Tax ID: {data.company.taxId}</div>
                  )}
                </div>
              </div>

              {/* To */}
              <div>
                <div
                  className="text-xs uppercase tracking-wider font-semibold mb-3 pb-1 border-b-2"
                  style={{
                    color: settings.primaryColor,
                    borderColor: settings.primaryColor,
                  }}
                >
                  Bill To
                </div>
                <div className="text-invoice-text space-y-1 leading-relaxed">
                  <div className="font-medium text-lg">
                    {data.customer.name}
                  </div>
                  {data.customer.email && (
                    <div className="text-sm">{data.customer.email}</div>
                  )}
                  {data.customer.address && (
                    <div className="text-sm">{data.customer.address}</div>
                  )}
                  {(data.customer.city ||
                    data.customer.state ||
                    data.customer.zipCode) && (
                    <div className="text-sm">
                      {[
                        data.customer.city,
                        data.customer.state,
                        data.customer.zipCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                  {data.customer.country && (
                    <div className="text-sm">{data.customer.country}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <div
                className="text-xs uppercase tracking-wider font-semibold mb-4 pb-1 border-b-2"
                style={{
                  color: settings.primaryColor,
                  borderColor: settings.primaryColor,
                }}
              >
                Items & Services
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-invoice-border">
                      <th className="text-left py-3 px-1 text-xs uppercase tracking-wide text-invoice-muted font-semibold">
                        Description
                      </th>
                      <th className="text-right py-3 px-1 text-xs uppercase tracking-wide text-invoice-muted font-semibold">
                        Qty
                      </th>
                      <th className="text-right py-3 px-1 text-xs uppercase tracking-wide text-invoice-muted font-semibold">
                        Rate
                      </th>
                      <th className="text-right py-3 px-1 text-xs uppercase tracking-wide text-invoice-muted font-semibold">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item, index) => (
                      <tr
                        key={item.id}
                        className={index % 2 === 0 ? "bg-invoice-light/30" : ""}
                      >
                        <td className="py-4 px-1 text-invoice-text">
                          <div className="font-medium">{item.description}</div>
                        </td>
                        <td className="py-4 px-1 text-right text-invoice-text">
                          {item.quantity}
                        </td>
                        <td className="py-4 px-1 text-right text-invoice-text">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-4 px-1 text-right font-semibold text-invoice-text">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="flex justify-end mb-8">
              <div className="w-full max-w-xs">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-invoice-muted">Subtotal</span>
                    <span className="text-invoice-text">
                      {formatCurrency(data.subtotal)}
                    </span>
                  </div>
                  {settings.showTax && (
                    <div className="flex justify-between py-1">
                      <span className="text-invoice-muted">
                        {settings.taxLabel} ({data.taxRate}%)
                      </span>
                      <span className="text-invoice-text">
                        {formatCurrency(data.taxAmount)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div
                    className="flex justify-between py-2 px-3 rounded text-white font-semibold text-lg"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    <span>Total</span>
                    <span>{formatCurrency(data.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {data.notes && (
              <div className="mb-8">
                <div
                  className="text-xs uppercase tracking-wider font-semibold mb-3 pb-1 border-b-2"
                  style={{
                    color: settings.primaryColor,
                    borderColor: settings.primaryColor,
                  }}
                >
                  Notes
                </div>
                <p className="text-invoice-text text-sm leading-relaxed">
                  {data.notes}
                </p>
              </div>
            )}

            {/* Signature */}
            {data.signatureUrl && (
              <div className="mb-8">
                <div
                  className="text-xs uppercase tracking-wider font-semibold mb-3 pb-1 border-b-2"
                  style={{
                    color: settings.primaryColor,
                    borderColor: settings.primaryColor,
                  }}
                >
                  Authorized Signature
                </div>
                <img
                  src={data.signatureUrl}
                  alt="Signature"
                  className="h-16 w-auto"
                />
              </div>
            )}

            {/* Footer */}
            {settings.footerText && (
              <div className="text-center text-xs text-invoice-muted pt-8 border-t border-invoice-border">
                {settings.footerText}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
