export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type SortOrder = 'asc' | 'desc';

export interface ChampionSortOptions {
  field: 'winRate' | 'pickRate' | 'banRate' | 'avgKda' | 'avgCs' | 'name';
  order: SortOrder;
}
