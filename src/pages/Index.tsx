import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedMatches } from "@/components/home/FeaturedMatches";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LeaderboardPreview } from "@/components/home/LeaderboardPreview";
import { CtaSection } from "@/components/home/CtaSection";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>FootPredict Pro - Real-Time Football Predictions</title>
        <meta
          name="description"
          content="Join the ultimate football prediction platform. Predict scores, scorers, and match outcomes. Compete with friends and climb the global leaderboard."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturedMatches />
          <HowItWorks />
          <LeaderboardPreview />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
