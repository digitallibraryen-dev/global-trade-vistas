import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Blog", href: "#blog" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container-narrow flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
          <img src={logo} alt="Almonesi Logo" className="h-9 w-auto object-contain drop-shadow-[0_0_6px_hsl(var(--glow-primary)/0.4)]" />
          <span className="gradient-primary bg-clip-text text-transparent">Almonesi</span>
          <span className="text-sm font-normal text-muted-foreground">Global Trade</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("#quote")}
            className="rounded-lg gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-shadow hover:glow-primary"
          >
            Get a Quote
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      {/* Mobile tray */}
      {open && (
        <div className="absolute inset-x-0 top-16 glass-strong border-t border-border p-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-left text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("#quote")}
              className="mt-2 rounded-lg gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Get a Quote
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
