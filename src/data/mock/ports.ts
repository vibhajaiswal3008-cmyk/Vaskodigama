import type { Port } from "@/types";

/** Illustrative port reference. Mark all port data as illustrative in the UI. */
export const ports: Port[] = [
  { id: "INMUN", name: "Mundra", countryCode: "IN", type: "sea" },
  { id: "INNSA", name: "Nhava Sheva (JNPT)", countryCode: "IN", type: "sea" },
  { id: "INMAA", name: "Chennai", countryCode: "IN", type: "sea" },
  { id: "INPPG", name: "Pipavav", countryCode: "IN", type: "sea" },
  { id: "INDEL", name: "Delhi (Air)", countryCode: "IN", type: "air" },
  { id: "AEJEA", name: "Jebel Ali", countryCode: "AE", type: "sea" },
  { id: "AEDXB", name: "Dubai (Air)", countryCode: "AE", type: "air" },
  { id: "USLAX", name: "Los Angeles", countryCode: "US", type: "sea" },
  { id: "USNYC", name: "New York / Newark", countryCode: "US", type: "sea" },
  { id: "USHOU", name: "Houston", countryCode: "US", type: "sea" },
  { id: "NLRTM", name: "Rotterdam", countryCode: "NL", type: "sea" },
  { id: "DEHAM", name: "Hamburg", countryCode: "DE", type: "sea" },
  { id: "CNSHA", name: "Shanghai", countryCode: "CN", type: "sea" },
  { id: "SGSIN", name: "Singapore", countryCode: "SG", type: "sea" },
];

export const getPorts = (countryCode?: string) =>
  countryCode ? ports.filter((p) => p.countryCode === countryCode) : ports;
