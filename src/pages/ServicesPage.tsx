import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { WhatsappLogo, CheckCircle } from "@phosphor-icons/react";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";

interface Service {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
}

const ServicesPage = () => {
  const { t } = useTranslation();
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
      ? encodeURIComponent(`Hello Almonesi Global Trade (OMT),\nI would like to request a quotation for your service: ${title}.\nPlease provide more details.`)
      : encodeURIComponent("Hello Almonesi Global Trade (OMT),\nI would like to request a quotation.\nPlease provide more details.");
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
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div key={s.id} className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  {s.image_url ? (
                    <img src={s.image_url} alt={s.title} className="h-48 w-full object-cover" />
                  ) : (
                    <div className="h-48 w-full flex items-center justify-center gradient-primary">
                      <span className="text-primary-foreground/50 text-sm">Service</span>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                    {s.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{s.description}</p>
                    )}
                    <a
                      href={getWhatsAppLink(s.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                    >
                      <WhatsappLogo size={18} /> {t("servicesPage.requestQuote")}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("servicesPage.ctaTitle")}</h2>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-lg"
            >
              <WhatsappLogo size={22} /> {t("servicesPage.requestQuote")}
            </a>
          </div>

          {/* Why Businesses Choose OMT */}
          <div className="mt-20 glass rounded-2xl p-8 sm:p-12">
            <h3 className="text-xl font-bold text-foreground text-center sm:text-2xl">{t("servicesPage.whyTitle")}</h3>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trustBadges?.map((badge: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle size={22} weight="fill" className="text-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default ServicesPage;
