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
    .select("title, slug, excerpt, created_at, meta_description")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(50);

  const siteUrl = "https://almonesi.com";
  const items = (posts || []).map((p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${siteUrl}/blog/${p.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${p.slug}</guid>
      <description><![CDATA[${p.excerpt || p.meta_description || ""}]]></description>
      <pubDate>${new Date(p.created_at).toUTCString()}</pubDate>
    </item>`).join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Al Monesi Trade Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Trade insights and expert guides from Al Monesi</description>
    <language>en</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: { ...corsHeaders, "Content-Type": "application/rss+xml; charset=utf-8" },
  });
});
