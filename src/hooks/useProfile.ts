import { useQuery } from "@tanstack/react-query";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await fetch("/api/profile");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch profile");
      }

      return response.json();
    },
  });
}
