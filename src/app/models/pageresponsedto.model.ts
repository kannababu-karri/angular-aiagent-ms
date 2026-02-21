export interface PageResponseDto<T> {
  content: T[];        // List of items
  totalPages: number;  // Total number of pages
  totalElements: number; // Total number of elements across all pages
  pageNumber: number;  // Current page number
  pageSize: number;    // Number of items per page
}