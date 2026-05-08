import Link from "next/link";
import Image from "next/image";
import { deleteQuoteAction } from "@/app/actions";
import { formatCurrencyFromCents } from "@/lib/formatting";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const quotes = await prisma.quote.findMany({
    include: { products: true, shareTokens: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="shell space-y-8">
      <header className="card flex flex-wrap items-end justify-between gap-5 p-8">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md border border-slate-200 bg-white">
              <Image src="/unison-logo.png" alt="Unison logo" fill className="object-contain" />
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Heisenberg Workspace</p>
          </div>
          <h1 className="serif mt-2 text-4xl text-slate-900">Quote Management Desk</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Private local-first quote builder for institutional product proposals.
          </p>
        </div>
        <Link className="btn-primary" href="/quotes/new">
          Create Quote Page
        </Link>
      </header>

      <section className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Quote</th>
              <th className="px-5 py-3">Products</th>
              <th className="px-5 py-3">Indicative Value</th>
              <th className="px-5 py-3">Share Links</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => {
              const total = quote.products.reduce((sum, item) => {
                const tiers = JSON.parse(item.pricingTiers || "[]") as Array<{
                  quantity: number;
                  unitPriceCents: number;
                }>;
                if (!tiers.length) return sum;
                return sum + tiers[0].quantity * tiers[0].unitPriceCents;
              }, 0);
              const activeLinks = quote.shareTokens.filter((token) => !token.revokedAt).length;

              return (
                <tr key={quote.id} className="border-b border-slate-100 align-top">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">{quote.title}</div>
                    <div className="text-xs text-slate-500">{quote.clientName || "No client label"}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">{quote.products.length}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{formatCurrencyFromCents(total)}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{activeLinks}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-3 text-sm">
                      <Link href={"/quotes/" + quote.id} className="font-medium text-slate-700 hover:text-slate-900">
                        Open
                      </Link>
                      <form action={deleteQuoteAction}>
                        <input type="hidden" name="id" value={quote.id} />
                        <button className="font-medium text-slate-400 hover:text-red-600" type="submit">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}
