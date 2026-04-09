import { useState, useCallback, lazy, Suspense } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutPreview from "@/components/AboutPreview";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import WeChatButton from "@/components/WeChatButton";
import CookieConsent from "@/components/CookieConsent";

// Lazy-load below-the-fold sections
const OurImpactSection = lazy(() => import("@/components/OurImpactSection"));
const ServiceProcessSection = lazy(() => import("@/components/ServiceProcessSection"));
const BentoGridSection = lazy(() => import("@/components/BentoGridSection"));
const HowItWorksSection = lazy(() => import("@/components/HowItWorksSection"));
const FeaturedServicesSection = lazy(() => import("@/components/FeaturedServicesSection"));
const Carousel3DSection = lazy(() => import("@/components/Carousel3DSection"));
const ProductsSection = lazy(() => import("@/components/ProductsSection"));
const WhyChooseSection = lazy(() => import("@/components/WhyChooseSection"));
const MiddleEastMapSection = lazy(() => import("@/components/MiddleEastMapSection"));
const TrustedPartnersSlider = lazy(() => import("@/components/TrustedPartnersSlider"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));

const SectionFallback = () => (
  <div className="h-40 flex items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <Preloader onComplete={handlePreloaderComplete} />}
      <div className={loaded ? "opacity-100" : "opacity-0"}>
        <Navbar />
        <main>
          <HeroSection />
          <AboutPreview />
          <Suspense fallback={<SectionFallback />}>
            <OurImpactSection />
            <ServiceProcessSection />
            <BentoGridSection />
            <HowItWorksSection />
            <FeaturedServicesSection />
            <Carousel3DSection />
            <ProductsSection />
            <WhyChooseSection />
            <MiddleEastMapSection />
            <TrustedPartnersSlider />
            <ReviewsSection />
            <FAQSection />
          </Suspense>
        </main>
        <Footer />
        <WhatsAppButton />
        <WeChatButton />
        <CookieConsent />
      </div>
    </>
  );
};

export default Index;
