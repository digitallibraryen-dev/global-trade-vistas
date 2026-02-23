import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookie("almonesi_consent")) {
      const timer = setTimeout(() => setVisible(true), 1000);
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
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 animate-in slide-in-from-bottom-6 duration-500">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 pt-5 pb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Shield size={20} className="text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">We Value Your Privacy</h3>
          </div>

          {/* Body */}
          <div className="px-6 pb-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              By clicking <strong>"Accept All"</strong>, you consent to our use of cookies. You can manage your 
              preferences or learn more in our{" "}
              <Link to="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
                Privacy Policy
              </Link>.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecline}
              className="text-muted-foreground hover:text-foreground"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="font-semibold"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
