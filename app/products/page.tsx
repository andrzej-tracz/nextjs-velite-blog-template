import { CategoryFilter } from "@/components/products/category-filter";
import { ProductCard } from "@/components/products/product-card";
import { SiteHeader } from "@/components/site-header";
import {
  buildCategoryTreeWithCounts,
  filterProductsByCategories,
  parseCategoriesParam,
} from "@/lib/products/category-utils";
import { loadProducts } from "@/lib/products/load-products";
import { Suspense } from "react";

type ProductsPageProps = {
  searchParams: Promise<{ categories?: string | string[] }>;
};

function ProductGrid({
  products,
}: {
  products: ReturnType<typeof loadProducts>;
}) {
  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-emerald-900/70">
        No products match the selected categories.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const selectedPaths = parseCategoriesParam(params.categories);
  const allProducts = loadProducts();
  const categoryTree = buildCategoryTreeWithCounts(allProducts);
  const filteredProducts = filterProductsByCategories(
    allProducts,
    selectedPaths
  );

  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-950">Products</h1>
          <p className="mt-2 text-emerald-900/70">
            Browse our catalog. Expand categories to refine your search.
          </p>
        </header>
        <div className="flex flex-col gap-8 lg:flex-row">
          <Suspense fallback={<div className="lg:w-64" />}>
            <CategoryFilter tree={categoryTree} selectedPaths={selectedPaths} />
          </Suspense>
          <div className="min-w-0 flex-1">
            <p className="mb-4 text-sm text-emerald-900/60">
              {filteredProducts.length} product
              {filteredProducts.length === 1 ? "" : "s"}
            </p>
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </>
  );
}
