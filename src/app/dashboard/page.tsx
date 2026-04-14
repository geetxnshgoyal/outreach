import { getParticipants, getEvents } from "@/lib/actions";
import { auth } from "@/auth";
import ParticipantTable from "@/components/ParticipantTable";
import EventOverview from "@/components/EventOverview";
import { Users, PhoneCall, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  try {
    const session = await auth();
    const isAdmin = (session?.user as any)?.role === "ADMIN";
    
    const [participants, events] = await Promise.all([
      getParticipants({}),
      getEvents()
    ]);

    // Calculate Global/Manager-Specific Stats
    const stats = [
      { label: "Total Registrations", value: participants.length, icon: Users, color: "text-blue-400" },
      { label: "Pending Calls", value: participants.filter(p => p.outreachStatus === "PENDING").length, icon: Clock, color: "text-yellow-400" },
      { label: "Total Called", value: participants.filter(p => !["PENDING"].includes(p.outreachStatus)).length, icon: PhoneCall, color: "text-purple-400" },
      { label: "Confirmed Comers", value: participants.filter(p => p.outreachStatus === "WILL_COME").length, icon: CheckCircle2, color: "text-green-400" },
    ];

    // Calculate Event-Specific Stats (Only needed for Admin overview)
    const eventStats = isAdmin ? (events as any[]).map(event => {
      const eventParticipants = participants.filter(p => p.eventId === event.id);
      return {
        id: event.id,
        name: event.name,
        managerName: event.managerName,
        total: eventParticipants.length,
        called: eventParticipants.filter(p => !["PENDING"].includes(p.outreachStatus)).length,
        confirmed: eventParticipants.filter(p => p.outreachStatus === "WILL_COME").length,
      };
    }) : [];

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight gradient-text">
            {isAdmin ? "Administrator Portal" : "Outreach Dashboard"}
          </h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">
            {isAdmin ? "Global Registration & Management" : `Manager: ${session?.user?.name || "Team Member"}`}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-card glass p-6 rounded-3xl border border-border flex items-center gap-4 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 group">
              <div className={`p-4 rounded-2xl bg-background/50 ${s.color} transition-transform group-hover:scale-110`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{s.label}</p>
                <h3 className="text-3xl font-black tabular-nums">{s.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Individual Event Overview Section (ADMIN ONLY) */}
        {isAdmin && <EventOverview events={eventStats} />}

        {/* Main Registry Section */}
        <div className="pt-8 border-t border-border/40">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Registration Registry
              </h2>
              <p className="text-muted-foreground text-xs font-medium">
                {isAdmin 
                  ? "Full database across all events" 
                  : `Showing registrations for ${events[0]?.name || "Assigned Event"}`}
              </p>
            </div>
          </div>
          <ParticipantTable initialParticipants={participants} events={events} />
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("Dashboard Error:", error);
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-card/30 rounded-3xl border border-dashed border-border/50">
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          We couldn't load the dashboard. This is usually due to missing environment variables or a connection issue with the database.
        </p>
        <div className="bg-destructive/10 text-destructive text-xs p-4 rounded-xl font-mono max-w-full overflow-auto">
          {error?.message || "Internal Server Error"}
        </div>
      </div>
    );
  }
}
