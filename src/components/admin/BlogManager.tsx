import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash, PencilSimple, Plus } from "@phosphor-icons/react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published: boolean;
  author: string | null;
  category: string | null;
}

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", image_url: "", meta_title: "", meta_description: "", published: false, author: "Almonesi Team", category: "General",
  });

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts((data as any) || []);
  };

  useEffect(() => { fetchPosts(); }, []);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const resetForm = () => {
    setForm({ title: "", slug: "", excerpt: "", content: "", image_url: "", meta_title: "", meta_description: "", published: false, author: "Almonesi Team", category: "General" });
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    const payload = {
      ...form,
      excerpt: form.excerpt || null,
      content: form.content || null,
      image_url: form.image_url || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      author: form.author || "Almonesi Team",
      category: form.category || "General",
    };
    if (editing) {
      const { error } = await supabase.from("blog_posts").update(payload as any).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Post updated");
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload as any);
      if (error) { toast.error(error.message); return; }
      toast.success("Post created");
    }
    resetForm();
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    toast.success("Post deleted");
    fetchPosts();
  };

  const startEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt || "", content: p.content || "",
      image_url: p.image_url || "", meta_title: p.meta_title || "", meta_description: p.meta_description || "",
      published: p.published, author: p.author || "Almonesi Team", category: p.category || "General",
    });
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground">{editing ? "Edit Post" : "New Blog Post"}</h3>
        <Input placeholder="Title" value={form.title} onChange={(e) => {
          setForm({ ...form, title: e.target.value, slug: editing ? form.slug : generateSlug(e.target.value) });
        }} />
        <Input placeholder="Slug (URL)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>
        <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        <Textarea placeholder="Excerpt (short summary)" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} />
        <Textarea placeholder="Full content (Markdown or HTML supported)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} />
        <Input placeholder="SEO Meta Title" value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />
        <Input placeholder="SEO Meta Description" value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
        <div className="flex items-center gap-3">
          <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
          <span className="text-sm text-muted-foreground">Published</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
          {editing && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="glass rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h4 className="font-medium text-foreground truncate">{p.title}</h4>
              <p className="text-xs text-muted-foreground">/blog/{p.slug} · {p.published ? "Published" : "Draft"} · {p.category || "General"}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground">
                <PencilSimple size={16} />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive">
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogManager;
