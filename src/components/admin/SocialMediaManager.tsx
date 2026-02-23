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
  WechatLogo,
  TiktokLogo,
  LinkedinLogo,
  YoutubeLogo,
  XLogo,
  FloppyDisk,
  UploadSimple,
  Trash,
} from "@phosphor-icons/react";

const PLATFORMS = [
  { key: "telegram", label: "Telegram", icon: TelegramLogo, placeholder: "https://t.me/username" },
  { key: "whatsapp", label: "WhatsApp", icon: WhatsappLogo, placeholder: "https://wa.me/1234567890" },
  { key: "instagram", label: "Instagram", icon: InstagramLogo, placeholder: "https://instagram.com/username" },
  { key: "facebook", label: "Facebook", icon: FacebookLogo, placeholder: "https://facebook.com/page" },
  { key: "snapchat", label: "Snapchat", icon: SnapchatLogo, placeholder: "https://snapchat.com/add/username" },
  { key: "tiktok", label: "TikTok", icon: TiktokLogo, placeholder: "https://tiktok.com/@username" },
  { key: "linkedin", label: "LinkedIn", icon: LinkedinLogo, placeholder: "https://linkedin.com/in/username" },
  { key: "youtube", label: "YouTube", icon: YoutubeLogo, placeholder: "https://youtube.com/@channel" },
  { key: "x", label: "X (Twitter)", icon: XLogo, placeholder: "https://x.com/username" },
  { key: "wechat", label: "WeChat", icon: WechatLogo, placeholder: "WeChat ID (optional)", hasQr: true },
] as const;

interface PlatformState {
  id: string | null;
  value: string;
  enabled: boolean;
  qr_code_url: string | null;
}

type StateMap = Record<string, PlatformState>;

const defaultState = (): StateMap =>
  Object.fromEntries(
    PLATFORMS.map((p) => [p.key, { id: null, value: "", enabled: false, qr_code_url: null }])
  );

// Platforms that should NOT be normalized (keep as-is)
const SKIP_NORMALIZE = new Set(["whatsapp", "wechat"]);

// Normalize a raw input into a full URL for the given platform
const normalizePlatformValue = (platform: string, raw: string): string => {
  const v = raw.trim();
  if (!v) return "";
  if (SKIP_NORMALIZE.has(platform)) return v;

  // If already a valid URL, accept it
  try {
    new URL(v);
    return v;
  } catch {
    // not a URL — treat as username
  }

  // Strip leading @ if present
  const handle = v.replace(/^@/, "");
  if (!handle) return "";

  switch (platform) {
    case "telegram":
      return `https://t.me/${handle}`;
    case "instagram":
      return `https://instagram.com/${handle}`;
    case "facebook":
      return `https://facebook.com/${handle}`;
    case "tiktok":
      return `https://tiktok.com/@${handle}`;
    case "youtube":
      return `https://youtube.com/@${handle}`;
    case "x":
      return `https://x.com/${handle}`;
    case "snapchat":
      return `https://snapchat.com/add/${handle}`;
    case "linkedin":
      return `https://linkedin.com/in/${handle}`;
    default:
      return v;
  }
};

const isValidInput = (platform: string, str: string) => {
  const v = str.trim();
  if (!v) return true; // empty is ok
  // WhatsApp & WeChat: accept anything (phone, ID, URL, etc.)
  if (SKIP_NORMALIZE.has(platform)) return true;
  // For other platforms: accept URL, @handle, or plain username
  try { new URL(v); return true; } catch { /* not a url */ }
  // Accept usernames with letters, numbers, dots, underscores, hyphens
  return /^@?[\w.\-]+$/.test(v);
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
              qr_code_url: (row as any).qr_code_url ?? null,
            };
          }
        });
        setState(newState);
        setLoading(false);
      });
  }, []);

  const updateField = (platform: string, field: keyof PlatformState, value: string | boolean | null) => {
    setState((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
  };

  const [uploadingQr, setUploadingQr] = useState(false);

  const handleQrUpload = async (platform: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file only.", variant: "destructive" });
      return;
    }
    setUploadingQr(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${platform}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("qr-codes").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("qr-codes").getPublicUrl(path);
      updateField(platform, "qr_code_url", publicUrl);
      toast({ title: "QR Code uploaded", description: "Remember to save your settings." });
    } catch (err: unknown) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setUploadingQr(false);
    }
  };

  const handleQrDelete = (platform: string) => {
    updateField(platform, "qr_code_url", null);
  };

  const handleSave = async () => {
    // Validate all non-empty values
    for (const p of PLATFORMS) {
      const val = state[p.key].value;
      if (val && !isValidInput(p.key, val)) {
        toast({ title: `Invalid input for ${p.label}`, description: "Please enter a valid URL, @handle, or username.", variant: "destructive" });
        return;
      }
    }

    // Normalize values before saving
    const normalized = { ...state };
    for (const p of PLATFORMS) {
      const val = normalized[p.key].value;
      if (val.trim()) {
        normalized[p.key] = { ...normalized[p.key], value: normalizePlatformValue(p.key, val) };
      }
    }
    setState(normalized);

    setSaving(true);
    try {
      for (let i = 0; i < PLATFORMS.length; i++) {
        const p = PLATFORMS[i];
        const s = normalized[p.key];
        const shouldEnable = s.enabled && (s.value.trim() !== "" || (p.key === "wechat" && !!s.qr_code_url));

        if (s.id) {
          // Update existing
          const { error } = await supabase
            .from("social_media_links")
            .update({ value: s.value, enabled: shouldEnable, sort_order: i, qr_code_url: s.qr_code_url } as any)
            .eq("id", s.id);
          if (error) throw error;
        } else if (s.value.trim() || (p.key === "wechat" && s.qr_code_url)) {
          // Insert new
          const { data, error } = await supabase
            .from("social_media_links")
            .insert({ platform: p.key, value: s.value || p.key, enabled: shouldEnable, sort_order: i, label: p.label, qr_code_url: s.qr_code_url } as any)
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
              className="glass-strong rounded-xl p-5 flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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

              {/* QR Code upload for platforms that support it */}
              {"hasQr" in p && p.hasQr && (
                <div className="ml-0 sm:ml-[9.5rem] border-t border-border/50 pt-4">
                  <Label className="text-sm font-medium text-foreground mb-2 block">QR Code Image</Label>
                  <p className="text-xs text-muted-foreground mb-3">Upload the QR Code image for your {p.label} account</p>
                  
                  {s.qr_code_url ? (
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 rounded-lg border border-border bg-white p-1 flex items-center justify-center">
                        <img src={s.qr_code_url} alt={`${p.label} QR Code`} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary">
                          <UploadSimple size={14} />
                          Replace
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleQrUpload(p.key, file);
                            }}
                          />
                        </label>
                        <button
                          onClick={() => handleQrDelete(p.key)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <Trash size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5">
                      <UploadSimple size={20} />
                      {uploadingQr ? "Uploading..." : "Click to upload QR Code image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingQr}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleQrUpload(p.key, file);
                        }}
                      />
                    </label>
                  )}
                </div>
              )}
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
