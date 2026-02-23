import { useState } from "react";
import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import ParallaxOrbs from "./ParallaxOrbs";


const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="relative section-padding gradient-dark">
      <ParallaxOrbs variant="primary" />
      <div className="container-narrow relative z-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("contact.tag")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("contact.title")}</h2>
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">{t("contact.subtitle")}</p>
            {[
              { icon: EnvelopeSimple, text: "info@almonesi.com" },
              { icon: Phone, text: "+86 123 456 7890" },
              { icon: MapPin, text: "Guangzhou, China" },
            ].map((c) => (
              <div key={c.text} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary shadow-lg">
                  <c.icon size={20} weight="light" className="text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">{c.text}</span>
              </div>
            ))}
            
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="space-y-4">
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder={t("contact.namePlaceholder")} className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder={t("contact.emailPlaceholder")} className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
              <textarea name="message" value={form.message} onChange={handleChange} placeholder={t("contact.messagePlaceholder")} rows={4} className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
              <button className="w-full rounded-lg gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(215_80%_50%/0.4)] active:scale-[0.98]">{t("contact.send")}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
