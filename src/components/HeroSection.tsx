import { useEffect, useRef } from "react";
import gsap from "gsap";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-headline", {
        opacity: 0,
        y: 60,
        filter: "blur(10px)",
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
      });
      gsap.from(".hero-sub", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        delay: 0.5,
      });
      gsap.from(".hero-cta", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.8,
        stagger: 0.15,
      });
      gsap.from(".hero-spline", {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.3,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Spline 3D Background */}
      <div className="hero-spline absolute inset-0 z-0">
        <iframe
          src="https://my.spline.design/herobannerfortransportandlogisticscompanygmw2425-GYw1Ka0Iu2NG1giJfqOEBM46/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="pointer-events-none"
          title="3D Hero Background"
          loading="lazy"
        />
        {/* Gradient overlay for readability */}
        {/* Solid black bar to fully hide Spline branding */}
        <div
          className="absolute inset-x-0 bottom-0 h-[80px] pointer-events-none z-[5]"
          style={{ background: "linear-gradient(to top, rgba(20,100,200,0.8) 0%, rgba(80,160,255,0.4) 60%, rgba(255,255,255,0) 100%)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center section-padding pt-24">
        <div className="container-narrow">
          <div className="max-w-2xl">
            <h1 className="hero-headline text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your Trusted Partner for{" "}
              <span className="gradient-primary bg-clip-text text-transparent">
                Sourcing & Trade
              </span>{" "}
              in China
            </h1>
            <p className="hero-sub mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              We connect your business with verified suppliers and manage your
              trade operations professionally — from sourcing to delivery.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("#quote")}
                className="hero-cta rounded-lg gradient-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-[0_0_30px_hsl(215_80%_50%/0.4)] active:scale-[0.98]"
              >
                Request a Quote
              </button>
              <button
                onClick={() => scrollTo("#contact")}
                className="hero-cta glass rounded-lg px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-secondary"
              >
                Book a Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
