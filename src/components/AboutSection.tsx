import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlobeHemisphereWest, Factory, Package, Handshake, Globe } from "@phosphor-icons/react";

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

const AboutSection = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-image", {
        scrollTrigger: { trigger: ".about-image", start: "top 80%" },
        x: -80,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".about-text > *", {
        scrollTrigger: { trigger: ".about-text", start: "top 80%" },
        opacity: 0,
        y: 40,
        filter: "blur(6px)",
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
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
    <section id="about" ref={ref} className="section-padding gradient-dark">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Image side */}
          <div className="about-image relative">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl glass">
              <div className="flex h-full w-full items-center justify-center" style={{ background: '#003f7f' }}>
                <Globe size={120} weight="thin" className="text-white animate-float" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-2xl gradient-primary opacity-20 blur-2xl" />
          </div>

          {/* Text side */}
          <div className="about-text">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              About Us
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Your Bridge to China's Markets
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Almonesi Global Trade is your trusted business partner in China. With over 12 years
              of experience in international sourcing, export management, and trade consulting, we
              help businesses worldwide access China's vast supply chain with confidence.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Our mission is to simplify cross-border trade — ensuring quality, competitive pricing,
              and reliable delivery for every client we serve.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-20 text-center">
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

export default AboutSection;
