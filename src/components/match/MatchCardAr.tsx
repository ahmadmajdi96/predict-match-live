import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, ChevronLeft, Eye } from "lucide-react";
import { translations as t } from "@/lib/translations";

interface Team {
  name: string;
  nameAr?: string;
  logo: string;
  score?: number;
}

interface MatchCardArProps {
  homeTeam: Team;
  awayTeam: Team;
  league: string;
  leagueAr?: string;
  leagueLogo?: string;
  kickoff: string;
  venue?: string;
  status: "upcoming" | "live" | "finished";
  predictionPrice?: number;
  className?: string;
  onPredict?: () => void;
  onViewFormation?: () => void;
}

export function MatchCardAr({
  homeTeam,
  awayTeam,
  league,
  leagueAr,
  leagueLogo,
  kickoff,
  venue,
  status,
  predictionPrice,
  className,
  onPredict,
  onViewFormation,
}: MatchCardArProps) {
  return (
    <div className={cn("match-card group", className)}>
      {/* Status Badge */}
      <div className="absolute top-4 left-4">
        <span
          className={cn(
            status === "live" && "status-live",
            status === "upcoming" && "status-upcoming",
            status === "finished" && "status-finished"
          )}
        >
          {status === "live" ? `● ${t.live}` : status === "upcoming" ? t.upcoming : t.finished}
        </span>
      </div>

      {/* Price Badge */}
      {predictionPrice !== undefined && predictionPrice > 0 && status === "upcoming" && (
        <div className="absolute top-4 right-4">
          <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold">
            {predictionPrice} {t.currency}
          </span>
        </div>
      )}

      {/* League Info */}
      <div className="flex items-center justify-end gap-2 mb-6 mt-4">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {leagueAr || league}
        </span>
        {leagueLogo && (
          <img src={leagueLogo} alt={league} className="w-5 h-5 object-contain" />
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-4">
        {/* Away Team (Right side in RTL) */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-xl bg-secondary/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
            <img
              src={awayTeam.logo}
              alt={awayTeam.nameAr || awayTeam.name}
              className="w-12 h-12 object-contain"
              onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
            />
          </div>
          <span className="font-semibold text-sm leading-tight">{awayTeam.nameAr || awayTeam.name}</span>
        </div>

        {/* Score / VS */}
        <div className="flex flex-col items-center px-4">
          {status === "live" || status === "finished" ? (
            <div className="flex items-center gap-3">
              <span className={cn(
                "text-3xl font-display font-bold",
                status === "live" && "text-live"
              )}>
                {awayTeam.score}
              </span>
              <span className="text-muted-foreground text-lg">-</span>
              <span className={cn(
                "text-3xl font-display font-bold",
                status === "live" && "text-live"
              )}>
                {homeTeam.score}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-display font-bold text-muted-foreground">{t.vs}</span>
            </div>
          )}
          
          {/* Match Time */}
          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
            <span className="text-xs font-medium">{kickoff}</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Home Team (Left side in RTL) */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-xl bg-secondary/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
            <img
              src={homeTeam.logo}
              alt={homeTeam.nameAr || homeTeam.name}
              className="w-12 h-12 object-contain"
              onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
            />
          </div>
          <span className="font-semibold text-sm leading-tight">{homeTeam.nameAr || homeTeam.name}</span>
        </div>
      </div>

      {/* Venue */}
      {venue && (
        <div className="flex items-center justify-center gap-1.5 mt-4 text-muted-foreground">
          <span className="text-xs">{venue}</span>
          <MapPin className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6">
        {onViewFormation && (
          <Button
            variant="glass"
            className="flex-1"
            onClick={onViewFormation}
          >
            <Eye className="w-4 h-4" />
            {t.viewFormation}
          </Button>
        )}
        {status === "upcoming" && onPredict && (
          <Button
            variant="hero"
            className="flex-1"
            onClick={onPredict}
          >
            {t.makePrediction}
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-bl from-primary/5 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}