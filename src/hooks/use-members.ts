import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@/app/(dashboard)/dashboard/(owner)/settings/members/_actions/member";
import { Member } from "@/app/(dashboard)/dashboard/(owner)/settings/members/_types/types.member";

export function useMembers() {
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const result = await getMembers();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch members");
      }
      return result.data as Member[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
