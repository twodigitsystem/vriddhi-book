import { redirect } from "next/navigation";

export default function PurchasesPage() {
  // Redirect to purchase orders
  redirect("/dashboard/purchases/orders");
}
