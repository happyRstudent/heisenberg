"use client";

import { useState } from "react";

type ShareLinkRowProps = {
  id: string;
  fullUrl: string;
  expiresLabel: string;
  isProtected: boolean;
  revokeAction: (formData: FormData) => void | Promise<void>;
};

export function ShareLinkRow({ id, fullUrl, expiresLabel, isProtected, revokeAction }: ShareLinkRowProps) {
  const [copied, setCopied] = useState(false);

  return (
    <article className="rounded-lg border border-slate-200 p-4 text-sm text-slate-700">
      <p className="font-medium text-slate-900 break-all">{fullUrl}</p>
      <p>Expires: {expiresLabel}</p>
      <p>Protected: {isProtected ? "Yes" : "No"}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={async () => {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? "Copied" : "Copy Link"}
        </button>
        <form action={revokeAction}>
          <input type="hidden" name="shareTokenId" value={id} />
          <button type="submit" className="btn-secondary">
            Revoke
          </button>
        </form>
      </div>
    </article>
  );
}
