import { InvoiceData, InvoiceSettings } from "../_types/invoice.types";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface InvoiceTemplate1Props {
  data: InvoiceData;
  settings: InvoiceSettings;
}

export default function InvoiceTemplate1({
  data,
  settings,
}: InvoiceTemplate1Props) {
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
      <Card className="p-8 print:border-0 print:shadow-none">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            {settings.logoUrl && (
              <img
                src={settings.logoUrl}
                alt="Company Logo"
                className="h-16 w-auto object-contain"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-invoice-header">
                {data.company.name}
              </h1>
              <p className="text-invoice-muted mt-1">{data.company.website}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-semibold text-invoice-accent mb-2">
              INVOICE
            </h2>
            <Badge variant="secondary" className={getStatusColor(data.status)}>
              {data.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Invoice Details & Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Company Information */}
          <div>
            <h3 className="text-lg font-semibold text-invoice-header mb-3">
              From
            </h3>
            <div className="text-invoice-text space-y-1">
              <p className="font-medium">{data.company.name}</p>
              {data.company.address && <p>{data.company.address}</p>}
              {(data.company.city ||
                data.company.state ||
                data.company.zipCode) && (
                <p>
                  {[data.company.city, data.company.state, data.company.zipCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {data.company.country && <p>{data.company.country}</p>}
              {data.company.phone && <p>Phone: {data.company.phone}</p>}
              {data.company.email && <p>Email: {data.company.email}</p>}
              {data.company.taxId && <p>Tax ID: {data.company.taxId}</p>}
            </div>
          </div>

          {/* Invoice Information */}
          <div>
            <h3 className="text-lg font-semibold text-invoice-header mb-3">
              Invoice Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-invoice-muted">Invoice Number:</span>
                <span className="font-medium text-invoice-text">
                  {data.invoiceNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-invoice-muted">Issue Date:</span>
                <span className="text-invoice-text">
                  {formatDate(data.issueDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-invoice-muted">Due Date:</span>
                <span className="text-invoice-text">
                  {formatDate(data.dueDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-invoice-header mb-3">
            Bill To
          </h3>
          <div className="bg-invoice-light p-4 rounded-lg">
            <div className="text-invoice-text space-y-1">
              <p className="font-medium text-lg">{data.customer.name}</p>
              {data.customer.email && <p>Email: {data.customer.email}</p>}
              {data.customer.address && <p>{data.customer.address}</p>}
              {(data.customer.city ||
                data.customer.state ||
                data.customer.zipCode) && (
                <p>
                  {[
                    data.customer.city,
                    data.customer.state,
                    data.customer.zipCode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {data.customer.country && <p>{data.customer.country}</p>}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-invoice-header mb-4">
            Items
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-invoice-light">
                  <th className="text-left p-3 text-invoice-header font-semibold border-b border-invoice-border">
                    Description
                  </th>
                  <th className="text-right p-3 text-invoice-header font-semibold border-b border-invoice-border">
                    Quantity
                  </th>
                  <th className="text-right p-3 text-invoice-header font-semibold border-b border-invoice-border">
                    Unit Price
                  </th>
                  <th className="text-right p-3 text-invoice-header font-semibold border-b border-invoice-border">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="hover:bg-invoice-light/50">
                    <td className="p-3 text-invoice-text border-b border-invoice-border">
                      {item.description}
                    </td>
                    <td className="p-3 text-right text-invoice-text border-b border-invoice-border">
                      {item.quantity}
                    </td>
                    <td className="p-3 text-right text-invoice-text border-b border-invoice-border">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="p-3 text-right font-medium text-invoice-text border-b border-invoice-border">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-sm">
            <div className="space-y-2">
              <div className="flex justify-between text-invoice-text">
                <span>Subtotal:</span>
                <span>{formatCurrency(data.subtotal)}</span>
              </div>
              {settings.showTax && (
                <div className="flex justify-between text-invoice-text">
                  <span>
                    {settings.taxLabel} ({data.taxRate}%):
                  </span>
                  <span>{formatCurrency(data.taxAmount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold text-invoice-header">
                <span>Total:</span>
                <span>{formatCurrency(data.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-invoice-header mb-3">
              Notes
            </h3>
            <div className="bg-invoice-light p-4 rounded-lg">
              <p className="text-invoice-text whitespace-pre-wrap">
                {data.notes}
              </p>
            </div>
          </div>
        )}

        {/* Signature */}
        {data.signatureUrl && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-invoice-header mb-3">
              Authorized Signature
            </h3>
            <img
              src={data.signatureUrl}
              alt="Signature"
              className="h-20 w-auto border-b border-invoice-border"
            />
          </div>
        )}

        {/* Footer */}
        {settings.footerText && (
          <div className="text-center border-t border-invoice-border pt-6">
            <p className="text-invoice-muted text-sm">{settings.footerText}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
