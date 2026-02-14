import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Action: get-config - returns client_id and redirect_uri (public info only)
    if (req.method === "GET" && action === "get-config") {
      const { data } = await adminClient
        .from("site_settings")
        .select("value")
        .eq("key", "google_oauth")
        .maybeSingle();

      if (!data?.value) {
        return new Response(JSON.stringify({ enabled: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const config = data.value as Record<string, unknown>;
      return new Response(
        JSON.stringify({
          enabled: !!config.enabled,
          show_on_login: !!config.show_on_login,
          client_id: config.client_id || "",
          scopes: config.scopes || "openid email profile",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: exchange - exchange authorization code for tokens and sign in user
    if (req.method === "POST" && action === "exchange") {
      const { code, redirect_uri } = await req.json();
      if (!code || !redirect_uri) {
        return new Response(JSON.stringify({ error: "code and redirect_uri required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get stored OAuth config
      const { data: settingsData } = await adminClient
        .from("site_settings")
        .select("value")
        .eq("key", "google_oauth")
        .maybeSingle();

      if (!settingsData?.value) {
        return new Response(JSON.stringify({ error: "Google OAuth not configured" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const config = settingsData.value as Record<string, string>;
      const clientId = config.client_id;
      const clientSecret = config.client_secret;

      if (!clientId || !clientSecret) {
        return new Response(JSON.stringify({ error: "OAuth credentials not configured" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Exchange code for tokens with Google
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirect_uri,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenRes.json();
      if (tokenData.error) {
        return new Response(JSON.stringify({ error: tokenData.error_description || tokenData.error }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get user info from Google
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const userInfo = await userInfoRes.json();

      if (!userInfo.email) {
        return new Response(JSON.stringify({ error: "Could not get email from Google" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if user exists, if not create them
      const { data: existingUsers } = await adminClient.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find((u) => u.email === userInfo.email);

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create new user with a random password (they'll use OAuth to sign in)
        const randomPassword = crypto.randomUUID() + crypto.randomUUID();
        const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
          email: userInfo.email,
          email_confirm: true,
          password: randomPassword,
          user_metadata: {
            full_name: userInfo.name,
            avatar_url: userInfo.picture,
          },
        });

        if (createError) {
          return new Response(JSON.stringify({ error: createError.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        userId = newUser.user.id;

        // Assign default role if configured
        const defaultRole = config.default_role || "user";
        if (defaultRole === "admin") {
          await adminClient.from("user_roles").upsert(
            { user_id: userId, role: "admin" },
            { onConflict: "user_id,role" }
          );
        }
      }

      // Generate a session for the user
      // We'll use signInWithPassword won't work since password is random
      // Instead, generate a magic link token or use admin.generateLink
      const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
        type: "magiclink",
        email: userInfo.email,
      });

      if (linkError || !linkData) {
        return new Response(JSON.stringify({ error: linkError?.message || "Failed to generate session" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Extract the token from the generated link
      const token = linkData.properties?.hashed_token;
      const tokenType = "magiclink";

      return new Response(
        JSON.stringify({
          access_token: linkData.properties?.access_token,
          refresh_token: linkData.properties?.refresh_token,
          email: userInfo.email,
          token: token,
          type: tokenType,
          redirect_type: "token",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
