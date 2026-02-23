import { useTranslation } from "react-i18next";
import { CheckCircle, ShieldCheck, Globe, Rocket, Headset, CurrencyDollar } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";

const icons = [CheckCircle, CurrencyDollar, ShieldCheck, Rocket, Headset, Globe];

const WhyUsPage = () => {
  const { t } = useTranslation();
  const reasons = t("whyUsPage.reasons", { returnObjects: true }) as { title: string; desc: string }[];

  return (
    <>
      <Navbar />
      <PageHeader tag={t("whyUsPage.tag")} title={t("whyUsPage.title")} subtitle={t("whyUsPage.subtitle")} />
      <main className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="card" stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reasons?.map((r, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div key={i} className="glass rounded-2xl p-6">
                  <Icon size={32} weight="duotone" className="text-primary mb-3" />
                  <h3 className="text-lg font-semibold text-foreground">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                </div>
              );
            })}
          </ScrollReveal>

          <ScrollReveal animation="headline" className="mt-16 text-center">
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t("whyUsPage.closing")}</p>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default WhyUsPage;
