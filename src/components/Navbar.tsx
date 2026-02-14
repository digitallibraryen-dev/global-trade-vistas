import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { List, X, Sun, Moon, SignIn, SignOut, GearSix, UserCircle } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo.png";
import SocialIcons from "./SocialIcons";
import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
  { key: "about", href: "/about-us" },
  { key: "services", href: "/services" },
  { key: "howItWorks", href: "/how-it-works" },
  { key: "blog", href: "/blog" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const { t } = useTranslation();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const goTo = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container-narrow flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <a onClick={() => navigate("/")} className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground cursor-pointer">
          <img src={logo} alt="Almonesi Logo" className="h-9 w-auto object-contain drop-shadow-[0_0_6px_hsl(var(--glow-primary)/0.4)]" />
          <span className="gradient-primary bg-clip-text text-transparent">Almonesi</span>
          <span className="text-sm font-normal text-muted-foreground">Global Trade</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => goTo(l.href)}
              className={`text-sm font-medium transition-colors ${isActive(l.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t(`nav.${l.key}`)}
            </button>
          ))}
          <LanguageSwitcher />
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => goTo("/contact")}
            className="rounded-lg gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-shadow hover:glow-primary"
          >
            {t("nav.getQuote")}
          </button>
          {user ? (
            <>
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-1.5 rounded-lg border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <GearSix size={16} /> {t("nav.dashboard")}
                </button>
              )}
              <button
                onClick={() => navigate("/account")}
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
              >
                <UserCircle size={16} /> {t("nav.myAccount")}
              </button>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
              >
                <SignOut size={16} /> {t("nav.signOut")}
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
            >
              <SignIn size={16} /> {t("nav.signIn")}
            </button>
          )}
          <SocialIcons size={18} />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="text-foreground"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile tray */}
      {open && (
        <div className="absolute inset-x-0 top-16 glass-strong border-t border-border p-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => goTo(l.href)}
                className={`text-left text-base font-medium transition-colors ${isActive(l.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t(`nav.${l.key}`)}
              </button>
            ))}
            <button
              onClick={() => goTo("/contact")}
              className="mt-2 rounded-lg gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              {t("nav.getQuote")}
            </button>
            {user ? (
              <>
                {isAdmin && (
                  <button
                    onClick={() => goTo("/admin")}
                    className="flex items-center gap-1.5 rounded-lg border border-primary/30 px-5 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    <GearSix size={16} /> {t("nav.dashboard")}
                  </button>
                )}
                <button
                  onClick={() => goTo("/account")}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <UserCircle size={16} /> {t("nav.myAccount")}
                </button>
                <button
                  onClick={() => { setOpen(false); signOut(); }}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <SignOut size={16} /> {t("nav.signOut")}
                </button>
              </>
            ) : (
              <button
                onClick={() => goTo("/login")}
                className="flex items-center gap-1.5 rounded-lg border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <SignIn size={16} /> {t("nav.signIn")}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
