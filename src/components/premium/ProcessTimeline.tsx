import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "@/components/ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  title: string;
  desc: string;
  icon?: React.ReactNode;
}

const ProcessTimeline = ({ title, subtitle, steps, tag }: { title: string; subtitle?: string; steps: Step[]; tag?: string }) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current, { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: lineRef.current, start: "top 80%", end: "bottom 20%", scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="section-padding overflow-hidden">
      <div className="container-narrow">
        {tag && (
          <ScrollReveal animation="headline" className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">{tag}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{title}</h2>
            {subtitle && <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
          </ScrollReveal>
        )}
        <div className="relative max-w-2xl mx-auto">
          <div ref={lineRef} className="absolute left-6 sm:left-8 top-0 bottom-0 w-[2px] bg-primary/30 origin-top" />
          <div className="space-y-12">
            {steps.map((step, i) => (
              <ScrollReveal key={i} animation={i % 2 === 0 ? "slide-right" : "slide-left"} delay={i * 0.08}>
                <div className="flex gap-5 sm:gap-6 items-start">
                  <div className="relative z-10 flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full shadow-lg gradient-primary text-primary-foreground font-bold text-lg">
                    {step.icon || (i + 1)}
                  </div>
                  <div className="glass-strong rounded-xl p-5 sm:p-6 flex-1 group hover:scale-[1.02] transition-transform duration-300">
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
