"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Warehouse,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Calculator,
  Users,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export const KeyFeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: "Easy Invoicing & Billing",
      description:
        "Professional invoices with auto-numbering, tax calculations, email/WhatsApp sending, and online payments (UPI, cards, wallets).",
      highlights: [
        "Auto-numbering",
        "Tax calculations",
        "Online payments",
        "Recurring invoices",
      ],
    },
    {
      icon: Warehouse,
      title: "Multi-Warehouse Inventory",
      description:
        "Track stock across multiple locations with real-time updates, low stock alerts, and automated reorder points.",
      highlights: [
        "Multiple locations",
        "Real-time tracking",
        "Low stock alerts",
        "Auto reorder",
      ],
    },
    {
      icon: ShoppingCart,
      title: "Purchase & Supplier Management",
      description:
        "Record purchases, track payments, manage returns, and compare supplier prices for better cost management.",
      highlights: [
        "Purchase tracking",
        "Supplier comparison",
        "Return management",
        "Payment tracking",
      ],
    },
    {
      icon: CreditCard,
      title: "Sales & POS System",
      description:
        "User-friendly POS with barcode/QR scanning, multiple payment methods, and seamless checkout experience.",
      highlights: [
        "Barcode scanning",
        "Multiple payments",
        "Quick checkout",
        "Offline mode",
      ],
    },
    {
      icon: DollarSign,
      title: "Expense Tracking",
      description:
        "Log business expenses with receipt attachments, expense categorization, and spending analytics.",
      highlights: [
        "Receipt attachments",
        "Categorization",
        "Spending analytics",
        "Budget tracking",
      ],
    },
    {
      icon: Calculator,
      title: "Basic Accounting",
      description:
        "Income/expense tracking, profit/loss reports, tax liabilities - no separate accounting software needed.",
      highlights: [
        "P&L reports",
        "Tax management",
        "Cash flow",
        "Financial insights",
      ],
    },
    {
      icon: Users,
      title: "Customer Management",
      description:
        "Manage customer details, purchase history, loyalty discounts, and automated SMS/email receipts.",
      highlights: [
        "Customer profiles",
        "Purchase history",
        "Loyalty programs",
        "Automated receipts",
      ],
    },
    {
      icon: BarChart3,
      title: "Reports for Decision-Making",
      description:
        "Track top-selling products, monthly revenue, expense breakdown with clear insights for business growth.",
      highlights: [
        "Top products",
        "Revenue tracking",
        "Expense analysis",
        "Growth insights",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="features" className="py-20 bg-white">
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
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Manage Your Business
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features designed to streamline your operations and
            accelerate growth
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-blue-200"
              whileHover={{ y: -5 }}
            >
              {/* Icon */}
              <div className="relative mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlights */}
                <div className="space-y-1">
                  {feature.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-center text-xs text-gray-500"
                    >
                      <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                      {highlight}
                    </div>
                  ))}
                </div>

                {/* Learn More Link */}
                <div className="pt-2">
                  <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium group-hover:translate-x-1 transition-transform">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-gray-600 mb-6">
            Ready to transform your business operations?
          </p>
          <motion.button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Free Trial Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
