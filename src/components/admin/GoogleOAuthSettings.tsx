import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GoogleLogo, Copy, FloppyDisk } from "@phosphor-icons/react";

interface OAuthConfig {
  enabled: boolean;
  show_on_login: boolean;
  client_id: string;
  client_secret: string;
  scopes: string;
  default_role: string;
}

const defaults: OAuthConfig = {
  enabled: false,
  show_on_login: false,
  client_id: "",
  client_secret: "",
  scopes: "openid email profile",
  default_role: "user",
};

const GoogleOAuthSettings = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<OAuthConfig>(defaults);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const redirectUri = `${window.location.origin}/auth/callback`;

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "google_oauth")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setConfig({ ...defaults, ...(data.value as unknown as Partial<OAuthConfig>) });
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert([{ key: "google_oauth", value: JSON.parse(JSON.stringify(config)) }], { onConflict: "key" });
      if (error) throw error;
      toast({ title: "Google OAuth settings saved" });
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const copyRedirect = () => {
    navigator.clipboard.writeText(redirectUri);
    toast({ title: "Copied to clipboard" });
  };

  if (loading) return <p className="text-muted-foreground py-8 text-center">Loading...</p>;

  return (
    <div className="glass-strong rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <GoogleLogo size={22} className="text-primary" weight="bold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Google OAuth Settings</h2>
          <p className="text-sm text-muted-foreground">Configure Google Sign-In for your application. Get credentials from Google Cloud Console</p>
        </div>
      </div>

      <div className="space-y-5 max-w-lg">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Enable Google OAuth</Label>
            <p className="text-xs text-muted-foreground">Allow users to sign in with their Google account</p>
          </div>
          <Switch checked={config.enabled} onCheckedChange={(v) => setConfig({ ...config, enabled: v })} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Show on Login Page</Label>
            <p className="text-xs text-muted-foreground">Display Google sign-in button on login/register pages</p>
          </div>
          <Switch checked={config.show_on_login} onCheckedChange={(v) => setConfig({ ...config, show_on_login: v })} />
        </div>

        <div className="space-y-2">
          <Label>Client ID</Label>
          <Input
            value={config.client_id}
            onChange={(e) => setConfig({ ...config, client_id: e.target.value })}
            placeholder="your-client-id.apps.googleusercontent.com"
          />
        </div>

        <div className="space-y-2">
          <Label>Client Secret</Label>
          <Input
            type="password"
            value={config.client_secret}
            onChange={(e) => setConfig({ ...config, client_secret: e.target.value })}
            placeholder="GOCSPX-..."
          />
          <p className="text-xs text-muted-foreground">Stored securely in encrypted settings</p>
        </div>

        <div className="space-y-2">
          <Label>Redirect URI</Label>
          <div className="flex gap-2">
            <Input value={redirectUri} readOnly className="bg-muted" />
            <Button variant="outline" size="icon" onClick={copyRedirect}><Copy size={16} /></Button>
          </div>
          <p className="text-xs text-muted-foreground">Add this URI to your Google Cloud Console authorized redirect URIs</p>
        </div>

        <div className="space-y-2">
          <Label>OAuth Scopes</Label>
          <Input
            value={config.scopes}
            onChange={(e) => setConfig({ ...config, scopes: e.target.value })}
            placeholder="openid email profile"
          />
          <p className="text-xs text-muted-foreground">Space-separated list of OAuth scopes</p>
        </div>

        <div className="space-y-2">
          <Label>Default User Role</Label>
          <Input
            value={config.default_role}
            onChange={(e) => setConfig({ ...config, default_role: e.target.value })}
            placeholder="user"
          />
          <p className="text-xs text-muted-foreground">Role assigned to new users who sign in with Google</p>
        </div>

        <Button onClick={save} disabled={saving}>
          <FloppyDisk size={16} className="mr-2" />
          {saving ? "Saving…" : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default GoogleOAuthSettings;
