import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { NavbarAr } from "@/components/layout/NavbarAr";
import { FooterAr } from "@/components/layout/FooterAr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { translations as t } from "@/lib/translations";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_points: number;
  total_predictions: number;
}

const LeaderboardAr = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase.rpc('get_leaderboard');
      if (error) throw error;
      setLeaders(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-accent" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-muted-foreground" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-500" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-accent/20 text-accent border-accent/30";
    if (rank === 2) return "bg-muted text-muted-foreground border-muted";
    if (rank === 3) return "bg-orange-500/20 text-orange-500 border-orange-500/30";
    return "bg-secondary text-secondary-foreground border-secondary";
  };

  // Demo data if no real data
  const displayLeaders = leaders.length > 0 ? leaders : [
    { id: "1", display_name: "أحمد محمد", avatar_url: null, total_points: 2450, total_predictions: 87 },
    { id: "2", display_name: "محمد علي", avatar_url: null, total_points: 2280, total_predictions: 92 },
    { id: "3", display_name: "خالد سعيد", avatar_url: null, total_points: 2150, total_predictions: 78 },
    { id: "4", display_name: "عمر حسن", avatar_url: null, total_points: 1980, total_predictions: 85 },
    { id: "5", display_name: "يوسف أحمد", avatar_url: null, total_points: 1850, total_predictions: 76 },
    { id: "6", display_name: "مصطفى كمال", avatar_url: null, total_points: 1720, total_predictions: 68 },
    { id: "7", display_name: "إبراهيم سالم", avatar_url: null, total_points: 1650, total_predictions: 72 },
    { id: "8", display_name: "عبدالله محمود", avatar_url: null, total_points: 1580, total_predictions: 65 },
    { id: "9", display_name: "حسام عادل", avatar_url: null, total_points: 1490, total_predictions: 58 },
    { id: "10", display_name: "طارق نور", avatar_url: null, total_points: 1420, total_predictions: 62 },
  ];

  return (
    <>
      <Helmet>
        <title>{t.leaderboard} - فوت بريديكت برو</title>
        <meta name="description" content="تعرف على أفضل المتوقعين في فوت بريديكت برو" />
      </Helmet>

      <div className="min-h-screen bg-background" dir="rtl">
        <NavbarAr />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
                <Trophy className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">{t.leaderboard}</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                أفضل <span className="gradient-text-gold">المتوقعين</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                تنافس مع أفضل المتوقعين واحصل على مركزك في القائمة
              </p>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">{t.loading}</p>
              </div>
            ) : (
              <>
                {/* Top 3 Podium */}
                <div className="flex items-end justify-center gap-4 mb-12">
                  {/* 2nd Place */}
                  {displayLeaders[1] && (
                    <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-3 border-4 border-muted-foreground/30">
                        <span className="text-2xl font-bold">
                          {displayLeaders[1].display_name?.charAt(0) || "؟"}
                        </span>
                      </div>
                      <span className="font-medium text-sm mb-1">{displayLeaders[1].display_name}</span>
                      <span className="text-muted-foreground text-xs">{displayLeaders[1].total_points} {t.points}</span>
                      <div className="w-24 h-24 bg-muted/50 rounded-t-lg mt-4 flex items-center justify-center">
                        <span className="text-3xl font-bold text-muted-foreground">2</span>
                      </div>
                    </div>
                  )}

                  {/* 1st Place */}
                  {displayLeaders[0] && (
                    <div className="flex flex-col items-center animate-fade-in">
                      <Crown className="w-8 h-8 text-accent mb-2 animate-float" />
                      <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mb-3 border-4 border-accent glow-gold">
                        <span className="text-3xl font-bold text-accent">
                          {displayLeaders[0].display_name?.charAt(0) || "؟"}
                        </span>
                      </div>
                      <span className="font-bold text-lg mb-1">{displayLeaders[0].display_name}</span>
                      <span className="text-accent text-sm">{displayLeaders[0].total_points} {t.points}</span>
                      <div className="w-28 h-32 bg-accent/20 rounded-t-lg mt-4 flex items-center justify-center border-2 border-accent/30">
                        <span className="text-4xl font-bold text-accent">1</span>
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {displayLeaders[2] && (
                    <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
                      <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mb-3 border-4 border-orange-500/30">
                        <span className="text-2xl font-bold text-orange-500">
                          {displayLeaders[2].display_name?.charAt(0) || "؟"}
                        </span>
                      </div>
                      <span className="font-medium text-sm mb-1">{displayLeaders[2].display_name}</span>
                      <span className="text-muted-foreground text-xs">{displayLeaders[2].total_points} {t.points}</span>
                      <div className="w-24 h-20 bg-orange-500/10 rounded-t-lg mt-4 flex items-center justify-center">
                        <span className="text-3xl font-bold text-orange-500">3</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Full Leaderboard Table */}
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h2 className="font-semibold text-lg">جميع المتوقعين</h2>
                  </div>
                  <div className="divide-y divide-border">
                    {displayLeaders.map((entry, index) => (
                      <div
                        key={entry.id}
                        className={cn(
                          "flex items-center gap-4 p-4 transition-colors hover:bg-secondary/30",
                          index < 3 && "bg-secondary/20"
                        )}
                      >
                        {/* Rank */}
                        <div className="w-12 flex justify-center">
                          {getRankIcon(index + 1) || (
                            <span className="text-muted-foreground font-bold">#{index + 1}</span>
                          )}
                        </div>

                        {/* Avatar */}
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center font-bold border-2",
                          getRankBadge(index + 1)
                        )}>
                          {entry.display_name?.charAt(0) || "؟"}
                        </div>

                        {/* Name */}
                        <div className="flex-1">
                          <span className="font-medium">{entry.display_name || "بدون اسم"}</span>
                          <div className="text-xs text-muted-foreground">
                            {entry.total_predictions} توقع
                          </div>
                        </div>

                        {/* Points */}
                        <div className="text-left">
                          <span className={cn(
                            "font-bold text-lg",
                            index === 0 && "text-accent",
                            index === 1 && "text-muted-foreground",
                            index === 2 && "text-orange-500"
                          )}>
                            {entry.total_points}
                          </span>
                          <span className="text-xs text-muted-foreground mr-1">{t.points}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
        <FooterAr />
      </div>
    </>
  );
};

export default LeaderboardAr;