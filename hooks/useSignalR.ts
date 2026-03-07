import { useQuery } from "@tanstack/react-query";
import { startHubConnection } from "@/lib/realtime/signalr";

export const SIGNALR_QUERY_KEY = ["signalr-connection"]; 

export function useSignalR() {
  return useQuery({
    queryKey: SIGNALR_QUERY_KEY,
    queryFn: async () => {
       const connection = await startHubConnection();
       return connection;
    },
    staleTime: Infinity, 
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
  });
}
