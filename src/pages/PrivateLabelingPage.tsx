import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CinematicHero from "@/components/premium/CinematicHero";
import ProcessTimeline from "@/components/premium/ProcessTimeline";
import SplitSection from "@/components/premium/SplitSection";
import FullWidthCTA from "@/components/premium/FullWidthCTA";
import heroImg from "@/assets/pages/hero-privatelabel.jpg";
import qualityImg from "@/assets/pages/hero-quality.jpg";

const PrivateLabelingPage = () => {
  const { t } = useTranslation();
  const steps = t("privateLabelingPage.steps", { returnObjects: true }) as { title: string; desc: string }[];

  return (
    <>
      <Navbar />
      <CinematicHero
        tag={t("privateLabelingPage.tag")}
        title={t("privateLabelingPage.title")}
        subtitle={t("privateLabelingPage.subtitle")}
        image={heroImg}
      />

      <SplitSection
        tag="Your Brand, Our Expertise"
        title="From Concept to Shelf"
        text={t("privateLabelingPage.intro")}
        image={qualityImg}
      />

      <ProcessTimeline
        tag="The Journey"
        title="How We Build Your Brand"
        subtitle="A complete private labeling workflow from design to delivery."
        steps={steps?.map((s) => ({ title: s.title, desc: s.desc })) || []}
      />

      <FullWidthCTA title="Launch your own brand from China" buttonLabel={t("hero.cta1")} href="/contact" />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default PrivateLabelingPage;
