import Image from "next/image";
import { ContactFooter } from "@/components/ui/contact-footer";
import { SharedProductCard } from "@/components/ui/shared-product-card";
import { comparePassword } from "@/lib/share";
import { parsePricingTiers } from "@/lib/formatting";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ password?: string }>;
};

export default async function SharedQuotePage({ params, searchParams }: PageProps) {
  const { token } = await params;
  const query = await searchParams;
  const now = new Date();

  const share = await prisma.shareToken.findUnique({
    where: { token },
    include: {
      quote: {
        include: {
          products: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  if (!share || share.revokedAt || share.expiresAt < now) {
    return (
      <main className="shell">
        <div className="card p-8 text-slate-700">This share link is unavailable or expired.</div>
      </main>
    );
  }

  if (share.passwordHash) {
    const password = query.password || "";
    const ok = password ? await comparePassword(password, share.passwordHash) : false;
    if (!ok) {
      return (
        <main className="shell">
          <section className="card mx-auto max-w-lg p-8">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Protected Quote</p>
            <h1 className="serif mt-2 text-3xl text-slate-900">Access Required</h1>
            <p className="mt-2 text-sm text-slate-600">Enter password to view this proposal.</p>
            <form className="mt-6 space-y-4" method="get">
              <label className="field">
                <span>Password</span>
                <input name="password" type="password" required />
              </label>
              <button className="btn-primary" type="submit">
                Open Quote
              </button>
            </form>
          </section>
        </main>
      );
    }
  }

  await prisma.shareToken.update({
    where: { id: share.id },
    data: { lastViewedAt: new Date() },
  });

  return (
    <main className="shell">
      <article className="card overflow-hidden">
        <header className="border-b border-slate-200 bg-slate-950 px-8 py-10 text-slate-100">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-md bg-white/5">
              <Image src="/unison-logo.png" alt="Unison logo" fill className="object-contain" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Institutional Quote</p>
              <p className="text-sm text-slate-300">Unison</p>
            </div>
          </div>
          <h1 className="serif mt-3 text-4xl">{share.quote.title}</h1>
          <p className="mt-2 text-sm text-slate-300">{share.quote.clientName || "Prepared for private review"}</p>
        </header>

        <section className="space-y-8 px-8 py-10">
          {share.quote.products.map((product) => (
            <SharedProductCard
              key={product.id}
              name={product.name}
              standardizedSummary={product.standardizedSummary}
              primaryImagePath={product.primaryImagePath}
              detailImages={JSON.parse(product.detailImagePaths || "[]") as string[]}
              tiers={parsePricingTiers(product.pricingTiers)}
            />
          ))}
        </section>

        <footer className="border-t border-slate-200 bg-slate-50 px-8 py-10 text-sm text-slate-700">
          <ContactFooter />
        </footer>
      </article>
    </main>
  );
}
