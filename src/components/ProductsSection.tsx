import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

const ProductsSection = () => {
  const { t } = useTranslation();
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

  return (
    <section id="products" className="section-padding">
      <div className="container-narrow">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("products.tag")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("products.title")}</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="glass rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="w-full h-48 object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">{t("products.noImage")}</span>
                </div>
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
                {p.description && <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
