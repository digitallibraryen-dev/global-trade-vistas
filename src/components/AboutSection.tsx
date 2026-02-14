import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, TrendUp, ShieldCheck, Handshake } from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Globe, value: "50+", label: "Countries Served" },
  { icon: TrendUp, value: "12+", label: "Years Experience" },
  { icon: ShieldCheck, value: "2,000+", label: "Verified Suppliers" },
  { icon: Handshake, value: "98%", label: "Client Satisfaction" },
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
      gsap.from(".stat-card", {
        scrollTrigger: { trigger: ".stat-card", start: "top 85%" },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
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
              <div className="flex h-full w-full items-center justify-center gradient-radial-glow">
                <Globe size={120} weight="thin" className="text-primary animate-float" />
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

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="stat-card glass rounded-xl p-6 text-center transition-all hover:glow-primary"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-lg">
                <s.icon size={24} weight="light" className="text-primary-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
