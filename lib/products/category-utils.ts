import { CATEGORY_HIERARCHY } from "./category-hierarchy";
import type { CategoryNode, CategoryTreeItem, Product } from "./types";

export function encodeCategoryPath(segments: string[]): string {
  return segments.join("/");
}

export function decodeCategoryPath(path: string): string[] {
  return path.split("/").filter(Boolean);
}

function findNode(
  nodes: CategoryNode[],
  segments: string[]
): CategoryNode | null {
  if (segments.length === 0) return null;
  const [head, ...rest] = segments;
  const node = nodes.find((n) => n.name === head);
  if (!node) return null;
  if (rest.length === 0) return node;
  return findNode(node.children ?? [], rest);
}

export function getSubtreeTagNames(node: CategoryNode): string[] {
  const names = [node.name];
  for (const child of node.children ?? []) {
    names.push(...getSubtreeTagNames(child));
  }
  return names;
}

/** Product matches category path if it has any tag in the node's subtree. */
export function productMatchesCategoryPath(
  product: Product,
  pathSegments: string[]
): boolean {
  const node = findNode(CATEGORY_HIERARCHY, pathSegments);
  if (!node) return false;
  const allowed = new Set(getSubtreeTagNames(node));
  return product.categories.some((tag) => allowed.has(tag));
}

export function countProductsForPath(
  products: Product[],
  pathSegments: string[]
): number {
  return products.filter((p) => productMatchesCategoryPath(p, pathSegments))
    .length;
}

function buildTreeItem(
  node: CategoryNode,
  parentSegments: string[],
  products: Product[]
): CategoryTreeItem | null {
  const segments = [...parentSegments, node.name];
  const path = encodeCategoryPath(segments);
  const children = (node.children ?? [])
    .map((child) => buildTreeItem(child, segments, products))
    .filter((c): c is CategoryTreeItem => c !== null);

  const count = countProductsForPath(products, segments);
  if (count === 0 && children.length === 0) return null;

  return { name: node.name, path, count, children };
}

/** Only categories (and ancestors) that have at least one matching product. */
export function buildCategoryTreeWithCounts(
  products: Product[]
): CategoryTreeItem[] {
  return CATEGORY_HIERARCHY.map((root) =>
    buildTreeItem(root, [], products)
  ).filter((item): item is CategoryTreeItem => item !== null);
}

export function filterProductsByCategories(
  products: Product[],
  selectedPaths: string[]
): Product[] {
  if (selectedPaths.length === 0) return products;
  return products.filter((product) =>
    selectedPaths.some((path) =>
      productMatchesCategoryPath(product, decodeCategoryPath(path))
    )
  );
}

export function parseCategoriesParam(
  param: string | string[] | undefined
): string[] {
  if (!param) return [];
  const raw = Array.isArray(param) ? param.join(",") : param;
  return raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
}
