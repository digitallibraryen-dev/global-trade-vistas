import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { hasAnalyticsConsent } from "@/components/CookieConsent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const useGAPageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (hasAnalyticsConsent() && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);
};

export default useGAPageTracking;
