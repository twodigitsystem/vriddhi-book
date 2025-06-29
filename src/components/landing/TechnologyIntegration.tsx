"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Cloud,
  Shield,
  Zap,
  Globe,
  Database,
  Wifi,
  Lock,
  RefreshCw,
} from "lucide-react";

export const TechnologyIntegration: React.FC = () => {
  const integrations = [
    {
      category: "Payment Gateways",
      icon: CreditCard,
      description:
        "Seamless integration with leading payment providers worldwide",
      features: [
        "Stripe - Global payment processing",
        "PayPal - Trusted online payments",
        "Razorpay - Indian payment gateway",
        "Square - POS and online payments",
        "Bank transfers - Direct integration",
      ],
    },
    {
      category: "Mobile & Accessibility",
      icon: Smartphone,
      description:
        "Native mobile apps and responsive web design for all devices",
      features: [
        "iOS and Android apps",
        "Progressive Web App (PWA)",
        "Offline mode capability",
        "Touch-optimized interface",
        "Barcode scanner integration",
      ],
    },
    {
      category: "Cloud Infrastructure",
      icon: Cloud,
      description:
        "Enterprise-grade cloud infrastructure with global availability",
      features: [
        "AWS/Azure cloud hosting",
        "Global CDN distribution",
        "Auto-scaling architecture",
        "99.9% uptime guarantee",
        "Disaster recovery",
      ],
    },
    {
      category: "Security & Compliance",
      icon: Shield,
      description:
        "Bank-level security with comprehensive compliance standards",
      features: [
        "SSL/TLS encryption",
        "SOC 2 Type II compliance",
        "GDPR compliance",
        "Two-factor authentication",
        "Role-based access control",
      ],
    },
  ];

  const techStack = [
    { name: "React", logo: "⚛️", description: "Modern frontend framework" },
    { name: "Node.js", logo: "🟢", description: "Scalable backend runtime" },
    { name: "PostgreSQL", logo: "🐘", description: "Reliable database" },
    { name: "Redis", logo: "🔴", description: "High-performance caching" },
    { name: "Docker", logo: "🐳", description: "Containerized deployment" },
    { name: "Kubernetes", logo: "☸️", description: "Container orchestration" },
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
            Powerful Integrations &
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Modern Technology
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Built on cutting-edge technology with seamless integrations to power
            your business
          </p>
        </motion.div>

        {/* Integration Categories */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.category}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <integration.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {integration.category}
                </h3>
              </div>

              <p className="text-gray-600 mb-6">{integration.description}</p>

              <div className="space-y-3">
                {integration.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.2 + featureIndex * 0.1,
                    }}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technology Stack */}
        <motion.div
          className="bg-gray-900 rounded-2xl p-8 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">
              Built with Modern Technology
            </h3>
            <p className="text-gray-300">
              Leveraging the latest technologies for performance, scalability,
              and reliability
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                className="text-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-2">{tech.logo}</div>
                <div className="font-semibold mb-1">{tech.name}</div>
                <div className="text-xs text-gray-300">{tech.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: Zap,
              title: "Lightning Fast",
              description:
                "Optimized performance with sub-second response times",
            },
            {
              icon: Globe,
              title: "Global Reach",
              description: "Multi-currency, multi-language support worldwide",
            },
            {
              icon: RefreshCw,
              title: "Real-time Sync",
              description: "Instant data synchronization across all devices",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center p-6 border border-gray-200 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
