import * as React from "react";

interface BillingInvoiceEmailProps {
  organizationName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
  invoiceUrl: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export const BillingInvoiceEmail: React.FC<BillingInvoiceEmailProps> = ({
  organizationName,
  invoiceNumber,
  amount,
  currency,
  periodStart,
  periodEnd,
  invoiceUrl,
  items,
}) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ margin: "0 0 20px 0", color: "#1f2937" }}>
          Invoice #{invoiceNumber}
        </h1>

        <p style={{ color: "#6b7280", marginBottom: "20px" }}>
          Hello {organizationName},
        </p>

        <p style={{ color: "#6b7280", marginBottom: "30px" }}>
          Your invoice for {periodStart} to {periodEnd} is ready.
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "30px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              <th style={{ textAlign: "left", padding: "12px 0", color: "#374151" }}>
                Description
              </th>
              <th style={{ textAlign: "right", padding: "12px 0", color: "#374151" }}>
                Qty
              </th>
              <th style={{ textAlign: "right", padding: "12px 0", color: "#374151" }}>
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 0", color: "#374151" }}>
                  {item.description}
                </td>
                <td style={{ textAlign: "right", padding: "12px 0", color: "#374151" }}>
                  {item.quantity}
                </td>
                <td style={{ textAlign: "right", padding: "12px 0", color: "#374151" }}>
                  {currency} {item.unitPrice.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "30px",
            paddingTop: "20px",
            borderTop: "2px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937" }}>
            Total: {currency} {amount.toFixed(2)}
          </div>
        </div>

        <a
          href={invoiceUrl}
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "600",
          }}
        >
          Download Invoice PDF
        </a>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e7eb",
            margin: "40px 0 20px 0",
          }}
        />

        <p style={{ fontSize: "12px", color: "#9ca3af" }}>
          This is an automated email. Please do not reply directly.
        </p>
      </div>
    </div>
  );
};
