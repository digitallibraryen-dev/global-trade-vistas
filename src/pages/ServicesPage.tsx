import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { WhatsappLogo, CheckCircle } from "@phosphor-icons/react";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { useLocalizedField } from "@/hooks/useLocalizedField";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import TiltCard from "@/components/TiltCard";
import OptimizedImage from "@/components/OptimizedImage";

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
      <PageHeader
        tag={t("servicesPage.tag")}
        title={t("servicesPage.title")}
        subtitle={t("servicesPage.subtitle")}
      />
      <main className="section-padding">
        <div className="container-narrow">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : services.length === 0 ? (
            <p className="text-center text-muted-foreground">{t("servicesPage.noServices")}</p>
          ) : (
            <ScrollReveal animation="card" stagger={0.12} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => {
                const localTitle = loc(s, "title");
                const localDesc = loc(s, "description");
                return (
                  <TiltCard key={s.id} className="glass rounded-2xl overflow-hidden">
                    <OptimizedImage
                      src={s.image_url}
                      alt={localTitle}
                      className="h-48 w-full object-cover"
                      size="thumbnail"
                      fallback={
                        <div className="h-48 w-full flex items-center justify-center gradient-primary">
                          <span className="text-primary-foreground/50 text-sm">Service</span>
                        </div>
                      }
                    />
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-foreground">{localTitle}</h3>
                      {localDesc && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{localDesc}</p>
                      )}
                      <a
                        href={getWhatsAppLink(localTitle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-3d mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                      >
                        <WhatsappLogo size={18} /> {t("servicesPage.requestQuote")}
                      </a>
                    </div>
                  </TiltCard>
                );
              })}
            </ScrollReveal>
          )}

          {/* CTA Section */}
          <ScrollReveal animation="headline" className="mt-20 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("servicesPage.ctaTitle")}</h2>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg"
            >
              <WhatsappLogo size={22} /> {t("servicesPage.requestQuote")}
            </a>
          </ScrollReveal>

          {/* Why Businesses Choose OMT */}
          <ScrollReveal animation="slide-left" className="mt-20">
            <div className="glass rounded-2xl p-8 sm:p-12">
              <h3 className="text-xl font-bold text-foreground text-center sm:text-2xl">{t("servicesPage.whyTitle")}</h3>
              <ScrollReveal animation="alternating" stagger={0.08} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {trustBadges?.map((badge: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={22} weight="fill" className="text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">{badge}</span>
                  </div>
                ))}
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default ServicesPage;
