import Image from "next/image";
import type { Product } from "@/lib/products/types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-emerald-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-lg font-semibold text-emerald-950">{product.name}</h2>
        <p className="line-clamp-2 text-sm text-emerald-900/70">
          {product.description}
        </p>
        <p className="mt-auto text-base font-semibold text-emerald-800">
          {product.price.toFixed(2)} PLN
        </p>
        <p className="text-xs text-emerald-900/50">
          {product.categories.join(" · ")}
        </p>
      </div>
    </article>
  );
}
