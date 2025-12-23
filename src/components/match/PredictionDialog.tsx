import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { translations as t } from "@/lib/translations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Player {
  id: string;
  name: string;
  nameAr?: string;
}

interface PredictionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchId: string;
  homeTeam: {
    name: string;
    nameAr?: string;
    logo: string;
    players?: Player[];
  };
  awayTeam: {
    name: string;
    nameAr?: string;
    logo: string;
    players?: Player[];
  };
  predictionPrice: number;
  onSuccess?: () => void;
}

export function PredictionDialog({
  open,
  onOpenChange,
  matchId,
  homeTeam,
  awayTeam,
  predictionPrice,
  onSuccess,
}: PredictionDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [firstScorer, setFirstScorer] = useState("");
  const [totalCorners, setTotalCorners] = useState("");
  const [totalCards, setTotalCards] = useState("");

  const allPlayers = [...(homeTeam.players || []), ...(awayTeam.players || [])];

  const handleSubmit = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
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
        match_id: matchId,
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{t.makePrediction}</DialogTitle>
        </DialogHeader>

        {/* Teams Display */}
        <div className="flex items-center justify-between gap-4 py-4 border-b border-border">
          <div className="flex-1 text-center">
            <img src={awayTeam.logo} alt="" className="w-12 h-12 mx-auto mb-2" />
            <span className="text-sm font-medium">{awayTeam.nameAr || awayTeam.name}</span>
          </div>
          <span className="text-muted-foreground font-bold">{t.vs}</span>
          <div className="flex-1 text-center">
            <img src={homeTeam.logo} alt="" className="w-12 h-12 mx-auto mb-2" />
            <span className="text-sm font-medium">{homeTeam.nameAr || homeTeam.name}</span>
          </div>
        </div>

        {/* Free Prediction Notice */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
          <span className="text-primary font-bold">التوقع مجاني - الثلاثة الأوائل يفوزون بالجوائز!</span>
        </div>

        {/* Prediction Form */}
        <div className="space-y-4 mt-4">
          {/* Score */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-right block">{t.awayScore}</Label>
              <Input
                type="number"
                min="0"
                max="20"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                className="text-center text-lg font-bold"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">{t.homeScore}</Label>
              <Input
                type="number"
                min="0"
                max="20"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                className="text-center text-lg font-bold"
                placeholder="0"
              />
            </div>
          </div>

          {/* First Scorer */}
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

          {/* Corners */}
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

          {/* Cards */}
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

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {t.cancel}
          </Button>
          <Button variant="hero" onClick={handleSubmit} disabled={loading}>
            {loading ? t.loading : t.submitPrediction}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}