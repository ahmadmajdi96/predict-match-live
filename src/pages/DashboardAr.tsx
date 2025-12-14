import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { NavbarAr } from "@/components/layout/NavbarAr";
import { FooterAr } from "@/components/layout/FooterAr";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { translations as t } from "@/lib/translations";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PredictionHistory } from "@/components/user/PredictionHistory";

const stats = [
  { label: t.totalPoints, value: "0", icon: Trophy, color: "text-accent" },
  { label: t.predictions, value: "0", icon: Target, color: "text-primary" },
  { label: t.accuracy, value: "0%", icon: BarChart3, color: "text-upcoming" },
  { label: t.globalRank, value: "-", icon: TrendingUp, color: "text-live" },
];

const achievements = [
  { name: "الفوز الأول", icon: "🏅", unlocked: false },
  { name: "سلسلة ساخنة", icon: "🔥", unlocked: false },
  { name: "نتيجة مثالية", icon: "💯", unlocked: false },
  { name: "عراف الأهداف", icon: "🎯", unlocked: false },
];

const DashboardAr = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    totalPredictions: 0,
    accuracy: 0,
    rank: "-",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Fetch user's predictions count
      const { count: predictionsCount } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Fetch user's total points
      const { data: pointsData } = await supabase
        .from('predictions')
        .select('points_earned')
        .eq('user_id', user?.id);

      const totalPoints = pointsData?.reduce((sum, p) => sum + (p.points_earned || 0), 0) || 0;
      const correctPredictions = pointsData?.filter(p => (p.points_earned || 0) > 0).length || 0;
      const accuracy = predictionsCount ? Math.round((correctPredictions / predictionsCount) * 100) : 0;

      // Fetch rank from leaderboard
      const { data: leaderboard } = await supabase.rpc('get_leaderboard');
      const rank = leaderboard?.findIndex(p => p.id === user?.id);

      setUserStats({
        totalPoints,
        totalPredictions: predictionsCount || 0,
        accuracy,
        rank: rank !== undefined && rank >= 0 ? `#${rank + 1}` : "-",
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
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

  const displayStats = [
    { label: t.totalPoints, value: userStats.totalPoints.toString(), icon: Trophy, color: "text-accent" },
    { label: t.predictions, value: userStats.totalPredictions.toString(), icon: Target, color: "text-primary" },
    { label: t.accuracy, value: `${userStats.accuracy}%`, icon: BarChart3, color: "text-upcoming" },
    { label: t.globalRank, value: userStats.rank, icon: TrendingUp, color: "text-live" },
  ];

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
              {displayStats.map((stat, index) => (
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

            {/* Tabs for Dashboard Content */}
            <Tabs defaultValue="overview" className="space-y-6" dir="rtl">
              <TabsList className="w-full flex-wrap h-auto gap-2 bg-secondary/50 p-2 rounded-xl">
                <TabsTrigger value="overview" className="flex-1 min-w-[120px] gap-2">
                  <BarChart3 className="w-4 h-4" />
                  نظرة عامة
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1 min-w-[120px] gap-2">
                  <History className="w-4 h-4" />
                  سجل التوقعات
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex-1 min-w-[120px] gap-2">
                  <Award className="w-4 h-4" />
                  الإنجازات
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
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

                    {/* Weekly Progress */}
                    <div className="glass rounded-xl p-5">
                      <h3 className="font-semibold mb-4">{t.thisWeek}</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">التوقعات المكتملة</span>
                            <span className="font-medium">{userStats.totalPredictions}/10</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all" 
                              style={{ width: `${Math.min(userStats.totalPredictions * 10, 100)}%` }} 
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">نسبة الدقة</span>
                            <span className="font-medium">{userStats.accuracy}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent rounded-full transition-all" 
                              style={{ width: `${userStats.accuracy}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Prediction History Tab */}
              <TabsContent value="history">
                <PredictionHistory />
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements">
                <div className="glass rounded-xl p-6">
                  <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent" />
                    {t.achievements}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={cn(
                          "aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 p-4 transition-all",
                          achievement.unlocked
                            ? "bg-accent/20 border border-accent/30"
                            : "bg-secondary/50 opacity-40 grayscale"
                        )}
                      >
                        <span className="text-4xl">{achievement.icon}</span>
                        <span className="text-sm font-medium text-center">{achievement.name}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-muted-foreground mt-6">
                    قم بالتوقع على المباريات لفتح الإنجازات!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <FooterAr />
      </div>
    </>
  );
};

export default DashboardAr;