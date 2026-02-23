import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import SocialIcons from "./SocialIcons";
import { Envelope, MapPin } from "@phosphor-icons/react";

const Footer = () => {
  const { t } = useTranslation();

  const companyLinks = [
    { label: t("footer.aboutUs"), to: "/about-us" },
    { label: t("footer.ourServices"), to: "/services" },
    { label: t("footer.whyChooseUs"), to: "/why-us" },
    { label: t("footer.ourProcess"), to: "/how-it-works" },
    { label: t("footer.contactUs"), to: "/contact" },
  ];

  const serviceLinks = [
    { label: t("footer.chinaSourcing"), to: "/services" },
    { label: t("footer.supplierVerification"), to: "/supplier-verification" },
    { label: t("footer.qualityInspection"), to: "/quality-inspection" },
    { label: t("footer.privateLabeling"), to: "/private-labeling" },
    { label: t("footer.logisticsShipping"), to: "/logistics-shipping" },
    { label: t("footer.productResearch"), to: "/product-research" },
  ];

  const marketLinks = [
    { label: t("footer.middleEast"), to: "/markets" },
    { label: t("footer.saudiArabia"), to: "/markets" },
    { label: t("footer.uae"), to: "/markets" },
    { label: t("footer.qatar"), to: "/markets" },
    { label: t("footer.kuwait"), to: "/markets" },
    { label: t("footer.oman"), to: "/markets" },
    { label: t("footer.bahrain"), to: "/markets" },
    { label: t("footer.jordan"), to: "/markets" },
    { label: t("footer.iraq"), to: "/markets" },
    { label: t("footer.yemen"), to: "/markets" },
    { label: t("footer.egypt"), to: "/markets" },
    { label: t("footer.lebanon"), to: "/markets" },
    { label: t("footer.syria"), to: "/markets" },
    { label: t("footer.palestine"), to: "/markets" },
    { label: t("footer.sudan"), to: "/markets" },
    { label: t("footer.libya"), to: "/markets" },
    { label: t("footer.tunisia"), to: "/markets" },
    { label: t("footer.algeria"), to: "/markets" },
    { label: t("footer.morocco"), to: "/markets" },
    { label: t("footer.mauritania"), to: "/markets" },
    { label: t("footer.somalia"), to: "/markets" },
    { label: t("footer.djibouti"), to: "/markets" },
    { label: t("footer.comoros"), to: "/markets" },
    { label: t("footer.turkey"), to: "/markets" },
  ];

  const resourceLinks = [
    { label: t("footer.blog"), to: "/blog" },
    { label: t("footer.industryInsights"), to: "/blog" },
    { label: t("footer.importGuide"), to: "/import-guide" },
    { label: t("footer.faqs"), to: "/faq" },
    { label: t("footer.sourcingGuide"), to: "/sourcing-guide" },
  ];

  const legalLinks = [
    { label: t("footer.terms"), to: "/terms" },
    { label: t("footer.privacy"), to: "/privacy" },
  ];

  return (
    <footer className="border-t border-border" style={{ backgroundColor: '#003f7f' }}>
      {/* Main footer columns */}
      <div className="container-narrow px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* Top: Logo + tagline */}
        <div className="mb-10 flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Almonesi Logo" className="h-9 w-auto object-contain" />
            <div>
              <span className="text-lg font-bold text-white tracking-wide">Almonesi</span>
              <span className="mx-1.5 text-white/30">·</span>
              <span className="text-xs font-medium text-white/60">OMT</span>
            </div>
          </div>
          <p className="text-sm text-white/60 max-w-md leading-relaxed">
            {t("footer.tagline")}
          </p>
          <div className="mt-1">
            <SocialIcons size={18} />
          </div>
        </div>

        {/* Columns grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {/* Company */}
          <FooterColumn title={t("footer.companyCol")}>
            {companyLinks.map((link) => (
              <FooterLink key={link.label} to={link.to}>{link.label}</FooterLink>
            ))}
          </FooterColumn>

          {/* Services */}
          <FooterColumn title={t("footer.servicesCol")}>
            {serviceLinks.map((link) => (
              <FooterLink key={link.label} to={link.to}>{link.label}</FooterLink>
            ))}
          </FooterColumn>

          {/* Markets */}
          <FooterColumn title={t("footer.marketsCol")}>
            {marketLinks.map((link) => (
              <FooterLink key={link.label} to={link.to}>{link.label}</FooterLink>
            ))}
          </FooterColumn>

          {/* Resources */}
          <FooterColumn title={t("footer.resourcesCol")}>
            {resourceLinks.map((link) => (
              <FooterLink key={link.label} to={link.to}>{link.label}</FooterLink>
            ))}
          </FooterColumn>

          {/* Legal */}
          <FooterColumn title={t("footer.legalCol")}>
            {legalLinks.map((link) => (
              <FooterLink key={link.label} to={link.to}>{link.label}</FooterLink>
            ))}
          </FooterColumn>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-narrow px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Almonesi. {t("footer.rights")}
          </p>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4 text-xs text-white/50">
            <span className="inline-flex items-center gap-1.5">
              <Envelope size={14} className="text-white/40" />
              {t("footer.email")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-white/40" />
              {t("footer.location")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">{title}</h4>
    <ul className="space-y-2.5">{children}</ul>
  </div>
);

const FooterLink = ({ to, children }: { to?: string; children: React.ReactNode }) => {
  const cls = "text-[13px] text-white/55 transition-colors duration-200 hover:text-white";
  if (to) {
    return (
      <li>
        <Link to={to} className={cls}>{children}</Link>
      </li>
    );
  }
  return (
    <li>
      <span className={cls + " cursor-default"}>{children}</span>
    </li>
  );
};

export default Footer;
