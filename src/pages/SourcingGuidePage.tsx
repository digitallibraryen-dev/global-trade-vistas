import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";

const SourcingGuidePage = () => {
  const { t } = useTranslation();
  const sections = t("sourcingGuidePage.sections", { returnObjects: true }) as { title: string; content: string }[];

  return (
    <>
      <Navbar />
      <PageHeader tag={t("sourcingGuidePage.tag")} title={t("sourcingGuidePage.title")} subtitle={t("sourcingGuidePage.subtitle")} />
      <main className="section-padding">
        <div className="container-narrow max-w-3xl mx-auto">
          <ScrollReveal animation="card" stagger={0.1} className="space-y-8">
            {sections?.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-2">{i + 1}. {s.title}</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{s.content}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default SourcingGuidePage;
