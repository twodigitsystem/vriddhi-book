import { InvoiceData, InvoiceSettings } from "../_types/invoice.types";

interface InvoiceTemplate6Props {
  data: InvoiceData;
  settings: InvoiceSettings;
}

export default function InvoiceTemplate6({
  data,
  settings,
}: InvoiceTemplate6Props) {
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
      month: "short",
      year: "numeric",
    });
  };

  const totalQuantity = data.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div
      className="bg-white text-black print:shadow-none w-full min-h-200"
      style={{ fontFamily: settings.fontFamily }}
    >
      {/* Header */}
      <div
        className="border-b-4"
        style={{ borderColor: settings.primaryColor }}
      >
        <div className="p-6 flex justify-between items-start">
          <div className="flex items-start gap-4">
            {settings.logoUrl && printSettings.showCompanyLogo && (
              <img src={settings.logoUrl} alt="Logo" className="h-20 w-auto" />
            )}
            <div>
              {printSettings.showCompanyName && (
                <h1
                  className="text-2xl font-bold"
                  style={{ color: settings.primaryColor }}
                >
                  {data.company.name}
                </h1>
              )}
              {printSettings.showAddress && (
                <p className="text-sm text-gray-600 mt-1">
                  {[data.company.address, data.company.city, data.company.state]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {printSettings.showPhone && data.company.phone && (
                <p className="text-sm text-gray-600">
                  Tel: {data.company.phone}
                </p>
              )}
              {printSettings.showEmail && data.company.email && (
                <p className="text-sm text-gray-600">
                  Email: {data.company.email}
                </p>
              )}
              {printSettings.showGstin && data.company.gstin && (
                <p className="text-sm font-semibold mt-1">
                  GSTIN: {data.company.gstin}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <h2
              className="text-3xl font-bold tracking-wider"
              style={{ color: settings.primaryColor }}
            >
              INVOICE
            </h2>
            <div className="mt-2 text-sm space-y-1">
              <p>
                <span className="text-gray-500">Invoice #:</span>{" "}
                <strong>{data.invoiceNumber}</strong>
              </p>
              <p>
                <span className="text-gray-500">Date:</span>{" "}
                {formatDate(data.issueDate)}
              </p>
              <p>
                <span className="text-gray-500">Due Date:</span>{" "}
                {formatDate(data.dueDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Bill To Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: `${settings.primaryColor}10` }}
          >
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              Bill To
            </h3>
            <p className="font-bold text-lg">{data.customer.name}</p>
            {data.customer.address && (
              <p className="text-sm text-gray-600">{data.customer.address}</p>
            )}
            {(data.customer.city || data.customer.state) && (
              <p className="text-sm text-gray-600">
                {[
                  data.customer.city,
                  data.customer.state,
                  data.customer.zipCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
            {data.customer.phone && (
              <p className="text-sm text-gray-600 mt-1">
                Phone: {data.customer.phone}
              </p>
            )}
            {data.customer.email && (
              <p className="text-sm text-gray-600">
                Email: {data.customer.email}
              </p>
            )}
            {data.customer.gstin && printSettings.showGstin && (
              <p className="text-sm font-semibold mt-1">
                GSTIN: {data.customer.gstin}
              </p>
            )}
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              Invoice Details
            </h3>
            <div className="space-y-2 text-sm">
              {data.placeOfSupply && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Place of Supply:</span>
                  <span>{data.placeOfSupply}</span>
                </div>
              )}
              {data.poNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-500">PO Number:</span>
                  <span>{data.poNumber}</span>
                </div>
              )}
              {data.transportDetails?.vehicleNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Vehicle:</span>
                  <span>{data.transportDetails.vehicleNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8 overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{ backgroundColor: settings.primaryColor }}
                className="text-white"
              >
                <th className="p-3 text-left font-semibold">S.No</th>
                <th className="p-3 text-left font-semibold">Description</th>
                {printSettings.showHsnSac && (
                  <th className="p-3 text-center font-semibold">HSN/SAC</th>
                )}
                <th className="p-3 text-center font-semibold">Qty</th>
                <th className="p-3 text-right font-semibold">Rate</th>
                {printSettings.showDiscount && (
                  <th className="p-3 text-right font-semibold">Discount</th>
                )}
                {printSettings.showGst && (
                  <th className="p-3 text-center font-semibold">
                    {settings.taxLabel}%
                  </th>
                )}
                <th className="p-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="p-3 border-b">{index + 1}</td>
                  <td className="p-3 border-b">{item.description}</td>
                  {printSettings.showHsnSac && (
                    <td className="p-3 border-b text-center">
                      {item.hsnSac || "-"}
                    </td>
                  )}
                  <td className="p-3 border-b text-center">{item.quantity}</td>
                  <td className="p-3 border-b text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  {printSettings.showDiscount && (
                    <td className="p-3 border-b text-right">
                      {formatCurrency(item.discount || 0)}
                    </td>
                  )}
                  {printSettings.showGst && (
                    <td className="p-3 border-b text-center">
                      {item.gst || 0}%
                    </td>
                  )}
                  <td className="p-3 border-b text-right font-medium">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td className="p-3" colSpan={printSettings.showHsnSac ? 3 : 2}>
                  Total
                </td>
                <td className="p-3 text-center">
                  {printSettings.showTotalQuantity && totalQuantity}
                </td>
                <td className="p-3"></td>
                {printSettings.showDiscount && (
                  <td className="p-3 text-right">
                    {formatCurrency(data.discountTotal || 0)}
                  </td>
                )}
                {printSettings.showGst && <td className="p-3"></td>}
                <td className="p-3 text-right">
                  {formatCurrency(data.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            {printSettings.showBankDetails && data.bankDetails && (
              <div className="p-4 border rounded-lg mb-4">
                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                  Bank Details
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Bank:</strong> {data.bankDetails.bankName}
                  </p>
                  <p>
                    <strong>A/C No:</strong> {data.bankDetails.accountNumber}
                  </p>
                  <p>
                    <strong>IFSC:</strong> {data.bankDetails.ifscCode}
                  </p>
                  <p>
                    <strong>Branch:</strong> {data.bankDetails.branch}
                  </p>
                </div>
              </div>
            )}
            {printSettings.showTermsAndConditions &&
              data.termsAndConditions && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                    Terms & Conditions
                  </h3>
                  <p className="text-sm text-gray-600">
                    {data.termsAndConditions}
                  </p>
                </div>
              )}
          </div>
          <div>
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${settings.primaryColor}10` }}
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(data.subtotal)}</span>
                </div>
                {printSettings.showDiscount && data.discountTotal && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(data.discountTotal)}</span>
                  </div>
                )}
                {printSettings.showTaxDetails && (
                  <div className="flex justify-between">
                    <span>{settings.taxLabel}:</span>
                    <span>{formatCurrency(data.taxAmount)}</span>
                  </div>
                )}
                <div
                  className="flex justify-between text-lg font-bold pt-2 border-t"
                  style={{ borderColor: settings.primaryColor }}
                >
                  <span>Total:</span>
                  <span style={{ color: settings.primaryColor }}>
                    {formatCurrency(data.totalAmount)}
                  </span>
                </div>
                {printSettings.showReceivedAmount &&
                  data.receivedAmount !== undefined && (
                    <div className="flex justify-between">
                      <span>Received:</span>
                      <span>{formatCurrency(data.receivedAmount)}</span>
                    </div>
                  )}
                {printSettings.showBalanceAmount &&
                  data.balanceAmount !== undefined && (
                    <div className="flex justify-between font-semibold text-red-600">
                      <span>Balance Due:</span>
                      <span>{formatCurrency(data.balanceAmount)}</span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Signature */}
        {printSettings.showSignature && (
          <div className="mt-8 text-right">
            <div className="inline-block">
              {data.signatureUrl ? (
                <img
                  src={data.signatureUrl}
                  alt="Signature"
                  className="h-16 w-auto"
                />
              ) : (
                <div
                  className="h-16 w-40 border-b-2"
                  style={{ borderColor: settings.primaryColor }}
                ></div>
              )}
              <p className="text-sm mt-2 text-gray-600">
                {printSettings.signatureText}
              </p>
              <p className="text-sm font-semibold">For {data.company.name}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        {settings.footerText && (
          <div className="text-center mt-8 pt-4 border-t text-sm text-gray-500">
            {settings.footerText}
          </div>
        )}
      </div>
    </div>
  );
}
