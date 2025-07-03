"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="relative w-64 max-w-md">
      <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
      <Input
        placeholder="Search..."
        className="pl-8 h-9 w-full bg-gray-50 focus:bg-white"
      />
    </div>
  );
}
