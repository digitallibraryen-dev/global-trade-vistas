ALTER TABLE public.social_media_links DROP CONSTRAINT social_media_links_platform_check;

ALTER TABLE public.social_media_links ADD CONSTRAINT social_media_links_platform_check CHECK (platform = ANY (ARRAY['instagram','whatsapp','tiktok','snapchat','wechat','telegram','facebook','linkedin','youtube','x']));