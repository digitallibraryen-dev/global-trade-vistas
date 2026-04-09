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
        tag={t("privateLabelingPage.splitTag")}
        title={t("privateLabelingPage.splitTitle")}
        text={t("privateLabelingPage.intro")}
        image={qualityImg}
      />

      <ProcessTimeline
        tag={t("privateLabelingPage.processTag")}
        title={t("privateLabelingPage.processTitle")}
        subtitle={t("privateLabelingPage.processSubtitle")}
        steps={steps?.map((s) => ({ title: s.title, desc: s.desc })) || []}
      />

      <FullWidthCTA title={t("privateLabelingPage.ctaTitle")} buttonLabel={t("hero.cta1")} href="/contact" />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default PrivateLabelingPage;
