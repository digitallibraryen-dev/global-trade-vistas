import { useState, useCallback } from "react";
import {
  InstagramLogo,
  WhatsappLogo,
  TiktokLogo,
  SnapchatLogo,
  WechatLogo,
  TelegramLogo,
  FacebookLogo,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const platformIcon: Record<string, React.ElementType> = {
  instagram: InstagramLogo,
  whatsapp: WhatsappLogo,
  tiktok: TiktokLogo,
  snapchat: SnapchatLogo,
  wechat: WechatLogo,
  telegram: TelegramLogo,
  facebook: FacebookLogo,
};

const platformGlow: Record<string, string> = {
  instagram: "232, 63%, 58%",
  whatsapp: "142, 70%, 49%",
  tiktok: "343, 80%, 56%",
  snapchat: "52, 100%, 50%",
  wechat: "135, 54%, 46%",
  telegram: "200, 80%, 54%",
  facebook: "220, 46%, 48%",
};

const platformAccent: Record<string, string> = {
  instagram: "from-[hsl(330,80%,60%)] via-[hsl(15,90%,55%)] to-[hsl(45,100%,55%)]",
  whatsapp: "from-[hsl(142,70%,45%)] to-[hsl(142,70%,55%)]",
  tiktok: "from-[hsl(343,80%,56%)] to-[hsl(180,80%,56%)]",
  snapchat: "from-[hsl(52,100%,50%)] to-[hsl(45,100%,55%)]",
  wechat: "from-[hsl(135,54%,40%)] to-[hsl(135,54%,50%)]",
  telegram: "from-[hsl(200,80%,50%)] to-[hsl(200,80%,60%)]",
  facebook: "from-[hsl(220,46%,44%)] to-[hsl(220,46%,54%)]",
};

const platformUrl = (platform: string, value: string): string => {
  switch (platform) {
    case "instagram":
      return value.startsWith("http") ? value : `https://instagram.com/${value}`;
    case "whatsapp":
      return value.startsWith("http") ? value : `https://wa.me/${value.replace(/\D/g, "")}`;
    case "tiktok":
      return value.startsWith("http") ? value : `https://tiktok.com/@${value}`;
    case "snapchat":
      return value.startsWith("http") ? value : `https://snapchat.com/add/${value}`;
    case "wechat":
      return "#";
    case "telegram":
      return value.startsWith("http") ? value : `https://t.me/${value.replace(/^@/, "")}`;
    case "facebook":
      return value.startsWith("http") ? value : `https://facebook.com/${value}`;
    default:
      return "#";
  }
};

interface Props {
  size?: number;
  className?: string;
}

const SocialIcon = ({
  platform,
  href,
  title,
  size,
  index,
}: {
  platform: string;
  href: string;
  title: string;
  size: number;
  index: number;
}) => {
  const Icon = platformIcon[platform];
  const [clicked, setClicked] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const glow = platformGlow[platform] || "215, 80%, 50%";

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y }]);
      setClicked(true);

      setTimeout(() => {
        setClicked(false);
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 500);
    },
    []
  );

  if (!Icon) return null;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      onClick={handleClick}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      className="social-icon-btn relative overflow-hidden rounded-xl p-2 transition-colors duration-300 hover:bg-secondary/60"
      style={
        {
          "--glow-color": glow,
        } as React.CSSProperties
      }
    >
      {/* Breathing glow */}
      <span className="social-icon-glow absolute inset-0 rounded-xl pointer-events-none" />

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x - 8,
              top: ripple.y - 8,
              width: 16,
              height: 16,
              background: `hsl(${glow} / 0.35)`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Click glow burst */}
      <AnimatePresence>
        {clicked && (
          <motion.span
            initial={{ opacity: 0.6, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              boxShadow: `0 0 24px hsl(${glow} / 0.6)`,
            }}
          />
        )}
      </AnimatePresence>

      <Icon size={size} weight="regular" className="relative z-10 social-icon-inner" />
    </motion.a>
  );
};

const SocialIcons = ({ size = 20, className = "" }: Props) => {
  const { data: links = [] } = useSocialLinks();

  if (links.length === 0) return null;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {links.filter((link) => link.platform !== "wechat").map((link, i) => {
        const href = platformUrl(link.platform, link.value);
        return (
          <SocialIcon
            key={link.id}
            platform={link.platform}
            href={href}
            title={link.label || link.platform}
            size={size}
            index={i}
          />
        );
      })}
    </div>
  );
};

export default SocialIcons;
