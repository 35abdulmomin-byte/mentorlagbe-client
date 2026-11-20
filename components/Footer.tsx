import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/Logo";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/how-it-works" },
];

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialClass =
  "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Find verified tutors, join subject-wise batches and grow with
            personalized mentorship, all in one place.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              support@mentorlagbe.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              +880 1234-567890
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Dhaka, Bangladesh
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
            Follow Us
          </h3>
          <div className="flex gap-3">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className={socialClass}
            >
              <XLogo />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className={socialClass}
            >
              f
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={socialClass}
            >
              in
            </a>
          </div>
        </div>
      </div>

      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MentorLagbe. All rights reserved.
        </p>
      </div>
    </footer>
  );
}