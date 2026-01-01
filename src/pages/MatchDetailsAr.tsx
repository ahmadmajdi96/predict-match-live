import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { NavbarAr } from "@/components/layout/NavbarAr";
import { FooterAr } from "@/components/layout/FooterAr";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowRight, 
  Calendar, 
  MapPin, 
  User, 
  Users, 
  Timer,
  Target,
  Flag,
  AlertTriangle,
  Percent,
  Crosshair,
  Shield,
  Goal
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MatchEvent {
  time: { elapsed: number; extra?: number };
  team: { id: number; name: string };
  player: { id: number; name: string };
  assist?: { id: number; name: string };
  type: string;
  detail: string;
  comments?: string;
}

interface MatchStatistic {
  type: string;
  value: string | number | null;
}

export default function MatchDetailsAr() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();

  const { data: match, isLoading } = useQuery({
    queryKey: ["match-details", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(id, name, name_ar, logo_url),
          away_team:teams!matches_away_team_id_fkey(id, name, name_ar, logo_url),
          league:leagues(id, name, name_ar, logo_url)
        `)
        .eq("id", matchId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!matchId,
  });

  const matchDetails = match?.match_details as { events?: MatchEvent[] } | null;
  const matchStats = match?.match_stats as { home?: MatchStatistic[]; away?: MatchStatistic[] } | null;

  const getEventIcon = (type: string, detail: string) => {
    if (type === "Goal") return <Goal className="w-5 h-5 text-green-500" />;
    if (type === "Card" && detail === "Yellow Card") return <div className="w-4 h-5 bg-yellow-400 rounded-sm" />;
    if (type === "Card" && detail === "Red Card") return <div className="w-4 h-5 bg-red-500 rounded-sm" />;
    if (type === "subst") return <Users className="w-5 h-5 text-blue-500" />;
    return <Target className="w-5 h-5" />;
  };

  const getEventText = (event: MatchEvent) => {
    if (event.type === "Goal") {
      if (event.detail === "Own Goal") return "هدف عكسي";
      if (event.detail === "Penalty") return "ضربة جزاء";
      return "هدف";
    }
    if (event.type === "Card") {
      if (event.detail === "Yellow Card") return "بطاقة صفراء";
      if (event.detail === "Red Card") return "بطاقة حمراء";
      if (event.detail === "Second Yellow card") return "بطاقة صفراء ثانية";
    }
    if (event.type === "subst") return "تبديل";
    return event.type;
  };

  const getStatLabel = (type: string) => {
    const labels: Record<string, string> = {
      "Ball Possession": "الاستحواذ",
      "Total Shots": "التسديدات",
      "Shots on Goal": "التسديدات على المرمى",
      "Shots off Goal": "التسديدات خارج المرمى",
      "Blocked Shots": "التسديدات المحجوبة",
      "Corner Kicks": "الركنيات",
      "Offsides": "التسلل",
      "Fouls": "الأخطاء",
      "Yellow Cards": "البطاقات الصفراء",
      "Red Cards": "البطاقات الحمراء",
      "Goalkeeper Saves": "إنقاذات الحارس",
      "Total passes": "التمريرات",
      "Passes accurate": "التمريرات الدقيقة",
      "Passes %": "نسبة التمريرات",
      "expected_goals": "الأهداف المتوقعة",
    };
    return labels[type] || type;
  };

  const getStatIcon = (type: string) => {
    if (type.includes("Possession")) return <Percent className="w-4 h-4" />;
    if (type.includes("Shots")) return <Crosshair className="w-4 h-4" />;
    if (type.includes("Corner")) return <Flag className="w-4 h-4" />;
    if (type.includes("Foul")) return <AlertTriangle className="w-4 h-4" />;
    if (type.includes("Card")) return <Shield className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <NavbarAr />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 w-full rounded-2xl mb-6" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </main>
        <FooterAr />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <NavbarAr />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">المباراة غير موجودة</h1>
          <Button onClick={() => navigate("/matches")}>
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للمباريات
          </Button>
        </main>
        <FooterAr />
      </div>
    );
  }

  const homeTeam = match.home_team;
  const awayTeam = match.away_team;
  const kickoffDate = new Date(match.kickoff_time);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Helmet>
        <title>{`${homeTeam?.name_ar || homeTeam?.name} vs ${awayTeam?.name_ar || awayTeam?.name}`}</title>
      </Helmet>
      <NavbarAr />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/matches")}
          className="mb-6"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة للمباريات
        </Button>

        {/* Match Header Card */}
        <div className="glass-card p-6 sm:p-8 mb-8">
          {/* League Info */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {match.league?.logo_url && (
              <img 
                src={match.league.logo_url} 
                alt={match.league.name_ar || match.league.name}
                className="w-6 h-6 object-contain"
              />
            )}
            <span className="text-sm text-muted-foreground">
              {match.league?.name_ar || match.league?.name}
            </span>
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-between gap-4 sm:gap-8">
            {/* Away Team */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-secondary/50 flex items-center justify-center mb-3">
                <img
                  src={awayTeam?.logo_url || '/placeholder.svg'}
                  alt={awayTeam?.name_ar || awayTeam?.name}
                  className="w-14 h-14 sm:w-18 sm:h-18 object-contain"
                  onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                />
              </div>
              <h2 className="font-bold text-sm sm:text-lg">
                {awayTeam?.name_ar || awayTeam?.name}
              </h2>
              {match.away_coach && (
                <p className="text-xs text-muted-foreground mt-1">
                  المدرب: {match.away_coach}
                </p>
              )}
              {match.away_formation && (
                <p className="text-xs text-primary mt-1">
                  التشكيل: {match.away_formation}
                </p>
              )}
            </div>

            {/* Score */}
            <div className="flex flex-col items-center px-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className={cn(
                  "text-4xl sm:text-5xl font-display font-bold",
                  match.status === "live" && "text-live"
                )}>
                  {match.away_score ?? "-"}
                </span>
                <span className="text-2xl text-muted-foreground">:</span>
                <span className={cn(
                  "text-4xl sm:text-5xl font-display font-bold",
                  match.status === "live" && "text-live"
                )}>
                  {match.home_score ?? "-"}
                </span>
              </div>
              
              {/* Status Badge */}
              <span className={cn(
                "mt-3 px-4 py-1 rounded-full text-sm font-medium",
                match.status === "live" && "status-live",
                match.status === "upcoming" && "status-upcoming",
                match.status === "finished" && "status-finished"
              )}>
                {match.status === "live" ? "مباشر" : 
                 match.status === "upcoming" ? "لم تبدأ" : "انتهت"}
              </span>
            </div>

            {/* Home Team */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-secondary/50 flex items-center justify-center mb-3">
                <img
                  src={homeTeam?.logo_url || '/placeholder.svg'}
                  alt={homeTeam?.name_ar || homeTeam?.name}
                  className="w-14 h-14 sm:w-18 sm:h-18 object-contain"
                  onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                />
              </div>
              <h2 className="font-bold text-sm sm:text-lg">
                {homeTeam?.name_ar || homeTeam?.name}
              </h2>
              {match.home_coach && (
                <p className="text-xs text-muted-foreground mt-1">
                  المدرب: {match.home_coach}
                </p>
              )}
              {match.home_formation && (
                <p className="text-xs text-primary mt-1">
                  التشكيل: {match.home_formation}
                </p>
              )}
            </div>
          </div>

          {/* Match Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{format(kickoffDate, "EEEE d MMMM yyyy", { locale: ar })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span>{format(kickoffDate, "HH:mm")}</span>
            </div>
            {match.stadium && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{match.stadium}</span>
              </div>
            )}
            {match.referee && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>الحكم: {match.referee}</span>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Section */}
        {matchStats?.home && matchStats?.away && (
          <div className="glass-card p-6 sm:p-8 mb-8">
            <h3 className="text-xl font-bold mb-6 text-center">إحصائيات المباراة</h3>
            <div className="space-y-4">
              {matchStats.home.map((homeStat, index) => {
                const awayStat = matchStats.away?.[index];
                if (!awayStat) return null;
                
                const homeValue = typeof homeStat.value === 'string' 
                  ? parseInt(homeStat.value.replace('%', '')) || 0 
                  : homeStat.value || 0;
                const awayValue = typeof awayStat.value === 'string' 
                  ? parseInt(awayStat.value.replace('%', '')) || 0 
                  : awayStat.value || 0;
                const total = homeValue + awayValue || 1;
                const homePercent = (homeValue / total) * 100;
                const awayPercent = (awayValue / total) * 100;

                return (
                  <div key={homeStat.type} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium w-16 text-right">
                        {homeStat.value ?? 0}
                      </span>
                      <div className="flex items-center gap-2 flex-1 justify-center">
                        {getStatIcon(homeStat.type)}
                        <span className="text-muted-foreground">
                          {getStatLabel(homeStat.type)}
                        </span>
                      </div>
                      <span className="font-medium w-16 text-left">
                        {awayStat.value ?? 0}
                      </span>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden bg-secondary">
                      <div 
                        className="bg-primary transition-all duration-500"
                        style={{ width: `${homePercent}%` }}
                      />
                      <div 
                        className="bg-accent transition-all duration-500"
                        style={{ width: `${awayPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Events Section */}
        {matchDetails?.events && matchDetails.events.length > 0 && (
          <div className="glass-card p-6 sm:p-8">
            <h3 className="text-xl font-bold mb-6 text-center">أحداث المباراة</h3>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute right-1/2 top-0 bottom-0 w-0.5 bg-border transform translate-x-1/2" />
              
              <div className="space-y-4">
                {matchDetails.events.map((event, index) => {
                  const isHomeTeam = event.team?.id === (homeTeam as any)?.api_id;
                  
                  return (
                    <div 
                      key={index}
                      className={cn(
                        "flex items-center gap-4",
                        isHomeTeam ? "flex-row" : "flex-row-reverse"
                      )}
                    >
                      {/* Event Content */}
                      <div className={cn(
                        "flex-1 glass-card p-4",
                        isHomeTeam ? "text-right" : "text-left"
                      )}>
                        <div className="flex items-center gap-2 justify-start">
                          {getEventIcon(event.type, event.detail)}
                          <span className="font-medium">{getEventText(event)}</span>
                        </div>
                        <p className="text-sm font-bold mt-1">{event.player?.name}</p>
                        {event.assist?.name && (
                          <p className="text-xs text-muted-foreground">
                            تمريرة: {event.assist.name}
                          </p>
                        )}
                      </div>

                      {/* Time Badge */}
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center z-10 shrink-0">
                        <span className="text-sm font-bold text-primary">
                          {event.time.elapsed}'
                          {event.time.extra && `+${event.time.extra}`}
                        </span>
                      </div>

                      {/* Empty Space for other side */}
                      <div className="flex-1" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {(!matchStats?.home && !matchDetails?.events) && (
          <div className="glass-card p-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-bold mb-2">لا توجد إحصائيات بعد</h3>
            <p className="text-muted-foreground">
              ستتوفر الإحصائيات والأحداث عند بدء المباراة
            </p>
          </div>
        )}
      </main>
      
      <FooterAr />
    </div>
  );
}