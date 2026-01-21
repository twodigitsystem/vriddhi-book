"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpRight,
  Calendar,
  CreditCard,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const transactions = [
  {
    id: "TXN-1920-A",
    date: "Oct 24, 2023",
    time: "14:30 PM",
    tenant: "Acme Corp",
    tenantCode: "AC",
    type: "Subscription",
    gateway: "Stripe",
    amount: "$4,999.00",
    status: "Paid",
  },
  {
    id: "TXN-1920-B",
    date: "Oct 24, 2023",
    time: "11:15 AM",
    tenant: "Globex Ltd",
    tenantCode: "GL",
    type: "Add-on: Storage",
    gateway: "PayPal",
    amount: "$250.00",
    status: "Paid",
  },
  {
    id: "TXN-1919-C",
    date: "Oct 23, 2023",
    time: "09:42 AM",
    tenant: "Stark Ind",
    tenantCode: "SI",
    type: "Subscription",
    gateway: "Stripe",
    amount: "$12,000.00",
    status: "Failed",
  },
  {
    id: "TXN-1918-X",
    date: "Oct 22, 2023",
    time: "16:20 PM",
    tenant: "Oscorp",
    tenantCode: "OC",
    type: "Refund",
    gateway: "Bank",
    amount: "-$500.00",
    status: "Refunded",
  },
  {
    id: "TXN-1917-P",
    date: "Oct 21, 2023",
    time: "08:00 AM",
    tenant: "Massive Tech",
    tenantCode: "MT",
    type: "Subscription",
    gateway: "Razorpay",
    amount: "$1,200.00",
    status: "Pending",
  },
  {
    id: "TXN-1916-Z",
    date: "Oct 20, 2023",
    time: "13:45 PM",
    tenant: "Venture Ent",
    tenantCode: "VE",
    type: "Subscription",
    gateway: "Stripe",
    amount: "$3,500.00",
    status: "Paid",
  },
];

const volumeData = [
  { v: 100 }, { v: 120 }, { v: 110 }, { v: 140 }, { v: 130 }, { v: 160 }, { v: 180 },
];

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Financial Transactions
          </h1>
          <p className="text-muted-foreground">
            System-wide ledger for subscription payments and adjustments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Manual Entry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Volume
                </p>
                <h3 className="text-3xl font-bold">$142,300.00</h3>
                <div className="flex items-center gap-1 mt-1 text-emerald-500 text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+12.5%</span>
                  <span className="text-muted-foreground font-normal ml-1">
                    from last month
                  </span>
                </div>
              </div>
              <div className="h-[60px] w-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={volumeData}>
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Net Revenue
                </p>
                <h3 className="text-3xl font-bold">$138,500.00</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Excludes refunded amounts
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Failed Transactions
                </p>
                <h3 className="text-3xl font-bold">12</h3>
                <p className="text-sm text-red-500 font-medium mt-1">
                  Needs attention
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Tenant or TXN ID..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status: All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Gateway: All</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[140px] font-semibold">TRANSACTION ID</TableHead>
                <TableHead className="font-semibold">DATE & TIME</TableHead>
                <TableHead className="font-semibold">TENANT</TableHead>
                <TableHead className="font-semibold">TYPE</TableHead>
                <TableHead className="font-semibold">GATEWAY</TableHead>
                <TableHead className="font-semibold">AMOUNT</TableHead>
                <TableHead className="font-semibold">STATUS</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium">{txn.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{txn.date}</span>
                      <span className="text-xs text-muted-foreground">
                        {txn.time}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {txn.tenantCode}
                      </div>
                      <span className="font-medium">{txn.tenant}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {txn.type}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>{txn.gateway}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">{txn.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        txn.status === "Paid"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : txn.status === "Failed"
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : txn.status === "Refunded"
                          ? "bg-muted text-muted-foreground border-border"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      }
                    >
                      {txn.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
          <div>Showing 1-6 of 124 transactions</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
