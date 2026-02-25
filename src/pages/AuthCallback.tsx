import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState("Signing you in...");

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        setStatus("No authorization code received");
        toast({ title: "Login failed", description: "No authorization code from Google", variant: "destructive" });
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        const redirectUri = `${window.location.origin}/auth/callback`;
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-oauth?action=exchange`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ code, redirect_uri: redirectUri }),
          }
        );

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        if (data.token_hash) {
          // Use verifyOtp with token_hash for magiclink verification
          const { error } = await supabase.auth.verifyOtp({
            token_hash: data.token_hash,
            type: "magiclink",
          });

          if (error) throw error;
        } else {
          throw new Error("No authentication token received");
        }

        toast({ title: "Signed in successfully!" });
        navigate("/");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Sign in failed";
        setStatus(msg);
        toast({ title: "Login failed", description: msg, variant: "destructive" });
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">{status}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
