"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,#09090b_100%)]">
      <div className="w-full max-w-md glass p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text tracking-tight">Outreach Portal</h1>
          <p className="text-muted-foreground">Welcome back. Please login to continue.</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
              placeholder="admin@outreach.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/50 flex justify-between text-xs text-muted-foreground">
          <span>Outreach Team v1.0</span>
          <span>&copy; 2026</span>
        </div>
      </div>
    </div>
  );
}
