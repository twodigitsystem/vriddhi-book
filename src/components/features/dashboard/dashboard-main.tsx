// src/components/features/dashboard/dashboard-main.tsx
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    TrendingUp,
    Users,
    ShoppingBag,
    Banknote,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";


export default function DashboardMain() {
   
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to your GST Accounting & Inventory Dashboard
                </p>                
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹45,231.89</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <span className="text-green-500 flex items-center mr-1">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> 12%
                            </span>
                            from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">
                            Total Purchases
                        </CardTitle>
                        <ShoppingBag className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹28,592.40</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <span className="text-red-500 flex items-center mr-1">
                                <ArrowDownRight className="w-3 h-3 mr-1" /> 3%
                            </span>
                            from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                        <Users className="w-4 h-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <span className="text-green-500 flex items-center mr-1">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> 8
                            </span>
                            new this month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                        <Banknote className="w-4 h-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹12,463.00</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            From 23 outstanding invoices
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Your latest financial activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Transaction items would go here */}
                            <div className="flex items-center justify-between pb-4 border-b">
                                <div>
                                    <p className="font-medium">Invoice #INV-2023</p>
                                    <p className="text-sm text-muted-foreground">
                                        ABC Company Pvt Ltd
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-green-600">+₹8,400.00</p>
                                    <p className="text-sm text-muted-foreground">Today</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pb-4 border-b">
                                <div>
                                    <p className="font-medium">Purchase #PUR-1045</p>
                                    <p className="text-sm text-muted-foreground">XYZ Suppliers</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-red-600">-₹3,250.00</p>
                                    <p className="text-sm text-muted-foreground">Yesterday</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pb-4 border-b">
                                <div>
                                    <p className="font-medium">Payment #PAY-789</p>
                                    <p className="text-sm text-muted-foreground">
                                        Global Tech Ltd
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-green-600">+₹5,840.00</p>
                                    <p className="text-sm text-muted-foreground">2 days ago</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Inventory Status</CardTitle>
                        <CardDescription>Stock levels requiring attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="pb-2 border-b">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">Laptop Chargers</span>
                                    <span className="text-sm font-medium text-red-500">
                                        Low Stock
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ width: "15%" }}
                                        ></div>
                                    </div>
                                    <span className="text-xs">5 left</span>
                                </div>
                            </div>

                            <div className="pb-2 border-b">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">Wireless Mouse</span>
                                    <span className="text-sm font-medium text-yellow-500">
                                        Medium Stock
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-yellow-500 h-2 rounded-full"
                                            style={{ width: "45%" }}
                                        ></div>
                                    </div>
                                    <span className="text-xs">16 left</span>
                                </div>
                            </div>

                            <div className="pb-2 border-b">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">LED Monitors</span>
                                    <span className="text-sm font-medium text-green-500">
                                        Good Stock
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: "80%" }}
                                        ></div>
                                    </div>
                                    <span className="text-xs">24 left</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}