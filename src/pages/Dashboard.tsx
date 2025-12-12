import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MatchCard } from "@/components/match/MatchCard";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Award,
  ChevronRight,
  Star,
  Zap,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet-async";

const stats = [
  { label: "Total Points", value: "2,450", icon: Trophy, color: "text-accent" },
  { label: "Predictions", value: "87", icon: Target, color: "text-primary" },
  { label: "Accuracy", value: "64%", icon: BarChart3, color: "text-upcoming" },
  { label: "Global Rank", value: "#142", icon: TrendingUp, color: "text-live" },
];

const recentPredictions = [
  {
    homeTeam: { name: "Arsenal", logo: "https://resources.premierleague.com/premierleague/badges/70/t3.png", score: 3 },
    awayTeam: { name: "Chelsea", logo: "https://resources.premierleague.com/premierleague/badges/70/t8.png", score: 1 },
    league: "Premier League",
    kickoff: "FT",
    status: "finished" as const,
    userPrediction: "3-1",
    points: "+15",
    correct: true,
  },
  {
    homeTeam: { name: "Man United", logo: "https://resources.premierleague.com/premierleague/badges/70/t1.png", score: 2 },
    awayTeam: { name: "Tottenham", logo: "https://resources.premierleague.com/premierleague/badges/70/t6.png", score: 2 },
    league: "Premier League",
    kickoff: "FT",
    status: "finished" as const,
    userPrediction: "2-1",
    points: "+5",
    correct: false,
  },
];

const upcomingPredictions = [
  {
    homeTeam: { name: "Manchester City", logo: "https://resources.premierleague.com/premierleague/badges/70/t43.png" },
    awayTeam: { name: "Liverpool", logo: "https://resources.premierleague.com/premierleague/badges/70/t14.png" },
    league: "Premier League",
    kickoff: "Today, 17:30",
    status: "upcoming" as const,
  },
];

const achievements = [
  { name: "First Win", icon: "🏅", unlocked: true },
  { name: "Hot Streak", icon: "🔥", unlocked: true },
  { name: "Perfect Score", icon: "💯", unlocked: false },
  { name: "Goal Oracle", icon: "🎯", unlocked: false },
];

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard - FootPredict Pro</title>
        <meta name="description" content="Track your predictions, view your stats, and manage your football predictions." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's your prediction overview.</p>
              </div>
              <Button variant="hero">
                Make New Prediction
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="glass rounded-xl p-5 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <stat.icon className={cn("w-5 h-5", stat.color)} />
                    </div>
                  </div>
                  <div className="font-display text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Upcoming Predictions */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-upcoming" />
                      <h2 className="font-display text-xl font-semibold">Upcoming Predictions</h2>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View All <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {upcomingPredictions.map((match, index) => (
                      <MatchCard key={index} {...match} onPredict={() => {}} />
                    ))}
                  </div>
                </section>

                {/* Recent Predictions */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary" />
                      <h2 className="font-display text-xl font-semibold">Recent Predictions</h2>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View History <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {recentPredictions.map((match, index) => (
                      <div key={index} className="glass rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            {match.league}
                          </span>
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-bold",
                              match.correct ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                            )}
                          >
                            {match.points}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 flex-1">
                            <img src={match.homeTeam.logo} alt="" className="w-8 h-8" />
                            <span className="font-medium text-sm">{match.homeTeam.name}</span>
                          </div>
                          <div className="text-center px-4">
                            <div className="text-lg font-bold">
                              {match.homeTeam.score} - {match.awayTeam.score}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Your: {match.userPrediction}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-1 justify-end">
                            <span className="font-medium text-sm">{match.awayTeam.name}</span>
                            <img src={match.awayTeam.logo} alt="" className="w-8 h-8" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="glass rounded-xl p-5">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button variant="secondary" className="w-full justify-start gap-2">
                      <Calendar className="w-4 h-4" />
                      View Today's Matches
                    </Button>
                    <Button variant="secondary" className="w-full justify-start gap-2">
                      <Trophy className="w-4 h-4" />
                      Check Leaderboard
                    </Button>
                    <Button variant="secondary" className="w-full justify-start gap-2">
                      <Star className="w-4 h-4" />
                      Join a League
                    </Button>
                  </div>
                </div>

                {/* Achievements */}
                <div className="glass rounded-xl p-5">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent" />
                    Achievements
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={cn(
                          "aspect-square rounded-xl flex items-center justify-center text-2xl transition-all",
                          achievement.unlocked
                            ? "bg-accent/20 border border-accent/30"
                            : "bg-secondary/50 opacity-40 grayscale"
                        )}
                        title={achievement.name}
                      >
                        {achievement.icon}
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4 gap-1">
                    View All Badges <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Weekly Progress */}
                <div className="glass rounded-xl p-5">
                  <h3 className="font-semibold mb-4">This Week</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Predictions Made</span>
                        <span className="font-medium">8/10</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "80%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Accuracy Rate</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: "75%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
