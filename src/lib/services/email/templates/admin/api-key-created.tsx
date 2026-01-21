import * as React from "react";

interface ApiKeyCreatedProps {
  organizationName: string;
  keyName: string;
  createdAt: string;
  manageUrl: string;
}

export const ApiKeyCreatedEmail: React.FC<ApiKeyCreatedProps> = ({
  organizationName,
  keyName,
  createdAt,
  manageUrl,
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
          API Key Created
        </h1>

        <p style={{ color: "#6b7280", marginBottom: "20px" }}>
          A new API key has been created for your {organizationName} account.
        </p>

        <div
          style={{
            backgroundColor: "#f0f9ff",
            padding: "20px",
            borderRadius: "6px",
            marginBottom: "30px",
            borderLeft: "4px solid #3b82f6",
          }}
        >
          <p style={{ margin: "0 0 10px 0", color: "#374151" }}>
            <strong>Key Name:</strong> {keyName}
          </p>
          <p style={{ margin: "0", color: "#374151" }}>
            <strong>Created:</strong> {createdAt}
          </p>
        </div>

        <p style={{ color: "#6b7280", marginBottom: "20px" }}>
          Keep your API keys secure and never share them. If you did not create
          this key, please revoke it immediately in your account settings.
        </p>

        <a
          href={manageUrl}
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
          Manage API Keys
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
