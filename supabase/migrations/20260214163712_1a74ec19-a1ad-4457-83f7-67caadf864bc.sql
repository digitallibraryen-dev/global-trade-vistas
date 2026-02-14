
DROP POLICY "Anyone can read public settings" ON public.site_settings;

CREATE POLICY "Anyone can read public settings"
ON public.site_settings
FOR SELECT
USING (key IN ('google_oauth', 'google_analytics', 'google_tag_manager', 'analytics'));
