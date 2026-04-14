"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="flex w-full items-center gap-3 px-4 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors group"
    >
      <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span>Sign Out</span>
    </button>
  );
}
