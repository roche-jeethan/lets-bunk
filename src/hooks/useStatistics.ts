import { useQuery } from "@tanstack/react-query";

export function useStatistics() {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const response = await fetch("/api/statistics");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch statistics");
      }

      return response.json();
    },
  });
}
