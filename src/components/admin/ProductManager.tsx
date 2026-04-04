import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { optimizeImageForUpload, formatFileSize } from "@/lib/imageOptimizer";

interface Product {
  id: string;
  name: string;
  name_ar: string | null;
  name_zh: string | null;
  description: string | null;
  description_ar: string | null;
  description_zh: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
  sort_order: number;
}

const ProductManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [nameZh, setNameZh] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionZh, setDescriptionZh] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Product[];
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    // Optimize: compress, resize to 800px, convert to WebP + generate thumbnail
    const optimized = await optimizeImageForUpload(file);
    
    // Upload main image
    const mainPath = `products/${optimized.mainName}`;
    const { error: mainErr } = await supabase.storage.from("product-images").upload(mainPath, optimized.main, { contentType: "image/webp" });
    if (mainErr) throw mainErr;
    
    // Upload thumbnail
    const thumbPath = `products/${optimized.thumbName}`;
    await supabase.storage.from("product-images").upload(thumbPath, optimized.thumbnail, { contentType: "image/webp" });
    
    const { data } = supabase.storage.from("product-images").getPublicUrl(mainPath);
    
    toast({
      title: "Image optimized",
      description: `Main: ${formatFileSize(optimized.main.size)} · Thumb: ${formatFileSize(optimized.thumbnail.size)}`,
    });
    
    return data.publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      setSaving(true);
      let imageUrl: string | undefined;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      const payload: Record<string, unknown> = {
        name, description,
        name_ar: nameAr || null,
        name_zh: nameZh || null,
        description_ar: descriptionAr || null,
        description_zh: descriptionZh || null,
      };
      if (imageUrl) payload.image_url = imageUrl;

      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        payload.image_url = imageUrl ?? null;
        const { error } = await supabase.from("products").insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: editingId ? "Product updated" : "Product added" });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    onSettled: () => setSaving(false),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Product deleted" });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: "up" | "down" }) => {
      const idx = products.findIndex((p) => p.id === id);
      if (idx < 0) return;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= products.length) return;
      const a = products[idx];
      const b = products[swapIdx];
      const { error: e1 } = await supabase.from("products").update({ sort_order: b.sort_order }).eq("id", a.id);
      if (e1) throw e1;
      const { error: e2 } = await supabase.from("products").update({ sort_order: a.sort_order }).eq("id", b.id);
      if (e2) throw e2;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
    onError: (err: Error) => toast({ title: "Error reordering", description: err.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setName(""); setNameAr(""); setNameZh("");
    setDescription(""); setDescriptionAr(""); setDescriptionZh("");
    setImageFile(null); setEditingId(null);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setNameAr(p.name_ar ?? "");
    setNameZh(p.name_zh ?? "");
    setDescription(p.description ?? "");
    setDescriptionAr(p.description_ar ?? "");
    setDescriptionZh(p.description_zh ?? "");
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <section className="glass-strong rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {editingId ? "Edit Product" : "Add Product"}
        </h2>
        <div className="space-y-3">
          {/* English */}
          <div>
            <Label htmlFor="product-name">Product Name (English) *</Label>
            <Input id="product-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product name" maxLength={200} />
          </div>
          <div>
            <Label htmlFor="product-desc">Description (English)</Label>
            <Textarea id="product-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" rows={3} maxLength={500} />
          </div>

          {/* Arabic */}
          <div className="border-t border-border pt-3 mt-3">
            <p className="text-sm font-medium text-muted-foreground mb-2">🇸🇦 Arabic Translation</p>
            <div className="space-y-2">
              <div>
                <Label htmlFor="product-name-ar">Product Name (Arabic)</Label>
                <Input id="product-name-ar" dir="rtl" value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder="اسم المنتج" maxLength={200} />
              </div>
              <div>
                <Label htmlFor="product-desc-ar">Description (Arabic)</Label>
                <Textarea id="product-desc-ar" dir="rtl" value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} placeholder="وصف مختصر" rows={2} maxLength={500} />
              </div>
            </div>
          </div>

          {/* Chinese */}
          <div className="border-t border-border pt-3 mt-3">
            <p className="text-sm font-medium text-muted-foreground mb-2">🇨🇳 Chinese Translation</p>
            <div className="space-y-2">
              <div>
                <Label htmlFor="product-name-zh">Product Name (Chinese)</Label>
                <Input id="product-name-zh" value={nameZh} onChange={(e) => setNameZh(e.target.value)} placeholder="产品名称" maxLength={200} />
              </div>
              <div>
                <Label htmlFor="product-desc-zh">Description (Chinese)</Label>
                <Textarea id="product-desc-zh" value={descriptionZh} onChange={(e) => setDescriptionZh(e.target.value)} placeholder="简要描述" rows={2} maxLength={500} />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="product-image">Product Image</Label>
            <Input id="product-image" type="file" accept="image/*" onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              if (f && f.size > 5 * 1024 * 1024) {
                toast({ title: "Image too large", description: "Please upload an image smaller than 5MB.", variant: "destructive" });
                e.target.value = "";
                return;
              }
              setImageFile(f);
            }} />
            {imageFile && <p className="text-xs text-muted-foreground mt-1">Original: {formatFileSize(imageFile.size)} → Will be optimized to WebP</p>}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => saveMutation.mutate()} disabled={saving || !name.trim()}>
              {saving ? "Saving…" : editingId ? "Update Product" : "Save Product"}
            </Button>
            {editingId && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">All Products</h2>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground text-sm">No products yet.</p>
        ) : (
          <div className="grid gap-4">
            {products.map((p, i) => (
              <div key={p.id} className="glass rounded-xl p-4 flex items-center gap-4">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <span className="text-xs text-muted-foreground">No img</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{p.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{p.description}</p>
                  {(p.name_ar || p.name_zh) && (
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      {p.name_ar && `🇸🇦 ${p.name_ar}`}{p.name_ar && p.name_zh && " · "}{p.name_zh && `🇨🇳 ${p.name_zh}`}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1 shrink-0 mr-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" disabled={i === 0} onClick={() => reorderMutation.mutate({ id: p.id, direction: "up" })}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" disabled={i === products.length - 1} onClick={() => reorderMutation.mutate({ id: p.id, direction: "down" })}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(p.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductManager;
