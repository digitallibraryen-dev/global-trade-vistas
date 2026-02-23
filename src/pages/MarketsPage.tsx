import { useTranslation } from "react-i18next";
import { MapPin } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";

const MarketsPage = () => {
  const { t } = useTranslation();
  const markets = t("marketsPage.markets", { returnObjects: true }) as { name: string; desc: string }[];

  return (
    <>
      <Navbar />
      <PageHeader tag={t("marketsPage.tag")} title={t("marketsPage.title")} subtitle={t("marketsPage.subtitle")} />
      <main className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="headline" className="mb-10">
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center">{t("marketsPage.intro")}</p>
          </ScrollReveal>
          <ScrollReveal animation="card" stagger={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {markets?.map((m, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin size={24} weight="duotone" className="text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{m.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default MarketsPage;
