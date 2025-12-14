import { NavbarAr } from "@/components/layout/NavbarAr";
import { FooterAr } from "@/components/layout/FooterAr";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trophy, Target, Users, Zap, Star, UserPlus, LogIn, Shield, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { translations as t } from "@/lib/translations";
import { Helmet } from "react-helmet-async";
import goalLeft from "@/assets/goal-left.png";
import goalRight from "@/assets/goal-right.png";

const stats = [
  { value: "10K+", label: "مستخدم نشط" },
  { value: "50K+", label: "توقع تم" },
  { value: "99%", label: "معدل الرضا" },
];

const features = [
  {
    icon: Trophy,
    title: "تنافس واربح",
    description: "احصل على نقاط مقابل توقعاتك الصحيحة وتنافس على المراكز الأولى",
  },
  {
    icon: Target,
    title: "توقعات دقيقة",
    description: "توقع النتائج، الهدافين، الركنيات والمزيد من الإحصائيات",
  },
  {
    icon: Users,
    title: "مجتمع كبير",
    description: "انضم لآلاف المشجعين وتنافس معهم في التوقعات",
  },
  {
    icon: Zap,
    title: "بيانات حية",
    description: "تابع نتائج المباريات لحظة بلحظة مع تحديثات فورية",
  },
];

const adminSteps = [
  {
    step: 1,
    icon: UserPlus,
    title: "إنشاء حساب",
    description: "قم بالتسجيل في المنصة باستخدام البريد الإلكتروني وكلمة المرور",
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
            {/* Goal Background Images */}
            <img 
              src={goalLeft} 
              alt="" 
              className="absolute left-0 top-1/2 -translate-y-1/2 w-64 md:w-80 lg:w-96 opacity-20 pointer-events-none"
            />
            <img 
              src={goalRight} 
              alt="" 
              className="absolute right-0 top-1/2 -translate-y-1/2 w-64 md:w-80 lg:w-96 opacity-20 pointer-events-none transform scale-x-[-1]"
            />

            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
              <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-fade-in">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">الدوري المصري الممتاز</span>
                </div>

                {/* Title */}
                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in">
                  <span className="gradient-text">{t.heroTitle}</span>
                  <br />
                  <span className="gradient-text-cyan">{t.heroSubtitle}</span>
                </h1>

                {/* Description */}
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  {t.heroDescription}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <Button variant="hero" size="xl" asChild>
                    <Link to="/matches">
                      {t.startPredicting}
                      <ChevronLeft className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button variant="glass" size="xl" asChild>
                    <Link to="/leaderboard">
                      <Trophy className="w-5 h-5" />
                      {t.leaderboard}
                    </Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-8 md:gap-16 mt-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="font-display text-3xl md:text-4xl font-bold gradient-text mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
                <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-24 relative">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  لماذا <span className="gradient-text">فوت بريديكت</span>؟
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  منصة متكاملة لتوقعات كرة القدم مع ميزات فريدة
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="glass rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Admin Registration Steps Section */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  خطوات <span className="gradient-text-cyan">التسجيل كمدير</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  اتبع هذه الخطوات للوصول إلى لوحة تحكم المدير
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {adminSteps.map((item, index) => (
                  <div
                    key={index}
                    className="relative glass rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300 animate-fade-in group"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    
                    {/* Connector Line */}
                    {index < adminSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -left-3 w-6 h-0.5 bg-gradient-to-l from-primary/50 to-transparent" />
                    )}
                    
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 mt-4 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>

              {/* Quick Access Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/auth">
                    <UserPlus className="w-5 h-5" />
                    إنشاء حساب جديد
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-primary/50 text-primary hover:bg-primary/10">
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
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  جاهز لبدء <span className="gradient-text-cyan">التوقع</span>؟
                </h2>
                <p className="text-muted-foreground mb-8">
                  سجل الآن مجاناً وابدأ في توقع نتائج مباريات الدوري المصري
                </p>
                <Button variant="hero" size="xl" asChild>
                  <Link to="/auth">
                    {t.getStarted}
                    <ChevronLeft className="w-5 h-5" />
                  </Link>
                </Button>
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
