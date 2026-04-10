"use client";

import { useState } from "react";
import { DataTable } from "@/components/custom-ui/data-table/data-table";
import { DataTableToolbar } from "@/components/custom-ui/data-table/data-table-toolbar";
import { transactionColumns, TransactionRow } from "./transaction-columns";
import { Clock } from "lucide-react";

interface ItemTransactionsTableProps {
  transactions: TransactionRow[];
}

export function ItemTransactionsTable({ transactions }: ItemTransactionsTableProps) {
  const [, setSearch] = useState("");

  return (
    <div className="bg-card rounded-xl border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-orange-600" />
        <h3 className="text-sm font-semibold text-foreground">Transaction History</h3>
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No transactions for this item yet.
        </p>
      ) : (
        <DataTable
          columns={transactionColumns}
          data={transactions}
          toolbar={(table) => (
            <DataTableToolbar
              table={table}
              searchKey="reference"
              onSearch={setSearch}
              showViewOptions={false}
            />
          )}
        />
      )}
    </div>
  );
}
