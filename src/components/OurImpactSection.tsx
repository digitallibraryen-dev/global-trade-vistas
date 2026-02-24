import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Users, Globe, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

gsap.registerPlugin(ScrollTrigger);

const VISITOR_COOKIE = "almonesi_counted";

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
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [visitorCount, setVisitorCount] = useState(1449);
  const [happyClients, setHappyClients] = useState(339);

  // Fetch visitor count from DB & increment if new visitor
  useEffect(() => {
    const trackVisitor = async () => {
      // Check if already counted this session/browser
      const counted = document.cookie.includes(VISITOR_COOKIE);
      if (!counted) {
        // Increment atomically in DB
        const { data } = await supabase.rpc("increment_counter", { counter_id: "visitors" });
        if (data) {
          setVisitorCount(data as number);
          // Set cookie so we don't count again for 24h
          const d = new Date();
          d.setTime(d.getTime() + 86400000);
          document.cookie = `${VISITOR_COOKIE}=1;expires=${d.toUTCString()};path=/;SameSite=Lax`;
        }
      } else {
        // Just read current value
        const { data } = await supabase.from("site_counters").select("value").eq("id", "visitors").single();
        if (data) setVisitorCount(data.value);
      }
    };
    trackVisitor();
  }, []);

  // Fetch approved review count dynamically
  useEffect(() => {
    const fetchClients = async () => {
      const { count } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");
      if (count && count > 0) {
        setHappyClients(339 + count);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    // If already in viewport, trigger immediately
    const rect = sectionRef.current.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.75) {
      setTriggered(true);
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        onEnter: () => setTriggered(true),
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: Eye, value: visitorCount, suffix: "", label: t("ourImpact.visitors") },
    { icon: Users, value: happyClients, suffix: "+", label: t("ourImpact.satisfiedClients") },
    { icon: Globe, value: 24, suffix: "", label: t("ourImpact.countriesServed") },
    { icon: ShieldCheck, value: 0, label: t("ourImpact.secureAndTrusted"), isSSL: true },
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
            {t("ourImpact.subtitle")}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("ourImpact.title")}
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t("ourImpact.description")}
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
