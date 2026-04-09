import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import CinematicHero from "@/components/premium/CinematicHero";
import ProcessTimeline from "@/components/premium/ProcessTimeline";
import SplitSection from "@/components/premium/SplitSection";
import FullWidthCTA from "@/components/premium/FullWidthCTA";
import heroImg from "@/assets/pages/hero-research.jpg";
import qualityImg from "@/assets/pages/hero-quality.jpg";

const ProductResearchPage = () => {
  const { t } = useTranslation();
  const steps = t("productResearchPage.steps", { returnObjects: true }) as { title: string; desc: string }[];

  return (
    <>
      <Navbar />
      <CinematicHero
        tag={t("productResearchPage.tag")}
        title={t("productResearchPage.title")}
        subtitle={t("productResearchPage.subtitle")}
        image={heroImg}
      />

      <SplitSection
        tag="Data-Driven"
        title="Find Winning Products"
        text={t("productResearchPage.intro")}
        image={qualityImg}
      />

      {/* Key metrics */}
      <section className="section-padding gradient-dark">
        <div className="container-narrow">
          <ScrollReveal animation="card" stagger={0.12} className="grid gap-6 sm:grid-cols-3">
            {[
              { val: "1000+", label: "Products Analyzed Monthly" },
              { val: "95%", label: "Market Fit Success" },
              { val: "48h", label: "Research Turnaround" },
            ].map((s, i) => (
              <div key={i} className="text-center glass-strong rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300">
                <span className="text-4xl font-extrabold text-primary">{s.val}</span>
                <span className="block mt-2 text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <ProcessTimeline
        tag="Research Methodology"
        title="Our Research Process"
        subtitle="A systematic approach to finding profitable products."
        steps={steps?.map((s) => ({ title: s.title, desc: s.desc })) || []}
      />

      <FullWidthCTA title="Find your next winning product" buttonLabel={t("hero.cta1")} href="/contact" />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default ProductResearchPage;
