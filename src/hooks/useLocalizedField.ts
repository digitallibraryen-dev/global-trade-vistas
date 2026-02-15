import { useTranslation } from "react-i18next";

/**
 * Returns a function that picks the correct translated field from a record.
 * Usage: const loc = useLocalizedField();
 *        loc(product, "name")  → picks name_ar / name_zh / name based on current lang
 *        loc(service, "title") → picks title_ar / title_zh / title
 */
export const useLocalizedField = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (item: any, field: string): string => {
    if (lang === "ar") {
      const v = item[`${field}_ar`];
      if (v && typeof v === "string" && v.trim()) return v;
    }
    if (lang === "zh") {
      const v = item[`${field}_zh`];
      if (v && typeof v === "string" && v.trim()) return v;
    }
    // Fallback to default (English) field
    const fallback = item[field];
    return typeof fallback === "string" ? fallback : "";
  };
};
