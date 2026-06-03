import { SiteHeader } from "@/components/site-header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <section className="space-y-6 text-center">
          <h1 className="text-4xl font-bold text-emerald-950 md:text-5xl">
            Welcome to Garden Shop
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-emerald-900/70">
            Plants, garden furniture, and seasonal décor for your home and
            outdoor space.
          </p>
          <Link
            href="/products"
            className="inline-flex rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Browse products
          </Link>
        </section>
        <section id="categories" className="mt-24 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-emerald-950">Categories</h2>
          <p className="mt-2 text-emerald-900/70">
            Explore Dom, Ogród, Parasole, and seasonal collections in our
            catalog.
          </p>
        </section>
        <section id="plant-care" className="mt-16 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-emerald-950">Plant care</h2>
          <p className="mt-2 text-emerald-900/70">
            Tips and products to keep your garden thriving all season.
          </p>
        </section>
        <section id="visit" className="mt-16 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-emerald-950">Visit</h2>
          <p className="mt-2 text-emerald-900/70">
            Stop by our store to see seasonal displays and speak with our team.
          </p>
        </section>
      </main>
    </>
  );
}
