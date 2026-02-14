import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PageHeaderProps {
  tag: string;
  title: string;
  subtitle?: string;
}

const PageHeader = ({ tag, title, subtitle }: PageHeaderProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-header-content > *", {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.15, ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative py-24 sm:py-32 overflow-hidden" style={{ backgroundColor: '#003f7f' }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_70%)]" />
      </div>
      <div className="container-narrow relative z-10 page-header-content text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">{tag}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl mx-auto text-base text-white/70 leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
