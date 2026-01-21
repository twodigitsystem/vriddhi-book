import { PrintSettings } from "../_types/invoice.types";
import { SettingRow } from "./SettingRow";
import { SectionHeader } from "./SectionHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PrintSettingsSectionsProps {
  settings: PrintSettings;
  companyName: string;
  address: string;
  email: string;
  phone: string;
  onSettingsChange: (key: keyof PrintSettings, value: any) => void;
  onCompanyInfoChange: (key: string, value: string) => void;
}

export function PrintSettingsSections({
  settings,
  companyName,
  address,
  email,
  phone,
  onSettingsChange,
  onCompanyInfoChange,
}: PrintSettingsSectionsProps) {
  return (
    <div className="space-y-6">
      {/* Print Company Info / Header */}
      <div>
        <SectionHeader title="Print Company Info / Header" />
        <div className="space-y-4">
          <SettingRow
            id="regular-printer-default"
            label="Make Regular Printer Default"
            checked={true}
            onCheckedChange={() => {}}
            tooltip="Set as default printer"
          />

          <SettingRow
            id="repeat-header"
            label="Print repeat header in all pages"
            checked={settings.repeatHeaderOnPages}
            onCheckedChange={(checked) =>
              onSettingsChange("repeatHeaderOnPages", checked)
            }
            tooltip="Repeat header on each page"
          />

          <SettingRow
            id="company-name"
            label="Company Name"
            checked={settings.showCompanyName}
            onCheckedChange={(checked) =>
              onSettingsChange("showCompanyName", checked)
            }
            hasInput
            inputValue={companyName}
            onInputChange={(value) => onCompanyInfoChange("companyName", value)}
          />

          <SettingRow
            id="company-logo"
            label="Company Logo"
            checked={settings.showCompanyLogo}
            onCheckedChange={(checked) =>
              onSettingsChange("showCompanyLogo", checked)
            }
          />

          <SettingRow
            id="address"
            label="Address"
            checked={settings.showAddress}
            onCheckedChange={(checked) =>
              onSettingsChange("showAddress", checked)
            }
            hasInput
            inputValue={address}
            onInputChange={(value) => onCompanyInfoChange("address", value)}
          />

          <SettingRow
            id="email"
            label="Email"
            checked={settings.showEmail}
            onCheckedChange={(checked) =>
              onSettingsChange("showEmail", checked)
            }
            hasInput
            inputValue={email}
            onInputChange={(value) => onCompanyInfoChange("email", value)}
            inputPlaceholder="Email"
          />

          <SettingRow
            id="phone"
            label="Phone Number"
            checked={settings.showPhone}
            onCheckedChange={(checked) =>
              onSettingsChange("showPhone", checked)
            }
            hasInput
            inputValue={phone}
            onInputChange={(value) => onCompanyInfoChange("phone", value)}
          />

          <SettingRow
            id="gstin"
            label="GSTIN on Sale"
            checked={settings.showGstin}
            onCheckedChange={(checked) =>
              onSettingsChange("showGstin", checked)
            }
          />
        </div>
      </div>

      {/* Paper & Size Settings */}
      <div>
        <SectionHeader title="Paper & Size Settings" />
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="min-w-0">
              <Label className="text-sm text-muted-foreground flex-wrap whitespace-normal leading-snug">
                Paper Size
              </Label>
              <Select
                value={settings.paperSize}
                onValueChange={(value) => onSettingsChange("paperSize", value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="A5">A5</SelectItem>
                  <SelectItem value="Letter">Letter</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0">
              <Label className="text-sm text-muted-foreground flex-wrap whitespace-normal leading-snug">
                Company Name Text Size
              </Label>
              <Select
                value={settings.companyNameSize}
                onValueChange={(value) =>
                  onSettingsChange("companyNameSize", value)
                }
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">V. small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="min-w-0">
              <Label className="text-sm text-muted-foreground flex-wrap whitespace-normal leading-snug">
                Invoice Text Size
              </Label>
              <Select
                value={settings.invoiceTextSize}
                onValueChange={(value) =>
                  onSettingsChange("invoiceTextSize", value)
                }
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0">
              <Label className="text-sm text-muted-foreground flex-wrap whitespace-normal leading-snug">
                Extra space on Top of PDF
              </Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={settings.extraSpaceOnTop}
                onChange={(e) =>
                  onSettingsChange(
                    "extraSpaceOnTop",
                    parseInt(e.target.value) || 0
                  )
                }
                className="mt-1 w-full"
              />
            </div>
          </div>

          <SettingRow
            id="print-original-duplicate"
            label="Print Original/Duplicate"
            checked={settings.printOriginalDuplicate}
            onCheckedChange={(checked) =>
              onSettingsChange("printOriginalDuplicate", checked)
            }
            tooltip="Print as original or duplicate"
          />
        </div>
      </div>

      {/* Item Table */}
      <div>
        <SectionHeader title="Item Table" />
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Label className="text-sm text-muted-foreground flex-wrap whitespace-normal leading-snug">
              Min No. of Rows in Item Table
            </Label>
            <Input
              type="number"
              min={0}
              max={50}
              value={settings.minRowsInTable}
              onChange={(e) =>
                onSettingsChange(
                  "minRowsInTable",
                  parseInt(e.target.value) || 0
                )
              }
              className="w-20"
            />
          </div>

          <SettingRow
            id="show-hsn-sac"
            label="Show HSN/SAC"
            checked={settings.showHsnSac}
            onCheckedChange={(checked) =>
              onSettingsChange("showHsnSac", checked)
            }
          />

          <SettingRow
            id="show-discount"
            label="Show Discount"
            checked={settings.showDiscount}
            onCheckedChange={(checked) =>
              onSettingsChange("showDiscount", checked)
            }
          />

          <SettingRow
            id="show-gst"
            label="Show GST"
            checked={settings.showGst}
            onCheckedChange={(checked) => onSettingsChange("showGst", checked)}
          />
        </div>
      </div>

      {/* Totals & Taxes */}
      <div>
        <SectionHeader title="Totals & Taxes" />
        <div className="space-y-4">
          <SettingRow
            id="total-quantity"
            label="Total Item Quantity"
            checked={settings.showTotalQuantity}
            onCheckedChange={(checked) =>
              onSettingsChange("showTotalQuantity", checked)
            }
            tooltip="Show total quantity"
          />

          <SettingRow
            id="amount-decimal"
            label="Amount with Decimal e.g. 0.00"
            checked={settings.showAmountWithDecimal}
            onCheckedChange={(checked) =>
              onSettingsChange("showAmountWithDecimal", checked)
            }
            tooltip="Show decimal places"
          />

          <SettingRow
            id="received-amount"
            label="Received Amount"
            checked={settings.showReceivedAmount}
            onCheckedChange={(checked) =>
              onSettingsChange("showReceivedAmount", checked)
            }
            tooltip="Show received amount"
          />

          <SettingRow
            id="balance-amount"
            label="Balance Amount"
            checked={settings.showBalanceAmount}
            onCheckedChange={(checked) =>
              onSettingsChange("showBalanceAmount", checked)
            }
            tooltip="Show balance amount"
          />

          <SettingRow
            id="current-balance"
            label="Current Balance of Party"
            checked={settings.showCurrentBalance}
            onCheckedChange={(checked) =>
              onSettingsChange("showCurrentBalance", checked)
            }
            tooltip="Show current balance"
          />

          <SettingRow
            id="tax-details"
            label="Tax Details"
            checked={settings.showTaxDetails}
            onCheckedChange={(checked) =>
              onSettingsChange("showTaxDetails", checked)
            }
            tooltip="Show tax details"
          />

          <SettingRow
            id="you-saved"
            label="You Saved"
            checked={settings.showYouSaved}
            onCheckedChange={(checked) =>
              onSettingsChange("showYouSaved", checked)
            }
          />

          <SettingRow
            id="amount-grouping"
            label="Print Amount with Grouping"
            checked={settings.printAmountWithGrouping}
            onCheckedChange={(checked) =>
              onSettingsChange("printAmountWithGrouping", checked)
            }
            tooltip="Add grouping to amounts"
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Label className="text-sm text-muted-foreground flex-wrap whitespace-normal leading-snug">
              Amount in Words
            </Label>
            <Select
              value={settings.amountInWordsFormat}
              onValueChange={(value) =>
                onSettingsChange("amountInWordsFormat", value)
              }
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="international">International</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div>
        <SectionHeader title="Footer" />
        <div className="space-y-4">
          <SettingRow
            id="print-description"
            label="Print Description"
            checked={settings.showDescription}
            onCheckedChange={(checked) =>
              onSettingsChange("showDescription", checked)
            }
            tooltip="Print description"
          />

          <button className="text-primary text-sm hover:underline">
            Terms and Conditions &gt;
          </button>

          <SettingRow
            id="signature"
            label="Print Signature Text"
            checked={settings.showSignature}
            onCheckedChange={(checked) =>
              onSettingsChange("showSignature", checked)
            }
            hasInput
            inputValue={settings.signatureText}
            onInputChange={(value) => onSettingsChange("signatureText", value)}
          />

          <SettingRow
            id="payment-mode"
            label="Payment Mode"
            checked={settings.showPaymentMode}
            onCheckedChange={(checked) =>
              onSettingsChange("showPaymentMode", checked)
            }
            tooltip="Show payment mode"
          />

          <SettingRow
            id="acknowledgement"
            label="Print Acknowledgement"
            checked={settings.showAcknowledgement}
            onCheckedChange={(checked) =>
              onSettingsChange("showAcknowledgement", checked)
            }
            tooltip="Print acknowledgement section"
          />

          <SettingRow
            id="bank-details"
            label="Bank Details"
            checked={settings.showBankDetails}
            onCheckedChange={(checked) =>
              onSettingsChange("showBankDetails", checked)
            }
          />

          <SettingRow
            id="amount-in-words"
            label="Amount in Words"
            checked={settings.showAmountInWords}
            onCheckedChange={(checked) =>
              onSettingsChange("showAmountInWords", checked)
            }
          />
        </div>
      </div>
    </div>
  );
}
