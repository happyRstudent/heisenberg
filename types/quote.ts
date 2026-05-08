export type QuoteStatus = "DRAFT" | "SENT" | "ACCEPTED" | "EXPIRED" | "ARCHIVED";

export interface QuoteItemInput {
  productId: string;
  quantity: number;
  unitPrice: string;
}

export interface QuoteInput {
  quoteNumber: string;
  clientName: string;
  status?: QuoteStatus;
  notes?: string;
  issuedAt?: Date;
  validUntil?: Date;
  items: QuoteItemInput[];
}
