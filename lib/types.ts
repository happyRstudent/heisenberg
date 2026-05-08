export type ProductInput = {
  name: string;
  price: string;
  shortDescription: string;
  imagePath?: string;
};

export type QuoteFormState = {
  error?: string;
  success?: string;
  quoteId?: string;
};
