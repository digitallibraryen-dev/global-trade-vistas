import { useTranslation } from "react-i18next";
import logo from "@/assets/logo.png";
import SocialIcons from "./SocialIcons";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border px-4 py-12 sm:px-6 lg:px-8" style={{ backgroundColor: '#003f7f' }}>
      <div className="container-narrow">
        {/* Tagline */}
        <div className="text-center mb-8">
          <p className="text-sm text-white/70 leading-relaxed max-w-xl mx-auto">
            {t("footer.tagline")}
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            {t("footer.partner")}
          </p>
        </div>

        {/* Legal Entity */}
        <div className="text-center mb-6 border-t border-white/10 pt-6">
          <p className="text-xs text-white/50">{t("footer.operatedBy")}</p>
          <p className="text-sm font-semibold text-white/80 mt-1">杭州穆尼溪科技有限公司</p>
          <p className="text-xs text-white/60">HANGZHOU ALMONESI TECHNOLOGY CO., LTD.</p>
          <p className="text-xs text-white/40 mt-1">{t("footer.legalNote")}</p>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3 text-sm text-white/70">
            <img src={logo} alt="Almonesi Logo" className="h-8 w-auto object-contain" />
            <div>
              <span className="font-semibold text-white">Almonesi</span>
              <span className="mx-1 text-white/40">·</span>
              <span className="text-xs text-white/70">OMT</span>
            </div>
            <span className="text-white/40">|</span>
            <span>© {new Date().getFullYear()} {t("footer.rights")}</span>
          </div>
          <div className="flex items-center gap-6">
            <SocialIcons size={18} />
            {[t("footer.privacy"), t("footer.terms")].map((l) => (
              <a key={l} href="#" className="text-xs text-white/60 transition-colors hover:text-white">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
