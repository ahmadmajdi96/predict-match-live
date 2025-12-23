import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { translations as t } from "@/lib/translations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  Trophy, Users, MapPin, Clock, Calendar, Shirt, 
  User, Award, AlertCircle, CheckCircle, X, Cloud
} from "lucide-react";

interface Player {
  id: string;
  name: string;
  nameAr?: string;
  number?: number;
  position?: string;
}

interface MatchDetails {
  id: string;
  homeTeam: {
    name: string;
    nameAr?: string;
    logo: string;
    formation?: string;
    coach?: string;
    players?: Player[];
  };
  awayTeam: {
    name: string;
    nameAr?: string;
    logo: string;
    formation?: string;
    coach?: string;
    players?: Player[];
  };
  league: string;
  leagueAr?: string;
  kickoff: string;
  kickoffDate?: Date;
  venue?: string;
  stadium?: string;
  referee?: string;
  weather?: string;
  status: "upcoming" | "live" | "finished";
  predictionPrice: number;
}

interface MatchPredictionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: MatchDetails;
  onSuccess?: () => void;
}

const positionRows: Record<string, number[]> = {
  "4-3-3": [1, 4, 3, 3],
  "4-4-2": [1, 4, 4, 2],
  "3-5-2": [1, 3, 5, 2],
  "4-2-3-1": [1, 4, 2, 3, 1],
  "5-3-2": [1, 5, 3, 2],
  "3-4-3": [1, 3, 4, 3],
};

function PlayerCard({ player, isHome }: { player: Player; isHome: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={cn(
        "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-transform hover:scale-110",
        isHome 
          ? "bg-primary/30 border-primary text-primary" 
          : "bg-accent/30 border-accent text-accent"
      )}>
        {player.number || "?"}
      </div>
      <span className="text-[8px] md:text-[10px] text-center max-w-[50px] truncate text-muted-foreground">
        {player.nameAr || player.name?.split(' ').pop()}
      </span>
    </div>
  );
}

function MiniFormation({ 
  team, 
  isHome 
}: { 
  team: MatchDetails['homeTeam']; 
  isHome: boolean;
}) {
  const rows = positionRows[team.formation || "4-3-3"] || [1, 4, 3, 3];
  let playerIndex = 0;
  const players = team.players || [];

  return (
    <div className="flex-1">
      <div className="flex items-center justify-center gap-2 mb-2">
        <img src={team.logo} alt={team.name} className="w-6 h-6 object-contain" 
          onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
        <Badge variant="outline" className="text-[10px]">{team.formation || "4-3-3"}</Badge>
      </div>

      <div className={cn(
        "relative rounded-lg p-2 min-h-[180px] flex flex-col justify-between",
        "bg-gradient-to-b",
        isHome ? "from-primary/20 to-primary/5" : "from-accent/20 to-accent/5",
        "border",
        isHome ? "border-primary/30" : "border-accent/30"
      )}>
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-current" />
          <div className="absolute top-1/4 left-1/4 right-1/4 h-1/2 border border-current rounded-full" />
        </div>

        <div className={cn(
          "relative flex flex-col gap-2",
          isHome ? "flex-col" : "flex-col-reverse"
        )}>
          {rows.map((count, rowIndex) => {
            const rowPlayers = players.slice(playerIndex, playerIndex + count);
            playerIndex += count;
            
            return (
              <div key={rowIndex} className="flex justify-around items-center">
                {rowPlayers.length > 0 ? rowPlayers.map((player) => (
                  <PlayerCard key={player.id} player={player} isHome={isHome} />
                )) : Array.from({ length: count }).map((_, i) => (
                  <PlayerCard key={i} player={{ id: `${i}`, name: "TBD", number: 0 }} isHome={isHome} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MatchPredictionDialog({
  open,
  onOpenChange,
  match,
  onSuccess,
}: MatchPredictionDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [firstScorer, setFirstScorer] = useState("");
  const [totalCorners, setTotalCorners] = useState("");
  const [totalCards, setTotalCards] = useState("");
  const [canPredict, setCanPredict] = useState(true);

  const allPlayers = [...(match.homeTeam.players || []), ...(match.awayTeam.players || [])];

  useEffect(() => {
    // Check if match has started
    if (match.kickoffDate) {
      const now = new Date();
      const kickoff = new Date(match.kickoffDate);
      setCanPredict(now < kickoff);
    }
    if (match.status !== "upcoming") {
      setCanPredict(false);
    }
  }, [match]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!canPredict) {
      toast.error("انتهى وقت التوقع لهذه المباراة");
      return;
    }

    if (!homeScore || !awayScore) {
      toast.error("يرجى إدخال النتيجة المتوقعة");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('predictions').insert({
        user_id: user.id,
        match_id: match.id,
        predicted_home_score: parseInt(homeScore),
        predicted_away_score: parseInt(awayScore),
        predicted_first_scorer_id: firstScorer || null,
        predicted_total_corners: totalCorners ? parseInt(totalCorners) : null,
        predicted_total_cards: totalCards ? parseInt(totalCards) : null,
        is_paid: false,
        amount_paid: 0,
      });

      if (error) throw error;

      toast.success("تم حفظ توقعك بنجاح!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error("لقد قمت بالتوقع على هذه المباراة من قبل");
      } else {
        toast.error("حدث خطأ أثناء حفظ التوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden p-0 gap-0">
        {/* FIFA-Style Header */}
        <div className="relative bg-gradient-to-b from-card to-background p-6 border-b border-border">
          {/* Close Button */}
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Match Status */}
          <div className="absolute top-4 right-4">
            {!canPredict ? (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="w-3 h-3" />
                انتهى وقت التوقع
              </Badge>
            ) : (
              <Badge variant="default" className="gap-1 bg-primary">
                <CheckCircle className="w-3 h-3" />
                متاح للتوقع
              </Badge>
            )}
          </div>

          {/* Teams Display */}
          <div className="flex items-center justify-center gap-4 md:gap-8 mt-4">
            {/* Away Team */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-secondary/50 flex items-center justify-center mb-2 md:mb-3 border border-border/50">
                <img
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.nameAr || match.awayTeam.name}
                  className="w-10 h-10 md:w-14 md:h-14 object-contain"
                  onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                />
              </div>
              <span className="font-bold text-sm md:text-lg">{match.awayTeam.nameAr || match.awayTeam.name}</span>
              {match.awayTeam.coach && (
                <span className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1 mt-1 hidden sm:flex">
                  <User className="w-3 h-3" />
                  {match.awayTeam.coach}
                </span>
              )}
            </div>

            {/* VS / Score */}
            <div className="flex flex-col items-center px-2 md:px-6">
              <span className="text-2xl md:text-4xl font-display font-bold text-primary">VS</span>
              <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2 text-muted-foreground">
                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">{match.kickoff}</span>
              </div>
            </div>

            {/* Home Team */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-secondary/50 flex items-center justify-center mb-2 md:mb-3 border border-border/50">
                <img
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.nameAr || match.homeTeam.name}
                  className="w-10 h-10 md:w-14 md:h-14 object-contain"
                  onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                />
              </div>
              <span className="font-bold text-sm md:text-lg">{match.homeTeam.nameAr || match.homeTeam.name}</span>
              {match.homeTeam.coach && (
                <span className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1 mt-1 hidden sm:flex">
                  <User className="w-3 h-3" />
                  {match.homeTeam.coach}
                </span>
              )}
            </div>
          </div>

          {/* League & Venue Info */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3 md:w-4 md:h-4 text-accent" />
              {match.leagueAr || match.league}
            </span>
            {match.stadium && (
              <span className="flex items-center gap-1 hidden sm:flex">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                {match.stadium}
              </span>
            )}
            {match.referee && (
              <span className="flex items-center gap-1 hidden md:flex">
                <User className="w-4 h-4" />
                {match.referee}
              </span>
            )}
          </div>
        </div>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1" dir="rtl">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger 
              value="info" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              <Users className="w-4 h-4 ml-2" />
              تفاصيل المباراة
            </TabsTrigger>
            <TabsTrigger 
              value="formation" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              <Shirt className="w-4 h-4 ml-2" />
              التشكيلة
            </TabsTrigger>
            <TabsTrigger 
              value="predict" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              <Award className="w-4 h-4 ml-2" />
              التوقع
            </TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto max-h-[400px] p-6">
            {/* Match Info Tab */}
            <TabsContent value="info" className="mt-0 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Match Details */}
                <div className="gaming-card p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2 text-primary">
                    <Calendar className="w-4 h-4" />
                    تفاصيل المباراة
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">البطولة</span>
                      <span className="font-medium">{match.leagueAr || match.league}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">التوقيت</span>
                      <span className="font-medium">{match.kickoff}</span>
                    </div>
                    {match.stadium && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الملعب</span>
                        <span className="font-medium">{match.stadium}</span>
                      </div>
                    )}
                    {match.referee && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الحكم</span>
                        <span className="font-medium">{match.referee}</span>
                      </div>
                    )}
                    {match.weather && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الطقس</span>
                        <span className="font-medium flex items-center gap-1">
                          <Cloud className="w-3 h-3" />
                          {match.weather}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Free Prediction Notice */}
                <div className="gaming-card p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2 text-primary">
                    <Trophy className="w-4 h-4" />
                    نظام النقاط
                  </h3>
                  <div className="text-center py-4">
                    <div className="text-2xl font-bold text-primary">مجاني</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      الثلاثة الأوائل في الترتيب يفوزون بالجوائز!
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Coaches */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <img src={match.homeTeam.logo} alt="" className="w-10 h-10 object-contain" 
                      onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                    <div>
                      <p className="font-semibold">{match.homeTeam.nameAr || match.homeTeam.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        المدرب: {match.homeTeam.coach || "غير محدد"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <img src={match.awayTeam.logo} alt="" className="w-10 h-10 object-contain"
                      onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                    <div>
                      <p className="font-semibold">{match.awayTeam.nameAr || match.awayTeam.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        المدرب: {match.awayTeam.coach || "غير محدد"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Formation Tab */}
            <TabsContent value="formation" className="mt-0">
              <div className="grid md:grid-cols-2 gap-4">
                <MiniFormation team={match.awayTeam} isHome={false} />
                <MiniFormation team={match.homeTeam} isHome={true} />
              </div>
            </TabsContent>

            {/* Prediction Tab */}
            <TabsContent value="predict" className="mt-0 space-y-4">
              {!canPredict ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">انتهى وقت التوقع</h3>
                  <p className="text-muted-foreground">لا يمكنك التوقع على هذه المباراة لأنها بدأت أو انتهت</p>
                </div>
              ) : (
                <>
                  {/* Score Prediction */}
                  <div className="gaming-card p-4">
                    <h3 className="font-semibold mb-4 text-center">توقع النتيجة</h3>
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <img src={match.awayTeam.logo} alt="" className="w-10 h-10 mx-auto mb-2 object-contain"
                          onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          value={awayScore}
                          onChange={(e) => setAwayScore(e.target.value)}
                          className="w-16 text-center text-2xl font-bold"
                          placeholder="0"
                        />
                      </div>
                      <span className="text-2xl font-bold text-muted-foreground">-</span>
                      <div className="text-center">
                        <img src={match.homeTeam.logo} alt="" className="w-10 h-10 mx-auto mb-2 object-contain"
                          onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          value={homeScore}
                          onChange={(e) => setHomeScore(e.target.value)}
                          className="w-16 text-center text-2xl font-bold"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Predictions */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {allPlayers.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-right block">{t.firstScorer}</Label>
                        <Select value={firstScorer} onValueChange={setFirstScorer}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر اللاعب" />
                          </SelectTrigger>
                          <SelectContent>
                            {allPlayers.map((player) => (
                              <SelectItem key={player.id} value={player.id}>
                                {player.nameAr || player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label className="text-right block">{t.totalCorners}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        value={totalCorners}
                        onChange={(e) => setTotalCorners(e.target.value)}
                        className="text-center"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-right block">{t.totalCards}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={totalCards}
                        onChange={(e) => setTotalCards(e.target.value)}
                        className="text-center"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                      {t.cancel}
                    </Button>
                    <Button variant="hero" onClick={handleSubmit} disabled={loading} className="flex-1">
                      {loading ? t.loading : t.submitPrediction}
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}