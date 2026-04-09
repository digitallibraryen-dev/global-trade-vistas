import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import CinematicHero from "@/components/premium/CinematicHero";
import ProcessTimeline from "@/components/premium/ProcessTimeline";
import StatsBar from "@/components/premium/StatsBar";
import FullWidthCTA from "@/components/premium/FullWidthCTA";
import heroImg from "@/assets/pages/hero-quality.jpg";

const SupplierVerificationPage = () => {
  const { t } = useTranslation();
  const steps = t("supplierVerificationPage.steps", { returnObjects: true }) as { title: string; desc: string }[];

  return (
    <>
      <Navbar />
      <CinematicHero
        tag={t("supplierVerificationPage.tag")}
        title={t("supplierVerificationPage.title")}
        subtitle={t("supplierVerificationPage.subtitle")}
        image={heroImg}
      />

      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="headline" className="text-center">
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t("supplierVerificationPage.intro")}</p>
          </ScrollReveal>
        </div>
      </section>

      <StatsBar stats={[
        { value: 100, suffix: "%", label: t("supplierVerificationPage.statsVerified") },
        { value: 500, suffix: "+", label: t("supplierVerificationPage.statsAudits") },
        { value: 15, suffix: "+", label: t("supplierVerificationPage.statsExperience") },
        { value: 0, prefix: "<", suffix: ".5%", label: t("supplierVerificationPage.statsFraud") },
      ]} />

      <ProcessTimeline
        tag={t("supplierVerificationPage.processTag")}
        title={t("supplierVerificationPage.processTitle")}
        subtitle={t("supplierVerificationPage.processSubtitle")}
        steps={steps?.map((s) => ({ title: s.title, desc: s.desc })) || []}
      />

      <FullWidthCTA title={t("supplierVerificationPage.ctaTitle")} buttonLabel={t("hero.cta1")} href="/contact" />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default SupplierVerificationPage;
