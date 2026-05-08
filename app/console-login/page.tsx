import { loginConsoleAction } from "@/app/console-login/actions";

export default async function ConsoleLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const query = await searchParams;

  return (
    <main className="shell">
      <section className="card mx-auto mt-12 max-w-md p-8">
        <h1 className="serif text-3xl text-slate-900">Console Login</h1>
        <p className="mt-2 text-sm text-slate-600">Enter password to access the Heisenberg main console.</p>
        {query.error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Invalid password.
          </div>
        ) : null}
        <form action={loginConsoleAction} className="mt-6 space-y-4">
          <label className="field">
            <span>Password</span>
            <input name="password" type="password" required autoFocus />
          </label>
          <button type="submit" className="btn-primary w-full">
            Enter Console
          </button>
        </form>
      </section>
    </main>
  );
}
