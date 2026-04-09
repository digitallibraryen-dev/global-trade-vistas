import { useTranslation } from "react-i18next";
import { Boat, Airplane, Train, Warehouse, FileText } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import CinematicHero from "@/components/premium/CinematicHero";
import SplitSection from "@/components/premium/SplitSection";
import StatsBar from "@/components/premium/StatsBar";
import FullWidthCTA from "@/components/premium/FullWidthCTA";
import heroImg from "@/assets/pages/hero-logistics.jpg";
import aboutImg from "@/assets/pages/hero-about.jpg";

const icons = [Boat, Airplane, Train, Warehouse, FileText];

const LogisticsShippingPage = () => {
  const { t } = useTranslation();
  const services = t("logisticsShippingPage.services", { returnObjects: true }) as { title: string; desc: string }[];

  return (
    <>
      <Navbar />
      <CinematicHero
        tag={t("logisticsShippingPage.tag")}
        title={t("logisticsShippingPage.title")}
        subtitle={t("logisticsShippingPage.subtitle")}
        image={heroImg}
      />

      <SplitSection
        tag={t("logisticsShippingPage.splitTag")}
        title={t("logisticsShippingPage.splitTitle")}
        text={t("logisticsShippingPage.intro")}
        image={aboutImg}
      />

      <StatsBar stats={[
        { value: 50, suffix: "+", label: t("logisticsShippingPage.statsCountries") },
        { value: 5, suffix: "-10", label: t("logisticsShippingPage.statsAir") },
        { value: 25, suffix: "-40", label: t("logisticsShippingPage.statsSea") },
        { value: 15, suffix: "-20", label: t("logisticsShippingPage.statsRail") },
      ]} />

      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="headline" className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">{t("logisticsShippingPage.methodsTag")}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t("logisticsShippingPage.methodsTitle")}</h2>
          </ScrollReveal>
          <div className="space-y-6">
            {services?.map((s, i) => {
              const Icon = icons[i % icons.length];
              return (
                <ScrollReveal key={i} animation={i % 2 === 0 ? "slide-right" : "slide-left"} delay={i * 0.08}>
                  <div className="glass-strong rounded-2xl p-8 flex flex-col sm:flex-row gap-6 items-start hover:-translate-y-1 transition-transform duration-300">
                    <div className="shrink-0 h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
                      <Icon size={30} weight="light" className="text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                      <p className="mt-2 text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <FullWidthCTA title={t("logisticsShippingPage.ctaTitle")} buttonLabel={t("hero.cta1")} href="/contact" />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default LogisticsShippingPage;
