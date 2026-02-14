import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagnifyingGlass, Flask, CurrencyDollar, Boat, ChartBar } from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { icon: MagnifyingGlass, title: "Supplier Research", desc: "Carefully identifying the best production partners." },
  { icon: Flask, title: "Quality Inspection", desc: "On-site factory audits & product sampling." },
  { icon: CurrencyDollar, title: "Price Negotiation", desc: "Securing competitive terms on your behalf." },
  { icon: Boat, title: "Shipping & Delivery", desc: "Sea, air, or rail — optimized logistics management." },
  { icon: ChartBar, title: "After-Sales Support", desc: "Ongoing support beyond shipment." },
];

const ServiceProcessSection = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".process-node", {
        scrollTrigger: { trigger: ".process-flow", start: "top 80%" },
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        stagger: 0.12,
        ease: "back.out(1.4)",
      });
      gsap.from(".process-line", {
        scrollTrigger: { trigger: ".process-flow", start: "top 80%" },
        scaleX: 0,
        duration: 1.8,
        ease: "power2.out",
        delay: 0.2,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-padding gradient-dark overflow-hidden">
      <div className="container-narrow">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Our Operational Strength
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Service Process Highlights
          </h2>
        </div>

        <div className="process-flow relative mt-16">
          {/* Connecting dotted line (desktop) */}
          <div className="process-line absolute left-[10%] right-[10%] top-10 hidden h-[2px] origin-left lg:block"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, hsl(var(--primary)) 0, hsl(var(--primary)) 8px, transparent 8px, transparent 16px)`,
            }}
          />

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {steps.map((s) => (
              <div key={s.title} className="process-node group relative text-center">
                <div className="relative z-10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full glass border border-primary/20 shadow-lg transition-all duration-300 group-hover:glow-primary group-hover:scale-110">
                  <div className="absolute inset-0 rounded-full animate-[pulse_3s_ease-in-out_infinite] opacity-30 gradient-primary" />
                  <s.icon size={32} weight="light" className="relative z-10 text-primary transition-colors duration-300 group-hover:text-accent" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceProcessSection;
