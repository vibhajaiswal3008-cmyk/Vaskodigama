import type { Product } from "@/types";

/** Illustrative product catalogue used for natural-language product search. */
export const products: Product[] = [
  {
    id: "natural-honey",
    name: "Natural honey",
    aliases: ["honey", "raw honey", "organic honey", "natual honey"],
    category: "Food & agriculture",
    suggestedHsCodes: ["0409", "040900"],
  },
  {
    id: "coffee",
    name: "Coffee",
    aliases: ["green coffee", "coffee beans", "cofee", "arabica", "robusta"],
    category: "Food & agriculture",
    suggestedHsCodes: ["0901", "090111"],
  },
  {
    id: "linezolid",
    name: "Linezolid",
    aliases: ["linazolid", "oxazolidinone antibiotic", "antibiotic api"],
    category: "Pharmaceuticals",
    suggestedHsCodes: ["2941", "300420"],
  },
  {
    id: "copper-peptides",
    name: "Copper peptides",
    aliases: ["ghk-cu", "copper tripeptide", "peptide serum"],
    category: "Cosmetics & personal care",
    suggestedHsCodes: ["3304", "3304"],
  },
  {
    id: "cotton-fabric",
    name: "Cotton fabric",
    aliases: ["woven cotton", "greige fabric", "cotton cloth", "coton fabric"],
    category: "Textiles",
    suggestedHsCodes: ["5208", "52"],
  },
  {
    id: "pharma-formulations",
    name: "Pharmaceutical formulations",
    aliases: ["formulations", "finished dosage", "tablets", "medicaments"],
    category: "Pharmaceuticals",
    suggestedHsCodes: ["3004", "300420"],
  },
];

export const searchProducts = (q: string): Product[] => {
  const term = q.trim().toLowerCase();
  if (!term) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.aliases.some((a) => a.toLowerCase().includes(term)) ||
      p.category.toLowerCase().includes(term),
  );
};

export const getProduct = (id: string) => products.find((p) => p.id === id);
