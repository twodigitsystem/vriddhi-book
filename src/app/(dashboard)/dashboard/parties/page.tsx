//src/app/(dashboard)/dashboard/parties/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PartyTable from "@/components/parties/PartyTable";
import PartyModal from "@/components/parties/PartyModal";
import { Party, partySchema, PartyType } from "@/lib/validators/partySchema";
import { getParties } from "@/actions/partyActions";
import { useRouter, useSearchParams } from "next/navigation";

export default async function PartiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const filterType =
    (searchParams.get("filterType") as PartyType | "ALL") || "ALL";
  const searchQuery = searchParams.get("searchQuery") || "";

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("filterType", value);
    params.set("page", "1"); // Reset to first page on filter change
    router.push(`?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("searchQuery", value);
    params.set("page", "1"); // Reset to first page on search
    router.push(`?${params.toString()}`);
  };
  const partyTypeOptions = partySchema.shape.partyType.options;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Parties</h1>
        <Button
          onClick={() => {
            setSelectedParty(null);
            setIsModalOpen(true);
          }}
        >
          + Add Party
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by name or GSTIN..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterType} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            {Object.values(partyTypeOptions).map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Party Table */}
      <PartyTable
        page={page}
        filterType={filterType}
        searchQuery={searchQuery}
        onEdit={(party) => {
          setSelectedParty(party);
          setIsModalOpen(true);
        }}
      />

      {/* Modal for Add/Edit */}
      <PartyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        party={selectedParty}
      />
    </div>
  );
}
