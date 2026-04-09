import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { WhatsappLogo, CheckCircle } from "@phosphor-icons/react";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { useLocalizedField } from "@/hooks/useLocalizedField";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import CinematicHero from "@/components/premium/CinematicHero";
import FullWidthCTA from "@/components/premium/FullWidthCTA";
import OptimizedImage from "@/components/OptimizedImage";
import heroImg from "@/assets/pages/hero-services.jpg";

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

const ServicesPage = () => {
  const { t } = useTranslation();
  const loc = useLocalizedField();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: links } = useSocialLinks();
  const whatsapp = links?.find((l) => l.platform === "whatsapp");

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .eq("published", true)
      .order("sort_order")
      .then(({ data }) => {
        setServices((data as any) || []);
        setLoading(false);
      });
  }, []);

  const getWhatsAppLink = (title?: string) => {
    if (!whatsapp) return "#";
    const number = whatsapp.value.replace(/[^0-9+]/g, "").replace("+", "");
    const message = title
      ? encodeURIComponent(t("whatsappMessages.service", { name: title }))
      : encodeURIComponent(t("whatsappMessages.general"));
    return `https://wa.me/${number}?text=${message}`;
  };

  const trustBadges = t("servicesPage.trustBadges", { returnObjects: true }) as string[];

  return (
    <>
      <Navbar />
      <CinematicHero
        tag={t("servicesPage.tag")}
        title={t("servicesPage.title")}
        subtitle={t("servicesPage.subtitle")}
        image={heroImg}
      />

      <main className="section-padding">
        <div className="container-narrow">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-muted-foreground">{t("servicesPage.noServices")}</p>
          ) : (
            <div className="space-y-10">
              {services.map((s, i) => {
                const localTitle = loc(s, "title");
                const localDesc = loc(s, "description");
                return (
                  <ScrollReveal key={s.id} animation={i % 2 === 0 ? "slide-right" : "slide-left"} delay={i * 0.06}>
                    <div className={`glass-strong rounded-2xl overflow-hidden flex flex-col lg:flex-row ${i % 2 === 1 ? "lg:flex-row-reverse" : ""} hover:shadow-xl transition-shadow duration-300`}>
                      <div className="lg:w-2/5 relative overflow-hidden group">
                        <OptimizedImage
                          src={s.image_url}
                          alt={localTitle}
                          className="h-56 lg:h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          size="thumbnail"
                          fallback={
                            <div className="h-56 lg:h-full w-full flex items-center justify-center gradient-primary">
                              <span className="text-primary-foreground/50 text-sm">Service</span>
                            </div>
                          }
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                      </div>
                      <div className="lg:w-3/5 p-8 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-foreground">{localTitle}</h3>
                        {localDesc && (
                          <p className="mt-3 text-muted-foreground leading-relaxed">{localDesc}</p>
                        )}
                        <a
                          href={getWhatsAppLink(localTitle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-3d mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground w-fit"
                        >
                          <WhatsappLogo size={18} /> {t("servicesPage.requestQuote")}
                        </a>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          {/* Trust badges */}
          <ScrollReveal animation="slide-left" className="mt-20">
            <div className="glass-strong rounded-2xl p-10">
              <h3 className="text-xl font-bold text-foreground text-center sm:text-2xl">{t("servicesPage.whyTitle")}</h3>
              <ScrollReveal animation="card" stagger={0.08} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {trustBadges?.map((badge: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 hover:-translate-y-0.5 transition-transform duration-300">
                    <CheckCircle size={22} weight="fill" className="text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">{badge}</span>
                  </div>
                ))}
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <FullWidthCTA title={t("servicesPage.ctaTitle")} buttonLabel={t("servicesPage.requestQuote")} href="/contact" />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default ServicesPage;
