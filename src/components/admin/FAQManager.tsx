import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash, PencilSimple } from "@phosphor-icons/react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  published: boolean;
}

const categories = ["General", "Shipping", "Payments", "Quality Control", "Orders"];

const FAQManager = () => {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [form, setForm] = useState({ question: "", answer: "", category: "General", sort_order: 0, published: true });

  const fetchItems = async () => {
    const { data } = await supabase.from("faq_items").select("*").order("sort_order");
    setItems((data as any) || []);
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setForm({ question: "", answer: "", category: "General", sort_order: 0, published: true });
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }
    if (editing) {
      const { error } = await supabase.from("faq_items").update(form as any).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("FAQ updated");
    } else {
      const { error } = await supabase.from("faq_items").insert(form as any);
      if (error) { toast.error(error.message); return; }
      toast.success("FAQ created");
    }
    resetForm();
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("faq_items").delete().eq("id", id);
    toast.success("FAQ deleted");
    fetchItems();
  };

  const startEdit = (item: FAQItem) => {
    setEditing(item);
    setForm({ question: item.question, answer: item.answer, category: item.category, sort_order: item.sort_order, published: item.published });
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground">{editing ? "Edit FAQ" : "New FAQ Item"}</h3>
        <Input placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
        <Textarea placeholder="Answer" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} />
        <div className="grid grid-cols-2 gap-4">
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
          <span className="text-sm text-muted-foreground">Published</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
          {editing && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="glass rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h4 className="font-medium text-foreground truncate">{item.question}</h4>
              <p className="text-xs text-muted-foreground">{item.category} · Order: {item.sort_order} · {item.published ? "Published" : "Hidden"}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(item)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground">
                <PencilSimple size={16} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive">
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQManager;
