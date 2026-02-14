import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

const getStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
const colors = [
  "bg-destructive",
  "bg-orange-400",
  "bg-amber-400",
  "bg-emerald-400",
  "bg-emerald-500",
];

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  if (!password) return null;
  const strength = getStrength(password);
  const index = Math.max(0, strength - 1);

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              i <= index ? colors[index] : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs", strength <= 2 ? "text-destructive" : "text-muted-foreground")}>
        {labels[index]}
      </p>
    </div>
  );
};

export default PasswordStrength;
