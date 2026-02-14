import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlobeHemisphereWest, Factory, Package, Handshake } from "@phosphor-icons/react";
import ParallaxOrbs from "./ParallaxOrbs";

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  {
    icon: GlobeHemisphereWest,
    title: "Global Trade Expertise",
    desc: "Over 12 years of hands-on experience navigating China's supply chain and international markets with precision and confidence.",
  },
  {
    icon: Factory,
    title: "Verified Manufacturing Network",
    desc: "Direct access to trusted factories and first-tier suppliers across major industrial cities in China.",
  },
  {
    icon: Package,
    title: "End-to-End Logistics Control",
    desc: "From factory inspection to customs clearance and final delivery — we manage every detail.",
  },
  {
    icon: Handshake,
    title: "Transparent & Ethical Trade",
    desc: "We ensure clear communication, fair pricing, and secure transactions at every stage.",
  },
];

const WhyChooseUsSection = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".why-card", {
        scrollTrigger: { trigger: ".why-grid", start: "top 80%" },
        opacity: 0,
        y: 50,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative section-padding">
      <ParallaxOrbs variant="primary" />
      <div className="container-narrow relative z-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Why Choose Us
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your Competitive Edge in Global Trade
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            We combine deep industry knowledge with an unmatched supplier network to give your business the advantage.
          </p>
        </div>

        <div className="why-grid mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="why-card group glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_24px_hsl(var(--glow-primary)/0.25)] cursor-default border border-transparent hover:border-primary/20"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-lg transition-transform duration-300 group-hover:scale-110">
                <r.icon size={28} weight="light" className="text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
