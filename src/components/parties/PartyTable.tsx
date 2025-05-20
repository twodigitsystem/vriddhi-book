"use client";

import { useState, useEffect } from "react";
import { Party, PartyType } from "@/lib/validators/partySchema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { deleteParty, getParties } from "@/actions/partyActions";
import { useRouter } from "next/navigation";

interface PartyTableProps {
  page: number;
  filterType: PartyType | "ALL";
  searchQuery: string;
  onEdit?: (party: Party) => void;
}

export default function PartyTable({
  page,
  filterType,
  searchQuery,
  onEdit,
}: PartyTableProps) {
  const router = useRouter();
  const [parties, setParties] = useState<Party[]>([]);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    const fetchParties = async () => {
      const result = await getParties({
        page,
        pageSize,
        filterType,
        searchQuery,
      });

      // Convert Prisma Decimal to string/number before setting state
      const convertedParties = result.parties.map((party) => ({
        ...party,
        payableAmount: party.payableAmount?.toString() ?? "0",
        receivableAmount: party.receivableAmount?.toString() ?? "0",
        openingBalance: party.openingBalance?.toString() ?? "0",
        creditLimit: party.creditLimit?.toString() ?? "0",
      }));
      setParties(convertedParties);
      setTotal(result.total);
    };
    fetchParties();
  }, [page, filterType, searchQuery]);

  const handleDelete = async (id: string) => {
    const result = await deleteParty(id);
    if (result.success) {
      router.refresh();
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams({
      page: newPage.toString(),
      filterType,
      searchQuery,
    });
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>GSTIN</TableHead>
            <TableHead>Receivable</TableHead>
            <TableHead>Payable</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parties.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No parties found
              </TableCell>
            </TableRow>
          ) : (
            parties.map((party) => (
              <TableRow key={party.id}>
                <TableCell>{party.name}</TableCell>
                <TableCell>{party.partyType}</TableCell>
                <TableCell>{party.companyName}</TableCell>
                <TableCell>{party.gstin || "N/A"}</TableCell>
                <TableCell>
                  {party.receivableAmount?.toString() ?? "0"}
                </TableCell>
                <TableCell>{party.payableAmount?.toString() ?? "0"}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => onEdit?.(party)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => party.id && handleDelete(party.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(page - 1, 1))}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i + 1)}
                isActive={page === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
              className={
                page >= totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
