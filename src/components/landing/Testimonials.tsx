"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, ArrowLeft, ArrowRight } from "lucide-react";

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      position: "Operations Director",
      company: "TechFlow Solutions",
      image: "👩‍💼",
      rating: 5,
      text: "InventoryPro transformed our operations completely. We reduced inventory costs by 30% and improved our order accuracy to 99.8%. The real-time analytics give us insights we never had before.",
      results: ["30% cost reduction", "99.8% accuracy", "Real-time insights"],
    },
    {
      name: "Marcus Rodriguez",
      position: "CEO",
      company: "GreenLeaf Retail",
      image: "👨‍💼",
      rating: 5,
      text: "The multi-warehouse feature is a game-changer for our retail chain. Managing inventory across 15 locations is now effortless. The mobile app keeps our team connected everywhere.",
      results: [
        "15 locations managed",
        "Effortless control",
        "Mobile connectivity",
      ],
    },
    {
      name: "Emily Watson",
      position: "Finance Manager",
      company: "Innovate Manufacturing",
      image: "👩‍💻",
      rating: 5,
      text: "The invoicing and accounting integration saved us thousands in bookkeeping costs. Tax calculations are automatic, and the financial reports help us make better business decisions.",
      results: ["Thousands saved", "Auto tax calc", "Better decisions"],
    },
    {
      name: "David Park",
      position: "Store Manager",
      company: "Urban Electronics",
      image: "👨‍🔧",
      rating: 5,
      text: "Customer management features increased our repeat sales by 40%. The loyalty program integration and automated receipts keep customers coming back.",
      results: ["40% repeat sales", "Loyalty program", "Customer retention"],
    },
    {
      name: "Lisa Thompson",
      position: "COO",
      company: "FreshMart Groceries",
      image: "👩‍🍳",
      rating: 5,
      text: "POS system with barcode scanning made checkout 3x faster. Our customers love the quick service, and our staff finds it incredibly easy to use.",
      results: ["3x faster checkout", "Happy customers", "Easy to use"],
    },
    {
      name: "James Wilson",
      position: "Business Owner",
      company: "Wilson Automotive",
      image: "👨‍🔧",
      rating: 5,
      text: "The expense tracking and supplier management features gave us complete control over our costs. We identified savings opportunities worth $50k annually.",
      results: ["Complete cost control", "$50k savings", "Better suppliers"],
    },
  ];

  const stats = [
    { value: "10,000+", label: "Happy Customers" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "Customer Rating" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <section className="py-20 bg-white">
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
            Trusted by
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              10,000+ Businesses
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            See how businesses like yours are transforming their operations with
            InventoryPro
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-4">
                <Quote className="w-8 h-8 text-blue-600 opacity-50" />
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Results */}
              <div className="space-y-2 mb-6">
                {testimonial.results.map((result, resultIndex) => (
                  <motion.div
                    key={result}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1 + resultIndex * 0.05,
                    }}
                  >
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{result}</span>
                  </motion.div>
                ))}
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.position}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-4">
            Join Thousands of Successful Businesses
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Start your transformation today with a free 30-day trial
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
            </motion.button>
            <motion.button
              className="border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
