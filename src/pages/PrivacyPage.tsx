import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Helmet } from "react-helmet-async";

const PrivacyPage = () => {
  const { t } = useTranslation();

  const sections = [
    { title: t("privacyPage.infoCollect.title"), content: t("privacyPage.infoCollect.content") },
    { title: t("privacyPage.howWeUse.title"), content: t("privacyPage.howWeUse.content") },
    { title: t("privacyPage.dataProtection.title"), content: t("privacyPage.dataProtection.content") },
    { title: t("privacyPage.cookies.title"), content: t("privacyPage.cookies.content") },
    { title: t("privacyPage.thirdParty.title"), content: t("privacyPage.thirdParty.content") },
    { title: t("privacyPage.userRights.title"), content: t("privacyPage.userRights.content") },
    { title: t("privacyPage.contact.title"), content: t("privacyPage.contact.content") },
  ];

  return (
    <>
      <Helmet>
        <title>{t("privacyPage.metaTitle")}</title>
      </Helmet>
      <Navbar />
      <main className="min-h-screen pt-20">
        <PageHeader tag={t("privacyPage.tag")} title={t("privacyPage.title")} />
        <div className="container-narrow section-padding">
          <div className="mx-auto max-w-3xl space-y-8">
            <p className="text-sm text-muted-foreground">{t("privacyPage.lastUpdated")}</p>
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

export default PrivacyPage;
