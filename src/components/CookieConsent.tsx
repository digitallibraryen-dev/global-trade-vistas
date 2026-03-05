import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

const CookieConsent = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookie("almonesi_consent")) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setCookie("almonesi_consent", "accepted", 365);
    setVisible(false);
  };

  const handleDecline = () => {
    setCookie("almonesi_consent", "declined", 30);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] flex justify-center animate-in slide-in-from-bottom-4 duration-400">
      <div className="w-full max-w-md rounded-xl border border-border/60 bg-card/95 backdrop-blur-md shadow-lg px-4 py-3 flex items-start gap-3">
        {/* Icon */}
        <div className="mt-0.5 shrink-0">
          <Cookie size={18} className="text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("cookies.message")}{" "}
            <Link to="/privacy" className="text-primary underline-offset-2 hover:underline">
              {t("cookies.privacyPolicy")}
            </Link>
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-2">
            <Button
              size="sm"
              onClick={handleAccept}
              className="h-7 px-3 text-xs font-medium"
            >
              {t("cookies.accept")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecline}
              className="h-7 px-3 text-xs text-muted-foreground hover:text-foreground"
            >
              {t("cookies.decline")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
