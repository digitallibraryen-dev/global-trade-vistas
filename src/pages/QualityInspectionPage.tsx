import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import CinematicHero from "@/components/premium/CinematicHero";
import ProcessTimeline from "@/components/premium/ProcessTimeline";
import SplitSection from "@/components/premium/SplitSection";
import FullWidthCTA from "@/components/premium/FullWidthCTA";
import heroImg from "@/assets/pages/hero-quality.jpg";
import servicesImg from "@/assets/pages/hero-services.jpg";

const QualityInspectionPage = () => {
  const { t } = useTranslation();
  const steps = t("qualityInspectionPage.steps", { returnObjects: true }) as { title: string; desc: string }[];

  return (
    <>
      <Navbar />
      <CinematicHero
        tag={t("qualityInspectionPage.tag")}
        title={t("qualityInspectionPage.title")}
        subtitle={t("qualityInspectionPage.subtitle")}
        image={heroImg}
      />

      <SplitSection
        tag="Why Quality Matters"
        title="Zero Defects. Zero Surprises."
        text={t("qualityInspectionPage.intro")}
        image={servicesImg}
      />

      <ProcessTimeline
        tag="Inspection Stages"
        title="Our Quality Control Process"
        subtitle="Comprehensive checks at every stage of production."
        steps={steps?.map((s) => ({ title: s.title, desc: s.desc })) || []}
      />

      <section className="section-padding gradient-dark">
        <div className="container-narrow">
          <ScrollReveal animation="card" stagger={0.1} className="grid gap-6 sm:grid-cols-3">
            {[
              { val: "100%", label: "Pre-shipment Check" },
              { val: "AQL", label: "Sampling Standards" },
              { val: "24h", label: "Report Delivery" },
            ].map((s, i) => (
              <div key={i} className="text-center glass-strong rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300">
                <span className="text-4xl font-extrabold text-primary">{s.val}</span>
                <span className="block mt-2 text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <FullWidthCTA title="Ensure product quality before shipping" buttonLabel={t("hero.cta1")} href="/contact" />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default QualityInspectionPage;
