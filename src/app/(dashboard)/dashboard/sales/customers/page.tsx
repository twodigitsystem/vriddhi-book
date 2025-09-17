import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Customers() {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
            {/* add new customer button link to /dashboard/sales/customers/new */}
            <Link href="/dashboard/sales/customers/new">
                <Button variant="default">Add New Customer</Button>
            </Link>
        </div>
    );
}