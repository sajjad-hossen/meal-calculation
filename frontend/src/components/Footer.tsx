import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Decorative top border beam */}
      <div className="footer-beam" />

      <div className="footer-inner">
        {/* Left — Branding */}
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="url(#fLogoGrad)" />
              <path d="M8 12h16M8 16h16M8 20h10" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              <defs>
                <linearGradient id="fLogoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C3AED" />
                  <stop offset="1" stopColor="#6B21A8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <span className="footer-app-name">BiteBoard</span>
            <span className="footer-app-sub">Meal Management System</span>
          </div>
        </div>

        {/* Center — Developer Credit */}
        <div className="footer-center">
          <p className="footer-built-by">
            Crafted with <span className="footer-heart">♥</span> by{' '}
            <a
              href="https://portfolio-sajjad-self.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-dev-name"
            >
              Sajjad Hossen
            </a>
          </p>
          <p className="footer-copy">&copy; {year} BiteBoard. All rights reserved.</p>
        </div>

        {/* Right — Contact Links */}
        <div className="footer-contacts">
          {/* Portfolio */}
          <a
            href="https://portfolio-sajjad-self.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-pill"
            title="Portfolio"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>Portfolio</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/sajjad-hossen-52139b195/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-pill footer-linkedin"
            title="LinkedIn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span>LinkedIn</span>
          </a>

          {/* Email */}
          <a
            href="mailto:hossensajjad401@gmail.com"
            className="footer-contact-pill footer-email"
            title="Email"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>Email</span>
          </a>

          {/* Phone */}
          <a
            href="tel:+8801751869601"
            className="footer-contact-pill footer-phone"
            title="Phone"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>01751869601</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
