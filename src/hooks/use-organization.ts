import { useQuery } from "@tanstack/react-query";
import { getCurrentUserFromServer } from "@/app/(auth)/_actions/users";

export function useOrganization() {
  return useQuery({
    queryKey: ["organizationId"],
    queryFn: async () => {
      try {
        const { session } = await getCurrentUserFromServer();
        if (!session || !session.activeOrganizationId) {
          return null; // Return null instead of throwing error
        }
        return session.activeOrganizationId;
      } catch (error) {
        console.warn("Failed to get organization:", error);
        return null; // Return null on error
      }
    },
    staleTime: Infinity, // Organization ID is unlikely to change frequently
    retry: false, // Don't retry on failure
  });
}
