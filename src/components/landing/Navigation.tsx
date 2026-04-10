"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Package, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { APP_NAME } from "@/lib/constants/app";
import { authClient } from "@/lib/auth-client";
import AuthenticatedAvatar from "../global/authenticatedAvatar";
import { FeaturesDropdown } from "./FeaturesDropdown";
import Link from "next/link";
import LoadingSpinner from "../custom-ui/loading-spinner";

const navItems = [
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#resources" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  // Handle keyboard navigation for mobile menu
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsMenuOpen(false);
    }
  };

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border"
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
            <Link
              href="/"
              className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`${APP_NAME} home`}
            >
              <Package className="w-5 h-5 text-white" />
            </Link>
            <Link
              href="/"
              className="text-xl font-bold text-foreground hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label={`${APP_NAME} home`}
            >
              {APP_NAME}
            </Link>
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
                className="flex items-center text-muted-foreground hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
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
              <Loader2 className="animate-spin" />
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className={buttonVariants({ size: "sm", variant: "default" })}
                  aria-label="Go to dashboard"
                >
                  Go to Dashboard
                </Link>
                <AuthenticatedAvatar />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    size: "sm",
                    variant: "outline",
                  })}
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    size: "sm",
                    className:
                      "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                  })}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-blue-600"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={
                isMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
            >
              {isMenuOpen ? (
                <X className="size-6" aria-hidden="true" />
              ) : (
                <Menu className="size-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop overlay — tap to close */}
              <motion.div
                className="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm md:hidden z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
              />

              {/* Menu panel */}
              <motion.div
                className="absolute left-0 right-0 top-16 md:hidden bg-background border-b border-border shadow-lg z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                id="mobile-menu"
                role="menu"
                aria-orientation="vertical"
                onKeyDown={handleKeyDown}
              >
                <div className="px-4 pt-3 pb-4 space-y-1 border-t border-border">
                  {/* Features Dropdown for Mobile */}
                  <div className="mb-2">
                    <FeaturesDropdown
                      isMobile
                      onItemClick={() => setIsMenuOpen(false)}
                    />
                  </div>

                  {/* Other Nav Items */}
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block px-3 py-2.5 text-muted-foreground hover:text-blue-600 hover:bg-accent rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Mobile Authentication Section */}
                  <div className="pt-4 space-y-3 border-t border-border mt-2">
                    {isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : session?.user ? (
                      <>
                        <Link
                          href="/dashboard"
                          className={buttonVariants({
                            className: "w-full",
                          })}
                          onClick={() => setIsMenuOpen(false)}
                          aria-label="Go to dashboard"
                        >
                          Go to Dashboard
                        </Link>
                        <div className="flex justify-center pt-1">
                          <AuthenticatedAvatar />
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/sign-in"
                          className={buttonVariants({
                            variant: "outline",
                            className: "w-full",
                          })}
                          onClick={() => setIsMenuOpen(false)}
                          aria-label="Login to your account"
                        >
                          Login
                        </Link>
                        <Link
                          href="/sign-up"
                          className={buttonVariants({
                            className:
                              "w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                          })}
                          onClick={() => setIsMenuOpen(false)}
                          aria-label="Get started with your account"
                        >
                          Get Started
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
