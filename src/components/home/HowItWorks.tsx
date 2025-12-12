import { Target, BarChart3, Trophy, Users } from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "Choose Your Match",
    description: "Browse upcoming matches from top leagues around the world. Select the games you want to predict.",
    color: "primary",
  },
  {
    icon: BarChart3,
    title: "Make Predictions",
    description: "Predict scores, goal scorers, corners, cards, and more. The more accurate, the more points you earn.",
    color: "accent",
  },
  {
    icon: Trophy,
    title: "Earn Points",
    description: "Watch your predictions unfold in real-time. Earn points based on accuracy and climb the rankings.",
    color: "gold",
  },
  {
    icon: Users,
    title: "Compete & Win",
    description: "Join global and private leaderboards. Challenge friends and prove you're the ultimate predictor.",
    color: "upcoming",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and join thousands of football fans making predictions every day
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Connector Line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="relative p-6 rounded-2xl bg-card/40 border border-border/30 hover:border-primary/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                  <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
