import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";

const footerLinks = {
  explore: [
    { name: "Desert Safari", href: "/activity/dubai-desert-safari" },
    { name: "Burj Khalifa", href: "/activity/burj-khalifa-at-the-top" },
    { name: "Yacht Tours", href: "/activity/luxury-yacht-cruise" },
    { name: "Dubai Fountain", href: "/activity/dubai-fountain-show" },
    { name: "Theme Parks", href: "/tours?category=Theme Parks" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Partner With Us", href: "/partners" },
    { name: "Affiliate Program", href: "/affiliate" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "Cancellation Policy", href: "/cancellation" },
    { name: "FAQs", href: "/faqs" },
    { name: "Travel Guides", href: "/guides" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Refund Policy", href: "/refunds" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com" },
];

export function Footer() {
  return (
    <footer className="bg-ocean-dark text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center">
                <span className="text-ocean-dark font-serif font-bold text-xl">BV</span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl">Better View</h3>
                <p className="text-xs tracking-widest uppercase text-primary-foreground/70">Tourism</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Your trusted partner for discovering Dubai's most iconic experiences. 
              From desert adventures to luxury cruises, we make every moment unforgettable.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:+971501234567" className="flex items-center gap-3 text-primary-foreground/80 hover:text-gold transition-colors">
                <Phone className="h-4 w-4 text-gold" />
                +971 50 123 4567
              </a>
              <a href="mailto:hello@betterview.ae" className="flex items-center gap-3 text-primary-foreground/80 hover:text-gold transition-colors">
                <Mail className="h-4 w-4 text-gold" />
                hello@betterview.ae
              </a>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <MapPin className="h-4 w-4 text-gold" />
                Downtown Dubai, UAE
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Clock className="h-4 w-4 text-gold" />
                24/7 Customer Support
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-gold mb-4">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © 2025 Better View Tourism. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold hover:text-ocean-dark transition-all"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
