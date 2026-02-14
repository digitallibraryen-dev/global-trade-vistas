import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "@phosphor-icons/react";
import ParallaxOrbs from "./ParallaxOrbs";

gsap.registerPlugin(ScrollTrigger);

const posts = [
  {
    title: "How to Choose a Reliable Supplier in China",
    excerpt: "Learn the key indicators of trustworthy manufacturers and avoid common pitfalls in supplier selection.",
    tag: "Sourcing",
  },
  {
    title: "Difference Between FOB and CIF",
    excerpt: "Understanding Incoterms is essential for international trade. We break down the two most common terms.",
    tag: "Logistics",
  },
  {
    title: "Common Mistakes in Importing from China",
    excerpt: "From skipping quality inspections to misunderstanding tariffs — avoid these costly errors.",
    tag: "Guide",
  },
];

const BlogSection = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".blog-card", {
        scrollTrigger: { trigger: ".blog-grid", start: "top 80%" },
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="blog" ref={ref} className="relative section-padding gradient-dark">
      <ParallaxOrbs variant="accent" />
      <div className="container-narrow relative z-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Resources</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trade Insights & Guides
          </h2>
        </div>

        <div className="blog-grid mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.title}
              className="blog-card group glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:glow-primary cursor-pointer"
            >
              <span className="inline-block rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {p.tag}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground leading-snug">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
                Read more <ArrowRight size={14} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
