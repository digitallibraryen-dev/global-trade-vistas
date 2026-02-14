import { useTranslation } from "react-i18next";
import logo from "@/assets/logo.png";
import SocialIcons from "./SocialIcons";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6 lg:px-8">
      <div className="container-narrow flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <img src={logo} alt="Almonesi Logo" className="h-8 w-auto object-contain" />
          © {new Date().getFullYear()} Almonesi Global Trade. {t("footer.rights")}
        </div>
        <div className="flex items-center gap-6">
          <SocialIcons size={18} />
          {[t("footer.privacy"), t("footer.terms")].map((l) => (
            <a key={l} href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
