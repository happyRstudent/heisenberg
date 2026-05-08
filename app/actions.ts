"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { parsePriceToCents, parseQuantity, standardizeProductDescription } from "@/lib/formatting";
import { prisma } from "@/lib/prisma";
import { generateShareToken, maybeHashPassword } from "@/lib/share";
import { quoteSchema } from "@/lib/validation";
import { ZodError } from "zod";

type RawPricingTier = {
  quantity: string;
  unitPrice: string;
};

type RawProduct = {
  name: string;
  shortDescription: string;
  primaryImagePath?: string;
  detailImagePaths?: string[];
  pricingTiers: RawPricingTier[];
};

function parseProductsFromFormData(formData: FormData): RawProduct[] {
  const json = formData.get("products")?.toString() ?? "[]";
  return JSON.parse(json) as RawProduct[];
}

function normalizePricingTiers(tiers: RawPricingTier[]) {
  return tiers.map((tier) => ({
    quantity: parseQuantity(tier.quantity),
    unitPriceCents: parsePriceToCents(tier.unitPrice),
  }));
}

function productCreatePayload(product: RawProduct, index: number) {
  const normalizedPricingTiers = normalizePricingTiers(product.pricingTiers);
  return {
    name: product.name,
    shortDescription: product.shortDescription,
    standardizedSummary: standardizeProductDescription(product.shortDescription),
    primaryImagePath: product.primaryImagePath || null,
    detailImagePaths: JSON.stringify(product.detailImagePaths || []),
    pricingTiers: JSON.stringify(normalizedPricingTiers),
    sortOrder: index,
  };
}

export async function createQuoteAction(formData: FormData) {
  const title = formData.get("title")?.toString() ?? "";
  const clientName = formData.get("clientName")?.toString() ?? "";
  const notes = formData.get("notes")?.toString() ?? "";
  let payload: ReturnType<typeof quoteSchema.parse> | null = null;
  try {
    const products = parseProductsFromFormData(formData);
    const parsedPayload = quoteSchema.parse({ title, clientName, notes, products });
    parsedPayload.products.forEach((product) => normalizePricingTiers(product.pricingTiers));
    payload = parsedPayload;
  } catch (error) {
    const message =
      error instanceof ZodError
        ? error.issues[0]?.message || "Please check required fields."
        : error instanceof Error
          ? error.message
          : "Please check required fields.";
    redirect(`/quotes/new?error=${encodeURIComponent(message)}`);
  }
  if (!payload) redirect("/quotes/new?error=Please%20check%20required%20fields.");

  const quote = await prisma.quote.create({
    data: {
      title: payload.title,
      clientName: payload.clientName || null,
      notes: payload.notes || null,
      products: {
        create: payload.products.map((product, index) => productCreatePayload(product, index)),
      },
    },
  });

  revalidatePath("/");
  redirect(`/quotes/${quote.id}`);
}

export async function updateQuoteAction(quoteId: string, formData: FormData) {
  const title = formData.get("title")?.toString() ?? "";
  const clientName = formData.get("clientName")?.toString() ?? "";
  const notes = formData.get("notes")?.toString() ?? "";
  let payload: ReturnType<typeof quoteSchema.parse> | null = null;
  try {
    const products = parseProductsFromFormData(formData);
    const parsedPayload = quoteSchema.parse({ title, clientName, notes, products });
    parsedPayload.products.forEach((product) => normalizePricingTiers(product.pricingTiers));
    payload = parsedPayload;
  } catch (error) {
    const message =
      error instanceof ZodError
        ? error.issues[0]?.message || "Please check required fields."
        : error instanceof Error
          ? error.message
          : "Please check required fields.";
    redirect(`/quotes/${quoteId}?error=${encodeURIComponent(message)}`);
  }
  if (!payload) redirect(`/quotes/${quoteId}?error=Please%20check%20required%20fields.`);

  await prisma.$transaction(async (tx) => {
    await tx.product.deleteMany({ where: { quoteId } });
    await tx.quote.update({
      where: { id: quoteId },
      data: {
        title: payload.title,
        clientName: payload.clientName || null,
        notes: payload.notes || null,
        products: {
          create: payload.products.map((product, index) => productCreatePayload(product, index)),
        },
      },
    });
  });

  revalidatePath("/");
  revalidatePath(`/quotes/${quoteId}`);
  redirect(`/quotes/${quoteId}`);
}

export async function deleteQuoteAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Quote id is missing.");

  await prisma.quote.delete({ where: { id } });
  revalidatePath("/");
}

export async function createShareTokenAction(formData: FormData) {
  const quoteId = formData.get("quoteId")?.toString();
  const password = formData.get("password")?.toString();
  const validity = formData.get("validity")?.toString() ?? "15d";

  if (!quoteId) {
    throw new Error("Invalid share request.");
  }

  const expiresAt =
    validity === "forever"
      ? new Date("2099-12-31T23:59:59.000Z")
      : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

  const passwordHash = await maybeHashPassword(password);
  const maxAttempts = 5;
  let created = false;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const token = generateShareToken();
    try {
      await prisma.shareToken.create({
        data: {
          quoteId,
          token,
          expiresAt,
          passwordHash,
        },
      });
      created = true;
      break;
    } catch (error) {
      const isTokenCollision =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        Array.isArray((error.meta as { target?: string[] } | undefined)?.target) &&
        (error.meta as { target: string[] }).target.includes("token");

      if (!isTokenCollision || attempt === maxAttempts - 1) {
        throw error;
      }
    }
  }

  if (!created) {
    throw new Error("Unable to generate a unique share link. Please try again.");
  }

  revalidatePath(`/quotes/${quoteId}`);
}

export async function revokeShareTokenAction(formData: FormData) {
  const shareTokenId = formData.get("shareTokenId")?.toString();
  if (!shareTokenId) throw new Error("Share token id is missing.");

  const token = await prisma.shareToken.findUnique({
    where: { id: shareTokenId },
    select: { quoteId: true },
  });
  if (!token) return;

  await prisma.shareToken.update({
    where: { id: shareTokenId },
    data: { revokedAt: new Date() },
  });

  revalidatePath(`/quotes/${token.quoteId}`);
}
