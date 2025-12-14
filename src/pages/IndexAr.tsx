import { NavbarAr } from "@/components/layout/NavbarAr";
import { FooterAr } from "@/components/layout/FooterAr";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trophy, Target, Users, Zap, Star, UserPlus, LogIn, Shield, Settings, Gamepad2, Crown, Flame, Medal, CheckCircle, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { translations as t } from "@/lib/translations";
import { Helmet } from "react-helmet-async";

const stats = [
  { value: "10K+", label: "مستخدم نشط", icon: Users },
  { value: "50K+", label: "توقع تم", icon: Target },
  { value: "99%", label: "معدل الرضا", icon: Star },
];

const features = [
  {
    icon: Trophy,
    title: "تنافس واربح",
    description: "احصل على نقاط مقابل توقعاتك الصحيحة وتنافس على المراكز الأولى",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Target,
    title: "توقعات دقيقة",
    description: "توقع النتائج، الهدافين، الركنيات والمزيد من الإحصائيات",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Flame,
    title: "مكافآت حصرية",
    description: "اربح جوائز قيمة ومكافآت يومية على توقعاتك الصحيحة",
    gradient: "from-red-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "بيانات حية",
    description: "تابع نتائج المباريات لحظة بلحظة مع تحديثات فورية",
    gradient: "from-blue-500 to-cyan-500",
  },
];

const howItWorks = [
  {
    step: 1,
    icon: UserPlus,
    title: "سجّل حسابك",
    description: "أنشئ حسابك المجاني في ثوانٍ معدودة",
  },
  {
    step: 2,
    icon: Target,
    title: "اختر مباراتك",
    description: "تصفح المباريات القادمة واختر ما تريد التوقع عليه",
  },
  {
    step: 3,
    icon: Award,
    title: "قدّم توقعك",
    description: "توقع النتيجة والهداف الأول والركنيات والبطاقات",
  },
  {
    step: 4,
    icon: Trophy,
    title: "اربح النقاط",
    description: "احصل على نقاط لكل توقع صحيح وتنافس على الجوائز",
  },
];

const prizes = [
  { place: "المركز الأول", prize: "1000", icon: "🥇", gradient: "from-yellow-500 to-amber-600" },
  { place: "المركز الثاني", prize: "500", icon: "🥈", gradient: "from-slate-400 to-slate-500" },
  { place: "المركز الثالث", prize: "250", icon: "🥉", gradient: "from-amber-700 to-orange-800" },
];

const adminSteps = [
  {
    step: 1,
    icon: UserPlus,
    title: "إنشاء حساب",
    description: "قم بالتسجيل باستخدام البريد الإلكتروني وكلمة المرور",
  },
  {
    step: 2,
    icon: LogIn,
    title: "تسجيل الدخول",
    description: "سجل دخولك إلى حسابك الجديد",
  },
  {
    step: 3,
    icon: Shield,
    title: "طلب صلاحيات الأدمن",
    description: "تواصل مع فريق الدعم لطلب صلاحيات المدير",
  },
  {
    step: 4,
    icon: Settings,
    title: "الوصول للوحة التحكم",
    description: "بعد التفعيل، يمكنك الوصول لـ /admin لإدارة المنصة",
  },
];

const IndexAr = () => {
  return (
    <>
      <Helmet>
        <title>فوت بريديكت برو - توقع نتائج المباريات واربح الجوائز</title>
        <meta
          name="description"
          content="انضم لأفضل منصة توقعات كرة القدم في مصر. توقع نتائج مباريات الدوري المصري الممتاز وتنافس مع الجميع."
        />
      </Helmet>

      <div className="min-h-screen bg-background" dir="rtl">
        <NavbarAr />
        
        <main>
          {/* Hero Section */}
          <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                  backgroundSize: '50px 50px',
                }}
              />
              
              <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
              <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "1s" }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
              
              <div className="absolute top-20 right-10 md:right-20 animate-float hidden sm:block">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center backdrop-blur-sm">
                  <Trophy className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
              </div>
              <div className="absolute bottom-32 left-10 md:left-20 animate-float hidden sm:block" style={{ animationDelay: "2s" }}>
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-sm">
                  <Crown className="w-5 h-5 md:w-7 md:h-7 text-accent" />
                </div>
              </div>
              <div className="absolute top-40 left-16 md:left-32 animate-float hidden md:block" style={{ animationDelay: "1s" }}>
                <div className="w-12 h-12 rounded-xl bg-live/20 border border-live/30 flex items-center justify-center backdrop-blur-sm">
                  <Flame className="w-6 h-6 text-live" />
                </div>
              </div>
              <div className="absolute bottom-40 right-16 md:right-32 animate-float hidden md:block" style={{ animationDelay: "3s" }}>
                <div className="w-14 h-14 rounded-2xl bg-upcoming/20 border border-upcoming/30 flex items-center justify-center backdrop-blur-sm">
                  <Medal className="w-7 h-7 text-upcoming" />
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full gaming-card mb-8 animate-fade-in">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-live animate-pulse" />
                    <span className="text-xs font-bold text-live">LIVE</span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <Gamepad2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">الدوري المصري الممتاز</span>
                </div>

                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in leading-tight">
                  <span className="gradient-text">{t.heroTitle}</span>
                  <br />
                  <span className="gradient-text-gold">{t.heroSubtitle}</span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  {t.heroDescription}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <Button variant="hero" size="xl" asChild className="group relative overflow-hidden">
                    <Link to="/matches">
                      <span className="relative z-10 flex items-center gap-2">
                        {t.startPredicting}
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </Button>
                  <Button variant="glass" size="xl" asChild className="gaming-glow">
                    <Link to="/leaderboard">
                      <Trophy className="w-5 h-5 text-accent" />
                      {t.leaderboard}
                    </Link>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-8 mt-10 md:mt-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  {stats.map((stat, index) => (
                    <div key={index} className="gaming-card px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/20 flex items-center justify-center">
                          <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                        </div>
                        <div className="text-right">
                          <div className="font-display text-xl md:text-3xl font-bold gradient-text">
                            {stat.value}
                          </div>
                          <div className="text-[10px] md:text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
                <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-24 relative bg-gradient-to-b from-transparent via-primary/5 to-transparent">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">كيف يعمل</span>
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                  ابدأ التوقع في <span className="gradient-text">4 خطوات</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  عملية بسيطة وسهلة للبدء في التوقع والمنافسة
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {howItWorks.map((item, index) => (
                  <div
                    key={index}
                    className="relative text-center animate-fade-in"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {/* Connector Line */}
                    {index < howItWorks.length - 1 && (
                      <div className="hidden lg:block absolute top-12 -left-4 w-8 h-0.5 bg-gradient-to-l from-primary/50 to-transparent" />
                    )}
                    
                    <div className="gaming-card rounded-2xl p-6 h-full hover:scale-105 transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-xs text-primary font-bold mb-2">الخطوة {item.step}</div>
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-24 relative">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
                  <Crown className="w-4 h-4 text-accent" />
                  <span className="text-sm font-bold text-accent">المميزات</span>
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                  لماذا <span className="gradient-text">فوت بريديكت</span>؟
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  منصة متكاملة لتوقعات كرة القدم مع ميزات فريدة تجعلك تفوز
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group gaming-card rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Prizes Section */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-primary/5 pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
                  <Trophy className="w-4 h-4 text-accent" />
                  <span className="text-sm font-bold text-accent">الجوائز</span>
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                  جوائز <span className="gradient-text-gold">قيّمة</span> بانتظارك
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  تنافس على المراكز الأولى واربح جوائز مالية ومكافآت حصرية
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {prizes.map((prize, index) => (
                  <div
                    key={index}
                    className="gaming-card rounded-3xl p-8 text-center hover:scale-105 transition-all duration-300 animate-fade-in relative overflow-hidden"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${prize.gradient} -mr-10 -mt-10 rounded-full opacity-20 blur-2xl`} />
                    
                    <div className="text-5xl mb-4">{prize.icon}</div>
                    <h3 className="font-bold text-xl mb-2">{prize.place}</h3>
                    <div className={`text-4xl font-display font-bold bg-gradient-to-r ${prize.gradient} bg-clip-text text-transparent`}>
                      {prize.prize}
                    </div>
                    <span className="text-muted-foreground text-sm">{t.currency}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Admin Registration Steps Section */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">للمديرين</span>
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                  خطوات <span className="gradient-text-gold">التسجيل كمدير</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  اتبع هذه الخطوات للوصول إلى لوحة تحكم المدير
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {adminSteps.map((item, index) => (
                  <div
                    key={index}
                    className="relative gaming-card rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 animate-fade-in group"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                      {item.step}
                    </div>
                    
                    {index < adminSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 -left-3 w-6 h-1 bg-gradient-to-l from-primary/50 to-transparent rounded-full" />
                    )}
                    
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4 mt-4 group-hover:bg-primary/20 transition-colors border border-border">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/auth">
                    <UserPlus className="w-5 h-5" />
                    إنشاء حساب جديد
                  </Link>
                </Button>
                <Button variant="gold" size="lg" asChild>
                  <Link to="/admin">
                    <Shield className="w-5 h-5" />
                    لوحة تحكم المدير
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center gaming-card rounded-3xl p-12 gaming-glow">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent to-yellow-600 animate-pulse" />
                  <div className="absolute inset-1 rounded-xl bg-card flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-accent" />
                  </div>
                </div>
                
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                  جاهز لبدء <span className="gradient-text-gold">التوقع</span>؟
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                  سجل الآن مجاناً وابدأ في توقع نتائج مباريات الدوري المصري وتنافس على المراكز الأولى
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="gold" size="xl" asChild>
                    <Link to="/auth">
                      <Flame className="w-5 h-5" />
                      {t.getStarted}
                      <ChevronLeft className="w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <FooterAr />
      </div>
    </>
  );
};

export default IndexAr;