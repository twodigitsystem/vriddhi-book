import { InvoiceData, InvoiceSettings } from "../_types/invoice.types";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface InvoiceTemplate3Props {
  data: InvoiceData;
  settings: InvoiceSettings;
}

export default function InvoiceTemplate3({
  data,
  settings,
}: InvoiceTemplate3Props) {
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
      <Card className="p-0 print:border-0 print:shadow-none">
        {/* Header Section with Dark Background */}
        <div className="bg-invoice-header text-white p-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              {settings.logoUrl && (
                <div className="bg-white p-2 rounded">
                  <img
                    src={settings.logoUrl}
                    alt="Company Logo"
                    className="h-12 w-auto object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{data.company.name}</h1>
                <p className="text-white/80 text-sm mt-1">
                  Professional Services
                </p>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-4xl font-bold mb-3">INVOICE</h2>
              <div className="text-right">
                <Badge
                  variant="secondary"
                  className={`${getStatusColor(data.status)} border-white`}
                >
                  {data.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Invoice Details Table */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Invoice Number
                </div>
                <div className="text-lg font-bold text-invoice-header">
                  {data.invoiceNumber}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Date Issued
                </div>
                <div className="text-lg font-semibold text-invoice-text">
                  {formatDate(data.issueDate)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Due Date
                </div>
                <div className="text-lg font-semibold text-invoice-text">
                  {formatDate(data.dueDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Company and Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Service Provider */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-bold text-invoice-header mb-4 uppercase tracking-wide border-b border-gray-200 pb-2">
                Service Provider
              </h3>
              <div className="text-invoice-text space-y-2">
                <div className="font-semibold text-lg">{data.company.name}</div>
                {data.company.address && <div>{data.company.address}</div>}
                {(data.company.city ||
                  data.company.state ||
                  data.company.zipCode) && (
                  <div>
                    {[
                      data.company.city,
                      data.company.state,
                      data.company.zipCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
                {data.company.country && <div>{data.company.country}</div>}
                <div className="pt-2 space-y-1 text-sm">
                  {data.company.phone && (
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      {data.company.phone}
                    </div>
                  )}
                  {data.company.email && (
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {data.company.email}
                    </div>
                  )}
                  {data.company.website && (
                    <div>
                      <span className="font-medium">Web:</span>{" "}
                      {data.company.website}
                    </div>
                  )}
                  {data.company.taxId && (
                    <div>
                      <span className="font-medium">Tax ID:</span>{" "}
                      {data.company.taxId}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-bold text-invoice-header mb-4 uppercase tracking-wide border-b border-gray-200 pb-2">
                Bill To
              </h3>
              <div className="text-invoice-text space-y-2">
                <div className="font-semibold text-lg">
                  {data.customer.name}
                </div>
                {data.customer.email && (
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {data.customer.email}
                  </div>
                )}
                {data.customer.address && <div>{data.customer.address}</div>}
                {(data.customer.city ||
                  data.customer.state ||
                  data.customer.zipCode) && (
                  <div>
                    {[
                      data.customer.city,
                      data.customer.state,
                      data.customer.zipCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
                {data.customer.country && <div>{data.customer.country}</div>}
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-invoice-header mb-4 uppercase tracking-wide">
              Services Provided
            </h3>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-invoice-header border-b border-gray-200">
                      Description
                    </th>
                    <th className="text-center p-4 font-semibold text-invoice-header border-b border-gray-200">
                      Quantity
                    </th>
                    <th className="text-right p-4 font-semibold text-invoice-header border-b border-gray-200">
                      Unit Price
                    </th>
                    <th className="text-right p-4 font-semibold text-invoice-header border-b border-gray-200">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    >
                      <td className="p-4 text-invoice-text border-b border-gray-100">
                        <div className="font-medium">{item.description}</div>
                      </td>
                      <td className="p-4 text-center text-invoice-text border-b border-gray-100">
                        {item.quantity}
                      </td>
                      <td className="p-4 text-right text-invoice-text border-b border-gray-100">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="p-4 text-right font-semibold text-invoice-text border-b border-gray-100">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-md border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4">
                <h3 className="font-semibold text-invoice-header uppercase tracking-wide text-sm">
                  Invoice Summary
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-invoice-text">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(data.subtotal)}
                  </span>
                </div>
                {settings.showTax && (
                  <div className="flex justify-between text-invoice-text">
                    <span>
                      {settings.taxLabel} ({data.taxRate}%):
                    </span>
                    <span className="font-medium">
                      {formatCurrency(data.taxAmount)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-xl font-bold text-invoice-header">
                  <span>Total Due:</span>
                  <span>{formatCurrency(data.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {data.notes && (
            <div className="mb-8 border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-bold text-invoice-header mb-3 uppercase tracking-wide">
                Payment Terms & Notes
              </h3>
              <p className="text-invoice-text leading-relaxed">{data.notes}</p>
            </div>
          )}

          {/* Signature */}
          {data.signatureUrl && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-invoice-header mb-4 uppercase tracking-wide">
                Authorized Signature
              </h3>
              <div className="border-b-2 border-gray-300 pb-2 inline-block">
                <img
                  src={data.signatureUrl}
                  alt="Signature"
                  className="h-16 w-auto"
                />
              </div>
            </div>
          )}

          {/* Footer */}
          {settings.footerText && (
            <div className="text-center text-sm text-invoice-muted pt-6 border-t border-gray-200">
              {settings.footerText}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
