import type { CategoryNode } from "./types";

/** Fixed category tree; CSV tags are flat names that map into this hierarchy. */
export const CATEGORY_HIERARCHY: CategoryNode[] = [
  {
    name: "Dom",
    children: [
      { name: "Dekoracje" },
      { name: "Oświetlenie" },
      { name: "Tekstylia" },
    ],
  },
  {
    name: "Ogród",
    children: [
      { name: "Huśtawki" },
      { name: "Baseny" },
      { name: "Meble ogrodowe" },
      { name: "Grille" },
      { name: "Narzędzia ogrodowe" },
      { name: "Rośliny" },
    ],
  },
  {
    name: "Parasole",
    children: [{ name: "Ogrodowe" }, { name: "Tarasowe" }],
  },
  {
    name: "Dziecko",
    children: [{ name: "Huśtawki" }, { name: "Zabawki" }],
  },
  {
    name: "Boże Narodzenie",
    children: [
      { name: "Lampki Choinkowe" },
      { name: "Lampki" },
      { name: "Ozdoby choinkowe" },
    ],
  },
];
