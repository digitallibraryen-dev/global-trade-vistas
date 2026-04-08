import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { List, X, Sun, Moon, SignIn, SignOut, GearSix, UserCircle, CaretDown } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenMobileDropdown(null);
  }, [location.pathname]);

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
            className="btn-3d rounded-lg gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-shadow hover:glow-primary"
          >
            {t("nav.getQuote")}
          </button>
          {user ? (
            <>
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="btn-3d flex items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <GearSix size={16} /> {t("nav.dashboard")}
                </button>
              )}
              <button
                onClick={() => navigate("/account")}
                className="btn-3d flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
              >
                <UserCircle size={16} />
              </button>
              <button
                onClick={() => signOut()}
                className="btn-3d flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
              >
                <SignOut size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="btn-3d flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
            >
              <SignIn size={16} /> {t("nav.signIn")}
            </button>
          )}
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
            className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <List size={24} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile tray – animated */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-x-0 top-16 glass-strong border-t border-border p-4 lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.06, ease: [0.4, 0, 0.2, 1] }}
                >
                  <button
                    onClick={() => toggleMobileDropdown(item.key)}
                    className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {item.label}
                    <motion.span
                      animate={{ rotate: openMobileDropdown === item.key ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <CaretDown size={16} className="text-muted-foreground" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openMobileDropdown === item.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 flex flex-col gap-0.5 border-l-2 border-primary/20 pl-3 pb-2">
                          {item.children.map((child, cIdx) => (
                            <motion.button
                              key={child.key}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: cIdx * 0.04 }}
                              onClick={() => goTo(child.href)}
                              className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                                isActive(child.href)
                                  ? "text-primary bg-primary/5"
                                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                              }`}
                            >
                              {child.label}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                className="mt-3 border-t border-border pt-3 flex flex-col gap-2"
              >
                <button
                  onClick={() => goTo("/contact")}
                  className="btn-3d rounded-lg gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
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
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* ── Desktop hover dropdown with animation ── */
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
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <CaretDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute left-0 top-full pt-1 z-[60]"
          >
            <div className="min-w-[200px] rounded-xl border border-border bg-popover p-1.5 shadow-lg">
              {item.children.map((child, idx) => (
                <motion.button
                  key={child.key}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: idx * 0.03 }}
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
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
