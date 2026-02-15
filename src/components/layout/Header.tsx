import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Tours", href: "/tours" },
  { name: "Combo Deals", href: "/combo-deals" },
  { name: "AI Trip Planner", href: "/trip-planner" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isScrolled = !isHome;

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-ocean-dark text-primary-foreground py-2">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+971501234567" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Phone className="h-4 w-4" />
              +971 50 123 4567
            </a>
            <a href="mailto:hello@betterview.ae" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Mail className="h-4 w-4" />
              hello@betterview.ae
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gold font-medium">24/7 Customer Support</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-card/95 backdrop-blur-md shadow-card border-b border-border"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform">
                  <span className="text-ocean-dark font-serif font-bold text-xl">BV</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className={cn(
                  "font-serif font-bold text-xl tracking-tight",
                  isScrolled ? "text-foreground" : "text-primary-foreground"
                )}>
                  Better View
                </h1>
                <p className={cn(
                  "text-xs tracking-widest uppercase",
                  isScrolled ? "text-muted-foreground" : "text-primary-foreground/80"
                )}>
                  Tourism
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "font-medium transition-colors relative group",
                    isScrolled
                      ? "text-foreground hover:text-gold"
                      : "text-primary-foreground hover:text-gold",
                    location.pathname === link.href && "text-gold"
                  )}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Cart & CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <CartDrawer />
              <Button variant="gold" size="lg" asChild>
                <Link to="/tours">Book Now</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors",
                isScrolled ? "text-foreground" : "text-primary-foreground"
              )}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-card border-t border-border"
            >
              <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "font-medium py-3 px-4 rounded-lg transition-colors",
                      location.pathname === link.href
                        ? "bg-gold/10 text-gold"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <Button variant="gold" size="lg" className="w-full mt-4">
                  Book Now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
