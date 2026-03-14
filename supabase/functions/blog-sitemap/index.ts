import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const siteUrl = "https://almonesi.com";

  const staticPages = [
    "", "/about-us", "/services", "/contact", "/blog", "/how-it-works",
    "/faq", "/why-us", "/markets", "/import-guide", "/sourcing-guide",
    "/supplier-verification", "/quality-inspection", "/private-labeling",
    "/logistics-shipping", "/product-research",
  ];

  const staticEntries = staticPages.map((p) => `
  <url>
    <loc>${siteUrl}${p}</loc>
    <changefreq>${p === "" ? "daily" : "weekly"}</changefreq>
    <priority>${p === "" ? "1.0" : "0.8"}</priority>
  </url>`).join("");

  const blogEntries = (posts || []).map((p) => `
  <url>
    <loc>${siteUrl}/blog/${p.slug}</loc>
    <lastmod>${new Date(p.updated_at).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticEntries}
  ${blogEntries}
</urlset>`;

  return new Response(sitemap, {
    headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8" },
  });
});
