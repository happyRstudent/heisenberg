"use client";

import { useMemo, useState } from "react";

type PricingTierDraft = {
  id: string;
  quantity: string;
  unitPrice: string;
};

type ProductDraft = {
  id: string;
  name: string;
  shortDescription: string;
  primaryImagePath?: string;
  detailImagePaths: string[];
  pricingTiers: PricingTierDraft[];
};

type QuoteFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  initialTitle?: string;
  initialClientName?: string;
  initialNotes?: string;
  initialProducts?: ProductDraft[];
};

function createTier(): PricingTierDraft {
  return { id: crypto.randomUUID(), quantity: "", unitPrice: "" };
}

function createProduct(): ProductDraft {
  return {
    id: crypto.randomUUID(),
    name: "",
    shortDescription: "",
    primaryImagePath: "",
    detailImagePaths: [],
    pricingTiers: [createTier()],
  };
}

export function QuoteForm({
  action,
  submitLabel,
  initialTitle = "",
  initialClientName = "",
  initialNotes = "",
  initialProducts = [createProduct()],
}: QuoteFormProps) {
  const [products, setProducts] = useState<ProductDraft[]>(
    initialProducts.length ? initialProducts : [createProduct()],
  );
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const productsJson = useMemo(
    () =>
      JSON.stringify(
        products.map((product) => ({
          name: product.name,
          shortDescription: product.shortDescription,
          primaryImagePath: product.primaryImagePath,
          detailImagePaths: product.detailImagePaths,
          pricingTiers: product.pricingTiers.map((tier) => ({
            quantity: tier.quantity,
            unitPrice: tier.unitPrice,
          })),
        })),
      ),
    [products],
  );

  const uploadSingle = async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.imagePath as string;
  };

  const uploadMultiple = async (files: File[]) => {
    const body = new FormData();
    files.forEach((file) => body.append("files", file));
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.imagePaths as string[];
  };

  return (
    <form action={action} className="space-y-10">
      <input type="hidden" name="products" value={productsJson} />

      <section className="grid gap-6 md:grid-cols-2">
        <label className="field">
          <span>Quote Title</span>
          <input name="title" defaultValue={initialTitle} required />
        </label>
        <label className="field">
          <span>Client / Team</span>
          <input name="clientName" defaultValue={initialClientName} placeholder="Optional" />
        </label>
        <label className="field md:col-span-2">
          <span>Internal Notes</span>
          <textarea name="notes" defaultValue={initialNotes} rows={4} placeholder="Scope notes, assumptions, terms..." />
        </label>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-wide text-slate-900">Products</h2>
          <button type="button" className="btn-secondary" onClick={() => setProducts((v) => [...v, createProduct()])}>
            Add Product
          </button>
        </div>

        <div className="space-y-6">
          {products.map((product, index) => (
            <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-sm font-medium tracking-wide text-slate-500">Product {index + 1}</div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="field">
                  <span>Name</span>
                  <input
                    value={product.name}
                    onChange={(event) =>
                      setProducts((current) =>
                        current.map((item) =>
                          item.id === product.id ? { ...item, name: event.target.value } : item,
                        ),
                      )
                    }
                    required
                  />
                </label>

                <label className="field md:col-span-2">
                  <span>Short Description</span>
                  <textarea
                    value={product.shortDescription}
                    rows={4}
                    onChange={(event) =>
                      setProducts((current) =>
                        current.map((item) =>
                          item.id === product.id
                            ? { ...item, shortDescription: event.target.value }
                            : item,
                        ),
                      )
                    }
                    required
                  />
                </label>

                <div className="field md:col-span-2">
                  <span>Pricing Schemes (quantity + unit price)</span>
                  <div className="space-y-3">
                    {product.pricingTiers.map((tier) => (
                      <div key={tier.id} className="grid grid-cols-[1fr,1fr,auto] gap-3">
                        <input
                          placeholder="Quantity (e.g. 50)"
                          value={tier.quantity}
                          onChange={(event) =>
                            setProducts((current) =>
                              current.map((item) =>
                                item.id === product.id
                                  ? {
                                      ...item,
                                      pricingTiers: item.pricingTiers.map((x) =>
                                        x.id === tier.id ? { ...x, quantity: event.target.value } : x,
                                      ),
                                    }
                                  : item,
                              ),
                            )
                          }
                          required
                        />
                        <input
                          placeholder="Unit price (USD)"
                          value={tier.unitPrice}
                          onChange={(event) =>
                            setProducts((current) =>
                              current.map((item) =>
                                item.id === product.id
                                  ? {
                                      ...item,
                                      pricingTiers: item.pricingTiers.map((x) =>
                                        x.id === tier.id ? { ...x, unitPrice: event.target.value } : x,
                                      ),
                                    }
                                  : item,
                              ),
                            )
                          }
                          required
                        />
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() =>
                            setProducts((current) =>
                              current.map((item) =>
                                item.id === product.id
                                  ? {
                                      ...item,
                                      pricingTiers:
                                        item.pricingTiers.length > 1
                                          ? item.pricingTiers.filter((x) => x.id !== tier.id)
                                          : item.pricingTiers,
                                    }
                                  : item,
                              ),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        setProducts((current) =>
                          current.map((item) =>
                            item.id === product.id
                              ? { ...item, pricingTiers: [...item.pricingTiers, createTier()] }
                              : item,
                          ),
                        )
                      }
                    >
                      Add Pricing Scheme
                    </button>
                  </div>
                </div>

                <label className="field">
                  <span>Main Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setUploadingId(product.id + "-main");
                      try {
                        const imagePath = await uploadSingle(file);
                        setProducts((current) =>
                          current.map((item) =>
                            item.id === product.id ? { ...item, primaryImagePath: imagePath } : item,
                          ),
                        );
                      } finally {
                        setUploadingId(null);
                      }
                    }}
                  />
                  {uploadingId === product.id + "-main" && <p className="text-xs text-slate-500">Uploading...</p>}
                  {product.primaryImagePath && <p className="text-xs text-slate-600">{product.primaryImagePath}</p>}
                </label>

                <label className="field">
                  <span>Detail Images (multiple)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={async (event) => {
                      const files = event.target.files ? Array.from(event.target.files) : [];
                      if (!files.length) return;
                      setUploadingId(product.id + "-detail");
                      try {
                        const imagePaths = await uploadMultiple(files);
                        setProducts((current) =>
                          current.map((item) =>
                            item.id === product.id
                              ? {
                                  ...item,
                                  detailImagePaths: [...item.detailImagePaths, ...imagePaths],
                                }
                              : item,
                          ),
                        );
                      } finally {
                        setUploadingId(null);
                      }
                    }}
                  />
                  {uploadingId === product.id + "-detail" && <p className="text-xs text-slate-500">Uploading...</p>}
                  {product.detailImagePaths.length > 0 && (
                    <p className="text-xs text-slate-600">{product.detailImagePaths.length} detail image(s) uploaded</p>
                  )}
                </label>
              </div>

              {products.length > 1 && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-medium text-slate-500 hover:text-slate-900"
                    onClick={() => setProducts((current) => current.filter((item) => item.id !== product.id))}
                  >
                    Remove Product
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button className="btn-primary" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
