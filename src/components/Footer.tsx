const Footer = () => {
  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6 lg:px-8">
      <div className="container-narrow flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Almonesi Global Trade. All rights reserved.
        </div>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
