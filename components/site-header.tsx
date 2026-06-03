import Link from "next/link";

const navItems = [
  { href: "/products", label: "Products" },
  { href: "/#categories", label: "Categories" },
  { href: "/#plant-care", label: "Plant care" },
  { href: "/#visit", label: "Visit" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-4">
        <Link href="/" className="text-lg font-semibold text-emerald-900">
          Garden Shop
        </Link>
        <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-emerald-900/80">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-emerald-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
