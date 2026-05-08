"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { formatCurrencyFromCents } from "@/lib/formatting";

type Tier = {
  quantity: number;
  unitPriceCents: number;
};

type SharedProductCardProps = {
  name: string;
  standardizedSummary: string;
  primaryImagePath?: string | null;
  detailImages: string[];
  tiers: Tier[];
};

export function SharedProductCard({
  name,
  standardizedSummary,
  primaryImagePath,
  detailImages,
  tiers,
}: SharedProductCardProps) {
  const [open, setOpen] = useState(false);
  const gallery = useMemo(() => {
    const all = [primaryImagePath || "", ...detailImages].filter(Boolean);
    return Array.from(new Set(all));
  }, [primaryImagePath, detailImages]);

  return (
    <>
      <div className="space-y-5 border-b border-slate-200 pb-8">
        <div className="grid items-start gap-8 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[minmax(320px,42%),1fr]">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative mx-auto h-[260px] w-full max-w-[520px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-left md:mx-0 md:h-[320px]"
          >
            {primaryImagePath ? (
              <Image src={primaryImagePath} alt={name} fill className="object-contain" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
            )}
          </button>

          <div className="space-y-3">
            <h2 className="serif text-2xl text-slate-900">{name}</h2>
            <p className="text-sm leading-7 whitespace-pre-line text-slate-700">{standardizedSummary}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="border-b border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Pricing Schemes
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Scheme</th>
                <th className="px-4 py-2 text-left font-semibold">Quantity</th>
                <th className="px-4 py-2 text-left font-semibold">Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier, idx) => (
                <tr key={idx} className="border-t border-slate-200">
                  <td className="px-4 py-2 text-slate-600">Option {idx + 1}</td>
                  <td className="px-4 py-2 text-slate-800">{tier.quantity}</td>
                  <td className="px-4 py-2 text-slate-900">{formatCurrencyFromCents(tier.unitPriceCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 p-6" onClick={() => setOpen(false)}>
          <div className="mx-auto max-w-6xl rounded-xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="serif text-2xl text-slate-900">{name} - Image Gallery</h3>
              <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {gallery.map((imagePath, idx) => (
                <div key={idx} className="relative aspect-square overflow-hidden rounded-md border border-slate-200">
                  <Image src={imagePath} alt={name + " " + String(idx + 1)} fill className="object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
