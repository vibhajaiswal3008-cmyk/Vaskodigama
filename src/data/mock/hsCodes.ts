import type { HsCode } from "@/types";

/**
 * Illustrative HS-code reference. Real HS classifications are extensive and can
 * vary by country at deeper levels — the UI must always present codes as
 * suggestions to confirm, not as a definitive classification.
 */
export const hsCodes: HsCode[] = [
  // Honey
  { code: "04", description: "Dairy produce; eggs; natural honey; edible animal products", level: 2, relatedTerms: ["honey", "dairy", "eggs"] },
  { code: "0409", description: "Natural honey", level: 4, parent: "04", relatedTerms: ["natural honey", "raw honey", "organic honey"], variesByCountry: true },
  { code: "040900", description: "Natural honey (all types)", level: 6, parent: "0409", relatedTerms: ["natural honey", "comb honey"], variesByCountry: true },

  // Coffee
  { code: "09", description: "Coffee, tea, maté and spices", level: 2, relatedTerms: ["coffee", "tea", "spices"] },
  { code: "0901", description: "Coffee, whether or not roasted or decaffeinated", level: 4, parent: "09", relatedTerms: ["coffee", "arabica", "robusta"], variesByCountry: true },
  { code: "090111", description: "Coffee, not roasted, not decaffeinated", level: 6, parent: "0901", relatedTerms: ["green coffee", "raw coffee beans"] },

  // Pharmaceuticals
  { code: "30", description: "Pharmaceutical products", level: 2, relatedTerms: ["pharma", "medicines", "formulations"] },
  { code: "3004", description: "Medicaments, packaged for retail sale", level: 4, parent: "30", relatedTerms: ["formulations", "tablets", "injections"], variesByCountry: true },
  { code: "300420", description: "Medicaments containing antibiotics", level: 6, parent: "3004", relatedTerms: ["antibiotics", "linezolid", "oxazolidinone"] },
  { code: "29", description: "Organic chemicals", level: 2, relatedTerms: ["chemicals", "APIs", "intermediates"] },
  { code: "2941", description: "Antibiotics (bulk active ingredients)", level: 4, parent: "29", relatedTerms: ["antibiotic API", "bulk drugs"], variesByCountry: true },

  // Cosmetics
  { code: "33", description: "Essential oils; perfumery, cosmetic preparations", level: 2, relatedTerms: ["cosmetics", "skincare", "perfume"] },
  { code: "3304", description: "Beauty / skin-care preparations", level: 4, parent: "33", relatedTerms: ["skincare", "serum", "copper peptides", "moisturiser"], variesByCountry: true },

  // Cotton / textiles
  { code: "52", description: "Cotton", level: 2, relatedTerms: ["cotton", "yarn", "fabric"] },
  { code: "5208", description: "Woven cotton fabric (>=85% cotton)", level: 4, parent: "52", relatedTerms: ["cotton fabric", "woven cotton", "greige"], variesByCountry: true },
];

export const getHsByPrefix = (prefix: string) =>
  hsCodes.filter((h) => h.code.startsWith(prefix.replace(/\D/g, "")));

export const getHsCode = (code: string) =>
  hsCodes.find((h) => h.code === code.replace(/\D/g, ""));

export const getHsChildren = (code: string) =>
  hsCodes.filter((h) => h.parent === code);
