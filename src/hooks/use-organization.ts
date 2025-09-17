import { useQuery } from "@tanstack/react-query";
import { getCurrentUserFromServer } from "@/app/(auth)/_actions/users";

export function useOrganization() {
  return useQuery({
    queryKey: ["organizationId"],
    queryFn: async () => {
      const { session } = await getCurrentUserFromServer();
      if (!session || !session.activeOrganizationId) {
        throw new Error("No active organization found");
      }
      return session.activeOrganizationId;
    },
    staleTime: Infinity, // Organization ID is unlikely to change frequently
  });
}
