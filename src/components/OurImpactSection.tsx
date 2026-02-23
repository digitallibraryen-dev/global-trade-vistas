import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Users, Globe, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

gsap.registerPlugin(ScrollTrigger);

/* ── Unique visitor counter (localStorage-based, starts at 1,828,292) ── */
const VISITOR_KEY = "almonesi_visitor_count";
const VISITOR_SEEN = "almonesi_visitor_seen";
const BASE_VISITORS = 1828292;

function getVisitorCount(): number {
  try {
    const raw = localStorage.getItem(VISITOR_KEY);
    const seen = localStorage.getItem(VISITOR_SEEN);
    const today = new Date().toDateString();

    if (!raw) {
      const isNew = !seen;
      const count = isNew ? BASE_VISITORS + 1 : BASE_VISITORS;
      localStorage.setItem(VISITOR_KEY, JSON.stringify({ count, date: today }));
      localStorage.setItem(VISITOR_SEEN, "1");
      return count;
    }

    const { count, date } = JSON.parse(raw);
    if (date === today) return count;

    const lastDate = new Date(date);
    const now = new Date();
    const daysPassed = Math.max(1, Math.floor((now.getTime() - lastDate.getTime()) / 86400000));
    let newCount = count;
    for (let i = 0; i < daysPassed; i++) {
      newCount += Math.floor(Math.random() * 101) + 50;
    }
    localStorage.setItem(VISITOR_KEY, JSON.stringify({ count: newCount, date: today }));
    return newCount;
  } catch {
    return BASE_VISITORS;
  }
}

/* ── Animated counter ── */
const AnimatedCounter = ({
  target,
  suffix = "",
  triggered,
}: {
  target: number;
  suffix?: string;
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
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const OurImpactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [visitorCount] = useState(() => getVisitorCount());
  const [happyClients, setHappyClients] = useState(5230);

  // Fetch approved review count dynamically
  useEffect(() => {
    const fetchClients = async () => {
      const { count } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");
      if (count && count > 0) {
        // Base + approved reviews to inflate naturally
        setHappyClients(5230 + count);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        onEnter: () => setTriggered(true),
        once: true,
      });

      gsap.from(".impact-card", {
        scrollTrigger: { trigger: ".impact-grid", start: "top 80%" },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".impact-icon", {
        scrollTrigger: { trigger: ".impact-grid", start: "top 80%" },
        opacity: 0,
        scale: 0.5,
        duration: 0.7,
        stagger: 0.12,
        ease: "back.out(1.7)",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: Eye, value: visitorCount, suffix: "", label: "Visitors" },
    { icon: Users, value: happyClients, suffix: "+", label: "Satisfied Clients" },
    { icon: Globe, value: 50, suffix: "+", label: "Countries Served 🌍" },
    { icon: ShieldCheck, value: 0, label: "Secure & Trusted", isSSL: true },
  ];

  return (
    <section
      ref={sectionRef}
      id="our-impact"
      className="section-padding relative overflow-hidden"
    >
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
            Building trust through consistent delivery and unwavering commitment
            to excellence across the globe.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="impact-grid grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="impact-card group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 text-center transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(var(--primary)/0.1)]"
            >
              <div className="impact-icon mx-auto mb-4">
                <s.icon
                  size={36}
                  strokeWidth={1.5}
                  className="text-primary/80 group-hover:text-primary transition-colors duration-300 drop-shadow-[0_0_8px_hsl(var(--primary)/0.3)]"
                  style={{
                    animation: `impactFloat ${3 + i * 0.5}s ease-in-out infinite`,
                  }}
                />
              </div>

              <div className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                {s.isSSL ? (
                  <span className="text-3xl sm:text-4xl">🔒</span>
                ) : (
                  <AnimatedCounter
                    target={s.value}
                    suffix={s.suffix || ""}
                    triggered={triggered}
                  />
                )}
              </div>

              <div className="mt-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes impactFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </section>
  );
};

export default OurImpactSection;
