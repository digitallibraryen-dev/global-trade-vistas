import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SealCheck } from "@phosphor-icons/react";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";
import ScrollReveal from "./ScrollReveal";
import { staticReviewsSorted, type StaticReview } from "@/data/staticReviews";

const INITIAL_COUNT = 4;
const LOAD_MORE_COUNT = 10;

const ReviewsSection = () => {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visibleReviews = staticReviewsSorted.slice(0, visibleCount);
  const hasMore = visibleCount < staticReviewsSorted.length;

  const avgRating =
    staticReviewsSorted.length > 0
      ? (staticReviewsSorted.reduce((sum, r) => sum + r.rating, 0) / staticReviewsSorted.length).toFixed(1)
      : "0";

  return (
    <section id="reviews" className="section-padding gradient-dark">
      <div className="container-narrow">
        <ScrollReveal animation="headline" className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{t("reviews.title")}</h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <StarRating rating={Math.round(Number(avgRating))} readonly size={24} />
            <span className="text-xl font-semibold text-foreground">{avgRating}</span>
            <span className="text-sm text-muted-foreground">({staticReviewsSorted.length} {t("reviews.reviews")})</span>
          </div>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("reviews.subtitle")}</p>
        </ScrollReveal>

        <ScrollReveal animation="card" stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleReviews.map((r: StaticReview) => (
            <div key={r.id} className="glass-strong rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                  {r.profileImage ? (
                    <img
                      src={r.profileImage}
                      alt={r.user}
                      className="h-8 w-8 rounded-full object-cover bg-primary/10"
                      loading="lazy"
                    />
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
              onClick={() => setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, staticReviewsSorted.length))}
            >
              {t("reviews.loadMore", "Load More")} ({staticReviewsSorted.length - visibleCount} {t("reviews.remaining", "remaining")})
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
