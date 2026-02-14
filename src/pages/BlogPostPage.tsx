import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ArrowLeft } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

interface BlogPost {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
}

const BlogPostPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

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
          document.title = (data as any).meta_title || (data as any).title;
        }
      });
  }, [slug]);

  if (loading) return (
    <>
      <Navbar />
      <div className="pt-24 text-center text-muted-foreground">Loading...</div>
    </>
  );

  if (!post) return (
    <>
      <Navbar />
      <div className="pt-24 text-center">
        <p className="text-muted-foreground">{t("blogPage.notFound")}</p>
        <Link to="/blog" className="mt-4 inline-block text-primary font-medium">← {t("blogPage.backToBlog")}</Link>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {post.image_url && (
          <div className="w-full h-64 sm:h-96 overflow-hidden">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <article className="container-narrow max-w-3xl py-12 px-4">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-primary font-medium mb-6 hover:underline">
            <ArrowLeft size={16} /> {t("blogPage.backToBlog")}
          </Link>
          <p className="text-sm text-muted-foreground">{format(new Date(post.created_at), "MMMM d, yyyy")}</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{post.title}</h1>
          <div className="mt-8 prose prose-sm max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default BlogPostPage;
