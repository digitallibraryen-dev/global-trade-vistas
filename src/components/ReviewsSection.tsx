import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SealCheck, PencilSimple, Quotes } from "@phosphor-icons/react";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ScrollReveal from "./ScrollReveal";
import { staticReviewsSorted, type StaticReview } from "@/data/staticReviews";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getCountryFlag } from "@/lib/countryFlag";

interface DbReview {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  created_at: string;
  profiles: { full_name: string | null; country: string | null; avatar_url: string | null } | null;
}

const INITIAL_COUNT = 4;
const LOAD_MORE_COUNT = 10;

/* Deterministic accent colors for review cards */
const ACCENT_HUES = [210, 260, 330, 170, 30, 290];

const ReviewsSection = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dbReviews, setDbReviews] = useState<DbReview[]>([]);

  const fetchDbReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("id, rating, title, comment, created_at, profiles(full_name, country, avatar_url)")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    setDbReviews((data as unknown as DbReview[]) ?? []);
  };

  useEffect(() => { fetchDbReviews(); }, []);

  const allReviews = useMemo(() => {
    const dbMapped = dbReviews.map((r) => ({
      id: r.id,
      user: r.profiles?.full_name || "User",
      country: getCountryFlag(r.profiles?.country),
      rating: r.rating,
      title: r.title || undefined,
      description: r.comment,
      date: r.created_at,
      profile_image: r.profiles?.avatar_url || undefined,
    }));
    return [...dbMapped, ...staticReviewsSorted];
  }, [dbReviews]);

  const visibleReviews = allReviews.slice(0, visibleCount);
  const hasMore = visibleCount < allReviews.length;

  const avgRating =
    allReviews.length > 0
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
      : "0";

  return (
    <section id="reviews" className="section-padding gradient-dark">
      <div className="container-narrow">
        <ScrollReveal animation="headline" className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{t("reviews.title")}</h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <StarRating rating={Math.round(Number(avgRating))} readonly size={24} />
            <span className="text-xl font-semibold text-foreground">{avgRating}</span>
            <span className="text-sm text-muted-foreground">({allReviews.length} {t("reviews.reviews")})</span>
          </div>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("reviews.subtitle")}</p>
          <div className="mt-4">
            {user ? (
              <Button onClick={() => setShowForm((v) => !v)} className="gap-2">
                <PencilSimple size={16} weight="bold" />
                {t("reviews.writeReview")}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                <button onClick={() => navigate("/login")} className="text-primary underline hover:text-primary/80">
                  {t("reviews.signInToReview")}
                </button>{" "}
                {t("reviews.signInToReviewSuffix")}
              </p>
            )}
          </div>
        </ScrollReveal>

        {showForm && user && (
          <div className="glass-strong rounded-xl p-5 mb-8 space-y-4 max-w-lg mx-auto">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("reviews.ratingLabel")}</label>
              <StarRating rating={rating} onChange={setRating} size={24} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("reviews.titleLabel")}</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("reviews.titlePlaceholder")} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("reviews.commentLabel")}</label>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t("reviews.commentPlaceholder")} rows={4} />
            </div>
            <div className="flex gap-2">
              <Button
                disabled={submitting || !comment.trim()}
                onClick={async () => {
                  setSubmitting(true);
                  const { error } = await supabase.from("reviews").insert({
                    user_id: user.id,
                    rating,
                    title: title.trim() || null,
                    comment: comment.trim(),
                  });
                  setSubmitting(false);
                  if (error) {
                    toast({ title: t("reviews.error"), description: error.message, variant: "destructive" });
                  } else {
                    toast({ title: t("reviews.submitted"), description: t("reviews.submittedDesc") });
                    setShowForm(false);
                    setRating(5);
                    setTitle("");
                    setComment("");
                  }
                }}
              >
                {submitting ? t("reviews.submitting") : t("reviews.submit")}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>{t("reviews.cancel")}</Button>
            </div>
          </div>
        )}

        <ScrollReveal animation="card" stagger={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleReviews.map((r, idx) => {
            const hue = ACCENT_HUES[idx % ACCENT_HUES.length];
            return (
              <div
                key={r.id}
                className="review-cinematic-card group relative rounded-xl overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, hsl(${hue} 40% 8% / 0.5), hsl(var(--background)) 60%)`,
                }}
              >
                {/* Decorative quote icon */}
                <Quotes
                  size={64}
                  weight="fill"
                  className="absolute top-3 right-3 text-primary/[0.07] group-hover:text-primary/[0.15] transition-colors duration-500"
                />

                {/* Glow accent line at top */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)`,
                  }}
                />

                <div className="relative z-10 p-5 space-y-4">
                  {/* Header: avatar + name + rating */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {r.profile_image ? (
                        <img
                          src={r.profile_image}
                          alt={r.user}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                          {r.user[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          {r.user.replace(/_/g, " ")}
                          <span title={r.country}>{r.country}</span>
                          <SealCheck size={14} className="text-primary" weight="fill" />
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">
                          {new Date(r.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={r.rating} readonly size={14} />
                  </div>

                  {/* Title */}
                  {r.title && (
                    <p className="font-semibold text-foreground text-sm leading-snug">{r.title}</p>
                  )}

                  {/* Comment */}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                    {r.description}
                  </p>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_40px_hsl(var(--primary)/0.04),0_0_30px_hsl(var(--primary)/0.06)]" />
              </div>
            );
          })}
        </ScrollReveal>

        {hasMore && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, allReviews.length))}
            >
              {t("reviews.loadMore", "Load More")} ({allReviews.length - visibleCount} {t("reviews.remaining", "remaining")})
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
