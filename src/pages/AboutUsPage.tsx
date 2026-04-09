import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Star, Handshake, GlobeHemisphereWest, Lightbulb,
  RocketLaunch, Buildings, UsersThree, ChartLineUp,
  CheckCircle, Scales,
} from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import CinematicHero from "@/components/premium/CinematicHero";
import SplitSection from "@/components/premium/SplitSection";
import StatsBar from "@/components/premium/StatsBar";
import FullWidthCTA from "@/components/premium/FullWidthCTA";
import heroImg from "@/assets/pages/hero-about.jpg";
import servicesImg from "@/assets/pages/hero-services.jpg";

const values = [
  { icon: Star, key: "quality" },
  { icon: Handshake, key: "trust" },
  { icon: GlobeHemisphereWest, key: "connectivity" },
  { icon: Lightbulb, key: "innovation" },
];

const timeline = [
  { icon: RocketLaunch, key: "founded" },
  { icon: ChartLineUp, key: "growth" },
  { icon: Buildings, key: "expansion" },
  { icon: UsersThree, key: "clients" },
];

const AboutUsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <CinematicHero
        tag={t("aboutPage.tag")}
        title={t("aboutPage.title")}
        subtitle={t("aboutPage.companyName")}
        image={heroImg}
      />

      {/* Mission & Vision split */}
      <SplitSection
        tag={t("aboutPage.missionTitle")}
        title={t("aboutPage.missionTitle")}
        text={t("aboutPage.missionText")}
        image={servicesImg}
      />
      <SplitSection
        tag={t("aboutPage.visionTitle")}
        title={t("aboutPage.visionTitle")}
        text={t("aboutPage.visionText")}
        image={heroImg}
        reverse
      />

      {/* Stats */}
      <StatsBar stats={[
        { value: 15, suffix: "+", label: t("whyChoose.items.experience.title").split(" ")[0] + " Years" },
        { value: 50, suffix: "+", label: "Countries" },
        { value: 500, suffix: "+", label: "Clients" },
        { value: 98, suffix: "%", label: "Satisfaction" },
      ]} />

      {/* Core Values */}
      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="headline" className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t("aboutPage.valuesTitle")}</h2>
          </ScrollReveal>
          <ScrollReveal animation="card" stagger={0.12} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.key} className="glass-strong rounded-2xl p-8 text-center group hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:glow-primary transition-shadow">
                  <v.icon size={32} className="text-primary" weight="duotone" />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-lg">{t(`aboutPage.values.${v.key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`aboutPage.values.${v.key}.desc`)}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding gradient-dark overflow-hidden">
        <div className="container-narrow">
          <ScrollReveal animation="headline" className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t("aboutPage.storyTitle")}</h2>
          </ScrollReveal>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-primary/20 sm:left-1/2 sm:-translate-x-px" />
            {timeline.map((item, i) => (
              <ScrollReveal key={item.key} animation={i % 2 === 0 ? "slide-right" : "slide-left"} delay={i * 0.1}>
                <div className={`relative flex items-start gap-4 mb-12 ${i % 2 === 1 ? "sm:flex-row-reverse sm:text-right" : ""}`}>
                  <div className="relative z-10 h-14 w-14 shrink-0 rounded-full shadow-lg gradient-primary flex items-center justify-center sm:mx-auto">
                    <item.icon size={26} className="text-primary-foreground" weight="light" />
                  </div>
                  <div className="glass-strong rounded-xl p-6 flex-1 hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="font-bold text-foreground text-lg">{t(`aboutPage.story.${item.key}.title`)}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(`aboutPage.story.${item.key}.desc`)}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Identity */}
      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="headline" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t("aboutPage.legalTitle")}</h2>
          </ScrollReveal>
          <ScrollReveal animation="scale-in">
            <div className="glass-strong rounded-2xl p-10 max-w-3xl mx-auto text-center">
              <Scales size={44} className="text-primary mx-auto mb-5" weight="duotone" />
              <p className="text-xl font-bold text-foreground">{t("aboutPage.legalEntityCn")}</p>
              <p className="text-sm font-semibold text-primary mt-1">{t("aboutPage.legalEntityEn")}</p>
              <p className="mt-5 text-muted-foreground leading-relaxed">{t("aboutPage.legalText")}</p>
              <p className="mt-3 text-sm text-muted-foreground italic">{t("aboutPage.legalNote")}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="card" stagger={0.08} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 max-w-4xl mx-auto">
            {["registered", "compliant", "verified", "transparent", "secure"].map((badge) => (
              <div key={badge} className="flex items-center gap-2 glass-strong rounded-xl p-4 hover:-translate-y-1 transition-transform duration-300">
                <CheckCircle size={20} className="text-primary shrink-0" weight="fill" />
                <span className="text-sm font-medium text-foreground">{t(`aboutPage.trust.${badge}`)}</span>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <FullWidthCTA
        title={t("servicesPage.ctaTitle")}
        buttonLabel={t("hero.cta2")}
        href="/contact"
      />

      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default AboutUsPage;
