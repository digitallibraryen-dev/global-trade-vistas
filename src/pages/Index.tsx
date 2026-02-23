import { useState, useCallback } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutPreview from "@/components/AboutPreview";
import ServiceProcessSection from "@/components/ServiceProcessSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturedServicesSection from "@/components/FeaturedServicesSection";
import ProductsSection from "@/components/ProductsSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import LiveStatsSection from "@/components/LiveStatsSection";
import MiddleEastMapSection from "@/components/MiddleEastMapSection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import TrustedPartnersSlider from "@/components/TrustedPartnersSlider";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import WeChatButton from "@/components/WeChatButton";

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
          <ServiceProcessSection />
          <HowItWorksSection />
          <FeaturedServicesSection />
          <ProductsSection />
          <WhyChooseSection />
          <LiveStatsSection />
          <MiddleEastMapSection />
          <TrustedPartnersSlider />
          <ReviewsSection />
          <FAQSection />
        </main>
        <Footer />
        <WhatsAppButton />
        <WeChatButton />
      </div>
    </>
  );
};

export default Index;
