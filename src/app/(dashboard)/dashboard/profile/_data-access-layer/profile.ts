import "server-only";
import prisma from "@/lib/db";
import { UserProfile } from "@/app/(dashboard)/dashboard/profile/_types/profile";

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        phoneNumber: true,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
