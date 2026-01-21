import { InvoiceData, InvoiceSettings } from "../_types/invoice.types";

interface InvoiceTemplate7Props {
  data: InvoiceData;
  settings: InvoiceSettings;
}

export default function InvoiceTemplate7({
  data,
  settings,
}: InvoiceTemplate7Props) {
  const { printSettings } = settings;

  const formatCurrency = (amount: number) => {
    if (printSettings.printAmountWithGrouping) {
      return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: printSettings.showAmountWithDecimal ? 2 : 0,
        maximumFractionDigits: printSettings.showAmountWithDecimal ? 2 : 0,
      })}`;
    }
    return `₹ ${amount.toFixed(printSettings.showAmountWithDecimal ? 2 : 0)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const totalQuantity = data.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div
      className="bg-white text-black print:shadow-none w-full"
      style={{ fontFamily: settings.fontFamily }}
    >
      {/* Decorative Top Border */}
      <div
        className="h-2"
        style={{ backgroundColor: settings.primaryColor }}
      ></div>

      <div className="p-6">
        {/* Header */}
        <div
          className="flex justify-between items-start mb-6 pb-6 border-b-2 border-dashed"
          style={{ borderColor: settings.primaryColor }}
        >
          <div className="flex items-center gap-4">
            {settings.logoUrl && printSettings.showCompanyLogo && (
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${settings.primaryColor}15` }}
              >
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  className="h-16 w-auto"
                />
              </div>
            )}
            <div>
              {printSettings.showCompanyName && (
                <h1
                  className="text-2xl font-black tracking-tight"
                  style={{ color: settings.primaryColor }}
                >
                  {data.company.name}
                </h1>
              )}
              <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                {printSettings.showAddress && data.company.address && (
                  <p>
                    {data.company.address}, {data.company.city}
                  </p>
                )}
                {printSettings.showPhone && <p>📞 {data.company.phone}</p>}
                {printSettings.showEmail && <p>✉️ {data.company.email}</p>}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div
              className="inline-block px-6 py-2 rounded-full text-white text-sm font-bold"
              style={{ backgroundColor: settings.primaryColor }}
            >
              TAX INVOICE
            </div>
            <div className="mt-3 text-sm">
              <p className="font-bold text-lg">{data.invoiceNumber}</p>
              <p className="text-gray-500">{formatDate(data.issueDate)}</p>
            </div>
          </div>
        </div>

        {/* Customer & Invoice Details */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div
            className="col-span-2 p-4 rounded-xl"
            style={{ backgroundColor: `${settings.primaryColor}08` }}
          >
            <p
              className="text-xs uppercase tracking-wider font-semibold mb-2"
              style={{ color: settings.primaryColor }}
            >
              Billed To
            </p>
            <p className="font-bold text-lg">{data.customer.name}</p>
            <div className="text-sm text-gray-600 mt-1 space-y-0.5">
              {data.customer.address && <p>{data.customer.address}</p>}
              {data.customer.city && (
                <p>
                  {data.customer.city}, {data.customer.state} -{" "}
                  {data.customer.zipCode}
                </p>
              )}
              {data.customer.phone && <p>Phone: {data.customer.phone}</p>}
              {data.customer.gstin && printSettings.showGstin && (
                <p className="font-medium">GSTIN: {data.customer.gstin}</p>
              )}
            </div>
          </div>
          <div
            className="p-4 border-2 rounded-xl"
            style={{ borderColor: `${settings.primaryColor}30` }}
          >
            <p
              className="text-xs uppercase tracking-wider font-semibold mb-2"
              style={{ color: settings.primaryColor }}
            >
              Details
            </p>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-gray-500">Due:</span>{" "}
                {formatDate(data.dueDate)}
              </p>
              {data.placeOfSupply && (
                <p>
                  <span className="text-gray-500">Supply:</span>{" "}
                  {data.placeOfSupply}
                </p>
              )}
              {data.poNumber && (
                <p>
                  <span className="text-gray-500">PO:</span> {data.poNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div
          className="mb-6 rounded-xl overflow-hidden border-2"
          style={{ borderColor: `${settings.primaryColor}30` }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-white"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Item Description</th>
                {printSettings.showHsnSac && (
                  <th className="p-3 text-center">HSN</th>
                )}
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Rate</th>
                {printSettings.showDiscount && (
                  <th className="p-3 text-right">Disc.</th>
                )}
                {printSettings.showGst && (
                  <th className="p-3 text-center">{settings.taxLabel}</th>
                )}
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td
                    className="p-3 font-medium"
                    style={{ color: settings.primaryColor }}
                  >
                    {index + 1}
                  </td>
                  <td className="p-3 font-medium">{item.description}</td>
                  {printSettings.showHsnSac && (
                    <td className="p-3 text-center text-gray-500">
                      {item.hsnSac}
                    </td>
                  )}
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  {printSettings.showDiscount && (
                    <td className="p-3 text-right text-green-600">
                      {item.discountPercent || 0}%
                    </td>
                  )}
                  {printSettings.showGst && (
                    <td className="p-3 text-center">{item.gst || 0}%</td>
                  )}
                  <td className="p-3 text-right font-bold">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-5 gap-4">
          {/* Bank Details */}
          <div className="col-span-2">
            {printSettings.showBankDetails && data.bankDetails && (
              <div className="p-4 rounded-xl border">
                <p
                  className="text-xs uppercase tracking-wider font-semibold mb-2"
                  style={{ color: settings.primaryColor }}
                >
                  Payment Details
                </p>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-gray-500">Bank:</span>{" "}
                    {data.bankDetails.bankName}
                  </p>
                  <p>
                    <span className="text-gray-500">Account:</span>{" "}
                    {data.bankDetails.accountNumber}
                  </p>
                  <p>
                    <span className="text-gray-500">IFSC:</span>{" "}
                    {data.bankDetails.ifscCode}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="col-span-3">
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: `${settings.primaryColor}08` }}
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(data.subtotal)}
                  </span>
                </div>
                {printSettings.showDiscount && data.discountTotal && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(data.discountTotal)}</span>
                  </div>
                )}
                {printSettings.showTaxDetails && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{settings.taxLabel}</span>
                    <span className="font-medium">
                      {formatCurrency(data.taxAmount)}
                    </span>
                  </div>
                )}
                <div
                  className="flex justify-between text-lg font-black pt-3 mt-2 border-t-2"
                  style={{
                    borderColor: settings.primaryColor,
                    color: settings.primaryColor,
                  }}
                >
                  <span>GRAND TOTAL</span>
                  <span>{formatCurrency(data.totalAmount)}</span>
                </div>
                {printSettings.showReceivedAmount &&
                  data.receivedAmount !== undefined && (
                    <div className="flex justify-between pt-2">
                      <span className="text-gray-600">Received</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(data.receivedAmount)}
                      </span>
                    </div>
                  )}
                {printSettings.showBalanceAmount &&
                  data.balanceAmount !== undefined && (
                    <div className="flex justify-between font-bold text-red-500">
                      <span>Balance Due</span>
                      <span>{formatCurrency(data.balanceAmount)}</span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Signature */}
        <div
          className="mt-6 pt-4 border-t-2 border-dashed grid grid-cols-2 gap-6"
          style={{ borderColor: `${settings.primaryColor}30` }}
        >
          {printSettings.showTermsAndConditions && data.termsAndConditions && (
            <div>
              <p
                className="text-xs uppercase tracking-wider font-semibold mb-1"
                style={{ color: settings.primaryColor }}
              >
                Terms & Conditions
              </p>
              <p className="text-xs text-gray-600">{data.termsAndConditions}</p>
            </div>
          )}
          {printSettings.showSignature && (
            <div className="text-right">
              {data.signatureUrl ? (
                <img
                  src={data.signatureUrl}
                  alt="Signature"
                  className="h-12 w-auto ml-auto"
                />
              ) : (
                <div
                  className="h-12 w-32 border-b-2 ml-auto"
                  style={{ borderColor: settings.primaryColor }}
                ></div>
              )}
              <p className="text-xs mt-1 text-gray-600">
                {printSettings.signatureText}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {settings.footerText && (
          <div className="text-center mt-6 pt-4 text-sm text-gray-500">
            {settings.footerText}
          </div>
        )}
      </div>

      {/* Decorative Bottom Border */}
      <div
        className="h-2"
        style={{ backgroundColor: settings.primaryColor }}
      ></div>
    </div>
  );
}
