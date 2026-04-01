import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  ArrowLeft,
  WhatsappLogo,
  LinkedinLogo,
  XLogo,
  FacebookLogo,
  ShareNetwork,
  Clock,
  User,
  List,
  CaretDown,
  EnvelopeSimple,
} from "@phosphor-icons/react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

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
  excerpt: string | null;
  author: string | null;
  category: string | null;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  created_at: string;
  category: string | null;
  excerpt: string | null;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

function estimateReadingTime(content: string | null): number {
  if (!content) return 1;
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function extractTOC(content: string | null): TOCItem[] {
  if (!content) return [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TOCItem[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].replace(/[*_`]/g, "").trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    items.push({ id, text, level: match[1].length });
  }
  // Also check for HTML headings
  const htmlHeadingRegex = /<h([23])[^>]*>([^<]+)<\/h[23]>/gi;
  while ((match = htmlHeadingRegex.exec(content)) !== null) {
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    items.push({ id, text, level: parseInt(match[1]) });
  }
  return items;
}

const BlogPostPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { data: socialLinks = [] } = useSocialLinks();

  const whatsappLink = socialLinks.find((l) => l.platform === "whatsapp" && l.enabled);
  const dynamicWhatsappNumber = whatsappLink
    ? whatsappLink.value.replace(/[^0-9+]/g, "").replace("+", "")
    : "";

  const toc = useMemo(() => extractTOC(post?.content || null), [post?.content]);
  const readingTime = useMemo(() => estimateReadingTime(post?.content || null), [post?.content]);

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
        if (data) {
          // Fetch related posts
          const query = supabase
            .from("blog_posts")
            .select("id, title, slug, image_url, created_at, category, excerpt")
            .eq("published", true)
            .neq("slug", slug)
            .order("created_at", { ascending: false })
            .limit(3);
          query.then(({ data: related }) => {
            setRelatedPosts((related as any) || []);
          });
        }
      });
  }, [slug]);

  // Track active section for TOC highlighting
  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  const siteUrl = "https://almonesi.com";
  const articleUrl = post ? `${siteUrl}/blog/${post.slug}` : "";

  const jsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        image: post.image_url || undefined,
        datePublished: post.created_at,
        dateModified: post.updated_at,
        url: articleUrl,
        description: post.meta_description || post.excerpt || "",
        author: {
          "@type": "Person",
          name: post.author || "Almonesi Team",
        },
        publisher: {
          "@type": "Organization",
          name: "Al Monesi Trade",
          url: siteUrl,
        },
      }
    : null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTocOpen(false);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="pt-32 text-center text-muted-foreground min-h-screen">
          <div className="animate-pulse space-y-4 max-w-2xl mx-auto px-4">
            <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
            <div className="h-64 bg-muted rounded-2xl" />
          </div>
        </div>
      </>
    );

  if (!post)
    return (
      <>
        <Navbar />
        <div className="pt-32 text-center min-h-screen">
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
        {post.meta_description && <meta name="description" content={post.meta_description} />}
        <link rel="canonical" href={articleUrl} />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        {post.meta_description && <meta property="og:description" content={post.meta_description} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.meta_title || post.title} />
        {post.meta_description && <meta name="twitter:description" content={post.meta_description} />}
        {post.image_url && <meta name="twitter:image" content={post.image_url} />}
        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      </Helmet>

      <Navbar />

      <main className="pt-20">
        {/* ===== HERO SECTION ===== */}
        <section className="relative">
          {post.image_url && (
            <div className="w-full max-h-[520px] overflow-hidden">
              <OptimizedImage
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
                size="medium"
              />
            </div>
          )}
          <div className="container-narrow max-w-4xl px-4 py-8 sm:py-12">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft size={16} weight="bold" /> {t("blogPage.backToBlog")}
            </Link>

            {post.category && (
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                {post.category}
              </Badge>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Meta info */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User size={16} weight="bold" />
                {post.author || "Almonesi Team"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={16} weight="bold" />
                {format(new Date(post.created_at), "MMMM d, yyyy")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={16} />
                {readingTime} min read
              </span>
            </div>

            {/* Share buttons under title */}
            <ShareButtons url={articleUrl} title={post.title} />
          </div>
        </section>

        {/* ===== CONTENT + TOC LAYOUT ===== */}
        <section className="container-narrow max-w-6xl px-4 pb-16">
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
            {/* TOC Sidebar - Desktop */}
            {toc.length > 0 && !isMobile && (
              <aside className="hidden lg:block">
                <nav className="sticky top-24 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Table of Contents
                  </p>
                  {toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left text-sm py-1.5 transition-colors border-l-2 ${
                        item.level === 3 ? "pl-5" : "pl-3"
                      } ${
                        activeSection === item.id
                          ? "border-primary text-primary font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </aside>
            )}

            <div className="max-w-3xl">
              {/* TOC Mobile */}
              {toc.length > 0 && isMobile && (
                <Collapsible open={tocOpen} onOpenChange={setTocOpen} className="mb-8 rounded-xl border border-border bg-card p-4">
                  <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-semibold text-foreground">
                    <span className="inline-flex items-center gap-2">
                      <List size={18} /> Table of Contents
                    </span>
                    <CaretDown size={16} className={`transition-transform ${tocOpen ? "rotate-180" : ""}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3 space-y-1">
                    {toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`block w-full text-left text-sm py-1.5 text-muted-foreground hover:text-primary transition-colors ${
                          item.level === 3 ? "pl-4" : "pl-0"
                        }`}
                      >
                        {item.text}
                      </button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* ===== ARTICLE CONTENT ===== */}
              <article className="prose-article">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h2: ({ children, ...props }) => {
                      const text = String(children);
                      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      return <h2 id={id} className="scroll-mt-24" {...props}>{children}</h2>;
                    },
                    h3: ({ children, ...props }) => {
                      const text = String(children);
                      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      return <h3 id={id} className="scroll-mt-24" {...props}>{children}</h3>;
                    },
                    a: ({ href, children, ...props }) => {
                      const isExternal = href?.startsWith("http");
                      return (
                        <a
                          href={href}
                          className="text-primary font-medium underline underline-offset-2 hover:text-primary/80 transition-colors"
                          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          {...props}
                        >
                          {children}
                        </a>
                      );
                    },
                    img: ({ src, alt, ...props }) => (
                      <figure className="my-8">
                        <img
                          src={src}
                          alt={alt || ""}
                          className="w-full rounded-xl shadow-md"
                          loading="lazy"
                          {...props}
                        />
                        {alt && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{alt}</figcaption>}
                      </figure>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote
                        className="border-l-4 border-primary/40 bg-primary/5 rounded-r-lg pl-5 pr-4 py-4 my-6 italic text-foreground/80"
                        {...props}
                      >
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {post.content || ""}
                </ReactMarkdown>
              </article>

              {/* ===== SHARE BOTTOM ===== */}
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm font-semibold text-muted-foreground mb-3">Share this article</p>
                <ShareButtons url={articleUrl} title={post.title} />
              </div>

              {/* ===== NEWSLETTER ===== */}
              <NewsletterSection />

              {/* ===== RELATED ARTICLES ===== */}
              {relatedPosts.length > 0 && (
                <section className="mt-16">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedPosts.map((rp) => (
                      <Link
                        key={rp.id}
                        to={`/blog/${rp.slug}`}
                        className="group rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                      >
                        {rp.image_url ? (
                          <img src={rp.image_url} alt={rp.title} className="h-40 w-full object-cover" loading="lazy" />
                        ) : (
                          <div className="h-40 w-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary/30 text-sm">Blog</span>
                          </div>
                        )}
                        <div className="p-4">
                          {rp.category && (
                            <span className="text-xs font-medium text-primary">{rp.category}</span>
                          )}
                          <h3 className="mt-1 text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {rp.title}
                          </h3>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {format(new Date(rp.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* ===== WHATSAPP CTA ===== */}
              <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
                <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                  {t("blogPage.ctaTitle", { defaultValue: "Need Help Importing From China?" })}
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
};

/* ===== SHARE BUTTONS COMPONENT ===== */
function ShareButtons({ url, title }: { url: string; title: string }) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const channels = [
    {
      icon: WhatsappLogo,
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
      label: "WhatsApp",
      color: "hover:bg-[#25D366]/10 hover:text-[#25D366]",
    },
    {
      icon: LinkedinLogo,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      label: "LinkedIn",
      color: "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]",
    },
    {
      icon: XLogo,
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
      label: "X",
      color: "hover:bg-foreground/10 hover:text-foreground",
    },
    {
      icon: FacebookLogo,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      label: "Facebook",
      color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2]",
    },
  ];

  return (
    <div className="mt-4 flex items-center gap-2">
      {channels.map((ch) => (
        <a
          key={ch.label}
          href={ch.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${ch.label}`}
          className={`inline-flex items-center justify-center h-9 w-9 rounded-full border border-border text-muted-foreground transition-colors ${ch.color}`}
        >
          <ch.icon size={18} weight="bold" />
        </a>
      ))}
    </div>
  );
}

/* ===== NEWSLETTER SECTION ===== */
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="mt-16 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <EnvelopeSimple size={20} className="text-primary" weight="bold" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Stay Updated</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
        Stay updated with the latest guides about importing from China and international sourcing.
      </p>
      {submitted ? (
        <p className="text-sm text-primary font-medium">Thank you for subscribing! 🎉</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" size="default">
            Subscribe
          </Button>
        </form>
      )}
    </section>
  );
}

export default BlogPostPage;
