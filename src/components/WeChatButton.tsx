import { useState } from "react";
import { WechatLogo, DownloadSimple, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const WeChatButton = ({ variant = "floating" }: { variant?: "floating" | "inline" }) => {
  const [open, setOpen] = useState(false);
  const { data: links = [], isLoading } = useSocialLinks();

  const wechatLink = links.find((l) => l.platform === "wechat" && l.enabled);
  const qrCodeUrl = wechatLink?.qr_code_url;

  if (isLoading || !wechatLink || !qrCodeUrl) return null;

  const handleDownload = async () => {
    try {
      const res = await fetch(qrCodeUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "wechat-qr-code.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(qrCodeUrl, "_blank");
    }
  };

  const triggerButton = variant === "inline" ? (
    <button
      onClick={() => setOpen(true)}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/55 transition-colors duration-200 hover:text-white"
      aria-label="Contact us on WeChat"
    >
      <WechatLogo size={18} weight="fill" />
    </button>
  ) : (
    <motion.button
      onClick={() => setOpen(true)}
      className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#07C160] shadow-lg"
      aria-label="Contact us on WeChat"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <WechatLogo size={28} weight="fill" className="text-white" />
    </motion.button>
  );

  return (
    <>
      {triggerButton}

      {/* QR Code Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07C160]/10">
                  <WechatLogo size={24} weight="fill" className="text-[#07C160]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">WeChat</h3>
                  <p className="text-xs text-muted-foreground">Scan to connect with us</p>
                </div>
              </div>

              {/* QR Code */}
              <div className="mb-4 flex items-center justify-center rounded-xl border border-border bg-white p-4">
                <img
                  src={qrCodeUrl}
                  alt="WeChat QR Code"
                  className="h-auto w-full max-w-[240px] object-contain"
                />
              </div>

              {/* Description */}
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Scan this QR code to add us on WeChat
              </p>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#07C160] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <DownloadSimple size={18} weight="bold" />
                Download QR Code
              </button>

              <p className="mt-3 text-center text-xs text-muted-foreground/70">
                This QR code can also be used for other messaging platforms if needed
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WeChatButton;
