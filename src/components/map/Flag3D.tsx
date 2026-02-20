interface Flag3DProps {
  name: string;
  flag: string;
  x: number;
  y: number;
  isHovered: boolean;
  onHover: (name: string | null) => void;
  index: number;
}

const Flag3D = ({ name, flag, x, y, isHovered, onHover, index }: Flag3DProps) => {
  return (
    <div
      className="flag-pin absolute flex flex-col items-center cursor-pointer group"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -100%)",
        perspective: "600px",
      }}
      onMouseEnter={() => onHover(name)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Tooltip */}
      <div
        className={`absolute -top-14 whitespace-nowrap rounded-xl border border-border/40 bg-card/95 backdrop-blur-md px-4 py-2 text-xs font-semibold text-foreground shadow-2xl transition-all duration-400 pointer-events-none z-20 ${
          isHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-90"
        }`}
      >
        <span className="mr-1.5">{flag}</span>
        {name}
        <div className="absolute left-1/2 -bottom-1.5 w-3 h-3 bg-card/95 border-r border-b border-border/40 transform -translate-x-1/2 rotate-45" />
      </div>

      {/* 3D Flag container */}
      <div
        className="relative transition-all duration-500 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isHovered
            ? "rotateY(15deg) rotateX(-10deg) scale(1.3) translateZ(20px)"
            : "rotateY(0deg) rotateX(0deg) scale(1)",
          animation: `floatFlag3D ${3 + index * 0.2}s ease-in-out infinite`,
        }}
      >
        {/* Flag emoji with 3D shadow */}
        <span
          className="text-xl sm:text-2xl md:text-3xl block transition-all duration-300"
          style={{
            filter: isHovered
              ? "drop-shadow(0 8px 16px rgba(0,0,0,0.5)) drop-shadow(0 0 12px hsla(var(--primary), 0.3))"
              : "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
            textShadow: isHovered ? "0 0 20px hsla(var(--primary), 0.4)" : "none",
          }}
        >
          {flag}
        </span>
      </div>

      {/* Pin line with glow */}
      <div className="flex flex-col items-center mt-0.5">
        <div
          className="w-px h-3 transition-all duration-300"
          style={{
            background: isHovered
              ? "linear-gradient(to bottom, hsl(var(--primary)), transparent)"
              : "linear-gradient(to bottom, hsl(var(--primary) / 0.3), transparent)",
          }}
        />
        <div
          className="w-2 h-2 rounded-full transition-all duration-300"
          style={{
            background: isHovered ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.4)",
            boxShadow: isHovered
              ? "0 0 12px hsl(var(--primary) / 0.6), 0 0 24px hsl(var(--primary) / 0.3)"
              : "0 0 6px hsl(var(--primary) / 0.2)",
          }}
        />
      </div>
    </div>
  );
};

export default Flag3D;
