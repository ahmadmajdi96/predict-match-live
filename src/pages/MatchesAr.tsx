import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { NavbarAr } from "@/components/layout/NavbarAr";
import { FooterAr } from "@/components/layout/FooterAr";
import { MatchCardAr } from "@/components/match/MatchCardAr";
import { FormationView } from "@/components/match/FormationView";
import { PredictionDialog } from "@/components/match/PredictionDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, Flame, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { translations as t } from "@/lib/translations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const tabs = [
  { id: "all", label: t.all, icon: Calendar },
  { id: "live", label: t.live, icon: Flame },
  { id: "upcoming", label: t.upcoming, icon: Clock },
  { id: "finished", label: t.finished, icon: CheckCircle },
];

// Demo Egyptian league matches
const egyptianMatches = [
  {
    id: "1",
    homeTeam: { name: "Al Ahly", nameAr: "الأهلي", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Al_Ahly_SC_logo.svg/1200px-Al_Ahly_SC_logo.svg.png" },
    awayTeam: { name: "Zamalek", nameAr: "الزمالك", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Zamalek_SC_logo.svg/800px-Zamalek_SC_logo.svg.png" },
    league: "Egyptian Premier League",
    leagueAr: "الدوري المصري الممتاز",
    kickoff: "اليوم، 9:00 م",
    venue: "ستاد القاهرة الدولي",
    status: "upcoming" as const,
    predictionPrice: 10,
    homeFormation: "4-2-3-1",
    awayFormation: "4-3-3",
  },
  {
    id: "2",
    homeTeam: { name: "Pyramids", nameAr: "بيراميدز", logo: "https://upload.wikimedia.org/wikipedia/en/9/9a/Pyramids_FC_logo.png", score: 2 },
    awayTeam: { name: "Ismaily", nameAr: "الإسماعيلي", logo: "https://upload.wikimedia.org/wikipedia/en/1/1a/Ismaily_SC_logo.png", score: 1 },
    league: "Egyptian Premier League",
    leagueAr: "الدوري المصري الممتاز",
    kickoff: "67'",
    venue: "ستاد 30 يونيو",
    status: "live" as const,
    predictionPrice: 10,
    homeFormation: "4-4-2",
    awayFormation: "3-5-2",
  },
  {
    id: "3",
    homeTeam: { name: "Ceramica Cleopatra", nameAr: "سيراميكا كليوباترا", logo: "https://upload.wikimedia.org/wikipedia/en/0/07/Ceramica_Cleopatra_FC_logo.png" },
    awayTeam: { name: "Future FC", nameAr: "فيوتشر", logo: "https://upload.wikimedia.org/wikipedia/en/b/be/Future_FC_logo.png" },
    league: "Egyptian Premier League",
    leagueAr: "الدوري المصري الممتاز",
    kickoff: "غداً، 7:00 م",
    venue: "ستاد بتروسبورت",
    status: "upcoming" as const,
    predictionPrice: 5,
    homeFormation: "4-3-3",
    awayFormation: "4-4-2",
  },
  {
    id: "4",
    homeTeam: { name: "Al Masry", nameAr: "المصري", logo: "https://upload.wikimedia.org/wikipedia/en/d/d4/Al_Masry_SC_logo.png", score: 0 },
    awayTeam: { name: "Enppi", nameAr: "إنبي", logo: "https://upload.wikimedia.org/wikipedia/en/3/33/Enppi_Club_logo.png", score: 0 },
    league: "Egyptian Premier League",
    leagueAr: "الدوري المصري الممتاز",
    kickoff: "انتهت",
    venue: "ستاد بورسعيد",
    status: "finished" as const,
    predictionPrice: 5,
    homeFormation: "4-2-3-1",
    awayFormation: "4-3-3",
  },
  {
    id: "5",
    homeTeam: { name: "Smouha", nameAr: "سموحة", logo: "https://upload.wikimedia.org/wikipedia/en/9/96/Smouha_SC_logo.png" },
    awayTeam: { name: "Pharco", nameAr: "فاركو", logo: "https://upload.wikimedia.org/wikipedia/en/4/47/Pharco_FC_logo.png" },
    league: "Egyptian Premier League",
    leagueAr: "الدوري المصري الممتاز",
    kickoff: "السبت، 5:00 م",
    venue: "ستاد الإسكندرية",
    status: "upcoming" as const,
    predictionPrice: 5,
    homeFormation: "4-4-2",
    awayFormation: "4-3-3",
  },
  {
    id: "6",
    homeTeam: { name: "Eastern Company", nameAr: "الشركة الشرقية", logo: "https://upload.wikimedia.org/wikipedia/en/8/83/Eastern_Company_SC_logo.png", score: 3 },
    awayTeam: { name: "National Bank", nameAr: "البنك الأهلي", logo: "https://upload.wikimedia.org/wikipedia/en/5/5c/National_Bank_of_Egypt_SC_logo.png", score: 2 },
    league: "Egyptian Premier League",
    leagueAr: "الدوري المصري الممتاز",
    kickoff: "انتهت",
    venue: "ستاد السلام",
    status: "finished" as const,
    predictionPrice: 5,
    homeFormation: "3-4-3",
    awayFormation: "4-2-3-1",
  },
];

// Demo players for formation
const demoPlayers = [
  { id: "1", name: "Mohamed El Shenawy", nameAr: "محمد الشناوي", number: 1, position: "GK" },
  { id: "2", name: "Ali Maaloul", nameAr: "علي معلول", number: 26, position: "LB" },
  { id: "3", name: "Yasser Ibrahim", nameAr: "ياسر إبراهيم", number: 6, position: "CB" },
  { id: "4", name: "Rami Rabia", nameAr: "رامي ربيعة", number: 2, position: "CB" },
  { id: "5", name: "Akram Tawfik", nameAr: "أكرم توفيق", number: 12, position: "RB" },
  { id: "6", name: "Hamdi Fathi", nameAr: "حمدي فتحي", number: 8, position: "CM" },
  { id: "7", name: "Aliou Dieng", nameAr: "أليو دينغ", number: 4, position: "CDM" },
  { id: "8", name: "Emam Ashour", nameAr: "إمام عاشور", number: 21, position: "CM" },
  { id: "9", name: "Percy Tau", nameAr: "بيرسي تاو", number: 10, position: "RW" },
  { id: "10", name: "Mohamed Sherif", nameAr: "محمد شريف", number: 9, position: "ST" },
  { id: "11", name: "Hussein El Shahat", nameAr: "حسين الشحات", number: 11, position: "LW" },
];

const demoSubstitutes = [
  { id: "12", name: "Mostafa Shobeir", nameAr: "مصطفى شوبير", number: 22, position: "GK" },
  { id: "13", name: "Mahmoud Metwally", nameAr: "محمود متولي", number: 3, position: "CB" },
  { id: "14", name: "Ahmed Abdelkader", nameAr: "أحمد عبدالقادر", number: 14, position: "CM" },
  { id: "15", name: "Wessam Abou Ali", nameAr: "وسام أبو علي", number: 7, position: "ST" },
  { id: "16", name: "Karim Fouad", nameAr: "كريم فؤاد", number: 17, position: "LW" },
];

const MatchesAr = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [formationOpen, setFormationOpen] = useState(false);
  const [predictionOpen, setPredictionOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<typeof egyptianMatches[0] | null>(null);

  const filteredMatches = egyptianMatches.filter((match) => {
    const matchesTab = activeTab === "all" || match.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      match.homeTeam.nameAr?.includes(searchQuery) ||
      match.awayTeam.nameAr?.includes(searchQuery) ||
      match.leagueAr?.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const handlePredict = (match: typeof egyptianMatches[0]) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً للتوقع");
      return;
    }
    setSelectedMatch(match);
    setPredictionOpen(true);
  };

  const handleViewFormation = (match: typeof egyptianMatches[0]) => {
    setSelectedMatch(match);
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
            <div className="mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{t.matches}</h1>
              <p className="text-muted-foreground">تصفح مباريات الدوري المصري وقم بتوقعاتك</p>
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

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-6">
              عرض {filteredMatches.length} مباراة
            </p>

            {/* Matches Grid */}
            {filteredMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match, index) => (
                  <div
                    key={match.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <MatchCardAr
                      {...match}
                      onPredict={match.status === "upcoming" ? () => handlePredict(match) : undefined}
                      onViewFormation={() => handleViewFormation(match)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">لا توجد مباريات مطابقة للبحث.</p>
              </div>
            )}
          </div>
        </main>
        <FooterAr />

        {/* Formation Dialog */}
        {selectedMatch && (
          <FormationView
            open={formationOpen}
            onOpenChange={setFormationOpen}
            homeTeam={{
              name: selectedMatch.homeTeam.name,
              nameAr: selectedMatch.homeTeam.nameAr,
              logo: selectedMatch.homeTeam.logo,
              formation: selectedMatch.homeFormation,
              lineup: demoPlayers,
              substitutes: demoSubstitutes,
            }}
            awayTeam={{
              name: selectedMatch.awayTeam.name,
              nameAr: selectedMatch.awayTeam.nameAr,
              logo: selectedMatch.awayTeam.logo,
              formation: selectedMatch.awayFormation,
              lineup: demoPlayers.map((p, i) => ({ ...p, id: `away-${i}` })),
              substitutes: demoSubstitutes.map((p, i) => ({ ...p, id: `away-sub-${i}` })),
            }}
          />
        )}

        {/* Prediction Dialog */}
        {selectedMatch && (
          <PredictionDialog
            open={predictionOpen}
            onOpenChange={setPredictionOpen}
            matchId={selectedMatch.id}
            homeTeam={{
              name: selectedMatch.homeTeam.name,
              nameAr: selectedMatch.homeTeam.nameAr,
              logo: selectedMatch.homeTeam.logo,
              players: demoPlayers,
            }}
            awayTeam={{
              name: selectedMatch.awayTeam.name,
              nameAr: selectedMatch.awayTeam.nameAr,
              logo: selectedMatch.awayTeam.logo,
              players: demoPlayers.map((p, i) => ({ ...p, id: `away-${i}` })),
            }}
            predictionPrice={selectedMatch.predictionPrice}
          />
        )}
      </div>
    </>
  );
};

export default MatchesAr;