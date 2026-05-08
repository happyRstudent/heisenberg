import Link from "next/link";
import { createQuoteAction } from "@/app/actions";
import { QuoteForm } from "@/components/ui/quote-form";

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const query = await searchParams;
  return (
    <main className="shell space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">New Document</p>
          <h1 className="serif text-3xl text-slate-900">Create Quote Page</h1>
        </div>
        <Link href="/" className="btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      {query.error && (
        <section className="card border-red-200 bg-red-50 p-4 text-sm text-red-700">{query.error}</section>
      )}

      <section className="card p-8">
        <QuoteForm action={createQuoteAction} submitLabel="Save Quote" />
      </section>
    </main>
  );
}
