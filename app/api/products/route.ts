import {
  filterProductsByCategories,
  parseCategoriesParam,
} from "@/lib/products/category-utils";
import { PRODUCTS_CHUNK_SIZE } from "@/lib/products/constants";
import { loadProducts } from "@/lib/products/load-products";
import { paginateProducts } from "@/lib/products/paginate-products";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const selectedPaths = parseCategoriesParam(
    searchParams.get("categories") ?? undefined
  );
  const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10);
  const limit = Number.parseInt(
    searchParams.get("limit") ?? String(PRODUCTS_CHUNK_SIZE),
    10
  );

  if (!Number.isFinite(offset) || offset < 0) {
    return NextResponse.json({ error: "Invalid offset" }, { status: 400 });
  }

  if (!Number.isFinite(limit) || limit < 1 || limit > 100) {
    return NextResponse.json({ error: "Invalid limit" }, { status: 400 });
  }

  const allProducts = loadProducts();
  const filtered = filterProductsByCategories(allProducts, selectedPaths);
  const page = paginateProducts(filtered, offset, limit);

  return NextResponse.json(page);
}
