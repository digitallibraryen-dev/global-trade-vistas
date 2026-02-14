import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

const PLATFORMS = ["instagram", "whatsapp", "tiktok", "snapchat", "wechat"] as const;

interface SocialLink {
  id: string;
  platform: string;
  label: string;
  value: string;
  enabled: boolean;
  sort_order: number;
}

const SocialMediaManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPlatform, setNewPlatform] = useState<string>(PLATFORMS[0]);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");

  const { data: links = [], isLoading } = useQuery({
    queryKey: ["admin-social-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_media_links")
        .select("*")
        .order("platform")
        .order("sort_order");
      if (error) throw error;
      return data as SocialLink[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("social_media_links").insert({
        platform: newPlatform,
        label: newLabel,
        value: newValue,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Link added" });
      setNewLabel("");
      setNewValue("");
      queryClient.invalidateQueries({ queryKey: ["admin-social-links"] });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase.from("social_media_links").update({ enabled }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-social-links"] }),
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("social_media_links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Link deleted" });
      queryClient.invalidateQueries({ queryKey: ["admin-social-links"] });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      {/* Add new link */}
      <section className="glass-strong rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Plus className="h-5 w-5" /> Add Social Link
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Platform</Label>
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Label (optional)</Label>
            <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="e.g. Main Account" />
          </div>
        </div>
        <div>
          <Label>Link / Username / Phone</Label>
          <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="e.g. @almonesi or +86123456" />
        </div>
        <Button onClick={() => addMutation.mutate()} disabled={!newValue.trim()}>
          Save Link
        </Button>
      </section>

      {/* Existing links */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">All Social Links</h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : links.length === 0 ? (
          <p className="text-sm text-muted-foreground">No social links yet.</p>
        ) : (
          <div className="grid gap-3">
            {links.map((link) => (
              <div key={link.id} className="glass rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground capitalize">{link.platform}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {link.label ? `${link.label}: ` : ""}{link.value}
                  </p>
                </div>
                <Switch
                  checked={link.enabled}
                  onCheckedChange={(checked) => toggleMutation.mutate({ id: link.id, enabled: checked })}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(link.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SocialMediaManager;
