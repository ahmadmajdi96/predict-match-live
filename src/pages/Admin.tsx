import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { NavbarAr } from "@/components/layout/NavbarAr";
import { FooterAr } from "@/components/layout/FooterAr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  DollarSign,
  BarChart3,
  Trophy,
  Shield,
  Ban,
  Save,
  Wallet,
  Award,
} from "lucide-react";
import { translations as t } from "@/lib/translations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ExpensesTab } from "@/components/admin/ExpensesTab";
import { ContestSettingsTab } from "@/components/admin/ContestSettingsTab";

interface League {
  id: string;
  name: string;
  name_ar: string | null;
  prediction_price: number;
  logo_url: string | null;
}

interface UserProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string | null;
  role?: string;
  predictions_count?: number;
}

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPredictions: 0,
    todayPredictions: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: leaguesData } = await supabase
        .from('leagues')
        .select('*')
        .order('name');
      
      if (leaguesData) setLeagues(leaguesData);

      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersData) {
        const usersWithRoles = await Promise.all(
          usersData.map(async (profile) => {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', profile.id)
              .maybeSingle();

            const { count } = await supabase
              .from('predictions')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', profile.id);

            return {
              ...profile,
              role: roleData?.role || 'user',
              predictions_count: count || 0,
            };
          })
        );
        setUsers(usersWithRoles);
      }

      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: predictionsCount } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true });

      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      const { data: revenueData } = await supabase
        .from('predictions')
        .select('amount_paid')
        .eq('is_paid', true);

      const totalRevenue = revenueData?.reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalPredictions: predictionsCount || 0,
        todayPredictions: todayCount || 0,
        totalRevenue,
      });
    } catch (error) {
      // Error fetching admin data
    } finally {
      setLoading(false);
    }
  };

  const updateLeaguePrice = async () => {
    if (!selectedLeague || !newPrice) return;

    try {
      const { error } = await supabase
        .from('leagues')
        .update({ prediction_price: parseFloat(newPrice) })
        .eq('id', selectedLeague);

      if (error) throw error;

      toast.success("تم تحديث السعر بنجاح");
      setNewPrice("");
      fetchData();
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث السعر");
    }
  };

  const toggleUserBan = async (userId: string, currentRole: string) => {
    toast.info("هذه الميزة قيد التطوير");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <>
      <Helmet>
        <title>{t.adminDashboard} - فوت بريديكت برو</title>
      </Helmet>

      <div className="min-h-screen bg-background" dir="rtl">
        <NavbarAr />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold">{t.adminDashboard}</h1>
                <p className="text-muted-foreground">إدارة المستخدمين والأسعار والمصروفات</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      <p className="text-sm text-muted-foreground">{t.totalUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalPredictions}</p>
                      <p className="text-sm text-muted-foreground">{t.totalPredictions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-upcoming/20 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-upcoming" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.todayPredictions}</p>
                      <p className="text-sm text-muted-foreground">{t.todayPredictions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-live/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-live" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalRevenue} {t.currency}</p>
                      <p className="text-sm text-muted-foreground">{t.totalRevenue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="pricing" className="space-y-6" dir="rtl">
              <TabsList className="w-full flex-wrap h-auto gap-2 bg-secondary/50 p-2 rounded-xl">
                <TabsTrigger value="pricing" className="flex-1 min-w-[120px] gap-2">
                  <DollarSign className="w-4 h-4" />
                  {t.managePricing}
                </TabsTrigger>
                <TabsTrigger value="contest" className="flex-1 min-w-[120px] gap-2">
                  <Award className="w-4 h-4" />
                  إعدادات المسابقة
                </TabsTrigger>
                <TabsTrigger value="expenses" className="flex-1 min-w-[120px] gap-2">
                  <Wallet className="w-4 h-4" />
                  المصروفات
                </TabsTrigger>
                <TabsTrigger value="users" className="flex-1 min-w-[120px] gap-2">
                  <Users className="w-4 h-4" />
                  {t.manageUsers}
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex-1 min-w-[120px] gap-2">
                  <Trophy className="w-4 h-4" />
                  {t.leaderboard}
                </TabsTrigger>
              </TabsList>

              {/* Pricing Tab */}
              <TabsContent value="pricing">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      {t.setPredictionPrice}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>{t.selectLeague}</Label>
                        <Select value={selectedLeague} onValueChange={setSelectedLeague}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الدوري" />
                          </SelectTrigger>
                          <SelectContent>
                            {leagues.map((league) => (
                              <SelectItem key={league.id} value={league.id}>
                                {league.name_ar || league.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{t.price} ({t.currency})</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          placeholder="0"
                        />
                      </div>

                      <div className="flex items-end">
                        <Button onClick={updateLeaguePrice} className="w-full gap-2">
                          <Save className="w-4 h-4" />
                          {t.save}
                        </Button>
                      </div>
                    </div>

                    {/* Leagues Table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">الدوري</TableHead>
                            <TableHead className="text-right">السعر الحالي</TableHead>
                            <TableHead className="text-right">الحالة</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {leagues.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                لا توجد دوريات مسجلة
                              </TableCell>
                            </TableRow>
                          ) : (
                            leagues.map((league) => (
                              <TableRow key={league.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    {league.logo_url && (
                                      <img src={league.logo_url} alt="" className="w-6 h-6 object-contain" />
                                    )}
                                    {league.name_ar || league.name}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {league.prediction_price} {t.currency}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={league.prediction_price > 0 ? "default" : "secondary"}>
                                    {league.prediction_price > 0 ? "مدفوع" : "مجاني"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contest Settings Tab */}
              <TabsContent value="contest">
                <ContestSettingsTab />
              </TabsContent>

              {/* Expenses Tab */}
              <TabsContent value="expenses">
                <ExpensesTab />
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {t.manageUsers}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">المستخدم</TableHead>
                            <TableHead className="text-right">البريد الإلكتروني</TableHead>
                            <TableHead className="text-right">الدور</TableHead>
                            <TableHead className="text-right">التوقعات</TableHead>
                            <TableHead className="text-right">تاريخ التسجيل</TableHead>
                            <TableHead className="text-right">الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((profile) => (
                            <TableRow key={profile.id}>
                              <TableCell className="font-medium">
                                {profile.display_name || "بدون اسم"}
                              </TableCell>
                              <TableCell dir="ltr" className="text-left">
                                {profile.email}
                              </TableCell>
                              <TableCell>
                                <Badge variant={profile.role === 'admin' ? "default" : "secondary"}>
                                  {profile.role === 'admin' ? 'مدير' : 'مستخدم'}
                                </Badge>
                              </TableCell>
                              <TableCell>{profile.predictions_count}</TableCell>
                              <TableCell>
                                {profile.created_at
                                  ? new Date(profile.created_at).toLocaleDateString('ar-EG')
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleUserBan(profile.id, profile.role || 'user')}
                                  >
                                    <Ban className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Leaderboard Tab */}
              <TabsContent value="leaderboard">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      {t.leaderboard}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">{t.rank}</TableHead>
                            <TableHead className="text-right">{t.player}</TableHead>
                            <TableHead className="text-right">{t.totalPoints}</TableHead>
                            <TableHead className="text-right">{t.predictions}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users
                            .sort((a, b) => (b.predictions_count || 0) - (a.predictions_count || 0))
                            .slice(0, 10)
                            .map((profile, index) => (
                              <TableRow key={profile.id}>
                                <TableCell>
                                  <span className={
                                    index === 0 ? "text-accent font-bold" :
                                    index === 1 ? "text-muted-foreground font-bold" :
                                    index === 2 ? "text-orange-500 font-bold" :
                                    ""
                                  }>
                                    #{index + 1}
                                  </span>
                                </TableCell>
                                <TableCell className="font-medium">
                                  {profile.display_name || "بدون اسم"}
                                </TableCell>
                                <TableCell>0</TableCell>
                                <TableCell>{profile.predictions_count}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <FooterAr />
      </div>
    </>
  );
};

export default Admin;