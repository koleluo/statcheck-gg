import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Match, ApiResponse } from '@/types';

async function fetchMatch(id: string): Promise<Match> {
  const { data } = await axios.get<ApiResponse<Match>>(`/api/matches/${id}`);
  return data.data;
}

async function fetchRecentMatches(limit = 10): Promise<Match[]> {
  const { data } = await axios.get<ApiResponse<Match[]>>('/api/matches/recent', {
    params: { limit },
  });
  return data.data;
}

export function useMatch(id: string | undefined) {
  return useQuery({
    queryKey: ['match', id],
    queryFn: () => fetchMatch(id!),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useRecentMatches(limit = 10) {
  return useQuery({
    queryKey: ['recent-matches', limit],
    queryFn: () => fetchRecentMatches(limit),
    staleTime: 2 * 60 * 1000,
  });
}
