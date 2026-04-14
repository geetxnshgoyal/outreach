"use client";

import { useState } from "react";
import { updateParticipantStatus } from "@/lib/actions";
import { 
  PhoneCall, 
  UserMinus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreHorizontal, 
  MessageSquare,
  Search,
  Filter
} from "lucide-react";

const STATUS_CONFIG = {
  PENDING: { color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock, label: "Pending" },
  CALLED: { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: PhoneCall, label: "Called" },
  NOT_PICKED: { color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: UserMinus, label: "Not Picked" },
  WILL_COME: { color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle2, label: "Will Come" },
  NOT_INTERESTED: { color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle, label: "Not Interested" },
};

export default function ParticipantTable({ 
  initialParticipants, 
  events 
}: { 
  initialParticipants: any[], 
  events: any[] 
}) {
  const [participants, setParticipants] = useState(initialParticipants);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const filtered = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? p.outreachStatus === statusFilter : true;
    const matchesEvent = eventFilter ? p.eventId === eventFilter : true;
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateParticipantStatus(id, newStatus);
      setParticipants(prev => prev.map(p => p.id === id ? { ...p, outreachStatus: newStatus } : p));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleAddNote = async (id: string) => {
    try {
      await updateParticipantStatus(id, participants.find(p => p.id === id).outreachStatus, notes);
      setParticipants(prev => prev.map(p => p.id === id ? { ...p, notes: notes } : p));
      setEditingId(null);
      setNotes("");
    } catch (err) {
      alert("Failed to add note");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              className="bg-card border border-border rounded-xl pl-10 pr-8 py-2 text-sm outline-none cursor-pointer appearance-none min-w-[140px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([val, conf]) => (
                <option key={val} value={val}>{conf.label}</option>
              ))}
            </select>
          </div>

          <select
            className="bg-card border border-border rounded-xl px-4 py-2 text-sm outline-none cursor-pointer appearance-none min-w-[140px]"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
          >
            <option value="">All Events</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card glass rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Participant</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Event</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((p) => {
                const Config = STATUS_CONFIG[p.outreachStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
                return (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{p.event?.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{p.teamName || "Solo"}</div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      <div>{p.mobile}</div>
                      <div className="truncate max-w-[150px]">{p.organization}</div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${Config.color}`}>
                        <Config.icon className="w-3.5 h-3.5" />
                        {Config.label}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                         <select 
                           className="bg-background border border-border rounded-lg px-2 py-1 text-xs outline-none cursor-pointer"
                           value={p.outreachStatus}
                           onChange={(e) => handleStatusChange(p.id, e.target.value)}
                         >
                           {Object.entries(STATUS_CONFIG).map(([val, conf]) => (
                             <option key={val} value={val}>{conf.label}</option>
                           ))}
                         </select>
                         <button 
                           onClick={() => {
                             setEditingId(p.id);
                             setNotes(p.notes || "");
                           }}
                           className="p-1.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                         >
                           <MessageSquare className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filtered.length === 0 && (
          <div className="p-20 text-center">
            <div className="bg-muted/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No participants found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {/* Note Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl p-6 shadow-2xl scale-in-center">
            <h3 className="text-xl font-bold mb-4">Add Outreach Notes</h3>
            <textarea
              className="w-full h-40 bg-background border border-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="Record any issues, feedback, or confirmed details here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingId(null)}
                className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground font-semibold py-2 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddNote(editingId)}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-xl transition-all"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
