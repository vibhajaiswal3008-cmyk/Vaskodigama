import type { Country } from "@/types";

/**
 * Illustrative country reference list. `hasStateData` flags whether this build
 * includes sample subnational data — it does NOT claim real-world coverage.
 */
export const countries: Country[] = [
  { code: "IN", name: "India", region: "South Asia", flag: "🇮🇳", hasStateData: true, popular: true },
  { code: "US", name: "United States", region: "North America", flag: "🇺🇸", hasStateData: true, popular: true },
  { code: "AE", name: "United Arab Emirates", region: "Middle East", flag: "🇦🇪", hasStateData: false, popular: true },
  { code: "CN", name: "China", region: "East Asia", flag: "🇨🇳", hasStateData: false, popular: true },
  { code: "DE", name: "Germany", region: "Europe", flag: "🇩🇪", hasStateData: false, popular: true },
  { code: "GB", name: "United Kingdom", region: "Europe", flag: "🇬🇧", hasStateData: false, popular: true },
  { code: "NL", name: "Netherlands", region: "Europe", flag: "🇳🇱", hasStateData: false },
  { code: "SG", name: "Singapore", region: "Southeast Asia", flag: "🇸🇬", hasStateData: false },
  { code: "SA", name: "Saudi Arabia", region: "Middle East", flag: "🇸🇦", hasStateData: false },
  { code: "BR", name: "Brazil", region: "South America", flag: "🇧🇷", hasStateData: false },
  { code: "ZA", name: "South Africa", region: "Africa", flag: "🇿🇦", hasStateData: false },
  { code: "VN", name: "Vietnam", region: "Southeast Asia", flag: "🇻🇳", hasStateData: false },
  { code: "BD", name: "Bangladesh", region: "South Asia", flag: "🇧🇩", hasStateData: false },
  { code: "JP", name: "Japan", region: "East Asia", flag: "🇯🇵", hasStateData: false },
  { code: "AU", name: "Australia", region: "Oceania", flag: "🇦🇺", hasStateData: false },
  { code: "CA", name: "Canada", region: "North America", flag: "🇨🇦", hasStateData: false },
  { code: "FR", name: "France", region: "Europe", flag: "🇫🇷", hasStateData: false },
  { code: "IT", name: "Italy", region: "Europe", flag: "🇮🇹", hasStateData: false },
  { code: "KE", name: "Kenya", region: "Africa", flag: "🇰🇪", hasStateData: false },
  { code: "MX", name: "Mexico", region: "North America", flag: "🇲🇽", hasStateData: false },
];

export const regionGroups: { region: string; codes: string[] }[] = [
  { region: "South Asia", codes: ["IN", "BD"] },
  { region: "Middle East", codes: ["AE", "SA"] },
  { region: "Europe", codes: ["DE", "GB", "NL", "FR", "IT"] },
  { region: "North America", codes: ["US", "CA", "MX"] },
  { region: "East Asia", codes: ["CN", "JP"] },
  { region: "Southeast Asia", codes: ["SG", "VN"] },
];

export const getCountry = (code: string) =>
  countries.find((c) => c.code === code);
