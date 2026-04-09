import { useTranslation } from "react-i18next";
import { MapPin } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import CinematicHero from "@/components/premium/CinematicHero";
import StatsBar from "@/components/premium/StatsBar";
import FullWidthCTA from "@/components/premium/FullWidthCTA";
import heroImg from "@/assets/pages/hero-markets.jpg";

const MarketsPage = () => {
  const { t } = useTranslation();
  const markets = t("marketsPage.markets", { returnObjects: true }) as { name: string; desc: string }[];

  return (
    <>
      <Navbar />
      <CinematicHero
        tag={t("marketsPage.tag")}
        title={t("marketsPage.title")}
        subtitle={t("marketsPage.subtitle")}
        image={heroImg}
      />

      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="headline" className="text-center">
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t("marketsPage.intro")}</p>
          </ScrollReveal>
        </div>
      </section>

      <StatsBar stats={[
        { value: 22, suffix: "+", label: t("marketsPage.statsArab") },
        { value: 50, suffix: "+", label: t("marketsPage.statsTotal") },
        { value: 500, suffix: "+", label: t("marketsPage.statsActiveClients") },
        { value: 15, suffix: "+", label: t("marketsPage.statsYearsRegion") },
      ]} />

      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="headline" className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">{t("marketsPage.gridTag")}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t("marketsPage.gridTitle")}</h2>
          </ScrollReveal>
          <ScrollReveal animation="card" stagger={0.04} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {markets?.map((m, i) => (
              <div key={i} className="glass-strong rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:glow-primary transition-shadow">
                    <MapPin size={22} weight="duotone" className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{m.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <FullWidthCTA title={t("marketsPage.ctaTitle")} buttonLabel={t("hero.cta2")} href="/contact" />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default MarketsPage;
