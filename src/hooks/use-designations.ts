import { useQuery } from "@tanstack/react-query";
import { getDesignations } from "@/app/(dashboard)/dashboard/(owner)/settings/designation/_actions/designation";
import { Designation } from "@/app/(dashboard)/dashboard/(owner)/settings/designation/_schemas/settings.designation.schema";

export function useDesignations() {
  return useQuery<Designation[], Error>({
    queryKey: ["designations"],
    queryFn: async (): Promise<Designation[]> => {
      const result = await getDesignations();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch designations");
      }
      return result.data.map((designation) => ({
        ...designation,
        active: true, // Adding missing required 'active' property
        description: designation.description || undefined,
        createdAt: designation.createdAt.toISOString(),
        updatedAt: designation.updatedAt.toISOString(),
      }));
    },
  });
}
