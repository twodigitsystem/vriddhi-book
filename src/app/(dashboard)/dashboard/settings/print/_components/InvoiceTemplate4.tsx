import { InvoiceData, InvoiceSettings } from "../_types/invoice.types";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface InvoiceTemplate4Props {
  data: InvoiceData;
  settings: InvoiceSettings;
}

export default function InvoiceTemplate4({
  data,
  settings,
}: InvoiceTemplate4Props) {
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

  // Create gradient colors based on primary color
  const primaryColor = settings.primaryColor;
  const gradientStyle = {
    background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
  };

  return (
    <div className="max-w-4xl mx-auto bg-background print:shadow-none">
      <Card className="overflow-hidden print:border-0 print:shadow-none relative">
        {/* Gradient Header */}
        <div className="relative p-8 text-white" style={gradientStyle}>
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                {settings.logoUrl && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <img
                      src={settings.logoUrl}
                      alt="Company Logo"
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold">{data.company.name}</h1>
                  <p className="text-white/80 text-sm">
                    {data.company.website}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-light mb-2">INVOICE</div>
                <Badge
                  variant="secondary"
                  className={`${getStatusColor(data.status)} border-white/20`}
                >
                  {data.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Invoice Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-xs uppercase tracking-wide opacity-90 mb-1">
                  Invoice #
                </div>
                <div className="font-semibold text-lg">
                  {data.invoiceNumber}
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-xs uppercase tracking-wide opacity-90 mb-1">
                  Issued
                </div>
                <div className="font-semibold">
                  {formatDate(data.issueDate)}
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-xs uppercase tracking-wide opacity-90 mb-1">
                  Due Date
                </div>
                <div className="font-semibold">{formatDate(data.dueDate)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Address Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* From */}
            <div className="relative">
              <div
                className="absolute -left-2 top-0 w-1 h-full rounded"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <div className="pl-6">
                <h3 className="text-lg font-semibold text-invoice-header mb-4 flex items-center">
                  <span
                    className="w-2 h-2 rounded-full mr-3"
                    style={{ backgroundColor: primaryColor }}
                  ></span>
                  From
                </h3>
                <div className="text-invoice-text space-y-2 leading-relaxed">
                  <div className="font-semibold text-lg">
                    {data.company.name}
                  </div>
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
                  <div className="pt-2 space-y-1 text-xs text-invoice-muted">
                    {data.company.phone && <div>📞 {data.company.phone}</div>}
                    {data.company.email && <div>✉ {data.company.email}</div>}
                    {data.company.taxId && (
                      <div>🏢 Tax ID: {data.company.taxId}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* To */}
            <div className="relative">
              <div className="absolute -left-2 top-0 w-1 h-full rounded bg-gray-300"></div>
              <div className="pl-6">
                <h3 className="text-lg font-semibold text-invoice-header mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-gray-400 mr-3"></span>
                  Bill To
                </h3>
                <div className="bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-lg">
                  <div className="text-invoice-text space-y-2">
                    <div className="font-semibold text-lg">
                      {data.customer.name}
                    </div>
                    {data.customer.email && (
                      <div className="text-sm">✉ {data.customer.email}</div>
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
            </div>
          </div>

          {/* Items Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-invoice-header mb-6 flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-4"
                style={{ backgroundColor: primaryColor }}
              ></span>
              Services & Products
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: `${primaryColor}15` }}>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-invoice-header rounded-l-lg">
                      Description
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-invoice-header">
                      Qty
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-invoice-header">
                      Rate
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-invoice-header rounded-r-lg">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-invoice-text">
                        <div className="flex items-center">
                          <div
                            className="w-1 h-8 rounded mr-3"
                            style={{ backgroundColor: `${primaryColor}40` }}
                          ></div>
                          <div className="font-medium">{item.description}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center text-invoice-text">
                        <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-invoice-text">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-invoice-text">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals with Gradient */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-sm">
              <div className="rounded-lg p-6 text-white" style={gradientStyle}>
                <h3 className="text-lg font-semibold mb-4 opacity-90">
                  Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="opacity-90">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(data.subtotal)}
                    </span>
                  </div>
                  {settings.showTax && (
                    <div className="flex justify-between">
                      <span className="opacity-90">
                        {settings.taxLabel} ({data.taxRate}%)
                      </span>
                      <span className="font-medium">
                        {formatCurrency(data.taxAmount)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(data.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {data.notes && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-invoice-header mb-4 flex items-center">
                <span
                  className="w-2 h-2 rounded-full mr-3"
                  style={{ backgroundColor: primaryColor }}
                ></span>
                Notes & Terms
              </h3>
              <div
                className="bg-gradient-to-r from-gray-50 to-transparent p-6 rounded-lg border-l-4"
                style={{ borderColor: primaryColor }}
              >
                <p className="text-invoice-text leading-relaxed">
                  {data.notes}
                </p>
              </div>
            </div>
          )}

          {/* Signature */}
          {data.signatureUrl && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-invoice-header mb-4 flex items-center">
                <span
                  className="w-2 h-2 rounded-full mr-3"
                  style={{ backgroundColor: primaryColor }}
                ></span>
                Authorized Signature
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg inline-block">
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
              <div className="flex items-center justify-center mb-2">
                <div
                  className="w-12 h-px"
                  style={{ backgroundColor: primaryColor }}
                ></div>
                <span className="mx-3">💼</span>
                <div
                  className="w-12 h-px"
                  style={{ backgroundColor: primaryColor }}
                ></div>
              </div>
              {settings.footerText}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
