// Maps country name to ISO 3166-1 alpha-2 code for flag emoji conversion
const countryToCode: Record<string, string> = {
  "Afghanistan": "AF", "Albania": "AL", "Algeria": "DZ", "Argentina": "AR",
  "Australia": "AU", "Austria": "AT", "Bahrain": "BH", "Bangladesh": "BD",
  "Belgium": "BE", "Bolivia": "BO", "Brazil": "BR", "Canada": "CA",
  "Chile": "CL", "China": "CN", "Colombia": "CO", "Croatia": "HR",
  "Czech Republic": "CZ", "Denmark": "DK", "Ecuador": "EC", "Egypt": "EG",
  "Ethiopia": "ET", "Finland": "FI", "France": "FR", "Germany": "DE",
  "Ghana": "GH", "Greece": "GR", "Hungary": "HU", "India": "IN",
  "Indonesia": "ID", "Iran": "IR", "Iraq": "IQ", "Ireland": "IE",
  "Israel": "IL", "Italy": "IT", "Japan": "JP", "Jordan": "JO",
  "Kazakhstan": "KZ", "Kenya": "KE", "Kuwait": "KW", "Lebanon": "LB",
  "Libya": "LY", "Malaysia": "MY", "Mexico": "MX", "Morocco": "MA",
  "Netherlands": "NL", "New Zealand": "NZ", "Nigeria": "NG", "Norway": "NO",
  "Oman": "OM", "Pakistan": "PK", "Palestine": "PS", "Peru": "PE",
  "Philippines": "PH", "Poland": "PL", "Portugal": "PT", "Qatar": "QA",
  "Romania": "RO", "Russia": "RU", "Saudi Arabia": "SA", "Serbia": "RS",
  "Singapore": "SG", "Slovakia": "SK", "Somalia": "SO", "South Africa": "ZA",
  "South Korea": "KR", "Spain": "ES", "Sri Lanka": "LK", "Sudan": "SD",
  "Sweden": "SE", "Switzerland": "CH", "Syria": "SY", "Taiwan": "TW",
  "Thailand": "TH", "Tunisia": "TN", "Turkey": "TR", "Ukraine": "UA",
  "United Arab Emirates": "AE", "United Kingdom": "GB", "United States": "US",
  "Uzbekistan": "UZ", "Venezuela": "VE", "Vietnam": "VN", "Yemen": "YE",
  "Djibouti": "DJ", "Mauritania": "MR", "Comoros": "KM", "Tanzania": "TZ",
  "Uganda": "UG", "Myanmar": "MM", "Cambodia": "KH", "Laos": "LA",
  "Nepal": "NP", "Azerbaijan": "AZ", "Georgia": "GE", "Armenia": "AM",
  "Belarus": "BY", "Lithuania": "LT", "Latvia": "LV", "Estonia": "EE",
  "Moldova": "MD", "Luxembourg": "LU", "Iceland": "IS", "Cyprus": "CY",
  "Malta": "MT", "Brunei": "BN", "Mongolia": "MN",
};

function isoToFlagEmoji(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export function getCountryFlag(countryName: string | null | undefined): string {
  if (!countryName) return "🌍";
  const code = countryToCode[countryName];
  if (!code) return "🌍";
  return isoToFlagEmoji(code);
}
