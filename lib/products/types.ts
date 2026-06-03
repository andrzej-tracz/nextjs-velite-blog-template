export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  /** Flat category tags from CSV (comma-separated cell). */
  categories: string[];
};

export type CategoryNode = {
  name: string;
  children?: CategoryNode[];
};

export type CategoryTreeItem = {
  name: string;
  /** Slash-separated path, e.g. `Ogród/Huśtawki`. */
  path: string;
  count: number;
  children: CategoryTreeItem[];
};
