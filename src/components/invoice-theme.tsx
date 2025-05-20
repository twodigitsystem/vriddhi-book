//src/components/invoice-theme.tsx

"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import Image from "next/image";

// Placeholder logo (replace with your actual logo)
import logo from "../../public/file.svg"; // Adjust path as needed

// Animation variants for Framer Motion
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Sample invoice data (tailored to match total ₹5968.40)
const invoiceItems = [
  {
    id: 1,
    description: "Laptop Charger",
    hsnSac: "85044030",
    quantity: 2,
    rate: 1500,
    discount: 0,
    taxableAmount: 3000,
    cgstRate: 9, // 9% CGST
    cgstAmount: 270,
    sgstRate: 9, // 9% SGST
    sgstAmount: 270,
    total: 3540,
  },
  {
    id: 2,
    description: "USB Cable",
    hsnSac: "85444299",
    quantity: 5,
    rate: 400,
    discount: 100,
    taxableAmount: 1900,
    cgstRate: 9,
    cgstAmount: 171,
    sgstRate: 9,
    sgstAmount: 171,
    total: 2242,
  },
  {
    id: 3,
    description: "Mouse Pad",
    hsnSac: "40169990",
    quantity: 3,
    rate: 50,
    discount: 0,
    taxableAmount: 150,
    cgstRate: 9,
    cgstAmount: 13.5,
    sgstRate: 9,
    sgstAmount: 13.5,
    total: 177,
  },
];

const InvoiceTheme: React.FC = () => {
  const totals = invoiceItems.reduce(
    (acc, item) => ({
      taxableAmount: acc.taxableAmount + item.taxableAmount,
      cgstAmount: acc.cgstAmount + item.cgstAmount,
      sgstAmount: acc.sgstAmount + item.sgstAmount,
      total: acc.total + item.total,
    }),
    { taxableAmount: 0, cgstAmount: 0, sgstAmount: 0, total: 0 }
  );

  return (
    <motion.div
      className="w-full mx-auto p-4 sm:p-6 bg-white font-sans"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Header Section */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          {/* Copy Print Options */}
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="w-[55%]"></TableCell>
                <TableCell className="border border-gray-300 text-center p-1">
                  <span className="text-gray-500">O</span>
                </TableCell>
                <TableCell className="pl-2">Original</TableCell>
                <TableCell className="border border-gray-300 text-center p-1">
                  <span className="text-gray-500">O</span>
                </TableCell>
                <TableCell className="pl-2">Duplicate</TableCell>
                <TableCell className="border border-gray-300 text-center p-1">
                  <span className="text-gray-500">O</span>
                </TableCell>
                <TableCell className="pl-2">Triplicate</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Company Info and Logo */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
            <div>
              <h2 className="text-xl font-bold uppercase">
                Vyapar Tech Solutions
              </h2>
              <p className="text-sm text-gray-600">Sarjapura road, Bangalore</p>
              <p className="text-sm text-gray-600">Phone no.: 9333911911</p>
              <p className="text-sm text-gray-600">
                Email:{" "}
                <a href="mailto:vyapar@example.com" className="text-blue-600">
                  vyapar@example.com
                </a>
              </p>
              <p className="text-sm text-gray-600">State: 30-Goa</p>
            </div>
            <Image
              src={logo}
              alt="Company Logo"
              width={118}
              height={59}
              className="mt-4 sm:mt-0"
            />
          </div>

          {/* Authorized Signatory */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Authorized Signatory
          </p>
        </CardContent>
      </Card>

      {/* Invoice Items Table */}
      <Card className="mb-6 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold uppercase">
            Invoice Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">S.No</TableHead>
                <TableHead className="font-bold">Description</TableHead>
                <TableHead className="font-bold">HSN/SAC</TableHead>
                <TableHead className="font-bold text-right">Quantity</TableHead>
                <TableHead className="font-bold text-right">Rate</TableHead>
                <TableHead className="font-bold text-right">Discount</TableHead>
                <TableHead className="font-bold text-right">
                  Taxable Amt
                </TableHead>
                <TableHead className="font-bold text-right">CGST</TableHead>
                <TableHead className="font-bold text-right">SGST</TableHead>
                <TableHead className="font-bold text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.hsnSac}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ₹{item.rate.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{item.discount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{item.taxableAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.cgstRate}% (₹{item.cgstAmount.toFixed(2)})
                  </TableCell>
                  <TableCell className="text-right">
                    {item.sgstRate}% (₹{item.sgstAmount.toFixed(2)})
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{item.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={6} className="text-right font-bold">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  ₹{totals.taxableAmount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-bold">
                  ₹{totals.cgstAmount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-bold">
                  ₹{totals.sgstAmount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-bold">
                  ₹{totals.total.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Separator */}
      <Separator className="my-6" />

      {/* Acknowledgement Section */}
      <Card className="shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-bold uppercase">
            Acknowledgement
          </CardTitle>
          <h3 className="text-2xl font-bold uppercase text-blue-700">
            Vyapar Tech Solutions
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <p className="text-lg font-bold uppercase">Classic Enterprises</p>
              <p className="text-lg uppercase">Marathalli road, Bangalore</p>
            </div>
            <div className="text-right">
              <p className="text-lg uppercase">Invoice No. : 3</p>
              <p className="text-lg uppercase">Invoice Date : 06-03-2019</p>
              <p className="text-lg uppercase">
                Invoice Amount : ₹{totals.total.toFixed(2)}
              </p>
            </div>
          </div>
          <p className="text-center text-sm mt-4">
            Receiver&apos;s Seal & Sign
          </p>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .shadow-sm {
            box-shadow: none;
          }
          .max-w-4xl {
            max-width: none;
            padding: 0;
          }
          .border {
            border: 1px solid #d1d5db !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default InvoiceTheme;
