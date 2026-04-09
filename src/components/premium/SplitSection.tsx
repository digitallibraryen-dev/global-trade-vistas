import ScrollReveal from "@/components/ScrollReveal";

interface SplitSectionProps {
  tag?: string;
  title: string;
  text: string;
  image?: string;
  reverse?: boolean;
  children?: React.ReactNode;
  dark?: boolean;
}

const SplitSection = ({ tag, title, text, image, reverse, children, dark }: SplitSectionProps) => (
  <section className={`section-padding overflow-hidden ${dark ? "gradient-dark" : ""}`}>
    <div className={`container-narrow grid gap-12 lg:gap-20 items-center lg:grid-cols-2 ${reverse ? "direction-reverse" : ""}`}>
      <ScrollReveal animation={reverse ? "slide-left" : "slide-right"}>
        <div className={reverse ? "lg:order-2" : ""}>
          {tag && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">{tag}</p>}
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">{title}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{text}</p>
          {children}
        </div>
      </ScrollReveal>
      {image && (
        <ScrollReveal animation={reverse ? "slide-right" : "slide-left"}>
          <div className={`relative rounded-2xl overflow-hidden group ${reverse ? "lg:order-1" : ""}`}>
            <img src={image} alt={title} loading="lazy" className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </ScrollReveal>
      )}
    </div>
  </section>
);

export default SplitSection;
