import { useTranslation } from "react-i18next";
import { TrendUp, ChartBar, Lightbulb, Target, Strategy } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";

const icons = [TrendUp, ChartBar, Lightbulb, Target, Strategy];

const ProductResearchPage = () => {
  const { t } = useTranslation();
  const steps = t("productResearchPage.steps", { returnObjects: true }) as { title: string; desc: string }[];

  return (
    <>
      <Navbar />
      <PageHeader tag={t("productResearchPage.tag")} title={t("productResearchPage.title")} subtitle={t("productResearchPage.subtitle")} />
      <main className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="headline" className="mb-10">
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center">{t("productResearchPage.intro")}</p>
          </ScrollReveal>
          <ScrollReveal animation="card" stagger={0.12} className="space-y-6">
            {steps?.map((s, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div key={i} className="glass rounded-2xl p-6 flex gap-5 items-start">
                  <div className="shrink-0 rounded-xl bg-primary/10 p-3">
                    <Icon size={28} weight="duotone" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
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

export default ProductResearchPage;
