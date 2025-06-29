"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Building2, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export const PricingCTA: React.FC = () => {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses",
      price: "$29",
      period: "/month",
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Up to 1,000 products",
        "Basic invoicing",
        "Single warehouse",
        "Customer management",
        "Basic reports",
        "Email support",
        "Mobile app access",
        "Payment integration",
      ],
      popular: false,
    },
    {
      name: "Professional",
      description: "Most popular for growing businesses",
      price: "$79",
      period: "/month",
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      features: [
        "Up to 10,000 products",
        "Advanced invoicing",
        "Multi-warehouse (5)",
        "Advanced customer management",
        "Advanced analytics",
        "Priority support",
        "API access",
        "Multiple payment gateways",
        "Inventory forecasting",
        "Purchase management",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      price: "$199",
      period: "/month",
      icon: Building2,
      color: "from-orange-500 to-red-500",
      features: [
        "Unlimited products",
        "Custom invoicing",
        "Unlimited warehouses",
        "Multi-tenancy support",
        "Custom reports",
        "24/7 phone support",
        "Custom integrations",
        "White-label solution",
        "Advanced security",
        "Dedicated account manager",
        "Custom training",
        "SLA guarantee",
      ],
      popular: false,
    },
  ];

  const faq = [
    {
      question: "Is there a free trial?",
      answer:
        "Yes! We offer a 30-day free trial with full access to all features. No credit card required.",
    },
    {
      question: "Can I change plans anytime?",
      answer:
        "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, bank transfers, and offer annual billing discounts.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we use bank-level encryption and are SOC 2 Type II compliant. Your data is always protected.",
    },
  ];

  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
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
            Simple, Transparent
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Choose the perfect plan for your business. Start free, upgrade when
            you're ready.
          </p>
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            ✨ 30-day free trial • No credit card required
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative bg-white rounded-2xl border-2 ${
                plan.popular ? "border-purple-500" : "border-gray-200"
              } p-8 hover:shadow-xl transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center`}
                >
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.2 + featureIndex * 0.05,
                    }}
                  >
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                className={`w-full py-3 ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    : "bg-gray-900 hover:bg-gray-800"
                } text-white`}
              >
                {plan.popular ? "Start Free Trial" : "Get Started"}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {faq.map((item, index) => (
              <motion.div
                key={item.question}
                className="bg-white rounded-xl p-6 border border-gray-200"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <h4 className="font-semibold text-gray-900 mb-2">
                  {item.question}
                </h4>
                <p className="text-gray-600">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="text-center mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold mb-4">
            Ready to Transform Your Business?
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of businesses already using InventoryPro to
            streamline operations, reduce costs, and accelerate growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <motion.button
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start 30-Day Free Trial
              <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              className="border border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Live Demo
            </motion.button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm opacity-80">
            <div>✓ No credit card required</div>
            <div>✓ Setup in 5 minutes</div>
            <div>✓ Cancel anytime</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
