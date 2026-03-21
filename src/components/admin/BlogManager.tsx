import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash, PencilSimple, Image as ImageIcon } from "@phosphor-icons/react";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
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
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const uploadImage = async (file: File, slug: string): Promise<string | null> => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `posts/${Date.now()}-${slug}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file, { upsert: true });
    if (error) {
      toast.error(`Image upload failed: ${error.message}`);
      return null;
    }
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);

    let imageUrl = form.image_url;
    if (imageFile) {
      const url = await uploadImage(imageFile, form.slug);
      if (url) imageUrl = url;
      else { setSaving(false); return; }
    }

    const payload = {
      ...form,
      image_url: imageUrl || null,
      excerpt: form.excerpt || null,
      content: form.content || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      author: form.author || "Almonesi Team",
      category: form.category || "General",
    };

    if (editing) {
      const { error } = await supabase.from("blog_posts").update(payload as any).eq("id", editing.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Post updated");
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload as any);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Post created");
    }
    resetForm();
    fetchPosts();
    setSaving(false);
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
    setImageFile(null);
    setImagePreview(p.image_url || null);
  };

  const currentPreview = imagePreview || form.image_url || null;

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

        {/* Image upload */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <ImageIcon size={16} /> Featured Image
          </Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
          />
          {currentPreview && (
            <div className="relative mt-2">
              <img
                src={currentPreview}
                alt="Preview"
                className="h-40 w-full object-cover rounded-lg border border-border"
              />
              {imageFile && (
                <button
                  type="button"
                  onClick={() => handleImageChange(null)}
                  className="absolute top-2 right-2 p-1 rounded-md bg-background/80 text-destructive hover:bg-destructive/10"
                >
                  <Trash size={14} />
                </button>
              )}
            </div>
          )}
          {!imageFile && (
            <Input
              placeholder="Or paste image URL"
              value={form.image_url}
              onChange={(e) => {
                setForm({ ...form, image_url: e.target.value });
                setImagePreview(null);
              }}
            />
          )}
        </div>

        <Textarea placeholder="Excerpt (short summary)" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} />
        <Textarea placeholder="Full content (Markdown or HTML supported)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} />
        <Input placeholder="SEO Meta Title" value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />
        <Input placeholder="SEO Meta Description" value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
        <div className="flex items-center gap-3">
          <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
          <span className="text-sm text-muted-foreground">Published</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : editing ? "Update" : "Create"}
          </Button>
          {editing && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="glass rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {p.image_url && (
                <img src={p.image_url} alt="" className="h-10 w-14 rounded-md object-cover shrink-0" />
              )}
              <div className="min-w-0">
                <h4 className="font-medium text-foreground truncate">{p.title}</h4>
                <p className="text-xs text-muted-foreground">/blog/{p.slug} · {p.published ? "Published" : "Draft"} · {p.category || "General"}</p>
              </div>
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
