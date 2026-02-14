import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EnvelopeSimple, Phone, MapPin, WhatsappLogo } from "@phosphor-icons/react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const ContactPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ full_name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const { data: links } = useSocialLinks();
  const whatsapp = links?.find((l) => l.platform === "whatsapp");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert(form as any);
    setSending(false);
    if (error) {
      toast.error("Failed to send message");
    } else {
      toast.success(t("contactPage.success"));
      setForm({ full_name: "", email: "", subject: "", message: "" });
    }
  };

  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp.value.replace(/[^0-9+]/g, "").replace("+", "")}?text=${encodeURIComponent("Hello Almonesi Global Trade (OMT), I would like to get in touch.")}`
    : null;

  return (
    <>
      <Navbar />
      <PageHeader tag={t("contactPage.tag")} title={t("contactPage.title")} subtitle={t("contactPage.subtitle")} />
      <main className="section-padding">
        <div className="container-narrow max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: '#003f7f' }}>
                  <MapPin size={24} weight="light" className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t("contactPage.office")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t("contactPage.address")}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: '#003f7f' }}>
                  <EnvelopeSimple size={24} weight="light" className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t("contactPage.emailLabel")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">info@almonesi.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: '#003f7f' }}>
                  <Phone size={24} weight="light" className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t("contactPage.phoneLabel")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">+86 195 6490 6074</p>
                </div>
              </div>
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                >
                  <WhatsappLogo size={20} /> {t("contactPage.whatsappBtn")}
                </a>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8 space-y-5">
              <h2 className="text-xl font-bold text-foreground">{t("contactPage.formTitle")}</h2>
              <p className="text-sm text-muted-foreground">{t("contactPage.formSubtitle")}</p>
              <Input
                placeholder={t("contactPage.namePlaceholder")}
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                maxLength={100}
                required
              />
              <Input
                type="email"
                placeholder={t("contactPage.emailPlaceholder")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
                required
              />
              <Input
                placeholder={t("contactPage.subjectPlaceholder")}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                maxLength={200}
                required
              />
              <Textarea
                placeholder={t("contactPage.messagePlaceholder")}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={2000}
                rows={5}
                required
              />
              <Button type="submit" disabled={sending} className="w-full">
                {sending ? t("contactPage.sending") : t("contactPage.send")}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default ContactPage;
