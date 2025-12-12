import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, TrendingUp, TrendingDown, Crown, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

const timeframes = [
  { id: "weekly", label: "This Week" },
  { id: "monthly", label: "This Month" },
  { id: "alltime", label: "All Time" },
];

const leaderboardData = [
  { rank: 1, name: "FootballGuru99", points: 12450, predictions: 234, accuracy: "68%", change: "up", avatar: "🏆" },
  { rank: 2, name: "PredictionMaster", points: 11820, predictions: 198, accuracy: "72%", change: "up", avatar: "⚡" },
  { rank: 3, name: "GoalHunter", points: 11350, predictions: 256, accuracy: "61%", change: "down", avatar: "🎯" },
  { rank: 4, name: "TacticsKing", points: 10980, predictions: 187, accuracy: "69%", change: "up", avatar: "👑" },
  { rank: 5, name: "MatchOracle", points: 10650, predictions: 212, accuracy: "65%", change: "same", avatar: "🔮" },
  { rank: 6, name: "SoccerSage", points: 10320, predictions: 178, accuracy: "71%", change: "up", avatar: "🧙" },
  { rank: 7, name: "GoalGenius", points: 9870, predictions: 201, accuracy: "63%", change: "down", avatar: "💡" },
  { rank: 8, name: "PitchProphet", points: 9540, predictions: 189, accuracy: "66%", change: "up", avatar: "📊" },
  { rank: 9, name: "ScoreKnight", points: 9210, predictions: 167, accuracy: "70%", change: "same", avatar: "⚔️" },
  { rank: 10, name: "MatchMaven", points: 8890, predictions: 223, accuracy: "58%", change: "down", avatar: "🌟" },
];

const Leaderboard = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("weekly");

  return (
    <>
      <Helmet>
        <title>Leaderboard - FootPredict Pro</title>
        <meta
          name="description"
          content="See who's leading the prediction rankings. Compete with other football fans and climb to the top."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <Trophy className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Global Rankings</span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">Leaderboard</h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                The best football predictors ranked by points. Join the competition and climb your way to the top.
              </p>
            </div>

            {/* Timeframe Tabs */}
            <div className="flex justify-center mb-10">
              <div className="flex items-center gap-2 p-1 bg-secondary/50 rounded-xl">
                {timeframes.map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setActiveTimeframe(tf.id)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
                      activeTimeframe === tf.id
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Top 3 Podium */}
            <div className="flex justify-center items-end gap-4 mb-12">
              {/* 2nd Place */}
              <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: "100ms" }}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-3xl mb-3 shadow-lg">
                  {leaderboardData[1].avatar}
                </div>
                <span className="font-semibold mb-1">{leaderboardData[1].name}</span>
                <span className="text-sm text-muted-foreground">{leaderboardData[1].points.toLocaleString()} pts</span>
                <div className="mt-4 w-24 h-24 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-lg flex items-center justify-center">
                  <span className="text-3xl font-display font-bold text-gray-600">2</span>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center animate-fade-in">
                <Crown className="w-8 h-8 text-accent mb-2 animate-float" />
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center text-4xl mb-3 shadow-xl glow-gold">
                  {leaderboardData[0].avatar}
                </div>
                <span className="font-bold text-lg mb-1">{leaderboardData[0].name}</span>
                <span className="text-sm text-accent font-semibold">{leaderboardData[0].points.toLocaleString()} pts</span>
                <div className="mt-4 w-28 h-32 bg-gradient-to-t from-accent to-yellow-400 rounded-t-lg flex items-center justify-center">
                  <span className="text-4xl font-display font-bold text-yellow-900">1</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: "200ms" }}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-3xl mb-3 shadow-lg">
                  {leaderboardData[2].avatar}
                </div>
                <span className="font-semibold mb-1">{leaderboardData[2].name}</span>
                <span className="text-sm text-muted-foreground">{leaderboardData[2].points.toLocaleString()} pts</span>
                <div className="mt-4 w-24 h-20 bg-gradient-to-t from-amber-700 to-amber-600 rounded-t-lg flex items-center justify-center">
                  <span className="text-3xl font-display font-bold text-amber-900">3</span>
                </div>
              </div>
            </div>

            {/* Full Leaderboard Table */}
            <div className="glass rounded-2xl overflow-hidden max-w-4xl mx-auto">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-secondary/50 text-sm font-medium text-muted-foreground">
                <div className="col-span-1">Rank</div>
                <div className="col-span-5">Player</div>
                <div className="col-span-2 text-right">Points</div>
                <div className="col-span-2 text-right hidden sm:block">Predictions</div>
                <div className="col-span-2 text-right hidden md:block">Accuracy</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border/30">
                {leaderboardData.map((player, index) => (
                  <div
                    key={player.rank}
                    className={cn(
                      "grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-secondary/30 transition-colors",
                      index < 3 && "bg-primary/5"
                    )}
                  >
                    {/* Rank */}
                    <div className="col-span-1 flex items-center">
                      {player.rank <= 3 ? (
                        <Medal
                          className={cn(
                            "w-5 h-5",
                            player.rank === 1 && "text-accent",
                            player.rank === 2 && "text-gray-400",
                            player.rank === 3 && "text-amber-600"
                          )}
                        />
                      ) : (
                        <span className="font-bold text-muted-foreground">{player.rank}</span>
                      )}
                    </div>

                    {/* Player */}
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                        {player.avatar}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{player.name}</span>
                        {player.change === "up" && <TrendingUp className="w-4 h-4 text-primary" />}
                        {player.change === "down" && <TrendingDown className="w-4 h-4 text-destructive" />}
                      </div>
                    </div>

                    {/* Points */}
                    <div className="col-span-2 text-right">
                      <span className="font-display font-bold text-primary">
                        {player.points.toLocaleString()}
                      </span>
                    </div>

                    {/* Predictions */}
                    <div className="col-span-2 text-right hidden sm:block text-muted-foreground">
                      {player.predictions}
                    </div>

                    {/* Accuracy */}
                    <div className="col-span-2 text-right hidden md:block text-muted-foreground">
                      {player.accuracy}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <Button variant="hero" size="lg">
                Start Predicting Now
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Leaderboard;
