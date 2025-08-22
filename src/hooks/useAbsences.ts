import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useAbsences() {
  return useQuery({
    queryKey: ['absences'],
    queryFn: async () => {
      const response = await fetch("/api/absences", {
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.absences || data || [];
    },
  })
}

export function useDeleteAbsence() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (absenceId: string) => {
      const response = await fetch(`/api/absences/${absenceId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
    },
  })
}

export function useAddAbsence() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (absence: { subject: string; date: string; reason: string | null }) => {
      const response = await fetch("/api/absences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(absence),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
    },
  })
}