import { CategoryFilter } from "@/components/products/category-filter";
import { ProductInfiniteList } from "@/components/products/product-infinite-list";
import { SiteHeader } from "@/components/site-header";
import {
  buildCategoryTreeWithCounts,
  filterProductsByCategories,
  parseCategoriesParam,
} from "@/lib/products/category-utils";
import { PRODUCTS_CHUNK_SIZE } from "@/lib/products/constants";
import { loadProducts } from "@/lib/products/load-products";
import { paginateProducts } from "@/lib/products/paginate-products";
import { Suspense } from "react";

type ProductsPageProps = {
  searchParams: Promise<{ categories?: string | string[] }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const selectedPaths = parseCategoriesParam(params.categories);
  const allProducts = loadProducts();
  const categoryTree = buildCategoryTreeWithCounts(allProducts);
  const filteredProducts = filterProductsByCategories(
    allProducts,
    selectedPaths
  );
  const initialPage = paginateProducts(
    filteredProducts,
    0,
    PRODUCTS_CHUNK_SIZE
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
            <ProductInfiniteList
              key={selectedPaths.join(",")}
              initialProducts={initialPage.products}
              totalCount={initialPage.total}
              selectedCategories={selectedPaths}
            />
          </div>
        </div>
      </div>
    </>
  );
}
