import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Free to Join</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to Prove Your
            <span className="block gradient-text">Football Knowledge?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of fans already making predictions. Sign up in seconds and start competing today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl">
              Explore Matches
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-border/30">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["🔵", "🟢", "🟡", "🔴"].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-sm"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">50K+ Predictors</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-accent">★★★★★</span>
              <span className="text-sm text-muted-foreground">4.9 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
