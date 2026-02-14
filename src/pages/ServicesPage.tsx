import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { WhatsappLogo } from "@phosphor-icons/react";
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

  const getWhatsAppLink = (title: string) => {
    if (!whatsapp) return "#";
    const number = whatsapp.value.replace(/[^0-9+]/g, "").replace("+", "");
    const message = encodeURIComponent(`Hello Almonesi Global Trade (OMT),\nI would like to request a quotation for your service: ${title}.\nPlease provide more details.`);
    return `https://wa.me/${number}?text=${message}`;
  };

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
                    <div className="h-48 w-full flex items-center justify-center" style={{ backgroundColor: '#003f7f' }}>
                      <span className="text-white/50 text-sm">Service</span>
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
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default ServicesPage;
