import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { useLocalizedField } from "@/hooks/useLocalizedField";
import { WhatsappLogo } from "@phosphor-icons/react";
import * as PhosphorIcons from "@phosphor-icons/react";
import ScrollReveal from "./ScrollReveal";
import TiltCard from "./TiltCard";

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

  const getIcon = (iconName: string | null) => {
    if (!iconName) return null;
    const Icon = (PhosphorIcons as unknown as Record<string, React.ElementType>)[iconName];
    return Icon ? <Icon size={18} weight="duotone" className="text-primary" /> : null;
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
          {services.map((s) => {
            const localTitle = loc(s, "title");
            const localDesc = loc(s, "description");
            return (
              <TiltCard key={s.id} className="glass-strong rounded-xl overflow-hidden">
                <OptimizedImage
                  src={s.image_url}
                  alt={localTitle}
                  className="w-full h-48 object-cover"
                  size="thumbnail"
                  fallback={
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">{t("products.noImage")}</span>
                    </div>
                  }
                />
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">{localTitle}</h3>
                  {localDesc && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{localDesc}</p>
                  )}
                  <a
                    href={getWhatsAppLink(localTitle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-3d inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    {getIcon(s.icon)}
                    <WhatsappLogo size={16} weight="fill" data-icon />
                    {t("featuredServices.requestQuote")}
                  </a>
                </div>
              </TiltCard>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FeaturedServicesSection;
