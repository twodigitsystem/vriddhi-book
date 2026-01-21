import { InvoiceData, InvoiceSettings } from "../_types/invoice.types";
import { QrCode } from "lucide-react";

interface InvoiceTemplate8Props {
  data: InvoiceData;
  settings: InvoiceSettings;
}

export default function InvoiceTemplate8({
  data,
  settings,
}: InvoiceTemplate8Props) {
  const { printSettings } = settings;

  const formatCurrency = (amount: number) => {
    if (printSettings.printAmountWithGrouping) {
      return `₹${amount.toLocaleString("en-IN", {
        minimumFractionDigits: printSettings.showAmountWithDecimal ? 2 : 0,
        maximumFractionDigits: printSettings.showAmountWithDecimal ? 2 : 0,
      })}`;
    }
    return `₹${amount.toFixed(printSettings.showAmountWithDecimal ? 2 : 0)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const totalQuantity = data.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div
      className="bg-white text-gray-800 print:shadow-none w-full"
      style={{ fontFamily: settings.fontFamily }}
    >
      {/* Header */}
      <div className="relative">
        <div
          className="absolute top-0 right-0 w-1/3 h-32 rounded-bl-[100px]"
          style={{ backgroundColor: `${settings.primaryColor}15` }}
        ></div>
        <div className="p-8 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              {settings.logoUrl && printSettings.showCompanyLogo && (
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  className="h-14 w-auto mb-4"
                />
              )}
              {printSettings.showCompanyName && (
                <h1
                  className="text-3xl font-light tracking-wide"
                  style={{ color: settings.primaryColor }}
                >
                  {data.company.name}
                </h1>
              )}
              <div className="text-sm text-gray-500 mt-2 space-y-0.5">
                {printSettings.showAddress && (
                  <p>
                    {data.company.address}, {data.company.city},{" "}
                    {data.company.state}
                  </p>
                )}
                {printSettings.showPhone && <p>{data.company.phone}</p>}
                {printSettings.showEmail && <p>{data.company.email}</p>}
                {printSettings.showGstin && data.company.gstin && (
                  <p className="font-medium text-gray-700">
                    GSTIN: {data.company.gstin}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <h2
                className="text-4xl font-thin tracking-widest mb-2"
                style={{ color: settings.primaryColor }}
              >
                INVOICE
              </h2>
              <p className="text-2xl font-light text-gray-400">
                {data.invoiceNumber}
              </p>
              <div className="mt-4 text-sm text-gray-600">
                <p>Date: {formatDate(data.issueDate)}</p>
                <p>Due: {formatDate(data.dueDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="mx-8 h-px"
        style={{ backgroundColor: settings.primaryColor }}
      ></div>

      <div className="p-8">
        {/* Bill To */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
            Bill To
          </p>
          <div className="flex justify-between">
            <div>
              <p
                className="text-xl font-medium"
                style={{ color: settings.primaryColor }}
              >
                {data.customer.name}
              </p>
              <div className="text-sm text-gray-600 mt-1">
                {data.customer.address && <p>{data.customer.address}</p>}
                <p>
                  {[
                    data.customer.city,
                    data.customer.state,
                    data.customer.zipCode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {data.customer.phone && <p>Phone: {data.customer.phone}</p>}
                {data.customer.gstin && printSettings.showGstin && (
                  <p className="font-medium mt-1">
                    GSTIN: {data.customer.gstin}
                  </p>
                )}
              </div>
            </div>
            {(data.placeOfSupply || data.poNumber) && (
              <div className="text-right text-sm">
                {data.placeOfSupply && (
                  <p>
                    <span className="text-gray-400">Place of Supply:</span>{" "}
                    {data.placeOfSupply}
                  </p>
                )}
                {data.poNumber && (
                  <p>
                    <span className="text-gray-400">PO Number:</span>{" "}
                    {data.poNumber}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <table className="w-full text-sm mb-8">
          <thead>
            <tr
              className="border-b-2"
              style={{ borderColor: settings.primaryColor }}
            >
              <th className="py-3 text-left font-medium text-gray-400 uppercase text-xs tracking-wider">
                Item
              </th>
              {printSettings.showHsnSac && (
                <th className="py-3 text-center font-medium text-gray-400 uppercase text-xs tracking-wider">
                  HSN
                </th>
              )}
              <th className="py-3 text-center font-medium text-gray-400 uppercase text-xs tracking-wider">
                Qty
              </th>
              <th className="py-3 text-right font-medium text-gray-400 uppercase text-xs tracking-wider">
                Rate
              </th>
              {printSettings.showDiscount && (
                <th className="py-3 text-right font-medium text-gray-400 uppercase text-xs tracking-wider">
                  Disc
                </th>
              )}
              {printSettings.showGst && (
                <th className="py-3 text-center font-medium text-gray-400 uppercase text-xs tracking-wider">
                  {settings.taxLabel}
                </th>
              )}
              <th className="py-3 text-right font-medium text-gray-400 uppercase text-xs tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-4">
                  <p className="font-medium">{item.description}</p>
                </td>
                {printSettings.showHsnSac && (
                  <td className="py-4 text-center text-gray-500">
                    {item.hsnSac}
                  </td>
                )}
                <td className="py-4 text-center">{item.quantity}</td>
                <td className="py-4 text-right">
                  {formatCurrency(item.unitPrice)}
                </td>
                {printSettings.showDiscount && (
                  <td className="py-4 text-right text-green-600">
                    {item.discountPercent || 0}%
                  </td>
                )}
                {printSettings.showGst && (
                  <td className="py-4 text-center">{item.gst || 0}%</td>
                )}
                <td className="py-4 text-right font-medium">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatCurrency(data.subtotal)}</span>
              </div>
              {printSettings.showDiscount && data.discountTotal && (
                <div className="flex justify-between py-1 text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(data.discountTotal)}</span>
                </div>
              )}
              {printSettings.showTaxDetails && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">{settings.taxLabel}</span>
                  <span>{formatCurrency(data.taxAmount)}</span>
                </div>
              )}
              <div
                className="flex justify-between py-3 text-xl font-light border-t-2 mt-2"
                style={{ borderColor: settings.primaryColor }}
              >
                <span>Total</span>
                <span style={{ color: settings.primaryColor }}>
                  {formatCurrency(data.totalAmount)}
                </span>
              </div>
              {printSettings.showReceivedAmount &&
                data.receivedAmount !== undefined && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Received</span>
                    <span className="text-green-600">
                      {formatCurrency(data.receivedAmount)}
                    </span>
                  </div>
                )}
              {printSettings.showBalanceAmount &&
                data.balanceAmount !== undefined && (
                  <div className="flex justify-between py-1 font-medium">
                    <span>Balance Due</span>
                    <span className="text-red-500">
                      {formatCurrency(data.balanceAmount)}
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Bank & Signature */}
        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-200">
          <div>
            {printSettings.showBankDetails && data.bankDetails && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Payment Information
                </p>
                <div className="text-sm space-y-1">
                  <p>
                    {data.bankDetails.bankName} - {data.bankDetails.branch}
                  </p>
                  <p>A/C: {data.bankDetails.accountNumber}</p>
                  <p>IFSC: {data.bankDetails.ifscCode}</p>
                </div>
              </div>
            )}
            {printSettings.showTermsAndConditions &&
              data.termsAndConditions && (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                    Terms
                  </p>
                  <p className="text-xs text-gray-500">
                    {data.termsAndConditions}
                  </p>
                </div>
              )}
          </div>
          <div className="text-right">
            {printSettings.showSignature && (
              <div>
                {data.signatureUrl ? (
                  <img
                    src={data.signatureUrl}
                    alt="Signature"
                    className="h-14 w-auto ml-auto"
                  />
                ) : (
                  <div
                    className="h-14 w-36 border-b ml-auto"
                    style={{ borderColor: settings.primaryColor }}
                  ></div>
                )}
                <p className="text-sm mt-2 text-gray-500">
                  {printSettings.signatureText}
                </p>
                <p className="text-sm font-medium">For {data.company.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {settings.footerText && (
          <div className="text-center mt-8 pt-4 text-sm text-gray-400">
            {settings.footerText}
          </div>
        )}
      </div>
    </div>
  );
}
