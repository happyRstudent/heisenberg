import { z } from "zod";

export const quoteStatusSchema = z.enum([
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "EXPIRED",
  "ARCHIVED",
]);

export const quoteItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.int().positive("Quantity must be positive"),
  unitPrice: z.string().min(1, "Unit price is required"),
});

export const quoteSchema = z
  .object({
    quoteNumber: z.string().min(1, "Quote number is required"),
    clientName: z.string().min(1, "Client name is required"),
    status: quoteStatusSchema.default("DRAFT"),
    notes: z.string().optional(),
    issuedAt: z.date().optional(),
    validUntil: z.date().optional(),
    items: z.array(quoteItemSchema).min(1, "At least one product is required"),
  })
  .refine(
    (data) =>
      !data.issuedAt || !data.validUntil || data.validUntil.getTime() >= data.issuedAt.getTime(),
    {
      message: "validUntil must be the same day or after issuedAt",
      path: ["validUntil"],
    },
  );
