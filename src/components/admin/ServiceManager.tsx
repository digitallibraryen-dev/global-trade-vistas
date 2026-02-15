import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash, FloppyDisk, Image } from "@phosphor-icons/react";

const ICON_OPTIONS = [
  "Package", "Truck", "Airplane", "Anchor", "Factory", "Warehouse",
  "ShoppingCart", "Handshake", "Globe", "MagnifyingGlass", "ShieldCheck",
  "CurrencyDollar", "FileText", "Gear", "Lightning", "Star",
];

interface Service {
  id: string;
  title: string;
  title_ar: string | null;
  title_zh: string | null;
  description: string;
  description_ar: string | null;
  description_zh: string | null;
  image_url: string;
  icon: string;
  published: boolean;
  sort_order: number;
}

const ServiceManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", title_ar: "", title_zh: "",
    description: "", description_ar: "", description_zh: "",
    image_url: "", icon: "Package", published: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchServices = async () => {
    const { data, error } = await supabase.from("services").select("*").order("sort_order");
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setServices((data as Service[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `services/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return null; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    setSaving(true);
    let imageUrl = form.image_url;
    if (imageFile) {
      const url = await uploadImage(imageFile);
      if (url) imageUrl = url;
    }

    const payload = {
      title: form.title, description: form.description,
      title_ar: form.title_ar || null, title_zh: form.title_zh || null,
      description_ar: form.description_ar || null, description_zh: form.description_zh || null,
      image_url: imageUrl, icon: form.icon, published: form.published,
    };

    if (editingId) {
      const { error } = await supabase.from("services").update(payload).eq("id", editingId);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Service updated" });
    } else {
      const { error } = await supabase.from("services").insert({ ...payload, sort_order: services.length });
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Service added" });
    }
    resetForm();
    fetchServices();
    queryClient.invalidateQueries({ queryKey: ["public-services"] });
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Service deleted" }); fetchServices(); queryClient.invalidateQueries({ queryKey: ["public-services"] }); }
  };

  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setForm({
      title: s.title, title_ar: s.title_ar || "", title_zh: s.title_zh || "",
      description: s.description || "", description_ar: s.description_ar || "", description_zh: s.description_zh || "",
      image_url: s.image_url || "", icon: s.icon || "Package", published: s.published,
    });
    setImageFile(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: "", title_ar: "", title_zh: "", description: "", description_ar: "", description_zh: "", image_url: "", icon: "Package", published: true });
    setImageFile(null);
  };

  if (loading) return <p className="text-muted-foreground py-8 text-center">Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="glass-strong rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground">{editingId ? "Edit Service" : "Add New Service"}</h3>
        
        {/* English */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Title (English) *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Service title" />
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description (English)</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Service description" rows={3} />
        </div>

        {/* Arabic */}
        <div className="border-t border-border pt-3">
          <p className="text-sm font-medium text-muted-foreground mb-2">🇸🇦 Arabic Translation</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Title (Arabic)</Label>
              <Input dir="rtl" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} placeholder="عنوان الخدمة" />
            </div>
          </div>
          <div className="space-y-2 mt-2">
            <Label>Description (Arabic)</Label>
            <Textarea dir="rtl" value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} placeholder="وصف الخدمة" rows={2} />
          </div>
        </div>

        {/* Chinese */}
        <div className="border-t border-border pt-3">
          <p className="text-sm font-medium text-muted-foreground mb-2">🇨🇳 Chinese Translation</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Title (Chinese)</Label>
              <Input value={form.title_zh} onChange={(e) => setForm({ ...form, title_zh: e.target.value })} placeholder="服务标题" />
            </div>
          </div>
          <div className="space-y-2 mt-2">
            <Label>Description (Chinese)</Label>
            <Textarea value={form.description_zh} onChange={(e) => setForm({ ...form, description_zh: e.target.value })} placeholder="服务描述" rows={2} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Image</Label>
          <div className="flex gap-3 items-center">
            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            {(form.image_url || imageFile) && <Image size={20} className="text-primary" />}
          </div>
          {form.image_url && !imageFile && (
            <img src={form.image_url} alt="" className="h-20 w-32 object-cover rounded-lg mt-2" />
          )}
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
          <Label className="text-sm">{form.published ? "Published" : "Draft"}</Label>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <FloppyDisk size={16} />
            {saving ? "Saving…" : editingId ? "Update Service" : "Add Service"}
          </Button>
          {editingId && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.id} className="glass-strong rounded-xl p-4 flex items-center gap-4">
            {s.image_url && <img src={s.image_url} alt={s.title} className="h-14 w-20 rounded-lg object-cover shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.published ? "Published" : "Draft"} · Icon: {s.icon}</p>
              {(s.title_ar || s.title_zh) && (
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  {s.title_ar && `🇸🇦 ${s.title_ar}`}{s.title_ar && s.title_zh && " · "}{s.title_zh && `🇨🇳 ${s.title_zh}`}
                </p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => startEdit(s)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id)} className="gap-1">
                <Trash size={14} />
              </Button>
            </div>
          </div>
        ))}
        {services.length === 0 && <p className="text-center text-muted-foreground py-6">No services yet. Add your first one above.</p>}
      </div>
    </div>
  );
};

export default ServiceManager;
