import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  const apiKey = Deno.env.get("BLOG_API_KEY");

  if (!apiKey || !authHeader || authHeader !== `Bearer ${apiKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let title: string | undefined;
    let content: string | undefined;
    let image_url: string | undefined;
    let slug: string | undefined;
    let seo_meta_description: string | undefined;
    let excerpt: string | undefined;
    let published: boolean | undefined;
    let author: string | undefined;
    let category: string | undefined;
    let imageFile: File | null = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      title = formData.get("title") as string | undefined;
      content = formData.get("content") as string | undefined;
      slug = formData.get("slug") as string | undefined;
      seo_meta_description = formData.get("seo_meta_description") as string | undefined;
      excerpt = formData.get("excerpt") as string | undefined;
      author = formData.get("author") as string | undefined;
      category = formData.get("category") as string | undefined;
      image_url = formData.get("image_url") as string | undefined;
      const pubVal = formData.get("published");
      published = pubVal !== null ? pubVal === "true" || pubVal === "1" : undefined;
      const file = formData.get("image");
      if (file && file instanceof File && file.size > 0) {
        imageFile = file;
      }
    } else {
      const body = await req.json();
      title = body.title;
      content = body.content;
      image_url = body.image_url;
      slug = body.slug;
      seo_meta_description = body.seo_meta_description;
      excerpt = body.excerpt;
      published = body.published;
      author = body.author;
      category = body.category;
    }

    if (!title || !slug) {
      return new Response(
        JSON.stringify({ error: "title and slug are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upload image file if provided
    if (imageFile) {
      const ext = imageFile.name.split(".").pop() || "jpg";
      const path = `posts/${Date.now()}-${slug}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(path, imageFile, { contentType: imageFile.type, upsert: true });
      if (uploadError) {
        return new Response(JSON.stringify({ error: `Image upload failed: ${uploadError.message}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(path);
      image_url = urlData.publicUrl;
    }

    const { data, error } = await supabase.from("blog_posts").insert({
      title,
      slug,
      content: content || null,
      image_url: image_url || null,
      excerpt: excerpt || null,
      meta_description: seo_meta_description || null,
      meta_title: title,
      published: published !== undefined ? published : true,
      author: author || "Almonesi Team",
      category: category || "General",
    }).select().single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, post: data }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
