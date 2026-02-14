import { WhatsappLogo } from "@phosphor-icons/react";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { motion } from "framer-motion";

const WhatsAppButton = () => {
  const { data: links = [], isLoading } = useSocialLinks();
  
  const whatsappLink = links.find((l) => l.platform === "whatsapp" && l.enabled);
  
  if (isLoading || !whatsappLink) return null;

  const number = whatsappLink.value.replace(/[^0-9+]/g, "").replace("+", "");
  const href = `https://wa.me/${number}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg"
      aria-label="Contact us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <WhatsappLogo size={28} weight="fill" className="text-white" />
    </motion.a>
  );
};

export default WhatsAppButton;
