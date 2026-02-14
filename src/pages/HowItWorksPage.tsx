import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PaperPlaneTilt, MagnifyingGlass, ShieldCheck, Handshake, Truck } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { key: "submit", Icon: PaperPlaneTilt },
  { key: "search", Icon: MagnifyingGlass },
  { key: "negotiate", Icon: Handshake },
  { key: "quality", Icon: ShieldCheck },
  { key: "shipment", Icon: Truck },
];

const HowItWorksPage = () => {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hiw-step", {
        scrollTrigger: { trigger: ".hiw-timeline", start: "top 80%" },
        opacity: 0, x: -40, duration: 0.6, stagger: 0.15, ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <PageHeader
        tag={t("howItWorksPage.tag")}
        title={t("howItWorksPage.title")}
        subtitle={t("howItWorksPage.subtitle")}
      />
      <main ref={ref} className="section-padding">
        <div className="container-narrow max-w-3xl hiw-timeline">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-[2px] hidden sm:block" style={{ backgroundColor: '#003f7f', opacity: 0.2 }} />
            <div className="space-y-12">
              {steps.map(({ key, Icon }, i) => (
                <div key={key} className="hiw-step flex gap-6 items-start">
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-lg" style={{ backgroundColor: '#003f7f' }}>
                    <Icon size={28} weight="light" className="text-white" />
                  </div>
                  <div className="pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">{t("howItWorks.step")} {i + 1}</p>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">{t(`howItWorksPage.steps.${key}.title`)}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(`howItWorksPage.steps.${key}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default HowItWorksPage;
