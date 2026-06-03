"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import type { CategoryTreeItem } from "@/lib/products/types";

type CategoryFilterProps = {
  tree: CategoryTreeItem[];
  selectedPaths: string[];
};

function CategoryRow({
  item,
  depth,
  selectedPaths,
  expandedPaths,
  onToggleExpand,
  onToggleSelect,
}: {
  item: CategoryTreeItem;
  depth: number;
  selectedPaths: string[];
  expandedPaths: Set<string>;
  onToggleExpand: (path: string) => void;
  onToggleSelect: (path: string, checked: boolean) => void;
}) {
  const hasChildren = item.children.length > 0;
  const isExpanded = expandedPaths.has(item.path);
  const isSelected = selectedPaths.includes(item.path);

  return (
    <li>
      <div
        className="flex items-center gap-1 rounded-md py-1 pr-2 hover:bg-emerald-50"
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            onClick={() => onToggleExpand(item.path)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-emerald-800 hover:bg-emerald-100"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="h-7 w-7 shrink-0" aria-hidden />
        )}
        <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onToggleSelect(item.path, e.target.checked)}
            className="h-4 w-4 rounded border-emerald-300 text-emerald-700 focus:ring-emerald-500"
          />
          <span className="truncate text-emerald-950">{item.name}</span>
          <span className="ml-auto shrink-0 tabular-nums text-emerald-700/70">
            ({item.count})
          </span>
        </label>
      </div>
      {hasChildren && isExpanded && (
        <ul>
          {item.children.map((child) => (
            <CategoryRow
              key={child.path}
              item={child}
              depth={depth + 1}
              selectedPaths={selectedPaths}
              expandedPaths={expandedPaths}
              onToggleExpand={onToggleExpand}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function CategoryFilter({ tree, selectedPaths }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const path of selectedPaths) {
      const parts = path.split("/");
      for (let i = 1; i < parts.length; i++) {
        initial.add(parts.slice(0, i).join("/"));
      }
    }
    return initial;
  });

  const updateCategories = useCallback(
    (paths: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (paths.length === 0) {
        params.delete("categories");
      } else {
        params.set("categories", paths.join(","));
      }
      const query = params.toString();
      router.push(query ? `/products?${query}` : "/products");
    },
    [router, searchParams]
  );

  const onToggleExpand = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const onToggleSelect = (path: string, checked: boolean) => {
    const next = checked
      ? [...selectedPaths, path]
      : selectedPaths.filter((p) => p !== path);
    updateCategories(next);
  };

  const clearAll = () => updateCategories([]);

  const sidebar = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">
          Categories
        </h2>
        {selectedPaths.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-emerald-700 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      {tree.length === 0 ? (
        <p className="text-sm text-emerald-900/60">No categories available.</p>
      ) : (
        <ul className="space-y-0.5">
          {tree.map((item) => (
            <CategoryRow
              key={item.path}
              item={item}
              depth={0}
              selectedPaths={selectedPaths}
              expandedPaths={expandedPaths}
              onToggleExpand={onToggleExpand}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="mb-4 w-full rounded-lg border border-emerald-900/15 bg-white px-4 py-2 text-sm font-medium text-emerald-900 lg:hidden"
        onClick={() => setMobileOpen((o) => !o)}
      >
        {mobileOpen ? "Hide categories" : "Filter by category"}
      </button>
      <aside
        className={cn(
          "lg:block lg:w-64 lg:shrink-0",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="rounded-lg border border-emerald-900/10 bg-white p-4 shadow-sm lg:sticky lg:top-20">
          {sidebar}
        </div>
      </aside>
    </>
  );
}
