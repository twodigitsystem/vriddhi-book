import { useQuery } from "@tanstack/react-query";
import { getOrganizationId } from "@/lib/get-session";

export function useOrganization() {
  return useQuery({
    queryKey: ["organizationId"],
    queryFn: async () => {
      try {
        const activeOrganizationId = await getOrganizationId();
        if (!activeOrganizationId) {
          return null; // No active organization
        }
        return activeOrganizationId;
      } catch (error) {
        console.warn("Failed to get organization:", error);
        return null; // Return null on error
      }
    },
    staleTime: Infinity, // Organization ID is unlikely to change frequently
    retry: false, // Don't retry on failure
  });
}
