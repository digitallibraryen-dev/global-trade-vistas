import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";

const ImportGuidePage = () => {
  const { t } = useTranslation();
  const sections = t("importGuidePage.sections", { returnObjects: true }) as { title: string; content: string }[];

  return (
    <>
      <Navbar />
      <PageHeader tag={t("importGuidePage.tag")} title={t("importGuidePage.title")} subtitle={t("importGuidePage.subtitle")} />
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

export default ImportGuidePage;
