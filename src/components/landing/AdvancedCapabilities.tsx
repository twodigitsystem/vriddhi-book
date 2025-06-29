"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Repeat,
  RefreshCw,
  TrendingUp,
  ArrowLeftRight,
  FileCheck,
  RotateCcw,
  PieChart,
  Smartphone,
  Receipt,
  CheckSquare,
} from "lucide-react";

export const AdvancedCapabilities: React.FC = () => {
  const capabilities = [
    {
      icon: Building2,
      title: "Multi-Tenancy Support",
      description:
        "Manage multiple businesses or branches with completely isolated data and user access controls.",
      benefits: [
        "Separate data isolation",
        "Individual user management",
        "Branch-specific reporting",
        "Centralized oversight",
      ],
    },
    {
      icon: Repeat,
      title: "Multiple Payment Gateways",
      description:
        "Integrated support for Stripe, PayPal, Razorpay, and direct bank transfers for seamless payments.",
      benefits: [
        "Multiple payment options",
        "Secure transactions",
        "Automatic reconciliation",
        "Global payment support",
      ],
    },
    {
      icon: RefreshCw,
      title: "Product & Category Management",
      description:
        "Advanced product management with SKUs, barcodes, variants, and bulk import capabilities.",
      benefits: [
        "SKU management",
        "Barcode integration",
        "Product variants",
        "Bulk operations",
      ],
    },
    {
      icon: RotateCcw,
      title: "Returns & Refund Processing",
      description:
        "Complete return management for both sales and purchases with automatic inventory adjustments.",
      benefits: [
        "Return invoices",
        "Automatic stock updates",
        "Refund processing",
        "Supplier credit notes",
      ],
    },
    {
      icon: TrendingUp,
      title: "Income & Revenue Tracking",
      description:
        "Track all income sources with detailed categorization and revenue stream analysis.",
      benefits: [
        "Multiple income sources",
        "Revenue categorization",
        "Trend analysis",
        "Growth metrics",
      ],
    },
    {
      icon: ArrowLeftRight,
      title: "Stock Transfer & Movement",
      description:
        "Inter-warehouse stock transfers with approval workflows and complete audit trails.",
      benefits: [
        "Transfer tracking",
        "Approval workflows",
        "Audit trails",
        "Real-time updates",
      ],
    },
    {
      icon: FileCheck,
      title: "Quotation Management",
      description:
        "Professional quotations and proforma invoices with conversion tracking and follow-up automation.",
      benefits: [
        "Professional quotes",
        "Conversion tracking",
        "Follow-up automation",
        "Template management",
      ],
    },
    {
      icon: CheckSquare,
      title: "Stock Count & Reconciliation",
      description:
        "Regular stock audits, cycle counts, and variance reporting for accurate inventory management.",
      benefits: [
        "Stock audits",
        "Cycle counting",
        "Variance reports",
        "Reconciliation tools",
      ],
    },
    {
      icon: PieChart,
      title: "Advanced Analytics",
      description:
        "Real-time dashboards with customizable reports and deep business intelligence insights.",
      benefits: [
        "Real-time dashboards",
        "Custom reports",
        "Business intelligence",
        "Predictive analytics",
      ],
    },
    {
      icon: Smartphone,
      title: "Advanced POS System",
      description:
        "Feature-rich POS with offline mode, barcode scanning, split bills, and mobile compatibility.",
      benefits: [
        "Offline capability",
        "Barcode scanning",
        "Split billing",
        "Mobile POS",
      ],
    },
    {
      icon: Receipt,
      title: "Expense Management",
      description:
        "Comprehensive expense tracking with receipt attachments, spending limits, and approval workflows.",
      benefits: [
        "Receipt attachments",
        "Spending limits",
        "Approval workflows",
        "Expense analytics",
      ],
    },
    {
      icon: TrendingUp,
      title: "Financial Management",
      description:
        "Complete accounts management with payables/receivables, cash flow analysis, and balance sheets.",
      benefits: [
        "Payables/Receivables",
        "Cash flow analysis",
        "Balance sheets",
        "Financial reporting",
      ],
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Advanced Capabilities for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Growing Businesses
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Powerful enterprise-grade features that scale with your business
            needs
          </p>
        </motion.div>

        {/* Capabilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Icon & Title */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <capability.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {capability.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                {capability.description}
              </p>

              {/* Benefits */}
              <div className="space-y-2">
                {capability.benefits.map((benefit, benefitIndex) => (
                  <motion.div
                    key={benefit}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1 + benefitIndex * 0.05,
                    }}
                  >
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section with Stats */}
        <motion.div
          className="mt-20 bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Enterprise Features</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
              <div className="text-gray-600">System Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">10k+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
