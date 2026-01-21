import { InvoiceData, InvoiceSettings } from "../_types/invoice.types";
import { QrCode } from "lucide-react";

interface InvoiceTemplate5Props {
  data: InvoiceData;
  settings: InvoiceSettings;
}

export default function InvoiceTemplate5({
  data,
  settings,
}: InvoiceTemplate5Props) {
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

  const numberToWords = (num: number): string => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    if (num === 0) return "Zero";
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
      );
    if (num < 1000)
      return (
        ones[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 ? " " + numberToWords(num % 100) : "")
      );
    if (num < 100000)
      return (
        numberToWords(Math.floor(num / 1000)) +
        " Thousand" +
        (num % 1000 ? " " + numberToWords(num % 1000) : "")
      );
    if (num < 10000000)
      return (
        numberToWords(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 ? " " + numberToWords(num % 100000) : "")
      );
    return (
      numberToWords(Math.floor(num / 10000000)) +
      " Crore" +
      (num % 10000000 ? " " + numberToWords(num % 10000000) : "")
    );
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
      {/* Header with gradient */}
      <div
        className="p-4 text-white flex justify-between items-start"
        style={{
          background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor || settings.primaryColor})`,
        }}
      >
        <div className="flex items-center gap-4">
          {settings.logoUrl && printSettings.showCompanyLogo && (
            <img
              src={settings.logoUrl}
              alt="Logo"
              className="h-16 w-auto bg-white p-1 rounded"
            />
          )}
          <div>
            {printSettings.showCompanyName && (
              <h1 className="text-xl font-bold">{data.company.name}</h1>
            )}
            {printSettings.showAddress && (
              <p className="text-sm opacity-90">State: {data.company.state}</p>
            )}
          </div>
        </div>
        <div className="text-right text-sm">
          {printSettings.showPhone && data.company.phone && (
            <p>📞 {data.company.phone}</p>
          )}
          {printSettings.showAddress && data.company.address && (
            <p>📍 {data.company.address}</p>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Title */}
        <div className="text-center mb-4">
          <h2
            className="text-2xl font-bold"
            style={{ color: settings.primaryColor }}
          >
            Tax Invoice
          </h2>
        </div>

        {/* Bill To & Transportation Details */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <h3
              className="font-bold mb-2"
              style={{ color: settings.primaryColor }}
            >
              Bill To:
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-semibold">{data.customer.name}</p>
              {data.customer.address && <p>{data.customer.address}</p>}
              {data.customer.city && (
                <p>
                  {data.customer.city}, {data.customer.state}{" "}
                  {data.customer.zipCode}
                </p>
              )}
              {data.customer.phone && (
                <p>
                  <strong>Contact No.:</strong> {data.customer.phone}
                </p>
              )}
              {data.customer.gstin && printSettings.showGstin && (
                <p>
                  <strong>GSTIN Number:</strong> {data.customer.gstin}
                </p>
              )}
            </div>
          </div>
          <div>
            <h3
              className="font-bold mb-2"
              style={{ color: settings.primaryColor }}
            >
              Transportation Details:
            </h3>
            <div className="text-sm space-y-1">
              {data.transportDetails?.transportName && (
                <p>
                  <strong>Transport Name:</strong>{" "}
                  {data.transportDetails.transportName}
                </p>
              )}
              {data.transportDetails?.vehicleNumber && (
                <p>
                  <strong>Vehicle Number:</strong>{" "}
                  {data.transportDetails.vehicleNumber}
                </p>
              )}
              {data.transportDetails?.deliveryDate && (
                <p>
                  <strong>Delivery Date:</strong>{" "}
                  {formatDate(data.transportDetails.deliveryDate)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="text-sm mb-4 grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
          <div className="space-y-1">
            <p>
              <strong>Invoice No.:</strong> {data.invoiceNumber}
            </p>
            <p>
              <strong>Invoice Date:</strong> {formatDate(data.issueDate)}
            </p>
            {data.issueTime && (
              <p>
                <strong>Invoice Time:</strong> {data.issueTime}
              </p>
            )}
          </div>
          <div className="space-y-1">
            {data.placeOfSupply && (
              <p>
                <strong>Place of Supply:</strong> {data.placeOfSupply}
              </p>
            )}
            {data.poNumber && (
              <p>
                <strong>PO Number:</strong> {data.poNumber}
              </p>
            )}
            {data.poDate && (
              <p>
                <strong>PO Date:</strong> {formatDate(data.poDate)}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-sm mb-4 border-collapse">
          <thead>
            <tr
              style={{ backgroundColor: settings.primaryColor }}
              className="text-white"
            >
              <th className="border p-2 text-left">#</th>
              <th className="border p-2 text-left">Item name</th>
              {printSettings.showHsnSac && (
                <th className="border p-2">HSN/SAC</th>
              )}
              <th className="border p-2 text-right">Quantity</th>
              <th className="border p-2 text-right">Price/unit</th>
              {printSettings.showDiscount && (
                <th className="border p-2 text-right">Discount</th>
              )}
              {printSettings.showGst && (
                <th className="border p-2 text-right">{settings.taxLabel}</th>
              )}
              <th className="border p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{item.description}</td>
                {printSettings.showHsnSac && (
                  <td className="border p-2 text-center">{item.hsnSac}</td>
                )}
                <td className="border p-2 text-right">{item.quantity}</td>
                <td className="border p-2 text-right">
                  {formatCurrency(item.unitPrice)}
                </td>
                {printSettings.showDiscount && (
                  <td className="border p-2 text-right">
                    {formatCurrency(item.discount || 0)} (
                    {item.discountPercent || 0}%)
                  </td>
                )}
                {printSettings.showGst && (
                  <td className="border p-2 text-right">{item.gst || 0}%</td>
                )}
                <td className="border p-2 text-right font-semibold">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr
              className="font-bold"
              style={{ backgroundColor: settings.primaryColor, color: "white" }}
            >
              <td
                className="border p-2"
                colSpan={printSettings.showHsnSac ? 3 : 2}
              >
                Total
              </td>
              {printSettings.showTotalQuantity && (
                <td className="border p-2 text-right">{totalQuantity}</td>
              )}
              {!printSettings.showTotalQuantity && (
                <td className="border p-2"></td>
              )}
              <td className="border p-2"></td>
              {printSettings.showDiscount && (
                <td className="border p-2 text-right">
                  {formatCurrency(data.discountTotal || 0)}
                </td>
              )}
              {printSettings.showGst && (
                <td className="border p-2 text-right">
                  {formatCurrency(data.taxAmount)}
                </td>
              )}
              <td className="border p-2 text-right">
                {formatCurrency(data.totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left - Bank Details & QR */}
          <div>
            {printSettings.showBankDetails && data.bankDetails && (
              <div className="mb-4">
                <h3
                  className="font-bold mb-2"
                  style={{ color: settings.primaryColor }}
                >
                  Pay To:
                </h3>
                <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                  <p>
                    <strong>Bank Name:</strong> {data.bankDetails.bankName},
                    Branch - {data.bankDetails.branch}
                  </p>
                  <p>
                    <strong>Bank Account No.:</strong>{" "}
                    {data.bankDetails.accountNumber}
                  </p>
                  <p>
                    <strong>Bank IFSC code:</strong> {data.bankDetails.ifscCode}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 border flex items-center justify-center bg-white">
                <QrCode className="w-12 h-12" />
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: settings.primaryColor }}
              >
                UPI PAY NOW
              </span>
            </div>
          </div>

          {/* Right - Totals Summary */}
          <div className="text-sm">
            <div className="space-y-1 bg-gray-50 p-3 rounded">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>{formatCurrency(data.subtotal)}</span>
              </div>
              {printSettings.showDiscount && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>{formatCurrency(data.discountTotal || 0)}</span>
                </div>
              )}
              {printSettings.showTaxDetails && (
                <div className="flex justify-between">
                  <span>{settings.taxLabel}</span>
                  <span>{formatCurrency(data.taxAmount)}</span>
                </div>
              )}
              <div
                className="flex justify-between font-bold text-base pt-2 border-t"
                style={{ color: settings.primaryColor }}
              >
                <span>Total</span>
                <span>{formatCurrency(data.totalAmount)}</span>
              </div>
              {printSettings.showReceivedAmount &&
                data.receivedAmount !== undefined && (
                  <div className="flex justify-between">
                    <span>Received</span>
                    <span>{formatCurrency(data.receivedAmount)}</span>
                  </div>
                )}
              {printSettings.showBalanceAmount &&
                data.balanceAmount !== undefined && (
                  <div className="flex justify-between">
                    <span>Balance</span>
                    <span>{formatCurrency(data.balanceAmount)}</span>
                  </div>
                )}
              {printSettings.showPaymentMode && data.paymentMode && (
                <div className="flex justify-between text-xs">
                  <span>Payment Mode</span>
                  <span>{data.paymentMode}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        {printSettings.showAmountInWords && (
          <div className="mt-4">
            <h3 className="font-bold" style={{ color: settings.primaryColor }}>
              Invoice Amount In Words
            </h3>
            <p className="text-sm">
              {numberToWords(Math.floor(data.totalAmount))} Rupees Only
            </p>
          </div>
        )}

        {/* Terms & Signature */}
        <div className="grid grid-cols-2 gap-6 mt-4">
          {printSettings.showTermsAndConditions && data.termsAndConditions && (
            <div>
              <h3
                className="font-bold"
                style={{ color: settings.primaryColor }}
              >
                Terms And Conditions
              </h3>
              <p className="text-sm">{data.termsAndConditions}</p>
              <p className="text-sm mt-2">For, {data.company.name}</p>
            </div>
          )}
          {printSettings.showSignature && (
            <div className="text-right">
              {data.signatureUrl ? (
                <img
                  src={data.signatureUrl}
                  alt="Signature"
                  className="h-16 w-auto ml-auto"
                />
              ) : (
                <div className="h-16 border-b border-gray-400 w-32 ml-auto"></div>
              )}
              <p className="text-sm mt-1">{printSettings.signatureText}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {settings.footerText && (
          <div className="text-center mt-6 pt-4 border-t text-sm text-gray-600">
            {settings.footerText}
          </div>
        )}
      </div>
    </div>
  );
}
