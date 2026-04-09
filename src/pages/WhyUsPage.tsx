import { useTranslation } from "react-i18next";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import CinematicHero from "@/components/premium/CinematicHero";
import StatsBar from "@/components/premium/StatsBar";
import FullWidthCTA from "@/components/premium/FullWidthCTA";
import heroImg from "@/assets/pages/hero-whyus.jpg";

const WhyUsPage = () => {
  const { t } = useTranslation();
  const reasons = t("whyUsPage.reasons", { returnObjects: true }) as { title: string; desc: string }[];

  const comparison = [
    { feature: "Verified Supplier Network", us: true, others: false },
    { feature: "On-site Factory Audits", us: true, others: false },
    { feature: "Transparent Pricing", us: true, others: false },
    { feature: "24/7 Support", us: true, others: false },
    { feature: "End-to-End Process", us: true, others: false },
    { feature: "50+ Countries Coverage", us: true, others: false },
  ];

  return (
    <>
      <Navbar />
      <CinematicHero
        tag={t("whyUsPage.tag")}
        title={t("whyUsPage.title")}
        subtitle={t("whyUsPage.subtitle")}
        image={heroImg}
      />

      <StatsBar stats={[
        { value: 15, suffix: "+", label: "Years Experience" },
        { value: 500, suffix: "+", label: "Clients Served" },
        { value: 50, suffix: "+", label: "Countries" },
        { value: 98, suffix: "%", label: "Satisfaction Rate" },
      ]} />

      {/* Strength blocks */}
      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="headline" className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">Our Advantages</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">What Sets Us Apart</h2>
          </ScrollReveal>
          <div className="space-y-8">
            {reasons?.map((r, i) => (
              <ScrollReveal key={i} animation={i % 2 === 0 ? "slide-right" : "slide-left"} delay={i * 0.06}>
                <div className={`flex flex-col lg:flex-row items-start gap-8 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  <div className="flex-1 glass-strong rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300">
                    <span className="text-5xl font-extrabold text-primary/20 mb-2 block">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-2xl font-bold text-foreground">{r.title}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-padding gradient-dark">
        <div className="container-narrow">
          <ScrollReveal animation="headline" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Almonesi vs. Others</h2>
          </ScrollReveal>
          <ScrollReveal animation="scale-in">
            <div className="glass-strong rounded-2xl overflow-hidden max-w-2xl mx-auto">
              <div className="grid grid-cols-3 text-center p-4 border-b border-border/30">
                <span className="text-sm font-medium text-muted-foreground">Feature</span>
                <span className="text-sm font-bold text-primary">Almonesi</span>
                <span className="text-sm font-medium text-muted-foreground">Others</span>
              </div>
              {comparison.map((c, i) => (
                <div key={i} className="grid grid-cols-3 text-center p-4 border-b border-border/10 last:border-0 hover:bg-primary/5 transition-colors">
                  <span className="text-sm text-foreground text-left pl-2">{c.feature}</span>
                  <CheckCircle size={22} weight="fill" className="text-primary mx-auto" />
                  <XCircle size={22} weight="fill" className="text-muted-foreground/40 mx-auto" />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Closing */}
      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="headline" className="text-center">
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t("whyUsPage.closing")}</p>
          </ScrollReveal>
        </div>
      </section>

      <FullWidthCTA title="Ready to work with the best?" buttonLabel={t("hero.cta2")} href="/contact" />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default WhyUsPage;
