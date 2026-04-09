import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "@/components/ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

const Counter = ({ value, suffix = "", prefix = "", label }: Stat) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      onEnter: () => setTriggered(true),
      once: true,
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    if (!triggered || !ref.current) return;
    gsap.fromTo(ref.current, { innerText: "0" }, {
      innerText: value,
      duration: 2,
      ease: "power2.out",
      snap: { innerText: 1 },
      onUpdate() {
        if (ref.current) ref.current.textContent = `${prefix}${Math.round(parseFloat(ref.current.textContent || "0"))}${suffix}`;
      },
    });
  }, [triggered, value, suffix, prefix]);

  return (
    <div className="text-center">
      <span ref={ref} className="block text-4xl sm:text-5xl font-extrabold text-primary">{prefix}0{suffix}</span>
      <span className="mt-2 block text-sm text-muted-foreground">{label}</span>
    </div>
  );
};

const StatsBar = ({ stats }: { stats: Stat[] }) => (
  <section className="section-padding gradient-dark">
    <ScrollReveal animation="card" stagger={0.15} className="container-narrow grid grid-cols-2 sm:grid-cols-4 gap-8">
      {stats.map((s, i) => <Counter key={i} {...s} />)}
    </ScrollReveal>
  </section>
);

export default StatsBar;
