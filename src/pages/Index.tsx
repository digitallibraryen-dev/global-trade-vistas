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
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

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
          <ReviewsSection />
          <FAQSection />
          <ContactSection />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
