import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { useLocalizedField } from "@/hooks/useLocalizedField";
import { WhatsappLogo } from "@phosphor-icons/react";
import ScrollReveal from "./ScrollReveal";
import FlipCard from "./FlipCard";
import { getServiceFallback } from "@/lib/fallbackImages";

interface Service {
  id: string;
  title: string;
  title_ar: string | null;
  title_zh: string | null;
  description: string | null;
  description_ar: string | null;
  description_zh: string | null;
  image_url: string | null;
  icon: string | null;
}

const FeaturedServicesSection = () => {
  const { t } = useTranslation();
  const loc = useLocalizedField();
  const { data: socialLinks = [] } = useSocialLinks();
  const whatsapp = socialLinks.find((l) => l.platform === "whatsapp" && l.enabled);

  const { data: services = [] } = useQuery({
    queryKey: ["public-services"],
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, title, title_ar, title_zh, description, description_ar, description_zh, image_url, icon")
        .eq("published", true)
        .order("sort_order");
      if (error) throw error;
      return data as Service[];
    },
  });

  if (services.length === 0) return null;

  const getWhatsAppLink = (serviceTitle: string) => {
    if (!whatsapp) return "#";
    const number = whatsapp.value.replace(/[^0-9+]/g, "").replace("+", "");
    const message = encodeURIComponent(
      t("whatsappMessages.service", { name: serviceTitle })
    );
    return `https://wa.me/${number}?text=${message}`;
  };

  return (
    <section id="featured-services" className="section-padding gradient-dark">
      <div className="container-narrow">
        <ScrollReveal animation="headline">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("featuredServices.tag")}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("featuredServices.title")}</h2>
          </div>
        </ScrollReveal>
        <ScrollReveal animation="paragraph" delay={0.2}>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-center">{t("featuredServices.subtitle")}</p>
        </ScrollReveal>
        <ScrollReveal animation="card" delay={0.3} stagger={0.12} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const localTitle = loc(s, "title");
            const localDesc = loc(s, "description");
            return (
              <FlipCard
                key={s.id}
                frontImage={s.image_url || getServiceFallback(i)}
                frontTitle={localTitle}
                backDescription={localDesc || undefined}
                backAction={
                  <button
                    className="btn-3d inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(getWhatsAppLink(localTitle), "_blank", "noopener,noreferrer");
                    }}
                  >
                    <WhatsappLogo size={16} weight="fill" data-icon />
                    {t("featuredServices.requestQuote")}
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

export default FeaturedServicesSection;
