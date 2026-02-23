import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SealCheck, PencilSimple } from "@phosphor-icons/react";
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

interface DbReview {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
}

const INITIAL_COUNT = 4;
const LOAD_MORE_COUNT = 10;

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
      .select("id, rating, title, comment, created_at, profiles(full_name)")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    setDbReviews((data as unknown as DbReview[]) ?? []);
  };

  useEffect(() => { fetchDbReviews(); }, []);

  // Merge DB reviews (shown first) with static reviews
  const allReviews = useMemo(() => {
    const dbMapped = dbReviews.map((r, i) => ({
      id: r.id,
      user: r.profiles?.full_name || "User",
      country: "🌍",
      rating: r.rating,
      title: r.title || undefined,
      description: r.comment,
      date: r.created_at,
      profile_image: undefined,
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
                <button onClick={() => navigate("/auth")} className="text-primary underline hover:text-primary/80">
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

        <ScrollReveal animation="card" stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleReviews.map((r) => (
            <div key={r.id} className="glass-strong rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {r.profile_image ? (
                    <img src={r.profile_image} alt={r.user} className="h-8 w-8 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {r.user[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground flex items-center gap-1">
                      {r.user.replace(/_/g, " ")}
                      <span title={r.country}>{r.country}</span>
                      <SealCheck size={14} className="text-primary" weight="fill" />
                    </p>
                  </div>
                </div>
                <StarRating rating={r.rating} readonly size={14} />
              </div>
              {r.title && <p className="font-semibold text-foreground text-sm">{r.title}</p>}
              <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
              <p className="text-xs text-muted-foreground/60">{new Date(r.date).toLocaleDateString()}</p>
            </div>
          ))}
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
