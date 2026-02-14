import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { SealCheck, ChatCircleDots, Trash } from "@phosphor-icons/react";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
    
    // Count reviews per user
    const counts: Record<string, number> = {};
    reviewsList.forEach((r) => {
      counts[r.user_id] = (counts[r.user_id] || 0) + 1;
    });
    setReviewCounts(counts);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0 || !comment.trim()) return;
    setSubmitting(true);

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      rating,
      title: title.trim() || null,
      comment: comment.trim(),
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Review submitted for moderation",
        description: "Your review will appear after admin approval.",
      });
      setRating(0);
      setTitle("");
      setComment("");
      setShowForm(false);
    }
    setSubmitting(false);
  };

  const handleDelete = async (reviewId: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Review deleted" });
      fetchReviews();
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <section id="reviews" className="section-padding gradient-dark">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Customer Reviews
          </h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <StarRating rating={Math.round(Number(avgRating))} readonly size={24} />
            <span className="text-xl font-semibold text-foreground">{avgRating}</span>
            <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
          </div>
          <p className="text-muted-foreground max-w-lg mx-auto">
            See what our customers say about our services
          </p>
        </motion.div>

        {/* Review Form */}
        {user ? (
          <div className="max-w-xl mx-auto mb-12">
            {!showForm ? (
              <Button onClick={() => setShowForm(true)} className="w-full gap-2">
                <ChatCircleDots size={18} /> Write a Review
              </Button>
            ) : (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                onSubmit={handleSubmit}
                className="glass-strong rounded-xl p-6 space-y-4"
              >
                <div className="space-y-2">
                  <Label>Rating *</Label>
                  <StarRating rating={rating} onChange={setRating} size={28} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-title">Title (optional)</Label>
                  <Input
                    id="review-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-comment">Your Review *</Label>
                  <Textarea
                    id="review-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
                    placeholder="Tell us about your experience..."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {comment.length}/{MAX_COMMENT}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={submitting || rating === 0 || !comment.trim()}>
                    {submitting ? "Submitting…" : "Submit Review"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </motion.form>
            )}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground mb-10">
            <a href="/login" className="text-primary hover:underline font-medium">Sign in</a> to leave a review
          </p>
        )}

        {/* Reviews Grid */}
        {loading ? (
          <p className="text-center text-muted-foreground">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-muted-foreground">No reviews yet. Be the first!</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-strong rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {r.profiles?.avatar_url ? (
                        <img src={r.profiles.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {(r.profiles?.full_name || "U")[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground flex items-center gap-1">
                          {r.profiles?.full_name || "User"}
                          {r.profiles?.country && countryToFlag[r.profiles.country] && (
                            <span title={r.profiles.country}>{countryToFlag[r.profiles.country]}</span>
                          )}
                          <SealCheck size={14} className="text-primary" weight="fill" />
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {reviewCounts[r.user_id] || 1} {(reviewCounts[r.user_id] || 1) === 1 ? "review" : "reviews"}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={r.rating} readonly size={14} />
                  </div>
                  {r.title && <p className="font-semibold text-foreground text-sm">{r.title}</p>}
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground/60">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                    {user && user.id === r.user_id && (
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors"
                      >
                        <Trash size={12} /> Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
