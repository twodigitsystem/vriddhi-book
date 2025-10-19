"use client";
import React from "react";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

export function HeroSection() {
  const features = [
    "Complete Inventory Management",
    "Professional Invoicing",
    "Real-time Analytics",
    "Multi-warehouse Support",
  ];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16"
      aria-labelledby="hero-title"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <span
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-sm uppercase tracking-wide"
                  id="hero-badge"
                >
                  Complete Business Solution
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                id="hero-title"
              >
                Streamline Your
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Business
                </span>
                <br />
                with Smart Inventory
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                id="hero-description"
              >
                All-in-one inventory management, invoicing, and accounting
                solution designed for modern businesses. Increase efficiency,
                reduce costs, and grow faster.
              </motion.p>

              {/* Feature List */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                role="list"
                aria-label="Key features"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    role="listitem"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" aria-hidden="true" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              role="group"
              aria-label="Call to action buttons"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg group min-h-[48px] w-full sm:w-auto"
                aria-describedby="hero-description"
              >
                <span className="mr-2">Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 px-8 py-4 text-lg hover:bg-gray-50 group min-h-[48px] w-full sm:w-auto"
                aria-label="Watch product demonstration video"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              className="flex flex-wrap items-center gap-4 sm:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              role="list"
              aria-label="Trust indicators"
            >
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">10,000+</span>{" "}
                <span>businesses trust us</span>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">99.9%</span>{" "}
                <span>uptime</span>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">24/7</span>{" "}
                <span>support</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Hero Image/Dashboard Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-3">
              <motion.div
                className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white"
                whileHover={{ scale: 1.02, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                role="img"
                aria-label="Dashboard interface preview showing revenue metrics, product count, and sales trends"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Dashboard Overview
                    </h3>
                    <div className="w-3 h-3 bg-green-400 rounded-full" aria-label="Online status indicator"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">$45.2K</div>
                      <div className="text-sm opacity-80">Monthly Revenue</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">1,247</div>
                      <div className="text-sm opacity-80">Products</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">89</div>
                      <div className="text-sm opacity-80">Low Stock</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">342</div>
                      <div className="text-sm opacity-80">Orders</div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Sales Trend</span>
                      <span className="text-green-300">↗ +12.5%</span>
                    </div>
                    <div className="h-16 bg-white/20 rounded flex items-end justify-between px-2">
                      {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                        <motion.div
                          key={i}
                          className="bg-white/60 rounded-t"
                          style={{ height: `${height}%`, width: "8px" }}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 1 + i * 0.1 }}
                          role="presentation"
                          aria-label={`Sales data point ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating Cards */}
            <motion.div
              className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-3 border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
                <span className="text-sm font-medium">Real-time Updates</span>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              whileHover={{ scale: 1.05 }}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" aria-hidden="true"></div>
                <span className="text-sm font-medium">Multi-warehouse</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


