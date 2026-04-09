import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";

interface FlipCardProps {
  frontImage: string;
  frontTitle: string;
  backDescription?: string;
  backAction?: React.ReactNode;
  className?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  frontImage,
  frontTitle,
  backDescription,
  backAction,
  className = "",
}) => {
  const [flipped, setFlipped] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <div
      className={`flip-card group ${className}`}
      onMouseEnter={() => !isMobile && setFlipped(true)}
      onMouseLeave={() => !isMobile && setFlipped(false)}
      onClick={() => isMobile && setFlipped((f) => !f)}
    >
      <div className={`flip-card-inner ${flipped ? "is-flipped" : ""}`}>
        {/* ── FRONT ── */}
        <div className="flip-card-face flip-card-front">
          <img
            src={frontImage}
            alt={frontTitle}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {/* gradient veil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          {/* neon edge line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <h3 className="text-lg font-bold text-white drop-shadow-lg">
              {frontTitle}
            </h3>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-primary opacity-80">
              {isMobile ? (t("flipCard.tapHint", "Tap to flip ↻")) : (t("flipCard.hoverHint", "Hover to explore →"))}
            </p>
          </div>
        </div>

        {/* ── BACK ── */}
        <div className="flip-card-face flip-card-back">
          {/* glassmorphism panel */}
          <div className="absolute inset-0 rounded-xl bg-background/60 backdrop-blur-xl" />
          {/* neon border glow */}
          <div className="absolute inset-0 rounded-xl border border-primary/30 shadow-[inset_0_0_30px_hsl(var(--primary)/0.08),0_0_40px_hsl(var(--primary)/0.12)]" />
          {/* animated corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-xl" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center gap-4">
            <h3 className="text-lg font-bold text-foreground">{frontTitle}</h3>
            {backDescription && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {backDescription}
              </p>
            )}
            {backAction}
            {isMobile && (
              <p className="text-[10px] uppercase tracking-widest text-primary/60 mt-1">
                {t("flipCard.tapBack", "Tap to flip back ↻")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
