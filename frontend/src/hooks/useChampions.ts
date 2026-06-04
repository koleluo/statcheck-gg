import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Champion, ApiResponse, PaginatedResponse } from '@/types';

interface ChampionFilters {
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

async function fetchChampions(filters: ChampionFilters): Promise<PaginatedResponse<Champion>> {
  const { data } = await axios.get<PaginatedResponse<Champion>>('/api/champions', {
    params: filters,
  });
  return data;
}

async function fetchChampion(id: string): Promise<Champion> {
  const { data } = await axios.get<ApiResponse<Champion>>(`/api/champions/${id}`);
  return data.data;
}

export function useChampions(filters: ChampionFilters = {}) {
  return useQuery({
    queryKey: ['champions', filters],
    queryFn: () => fetchChampions(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useChampion(id: string | undefined) {
  return useQuery({
    queryKey: ['champion', id],
    queryFn: () => fetchChampion(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
