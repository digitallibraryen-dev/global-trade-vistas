import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Medal,
  CurrencyDollar,
  ShieldCheck,
  Lightning,
  Headset,
  GlobeHemisphereWest,
} from "@phosphor-icons/react";

const items = [
  { icon: Medal, key: "experience" },
  { icon: CurrencyDollar, key: "pricing" },
  { icon: ShieldCheck, key: "reliability" },
  { icon: Lightning, key: "execution" },
  { icon: Headset, key: "support" },
  { icon: GlobeHemisphereWest, key: "coverage" },
];

const WhyChooseSection = () => {
  const { t } = useTranslation();

  return (
    <section id="why-choose" className="section-padding">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("whyChoose.tag")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("whyChoose.title")}</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-strong rounded-xl p-6 text-center group hover:scale-[1.03] transition-all duration-300"
            >
              <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:glow-primary transition-shadow duration-300">
                <item.icon size={28} className="text-primary" weight="duotone" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t(`whyChoose.items.${item.key}.title`)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(`whyChoose.items.${item.key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
