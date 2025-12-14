import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { translations as t } from "@/lib/translations";
import { Trophy, Target, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Prediction {
  id: string;
  predicted_home_score: number;
  predicted_away_score: number;
  predicted_total_corners: number | null;
  predicted_total_cards: number | null;
  points_earned: number | null;
  is_paid: boolean;
  amount_paid: number | null;
  created_at: string;
  match_id: string;
}

interface PredictionWithMatch extends Prediction {
  matchData?: {
    homeTeam: string;
    awayTeam: string;
    homeScore: number | null;
    awayScore: number | null;
    status: string;
    kickoff: string;
  };
}

export function PredictionHistory() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<PredictionWithMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    pending: 0,
    totalPoints: 0,
  });

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
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Since we can't join matches easily, we'll display what we have
      const predictionsData = data || [];
      setPredictions(predictionsData);

      // Calculate stats
      const total = predictionsData.length;
      const correct = predictionsData.filter(p => (p.points_earned || 0) > 0).length;
      const pending = predictionsData.filter(p => p.points_earned === null || p.points_earned === 0).length;
      const totalPoints = predictionsData.reduce((sum, p) => sum + (p.points_earned || 0), 0);

      setStats({ total, correct, pending, totalPoints });
    } catch (error) {
      // Error fetching predictions
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">إجمالي التوقعات</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.correct}</p>
                <p className="text-xs text-muted-foreground">توقعات صحيحة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-upcoming/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-upcoming" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">في الانتظار</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPoints}</p>
                <p className="text-xs text-muted-foreground">إجمالي النقاط</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictions Table */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            سجل التوقعات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم المباراة</TableHead>
                  <TableHead className="text-right">التوقع</TableHead>
                  <TableHead className="text-right">الركنيات</TableHead>
                  <TableHead className="text-right">البطاقات</TableHead>
                  <TableHead className="text-right">النقاط</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">لم تقم بأي توقعات بعد</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  predictions.map((prediction) => (
                    <TableRow key={prediction.id}>
                      <TableCell className="font-mono text-xs">
                        {prediction.match_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-bold">
                          {prediction.predicted_home_score} - {prediction.predicted_away_score}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {prediction.predicted_total_corners ?? "-"}
                      </TableCell>
                      <TableCell>
                        {prediction.predicted_total_cards ?? "-"}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-bold",
                          (prediction.points_earned || 0) > 0 ? "text-primary" : "text-muted-foreground"
                        )}>
                          {prediction.points_earned || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        {prediction.is_paid ? (
                          <span>{prediction.amount_paid} {t.currency}</span>
                        ) : (
                          <Badge variant="secondary">مجاني</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(prediction.created_at).toLocaleDateString('ar-EG')}
                      </TableCell>
                      <TableCell>
                        {(prediction.points_earned || 0) > 0 ? (
                          <Badge variant="default" className="bg-primary gap-1">
                            <CheckCircle className="w-3 h-3" />
                            صحيح
                          </Badge>
                        ) : prediction.points_earned === 0 ? (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="w-3 h-3" />
                            خاطئ
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="w-3 h-3" />
                            في الانتظار
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}