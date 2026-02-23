import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      setVisible(true);
    }
  }, []);

  const accept = () => {
    setCookie("almonesi_consent", "accepted", 365);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
        <Cookie size={28} className="text-primary shrink-0" />
        <p className="text-sm text-muted-foreground text-center sm:text-left flex-1">
          We use cookies to improve your experience and track site analytics. By continuing, you agree to our use of cookies.
        </p>
        <Button onClick={accept} size="sm" className="shrink-0">
          Accept
        </Button>
      </div>
    </div>
  );
};

export default CookieConsent;
