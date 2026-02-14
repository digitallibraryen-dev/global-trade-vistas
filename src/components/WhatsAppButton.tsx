import { WhatsappLogo } from "@phosphor-icons/react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/8612345678901"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label="Contact us on WhatsApp"
    >
      <WhatsappLogo size={28} weight="fill" className="text-white" />
    </a>
  );
};

export default WhatsAppButton;
