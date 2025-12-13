import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { translations as t } from "@/lib/translations";
import { cn } from "@/lib/utils";

interface Player {
  id: string;
  name: string;
  nameAr?: string;
  number: number;
  position: string;
  photo?: string;
}

interface FormationViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeTeam: {
    name: string;
    nameAr?: string;
    logo: string;
    formation: string;
    lineup: Player[];
    substitutes: Player[];
  };
  awayTeam: {
    name: string;
    nameAr?: string;
    logo: string;
    formation: string;
    lineup: Player[];
    substitutes: Player[];
  };
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
    <div className="flex flex-col items-center gap-1">
      <div className={cn(
        "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-bold border-2",
        isHome 
          ? "bg-primary/20 border-primary text-primary" 
          : "bg-accent/20 border-accent text-accent"
      )}>
        {player.number}
      </div>
      <span className="text-[10px] md:text-xs text-center max-w-[60px] truncate">
        {player.nameAr || player.name}
      </span>
    </div>
  );
}

function FormationPitch({ 
  team, 
  isHome 
}: { 
  team: FormationViewProps['homeTeam']; 
  isHome: boolean;
}) {
  const rows = positionRows[team.formation] || [1, 4, 4, 2];
  let playerIndex = 0;

  return (
    <div className="flex-1">
      {/* Team Header */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <img src={team.logo} alt={team.name} className="w-8 h-8" />
        <div className="text-center">
          <h3 className="font-semibold text-sm">{team.nameAr || team.name}</h3>
          <Badge variant="secondary" className="text-xs">{team.formation}</Badge>
        </div>
      </div>

      {/* Formation */}
      <div className={cn(
        "relative rounded-xl p-4 min-h-[300px] md:min-h-[400px] flex flex-col justify-between",
        "bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/20"
      )}>
        {/* Pitch Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/20" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-primary/20" />
          <div className="absolute top-1/4 left-1/4 right-1/4 h-1/2 border border-primary/20 rounded-full" />
        </div>

        {/* Players */}
        <div className={cn(
          "relative flex flex-col gap-4 md:gap-6",
          isHome ? "flex-col" : "flex-col-reverse"
        )}>
          {rows.map((count, rowIndex) => {
            const rowPlayers = team.lineup.slice(playerIndex, playerIndex + count);
            playerIndex += count;
            
            return (
              <div 
                key={rowIndex} 
                className="flex justify-around items-center"
              >
                {rowPlayers.map((player) => (
                  <PlayerCard key={player.id} player={player} isHome={isHome} />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Substitutes */}
      <div className="mt-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-2 text-center">
          {t.substitutes}
        </h4>
        <div className="flex flex-wrap justify-center gap-2">
          {team.substitutes.slice(0, 7).map((player) => (
            <div 
              key={player.id}
              className={cn(
                "px-2 py-1 rounded text-xs border",
                isHome 
                  ? "bg-primary/10 border-primary/30" 
                  : "bg-accent/10 border-accent/30"
              )}
            >
              <span className="font-bold ml-1">{player.number}</span>
              {player.nameAr || player.name.split(' ').pop()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormationView({ open, onOpenChange, homeTeam, awayTeam }: FormationViewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{t.formation}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <FormationPitch team={awayTeam} isHome={false} />
          <FormationPitch team={homeTeam} isHome={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
}