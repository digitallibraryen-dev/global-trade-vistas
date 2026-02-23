import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { List, X, Sun, Moon, SignIn, SignOut, GearSix, UserCircle, CaretDown } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo.png";
import SocialIcons from "./SocialIcons";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavItem {
  key: string;
  label: string;
  children: { key: string; label: string; href: string }[];
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const { t } = useTranslation();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const goTo = (href: string) => {
    setMobileOpen(false);
    setOpenMobileDropdown(null);
    navigate(href);
  };

  const navItems: NavItem[] = [
    {
      key: "company",
      label: t("nav.company", "Company"),
      children: [
        { key: "about", label: t("nav.about"), href: "/about-us" },
        { key: "services", label: t("nav.services"), href: "/services" },
        { key: "whyUs", label: t("nav.whyUs", "Why Us"), href: "/why-us" },
        { key: "howItWorks", label: t("nav.howItWorks"), href: "/how-it-works" },
        { key: "contact", label: t("nav.contact"), href: "/contact" },
      ],
    },
    {
      key: "services",
      label: t("nav.servicesMenu", "Services"),
      children: [
        { key: "sourcingFromChina", label: t("nav.sourcingFromChina", "Sourcing from China"), href: "/sourcing-guide" },
        { key: "supplierVerification", label: t("nav.supplierVerification", "Supplier Verification"), href: "/supplier-verification" },
        { key: "qualityInspection", label: t("nav.qualityInspection", "Quality Inspection"), href: "/quality-inspection" },
        { key: "privateLabeling", label: t("nav.privateLabeling", "Private Labeling"), href: "/private-labeling" },
        { key: "logisticsShipping", label: t("nav.logisticsShipping", "Logistics & Shipping"), href: "/logistics-shipping" },
        { key: "productResearch", label: t("nav.productResearch", "Product Research"), href: "/product-research" },
      ],
    },
    {
      key: "markets",
      label: t("nav.markets", "Markets"),
      children: [
        { key: "middleEast", label: t("nav.middleEast", "Middle East"), href: "/markets" },
      ],
    },
    {
      key: "resources",
      label: t("nav.resources", "Resources"),
      children: [
        { key: "blog", label: t("nav.blog"), href: "/blog" },
        { key: "industryInsights", label: t("nav.industryInsights", "Industry Insights"), href: "/blog" },
        { key: "importGuide", label: t("nav.importGuide", "Import Guide"), href: "/import-guide" },
        { key: "faq", label: t("nav.faq"), href: "/faq" },
        { key: "sourcingGuide", label: t("nav.sourcingGuide", "Sourcing Guide"), href: "/sourcing-guide" },
      ],
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  const toggleMobileDropdown = (key: string) => {
    setOpenMobileDropdown((prev) => (prev === key ? null : key));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container-narrow flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground cursor-pointer"
        >
          <img
            src={logo}
            alt="Almonesi Logo"
            className="h-9 w-auto object-contain drop-shadow-[0_0_6px_hsl(var(--glow-primary)/0.4)]"
          />
          <span className="gradient-primary bg-clip-text text-transparent">Almonesi</span>
          <span className="text-sm font-normal text-muted-foreground hidden sm:inline">Global Trade</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <DesktopDropdown key={item.key} item={item} goTo={goTo} isActive={isActive} />
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
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
                  className="flex items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <GearSix size={16} /> {t("nav.dashboard")}
                </button>
              )}
              <button
                onClick={() => navigate("/account")}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
              >
                <UserCircle size={16} />
              </button>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
              >
                <SignOut size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
            >
              <SignIn size={16} /> {t("nav.signIn")}
            </button>
          )}
          <SocialIcons size={18} />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile tray */}
      {mobileOpen && (
        <div className="absolute inset-x-0 top-16 glass-strong border-t border-border p-4 lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.key}>
                <button
                  onClick={() => toggleMobileDropdown(item.key)}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  {item.label}
                  <CaretDown
                    size={16}
                    className={`text-muted-foreground transition-transform duration-200 ${openMobileDropdown === item.key ? "rotate-180" : ""}`}
                  />
                </button>
                {openMobileDropdown === item.key && (
                  <div className="ml-4 flex flex-col gap-0.5 border-l-2 border-primary/20 pl-3 pb-2">
                    {item.children.map((child) => (
                      <button
                        key={child.key}
                        onClick={() => goTo(child.href)}
                        className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                          isActive(child.href)
                            ? "text-primary bg-primary/5"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="mt-3 border-t border-border pt-3 flex flex-col gap-2">
              <button
                onClick={() => goTo("/contact")}
                className="rounded-lg gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
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
                    onClick={() => { setMobileOpen(false); signOut(); }}
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
        </div>
      )}
    </nav>
  );
};

/* ── Desktop hover dropdown ── */
const DesktopDropdown = ({
  item,
  goTo,
  isActive,
}: {
  item: NavItem;
  goTo: (href: string) => void;
  isActive: (href: string) => boolean;
}) => {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const ref = useRef<HTMLDivElement>(null);

  const enter = () => {
    clearTimeout(timeout.current);
    setOpen(true);
  };
  const leave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => () => clearTimeout(timeout.current), []);

  const anyChildActive = item.children.some((c) => isActive(c.href));

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <button
        className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          anyChildActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        }`}
      >
        {item.label}
        <CaretDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full pt-1 z-[60]">
          <div className="min-w-[200px] rounded-xl border border-border bg-popover p-1.5 shadow-lg">
            {item.children.map((child) => (
              <button
                key={child.key}
                onClick={() => {
                  setOpen(false);
                  goTo(child.href);
                }}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  isActive(child.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {child.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
