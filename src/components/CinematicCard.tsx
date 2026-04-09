import React from "react";

interface CinematicCardProps {
  image: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const CinematicCard: React.FC<CinematicCardProps> = ({
  image,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div className={`cinematic-card group ${className}`}>
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
        decoding="async"
      />

      {/* Dark gradient overlay — always visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500" />

      {/* Neon bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content — slides up & de-blurs on hover */}
      <div className="cinematic-card-content absolute bottom-0 left-0 right-0 p-5 z-10 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-white drop-shadow-lg transition-transform duration-500 ease-out group-hover:-translate-y-1">
          {title}
        </h3>
        <div className="cinematic-card-reveal">
          {description && (
            <p className="text-sm text-white/80 leading-relaxed line-clamp-3">
              {description}
            </p>
          )}
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>

      {/* Hover glow border */}
      <div className="absolute inset-0 rounded-xl border border-primary/0 group-hover:border-primary/30 transition-all duration-500 group-hover:shadow-[inset_0_0_30px_hsl(var(--primary)/0.06),0_0_30px_hsl(var(--primary)/0.1)]" />
    </div>
  );
};

export default CinematicCard;
