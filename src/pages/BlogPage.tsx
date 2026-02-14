import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  created_at: string;
}

const BlogPage = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, image_url, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPosts((data as any) || []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <PageHeader
        tag={t("blogPage.tag")}
        title={t("blogPage.title")}
        subtitle={t("blogPage.subtitle")}
      />
      <main className="section-padding">
        <div className="container-narrow">
          {loading ? (
            <p className="text-center text-muted-foreground">{t("blogPage.loading")}</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground">{t("blogPage.noPosts")}</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group glass rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className="h-48 w-full object-cover" />
                  ) : (
                    <div className="h-48 w-full flex items-center justify-center" style={{ backgroundColor: '#003f7f' }}>
                      <span className="text-white/50 text-sm">Blog</span>
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground">{format(new Date(post.created_at), "MMM d, yyyy")}</p>
                    <h3 className="mt-2 text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    )}
                    <span className="mt-3 inline-block text-sm font-medium text-primary">
                      {t("blogPage.readMore")} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default BlogPage;
