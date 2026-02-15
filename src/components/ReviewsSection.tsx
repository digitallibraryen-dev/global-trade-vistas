import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SealCheck, ChatCircleDots, Trash } from "@phosphor-icons/react";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ParallaxOrbs from "./ParallaxOrbs";

gsap.registerPlugin(ScrollTrigger);

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  created_at: string;
  user_id: string;
  profiles?: { full_name: string | null; avatar_url: string | null; country: string | null } | null;
}

const MAX_COMMENT = 500;

const countryToFlag: Record<string, string> = {
  "Afghanistan": "🇦🇫", "Albania": "🇦🇱", "Algeria": "🇩🇿", "Argentina": "🇦🇷", "Australia": "🇦🇺",
  "Austria": "🇦🇹", "Bahrain": "🇧🇭", "Bangladesh": "🇧🇩", "Belgium": "🇧🇪", "Bolivia": "🇧🇴",
  "Brazil": "🇧🇷", "Canada": "🇨🇦", "Chile": "🇨🇱", "China": "🇨🇳", "Colombia": "🇨🇴",
  "Costa Rica": "🇨🇷", "Cuba": "🇨🇺", "Czech Republic": "🇨🇿", "Denmark": "🇩🇰", "Ecuador": "🇪🇨",
  "Egypt": "🇪🇬", "Estonia": "🇪🇪", "Ethiopia": "🇪🇹", "Finland": "🇫🇮", "France": "🇫🇷",
  "Germany": "🇩🇪", "Ghana": "🇬🇭", "Greece": "🇬🇷", "Guatemala": "🇬🇹", "Honduras": "🇭🇳",
  "Hungary": "🇭🇺", "Iceland": "🇮🇸", "India": "🇮🇳", "Indonesia": "🇮🇩", "Iran": "🇮🇷",
  "Iraq": "🇮🇶", "Ireland": "🇮🇪", "Israel": "🇮🇱", "Italy": "🇮🇹", "Jamaica": "🇯🇲",
  "Japan": "🇯🇵", "Jordan": "🇯🇴", "Kazakhstan": "🇰🇿", "Kenya": "🇰🇪", "Kuwait": "🇰🇼",
  "Latvia": "🇱🇻", "Lebanon": "🇱🇧", "Libya": "🇱🇾", "Lithuania": "🇱🇹", "Malaysia": "🇲🇾",
  "Mexico": "🇲🇽", "Morocco": "🇲🇦", "Myanmar": "🇲🇲", "Nepal": "🇳🇵", "Netherlands": "🇳🇱",
  "New Zealand": "🇳🇿", "Nigeria": "🇳🇬", "Norway": "🇳🇴", "Oman": "🇴🇲", "Pakistan": "🇵🇰",
  "Palestine": "🇵🇸", "Panama": "🇵🇦", "Paraguay": "🇵🇾", "Peru": "🇵🇪", "Philippines": "🇵🇭",
  "Poland": "🇵🇱", "Portugal": "🇵🇹", "Qatar": "🇶🇦", "Romania": "🇷🇴", "Russia": "🇷🇺",
  "Saudi Arabia": "🇸🇦", "Senegal": "🇸🇳", "Singapore": "🇸🇬", "Slovakia": "🇸🇰", "Slovenia": "🇸🇮",
  "Somalia": "🇸🇴", "South Africa": "🇿🇦", "South Korea": "🇰🇷", "Spain": "🇪🇸", "Sri Lanka": "🇱🇰",
  "Sudan": "🇸🇩", "Sweden": "🇸🇪", "Switzerland": "🇨🇭", "Syria": "🇸🇾", "Taiwan": "🇹🇼",
  "Tanzania": "🇹🇿", "Thailand": "🇹🇭", "Tunisia": "🇹🇳", "Turkey": "🇹🇷", "UAE": "🇦🇪",
  "Uganda": "🇺🇬", "Ukraine": "🇺🇦", "United Kingdom": "🇬🇧", "United States": "🇺🇸", "Uruguay": "🇺🇾",
  "Uzbekistan": "🇺🇿", "Venezuela": "🇻🇪", "Vietnam": "🇻🇳", "Yemen": "🇾🇪", "Zimbabwe": "🇿🇼",
};

const ReviewsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewCounts, setReviewCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*, profiles(full_name, avatar_url, country)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(20);
    const reviewsList = (data as unknown as Review[]) ?? [];
    setReviews(reviewsList);
    const counts: Record<string, number> = {};
    reviewsList.forEach((r) => { counts[r.user_id] = (counts[r.user_id] || 0) + 1; });
    setReviewCounts(counts);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  // GSAP timeline for header
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
      });
      tl.from(".reviews-title", { opacity: 0, y: 40, filter: "blur(8px)", duration: 0.8, ease: "power3.out" })
        .from(".reviews-stats", { opacity: 0, y: 25, filter: "blur(4px)", duration: 0.6, ease: "power3.out" }, "-=0.4")
        .from(".reviews-subtitle", { opacity: 0, y: 20, filter: "blur(4px)", duration: 0.5, ease: "power3.out" }, "-=0.3");

      tl.eventCallback("onComplete", () => {
        gsap.set([".reviews-title", ".reviews-stats", ".reviews-subtitle"], { clearProps: "filter" });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // GSAP stagger for review cards
  useEffect(() => {
    if (loading || reviews.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from(".review-card", {
        scrollTrigger: { trigger: ".reviews-grid", start: "top 85%" },
        opacity: 0,
        y: 40,
        filter: "blur(6px)",
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "filter",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0 || !comment.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({ user_id: user.id, rating, title: title.trim() || null, comment: comment.trim() });
    if (error) {
      toast({ title: t("reviews.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("reviews.submitted"), description: t("reviews.submittedDesc") });
      setRating(0); setTitle(""); setComment(""); setShowForm(false);
    }
    setSubmitting(false);
  };

  const handleDelete = async (reviewId: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (error) { toast({ title: t("reviews.error"), description: error.message, variant: "destructive" }); }
    else { toast({ title: t("reviews.deleted") }); fetchReviews(); }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0";

  return (
    <section id="reviews" ref={sectionRef} className="relative section-padding gradient-dark overflow-hidden">
      <ParallaxOrbs variant="accent" />
      <div className="container-narrow relative z-10">
        <div className="text-center mb-12">
          <h2 className="reviews-title text-3xl sm:text-4xl font-bold text-foreground mb-3">{t("reviews.title")}</h2>
          <div className="reviews-stats flex items-center justify-center gap-3 mb-2">
            <StarRating rating={Math.round(Number(avgRating))} readonly size={24} />
            <span className="text-xl font-semibold text-foreground">{avgRating}</span>
            <span className="text-sm text-muted-foreground">({reviews.length} {t("reviews.reviews")})</span>
          </div>
          <p className="reviews-subtitle text-muted-foreground max-w-lg mx-auto">{t("reviews.subtitle")}</p>
        </div>

        {user ? (
          <div className="max-w-xl mx-auto mb-12">
            {!showForm ? (
              <Button onClick={() => setShowForm(true)} className="w-full gap-2"><ChatCircleDots size={18} /> {t("reviews.writeReview")}</Button>
            ) : (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} onSubmit={handleSubmit} className="glass-strong rounded-xl p-6 space-y-4">
                <div className="space-y-2"><Label>{t("reviews.ratingLabel")}</Label><StarRating rating={rating} onChange={setRating} size={28} /></div>
                <div className="space-y-2"><Label htmlFor="review-title">{t("reviews.titleLabel")}</Label><Input id="review-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("reviews.titlePlaceholder")} maxLength={100} /></div>
                <div className="space-y-2">
                  <Label htmlFor="review-comment">{t("reviews.commentLabel")}</Label>
                  <Textarea id="review-comment" value={comment} onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))} placeholder={t("reviews.commentPlaceholder")} rows={4} required />
                  <p className="text-xs text-muted-foreground text-right">{comment.length}/{MAX_COMMENT}</p>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={submitting || rating === 0 || !comment.trim()}>{submitting ? t("reviews.submitting") : t("reviews.submit")}</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t("reviews.cancel")}</Button>
                </div>
              </motion.form>
            )}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground mb-10">
            <a href="/login" className="text-primary hover:underline font-medium">{t("reviews.signInToReview")}</a> {t("reviews.signInToReviewSuffix")}
          </p>
        )}

        {loading ? (
          <p className="text-center text-muted-foreground">{t("reviews.loading")}</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-muted-foreground">{t("reviews.noReviews")}</p>
        ) : (
          <div className="reviews-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.id} className="review-card glass-strong rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {r.profiles?.avatar_url ? (
                      <img src={r.profiles.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{(r.profiles?.full_name || "U")[0].toUpperCase()}</div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        {r.profiles?.full_name || "User"}
                        {r.profiles?.country && countryToFlag[r.profiles.country] && <span title={r.profiles.country}>{countryToFlag[r.profiles.country]}</span>}
                        <SealCheck size={14} className="text-primary" weight="fill" />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reviewCounts[r.user_id] || 1} {(reviewCounts[r.user_id] || 1) === 1 ? t("reviews.review") : t("reviews.reviews")}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={r.rating} readonly size={14} />
                </div>
                {r.title && <p className="font-semibold text-foreground text-sm">{r.title}</p>}
                <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground/60">{new Date(r.created_at).toLocaleDateString()}</p>
                  {user && user.id === r.user_id && (
                    <button onClick={() => handleDelete(r.id)} className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors">
                      <Trash size={12} /> {t("reviews.delete")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
