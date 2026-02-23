import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Helmet } from "react-helmet-async";

const TermsPage = () => {
  const { t } = useTranslation();

  const sections = [
    { title: t("termsPage.intro.title"), content: t("termsPage.intro.content") },
    { title: t("termsPage.services.title"), content: t("termsPage.services.content") },
    { title: t("termsPage.clientResponsibilities.title"), content: t("termsPage.clientResponsibilities.content") },
    { title: t("termsPage.payment.title"), content: t("termsPage.payment.content") },
    { title: t("termsPage.liability.title"), content: t("termsPage.liability.content") },
    { title: t("termsPage.shipping.title"), content: t("termsPage.shipping.content") },
    { title: t("termsPage.ip.title"), content: t("termsPage.ip.content") },
    { title: t("termsPage.governingLaw.title"), content: t("termsPage.governingLaw.content") },
    { title: t("termsPage.contact.title"), content: t("termsPage.contact.content") },
  ];

  return (
    <>
      <Helmet>
        <title>{t("termsPage.metaTitle")}</title>
      </Helmet>
      <Navbar />
      <main className="min-h-screen pt-20">
        <PageHeader tag={t("termsPage.tag")} title={t("termsPage.title")} />
        <div className="container-narrow section-padding">
          <div className="mx-auto max-w-3xl space-y-8">
            <p className="text-sm text-muted-foreground">{t("termsPage.lastUpdated")}</p>
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-lg font-semibold text-foreground mb-2">{i + 1}. {section.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsPage;
