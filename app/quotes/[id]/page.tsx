import Link from "next/link";
import { createShareTokenAction, revokeShareTokenAction, updateQuoteAction } from "@/app/actions";
import { QuoteForm } from "@/components/ui/quote-form";
import { ShareLinkRow } from "@/components/ui/share-link-row";
import { formatCurrencyFromCents } from "@/lib/formatting";
import { prisma } from "@/lib/prisma";

export default async function QuoteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const shareBaseUrl = process.env.NEXT_PUBLIC_SHARE_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://share.heisenberg.help";
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      products: { orderBy: { sortOrder: "asc" } },
      shareTokens: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!quote) {
    return (
      <main className="shell">
        <div className="card p-8">
          <p className="text-slate-700">Quote not found.</p>
          <Link href="/" className="btn-secondary mt-4 inline-block">
            Back
          </Link>
        </div>
      </main>
    );
  }

  const total = quote.products.reduce((sum, item) => {
    const tiers = JSON.parse(item.pricingTiers || "[]") as Array<{
      quantity: number;
      unitPriceCents: number;
    }>;
    if (!tiers.length) return sum;
    return sum + tiers[0].quantity * tiers[0].unitPriceCents;
  }, 0);
  const bindUpdate = updateQuoteAction.bind(null, quote.id);

  return (
    <main className="shell space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Quote Workspace</p>
          <h1 className="serif text-3xl text-slate-900">{quote.title}</h1>
          <p className="text-sm text-slate-600">Total indicative value: {formatCurrencyFromCents(total)}</p>
        </div>
        <Link href="/" className="btn-secondary">
          Back
        </Link>
      </div>

      <section className="card p-8">
        {query.error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{query.error}</div>}
        <QuoteForm
          action={bindUpdate}
          submitLabel="Update Quote"
          initialTitle={quote.title}
          initialClientName={quote.clientName || ""}
          initialNotes={quote.notes || ""}
          initialProducts={quote.products.map((item) => ({
            id: item.id,
            name: item.name,
            shortDescription: item.shortDescription,
            primaryImagePath: item.primaryImagePath || "",
            detailImagePaths: JSON.parse(item.detailImagePaths || "[]") as string[],
            pricingTiers: (JSON.parse(item.pricingTiers || "[]") as Array<{
              quantity: number;
              unitPriceCents: number;
            }>).map((tier, tierIndex) => ({
              id: `${item.id}-${tierIndex}`,
              quantity: String(tier.quantity),
              unitPrice: (tier.unitPriceCents / 100).toFixed(2),
            })),
          }))}
        />
      </section>

      <section className="card p-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Temporary Share Links</h2>
        <form action={createShareTokenAction} className="mb-6 grid gap-4 md:grid-cols-3">
          <input type="hidden" name="quoteId" value={quote.id} />
          <label className="field">
            <span>Validity</span>
            <select name="validity" defaultValue="15d">
              <option value="15d">15 days</option>
              <option value="forever">No expiry</option>
            </select>
          </label>
          <label className="field md:col-span-2">
            <span>Password (Optional)</span>
            <input type="text" name="password" placeholder="Optional access code" />
          </label>
          <div className="md:col-span-3 flex justify-end">
            <button type="submit" className="btn-primary">
              Generate Link
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {quote.shareTokens.map((token) => (
            <ShareLinkRow
              key={token.id}
              id={token.id}
              fullUrl={`${shareBaseUrl}/s/${token.token}`}
              expiresLabel={
                token.revokedAt
                  ? "Revoked"
                  : token.expiresAt.getFullYear() >= 2099
                    ? "No expiry"
                    : token.expiresAt.toLocaleString()
              }
              isProtected={Boolean(token.passwordHash)}
              revokeAction={revokeShareTokenAction}
            />
          ))}
          {quote.shareTokens.length === 0 && <p className="text-sm text-slate-500">No share links yet.</p>}
        </div>
      </section>
    </main>
  );
}
