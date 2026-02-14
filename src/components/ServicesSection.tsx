import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagnifyingGlass, Package, ChartLineUp, Airplane } from "@phosphor-icons/react";
import ParallaxOrbs from "./ParallaxOrbs";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: MagnifyingGlass,
    title: "Sourcing Services",
    desc: "We identify, verify, and connect you with the best manufacturers and suppliers across China tailored to your exact product requirements.",
  },
  {
    icon: Package,
    title: "Export & Shipping",
    desc: "Full export management including documentation, customs clearance, freight forwarding, and door-to-door delivery worldwide.",
  },
  {
    icon: ChartLineUp,
    title: "Trade Consulting",
    desc: "Expert guidance on import regulations, pricing strategies, negotiation tactics, and market intelligence for China trade.",
  },
  {
    icon: Airplane,
    title: "Business Visits to China",
    desc: "Organized factory tours, supplier meetings, and trade fair visits with professional interpretation and logistics support.",
  },
];

const ServicesSection = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".service-card", {
        scrollTrigger: { trigger: ".services-grid", start: "top 80%" },
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={ref} className="relative section-padding">
      <ParallaxOrbs variant="primary" />
      <div className="container-narrow relative z-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Our Services
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            End-to-End Trade Solutions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            From finding the right supplier to delivering products at your warehouse — we handle
            every step of your China trade journey.
          </p>
        </div>

        <div className="services-grid mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.title}
              className="service-card group glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:glow-primary cursor-default"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <s.icon size={24} weight="light" className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
