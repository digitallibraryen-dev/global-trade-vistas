import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { motion } from "framer-motion";
import { WhatsappLogo } from "@phosphor-icons/react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

const ProductsSection = () => {
  const { t } = useTranslation();
  const { data: socialLinks = [] } = useSocialLinks();
  const whatsapp = socialLinks.find((l) => l.platform === "whatsapp" && l.enabled);

  const { data: products = [] } = useQuery({
    queryKey: ["public-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, description, image_url")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  if (products.length === 0) return null;

  const getWhatsAppLink = (productName: string) => {
    if (!whatsapp) return "#";
    const number = whatsapp.value.replace(/[^0-9+]/g, "").replace("+", "");
    const message = encodeURIComponent(
      t("whatsappMessages.product", { name: productName })
    );
    return `https://wa.me/${number}?text=${message}`;
  };

  return (
    <section id="products" className="section-padding">
      <div className="container-narrow">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("products.tag")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("products.title")}</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">{t("products.subtitle")}</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-strong rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
            >
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="w-full h-48 object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">{t("products.noImage")}</span>
                </div>
              )}
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
                {p.description && <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.description}</p>}
                <a
                  href={getWhatsAppLink(p.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
                >
                  <WhatsappLogo size={16} weight="fill" />
                  {t("products.requestQuote")}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
