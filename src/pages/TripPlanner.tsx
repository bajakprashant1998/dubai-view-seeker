import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Bot,
  Send,
  User,
  Sparkles,
  Map,
  Calendar,
  Users,
  Heart,
  Compass,
  Camera,
  Palmtree,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { streamChat, type ChatMessage } from "@/lib/ai-chat";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const TRIP_STARTERS = [
  { label: "3 Days of Adventure", icon: Compass, message: "Plan a 3-day action-packed Dubai itinerary for two adventure-loving adults. Include desert safari and water activities." },
  { label: "Romantic Getaway", icon: Heart, message: "Create a romantic 4-day Dubai itinerary for a couple celebrating their anniversary. Focus on luxury and sunset experiences." },
  { label: "Family Vacation", icon: Users, message: "Plan a 5-day family-friendly Dubai trip for 2 adults and 2 kids (ages 6 and 10). Mix fun and educational activities." },
  { label: "Weekend Highlights", icon: Calendar, message: "I only have 2 days in Dubai. Plan the perfect weekend hitting all the must-see spots." },
  { label: "Photography Tour", icon: Camera, message: "Create a 3-day Dubai itinerary focused on the best photography spots and golden hour timings." },
  { label: "Budget Explorer", icon: Map, message: "Plan a budget-friendly 4-day Dubai trip staying under AED 1500 total for activities." },
];

const TripPlanner = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        mode: "trip-planner",
        onDelta: upsert,
        onDone: () => setIsLoading(false),
        onError: (err) => {
          setIsLoading(false);
          toast({ title: "AI Error", description: err, variant: "destructive" });
        },
      });
    } catch {
      setIsLoading(false);
      toast({ title: "Connection Error", description: "Could not reach the AI assistant.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[hsl(var(--ocean-dark))] via-[hsl(var(--ocean))] to-[hsl(var(--ocean-dark))] py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[hsl(var(--gold))] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[hsl(var(--gold))] rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold))] border-[hsl(var(--gold))]/30 mb-4">
              <Sparkles className="h-3 w-3 mr-1" /> AI-Powered
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              AI Trip Planner
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Tell our AI about your travel style and it'll craft the perfect Dubai itinerary — complete with timings, activities, and insider tips.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Chat Area */}
          <div className="bg-card rounded-2xl border border-border shadow-elevated overflow-hidden">
            <div ref={scrollRef} className="min-h-[400px] max-h-[600px] overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && (
                <div className="space-y-8 py-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--gold))]/20 to-[hsl(var(--gold))]/5 flex items-center justify-center mx-auto mb-4">
                      <Map className="h-8 w-8 text-[hsl(var(--gold))]" />
                    </div>
                    <h2 className="font-serif text-xl font-bold text-foreground mb-2">
                      Let's Plan Your Dream Dubai Trip
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                      Choose a template below or describe your ideal trip in your own words.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {TRIP_STARTERS.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => send(s.message)}
                        className="text-left p-4 rounded-xl border border-border hover:border-[hsl(var(--gold))]/30 hover:bg-[hsl(var(--gold))]/5 transition-all group"
                      >
                        <s.icon className="h-5 w-5 text-[hsl(var(--gold))] mb-2 group-hover:scale-110 transition-transform" />
                        <p className="font-medium text-sm text-foreground">{s.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <div className="w-9 h-9 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="h-5 w-5 text-[hsl(var(--gold))]" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-5 py-3",
                      msg.role === "user"
                        ? "bg-[hsl(var(--ocean-dark))] text-white rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:my-1.5 [&_ul]:my-1 [&_li]:my-0.5 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-9 h-9 rounded-full bg-[hsl(var(--ocean-dark))] flex items-center justify-center shrink-0 mt-1">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-[hsl(var(--gold))]" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-5 py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your ideal Dubai trip..."
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--gold))] transition-colors placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={!input.trim() || isLoading} variant="gold" size="lg" className="rounded-xl">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TripPlanner;
