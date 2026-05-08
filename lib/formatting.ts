export function formatCurrencyFromCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function parsePriceToCents(input: string): number {
  const normalized = input.replace(/[$,\s]/g, "").trim();
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Invalid price.");
  }
  return Math.round(value * 100);
}

export function parseQuantity(input: string): number {
  const normalized = input.replace(/[,\s]/g, "").trim();
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Invalid quantity.");
  }
  return Math.round(value);
}

function sentenceCase(value: string) {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function standardizeProductDescription(input: string) {
  const cleaned = sentenceCase(input.replace(/[\r\n]+/g, " "));
  const compact = cleaned.replace(/\s{2,}/g, " ");
  const words = compact.split(" ").filter(Boolean);

  const proposition = words.slice(0, 14).join(" ");
  const impact = words.slice(14, 28).join(" ");
  const delivery = words.slice(28).join(" ");

  const bullets = [
    `Business Context: ${proposition || compact}.`,
    `Value Framing: ${impact || "Positioned for dependable operational performance and executive clarity."}`,
    `Commercial Notes: ${delivery || "Suitable for institutional procurement and proposal documentation workflows."}`,
  ];

  return bullets.join("\n");
}

export type PricingTier = {
  quantity: number;
  unitPriceCents: number;
};

export function parsePricingTiers(raw: string): PricingTier[] {
  if (!raw) return [];
  return JSON.parse(raw) as PricingTier[];
}
