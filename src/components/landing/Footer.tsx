"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Package,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Facebook,
  ArrowRight,
} from "lucide-react";
import { APP_COPYRIGHT, APP_NAME } from "@/lib/utils/constants/app";

export const Footer: React.FC = () => {
  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Integrations", href: "#integrations" },
      { label: "API Documentation", href: "#api" },
      { label: "Mobile Apps", href: "#mobile" },
    ],
    company: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Press Kit", href: "#press" },
      { label: "Partners", href: "#partners" },
      { label: "Contact", href: "#contact" },
    ],
    resources: [
      { label: "Help Center", href: "#help" },
      { label: "Video Tutorials", href: "#tutorials" },
      { label: "Webinars", href: "#webinars" },
      { label: "Case Studies", href: "#cases" },
      { label: "Blog", href: "#blog" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
      { label: "GDPR", href: "#gdpr" },
      { label: "Security", href: "#security" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#twitter", label: "Twitter" },
    { icon: Linkedin, href: "#linkedin", label: "LinkedIn" },
    { icon: Facebook, href: "#facebook", label: "Facebook" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-4">
              Stay Updated with InventoryPro
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Get the latest features, tips, and industry insights delivered to
              your inbox
            </p>

            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-white placeholder-gray-300 outline outline-white focus:ring-2 focus:ring-white"
              />
              <motion.button
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">{APP_NAME}</span>
              </div>

              <p className="text-gray-400 mb-6 max-w-sm">
                The complete inventory management and invoicing solution for
                modern businesses. Streamline operations, reduce costs, and
                accelerate growth.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">hello@vriddhibook.info</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">West Bengal, India</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(
            ([category, links], categoryIndex) => (
              <div key={category}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                >
                  <h4 className="text-lg font-semibold mb-4 capitalize">
                    {category === "product"
                      ? "Product"
                      : category === "company"
                        ? "Company"
                        : category === "resources"
                          ? "Resources"
                          : "Legal"}
                  </h4>
                  <ul className="space-y-3">
                    {links.map((link, linkIndex) => (
                      <motion.li
                        key={link.label}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.3,
                          delay: categoryIndex * 0.1 + linkIndex * 0.05,
                        }}
                      >
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-gray-400 text-sm">{APP_COPYRIGHT}</div>

            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>All systems operational</span>
              </div>
              <div>Made with ❤️ by Vriddhi Book Team.</div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
