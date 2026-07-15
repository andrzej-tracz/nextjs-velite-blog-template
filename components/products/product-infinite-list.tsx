"use client";

import { ProductCard } from "@/components/products/product-card";
import { PRODUCTS_CHUNK_SIZE } from "@/lib/products/constants";
import type { PaginatedProducts } from "@/lib/products/paginate-products";
import type { Product } from "@/lib/products/types";
import { useCallback, useEffect, useRef, useState } from "react";

type ProductInfiniteListProps = {
  initialProducts: Product[];
  totalCount: number;
  selectedCategories: string[];
};

export function ProductInfiniteList({
  initialProducts,
  totalCount,
  selectedCategories,
}: ProductInfiniteListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [hasMore, setHasMore] = useState(initialProducts.length < totalCount);
  const [isLoading, setIsLoading] = useState(false);
  const offsetRef = useRef(initialProducts.length);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        offset: String(offsetRef.current),
        limit: String(PRODUCTS_CHUNK_SIZE),
      });

      if (selectedCategories.length > 0) {
        params.set("categories", selectedCategories.join(","));
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) return;

      const data = (await response.json()) as PaginatedProducts;
      setProducts((current) => [...current, ...data.products]);
      offsetRef.current = data.nextOffset;
      setHasMore(data.hasMore);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [hasMore, selectedCategories]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-emerald-900/70">
        No products match the selected categories.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex justify-center py-8"
          aria-hidden={!isLoading}
        >
          {isLoading ? (
            <p className="text-sm text-emerald-900/60">Loading more products…</p>
          ) : (
            <span className="h-8" />
          )}
        </div>
      )}
    </>
  );
}
