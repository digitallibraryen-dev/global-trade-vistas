import { Star } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
  className?: string;
}

const StarRating = ({ rating, onChange, size = 20, readonly = false, className }: StarRatingProps) => {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(
            "transition-all duration-200",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
        >
          <Star
            size={size}
            weight={star <= rating ? "fill" : "regular"}
            className={cn(
              "transition-colors duration-200",
              star <= rating ? "text-amber-400" : "text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
