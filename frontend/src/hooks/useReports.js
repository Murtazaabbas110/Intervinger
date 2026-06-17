import { useQuery } from "@tanstack/react-query";
import { getReports } from "../api/reports";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });
}