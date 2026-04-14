import { getParticipants, getEvents } from "@/lib/actions";
import ParticipantTable from "@/components/ParticipantTable";
import EventOverview from "@/components/EventOverview";
import { Users, PhoneCall, CheckCircle2, Clock } from "lucide-react";

export default async function DashboardPage() {
  const participants = await getParticipants({});
  const events = await getEvents();

  // Calculate Global Stats
  const stats = [
    { label: "Total Registrations", value: participants.length, icon: Users, color: "text-blue-500" },
    { label: "Pending Calls", value: participants.filter(p => p.outreachStatus === "PENDING").length, icon: Clock, color: "text-yellow-500" },
    { label: "Total Called", value: participants.filter(p => !["PENDING"].includes(p.outreachStatus)).length, icon: PhoneCall, color: "text-purple-500" },
    { label: "Confirmed Comers", value: participants.filter(p => p.outreachStatus === "WILL_COME").length, icon: CheckCircle2, color: "text-green-500" },
  ];

  // Calculate Event-Specific Stats
  const eventStats = (events as any[]).map(event => {
    const eventParticipants = participants.filter(p => p.eventId === event.id);
    return {
      id: event.id,
      name: event.name,
      managerName: event.managerName,
      total: eventParticipants.length,
      called: eventParticipants.filter(p => !["PENDING"].includes(p.outreachStatus)).length,
      confirmed: eventParticipants.filter(p => p.outreachStatus === "WILL_COME").length,
    };
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-card glass p-6 rounded-3xl border border-border flex items-center gap-4 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 group">
            <div className={`p-4 rounded-2xl bg-background/50 ${s.color} transition-transform group-hover:scale-110`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{s.label}</p>
              <h3 className="text-3xl font-black">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Individual Event Overview Section */}
      <EventOverview events={eventStats} />

      {/* Main Registry Section */}
      <div className="pt-8 border-t border-border/40">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Registration Registry</h2>
            <p className="text-muted-foreground text-sm">Real-time participant database and communication logs.</p>
          </div>
        </div>
        <ParticipantTable initialParticipants={participants} events={events} />
      </div>
    </div>
  );
}
