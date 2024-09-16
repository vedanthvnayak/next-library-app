export interface IPagedResponse<T> {
  items: T[];
  pagination: {
    offset: number;
    limit: number;
    total: number;
    sort?: string;
  };
}

export interface IPageRequest {
  search?: string;
  offset: number;
  limit: number;
  sort?: string;
}
