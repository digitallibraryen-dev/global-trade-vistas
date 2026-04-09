import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

interface FullWidthCTAProps {
  title: string;
  subtitle?: string;
  buttonLabel: string;
  href?: string;
  onClick?: () => void;
}

const FullWidthCTA = ({ title, subtitle, buttonLabel, href, onClick }: FullWidthCTAProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick();
    if (href) navigate(href);
  };

  return (
    <section className="section-padding gradient-dark">
      <div className="container-narrow text-center">
        <ScrollReveal animation="headline">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{title}</h2>
          {subtitle && <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{subtitle}</p>}
          <button
            onClick={handleClick}
            className="btn-3d mt-8 inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary/90 px-10 py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors"
          >
            {buttonLabel}
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FullWidthCTA;
