import { auth } from "@/auth";
import { LogOut, User, LayoutDashboard, Upload } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any).role;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold gradient-text">Outreach Portal</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
          >
            <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Dashboard</span>
          </Link>
          
          {role === "ADMIN" && (
            <Link
              href="/dashboard/admin"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
            >
              <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Admin Upload</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user?.email}</p>
              <p className="text-xs text-muted-foreground uppercase">{role}</p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm flex items-center px-8 justify-between">
           <h1 className="text-lg font-semibold capitalize">
             {role === "ADMIN" ? "Administrator Portal" : "Outreach Dashboard"}
           </h1>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
