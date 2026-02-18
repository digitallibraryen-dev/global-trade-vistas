import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, ShieldCheck, Headset, Globe, TrendingUp, Package } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ── localStorage-based daily auto-incrementing counter ── */
const STORAGE_KEY = "almonesi_client_count";
const BASE_COUNT = 1721;

function getClientCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const data = { count: BASE_COUNT, date: new Date().toDateString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return BASE_COUNT;
    }
    const { count, date } = JSON.parse(raw);
    const today = new Date().toDateString();
    if (date === today) return count;

    // Calculate days passed and increment randomly 1-3 per day
    const lastDate = new Date(date);
    const now = new Date();
    const daysPassed = Math.max(1, Math.floor((now.getTime() - lastDate.getTime()) / 86400000));
    let newCount = count;
    for (let i = 0; i < daysPassed; i++) {
      newCount += Math.floor(Math.random() * 3) + 1; // 1-3 per day
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: newCount, date: today }));
    return newCount;
  } catch {
    return BASE_COUNT;
  }
}

/* ── Animated counter ── */
const AnimatedCounter = ({
  target,
  suffix = "",
  prefix = "",
  triggered,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  triggered: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    const duration = 2200;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, target]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ── Stats data ── */
const stats = [
  {
    icon: Users,
    getValue: getClientCount,
    suffix: "+",
    label: "Satisfied Clients",
    dynamic: true,
  },
  {
    icon: ShieldCheck,
    getValue: () => 2000,
    suffix: "+",
    label: "Verified Suppliers",
    dynamic: false,
  },
  {
    icon: Headset,
    getValue: () => 24,
    suffix: "/7",
    label: "Customer Support",
    dynamic: false,
  },
  {
    icon: Globe,
    getValue: () => 50,
    suffix: "+",
    label: "Countries Served",
    dynamic: false,
  },
  {
    icon: TrendingUp,
    getValue: () => 12,
    suffix: "+",
    label: "Years Experience",
    dynamic: false,
  },
  {
    icon: Package,
    getValue: () => 98,
    suffix: "%",
    label: "Delivery Success",
    dynamic: false,
  },
];

const LiveStatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        onEnter: () => setTriggered(true),
        once: true,
      });

      // Staggered icon reveal
      gsap.from(".stat-icon", {
        scrollTrigger: { trigger: ".stats-grid", start: "top 80%" },
        opacity: 0,
        scale: 0.5,
        duration: 0.7,
        stagger: 0.1,
        ease: "back.out(1.7)",
      });

      // Cards fade up
      gsap.from(".stat-card", {
        scrollTrigger: { trigger: ".stats-grid", start: "top 80%" },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Subtle radial glow background */}
      <div className="absolute inset-0 gradient-radial-glow opacity-50 pointer-events-none" />

      <div className="container-narrow relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Our Impact
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Numbers That Speak
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            Building trust through consistent delivery and unwavering commitment to excellence across the globe.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="stat-card group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 text-center transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(var(--primary)/0.1)]"
            >
              {/* Icon — outline only with glow */}
              <div className="stat-icon mx-auto mb-4 relative">
                <s.icon
                  size={32}
                  strokeWidth={1.5}
                  className="text-primary/80 group-hover:text-primary transition-colors duration-300 drop-shadow-[0_0_8px_hsl(var(--primary)/0.3)]"
                  style={{
                    animation: `floatIcon ${3 + i * 0.4}s ease-in-out infinite`,
                  }}
                />
              </div>

              {/* Counter */}
              <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                <AnimatedCounter
                  target={s.getValue()}
                  suffix={s.suffix}
                  triggered={triggered}
                />
              </div>

              {/* Label */}
              <div className="mt-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating icon keyframes */}
      <style>{`
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </section>
  );
};

export default LiveStatsSection;
