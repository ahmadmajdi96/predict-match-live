import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { NavbarAr } from "@/components/layout/NavbarAr";
import { FooterAr } from "@/components/layout/FooterAr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { translations as t } from "@/lib/translations";
import { Trophy, RefreshCw, TrendingUp, TrendingDown, Minus, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TeamStanding {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  form: string;
}

export default function StandingsAr() {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchStandings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("football-api", {
        body: { action: "getStandings", leagueId: "233", season: "2024" },
      });

      if (error) throw error;

      if (data.response && data.response.length > 0) {
        const leagueStandings = data.response[0].league.standings[0];
        setStandings(leagueStandings);
      }
    } catch (error) {
      console.error("Error fetching standings:", error);
      toast.error("فشل في جلب ترتيب الدوري");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  const handleRefresh = async () => {
    setSyncing(true);
    await fetchStandings();
    setSyncing(false);
    toast.success("تم تحديث الترتيب");
  };

  const getFormIcon = (result: string) => {
    switch (result) {
      case "W":
        return <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">ف</div>;
      case "D":
        return <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">ت</div>;
      case "L":
        return <div className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center text-[10px] font-bold text-destructive-foreground">خ</div>;
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return (
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
          rank === 1 && "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950",
          rank === 2 && "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800",
          rank === 3 && "bg-gradient-to-br from-orange-400 to-orange-600 text-orange-950"
        )}>
          {rank}
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-sm text-muted-foreground">
        {rank}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>ترتيب الدوري المصري | فوت بريديكت برو</title>
        <meta name="description" content="ترتيب فرق الدوري المصري الممتاز - النقاط والأهداف والفارق" />
      </Helmet>

      <NavbarAr />

      <main className="min-h-screen pt-20 pb-12" dir="rtl">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary" />
                ترتيب الدوري المصري
              </h1>
              <p className="text-muted-foreground">موسم 2024/2025</p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={syncing}
              className="gap-2"
            >
              <RefreshCw className={cn("w-4 h-4", syncing && "animate-spin")} />
              تحديث
            </Button>
          </div>

          {/* Standings Table */}
          <Card className="glass overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-gradient-to-l from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-accent" />
                جدول الترتيب
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : standings.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>لا توجد بيانات متاحة</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                        <TableHead className="text-right w-12">#</TableHead>
                        <TableHead className="text-right">الفريق</TableHead>
                        <TableHead className="text-center">لعب</TableHead>
                        <TableHead className="text-center">فوز</TableHead>
                        <TableHead className="text-center">تعادل</TableHead>
                        <TableHead className="text-center">خسارة</TableHead>
                        <TableHead className="text-center">له</TableHead>
                        <TableHead className="text-center">عليه</TableHead>
                        <TableHead className="text-center">الفارق</TableHead>
                        <TableHead className="text-center font-bold">النقاط</TableHead>
                        <TableHead className="text-center hidden md:table-cell">آخر 5</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {standings.map((team, index) => (
                        <TableRow
                          key={team.team.id}
                          className={cn(
                            "transition-colors",
                            index < 3 && "bg-primary/5 hover:bg-primary/10",
                            index >= standings.length - 3 && "bg-destructive/5 hover:bg-destructive/10"
                          )}
                        >
                          <TableCell className="font-medium">
                            {getRankBadge(team.rank)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={team.team.logo}
                                alt={team.team.name}
                                className="w-8 h-8 object-contain"
                                onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                              />
                              <span className="font-medium text-sm md:text-base">{team.team.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {team.all.played}
                          </TableCell>
                          <TableCell className="text-center text-primary font-medium">
                            {team.all.win}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {team.all.draw}
                          </TableCell>
                          <TableCell className="text-center text-destructive font-medium">
                            {team.all.lose}
                          </TableCell>
                          <TableCell className="text-center">
                            {team.all.goals.for}
                          </TableCell>
                          <TableCell className="text-center">
                            {team.all.goals.against}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={cn(
                              "font-medium",
                              team.goalsDiff > 0 && "text-primary",
                              team.goalsDiff < 0 && "text-destructive"
                            )}>
                              {team.goalsDiff > 0 ? `+${team.goalsDiff}` : team.goalsDiff}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="default" className="text-base font-bold px-3 py-1">
                              {team.points}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center justify-center gap-1">
                              {team.form?.split('').slice(0, 5).map((result, i) => (
                                <span key={i}>{getFormIcon(result)}</span>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary/20" />
              <span>دوري أبطال أفريقيا</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-destructive/20" />
              <span>الهبوط</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[8px] font-bold text-primary-foreground">ف</div>
              <span>فوز</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold">ت</div>
              <span>تعادل</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center text-[8px] font-bold text-destructive-foreground">خ</div>
              <span>خسارة</span>
            </div>
          </div>
        </div>
      </main>

      <FooterAr />
    </>
  );
}
