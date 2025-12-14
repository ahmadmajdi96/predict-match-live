import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { NavbarAr } from "@/components/layout/NavbarAr";
import { FooterAr } from "@/components/layout/FooterAr";
import { MatchCardAr } from "@/components/match/MatchCardAr";
import { MatchPredictionDialog } from "@/components/match/MatchPredictionDialog";
import { FormationView } from "@/components/match/FormationView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, Flame, Clock, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { translations as t } from "@/lib/translations";
import { useAuth } from "@/hooks/useAuth";
import { useMatches } from "@/hooks/useMatches";
import { useTeamPlayers } from "@/hooks/usePlayers";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface MatchData {
  id: string;
  homeTeamId?: string;
  awayTeamId?: string;
  homeTeam: {
    name: string;
    nameAr?: string;
    logo: string;
    score?: number;
    formation?: string;
    coach?: string;
    players?: any[];
  };
  awayTeam: {
    name: string;
    nameAr?: string;
    logo: string;
    score?: number;
    formation?: string;
    coach?: string;
    players?: any[];
  };
  league: string;
  leagueAr?: string;
  kickoff: string;
  kickoffDate?: Date;
  venue?: string;
  stadium?: string;
  referee?: string;
  weather?: string;
  status: "upcoming" | "live" | "finished";
  predictionPrice: number;
}

const tabs = [
  { id: "all", label: t.all, icon: Calendar },
  { id: "live", label: t.live, icon: Flame },
  { id: "upcoming", label: t.upcoming, icon: Clock },
  { id: "finished", label: t.finished, icon: CheckCircle },
];

// Wrapper component to fetch players for formation view
function FormationViewWrapper({ 
  open, 
  onOpenChange, 
  match 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  match: MatchData;
}) {
  const { data: homePlayers } = useTeamPlayers(match.homeTeamId);
  const { data: awayPlayers } = useTeamPlayers(match.awayTeamId);

  return (
    <FormationView
      open={open}
      onOpenChange={onOpenChange}
      homeTeam={{
        name: match.homeTeam.name,
        nameAr: match.homeTeam.nameAr,
        logo: match.homeTeam.logo,
        formation: match.homeTeam.formation || "4-3-3",
        lineup: homePlayers?.lineup || [],
        substitutes: homePlayers?.substitutes || [],
      }}
      awayTeam={{
        name: match.awayTeam.name,
        nameAr: match.awayTeam.nameAr,
        logo: match.awayTeam.logo,
        formation: match.awayTeam.formation || "4-3-3",
        lineup: awayPlayers?.lineup || [],
        substitutes: awayPlayers?.substitutes || [],
      }}
    />
  );
}



const MatchesAr = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [predictionOpen, setPredictionOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null);
  const [formationOpen, setFormationOpen] = useState(false);
  const [formationMatch, setFormationMatch] = useState<MatchData | null>(null);
  
  const { data: dbMatches, isLoading, refetch } = useMatches(activeTab === "all" ? undefined : activeTab);

  // Transform DB matches to component format
  const transformedMatches: MatchData[] = (dbMatches || []).map(match => {
    const kickoffDate = new Date(match.kickoff_time);
    const isToday = new Date().toDateString() === kickoffDate.toDateString();
    const kickoffText = isToday 
      ? `اليوم، ${format(kickoffDate, 'h:mm a', { locale: ar })}`
      : format(kickoffDate, 'EEEE، h:mm a', { locale: ar });

    return {
      id: match.id,
      homeTeamId: match.home_team?.id,
      awayTeamId: match.away_team?.id,
      homeTeam: {
        name: match.home_team?.name || 'TBD',
        nameAr: match.home_team?.name_ar || undefined,
        logo: match.home_team?.logo_url || '/placeholder.svg',
        score: match.home_score ?? undefined,
        formation: match.home_formation || '4-3-3',
        coach: match.home_coach || undefined,
        players: [],
      },
      awayTeam: {
        name: match.away_team?.name || 'TBD',
        nameAr: match.away_team?.name_ar || undefined,
        logo: match.away_team?.logo_url || '/placeholder.svg',
        score: match.away_score ?? undefined,
        formation: match.away_formation || '4-3-3',
        coach: match.away_coach || undefined,
        players: [],
      },
      league: match.league?.name || 'Egyptian Premier League',
      leagueAr: match.league?.name_ar || 'الدوري المصري الممتاز',
      kickoff: match.status === 'finished' ? 'انتهت' : (match.status === 'live' ? 'مباشر' : kickoffText),
      kickoffDate,
      venue: match.stadium || undefined,
      stadium: match.stadium || undefined,
      referee: match.referee || undefined,
      weather: match.weather || undefined,
      status: (match.status as "upcoming" | "live" | "finished") || 'upcoming',
      predictionPrice: match.league?.prediction_price || 10,
    };
  });

  const allMatches = transformedMatches;

  const filteredMatches = allMatches.filter((match) => {
    const matchesTab = activeTab === "all" || match.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      match.homeTeam.nameAr?.includes(searchQuery) ||
      match.awayTeam.nameAr?.includes(searchQuery) ||
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.leagueAr?.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const handlePredict = (match: MatchData) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً للتوقع");
      return;
    }

    setSelectedMatch(match);
    setPredictionOpen(true);
  };

  const handleViewFormation = (match: MatchData) => {
    setFormationMatch(match);
    setFormationOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>{t.matches} - فوت بريديكت برو</title>
        <meta name="description" content="تصفح مباريات الدوري المصري الممتاز وقم بتوقعاتك" />
      </Helmet>

      <div className="min-h-screen bg-background" dir="rtl">
        <NavbarAr />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{t.matches}</h1>
                <p className="text-muted-foreground">تصفح مباريات الدوري المصري وقم بتوقعاتك</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
              {/* Tabs */}
              <div className="flex items-center gap-2 p-1 bg-secondary/50 rounded-xl overflow-x-auto w-full lg:w-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-72">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث عن الفرق أو الدوري..."
                    className="pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {/* Results Count */}
            {!isLoading && (
              <p className="text-sm text-muted-foreground mb-6">
                عرض {filteredMatches.length} مباراة
              </p>
            )}

            {/* Matches Grid */}
            {!isLoading && filteredMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match, index) => (
                  <div
                    key={match.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <MatchCardAr
                      homeTeam={{
                        name: match.homeTeam.name,
                        nameAr: match.homeTeam.nameAr,
                        logo: match.homeTeam.logo,
                        score: match.homeTeam.score,
                      }}
                      awayTeam={{
                        name: match.awayTeam.name,
                        nameAr: match.awayTeam.nameAr,
                        logo: match.awayTeam.logo,
                        score: match.awayTeam.score,
                      }}
                      league={match.league}
                      leagueAr={match.leagueAr}
                      kickoff={match.kickoff}
                      venue={match.venue}
                      status={match.status}
                      predictionPrice={match.predictionPrice}
                      onPredict={() => handlePredict(match)}
                      onViewFormation={() => handleViewFormation(match)}
                    />
                  </div>
                ))}
              </div>
            ) : !isLoading ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">لا توجد مباريات مطابقة للبحث.</p>
              </div>
            ) : null}
          </div>
        </main>
        <FooterAr />

        {/* Prediction Dialog */}
        {selectedMatch && (
          <MatchPredictionDialog
            open={predictionOpen}
            onOpenChange={setPredictionOpen}
            match={{
              id: selectedMatch.id,
              homeTeam: selectedMatch.homeTeam,
              awayTeam: selectedMatch.awayTeam,
              league: selectedMatch.league,
              leagueAr: selectedMatch.leagueAr,
              kickoff: selectedMatch.kickoff,
              kickoffDate: selectedMatch.kickoffDate,
              venue: selectedMatch.venue,
              stadium: selectedMatch.stadium,
              referee: selectedMatch.referee,
              weather: selectedMatch.weather,
              status: selectedMatch.status,
              predictionPrice: selectedMatch.predictionPrice,
            }}
            onSuccess={() => refetch()}
          />
        )}

        {/* Formation View */}
        {formationMatch && (
          <FormationViewWrapper
            open={formationOpen}
            onOpenChange={setFormationOpen}
            match={formationMatch}
          />
        )}
      </div>
    </>
  );
};

export default MatchesAr;
