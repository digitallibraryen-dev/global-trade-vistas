import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PaperPlaneTilt, MagnifyingGlass, ShieldCheck, Handshake, Truck } from "@phosphor-icons/react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { key: "submit", Icon: PaperPlaneTilt },
  { key: "search", Icon: MagnifyingGlass },
  { key: "sampling", Icon: ShieldCheck },
  { key: "negotiate", Icon: Handshake },
  { key: "logistics", Icon: Truck },
];

const HowItWorksPage = () => {
  const { t } = useTranslation();
  const { data: links } = useSocialLinks();
  const whatsapp = links?.find((l) => l.platform === "whatsapp");

  const getWhatsAppLink = () => {
    if (!whatsapp) return "#";
    const number = whatsapp.value.replace(/[^0-9+]/g, "").replace("+", "");
    const message = encodeURIComponent(t("whatsappMessages.general"));
    return `https://wa.me/${number}?text=${message}`;
  };

  return (
    <>
      <Navbar />
      <PageHeader
        tag={t("howItWorksPage.tag")}
        title={t("howItWorksPage.title")}
        subtitle={t("howItWorksPage.subtitle")}
      />
      <main className="section-padding">
        <div className="container-narrow max-w-3xl">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-[2px] hidden sm:block bg-primary/20" />
            <div className="space-y-14">
              {steps.map(({ key, Icon }, i) => (
                <ScrollReveal key={key} animation={i % 2 === 0 ? "slide-right" : "slide-left"} delay={i * 0.1}>
                  <div className="flex gap-6 items-start">
                    <ScrollReveal animation="icon-bounce">
                      <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-lg gradient-primary">
                        <Icon size={28} weight="light" className="text-primary-foreground" />
                      </div>
                    </ScrollReveal>
                    <div className="pt-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">{t("howItWorks.step")} {i + 1}</p>
                      <h3 className="mt-1 text-lg font-semibold text-foreground">{t(`howItWorksPage.steps.${key}.title`)}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(`howItWorksPage.steps.${key}.desc`)}</p>
                      {(t(`howItWorksPage.steps.${key}.bullets`, { returnObjects: true }) as string[])?.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {(t(`howItWorksPage.steps.${key}.bullets`, { returnObjects: true }) as string[]).map((b: string, j: number) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <ScrollReveal animation="headline" className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("howItWorksPage.ctaTitle")}</h2>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg"
          >
            <WhatsappLogo size={22} /> {t("servicesPage.requestQuote")}
          </a>
        </ScrollReveal>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default HowItWorksPage;
