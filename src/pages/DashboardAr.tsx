import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { NavbarAr } from "@/components/layout/NavbarAr";
import { FooterAr } from "@/components/layout/FooterAr";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Award,
  ChevronLeft,
  Star,
  Zap,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { translations as t } from "@/lib/translations";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Prediction {
  id: string;
  predicted_home_score: number;
  predicted_away_score: number;
  points_earned: number;
  created_at: string;
  match: {
    home_team: { name: string; name_ar: string; logo_url: string };
    away_team: { name: string; name_ar: string; logo_url: string };
    home_score: number | null;
    away_score: number | null;
    status: string;
  };
}

const stats = [
  { label: t.totalPoints, value: "2,450", icon: Trophy, color: "text-accent" },
  { label: t.predictions, value: "87", icon: Target, color: "text-primary" },
  { label: t.accuracy, value: "64%", icon: BarChart3, color: "text-upcoming" },
  { label: t.globalRank, value: "#142", icon: TrendingUp, color: "text-live" },
];

const achievements = [
  { name: "الفوز الأول", icon: "🏅", unlocked: true },
  { name: "سلسلة ساخنة", icon: "🔥", unlocked: true },
  { name: "نتيجة مثالية", icon: "💯", unlocked: false },
  { name: "عراف الأهداف", icon: "🎯", unlocked: false },
];

const DashboardAr = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPredictions();
    }
  }, [user]);

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      // For now, use demo data since we don't have real match joins
      setPredictions([]);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t.dashboard} - فوت بريديكت برو</title>
        <meta name="description" content="تتبع توقعاتك واحصائياتك في فوت بريديكت برو" />
      </Helmet>

      <div className="min-h-screen bg-background" dir="rtl">
        <NavbarAr />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{t.dashboard}</h1>
                <p className="text-muted-foreground">{t.welcome}! {t.predictionOverview}</p>
              </div>
              <Button variant="hero" onClick={() => navigate('/matches')}>
                {t.makePrediction}
                <ChevronLeft className="w-4 h-4" />
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
                      <h2 className="font-display text-xl font-semibold">{t.upcomingPredictions}</h2>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/matches')}>
                      {t.viewAll} <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="glass rounded-xl p-6 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">لا توجد توقعات قادمة</p>
                    <Button variant="hero" onClick={() => navigate('/matches')}>
                      تصفح المباريات
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </section>

                {/* Recent Predictions */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary" />
                      <h2 className="font-display text-xl font-semibold">{t.recentPredictions}</h2>
                    </div>
                  </div>
                  <div className="glass rounded-xl p-6 text-center">
                    <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لم تقم بأي توقعات بعد</p>
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="glass rounded-xl p-5">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    {t.quickActions}
                  </h3>
                  <div className="space-y-2">
                    <Button variant="secondary" className="w-full justify-start gap-2" onClick={() => navigate('/matches')}>
                      <Calendar className="w-4 h-4" />
                      عرض مباريات اليوم
                    </Button>
                    <Button variant="secondary" className="w-full justify-start gap-2" onClick={() => navigate('/leaderboard')}>
                      <Trophy className="w-4 h-4" />
                      {t.leaderboard}
                    </Button>
                    <Button variant="secondary" className="w-full justify-start gap-2">
                      <Star className="w-4 h-4" />
                      انضم لدوري خاص
                    </Button>
                  </div>
                </div>

                {/* Achievements */}
                <div className="glass rounded-xl p-5">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent" />
                    {t.achievements}
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
                    عرض الكل <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>

                {/* Weekly Progress */}
                <div className="glass rounded-xl p-5">
                  <h3 className="font-semibold mb-4">{t.thisWeek}</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">التوقعات المكتملة</span>
                        <span className="font-medium">0/10</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "0%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">نسبة الدقة</span>
                        <span className="font-medium">0%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: "0%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <FooterAr />
      </div>
    </>
  );
};

export default DashboardAr;