interface Unit {
  unit_id: string;
  name: string;
  symbol: string;
  created_at: string;
}

interface Pagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}
