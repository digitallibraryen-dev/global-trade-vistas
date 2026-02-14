import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  value: string;
  enabled: boolean;
  sort_order: number;
}

export const useSocialLinks = () => {
  return useQuery({
    queryKey: ["social-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_media_links")
        .select("*")
        .eq("enabled", true)
        .order("sort_order");
      if (error) throw error;
      return data as SocialLink[];
    },
  });
};
