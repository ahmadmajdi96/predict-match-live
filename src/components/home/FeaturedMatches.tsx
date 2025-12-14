import { MatchCard } from "@/components/match/MatchCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

const featuredMatches = [
  {
    homeTeam: {
      name: "Manchester City",
      logo: "https://resources.premierleague.com/premierleague/badges/70/t43.png",
    },
    awayTeam: {
      name: "Liverpool",
      logo: "https://resources.premierleague.com/premierleague/badges/70/t14.png",
    },
    league: "Premier League",
    kickoff: "Today, 17:30",
    venue: "Etihad Stadium",
    status: "upcoming" as const,
  },
  {
    homeTeam: {
      name: "Real Madrid",
      logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
      score: 2,
    },
    awayTeam: {
      name: "Barcelona",
      logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
      score: 1,
    },
    league: "La Liga",
    kickoff: "67'",
    venue: "Santiago Bernabéu",
    status: "live" as const,
  },
  {
    homeTeam: {
      name: "Bayern Munich",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg",
    },
    awayTeam: {
      name: "Dortmund",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
    },
    league: "Bundesliga",
    kickoff: "Tomorrow, 18:30",
    venue: "Allianz Arena",
    status: "upcoming" as const,
  },
];

export function FeaturedMatches() {
  const navigate = useNavigate();

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-live/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-live" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Featured Matches</h2>
              <p className="text-sm text-muted-foreground">Top matches to predict today</p>
            </div>
          </div>
          <Button variant="ghost" className="gap-2" onClick={() => navigate('/matches')}>
            View All
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMatches.map((match, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MatchCard
                {...match}
                onPredict={match.status === "upcoming" ? () => {} : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
