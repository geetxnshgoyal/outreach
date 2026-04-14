"use client";

import { 
  Trophy, 
  User, 
  BarChart3, 
  CheckCircle2,
  ChevronRight
} from "lucide-react";

interface EventStat {
  id: string;
  name: string;
  managerName?: string;
  total: number;
  called: number;
  confirmed: number;
}

export default function EventOverview({ events }: { events: EventStat[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Event Performance
        </h2>
        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md font-mono">
          {events.length} Active Events
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {events.map((event) => {
          const progress = event.total > 0 ? Math.round((event.called / event.total) * 100) : 0;
          
          return (
            <div 
              key={event.id} 
              className="bg-card glass p-5 rounded-2xl border border-border group hover:border-primary/40 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Trophy className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                      <User className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-lg leading-tight mb-1 truncate">{event.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
                   Manager: <span className="text-foreground/80 font-medium">{event.managerName || "Unassigned"}</span>
                </p>

                <div className="mt-auto space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Calling Progress</span>
                    <span className="font-bold">{progress}%</span>
                  </div>
                  
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="bg-background/40 rounded-lg p-2 border border-border/50">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total</p>
                      <p className="text-sm font-bold">{event.total}</p>
                    </div>
                    <div className="bg-background/40 rounded-lg p-2 border border-border/50">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Confirmed</p>
                      <p className="text-sm font-bold text-green-500">{event.confirmed}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
