import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ArrowLeft, WhatsappLogo } from "@phosphor-icons/react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useSocialLinks } from "@/hooks/useSocialLinks";
interface BlogPost {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  slug: string;
}

const BlogPostPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: socialLinks = [] } = useSocialLinks();

  const whatsappLink = socialLinks.find((l) => l.platform === "whatsapp" && l.enabled);
  const dynamicWhatsappNumber = whatsappLink
    ? whatsappLink.value.replace(/[^0-9+]/g, "").replace("+", "")
    : "";

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        setPost(data as any);
        setLoading(false);
      });
  }, [slug]);

  const siteUrl = "https://almonesi.com";

  // JSON-LD structured data
  const jsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        image: post.image_url || undefined,
        datePublished: post.created_at,
        dateModified: post.updated_at,
        url: `${siteUrl}/blog/${post.slug}`,
        description: post.meta_description || "",
        publisher: {
          "@type": "Organization",
          name: "Al Monesi Trade",
          url: siteUrl,
        },
      }
    : null;

  if (loading)
    return (
      <>
        <Navbar />
        <div className="pt-24 text-center text-muted-foreground">Loading...</div>
      </>
    );

  if (!post)
    return (
      <>
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground">{t("blogPage.notFound")}</p>
          <Link to="/blog" className="mt-4 inline-block text-primary font-medium">
            ← {t("blogPage.backToBlog")}
          </Link>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title}</title>
        {post.meta_description && (
          <meta name="description" content={post.meta_description} />
        )}
        <link rel="canonical" href={`${siteUrl}/blog/${post.slug}`} />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${siteUrl}/blog/${post.slug}`} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        {post.meta_description && (
          <meta property="og:description" content={post.meta_description} />
        )}
        {jsonLd && (
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        )}
      </Helmet>

      <Navbar />
      <main className="pt-20">
        {post.image_url && (
          <div className="w-full h-64 sm:h-96 overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <article className="container-narrow max-w-3xl py-12 px-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-primary font-medium mb-6 hover:underline"
          >
            <ArrowLeft size={16} /> {t("blogPage.backToBlog")}
          </Link>
          <p className="text-sm text-muted-foreground">
            {format(new Date(post.created_at), "MMMM d, yyyy")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-8 prose prose-sm max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          {/* WhatsApp CTA Section */}
          <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
            <h3 className="text-lg font-semibold text-foreground sm:text-xl">
              {t("blogPage.ctaTitle", {
                defaultValue:
                  "Need Help Importing From China?",
              })}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
              {t("blogPage.ctaText", {
                defaultValue:
                  "For consultation about importing machinery, equipment, or production lines from China, contact our sales team on WhatsApp.",
              })}
            </p>
            <a
              href={`https://wa.me/${dynamicWhatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
            >
              <WhatsappLogo size={20} weight="fill" />
              {t("blogPage.ctaButton", { defaultValue: "Chat on WhatsApp" })}
            </a>
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default BlogPostPage;
