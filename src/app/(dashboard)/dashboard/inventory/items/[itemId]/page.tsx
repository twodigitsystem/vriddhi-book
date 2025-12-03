import { getProduct, getProductTransactions } from "@/app/(dashboard)/dashboard/inventory/_actions/inventory-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";

export default async function ItemDetailsPage({ params }: { params: { itemId: string } }) {
  const [item, transactions] = await Promise.all([
    getProduct(params.itemId),
    getProductTransactions(params.itemId),
  ]);

  if (!item) {
    notFound();
  }

  // Fetch unit conversions if unit exists
  const unitWithConversions = item.unitId
    ? await prisma.unit.findUnique({
        where: { id: item.unitId },
        include: {
          baseConversions: {
            include: {
              secondaryUnit: true,
            },
          },
        },
      })
    : null;

  const totalStock =
    item.inventory?.reduce((total: number, inv: any) => total + inv.quantity, 0) ?? 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">SKU</p>
              <p className="font-medium">{item.sku}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Barcode</p>
              <p className="font-mono">{item.barcode || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Type</p>
              <Badge variant="outline">{item.type}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Category</p>
              <p>{item.category?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Selling Price</p>
              <p>{item.price != null ? item.price.toFixed(2) : "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Cost Price</p>
              <p>{item.costPrice != null ? item.costPrice.toFixed(2) : "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tax Rate</p>
              <p>{item.taxRate?.name ?? "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Total stock: <span className="font-semibold text-2xl">{totalStock}</span>
                {unitWithConversions && <span className="ml-2">{unitWithConversions.shortName}</span>}
              </p>

              {/* Unit Conversions */}
              {unitWithConversions?.baseConversions && unitWithConversions.baseConversions.length > 0 && (
                <div className="mt-3 p-3 bg-muted/50 rounded-md">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Unit Conversions</p>
                  <ul className="space-y-1 text-sm">
                    {unitWithConversions.baseConversions.map((conv: any) => (
                      <li key={conv.id} className="flex items-center gap-2">
                        <span className="font-semibold">
                          {(Number(totalStock) * Number(conv.conversionFactor)).toFixed(2)}{" "}
                          {conv.secondaryUnit.shortName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          (1 {unitWithConversions.shortName} = {Number(conv.conversionFactor)}{" "}
                          {conv.secondaryUnit.shortName})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Warehouse Breakdown */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">By Warehouse</p>
              {item.inventory && item.inventory.length > 0 ? (
                <div className="space-y-2 text-sm">
                  {item.inventory.map((inv: any) => (
                    <div key={inv.id} className="flex justify-between">
                      <span>{inv.warehouse?.name ?? "Warehouse"}</span>
                      <span className="font-mono">{inv.quantity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No stock records.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No transactions for this item.
            </p>
          ) : (
            <div className="space-y-2 text-sm">
              {transactions.slice(0, 5).map((tx: any) => {
                const qtyForItem =
                  tx.items.find((ti: any) => ti.itemId === item.id)?.quantity ?? 0;

                return (
                  <div key={tx.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono">{qtyForItem}</p>
                      {tx.reference && (
                        <p className="text-xs text-muted-foreground">{tx.reference}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
