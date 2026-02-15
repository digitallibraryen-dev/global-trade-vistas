import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParallaxOrbs from "./ParallaxOrbs";

gsap.registerPlugin(ScrollTrigger);

const AboutPreview = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
      tl.from(".about-tag", { opacity: 0, y: 30, filter: "blur(6px)", duration: 0.6, ease: "power3.out" })
        .from(".about-title", { opacity: 0, y: 40, filter: "blur(8px)", duration: 0.8, ease: "power3.out" }, "-=0.3")
        .from(".about-body", { opacity: 0, y: 30, filter: "blur(4px)", duration: 0.7, ease: "power3.out" }, "-=0.4")
        .from(".about-cta", { opacity: 0, y: 20, filter: "blur(4px)", duration: 0.6, ease: "power3.out" }, "-=0.3");

      // Clear blur after animation
      tl.eventCallback("onComplete", () => {
        gsap.set([".about-tag", ".about-title", ".about-body", ".about-cta"], { clearProps: "filter" });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={ref} className="relative section-padding overflow-hidden">
      <ParallaxOrbs variant="primary" />
      <div className="container-narrow relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="about-tag text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {t("aboutPreview.tag")}
          </p>
          <h2 className="about-title mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("aboutPreview.title")}
          </h2>
          <p className="about-body mt-6 text-base leading-relaxed text-muted-foreground">
            {t("aboutPreview.body")}
          </p>
          <Link
            to="/about-us"
            className="about-cta btn-3d mt-8 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary"
          >
            {t("aboutPreview.learnMore")} <ArrowRight size={16} data-icon />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
