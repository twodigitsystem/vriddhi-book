/**
 * Error Handler Utility for Inventory Module
 * Provides consistent error handling for Prisma database operations
 */

import { Prisma } from "@/generated/prisma/client";

/**
 * Type guard to check if an error is a Prisma error
 */
export function isPrismaError(
  error: unknown
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

/**
 * Handle Prisma-specific errors and return user-friendly messages
 */
export function handlePrismaError(error: unknown): {
  success: false;
  error: string;
} {
  if (isPrismaError(error)) {
    switch (error.code) {
      case "P2002":
        return {
          success: false,
          error: "A record with this name or identifier already exists.",
        };
      case "P2025":
        return {
          success: false,
          error: "The requested record was not found.",
        };
      case "P2003":
        return {
          success: false,
          error: "Foreign key constraint failed. Please check related records.",
        };
      default:
        console.error(`Prisma error (${error.code}):`, error.message);
        return {
          success: false,
          error: "Database operation failed. Please try again.",
        };
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    console.error("Generic error:", error.message);
    return {
      success: false,
      error: error.message || "An unexpected error occurred.",
    };
  }

  // Handle unknown errors
  console.error("Unknown error:", error);
  return {
    success: false,
    error: "An unexpected error occurred.",
  };
}

/**
 * Extract error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
