import * as React from "react";

interface PaymentFailedProps {
  organizationName: string;
  amount: number;
  currency: string;
  nextRetryDate: string;
  updatePaymentUrl: string;
}

export const PaymentFailedEmail: React.FC<PaymentFailedProps> = ({
  organizationName,
  amount,
  currency,
  nextRetryDate,
  updatePaymentUrl,
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
          borderLeft: "4px solid #f59e0b",
        }}
      >
        <h1 style={{ margin: "0 0 20px 0", color: "#f59e0b" }}>
          ⚠️ Payment Failed
        </h1>

        <p style={{ color: "#6b7280", marginBottom: "20px" }}>
          Hello {organizationName},
        </p>

        <p style={{ color: "#6b7280", marginBottom: "30px" }}>
          Your recent payment attempt failed. Please update your payment method
          to avoid service interruption.
        </p>

        <div
          style={{
            backgroundColor: "#fffbeb",
            padding: "20px",
            borderRadius: "6px",
            marginBottom: "30px",
            borderLeft: "4px solid #f59e0b",
          }}
        >
          <p style={{ margin: "0 0 10px 0", color: "#374151" }}>
            <strong>Amount:</strong> {currency} {amount.toFixed(2)}
          </p>
          <p style={{ margin: "0", color: "#374151" }}>
            <strong>Next Retry:</strong> {nextRetryDate}
          </p>
        </div>

        <a
          href={updatePaymentUrl}
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#f59e0b",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "600",
          }}
        >
          Update Payment Method
        </a>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e7eb",
            margin: "40px 0 20px 0",
          }}
        />

        <p style={{ fontSize: "12px", color: "#9ca3af" }}>
          If you have any questions, please contact our support team.
        </p>
      </div>
    </div>
  );
};
