import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CaretDown } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import CinematicHero from "@/components/premium/CinematicHero";
import FullWidthCTA from "@/components/premium/FullWidthCTA";
import heroImg from "@/assets/pages/hero-logistics.jpg";

const ImportGuidePage = () => {
  const { t } = useTranslation();
  const sections = t("importGuidePage.sections", { returnObjects: true }) as { title: string; content: string }[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <Navbar />
      <CinematicHero
        tag={t("importGuidePage.tag")}
        title={t("importGuidePage.title")}
        subtitle={t("importGuidePage.subtitle")}
        image={heroImg}
      />

      <section className="section-padding">
        <div className="container-narrow max-w-3xl mx-auto">
          <ScrollReveal animation="headline" className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">Step by Step</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Your Import Journey</h2>
          </ScrollReveal>
          <div className="space-y-4">
            {sections?.map((s, i) => (
              <ScrollReveal key={i} animation="card" delay={i * 0.05}>
                <div className="glass-strong rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-extrabold text-primary/30">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                    </div>
                    <CaretDown
                      size={20}
                      weight="bold"
                      className={`text-primary shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-out ${open === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-6 pb-6 pl-16">
                      <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{s.content}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <FullWidthCTA title="Need help importing from China?" buttonLabel={t("hero.cta1")} href="/contact" />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default ImportGuidePage;
