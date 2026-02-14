import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller is admin
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) return json({ error: "Unauthorized" }, 401);

    const { data: roleData } = await callerClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) return json({ error: "Forbidden" }, 403);

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // LIST all users
    if (req.method === "GET" && action === "list") {
      const allUsers = [];
      let page = 1;
      while (true) {
        const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 100 });
        if (error) throw error;
        allUsers.push(...data.users);
        if (data.users.length < 100) break;
        page++;
      }

      const { data: roles } = await adminClient.from("user_roles").select("*");

      const users = allUsers.map((u) => {
        const provider = u.app_metadata?.provider || u.app_metadata?.providers?.[0] || "email";
        const name = u.user_metadata?.full_name || u.user_metadata?.name || "";
        return {
          id: u.id,
          email: u.email || "",
          name,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          provider,
          is_admin: roles?.some((r) => r.user_id === u.id && r.role === "admin") ?? false,
          banned: !!u.banned_until,
          banned_until: u.banned_until,
        };
      });

      return json({ users });
    }

    // TOGGLE admin role
    if (req.method === "POST" && action === "toggle-admin") {
      const { userId, makeAdmin } = await req.json();
      if (!userId) throw new Error("userId required");

      if (makeAdmin) {
        const { error } = await adminClient
          .from("user_roles")
          .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
        if (error) throw error;
      } else {
        // Prevent admin from removing own admin role
        if (userId === caller.id) return json({ error: "Cannot remove your own admin role" }, 400);
        const { error } = await adminClient
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin");
        if (error) throw error;
      }
      return json({ success: true });
    }

    // BAN / UNBAN user
    if (req.method === "POST" && action === "toggle-ban") {
      const { userId, ban } = await req.json();
      if (!userId) throw new Error("userId required");
      if (userId === caller.id) return json({ error: "Cannot ban yourself" }, 400);

      if (ban) {
        const { error } = await adminClient.auth.admin.updateUserById(userId, {
          ban_duration: "876000h", // ~100 years
        });
        if (error) throw error;
      } else {
        const { error } = await adminClient.auth.admin.updateUserById(userId, {
          ban_duration: "none",
        });
        if (error) throw error;
      }
      return json({ success: true });
    }

    // DELETE user
    if (req.method === "POST" && action === "delete-user") {
      const { userId } = await req.json();
      if (!userId) throw new Error("userId required");
      if (userId === caller.id) return json({ error: "Cannot delete your own account" }, 400);

      // Remove roles first
      await adminClient.from("user_roles").delete().eq("user_id", userId);
      const { error } = await adminClient.auth.admin.deleteUser(userId);
      if (error) throw error;
      return json({ success: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
});
