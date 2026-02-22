import { format } from "date-fns";
import { ShoppingCart, Trash2, X, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

export function CartDrawer() {
  const { items, removeItem, clearCart, itemCount, totalAmount, isCartOpen, setIsCartOpen } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-ocean-dark text-xs font-bold flex items-center justify-center"
            >
              {itemCount}
            </motion.span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-gold" />
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Browse our amazing tours and activities to start planning your Dubai adventure.
            </p>
            <Button variant="gold" onClick={() => setIsCartOpen(false)} asChild>
              <Link to="/tours">Browse Tours</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-4 py-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-3 p-3 bg-muted/50 rounded-xl border border-border"
                  >
                    <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm line-clamp-1">{item.title}</h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                          {item.type === "combo" ? "Combo" : "Activity"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.date} {item.time && `• ${item.time}`} • {item.adults}A{item.children > 0 ? ` ${item.children}C` : ""}
                      </p>
                      {item.selectedRental && (
                        <p className="text-xs text-muted-foreground">⏱ {item.selectedRental.label}</p>
                      )}
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <p className="text-xs text-muted-foreground">✦ {item.selectedAddons.map(a => a.label).join(", ")}</p>
                      )}
                      <p className="text-sm font-bold mt-1">AED {item.totalPrice.toFixed(0)}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold">AED {totalAmount.toFixed(0)}</span>
              </div>

              <Button variant="gold" size="xl" className="w-full" onClick={() => setIsCartOpen(false)} asChild>
                <Link to="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>

              <button
                onClick={clearCart}
                className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors text-center py-1"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
