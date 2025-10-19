"use client";
import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Menu, X, Package } from "lucide-react";
import { Button } from "../ui/button";
import { APP_NAME } from "@/lib/constants/app";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import AuthenticatedAvatar from "../global/authenticatedAvatar";
import { FeaturesDropdown } from "./FeaturesDropdown";

const LazyNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const navItems = [
    { label: "Pricing", href: "#pricing" },
    { label: "Resources", href: "#resources" },
    { label: "Contact", href: "#contact" },
  ];

  // Handle keyboard navigation for mobile menu
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsMenuOpen(false);
    }
  };

  // Focus management for mobile menu
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <a
              href="/"
              className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`${APP_NAME} home`}
            >
              <Package className="w-5 h-5 text-white" />
            </a>
            <a
              href="/"
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label={`${APP_NAME} home`}
            >
              {APP_NAME}
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {/* Features Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <FeaturesDropdown />
            </motion.div>

            {/* Other Nav Items */}
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 1) * 0.1 }}
                role="menuitem"
              >
                {item.label}
              </motion.a>
            ))}

            {/* Authentication Section */}
            {isPending ? (
              // Loading state
              <div className="w-20 h-10 bg-gray-200 rounded animate-pulse" />
            ) : session?.user ? (
              // Authenticated user
              <>
                <Button
                size="sm"
                  onClick={() => router.push("/dashboard")}
                  variant="default"
                  className="mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Go to dashboard"
                >
                  Go to Dashboard
                </Button>
                <AuthenticatedAvatar />
              </>
            ) : (
              // Not authenticated
              <>
                <Button
                size="sm"
                  onClick={() => router.push("/sign-in")}
                  variant="outline"
                  className="mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Login to your account"
                >
                  Login
                </Button>
                <Button
                size="sm"
                  onClick={() => router.push("/sign-up")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Get started with your account"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded p-2"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            id="mobile-menu"
            role="menu"
            aria-orientation="vertical"
            onKeyDown={handleKeyDown}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-100">
              {/* Features Dropdown for Mobile */}
              <div className="mb-2">
                <FeaturesDropdown isMobile onItemClick={() => setIsMenuOpen(false)} />
              </div>

              {/* Other Nav Items */}
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded"
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                >
                  {item.label}
                </a>
              ))}

              {/* Mobile Authentication Section */}
              <div className="pt-4 space-y-2">
                {isPending ? (
                  // Loading state
                  <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
                ) : session?.user ? (
                  // Authenticated user
                  <>
                    <Button
                      onClick={() => {
                        router.push("/dashboard");
                        setIsMenuOpen(false);
                      }}
                      className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Go to dashboard"
                    >
                      Go to Dashboard
                    </Button>
                    <div className="flex justify-center">
                      <AuthenticatedAvatar />
                    </div>
                  </>
                ) : (
                  // Not authenticated
                  <>
                    <Button
                      onClick={() => {
                        router.push("/sign-in");
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Login to your account"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        router.push("/sign-up");
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Get started with your account"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export function Navigation() {
  return (
    <Suspense fallback={<div className="h-16 bg-white/95 backdrop-blur-sm border-b border-gray-100" />}>
      <LazyNavigation />
    </Suspense>
  );
};
