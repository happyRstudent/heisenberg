import { format } from "date-fns";

interface DashboardShellProps {
  quoteCount: number;
  productCount: number;
}

export function DashboardShell({ quoteCount, productCount }: DashboardShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 md:px-10">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Local Workspace</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Quote Dashboard</h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Premium local quote operations for a single operator. Data stays on this machine.
        </p>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Quotes</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950">{quoteCount}</p>
          <p className="mt-2 text-sm text-slate-600">Active records currently stored in SQLite.</p>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Products</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950">{productCount}</p>
          <p className="mt-2 text-sm text-slate-600">Catalog entries available for quote composition.</p>
        </article>
      </section>

      <section className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Roadmap Readiness</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>Password-protected public share links</li>
          <li>Local image uploads in /public/uploads</li>
          <li>180-day quote expiration workflows</li>
        </ul>
      </section>

      <footer className="mt-auto pt-10 text-xs text-slate-500">
        Last opened {format(new Date(), "PPpp")}
      </footer>
    </main>
  );
}
