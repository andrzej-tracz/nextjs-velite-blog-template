import type { Product } from "./types";

export type PaginatedProducts = {
  products: Product[];
  total: number;
  hasMore: boolean;
  nextOffset: number;
};

export function paginateProducts(
  products: Product[],
  offset: number,
  limit: number
): PaginatedProducts {
  const safeOffset = Math.max(0, offset);
  const slice = products.slice(safeOffset, safeOffset + limit);
  const nextOffset = safeOffset + slice.length;

  return {
    products: slice,
    total: products.length,
    hasMore: nextOffset < products.length,
    nextOffset,
  };
}
