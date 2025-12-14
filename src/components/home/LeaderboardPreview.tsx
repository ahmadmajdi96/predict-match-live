import { Button } from "@/components/ui/button";
import { Trophy, Medal, Star, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const leaderboardData = [
  { rank: 1, name: "FootballGuru99", points: 12450, change: "up", avatar: "🏆" },
  { rank: 2, name: "PredictionMaster", points: 11820, change: "up", avatar: "⚡" },
  { rank: 3, name: "GoalHunter", points: 11350, change: "down", avatar: "🎯" },
  { rank: 4, name: "TacticsKing", points: 10980, change: "up", avatar: "👑" },
  { rank: 5, name: "MatchOracle", points: 10650, change: "same", avatar: "🔮" },
];

export function LeaderboardPreview() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <div className="glass rounded-2xl p-1 overflow-hidden">
              {/* Header */}
              <div className="bg-secondary/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-accent" />
                  <span className="font-semibold">Global Leaderboard</span>
                </div>
                <span className="text-xs text-muted-foreground">This Week</span>
              </div>

              {/* Leaderboard List */}
              <div className="divide-y divide-border/30">
                {leaderboardData.map((player, index) => (
                  <div
                    key={player.rank}
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 transition-colors hover:bg-secondary/30",
                      index === 0 && "bg-accent/5"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Rank */}
                    <div className="w-8 flex justify-center">
                      {player.rank === 1 ? (
                        <Medal className="w-6 h-6 text-accent" />
                      ) : player.rank === 2 ? (
                        <Medal className="w-5 h-5 text-gray-400" />
                      ) : player.rank === 3 ? (
                        <Medal className="w-5 h-5 text-amber-700" />
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">
                          {player.rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                      {player.avatar}
                    </div>

                    {/* Name */}
                    <div className="flex-1">
                      <span className="font-medium">{player.name}</span>
                    </div>

                    {/* Change Indicator */}
                    <div className="flex items-center gap-1">
                      {player.change === "up" && (
                        <TrendingUp className="w-4 h-4 text-primary" />
                      )}
                      {player.change === "down" && (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      )}
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <span className="font-display font-bold text-primary">
                        {player.points.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">pts</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="p-4 border-t border-border/30">
                <Button variant="ghost" className="w-full gap-2">
                  View Full Leaderboard
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-accent" />
              </div>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Compete for <span className="gradient-text-cyan">Glory</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Every prediction counts. Climb the global rankings, earn exclusive badges, and prove you have what it takes to be the ultimate football oracle. Create private leagues and challenge your friends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="cyan" size="lg">
                View Leaderboard
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button variant="glass" size="lg">
                Create Private League
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
