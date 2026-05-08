import { z } from "zod";

const pricingTierSchema = z.object({
  quantity: z.string().trim().min(1, "Quantity is required."),
  unitPrice: z.string().trim().min(1, "Unit price is required."),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is required."),
  shortDescription: z
    .string()
    .trim()
    .min(12, "Description should be at least 12 characters."),
  primaryImagePath: z.string().optional(),
  detailImagePaths: z.array(z.string()).optional(),
  pricingTiers: z.array(pricingTierSchema).min(1, "At least one pricing option is required."),
});

export const quoteSchema = z.object({
  title: z.string().trim().min(3, "Quote title is required."),
  clientName: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  products: z.array(productSchema).min(1, "Add at least one product."),
});
