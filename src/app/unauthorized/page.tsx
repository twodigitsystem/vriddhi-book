"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldX, ArrowLeft, Home, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-red-50/20 to-amber-50/20 dark:from-background dark:via-red-950/10 dark:to-amber-950/10 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-red-100/30 dark:bg-red-900/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-amber-100/30 dark:bg-amber-900/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg"
      >
        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6 sm:pb-8 px-4 sm:px-6">
            {/* Enhanced icon with animation */}
            <motion.div
              className="mx-auto mb-4 sm:mb-6 relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                type: "spring",
                stiffness: 200,
              }}
            >
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-red-600/30 dark:from-red-500/10 dark:to-red-600/20 shadow-lg">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-full bg-red-500/10 dark:bg-red-500/20">
                  <ShieldX className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-red-600 dark:text-red-400" />
                </div>
              </div>
              {/* Floating lock icon */}
              <motion.div
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-amber-500 shadow-lg"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-400 dark:to-red-500 bg-clip-text text-transparent mb-2">
                Oops! Access Denied
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-muted-foreground leading-relaxed px-2">
                You don't have permission to view this page.
              </CardDescription>
              <p className="text-xs sm:text-sm text-muted-foreground/80 mt-2 px-2">
                It seems you've stumbled upon a restricted area. Please check
                your access rights or return to the homepage.
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-200/50 to-slate-300/50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="relative w-full h-10 sm:h-12 rounded-xl border-2 border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-800/90 hover:border-slate-300/80 dark:hover:border-slate-600/80 transition-all duration-300 text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 shadow-lg hover:shadow-xl overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                  <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-x-1" />
                  Go Back
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/30 to-orange-500/30 rounded-xl blur-lg group-hover:blur-xl group-hover:from-rose-500/50 group-hover:to-orange-500/50 transition-all duration-300" />
                <Button
                  asChild
                  className="relative w-full h-10 sm:h-12 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 hover:from-rose-600 hover:via-pink-600 hover:to-orange-600 text-white font-semibold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden group"
                >
                  <Link href="/">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
                    Go Back Home
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center pt-3 sm:pt-4 border-t border-border/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-muted/50 border">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Error Code:
                </span>
                <motion.span
                  className="font-mono font-bold text-red-600 dark:text-red-400 text-base sm:text-lg"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(220, 38, 38, 0)",
                      "0 0 10px rgba(220, 38, 38, 0.3)",
                      "0 0 0px rgba(220, 38, 38, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  403
                </motion.span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
