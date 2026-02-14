import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, TrendUp, ShieldCheck, Users } from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Globe, value: 50, suffix: "+", label: "Countries Served" },
  { icon: Users, value: 2000, suffix: "+", label: "Verified Suppliers" },
  { icon: ShieldCheck, value: 98, suffix: "%", label: "Client Satisfaction" },
  { icon: TrendUp, value: 12, suffix: "+", label: "Years Experience" },
];

const flags = ["🇺🇸", "🇬🇧", "🇦🇪", "🇩🇪", "🇳🇬"];

const AnimatedCounter = ({ target, suffix, triggered }: { target: number; suffix: string; triggered: boolean }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!triggered) return;
    const duration = 2000;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const TrustedBySection = () => {
  const ref = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 75%",
        onEnter: () => setTriggered(true),
        once: true,
      });
      gsap.from(".trusted-stat", {
        scrollTrigger: { trigger: ".trusted-stats", start: "top 80%" },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.from(".flag-item", {
        scrollTrigger: { trigger: ".flags-row", start: "top 85%" },
        opacity: 0,
        scale: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "back.out(2)",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-padding gradient-dark">
      <div className="container-narrow">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Our Reach
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted By Businesses Worldwide
          </h2>
        </div>

        {/* Flags */}
        <div className="flags-row mt-10 flex items-center justify-center gap-4">
          {flags.map((flag, i) => (
            <span key={i} className="flag-item text-4xl sm:text-5xl drop-shadow-lg">
              {flag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="trusted-stats mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="trusted-stat glass rounded-2xl p-6 text-center transition-all duration-300 hover:glow-primary hover:-translate-y-1 border border-transparent hover:border-primary/20"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-lg">
                <s.icon size={24} weight="light" className="text-primary-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                <AnimatedCounter target={s.value} suffix={s.suffix} triggered={triggered} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
