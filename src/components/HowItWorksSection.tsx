import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PaperPlaneTilt, MagnifyingGlass, ShieldCheck, Handshake, Truck } from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { icon: PaperPlaneTilt, title: "Submit Your Request", desc: "Tell us what you need — product type, quantity, and specifications." },
  { icon: MagnifyingGlass, title: "We Search Suppliers", desc: "Our team scouts verified factories and compares options for you." },
  { icon: ShieldCheck, title: "Quality Verification", desc: "We inspect samples and verify production quality on-site." },
  { icon: Handshake, title: "We Negotiate", desc: "We secure the best prices and terms on your behalf." },
  { icon: Truck, title: "Shipment to You", desc: "Full logistics — from factory floor to your warehouse door." },
];

const HowItWorksSection = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".step-item", {
        scrollTrigger: { trigger: ".steps-container", start: "top 80%" },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      });
      gsap.from(".step-line", {
        scrollTrigger: { trigger: ".steps-container", start: "top 80%" },
        scaleX: 0,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.3,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={ref} className="section-padding gradient-dark">
      <div className="container-narrow">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Process</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
        </div>

        <div className="steps-container relative mt-16">
          {/* Connecting line (desktop) */}
          <div className="step-line absolute left-0 right-0 top-8 hidden h-[2px] origin-left gradient-primary lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <div key={s.title} className="step-item relative text-center">
                {/* Node */}
                <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full glass border border-primary/30">
                  <s.icon size={28} weight="light" className="text-primary" />
                </div>
                <div className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
                  Step {i + 1}
                </div>
                <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
