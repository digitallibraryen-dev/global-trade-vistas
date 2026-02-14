import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, ChartLineUp, Scales, ArrowRight } from "@phosphor-icons/react";
import ParallaxOrbs from "./ParallaxOrbs";

gsap.registerPlugin(ScrollTrigger);

const resources = [
  {
    icon: BookOpen,
    title: "Trade Guides",
    desc: "In-depth guides covering sourcing strategies, supplier verification, and contract safety.",
  },
  {
    icon: ChartLineUp,
    title: "Market Insights",
    desc: "Up-to-date analysis of Chinese manufacturing trends and global trade shifts.",
  },
  {
    icon: Scales,
    title: "Compliance & Regulations",
    desc: "Understand tariffs, import duties, documentation, and compliance requirements.",
  },
];

const KnowledgeHubSection = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".knowledge-card", {
        scrollTrigger: { trigger: ".knowledge-grid", start: "top 80%" },
        opacity: 0,
        y: 40,
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
            Resources
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Knowledge Hub
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Stay informed with expert resources to help you navigate international trade confidently.
          </p>
        </div>

        <div className="knowledge-grid mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <div
              key={r.title}
              className="knowledge-card group glass rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_24px_hsl(var(--glow-primary)/0.2)] cursor-pointer border border-transparent hover:border-primary/20 overflow-hidden relative"
            >
              {/* Gradient border glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--primary) / 0.05), hsl(var(--accent) / 0.08))`,
                }}
              />
              <div className="relative z-10">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <r.icon size={28} weight="light" className="text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary transition-all duration-300 group-hover:gap-3">
                  Explore More <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KnowledgeHubSection;
