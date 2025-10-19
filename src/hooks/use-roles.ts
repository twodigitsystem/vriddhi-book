import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/app/(dashboard)/dashboard/(owner)/settings/roles/_actions/role";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const result = await getRoles();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch roles");
      }
      return result.data || [];
    },
  });
}
