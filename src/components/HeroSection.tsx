import { useEffect, useRef, useCallback, lazy, Suspense } from "react";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const OrbitalBackground = lazy(() => import("@/components/OrbitalBackground"));

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: links = [] } = useSocialLinks();

  const whatsappLink = links.find((l) => l.platform === "whatsapp" && l.enabled);
  const whatsappHref = whatsappLink
    ? `https://wa.me/${whatsappLink.value.replace(/[^0-9+]/g, "").replace("+", "")}`
    : null;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-headline", { opacity: 0, y: 60, filter: "blur(10px)", duration: 1.2, ease: "power3.out", delay: 0.3 });
      gsap.from(".hero-sub", { opacity: 0, y: 40, duration: 1, ease: "power3.out", delay: 0.6 });
      gsap.from(".hero-cta", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out", delay: 0.9, stagger: 0.15 });
    }, section);
    return () => ctx.revert();
  }, []);

  const handleGetQuote = useCallback(() => {
    if (whatsappHref) {
      window.open(whatsappHref, "_blank", "noopener,noreferrer");
    } else {
      document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [whatsappHref]);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden max-w-[100vw] bg-background">
      <Suspense fallback={null}>
        <OrbitalBackground />
      </Suspense>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 pt-20 pb-10">
        <div className="flex flex-col items-center text-center max-w-3xl w-full">
          <h1 className="hero-headline text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl uppercase">
            <span className="text-foreground">{t("hero.title1")} </span>
            <span className="text-primary">{t("hero.highlight")}</span>
            <br />
            <span className="text-foreground">{t("hero.title2")}</span>
          </h1>

          <p className="hero-sub mt-4 sm:mt-6 max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground px-2">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleGetQuote}
              className="hero-cta btn-3d w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/90 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors"
            >
              {t("hero.cta1")}
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="hero-cta btn-3d w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-secondary hover:bg-secondary/80 border border-border px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-secondary-foreground transition-colors"
            >
              {t("hero.cta2")}
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
