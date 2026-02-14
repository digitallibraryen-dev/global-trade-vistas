import { useState, useCallback } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import ServicesSection from "@/components/ServicesSection";
import ServiceProcessSection from "@/components/ServiceProcessSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import QuoteSection from "@/components/QuoteSection";
import BlogSection from "@/components/BlogSection";
import ProductsSection from "@/components/ProductsSection";
import ReviewsSection from "@/components/ReviewsSection";
import KnowledgeHubSection from "@/components/KnowledgeHubSection";
import TrustedBySection from "@/components/TrustedBySection";
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
          <AboutSection />
          <WhyChooseUsSection />
          <ServicesSection />
          <ServiceProcessSection />
          <HowItWorksSection />
          <ProductsSection />
          <ReviewsSection />
          <QuoteSection />
          <KnowledgeHubSection />
          <TrustedBySection />
          <BlogSection />
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
