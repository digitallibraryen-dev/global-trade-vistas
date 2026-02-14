import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChartLine, FloppyDisk } from "@phosphor-icons/react";

interface AnalyticsConfig {
  ga_enabled: boolean;
  ga_measurement_id: string;
  gtm_enabled: boolean;
  gtm_container_id: string;
}

const defaults: AnalyticsConfig = {
  ga_enabled: false,
  ga_measurement_id: "",
  gtm_enabled: false,
  gtm_container_id: "",
};

const AnalyticsSettings = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<AnalyticsConfig>(defaults);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "analytics")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setConfig({ ...defaults, ...(data.value as unknown as Partial<AnalyticsConfig>) });
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert([{ key: "analytics", value: JSON.parse(JSON.stringify(config)) }], { onConflict: "key" });
      if (error) throw error;
      toast({ title: "Analytics settings saved" });
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted-foreground py-8 text-center">Loading...</p>;

  return (
    <div className="glass-strong rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <ChartLine size={22} className="text-primary" weight="bold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Analytics Settings</h2>
          <p className="text-sm text-muted-foreground">Configure Google Analytics and Tag Manager for your website</p>
        </div>
      </div>

      <div className="space-y-6 max-w-lg">
        {/* GA4 */}
        <div className="space-y-4 p-4 rounded-lg border border-border">
          <h3 className="font-medium text-foreground">Google Analytics 4</h3>
          <p className="text-xs text-muted-foreground">Track website traffic and user behavior</p>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Enable Google Analytics</Label>
              <p className="text-xs text-muted-foreground">Load GA4 tracking script on all pages</p>
            </div>
            <Switch checked={config.ga_enabled} onCheckedChange={(v) => setConfig({ ...config, ga_enabled: v })} />
          </div>

          <div className="space-y-2">
            <Label>Measurement ID</Label>
            <Input
              value={config.ga_measurement_id}
              onChange={(e) => setConfig({ ...config, ga_measurement_id: e.target.value })}
              placeholder="G-XXXXXXXXXX"
            />
          </div>
        </div>

        {/* GTM */}
        <div className="space-y-4 p-4 rounded-lg border border-border">
          <h3 className="font-medium text-foreground">Google Tag Manager</h3>
          <p className="text-xs text-muted-foreground">Manage all your tracking tags in one place</p>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Enable Tag Manager</Label>
              <p className="text-xs text-muted-foreground">Load GTM container on all pages</p>
            </div>
            <Switch checked={config.gtm_enabled} onCheckedChange={(v) => setConfig({ ...config, gtm_enabled: v })} />
          </div>

          <div className="space-y-2">
            <Label>Container ID</Label>
            <Input
              value={config.gtm_container_id}
              onChange={(e) => setConfig({ ...config, gtm_container_id: e.target.value })}
              placeholder="GTM-XXXXXXX"
            />
          </div>
        </div>

        {/* Privacy note */}
        <div className="rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground text-sm">Privacy Considerations</p>
          <p>Analytics tracking is subject to user consent. Consider updating your privacy policy to reflect the use of these tracking services.</p>
        </div>

        <Button onClick={save} disabled={saving}>
          <FloppyDisk size={16} className="mr-2" />
          {saving ? "Saving…" : "Save Analytics Settings"}
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsSettings;
