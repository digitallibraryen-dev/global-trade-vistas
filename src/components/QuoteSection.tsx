import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParallaxOrbs from "./ParallaxOrbs";

gsap.registerPlugin(ScrollTrigger);

const QuoteSection = () => {
  const ref = useRef<HTMLElement>(null);
  const [form, setForm] = useState({
    product: "",
    quantity: "",
    destination: "",
    shipping: "",
    budget: "",
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".quote-field", {
        scrollTrigger: { trigger: ".quote-form", start: "top 80%" },
        opacity: 0,
        x: -30,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section id="quote" ref={ref} className="relative section-padding">
      <ParallaxOrbs variant="mixed" />
      <div className="container-narrow max-w-2xl relative z-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Get Started
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Request a Quote
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tell us about your sourcing needs and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="quote-form mt-10 glass rounded-2xl p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { name: "product", label: "Product Type", placeholder: "e.g. Electronics, Textiles" },
              { name: "quantity", label: "Quantity", placeholder: "e.g. 1,000 units" },
              { name: "destination", label: "Destination Country", placeholder: "e.g. Germany" },
              { name: "shipping", label: "Shipping Method", placeholder: "Sea / Air / Rail" },
            ].map((f) => (
              <div key={f.name} className="quote-field">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {f.label}
                </label>
                <input
                  type="text"
                  name={f.name}
                  value={(form as any)[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>
            ))}
            <div className="quote-field sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Approximate Budget
              </label>
              <input
                type="text"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="e.g. $5,000 - $10,000"
                className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>
          <button className="quote-field btn-3d mt-6 w-full rounded-lg gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(215_80%_50%/0.4)] active:scale-[0.98]">
            Submit Request
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
