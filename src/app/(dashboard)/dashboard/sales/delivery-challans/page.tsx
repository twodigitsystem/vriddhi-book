import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/custom-ui/data-table/data-table-skeleton";
import DeliveryChallanClient from "./_components/delivery-challan-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Challans | Sales",
  description: "Manage your delivery challans",
};

export default function DeliveryChallansPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Delivery Challans</h1>
        <p className="text-muted-foreground">Create and manage delivery challans for shipments.</p>
      </div>
      <Suspense fallback={<DataTableSkeleton columnCount={7} />}>
        <DeliveryChallanClient />
      </Suspense>
    </div>
  );
}
