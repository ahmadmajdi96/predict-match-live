import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { NavbarAr } from "@/components/layout/NavbarAr";
import { FooterAr } from "@/components/layout/FooterAr";
import { MatchCardAr } from "@/components/match/MatchCardAr";
import { MatchPredictionDialog } from "@/components/match/MatchPredictionDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, Flame, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { translations as t } from "@/lib/translations";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const tabs = [
  { id: "all", label: t.all, icon: Calendar },
  { id: "live", label: t.live, icon: Flame },
  { id: "upcoming", label: t.upcoming, icon: Clock },
  { id: "finished", label: t.finished, icon: CheckCircle },
];

// Demo Egyptian league matches with more details
const egyptianMatches = [
  {
    id: "1",
    homeTeam: { 
      name: "Al Ahly", 
      nameAr: "الأهلي", 
      logo: "https://media.api-sports.io/football/teams/1020.png",
      formation: "4-2-3-1",
      coach: "مارسيل كولر",
      players: [
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
      ],
    },
    awayTeam: { 
      name: "Zamalek", 
      nameAr: "الزمالك", 
      logo: "https://media.api-sports.io/football/teams/1021.png",
      formation: "4-3-3",
      coach: "خوان كارلوس",
      players: [
        { id: "a1", name: "Mahmoud Gennesh", nameAr: "محمود جنش", number: 1, position: "GK" },
        { id: "a2", name: "Hazem Emam", nameAr: "حازم إمام", number: 7, position: "LB" },
        { id: "a3", name: "Mahmoud Alaa", nameAr: "محمود علاء", number: 5, position: "CB" },
        { id: "a4", name: "Mahmoud Hamdy", nameAr: "محمود حمدي الونش", number: 3, position: "CB" },
        { id: "a5", name: "Ahmed Fatouh", nameAr: "أحمد فتوح", number: 2, position: "RB" },
        { id: "a6", name: "Tariq Hamed", nameAr: "طارق حامد", number: 6, position: "CDM" },
        { id: "a7", name: "Emam Ashour", nameAr: "إمام عاشور", number: 8, position: "CM" },
        { id: "a8", name: "Ahmed Sayed Zizo", nameAr: "أحمد سيد زيزو", number: 10, position: "RW" },
        { id: "a9", name: "Seif El Din", nameAr: "سيف الدين الجزيري", number: 9, position: "ST" },
        { id: "a10", name: "Achraf Bencharki", nameAr: "أشرف بنشرقي", number: 11, position: "LW" },
        { id: "a11", name: "Mohamed Ounajem", nameAr: "محمد أوناجم", number: 14, position: "CM" },
      ],
    },
    league: "Egyptian Premier League",
    leagueAr: "الدوري المصري الممتاز",
    kickoff: "اليوم، 9:00 م",
    kickoffDate: new Date(Date.now() + 3600000),
    venue: "ستاد القاهرة الدولي",
    stadium: "ستاد القاهرة الدولي",
    referee: "محمد معروف",
    weather: "صافي 25°م",
    status: "upcoming" as const,
    predictionPrice: 10,
  },
  {
    id: "2",
    homeTeam: { 
      name: "Pyramids", 
      nameAr: "بيراميدز", 
      logo: "https://media.api-sports.io/football/teams/1025.png", 
      score: 2,
      formation: "4-4-2",
      coach: "روجيريو ميكالي",
      players: [],
    },
    awayTeam: { 
      name: "Ismaily", 
      nameAr: "الإسماعيلي", 
      logo: "https://media.api-sports.io/football/teams/1026.png", 
      score: 1,
      formation: "3-5-2",
      coach: "طلعت يوسف",
      players: [],
    },
    league: "Egyptian Premier League",
    leagueAr: "الدوري المصري الممتاز",
    kickoff: "67'",
    venue: "ستاد 30 يونيو",
    stadium: "ستاد 30 يونيو",
    referee: "أحمد الغندور",
    status: "live" as const,
    predictionPrice: 10,
  },
  {
    id: "3",
    homeTeam: { 
      name: "Ceramica Cleopatra", 
      nameAr: "سيراميكا كليوباترا", 
      logo: "https://media.api-sports.io/football/teams/17256.png",
      formation: "4-3-3",
      coach: "علي ماهر",
      players: [],
    },
    awayTeam: { 
      name: "Future FC", 
      nameAr: "فيوتشر", 
      logo: "https://media.api-sports.io/football/teams/17257.png",
      formation: "4-4-2",
      coach: "سيد عبد الحفيظ",
      players: [],
    },
    league: "Egyptian Premier League",
    leagueAr: "الدوري المصري الممتاز",
    kickoff: "غداً، 7:00 م",
    kickoffDate: new Date(Date.now() + 86400000),
    venue: "ستاد بتروسبورت",
    stadium: "ستاد بتروسبورت",
    referee: "محمود البنا",
    status: "upcoming" as const,
    predictionPrice: 5,
  },
  {
    id: "4",
    homeTeam: { 
      name: "Al Masry", 
      nameAr: "المصري", 
      logo: "https://media.api-sports.io/football/teams/1028.png", 
      score: 0,
      formation: "4-2-3-1",
      coach: "عادل عبد الرحمن",
      players: [],
    },
    awayTeam: { 
      name: "Enppi", 
      nameAr: "إنبي", 
      logo: "https://media.api-sports.io/football/teams/1029.png", 
      score: 0,
      formation: "4-3-3",
      coach: "حمادة صدقي",
      players: [],
    },
    league: "Egyptian Premier League",
    leagueAr: "الدوري المصري الممتاز",
    kickoff: "انتهت",
    venue: "ستاد بورسعيد",
    stadium: "ستاد بورسعيد",
    referee: "محمد الحنفي",
    status: "finished" as const,
    predictionPrice: 5,
  },
  {
    id: "5",
    homeTeam: { 
      name: "Smouha", 
      nameAr: "سموحة", 
      logo: "https://media.api-sports.io/football/teams/1031.png",
      formation: "4-4-2",
      coach: "محمد عودة",
      players: [],
    },
    awayTeam: { 
      name: "Pharco", 
      nameAr: "فاركو", 
      logo: "https://media.api-sports.io/football/teams/17258.png",
      formation: "4-3-3",
      coach: "خالد جلال",
      players: [],
    },
    league: "Egyptian Premier League",
    leagueAr: "الدوري المصري الممتاز",
    kickoff: "السبت، 5:00 م",
    kickoffDate: new Date(Date.now() + 172800000),
    venue: "ستاد الإسكندرية",
    stadium: "ستاد الإسكندرية",
    referee: "إبراهيم نور الدين",
    status: "upcoming" as const,
    predictionPrice: 5,
  },
  {
    id: "6",
    homeTeam: { 
      name: "Eastern Company", 
      nameAr: "الشركة الشرقية", 
      logo: "https://media.api-sports.io/football/teams/17259.png", 
      score: 3,
      formation: "3-4-3",
      coach: "محمد عمر",
      players: [],
    },
    awayTeam: { 
      name: "National Bank", 
      nameAr: "البنك الأهلي", 
      logo: "https://media.api-sports.io/football/teams/17260.png", 
      score: 2,
      formation: "4-2-3-1",
      coach: "طارق العشري",
      players: [],
    },
    league: "Egyptian Premier League",
    leagueAr: "الدوري المصري الممتاز",
    kickoff: "انتهت",
    venue: "ستاد السلام",
    stadium: "ستاد السلام",
    referee: "محمد عادل",
    status: "finished" as const,
    predictionPrice: 5,
  },
];

const MatchesAr = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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
                      onViewFormation={() => handlePredict(match)}
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

        {/* FIFA-Style Prediction Dialog */}
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
          />
        )}
      </div>
    </>
  );
};

export default MatchesAr;