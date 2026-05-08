"use client";

import { useState } from "react";

export function ContactFooter() {
  const [copied, setCopied] = useState(false);
  const email = "heisenberg@unison.com";

  return (
    <div className="grid gap-8 rounded-lg border border-slate-200 bg-white p-6 md:grid-cols-2">
      <div className="space-y-1">
        <p className="font-semibold text-slate-900">Heisenberg</p>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          className="text-left text-sky-700 hover:text-sky-900"
        >
          {copied ? "Copied: heisenberg@unison.com" : "heisenberg@unison.com"}
        </button>
        <p className="text-slate-800">840-221-1866</p>
        <p className="text-slate-800">304-973-9528</p>
      </div>
      <div className="space-y-1 text-slate-700 md:text-right">
        <p className="font-medium text-slate-900">Address</p>
        <p>18350 San Jose Ave., City of Industry, CA 91748</p>
      </div>
    </div>
  );
}
