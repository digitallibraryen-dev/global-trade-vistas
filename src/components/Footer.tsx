import { useTranslation } from "react-i18next";
import logo from "@/assets/logo.png";
import SocialIcons from "./SocialIcons";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
      <div className="container-narrow">
        {/* Tagline */}
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {t("footer.tagline")}
          </p>
          <p className="mt-2 text-sm font-semibold text-primary">
            {t("footer.partner")}
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <img src={logo} alt="Almonesi Logo" className="h-8 w-auto object-contain" />
            <div>
              <span className="font-semibold text-foreground">Almonesi</span>
              <span className="mx-1 text-muted-foreground/60">·</span>
              <span className="text-xs text-muted-foreground">OMT</span>
            </div>
            <span className="text-muted-foreground/60">|</span>
            <span>© {new Date().getFullYear()} {t("footer.rights")}</span>
          </div>
          <div className="flex items-center gap-6">
            <SocialIcons size={18} />
            {[t("footer.privacy"), t("footer.terms")].map((l) => (
              <a key={l} href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
