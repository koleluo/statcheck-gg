import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Summoner, ApiResponse, PaginatedResponse } from '@/types';

async function fetchSummoner(name: string, force = false): Promise<Summoner> {
  const { data } = await axios.get<ApiResponse<Summoner>>(
    `/api/summoners/${encodeURIComponent(name)}`,
    { params: force ? { force: 'true' } : {} }
  );
  return data.data;
}

async function fetchAllSummoners(page = 1, limit = 20): Promise<PaginatedResponse<Summoner>> {
  const { data } = await axios.get<PaginatedResponse<Summoner>>('/api/summoners', {
    params: { page, limit },
  });
  return data;
}

async function searchSummoners(query: string): Promise<Summoner[]> {
  const { data } = await axios.get<ApiResponse<Summoner[]>>('/api/summoners/search', {
    params: { q: query },
  });
  return data.data;
}

export function useSummoner(name: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['summoner', name],
    queryFn: () => fetchSummoner(name!),
    enabled: !!name,
    staleTime: 60 * 1000,
    retry: 1,
  });

  const forceRefresh = async () => {
    if (!name) return;
    await queryClient.invalidateQueries({ queryKey: ['summoner', name] });
    return queryClient.fetchQuery({
      queryKey: ['summoner', name],
      queryFn: () => fetchSummoner(name, true),
    });
  };

  return { ...query, forceRefresh };
}

export function useAllSummoners(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['summoners', page, limit],
    queryFn: () => fetchAllSummoners(page, limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSummonerSearch(query: string) {
  return useQuery({
    queryKey: ['summoner-search', query],
    queryFn: () => searchSummoners(query),
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  });
}
