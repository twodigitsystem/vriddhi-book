import { ItemForm } from "@/components/features/inventory/new-item-form-old";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import prisma from "@/lib/db";
import { getOrganizationId } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";


export default async function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orgId = await getOrganizationId();
  if (!orgId) {
    return <p>Error: No active organization</p>;
  }

  const itemData = await prisma.item.findFirst({
    where: { id, organizationId: orgId, deletedAt: null },
    include: {
      taxRate: true,
      hsnCode: true,
      category: true,
      suppliers: true,
      inventory: {
        include: {
          warehouse: true,
        },
      },
      transactionItems: {
        include: {
          transaction: true,
        },
      },
      serialNumbers: true,
      unit: {
        include: {
          baseConversions: {
            include: {
              secondaryUnit: true,
            },
          },
        },
      },
    },
  });

  if (!itemData) {
    return <p>Item not found</p>;
  }

  const item = itemData;
  const unit = item.unit;
  const currentStockQty = item.inventory.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (

    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            {unit && (
              <Card>
                <CardHeader>
                  <CardTitle>Stock Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Primary Stock
                      </p>
                      <p className="text-2xl font-bold">
                        {currentStockQty} {unit.shortName}
                      </p>
                    </div>
                    {unit.baseConversions &&
                      unit.baseConversions.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            Conversions
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {unit.baseConversions.map((conv) => (
                              <li key={conv.id}>
                                <strong>
                                  {(
                                    Number(currentStockQty) *
                                    Number(conv.conversionFactor)
                                  ).toFixed(2)}{" "}
                                  {conv.secondaryUnit.shortName}
                                </strong>
                                <span className="text-xs text-muted-foreground ml-2">
                                  (1 {unit.shortName} ={" "}
                                  {Number(conv.conversionFactor)}{" "}
                                  {conv.secondaryUnit.shortName})
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* <ItemForm item={item} /> */}
          </TabsContent>
          <TabsContent value="transactions">
            <p>Transaction history (to be implemented)</p>
          </TabsContent>
          <TabsContent value="warehouses">
            <p>Warehouse details (to be implemented)</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

  );
}
