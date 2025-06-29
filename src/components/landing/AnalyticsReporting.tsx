"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Target,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

export const AnalyticsReporting: React.FC = () => {
  const reports = [
    {
      title: "Sales Analytics",
      description:
        "Track revenue trends, top-selling products, and customer behavior",
      metrics: [
        "Revenue Growth",
        "Product Performance",
        "Customer Insights",
        "Sales Forecasting",
      ],
    },
    {
      title: "Inventory Reports",
      description:
        "Monitor stock levels, turnover rates, and inventory valuation",
      metrics: [
        "Stock Levels",
        "Turnover Rates",
        "Dead Stock",
        "Reorder Points",
      ],
    },
    {
      title: "Financial Dashboard",
      description:
        "Complete financial overview with P&L, cash flow, and expenses",
      metrics: [
        "Profit & Loss",
        "Cash Flow",
        "Expense Analysis",
        "Tax Reports",
      ],
    },
    {
      title: "Operational Insights",
      description: "Track business efficiency and operational performance",
      metrics: [
        "Order Processing",
        "Supplier Performance",
        "Warehouse Efficiency",
        "Returns Analysis",
      ],
    },
  ];

  const dashboardData = [
    {
      label: "Today",
      value: "$12,450",
      change: "+12.5%",
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "This Week",
      value: "$89,320",
      change: "+8.2%",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "This Month",
      value: "$324,580",
      change: "+15.7%",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "This Year",
      value: "$2.4M",
      change: "+23.1%",
      color: "from-orange-500 to-red-500",
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
            Advanced Analytics &
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Business Intelligence
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Make data-driven decisions with powerful analytics and customizable
            reporting
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Revenue Dashboard
            </h3>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Revenue Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {dashboardData.map((item, index) => (
              <motion.div
                key={item.label}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-green-600 text-sm font-medium">
                    {item.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {item.value}
                </div>
                <div
                  className={`h-2 bg-gradient-to-r ${item.color} rounded-full`}
                ></div>
              </motion.div>
            ))}
          </div>

          {/* Chart Area */}
          <motion.div
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold">
                Sales Trend (Last 12 Months)
              </h4>
              <TrendingUp className="w-6 h-6" />
            </div>

            <div className="flex items-end justify-between h-40 space-x-2">
              {[45, 52, 38, 65, 58, 72, 69, 85, 78, 92, 88, 95].map(
                (height, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/30 rounded-t flex-1 min-w-0"
                    style={{ height: `${height}%` }}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  />
                )
              )}
            </div>

            <div className="flex justify-between text-sm opacity-80 mt-2">
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Report Categories */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {reports.map((report, index) => (
            <motion.div
              key={report.title}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {report.title}
                </h3>
              </div>

              <p className="text-gray-600 mb-6">{report.description}</p>

              <div className="grid grid-cols-2 gap-3">
                {report.metrics.map((metric, metricIndex) => (
                  <motion.div
                    key={metric}
                    className="flex items-center space-x-2 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.2 + metricIndex * 0.05,
                    }}
                  >
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                    <span className="text-gray-700">{metric}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: PieChart,
              title: "Visual Dashboards",
              description:
                "Interactive charts and graphs for easy data interpretation",
            },
            {
              icon: Activity,
              title: "Real-time Monitoring",
              description:
                "Live data updates and instant notifications for key metrics",
            },
            {
              icon: Target,
              title: "Custom Reports",
              description:
                "Build personalized reports with drag-and-drop interface",
            },
            {
              icon: Calendar,
              title: "Scheduled Reports",
              description:
                "Automated report delivery via email on your schedule",
            },
            {
              icon: Download,
              title: "Export Options",
              description: "Download reports in PDF, Excel, CSV formats",
            },
            {
              icon: Filter,
              title: "Advanced Filtering",
              description:
                "Drill down into data with sophisticated filter options",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
