"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  FileText,
  Warehouse,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Calculator,
  Users,
  BarChart3,
  Package,
  Sparkles,
} from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

interface FeatureCategory {
  title: string;
  features: Feature[];
}

const featureCategories: FeatureCategory[] = [
  {
    title: "CORE FEATURES",
    features: [
      {
        icon: FileText,
        title: "Invoicing & Billing",
        description: "Professional invoices with auto-numbering and tax calculations",
        href: "#invoicing",
      },
      {
        icon: Warehouse,
        title: "Multi-Warehouse",
        description: "Track stock across multiple locations in real-time",
        href: "#warehouse",
      },
      {
        icon: ShoppingCart,
        title: "Purchase Management",
        description: "Streamline procurement and vendor management",
        href: "#purchases",
      },
      {
        icon: CreditCard,
        title: "Payment Processing",
        description: "Accept payments via UPI, cards, and wallets",
        href: "#payments",
      },
    ],
  },
  {
    title: "ADVANCED",
    features: [
      {
        icon: BarChart3,
        title: "Analytics & Reports",
        description: "Real-time insights and comprehensive reporting",
        href: "#analytics",
      },
      {
        icon: Calculator,
        title: "Accounting",
        description: "Complete accounting and financial management",
        href: "#accounting",
      },
      {
        icon: Users,
        title: "Team Management",
        description: "Role-based access and collaboration tools",
        href: "#team",
      },
      {
        icon: Sparkles,
        title: "Automation",
        description: "Automate workflows and save time",
        href: "#automation",
      },
    ],
  },
];

interface FeaturesDropdownProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export function FeaturesDropdown({ isMobile = false, onItemClick }: FeaturesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    if (!isMobile) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsOpen(false);
  };

  const handleClick = () => {
    if (isMobile) setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    setIsOpen(false);
    onItemClick?.();
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        onClick={handleClick}
        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Features
        <ChevronDown
          className={`w-4 h-4 ml-1 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${
              isMobile ? "left-0 right-0" : "left-1/2 -translate-x-1/2"
            } top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 ${
              isMobile ? "w-full" : "w-[600px]"
            }`}
            role="menu"
            aria-orientation="vertical"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featureCategories.map((category, categoryIndex) => (
                  <div key={category.title}>
                    {/* Category Title */}
                    <div className="text-xs font-semibold text-gray-400 tracking-wider mb-3">
                      {category.title}
                    </div>

                    {/* Features List */}
                    <div className="space-y-1">
                      {category.features.map((feature, featureIndex) => {
                        const Icon = feature.icon;
                        return (
                          <motion.a
                            key={feature.title}
                            href={feature.href}
                            onClick={handleItemClick}
                            className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            role="menuitem"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: categoryIndex * 0.1 + featureIndex * 0.05,
                            }}
                            whileHover={{ x: 4 }}
                          >
                            {/* Icon */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>

                            {/* Content */}
                            <div className="ml-3 flex-1">
                              <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {feature.title}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {feature.description}
                              </div>
                            </div>
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <a
                  href="#all-features"
                  onClick={handleItemClick}
                  className="flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group"
                  role="menuitem"
                >
                  <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Explore all features
                  <ChevronDown className="w-4 h-4 ml-1 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
