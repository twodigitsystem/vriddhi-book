import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export async function requireAdminAccess() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Check if user is admin else redirect to unauthorized
  if (session?.user?.role !== "admin") {
    redirect("/unauthorized");
  }

  return session;
}
