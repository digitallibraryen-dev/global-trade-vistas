import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

const AdminAccountManager = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!email.trim() || !password) return;
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await supabase.functions.invoke("create-admin", {
        body: { email: email.trim(), password },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (resp.error) throw resp.error;
      if (resp.data?.error) throw new Error(resp.data.error);

      toast({ title: "Admin account created", description: `${email.trim()} can now sign in.` });
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="glass-strong rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Plus className="h-5 w-5" /> Add Admin Account
      </h2>
      <div className="space-y-3 max-w-md">
        <div>
          <Label htmlFor="admin-email">Email</Label>
          <Input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="newadmin@example.com"
          />
        </div>
        <div>
          <Label htmlFor="admin-pass">Password</Label>
          <Input
            id="admin-pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
            minLength={6}
          />
        </div>
        <div>
          <Label htmlFor="admin-pass-confirm">Confirm Password</Label>
          <Input
            id="admin-pass-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
          />
        </div>
        <Button onClick={handleCreate} disabled={saving || !email.trim() || !password}>
          {saving ? "Creating…" : "Create Admin"}
        </Button>
      </div>
    </section>
  );
};

export default AdminAccountManager;
