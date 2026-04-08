import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { useLocalizedField } from "@/hooks/useLocalizedField";
import { WhatsappLogo } from "@phosphor-icons/react";
import ScrollReveal from "./ScrollReveal";
import FlipCard from "./FlipCard";
import { getProductFallback } from "@/lib/fallbackImages";

interface Product {
  id: string;
  name: string;
  name_ar: string | null;
  name_zh: string | null;
  description: string | null;
  description_ar: string | null;
  description_zh: string | null;
  image_url: string | null;
}

const ProductsSection = () => {
  const { t } = useTranslation();
  const loc = useLocalizedField();
  const { data: socialLinks = [] } = useSocialLinks();
  const whatsapp = socialLinks.find((l) => l.platform === "whatsapp" && l.enabled);

  const { data: products = [] } = useQuery({
    queryKey: ["public-products"],
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, name_ar, name_zh, description, description_ar, description_zh, image_url")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Product[];
    },
  });

  if (products.length === 0) return null;

  const getWhatsAppLink = (productName: string) => {
    if (!whatsapp) return "#";
    const number = whatsapp.value.replace(/[^0-9+]/g, "").replace("+", "");
    const message = encodeURIComponent(
      t("whatsappMessages.product", { name: productName })
    );
    return `https://wa.me/${number}?text=${message}`;
  };

  return (
    <section id="products" className="section-padding">
      <div className="container-narrow">
        <ScrollReveal animation="headline">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("products.tag")}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("products.title")}</h2>
          </div>
        </ScrollReveal>
        <ScrollReveal animation="paragraph" delay={0.2}>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-center">{t("products.subtitle")}</p>
        </ScrollReveal>
        <ScrollReveal animation="card" delay={0.3} stagger={0.12} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => {
            const localName = loc(p, "name");
            const localDesc = loc(p, "description");
            return (
              <FlipCard
                key={p.id}
                frontImage={p.image_url || getProductFallback(i)}
                frontTitle={localName}
                backDescription={localDesc || undefined}
                backAction={
                  <button
                    className="btn-3d inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(getWhatsAppLink(localName), "_blank", "noopener,noreferrer");
                    }}
                  >
                    <WhatsappLogo size={16} weight="fill" data-icon />
                    {t("products.requestQuote")}
                  </button>
                }
              />
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProductsSection;
