import { InvoiceData, InvoiceSettings } from "../_types/invoice.types";
import InvoiceTemplate1 from "./InvoiceTemplate1";
import InvoiceTemplate2 from "./InvoiceTemplate2";
import InvoiceTemplate3 from "./InvoiceTemplate3";
import InvoiceTemplate4 from "./InvoiceTemplate4";
import InvoiceTemplate5 from "./InvoiceTemplate5";
import InvoiceTemplate6 from "./InvoiceTemplate6";
import InvoiceTemplate7 from "./InvoiceTemplate7";
import InvoiceTemplate8 from "./InvoiceTemplate8";

interface InvoiceRendererProps {
  data: InvoiceData;
  settings: InvoiceSettings;
}

const templateComponents = {
  template1: InvoiceTemplate1,
  template2: InvoiceTemplate2,
  template3: InvoiceTemplate3,
  template4: InvoiceTemplate4,
  template5: InvoiceTemplate5,
  template6: InvoiceTemplate6,
  template7: InvoiceTemplate7,
  template8: InvoiceTemplate8,
} as const;

export default function InvoiceRenderer({
  data,
  settings,
}: InvoiceRendererProps) {
  const TemplateComponent =
    templateComponents[settings.templateId] || InvoiceTemplate1;

  return <TemplateComponent data={data} settings={settings} />;
}
