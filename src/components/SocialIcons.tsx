import {
  InstagramLogo,
  WhatsappLogo,
  TiktokLogo,
  SnapchatLogo,
  WechatLogo,
} from "@phosphor-icons/react";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const platformIcon: Record<string, React.ElementType> = {
  instagram: InstagramLogo,
  whatsapp: WhatsappLogo,
  tiktok: TiktokLogo,
  snapchat: SnapchatLogo,
  wechat: WechatLogo,
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
      return "#"; // WeChat doesn't have direct web links
    default:
      return "#";
  }
};

interface Props {
  size?: number;
  className?: string;
}

const SocialIcons = ({ size = 20, className = "" }: Props) => {
  const { data: links = [] } = useSocialLinks();

  if (links.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((link) => {
        const Icon = platformIcon[link.platform];
        if (!Icon) return null;
        const href = platformUrl(link.platform, link.value);
        return (
          <a
            key={link.id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={link.label || link.platform}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-primary hover:bg-secondary"
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialIcons;
