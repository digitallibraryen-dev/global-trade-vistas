import { useTranslation } from "react-i18next";
import { Boat, Airplane, Train, Warehouse, MapTrifold } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";

const icons = [Boat, Airplane, Train, Warehouse, MapTrifold];

const LogisticsShippingPage = () => {
  const { t } = useTranslation();
  const services = t("logisticsShippingPage.services", { returnObjects: true }) as { title: string; desc: string }[];

  return (
    <>
      <Navbar />
      <PageHeader tag={t("logisticsShippingPage.tag")} title={t("logisticsShippingPage.title")} subtitle={t("logisticsShippingPage.subtitle")} />
      <main className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="headline" className="mb-10">
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center">{t("logisticsShippingPage.intro")}</p>
          </ScrollReveal>
          <ScrollReveal animation="card" stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services?.map((s, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div key={i} className="glass rounded-2xl p-6 text-center">
                  <Icon size={36} weight="duotone" className="text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </ScrollReveal>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default LogisticsShippingPage;
