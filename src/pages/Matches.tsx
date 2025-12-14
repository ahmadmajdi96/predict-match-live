import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MatchCard } from "@/components/match/MatchCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, Flame, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

const tabs = [
  { id: "all", label: "All Matches", icon: Calendar },
  { id: "live", label: "Live", icon: Flame },
  { id: "upcoming", label: "Upcoming", icon: Clock },
  { id: "finished", label: "Finished", icon: CheckCircle },
];

const allMatches = [
  {
    homeTeam: { name: "Manchester City", logo: "https://resources.premierleague.com/premierleague/badges/70/t43.png" },
    awayTeam: { name: "Liverpool", logo: "https://resources.premierleague.com/premierleague/badges/70/t14.png" },
    league: "Premier League",
    kickoff: "Today, 17:30",
    venue: "Etihad Stadium",
    status: "upcoming" as const,
  },
  {
    homeTeam: { name: "Real Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg", score: 2 },
    awayTeam: { name: "Barcelona", logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg", score: 1 },
    league: "La Liga",
    kickoff: "67'",
    venue: "Santiago Bernabéu",
    status: "live" as const,
  },
  {
    homeTeam: { name: "Bayern Munich", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg" },
    awayTeam: { name: "Dortmund", logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg" },
    league: "Bundesliga",
    kickoff: "Tomorrow, 18:30",
    venue: "Allianz Arena",
    status: "upcoming" as const,
  },
  {
    homeTeam: { name: "Arsenal", logo: "https://resources.premierleague.com/premierleague/badges/70/t3.png", score: 3 },
    awayTeam: { name: "Chelsea", logo: "https://resources.premierleague.com/premierleague/badges/70/t8.png", score: 1 },
    league: "Premier League",
    kickoff: "FT",
    venue: "Emirates Stadium",
    status: "finished" as const,
  },
  {
    homeTeam: { name: "PSG", logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg", score: 1 },
    awayTeam: { name: "Marseille", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg", score: 1 },
    league: "Ligue 1",
    kickoff: "45'+2",
    venue: "Parc des Princes",
    status: "live" as const,
  },
  {
    homeTeam: { name: "Inter Milan", logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg" },
    awayTeam: { name: "AC Milan", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg" },
    league: "Serie A",
    kickoff: "Sat, 20:45",
    venue: "San Siro",
    status: "upcoming" as const,
  },
];

const Matches = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMatches = allMatches.filter((match) => {
    const matchesTab = activeTab === "all" || match.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.league.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Matches - FootPredict Pro</title>
        <meta
          name="description"
          content="Browse all football matches and make your predictions. Live scores, upcoming fixtures, and match results."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Matches</h1>
              <p className="text-muted-foreground">Browse and predict on matches from top leagues</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
              {/* Tabs */}
              <div className="flex items-center gap-2 p-1 bg-secondary/50 rounded-xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search teams or leagues..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filteredMatches.length} match{filteredMatches.length !== 1 ? "es" : ""}
            </p>

            {/* Matches Grid */}
            {filteredMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match, index) => (
                  <div
                    key={index}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <MatchCard
                      {...match}
                      onPredict={
                        match.status === "upcoming"
                          ? () => {}
                          : undefined
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No matches found matching your criteria.</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Matches;
