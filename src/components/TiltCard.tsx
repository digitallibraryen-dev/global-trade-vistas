import { useTilt } from "@/hooks/useTilt";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

const TiltCard = ({ children, className }: TiltCardProps) => {
  const tiltRef = useTilt<HTMLDivElement>({ max: 6, scale: 1.03, speed: 400 });

  return (
    <div
      ref={tiltRef}
      className={cn("will-change-transform", className)}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
