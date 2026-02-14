import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  TelegramLogo,
  WhatsappLogo,
  InstagramLogo,
  FacebookLogo,
  SnapchatLogo,
  FloppyDisk,
} from "@phosphor-icons/react";

const PLATFORMS = [
  { key: "telegram", label: "Telegram", icon: TelegramLogo, placeholder: "https://t.me/username" },
  { key: "whatsapp", label: "WhatsApp", icon: WhatsappLogo, placeholder: "https://wa.me/1234567890" },
  { key: "instagram", label: "Instagram", icon: InstagramLogo, placeholder: "https://instagram.com/username" },
  { key: "facebook", label: "Facebook", icon: FacebookLogo, placeholder: "https://facebook.com/page" },
  { key: "snapchat", label: "Snapchat", icon: SnapchatLogo, placeholder: "https://snapchat.com/add/username" },
] as const;

interface PlatformState {
  id: string | null;
  value: string;
  enabled: boolean;
}

type StateMap = Record<string, PlatformState>;

const defaultState = (): StateMap =>
  Object.fromEntries(
    PLATFORMS.map((p) => [p.key, { id: null, value: "", enabled: false }])
  );

const isValidUrl = (str: string) => {
  if (!str.trim()) return true; // empty is ok, just won't display
  try {
    new URL(str);
    return true;
  } catch {
    return /^@[\w.]+$/.test(str) || /^\+?\d[\d\s-]{5,}$/.test(str); // allow @handle or phone
  }
};

const SocialMediaManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [state, setState] = useState<StateMap>(defaultState());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("social_media_links")
      .select("*")
      .order("sort_order")
      .then(({ data, error }) => {
        if (error) {
          toast({ title: "Error loading links", description: error.message, variant: "destructive" });
          setLoading(false);
          return;
        }
        const newState = defaultState();
        data?.forEach((row) => {
          if (newState[row.platform]) {
            newState[row.platform] = {
              id: row.id,
              value: row.value,
              enabled: row.enabled,
            };
          }
        });
        setState(newState);
        setLoading(false);
      });
  }, []);

  const updateField = (platform: string, field: keyof PlatformState, value: string | boolean) => {
    setState((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
  };

  const handleSave = async () => {
    // Validate all non-empty URLs
    for (const p of PLATFORMS) {
      const val = state[p.key].value;
      if (val && !isValidUrl(val)) {
        toast({ title: `Invalid URL for ${p.label}`, description: "Please enter a valid link, @handle, or phone number.", variant: "destructive" });
        return;
      }
    }

    setSaving(true);
    try {
      for (let i = 0; i < PLATFORMS.length; i++) {
        const p = PLATFORMS[i];
        const s = state[p.key];
        const shouldEnable = s.enabled && s.value.trim() !== "";

        if (s.id) {
          // Update existing
          const { error } = await supabase
            .from("social_media_links")
            .update({ value: s.value, enabled: shouldEnable, sort_order: i })
            .eq("id", s.id);
          if (error) throw error;
        } else if (s.value.trim()) {
          // Insert new
          const { data, error } = await supabase
            .from("social_media_links")
            .insert({ platform: p.key, value: s.value, enabled: shouldEnable, sort_order: i, label: p.label })
            .select()
            .single();
          if (error) throw error;
          if (data) updateField(p.key, "id", data.id);
        }
      }

      toast({ title: "Social media settings saved", description: "Changes are now live on the website." });
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted-foreground py-8 text-center">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-xl p-6 space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Social Media Links</h2>
        <p className="text-sm text-muted-foreground">
          Manage social media contact links. Enabled platforms will appear on the website header, footer, and floating contact bar.
        </p>
      </div>

      <div className="space-y-3">
        {PLATFORMS.map((p) => {
          const s = state[p.key];
          const Icon = p.icon;
          return (
            <div
              key={p.key}
              className="glass-strong rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex items-center gap-3 sm:w-36 shrink-0">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon size={20} className="text-primary" weight="bold" />
                </div>
                <span className="font-medium text-foreground">{p.label}</span>
              </div>

              <div className="flex-1 min-w-0">
                <Input
                  value={s.value}
                  onChange={(e) => updateField(p.key, "value", e.target.value)}
                  placeholder={p.placeholder}
                />
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Label className="text-xs text-muted-foreground">{s.enabled ? "Enabled" : "Disabled"}</Label>
                <Switch
                  checked={s.enabled}
                  onCheckedChange={(v) => updateField(p.key, "enabled", v)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Button onClick={handleSave} disabled={saving} className="gap-2">
        <FloppyDisk size={16} />
        {saving ? "Saving…" : "Save Social Media Settings"}
      </Button>
    </div>
  );
};

export default SocialMediaManager;
