import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { motion } from "framer-motion";
import { WhatsappLogo } from "@phosphor-icons/react";
import * as PhosphorIcons from "@phosphor-icons/react";

interface Service {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
}

const FeaturedServicesSection = () => {
  const { t } = useTranslation();
  const { data: socialLinks = [] } = useSocialLinks();
  const whatsapp = socialLinks.find((l) => l.platform === "whatsapp" && l.enabled);

  const { data: services = [] } = useQuery({
    queryKey: ["public-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, title, description, image_url, icon")
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
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("featuredServices.tag")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("featuredServices.title")}</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">{t("featuredServices.subtitle")}</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-strong rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
            >
              {s.image_url ? (
                <img src={s.image_url} alt={s.title} className="w-full h-48 object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">{t("products.noImage")}</span>
                </div>
              )}
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                {s.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{s.description}</p>
                )}
                <a
                  href={getWhatsAppLink(s.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
                >
                  {getIcon(s.icon)}
                  <WhatsappLogo size={16} weight="fill" />
                  {t("featuredServices.requestQuote")}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServicesSection;
