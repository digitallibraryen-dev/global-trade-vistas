import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Quotes, ArrowLeft, ArrowRight, PencilSimple, SealCheck } from "@phosphor-icons/react";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { staticReviewsSorted, type StaticReview } from "@/data/staticReviews";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getCountryFlag } from "@/lib/countryFlag";
import reviewsBg from "@/assets/reviews-bg.jpg";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface DbReview {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  created_at: string;
  profiles: { full_name: string | null; country: string | null; avatar_url: string | null } | null;
}

const ReviewsSection = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
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
      verified: true,
    }));
    const staticMapped = staticReviewsSorted.map((r) => ({ ...r, verified: false }));
    return [...dbMapped, ...staticMapped];
  }, [dbReviews]);

  // Pick top-rated reviews for the cinematic display
  const featuredReviews = useMemo(() => {
    return allReviews.filter((r) => r.rating >= 4).slice(0, 8);
  }, [allReviews]);

  const current = featuredReviews[activeIndex] || featuredReviews[0];

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % featuredReviews.length);
  }, [featuredReviews.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + featuredReviews.length) % featuredReviews.length);
  }, [featuredReviews.length]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  // GSAP scroll animations
  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const content = contentRef.current;
    if (!section || !bg || !content) return;

    const ctx = gsap.context(() => {
      // Background zoom
      gsap.fromTo(bg,
        { scale: 1.15 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Content reveal
      const elements = content.querySelectorAll("[data-reveal]");
      gsap.fromTo(elements,
        { y: 60, opacity: 0, filter: "blur(12px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const avgRating =
    allReviews.length > 0
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
      : "0";

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background image with overlay */}
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform">
        <img
          src={reviewsBg}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 text-center">
        {/* Section header */}
        <div data-reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium mb-4">
            {t("reviews.title")}
          </p>
        </div>

        <div data-reveal className="flex items-center justify-center gap-3 mb-10">
          <StarRating rating={Math.round(Number(avgRating))} readonly size={20} />
          <span className="text-lg font-semibold text-foreground">{avgRating}</span>
          <span className="text-sm text-muted-foreground">
            ({allReviews.length} {t("reviews.reviews")})
          </span>
        </div>

        {/* Quote icon */}
        <div data-reveal className="mb-6">
          <Quotes
            size={48}
            weight="fill"
            className="text-primary/30 mx-auto"
          />
        </div>

        {/* Testimonial */}
        <div data-reveal className="min-h-[160px] flex flex-col items-center justify-center">
          <blockquote
            key={current?.id}
            className="animate-fade-in"
          >
            {current?.title && (
              <p className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                "{current.title}"
              </p>
            )}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto italic">
              "{current?.description}"
            </p>
          </blockquote>

          <div className="mt-6 flex items-center gap-3 justify-center animate-fade-in">
            {current?.profile_image ? (
              <img
                src={current.profile_image}
                alt={current.user}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary ring-2 ring-primary/30">
                {current?.user?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="text-left">
              <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                {current?.user?.replace(/_/g, " ")} {current?.country}
                {current?.verified && (
                  <span title={t("reviews.verified")}>
                    <SealCheck size={16} weight="fill" className="text-primary shrink-0" />
                  </span>
                )}
              </p>
              <StarRating rating={current?.rating || 5} readonly size={12} />
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <div data-reveal className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={goPrev}
            className="h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center text-foreground hover:bg-primary/10 transition-colors"
            aria-label="Previous review"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs text-muted-foreground tabular-nums">
            {activeIndex + 1} / {featuredReviews.length}
          </span>
          <button
            onClick={goNext}
            className="h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center text-foreground hover:bg-primary/10 transition-colors"
            aria-label="Next review"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* CTA buttons */}
        <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {user ? (
            <Button
              onClick={() => setShowForm((v) => !v)}
              size="lg"
              className="gap-2 shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
            >
              <PencilSimple size={18} weight="bold" />
              {t("reviews.writeReview")}
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              size="lg"
              className="shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
            >
              {t("reviews.signInToReview")}
            </Button>
          )}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setShowAll((v) => !v)}
            className="text-primary hover:text-primary/80"
          >
            {showAll ? "▲" : "▼"} {t("reviews.viewAll")} ({allReviews.length})
          </Button>
        </div>

        {/* All reviews grid */}
        {showAll && (
          <div className="mt-10 max-w-3xl mx-auto animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allReviews.slice(0, visibleCount).map((r) => (
                <div
                  key={r.id}
                  className="bg-background/40 backdrop-blur-md border border-border/30 rounded-xl p-4 text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {r.profile_image ? (
                      <img src={r.profile_image} alt={r.user} className="h-8 w-8 rounded-full object-cover ring-1 ring-primary/20" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary ring-1 ring-primary/20">
                        {r.user?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate flex items-center gap-1">
                        {r.user?.replace(/_/g, " ")} {r.country}
                        {r.verified && (
                          <span title={t("reviews.verified")}>
                            <SealCheck size={13} weight="fill" className="text-primary shrink-0" />
                          </span>
                        )}
                      </p>
                      <StarRating rating={r.rating} readonly size={10} />
                    </div>
                  </div>
                  {r.title && <p className="text-sm font-semibold text-foreground mb-1">"{r.title}"</p>}
                  <p className="text-xs text-muted-foreground line-clamp-3">{r.description}</p>
                </div>
              ))}
            </div>
            {visibleCount < allReviews.length && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((c) => Math.min(c + 10, allReviews.length))}
                className="mt-6 shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
              >
                {t("reviews.viewMore", { count: Math.min(10, allReviews.length - visibleCount) })} ▼
              </Button>
            )}
          </div>
        )}

        {/* Review form */}
        {showForm && user && (
          <div className="mt-8 bg-background/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 space-y-4 max-w-lg mx-auto text-left animate-fade-in">
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
      </div>
    </section>
  );
};

export default ReviewsSection;
