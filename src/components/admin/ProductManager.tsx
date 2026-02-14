import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

const ProductManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      setSaving(true);
      let imageUrl: string | undefined;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      if (editingId) {
        const updates: Record<string, unknown> = { name, description };
        if (imageUrl) updates.image_url = imageUrl;
        const { error } = await supabase.from("products").update(updates).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert({
          name, description, image_url: imageUrl ?? null,
        });
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

  const resetForm = () => {
    setName(""); setDescription(""); setImageFile(null); setEditingId(null);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id); setName(p.name); setDescription(p.description ?? ""); setImageFile(null);
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
          <div>
            <Label htmlFor="product-name">Product Name</Label>
            <Input id="product-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product name" maxLength={200} />
          </div>
          <div>
            <Label htmlFor="product-desc">Short Description</Label>
            <Textarea id="product-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" rows={3} maxLength={500} />
          </div>
          <div>
            <Label htmlFor="product-image">Product Image</Label>
            <Input id="product-image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
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
            {products.map((p) => (
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
