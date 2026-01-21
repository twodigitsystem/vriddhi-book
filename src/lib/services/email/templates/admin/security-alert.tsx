import * as React from "react";

interface SecurityBreachAlertProps {
  organizationName: string;
  incidentType: string;
  detectedAt: string;
  affectedUsers: number;
  actionUrl: string;
}

export const SecurityBreachAlertEmail: React.FC<SecurityBreachAlertProps> = ({
  organizationName,
  incidentType,
  detectedAt,
  affectedUsers,
  actionUrl,
}) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#fef2f2",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "8px",
          borderLeft: "4px solid #dc2626",
        }}
      >
        <h1 style={{ margin: "0 0 20px 0", color: "#dc2626" }}>
          🚨 Security Alert
        </h1>

        <p style={{ color: "#374151", fontSize: "16px", marginBottom: "20px" }}>
          We detected a potential security incident in your{" "}
          <strong>{organizationName}</strong> account.
        </p>

        <div
          style={{
            backgroundColor: "#ffebee",
            padding: "20px",
            borderRadius: "6px",
            marginBottom: "30px",
            borderLeft: "4px solid #dc2626",
          }}
        >
          <p style={{ margin: "0 0 10px 0", color: "#374151" }}>
            <strong>Incident Type:</strong> {incidentType}
          </p>
          <p style={{ margin: "0 0 10px 0", color: "#374151" }}>
            <strong>Detected:</strong> {detectedAt}
          </p>
          <p style={{ margin: "0", color: "#374151" }}>
            <strong>Affected Users:</strong> {affectedUsers}
          </p>
        </div>

        <p
          style={{
            color: "#374151",
            fontSize: "16px",
            marginBottom: "15px",
            fontWeight: "600",
          }}
        >
          We recommend you take the following actions immediately:
        </p>

        <ul style={{ color: "#374151", marginBottom: "30px" }}>
          <li style={{ marginBottom: "10px" }}>
            Reset all passwords immediately
          </li>
          <li style={{ marginBottom: "10px" }}>
            Enable 2FA for all accounts
          </li>
          <li style={{ marginBottom: "10px" }}>
            Review recent access logs
          </li>
          <li style={{ marginBottom: "10px" }}>
            Contact support if you need assistance
          </li>
        </ul>

        <a
          href={actionUrl}
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#dc2626",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "600",
          }}
        >
          View Incident Details
        </a>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e7eb",
            margin: "40px 0 20px 0",
          }}
        />

        <p style={{ fontSize: "12px", color: "#9ca3af" }}>
          This is an automated security alert. If you did not request this,
          please contact support immediately.
        </p>
      </div>
    </div>
  );
};
