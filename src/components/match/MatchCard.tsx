import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, ChevronRight } from "lucide-react";

interface Team {
  name: string;
  logo: string;
  score?: number;
}

interface MatchCardProps {
  homeTeam: Team;
  awayTeam: Team;
  league: string;
  leagueLogo?: string;
  kickoff: string;
  venue?: string;
  status: "upcoming" | "live" | "finished";
  className?: string;
  onPredict?: () => void;
}

export function MatchCard({
  homeTeam,
  awayTeam,
  league,
  leagueLogo,
  kickoff,
  venue,
  status,
  className,
  onPredict,
}: MatchCardProps) {
  return (
    <div className={cn("match-card group", className)}>
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <span
          className={cn(
            status === "live" && "status-live",
            status === "upcoming" && "status-upcoming",
            status === "finished" && "status-finished"
          )}
        >
          {status === "live" ? "● LIVE" : status === "upcoming" ? "UPCOMING" : "FINISHED"}
        </span>
      </div>

      {/* League Info */}
      <div className="flex items-center gap-2 mb-6">
        {leagueLogo && (
          <img src={leagueLogo} alt={league} className="w-5 h-5 object-contain" />
        )}
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {league}
        </span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-4">
        {/* Home Team */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-xl bg-secondary/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
            <img
              src={homeTeam.logo}
              alt={homeTeam.name}
              className="w-12 h-12 object-contain"
            />
          </div>
          <span className="font-semibold text-sm leading-tight">{homeTeam.name}</span>
        </div>

        {/* Score / VS */}
        <div className="flex flex-col items-center px-4">
          {status === "live" || status === "finished" ? (
            <div className="flex items-center gap-3">
              <span className={cn(
                "text-3xl font-display font-bold",
                status === "live" && "text-live"
              )}>
                {homeTeam.score}
              </span>
              <span className="text-muted-foreground text-lg">-</span>
              <span className={cn(
                "text-3xl font-display font-bold",
                status === "live" && "text-live"
              )}>
                {awayTeam.score}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-display font-bold text-muted-foreground">VS</span>
            </div>
          )}
          
          {/* Match Time */}
          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{kickoff}</span>
          </div>
        </div>

        {/* Away Team */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-xl bg-secondary/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
            <img
              src={awayTeam.logo}
              alt={awayTeam.name}
              className="w-12 h-12 object-contain"
            />
          </div>
          <span className="font-semibold text-sm leading-tight">{awayTeam.name}</span>
        </div>
      </div>

      {/* Venue */}
      {venue && (
        <div className="flex items-center justify-center gap-1.5 mt-4 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs">{venue}</span>
        </div>
      )}

      {/* Action Button */}
      {status === "upcoming" && onPredict && (
        <Button
          variant="hero"
          className="w-full mt-6"
          onClick={onPredict}
        >
          Make Prediction
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}

      {/* Decorative Elements */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
