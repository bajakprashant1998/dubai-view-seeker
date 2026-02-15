import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Trash2, Shield, Zap, CreditCard, CheckCircle2, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const Checkout = () => {
  const { items, removeItem, clearCart, totalAmount, itemCount } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      clearCart();
      toast.success("Booking confirmed! Check your email for details.");
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex mb-6">
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-gold" />
            </div>
          </motion.div>
          <h1 className="font-serif text-3xl font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Your Dubai experiences have been booked. You'll receive a confirmation email with all the details shortly.
          </p>
          <Link to="/tours">
            <Button variant="gold" size="lg">Continue Exploring</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some amazing Dubai experiences to get started!</p>
          <Link to="/tours">
            <Button variant="gold" size="lg">Browse Tours</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="bg-muted/50 border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground">Checkout</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Link to="/tours" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h1 className="font-serif text-2xl font-bold mb-6">
                Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
              </h1>

              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="flex gap-4 p-4 bg-card rounded-xl border border-border"
                >
                  <div className="w-28 h-20 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {item.type === "combo" ? "Combo Deal" : "Activity"}
                        </Badge>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-muted-foreground">
                        {item.date} {item.time && `• ${item.time}`} • {item.adults} Adult{item.adults > 1 ? "s" : ""}
                        {item.children > 0 ? `, ${item.children} Child${item.children > 1 ? "ren" : ""}` : ""}
                      </p>
                      <p className="text-lg font-bold">AED {item.totalPrice.toFixed(0)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-24 bg-card rounded-2xl shadow-elevated border border-border p-6 space-y-6">
                <h2 className="font-serif text-xl font-bold">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-muted-foreground line-clamp-1 flex-1 mr-4">{item.title}</span>
                      <span className="font-medium">AED {item.totalPrice.toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>AED {totalAmount.toFixed(0)}</span>
                  </div>
                </div>

                <Button
                  variant="gold"
                  size="xl"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="inline-block"
                      >
                        ⏳
                      </motion.span>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    <span>Instant Confirm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
