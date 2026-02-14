import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Star,
  Handshake,
  GlobeHemisphereWest,
  Lightbulb,
  RocketLaunch,
  Buildings,
  UsersThree,
  ChartLineUp,
  CheckCircle,
  Scales,
} from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  { icon: Star, key: "quality" },
  { icon: Handshake, key: "trust" },
  { icon: GlobeHemisphereWest, key: "connectivity" },
  { icon: Lightbulb, key: "innovation" },
];

const timeline = [
  { icon: RocketLaunch, key: "founded" },
  { icon: ChartLineUp, key: "growth" },
  { icon: Buildings, key: "expansion" },
  { icon: UsersThree, key: "clients" },
];

const AboutUsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <section className="section-padding gradient-dark">
          <div className="container-narrow text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("aboutPage.tag")}</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{t("aboutPage.title")}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{t("aboutPage.companyName")}</p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding">
          <div className="container-narrow grid gap-8 md:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-strong rounded-xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">{t("aboutPage.missionTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("aboutPage.missionText")}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-strong rounded-xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">{t("aboutPage.visionTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("aboutPage.visionText")}</p>
            </motion.div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section-padding gradient-dark">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t("aboutPage.valuesTitle")}</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v, i) => (
                <motion.div
                  key={v.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-strong rounded-xl p-6 text-center group hover:scale-[1.03] transition-transform duration-300"
                >
                  <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:glow-primary transition-shadow">
                    <v.icon size={28} className="text-primary" weight="duotone" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{t(`aboutPage.values.${v.key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`aboutPage.values.${v.key}.desc`)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Story Timeline */}
        <section className="section-padding">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t("aboutPage.storyTitle")}</h2>
            </div>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-px" />
              {timeline.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`relative flex items-start gap-4 mb-10 ${i % 2 === 1 ? "md:flex-row-reverse md:text-right" : ""}`}
                >
                  <div className="relative z-10 h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center glow-primary md:mx-auto">
                    <item.icon size={24} className="text-primary" weight="duotone" />
                  </div>
                  <div className="glass-strong rounded-xl p-5 flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{t(`aboutPage.story.${item.key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`aboutPage.story.${item.key}.desc`)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Legal Identity & Corporate Compliance */}
        <section className="section-padding gradient-dark">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t("aboutPage.legalTitle")}</h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-strong rounded-xl p-8 max-w-3xl mx-auto text-center"
            >
              <Scales size={40} className="text-primary mx-auto mb-4" weight="duotone" />
              <p className="text-lg font-semibold text-foreground">{t("aboutPage.legalEntityCn")}</p>
              <p className="text-sm font-medium text-primary mt-1">{t("aboutPage.legalEntityEn")}</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">{t("aboutPage.legalText")}</p>
              <p className="mt-3 text-sm text-muted-foreground italic">{t("aboutPage.legalNote")}</p>
            </motion.div>

            {/* Trust Badges */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 max-w-4xl mx-auto">
              {["registered", "compliant", "verified", "transparent", "secure"].map((badge, i) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-2 glass-strong rounded-lg p-3"
                >
                  <CheckCircle size={20} className="text-primary shrink-0" weight="fill" />
                  <span className="text-sm font-medium text-foreground">{t(`aboutPage.trust.${badge}`)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutUsPage;
