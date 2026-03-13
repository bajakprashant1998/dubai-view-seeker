import { Shield, Ticket, RefreshCw, Headphones } from "lucide-react";

const perks = [
  { icon: Shield, text: "Best Price Guarantee" },
  { icon: Ticket, text: "Instant Mobile Tickets" },
  { icon: RefreshCw, text: "Free Cancellation" },
  { icon: Headphones, text: "24/7 Support" },
];

export function WhyChooseUs() {
  return (
    <section className="border-y border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          {perks.map((p) => (
            <div key={p.text} className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
              <p.icon className="h-5 w-5 text-gold shrink-0" />
              <span>{p.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
