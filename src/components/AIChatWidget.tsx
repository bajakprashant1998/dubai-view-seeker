import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Map,
  ThumbsUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { streamChat, type ChatMessage } from "@/lib/ai-chat";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const QUICK_PROMPTS = [
  { label: "Best for families", icon: ThumbsUp, message: "What are the best Dubai activities for a family with kids?" },
  { label: "Plan my trip", icon: Map, message: "Help me plan a 3-day Dubai trip for a couple who loves adventure and luxury." },
  { label: "Budget options", icon: Sparkles, message: "What's the most affordable way to see Dubai's top attractions?" },
];

export const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
        mode: "chat",
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
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(43_74%_60%)] shadow-[0_8px_30px_-4px_hsla(43,74%,49%,0.4)] flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Bot className="h-7 w-7 text-[hsl(var(--ocean-dark))]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-4rem)] bg-card rounded-2xl shadow-elevated border border-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[hsl(var(--ocean-dark))] to-[hsl(var(--ocean))] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-[hsl(var(--gold))]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">AI Booking Assistant</h3>
                  <p className="text-white/70 text-xs">Powered by Better View Tourism</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center space-y-4 py-4">
                  <div className="w-14 h-14 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mx-auto">
                    <Sparkles className="h-7 w-7 text-[hsl(var(--gold))]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-foreground">Welcome! 👋</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      I'm your AI Dubai travel assistant. Ask me anything about activities, planning, or booking!
                    </p>
                  </div>
                  <div className="space-y-2">
                    {QUICK_PROMPTS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => send(p.message)}
                        className="w-full text-left p-3 rounded-xl border border-border hover:border-[hsl(var(--gold))]/30 hover:bg-[hsl(var(--gold))]/5 transition-all text-sm flex items-center gap-2"
                      >
                        <p.icon className="h-4 w-4 text-[hsl(var(--gold))] shrink-0" />
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-[hsl(var(--gold))]" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                      msg.role === "user"
                        ? "bg-[hsl(var(--ocean-dark))] text-white rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-[hsl(var(--ocean-dark))] flex items-center justify-center shrink-0 mt-1">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2 items-center">
                  <div className="w-7 h-7 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-[hsl(var(--gold))]" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Dubai activities..."
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[hsl(var(--gold))] transition-colors placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  variant="gold"
                  size="icon"
                  className="rounded-xl shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
