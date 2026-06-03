import { readFileSync } from "node:fs";
import path from "node:path";
import type { Product } from "./types";

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  fields.push(current.trim());
  return fields;
}

function parseCategoriesCell(cell: string): string[] {
  return cell
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function loadProducts(): Product[] {
  const filePath = path.join(process.cwd(), "data", "products.csv");
  const raw = readFileSync(filePath, "utf-8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const [header, ...rows] = lines;
  const columns = parseCsvLine(header);

  const idx = {
    id: columns.indexOf("id"),
    name: columns.indexOf("name"),
    price: columns.indexOf("price"),
    description: columns.indexOf("description"),
    image: columns.indexOf("image"),
    categories: columns.indexOf("categories"),
  };

  return rows.map((line) => {
    const fields = parseCsvLine(line);
    return {
      id: fields[idx.id] ?? "",
      name: fields[idx.name] ?? "",
      price: Number.parseFloat(fields[idx.price] ?? "0"),
      description: fields[idx.description] ?? "",
      image: fields[idx.image] ?? "",
      categories: parseCategoriesCell(fields[idx.categories] ?? ""),
    };
  });
}
