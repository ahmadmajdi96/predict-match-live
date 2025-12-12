import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Users, Zap, Target } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      
      {/* Floating Elements */}
      <div className="absolute top-1/3 left-[10%] animate-float">
        <div className="w-12 h-12 rounded-xl bg-primary/20 backdrop-blur flex items-center justify-center">
          <span className="text-2xl">⚽</span>
        </div>
      </div>
      <div className="absolute top-1/2 right-[15%] animate-float" style={{ animationDelay: "2s" }}>
        <div className="w-10 h-10 rounded-lg bg-accent/20 backdrop-blur flex items-center justify-center">
          <Trophy className="w-5 h-5 text-accent" />
        </div>
      </div>
      <div className="absolute bottom-1/3 left-[20%] animate-float" style={{ animationDelay: "4s" }}>
        <div className="w-8 h-8 rounded-lg bg-live/20 backdrop-blur flex items-center justify-center">
          <Target className="w-4 h-4 text-live" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Real-time Football Predictions</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Predict. Compete.
            <span className="block gradient-text">Win Glory.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
            Join the ultimate football prediction platform. Make detailed predictions on scores, scorers, corners, and more. Climb the leaderboard and prove you're the ultimate football oracle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Button variant="hero" size="xl">
              Start Predicting
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="xl">
              View Live Matches
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "400ms" }}>
            {[
              { value: "50K+", label: "Active Predictors" },
              { value: "1.2M", label: "Predictions Made" },
              { value: "98%", label: "Matches Covered" },
              { value: "24/7", label: "Live Updates" },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-card/40 border border-border/30">
                <div className="font-display text-2xl md:text-3xl font-bold gradient-text-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
