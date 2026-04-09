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

      {/* Intro */}
      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="headline" className="text-center">
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t("supplierVerificationPage.intro")}</p>
          </ScrollReveal>
        </div>
      </section>

      <StatsBar stats={[
        { value: 100, suffix: "%", label: "Verified Suppliers" },
        { value: 500, suffix: "+", label: "Factory Audits" },
        { value: 15, suffix: "+", label: "Years Experience" },
        { value: 0, prefix: "<", suffix: ".5%", label: "Fraud Rate" },
      ]} />

      <ProcessTimeline
        tag="Our Process"
        title="Verification Steps"
        subtitle="Every supplier goes through our rigorous multi-step verification process."
        steps={steps?.map((s) => ({ title: s.title, desc: s.desc })) || []}
      />

      <FullWidthCTA title="Need a verified supplier?" buttonLabel={t("hero.cta1")} href="/contact" />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default SupplierVerificationPage;
